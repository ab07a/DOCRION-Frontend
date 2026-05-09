import { useState, useCallback } from "react";

let pdfjsLib = null;

function loadPdfJs() {
  return new Promise((resolve) => {
    if (pdfjsLib) return resolve(pdfjsLib);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      pdfjsLib = window.pdfjsLib;
      resolve(pdfjsLib);
    };
    document.head.appendChild(script);
  });
}

export function usePdfLoader() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPdf = useCallback(async (file) => {
    setLoading(true);
    setPdfDoc(null);
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const doc = await lib.getDocument({ data: arrayBuffer }).promise;
    setPdfDoc(doc);
    setNumPages(doc.numPages);
    setLoading(false);
    return doc;
  }, []);

  const reset = useCallback(() => {
    setPdfDoc(null);
    setNumPages(0);
  }, []);

  return { pdfDoc, numPages, loading, loadPdf, reset };
}
