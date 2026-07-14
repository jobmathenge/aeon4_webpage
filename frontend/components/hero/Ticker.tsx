"use client";

import { useEffect, useRef, useState } from "react";
import type { TickerEvent } from "@/lib/types";

const LABELS: Record<string, { cls: string; label: string }> = {
  security: { cls: "t-sec", label: "SEC" },
  bms: { cls: "t-bms", label: "BMS" },
  iot: { cls: "t-iot", label: "IOT" },
};

interface Row {
  key: number;
  ts: string;
  cls: string;
  label: string;
  message: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Ticker({ events }: { events: TickerEvent[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const indexRef = useRef(0);
  const keyRef = useRef(0);

  useEffect(() => {
    if (events.length === 0) return;

    function pushEvent() {
      const now = new Date();
      const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const event = events[indexRef.current % events.length];
      indexRef.current += 1;
      const meta = LABELS[event.category] ?? { cls: "t-sec", label: event.category.toUpperCase() };
      const key = keyRef.current++;
      setRows((prev) => [...prev, { key, ts, cls: meta.cls, label: meta.label, message: event.message }].slice(-5));
    }

    pushEvent();
    pushEvent();
    pushEvent();
    pushEvent();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = setInterval(pushEvent, 2600);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="ticker" aria-label="Simulated live operational event feed">
      <div className="ticker-head">
        <span className="live" />
        LIVE EVENT FABRIC · SIMULATED FEED
      </div>
      <div className="ticker-body">
        {rows.map((row) => (
          <div key={row.key} className={row.cls}>
            [{row.ts}] <b>{row.label}</b> {row.message}
          </div>
        ))}
      </div>
    </div>
  );
}
