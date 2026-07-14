import { getCopilots, getQA, getStats, getTicker } from "@/lib/api";
import Hero from "@/components/hero/Hero";
import StatsBand from "@/components/StatsBand";
import CopilotCards from "@/components/CopilotCards";
import AskCopilotTerminal from "@/components/AskCopilotTerminal";
import StandardsStrip from "@/components/StandardsStrip";
import PlatformFlow from "@/components/PlatformFlow";
import NetworkNodes from "@/components/NetworkNodes";
import ContactSection from "@/components/ContactSection";
import RevealOnScroll from "@/components/RevealOnScroll";

// Forces request-time rendering so the backend doesn't need to be reachable
// at `next build` time (e.g. building the Docker image before the backend
// container exists) — fetch-level caching (`next.revalidate`) still applies.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, copilots, qa, ticker] = await Promise.all([getStats(), getCopilots(), getQA(), getTicker()]);

  return (
    <>
      <Hero copilots={copilots} tickerEvents={ticker} />

      <StatsBand stats={stats} />

      <section id="copilots">
        <RevealOnScroll className="sec-header">
          <span className="eyebrow">The Trinity</span>
          <h2>Three copilots, one shared picture of your operation</h2>
          <p>
            Each copilot is trained for its domain but shares a single asset model and event fabric — so a security
            anomaly, a chiller fault, and a production stall are never three separate stories.
          </p>
        </RevealOnScroll>
        <CopilotCards copilots={copilots} />
      </section>

      <section id="ask">
        <RevealOnScroll className="sec-header" style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
          <span className="eyebrow">Live Console</span>
          <h2>Ask it like you&apos;d ask a colleague</h2>
          <p>No query languages, no dashboard archaeology. Plain questions, evidence-backed answers.</p>
        </RevealOnScroll>
        <AskCopilotTerminal qaByTopic={qa} />
      </section>

      <StandardsStrip />

      <section id="platform">
        <RevealOnScroll className="sec-header">
          <span className="eyebrow">Descent Profile</span>
          <h2>From surface to signal in four depths</h2>
          <p>AeOn4 deploys edge-first: your telemetry never has to leave the site to become intelligence.</p>
        </RevealOnScroll>
        <PlatformFlow />
      </section>

      <section id="network" style={{ paddingTop: "2rem" }}>
        <RevealOnScroll className="sec-header" style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
          <span className="eyebrow">Constellation</span>
          <h2>Built where the plants are</h2>
        </RevealOnScroll>
        <NetworkNodes />
      </section>

      <ContactSection />
    </>
  );
}
