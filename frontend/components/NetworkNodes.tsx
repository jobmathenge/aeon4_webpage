import RevealOnScroll from "./RevealOnScroll";

export default function NetworkNodes() {
  return (
    <RevealOnScroll delay={1} className="nodes">
      <div className="node n-hq">
        <div className="n-pulse" />
        <b>RIYADH</b>
        <span>OPERATIONS</span>
      </div>
      <div className="node-link" />
      <div className="node n-live">
        <div className="n-pulse" />
        <b>NAIROBI</b>
        <span>EDGE NODE · LIVE</span>
      </div>
      <div className="node-link" />
      <div className="node n-next">
        <div className="n-pulse" />
        <b>DUBAI</b>
        <span>NEXT DEPLOYMENT</span>
      </div>
    </RevealOnScroll>
  );
}
