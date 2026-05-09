import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import InputArea from "./InputArea";
import styles from "./ChatPanel.module.css";

export default function ChatPanel({
  messages,
  thinking,
  query,
  sessionId,
  activeChunks,
  selectedChunk,
  onQueryChange,
  onSend,
  onChunkClick,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Ask DOCRION</div>
        <div className={styles.headerSub}>
          {sessionId
            ? `${activeChunks.length} chunks active`
            : "upload a document to begin"}
        </div>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🧠</div>
            <div className={styles.emptyText}>
              Upload a PDF and ask questions.
              <br />
              DOCRION answers strictly from your document.
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            msg={msg}
            selectedChunk={selectedChunk}
            onChunkClick={onChunkClick}
          />
        ))}

        {thinking && (
          <div className={`${styles.msg} ${styles.msgAssistant}`}>
            <span className={styles.msgLabel}>docrion</span>
            <div className={styles.thinking}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <InputArea
        value={query}
        onChange={onQueryChange}
        onSend={onSend}
        disabled={!sessionId || thinking}
      />
    </div>
  );
}
