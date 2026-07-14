import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  {
    depth: "DEPTH 01 · SENSE",
    title: "Passive collection",
    body: "Span-port and broker-level listeners ingest OT traffic and telemetry without touching the process.",
  },
  {
    depth: "DEPTH 02 · MODEL",
    title: "Living asset map",
    body: "Every device, protocol, and conversation is fitted into an ISA-95 namespace and a zone/conduit model.",
  },
  {
    depth: "DEPTH 03 · REASON",
    title: "AI on the edge",
    body: "Domain copilots correlate events across security, buildings, and production — on-prem, air-gap friendly.",
  },
  {
    depth: "DEPTH 04 · ACT",
    title: "Guided response",
    body: "Engineers get evidence-backed narratives and next steps in the language of their plant, not their SIEM.",
  },
] as const;

export default function PlatformFlow() {
  return (
    <div className="flow">
      {STEPS.map((step, i) => (
        <RevealOnScroll key={step.title} delay={i === 0 ? undefined : ((i > 3 ? 3 : i) as 1 | 2 | 3)} className="flow-step">
          <span className="f-depth">{step.depth}</span>
          <h4>{step.title}</h4>
          <p>{step.body}</p>
        </RevealOnScroll>
      ))}
    </div>
  );
}
