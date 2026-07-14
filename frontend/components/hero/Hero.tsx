"use client";

import { useEffect, useRef, useState } from "react";
import type { Copilot, TickerEvent } from "@/lib/types";
import Ticker from "./Ticker";

const PHOTOS: Record<string, string> = {
  bms: "https://images.unsplash.com/photo-1757688348857-25d9d6972b18?q=75&w=1920&auto=format&fit=crop",
  iot: "https://images.unsplash.com/photo-1567789884554-0b844b597180?q=75&w=1920&auto=format&fit=crop",
};

const SECTORS = [
  {
    id: "security",
    order: "01",
    ariaLabel: "Security Copilot",
    icon: "i-shield",
    iconX: 386,
    iconY: 100,
    tagX: 398,
    tagY: 146,
    labelX: 398,
    label1Y: 168,
    label2Y: 188,
    arcGlow: "M300,300 L300,60 A240,240 0 0,1 507.8,180 Z",
    arc: "M300,300 L300,88 A212,212 0 0,1 483.6,194 Z",
    arcGlowFill: "rgba(34,211,238,.10)",
  },
  {
    id: "iot",
    order: "03",
    ariaLabel: "Production IoT Copilot",
    icon: "i-factory",
    iconX: 288,
    iconY: 414,
    tagX: 300,
    tagY: 460,
    labelX: 300,
    label1Y: 482,
    label2Y: 502,
    arcGlow: "M300,300 L507.8,420 A240,240 0 0,1 92.2,420 Z",
    arc: "M300,300 L483.6,406 A212,212 0 0,1 116.4,406 Z",
    arcGlowFill: "rgba(245,165,36,.08)",
  },
  {
    id: "bms",
    order: "02",
    ariaLabel: "BMS Copilot",
    icon: "i-building",
    iconX: 184,
    iconY: 200,
    tagX: 196,
    tagY: 246,
    labelX: 196,
    label1Y: 268,
    label2Y: 288,
    arcGlow: "M300,300 L92.2,420 A240,240 0 0,1 300,60 Z",
    arc: "M300,300 L116.4,406 A212,212 0 0,1 300,88 Z",
    arcGlowFill: "rgba(45,212,191,.09)",
  },
] as const;

function multiline(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export default function Hero({ copilots, tickerEvents }: { copilots: Copilot[]; tickerEvents: TickerEvent[] }) {
  const [activeId, setActiveId] = useState(() => copilots.find((c) => c.id === "security")?.id ?? copilots[0]?.id);
  const [displayId, setDisplayId] = useState(activeId);
  const [swapping, setSwapping] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayId(activeId);
      return;
    }
    setSwapping(true);
    const timer = setTimeout(() => {
      setDisplayId(activeId);
      setSwapping(false);
    }, 420);
    return () => clearTimeout(timer);
  }, [activeId]);

  const active = copilots.find((c) => c.id === activeId) ?? copilots[0];
  const display = copilots.find((c) => c.id === displayId) ?? active;

  if (!active || !display) return null;

  function select(id: string) {
    setActiveId(id);
  }

  return (
    <header className="hero">
      <div className="scenes" aria-hidden="true">
        {copilots.map((copilot) => (
          <div key={copilot.id} className={`scene s-${copilot.id}${copilot.id === activeId ? " on" : ""}`}>
            {PHOTOS[copilot.id] && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="scene-img" src={PHOTOS[copilot.id]} alt="" decoding="async" />
                <div className={`scene-tint t-${copilot.id}`} />
              </>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scene-svg" src={`/scenes/${copilot.id}.svg`} alt="" aria-hidden="true" />
          </div>
        ))}
        <div className="scene-veil" />
      </div>

      <div className={`giant${swapping ? " swap" : ""}`} aria-hidden="true">
        {display.heroWord}
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Secure, AI-Enabled Spaces and Production</span>
          <h1>
            Three copilots.
            <br />
            One <em>operational deep</em>.
          </h1>
          <p>
            AeOn4.AI puts AI-native copilots inside your plant floor, your building systems, and your production
            network — watching protocols, assets, and anomalies the way sonar watches the deep: continuously,
            quietly, and in real time.
          </p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="#contact">
              REQUEST A PILOT
            </a>
            <a className="btn btn-ghost" href="#ask">
              ASK THE COPILOT ↓
            </a>
          </div>

          <Ticker events={tickerEvents} />
        </div>

        <div className="hub-col">
          <div className="hub-wrap">
            <svg
              className="hub"
              viewBox="0 0 600 600"
              role="img"
              aria-label="AeOn4 radial hub showing three copilots: Security, BMS, and Production IoT"
            >
              <defs>
                <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(34,211,238,0)" />
                  <stop offset="100%" stopColor="rgba(34,211,238,.35)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle className="core-ring" cx="300" cy="300" r="285" strokeDasharray="2 6" />
              <circle className="core-ring" cx="300" cy="300" r="205" />
              <circle className="core-ring" cx="300" cy="300" r="118" strokeDasharray="1 5" />

              <circle className="ping" cx="300" cy="300" r="270" fill="none" stroke="rgba(34,211,238,.5)" strokeWidth="1.5" />
              <circle className="ping p2" cx="300" cy="300" r="270" fill="none" stroke="rgba(45,212,191,.4)" strokeWidth="1" />

              <g className="sweep">
                <path d="M300,300 L300,20 A280,280 0 0,1 445,66 Z" fill="url(#sweepGrad)" />
                <line x1="300" y1="300" x2="300" y2="20" stroke="rgba(34,211,238,.6)" strokeWidth="1.5" />
              </g>

              <circle className="blip" cx="345" cy="128" r="3.5" fill="var(--sonar)" style={{ animationDelay: ".35s" }} />
              <circle className="blip" cx="430" cy="230" r="3" fill="var(--sonar)" style={{ animationDelay: "1.6s" }} />
              <circle className="blip" cx="415" cy="405" r="3.5" fill="var(--beacon)" style={{ animationDelay: "3.4s" }} />
              <circle className="blip" cx="255" cy="455" r="3" fill="var(--beacon)" style={{ animationDelay: "4.9s" }} />
              <circle className="blip" cx="150" cy="345" r="3.5" fill="var(--biolum)" style={{ animationDelay: "6.3s" }} />
              <circle className="blip" cx="185" cy="185" r="3" fill="var(--biolum)" style={{ animationDelay: "7.8s" }} />

              {SECTORS.map((sector) => {
                const copilot = copilots.find((c) => c.id === sector.id);
                if (!copilot) return null;
                const isActive = sector.id === activeId;
                const label1 = copilot.title.replace(" Copilot", "");
                return (
                  <g
                    key={sector.id}
                    className={`sector${isActive ? " active" : ""}`}
                    data-id={sector.id}
                    tabIndex={0}
                    role="button"
                    aria-label={sector.ariaLabel}
                    onMouseEnter={() => select(sector.id)}
                    onClick={() => select(sector.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(sector.id);
                      }
                    }}
                  >
                    <path className="arc-glow" d={sector.arcGlow} fill={sector.arcGlowFill} filter="url(#glow)" />
                    <path className="arc" d={sector.arc} />
                    <use href={`#${sector.icon}`} className="sec-ico" x={sector.iconX} y={sector.iconY} width="24" height="24" />
                    <text className="sec-tag" x={sector.tagX} y={sector.tagY} textAnchor="middle">
                      {sector.order} · {copilot.heroWord}
                    </text>
                    <text className="sec-label" x={sector.labelX} y={sector.label1Y} textAnchor="middle">
                      {label1}
                    </text>
                    <text className="sec-label" x={sector.labelX} y={sector.label2Y} textAnchor="middle">
                      Copilot
                    </text>
                  </g>
                );
              })}

              <circle className="core" cx="300" cy="300" r="76" />
              <g className="core-ring-spin">
                <use href="#aeon4ring" x="234" y="234" width="132" height="132" />
              </g>
              <text className="core-text" x="300" y="297" textAnchor="middle">
                AeOn4
              </text>
              <text className="core-sub" x="300" y="315" textAnchor="middle">
                CORE · AI
              </text>
            </svg>
          </div>

          <div className="readout" aria-live="polite">
            <div className="r-head">
              <span
                className="r-dot"
                style={{ background: `var(--${active.accentColor})`, boxShadow: `0 0 10px var(--${active.accentColor})` }}
              />
              <svg className="r-ico" style={{ color: `var(--${active.accentColor})` }}>
                <use href={`#${active.icon}`} />
              </svg>
              <h3>{active.title}</h3>
            </div>
            <p>{active.heroDescription}</p>
            <span className="r-proto">{active.protocolBadge}</span>
          </div>
        </div>
      </div>

      <div className={`chips${swapping ? " swap" : ""}`} aria-hidden="true">
        <div className="chipcard">
          <b>{display.chip1Value}</b>
          <span>{multiline(display.chip1Label)}</span>
        </div>
        <div className="chipcard">
          <b>{display.chip2Value}</b>
          <span>{multiline(display.chip2Label)}</span>
        </div>
      </div>

      <a className="pill-cta" href="#contact">
        Request a pilot <i>→</i>
      </a>
      <div className="hero-tag">
        WHERE OPERATIONS
        <br />
        FIND THEIR
        <br />
        COPILOT
      </div>
    </header>
  );
}
