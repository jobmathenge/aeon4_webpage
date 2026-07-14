import type { Copilot } from "@/lib/types";
import Card from "./Card";
import RevealOnScroll from "./RevealOnScroll";

export default function CopilotCards({ copilots }: { copilots: Copilot[] }) {
  return (
    <div className="cards">
      {copilots.map((copilot, i) => (
        <RevealOnScroll key={copilot.id} delay={((i + 1) as 1 | 2 | 3)}>
          <Card accentVar={copilot.accentColor}>
            <div className="icon-tile">
              <svg>
                <use href={`#${copilot.icon}`} />
              </svg>
            </div>
            <span className="c-tag">{copilot.tag}</span>
            <h3>{copilot.title}</h3>
            <p style={{ color: "var(--foam)", fontSize: ".95rem", marginBottom: ".5rem" }}>
              {copilot.cardSubtitle}
            </p>
            <p>{copilot.cardDescription}</p>
            <ul>
              {copilot.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </Card>
        </RevealOnScroll>
      ))}
    </div>
  );
}
