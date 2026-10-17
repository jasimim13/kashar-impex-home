"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { engagements } from "@/lib/content";
import { prefillEnquiry } from "@/lib/prefill";
import { CheckIcon } from "./Icons";

const spring = { type: "spring", bounce: 0, visualDuration: 0.3 } as const;

export default function Engagement() {
  const [selected, setSelected] = useState<string>(engagements[0].id);
  const reduce = useReducedMotion();
  const index = engagements.findIndex((e) => e.id === selected);
  const current = engagements[index];

  return (
    <section id="ways-to-work" className="section ways" aria-labelledby="ways-title">
      <div className="ways__card">
        <div className="ways__head">
          <h2 id="ways-title" className="title">
            Two ways to work with us.
          </h2>
          <p className="section__lede">
            Choose how much of the job you want to hand over. Both come with the same engineering team.
          </p>
        </div>

        <div className="segmented" role="tablist" aria-label="Contract type">
          {engagements.map((e) => (
            <button
              key={e.id}
              type="button"
              role="tab"
              id={`tab-${e.id}`}
              aria-selected={selected === e.id}
              aria-controls="ways-panel"
              className="segmented__option"
              onClick={() => setSelected(e.id)}
            >
              {selected === e.id && (
                <motion.span
                  layoutId="segmented-thumb"
                  className="segmented__thumb"
                  transition={reduce ? { duration: 0 } : spring}
                />
              )}
              <span className="segmented__label">{e.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={current.id}
          id="ways-panel"
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          className="ways__panel"
          // The panel arrives from the side of the option you picked.
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: index === 0 ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reduce ? { duration: 0.2 } : spring}
        >
          <div>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
          </div>
          <ul className="check-list">
            {current.points.map((point) => (
              <li key={point}>
                <CheckIcon className="check-list__icon" />
                {point}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => prefillEnquiry({ message: `I would like a quote for a ${current.title.toLowerCase()}.` })}
          >
            {current.cta}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
