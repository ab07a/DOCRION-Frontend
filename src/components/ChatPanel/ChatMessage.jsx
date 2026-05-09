import ChunkPill from "./ChunkPill";
import styles from "./ChatPanel.module.css";

export default function ChatMessage({ msg, selectedChunk, onChunkClick }) {
  const isUser = msg.role === "user";

  return (
    <div className={`${styles.msg} ${isUser ? styles.msgUser : styles.msgAssistant}`}>
      <span className={styles.msgLabel}>{isUser ? "you" : "docrion"}</span>
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
        {msg.content}
      </div>
      {msg.chunks?.length > 0 && (
        <div className={styles.chunksRow}>
          {msg.chunks.map((chunk, i) => (
            <ChunkPill
              key={i}
              chunk={chunk}
              index={i}
              isActive={selectedChunk === i}
              onClick={onChunkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
