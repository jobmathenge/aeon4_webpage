import type { Stat } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";

export default function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section style={{ paddingTop: 0, paddingBottom: "3.5rem" }}>
      <RevealOnScroll className="stats">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}
