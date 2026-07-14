"use client";

import { useEffect, useRef, useState } from "react";
import type { QAByTopic } from "@/lib/types";

const TOPIC_ORDER = ["security", "bms", "iot"] as const;
const CHIP_LABELS: Record<string, string> = {
  security: "SECURITY",
  bms: "BMS",
  iot: "PRODUCTION IOT",
};

export default function AskCopilotTerminal({ qaByTopic }: { qaByTopic: QAByTopic }) {
  const [topic, setTopic] = useState<string>("security");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionCursor, setQuestionCursor] = useState(false);
  const [answerCursor, setAnswerCursor] = useState(false);

  const tokenRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const startedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const runTopicRef = useRef<(topicId: string) => void>(() => {});

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    function typeInto(
      text: string,
      speed: number,
      token: number,
      setText: (v: string) => void,
      setCursor: (v: boolean) => void,
      onDone: () => void,
    ) {
      if (reducedMotionRef.current) {
        setText(text);
        setCursor(false);
        onDone();
        return;
      }
      setText("");
      setCursor(true);
      let i = 0;
      function step() {
        if (tokenRef.current !== token) return;
        if (i < text.length) {
          i += 1;
          setText(text.slice(0, i));
          setTimeout(step, speed);
        } else {
          setCursor(false);
          onDone();
        }
      }
      step();
    }

    function runTopic(topicId: string) {
      setTopic(topicId);
      tokenRef.current += 1;
      const token = tokenRef.current;
      const pair = qaByTopic[topicId]?.[0];
      if (!pair) return;
      setAnswer("");
      setAnswerCursor(false);
      typeInto(pair.question, 34, token, setQuestion, setQuestionCursor, () => {
        setTimeout(() => {
          if (tokenRef.current !== token) return;
          typeInto(pair.answer, 10, token, setAnswer, setAnswerCursor, () => {
            setTimeout(() => {
              if (tokenRef.current !== token) return;
              const next = TOPIC_ORDER[(TOPIC_ORDER.indexOf(topicId as (typeof TOPIC_ORDER)[number]) + 1) % TOPIC_ORDER.length];
              runTopic(next);
            }, 6500);
          });
        }, 400);
      });
    }

    // Expose for the chip click handlers below (same closure, avoids prop-drilling refs).
    runTopicRef.current = runTopic;

    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            runTopic("security");
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [qaByTopic]);

  return (
    <>
      <div className="term" ref={containerRef}>
        <div className="term-bar">
          <i />
          <i />
          <i />
          <span>AEON4 CONSOLE · EDGE NODE</span>
        </div>
        <div className="term-body">
          <div className="term-q">
            {question}
            {questionCursor && <span className="cursor" />}
          </div>
          <div className="term-a" style={{ whiteSpace: "pre-wrap" }}>
            {answer}
            {answerCursor && <span className="cursor" />}
          </div>
        </div>
      </div>
      <div className="term-chips">
        {TOPIC_ORDER.map((t) => (
          <button
            key={t}
            className={`chip c-${t === "security" ? "sec" : t}${topic === t ? " on" : ""}`}
            data-t={t}
            onClick={() => runTopicRef.current(t)}
          >
            {CHIP_LABELS[t]}
          </button>
        ))}
      </div>
    </>
  );
}
