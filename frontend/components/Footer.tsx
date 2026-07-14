export default function Footer() {
  return (
    <footer>
      <a className="wordmark" href="#" style={{ fontSize: ".85rem" }}>
        <svg className="ring-svg" viewBox="0 0 100 100" style={{ width: 24, height: 24 }} aria-hidden="true">
          <use href="#aeon4ring" />
        </svg>
        AeOn<b>4</b>.AI
      </a>
      <span className="mono">SECURE, AI-ENABLED SPACES AND PRODUCTION · RIYADH — NAIROBI — DUBAI</span>
      <span className="mono">© 2026 AEON4.AI</span>
    </footer>
  );
}
