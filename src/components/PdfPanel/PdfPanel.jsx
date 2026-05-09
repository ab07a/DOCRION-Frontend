import { useRef } from 'react';
import DropZone from './DropZone';
import PdfPage from './PdfPage';
import { groupHighlightsByPage } from '../../utils/highlights';
import styles from './PdfPanel.module.css';

export default function PdfPanel({
  pdfDoc,
  numPages,
  uploading,
  fileName,
  activeChunks,
  pageRefs,
  onFile,
}) {
  const fileInputRef = useRef(null);
  const highlightsByPage = groupHighlightsByPage(activeChunks);

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>document</span>
        {fileName && <span className={styles.fileName}>{fileName}</span>}
        {!pdfDoc && !uploading && (
          <button
            className={styles.openBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            open pdf
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => onFile(e.target.files[0])}
        />
      </div>

      <div className={styles.viewer}>
        {!pdfDoc && !uploading && <DropZone onFile={onFile} />}

        {uploading && (
          <div className={styles.uploadingOverlay}>
            <div className={styles.spinner} />
            <span className={styles.uploadingText}>processing document...</span>
          </div>
        )}

        {pdfDoc && !uploading && (
          <div className={styles.pagesContainer}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <div
                  key={pageNum}
                  ref={(el) => {
                    pageRefs.current[pageNum] = el;
                  }}
                >
                  <PdfPage
                    pdfDoc={pdfDoc}
                    pageNum={pageNum}
                    scale={1.4}
                    highlights={highlightsByPage[pageNum] || []}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
