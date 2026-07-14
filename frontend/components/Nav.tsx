import NavScrollEffects from "./NavScrollEffects";

export default function Nav() {
  return (
    <nav id="nav">
      <NavScrollEffects />
      <a className="wordmark" href="#">
        <svg className="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
          <use href="#aeon4ring" />
        </svg>
        AeOn<b>4</b>.AI
      </a>
      <div className="nav-links">
        <a href="#copilots">Copilots</a>
        <a href="#ask">Ask AeOn4</a>
        <a href="#platform">Platform</a>
        <a href="#network">Network</a>
        <a className="nav-cta" href="#contact">
          REQUEST ACCESS
        </a>
      </div>
    </nav>
  );
}
