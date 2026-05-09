import styles from "./Navbar.module.css";

export default function Navbar({ sessionId }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        DOC<span>RION</span>
      </div>
      <div className={styles.status}>
        <div className={`${styles.dot} ${sessionId ? styles.dotActive : ""}`} />
        {sessionId ? `session · ${sessionId.slice(0, 8)}` : "no session"}
      </div>
    </nav>
  );
}
