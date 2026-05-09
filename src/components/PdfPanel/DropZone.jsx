import { useRef, useState } from "react";
import styles from "./PdfPanel.module.css";

export default function DropZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") onFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className={styles.dropIcon}>📄</div>
      <div className={styles.dropTitle}>Drop your PDF here</div>
      <div className={styles.dropSub}>
        Supports text-based and scanned documents via OCR pipeline
      </div>
      <button
        className={styles.dropBtn}
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      >
        browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}
