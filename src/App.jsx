import { useState, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import PdfPanel from "./components/PdfPanel/PdfPanel";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import { usePdfLoader } from "./hooks/usePdfLoader";
import { uploadPdf, queryDocument } from "./api/endpoints";
import "./styles/globals.css";
import styles from "./App.module.css";

export default function App() {
  const { pdfDoc, numPages, loading, loadPdf } = usePdfLoader();
  const [fileName, setFileName] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [thinking, setThinking] = useState(false);
  const [activeChunks, setActiveChunks] = useState([]);
  const [selectedChunk, setSelectedChunk] = useState(null);
  const [pdfPath, setPdfPath] = useState("");
  const [pathSubmitted, setPathSubmitted] = useState(false);
  const pageRefs = useRef({});

  const handleFile = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") return;
    setFileName(file.name);
    setUploading(true);
    setMessages([]);
    setActiveChunks([]);
    setSelectedChunk(null);
    setSessionId(null);
  
    await loadPdf(file);
  
    try {
      const data = await uploadPdf(file);
      setSessionId(data.session_id);
      setMessages([{
        role: "assistant",
        content: `Document loaded. Ask me anything about it.`,
        chunks: [],
      }]);
    } catch {
      setMessages([{
        role: "assistant",
        content: "Upload failed. Make sure backend is running.",
        chunks: [],
      }]);
    }
  
    setUploading(false);
  }, [loadPdf]);

  const handlePathSubmit = useCallback(async () => {
    if (!pdfPath.trim()) return;
    setUploading(true);
    setMessages([]);
    setActiveChunks([]);
    setSelectedChunk(null);
    setSessionId(null);
    setPathSubmitted(true);

    try {
      const data = await uploadPdf(pdfPath.trim());
      setSessionId(data.session_id);
      setMessages([{
        role: "assistant",
        content: `Document processed — ${numPages} page${numPages > 1 ? "s" : ""}. Ask me anything about it.`,
        chunks: [],
      }]);
    } catch {
      setMessages([{
        role: "assistant",
        content: "Upload failed. Check the path and make sure backend is running.",
        chunks: [],
      }]);
    }

    setUploading(false);
  }, [pdfPath, numPages]);

  const handleSend = useCallback(async () => {
    const q = query.trim();
    if (!q || !sessionId || thinking) return;

    setQuery("");
    setMessages((prev) => [...prev, { role: "user", content: q, chunks: [] }]);
    setThinking(true);
    setActiveChunks([]);
    setSelectedChunk(null);

    try {
      const data = await queryDocument(sessionId, q);
      const chunks = data.chunks || [];
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer, chunks }]);
      setActiveChunks(chunks);
      if (chunks.length > 0) {
        const firstPage = chunks[0].page;
        pageRefs.current[firstPage]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Error reaching backend.",
        chunks: [],
      }]);
    }

    setThinking(false);
  }, [query, sessionId, thinking]);

  const handleChunkClick = useCallback((chunk, index) => {
    setSelectedChunk(index);
    pageRefs.current[chunk.page]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className={styles.app}>
      <Navbar sessionId={sessionId} />
      <div className={styles.main}>
        <PdfPanel
          pdfDoc={pdfDoc}
          numPages={numPages}
          uploading={uploading || loading}
          fileName={fileName}
          activeChunks={activeChunks}
          pageRefs={pageRefs}
          onFile={handleFile}
          pdfPath={pdfPath}
          onPdfPathChange={setPdfPath}
          onPathSubmit={handlePathSubmit}
          pathSubmitted={pathSubmitted}
          sessionId={sessionId}
        />
        <ChatPanel
          messages={messages}
          thinking={thinking}
          query={query}
          sessionId={sessionId}
          activeChunks={activeChunks}
          selectedChunk={selectedChunk}
          onQueryChange={setQuery}
          onSend={handleSend}
          onChunkClick={handleChunkClick}
        />
      </div>
    </div>
  );
}