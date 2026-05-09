import { useEffect, useRef, useState } from 'react';
import { getHighlightBoxes } from '../../utils/highlights';
import styles from './PdfPanel.module.css';

export default function PdfPage({ pdfDoc, pageNum, scale, highlights }) {
  const canvasRef = useRef(null);
  const [pageDims, setPageDims] = useState(null);

  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    pdfDoc.getPage(pageNum).then((page) => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale });
      const origViewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageDims({
        width: viewport.width,
        height: viewport.height,
        origWidth: origViewport.width,
        origHeight: origViewport.height,
      });
      page.render({ canvasContext: canvas.getContext('2d'), viewport });
    });

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, scale]);

  return (
    <div className={styles.pageWrapper} style={{ width: pageDims?.width }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <span className={styles.pageLabel}>pg {pageNum}</span>
      {pageDims &&
        highlights.map((chunk, ci) => {
          const boxes = getHighlightBoxes(chunk, pageDims);
          return boxes.map((pos, bi) => (
            <div
              key={`${ci}-${bi}`}
              className={styles.highlightBox}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
              }}
            />
          ));
        })}
    </div>
  );
}
