import styles from "./ChatPanel.module.css";

export default function ChunkPill({ chunk, index, isActive, onClick }) {
  return (
    <div
      className={`${styles.chunkPill} ${isActive ? styles.chunkPillActive : ""}`}
      onClick={() => onClick(chunk, index)}
    >
      <span className={`${styles.badge} ${chunk.type === "table_row" ? styles.badgeTable : styles.badgeText}`}>
        {chunk.type === "table_row" ? "table" : "text"}
      </span>
      pg {chunk.page} · {chunk.content?.slice(0, 38)}...
      <span className={styles.chunkScore}>{chunk.score?.toFixed(2)}</span>
    </div>
  );
}
