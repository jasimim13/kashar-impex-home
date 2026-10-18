"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { work, workCategories } from "@/lib/content";
import type { WorkItem } from "@/lib/content";
import { prefillEnquiry } from "@/lib/prefill";
import { ChevronIcon } from "./Icons";

const spring = { type: "spring", bounce: 0, visualDuration: 0.5 } as const;

// Lower-case a label for use mid-sentence, keeping abbreviations such as PCC and LCD as written.
const inSentence = (label: string) =>
  label
    .split(" ")
    .map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(" ");

export default function WorkGrid() {
  const reduce = useReducedMotion();

  // Each category's grid rises in once, card after card, the first time it scrolls into view.
  const grid = { hidden: {}, shown: { transition: { staggerChildren: reduce ? 0 : 0.07 } } };
  const card = reduce
    ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.25 } } }
    : { hidden: { opacity: 0, y: 28, scale: 0.97 }, shown: { opacity: 1, y: 0, scale: 1, transition: spring } };

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="section__head">
        <h2 id="work-title" className="title">
          Our work.
        </h2>
        <p className="section__lede">
          Real projects, photographed on site, by type of work. Switch between the stages on each one.
        </p>
      </div>

      <div className="work-sections">
        {workCategories.map((c) => {
          const items = work.filter((w) => w.category === c.id);
          const ask = () => prefillEnquiry({ message: `I need ${inSentence(c.label)} work.` });
          return (
            <section key={c.id} id={`work-${c.id}`} className="work-category" aria-labelledby={`work-${c.id}-title`}>
              <div className="work-category__head">
                <h3 id={`work-${c.id}-title`}>{c.label}</h3>
                <button type="button" className="text-btn" onClick={ask}>
                  Ask about {inSentence(c.label)}
                  <ChevronIcon className="text-btn__icon" />
                </button>
              </div>
              <motion.div
                className="work-grid"
                variants={grid}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.15 }}
              >
                {items.map((item) => (
                  <motion.div key={item.id} variants={card}>
                    <WorkCard item={item} />
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <motion.p className="work-empty" variants={card}>
                    Photos coming soon.
                  </motion.p>
                )}
              </motion.div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  // Stages open on the finished state (the toggle goes back to how it started); galleries open on the first photo.
  const count = item.views.length;
  const [view, setView] = useState(item.gallery ? 0 : count - 1);
  const step = (d: number) => setView((v) => (v + d + count) % count);
  return (
    <article className="project-card">
      <div className="project-card__media">
        {item.views.map((v, i) => (
          <Image
            key={v.src}
            src={v.src}
            alt={v.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 380px"
            draggable={false}
            className={i === view ? "is-shown" : undefined}
            aria-hidden={i === view ? undefined : true}
          />
        ))}
        {item.gallery && count > 1 && (
          <div className="gallery-nav" role="group" aria-label={`${item.title} photos`}>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)}>
              <ChevronIcon dir="left" />
            </button>
            <span aria-live="polite">
              {view + 1} / {count}
            </span>
            <button type="button" aria-label="Next photo" onClick={() => step(1)}>
              <ChevronIcon />
            </button>
          </div>
        )}
        {!item.gallery && count > 1 && (
          <div className="view-toggle" role="group" aria-label={`${item.title} photos`}>
            {item.views.map((v, i) => (
              <button key={v.label} type="button" aria-pressed={i === view} onClick={() => setView(i)}>
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="project-card__body">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <button
          type="button"
          className="text-btn"
          onClick={() => prefillEnquiry({ message: `I need work like this: ${item.title.toLowerCase()}.` })}
        >
          Ask about work like this
          <ChevronIcon className="text-btn__icon" />
        </button>
      </div>
    </article>
  );
}
