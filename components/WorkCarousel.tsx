"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { recentWork } from "@/lib/content";
import type { WorkItem } from "@/lib/content";
import { prefillEnquiry } from "@/lib/prefill";
import { ChevronIcon } from "./Icons";

/** Apple's momentum projection: where a flick would come to rest. */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past an edge, instead of a hard stop. */
function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

const nearestIndex = (points: number[], value: number) =>
  points.reduce((best, p, i) => (Math.abs(p - value) < Math.abs(points[best] - value) ? i : best), 0);

type DragState = {
  id: number;
  originX: number;
  originY: number;
  startX: number;
  startPos: number;
  engaged: boolean;
  history: { t: number; x: number }[];
};

export default function WorkCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();

  const [snaps, setSnaps] = useState<number[]>([0]);
  const [active, setActive] = useState(0);
  const snapsRef = useRef(snaps);
  snapsRef.current = snaps;

  const drag = useRef<DragState | null>(null);
  const didDrag = useRef(false);

  const settle = useCallback(
    (target: number, velocity = 0, momentum = false) => {
      if (reduce) {
        x.set(target);
        return;
      }
      // Critically damped by default; a little bounce only when a flick carried momentum.
      animate(x, target, { type: "spring", velocity, bounce: momentum ? 0.15 : 0, visualDuration: 0.4 });
    },
    [reduce, x]
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const first = cards[0].offsetLeft;
    const points = Array.from(new Set(cards.map((c) => -Math.min(c.offsetLeft - first, max))));
    setSnaps(points);
    x.set(points[nearestIndex(points, x.get())]);
  }, [x]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useMotionValueEvent(x, "change", (v) => setActive(nearestIndex(snapsRef.current, v)));

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    x.stop(); // grab it mid-flight, from where it is on screen right now
    didDrag.current = false;
    drag.current = {
      id: e.pointerId,
      originX: e.clientX,
      originY: e.clientY,
      startX: e.clientX,
      startPos: x.get(),
      engaged: false,
      history: [{ t: e.timeStamp, x: e.clientX }],
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.originX;
    const dy = e.clientY - d.originY;

    if (!d.engaged) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // hysteresis before committing
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical intent: let the page scroll and put the carousel back to rest.
        drag.current = null;
        settle(snapsRef.current[nearestIndex(snapsRef.current, x.get())]);
        return;
      }
      d.engaged = true;
      didDrag.current = true;
      d.startX = e.clientX;
      d.startPos = x.get();
      viewportRef.current?.setPointerCapture(e.pointerId);
    }

    const points = snapsRef.current;
    const min = points[points.length - 1];
    const width = viewportRef.current?.clientWidth ?? 1000;
    const raw = d.startPos + (e.clientX - d.startX);
    let next = raw;
    if (raw > 0) next = rubberband(raw, width);
    else if (raw < min) next = min + rubberband(raw - min, width);
    x.set(next);

    d.history.push({ t: e.timeStamp, x: e.clientX });
    while (d.history.length > 2 && e.timeStamp - d.history[0].t > 100) d.history.shift();
  };

  const release = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.engaged) return;

    const h = d.history;
    const last = h[h.length - 1];
    const first = h[0];
    const dt = last.t - first.t;
    // If the finger paused before lifting, there is no momentum to carry.
    const velocity = dt > 0 && e.timeStamp - last.t < 80 ? ((last.x - first.x) / dt) * 1000 : 0;

    const points = snapsRef.current;
    const projected = x.get() + project(velocity);
    const target = points[nearestIndex(points, projected)];
    settle(target, velocity, Math.abs(velocity) > 400);
  };

  const step = (dir: 1 | -1) => {
    const points = snapsRef.current;
    const i = Math.min(points.length - 1, Math.max(0, nearestIndex(points, x.get()) + dir));
    settle(points[i]);
  };

  const focusCard = (i: number) => {
    const points = snapsRef.current;
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    const first = (track.children[0] as HTMLElement).offsetLeft;
    const target = -(card.offsetLeft - first);
    settle(points[nearestIndex(points, target)]);
  };

  return (
    <section id="work" className="section projects" aria-labelledby="work-title">
      <div className="section__head projects__head">
        <div>
          <h2 id="work-title" className="title">
            Recent work by our team.
          </h2>
          <p className="section__lede">
            Real projects, photographed on site. Switch between the stages on each one, and swipe for more.
          </p>
        </div>
        <div className="carousel-controls" role="group" aria-label="Scroll recent work">
          <button
            type="button"
            className="round-btn"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous project"
          >
            <ChevronIcon dir="left" />
          </button>
          <button
            type="button"
            className="round-btn"
            onClick={() => step(1)}
            disabled={active >= snaps.length - 1}
            aria-label="Next project"
          >
            <ChevronIcon />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onClickCapture={(e) => {
          if (didDrag.current) {
            e.preventDefault();
            e.stopPropagation();
            didDrag.current = false;
          }
        }}
      >
        <motion.div ref={trackRef} className="carousel__track" style={{ x }}>
          {recentWork.map((item, i) => (
            <WorkCard key={item.id} item={item} onFocus={() => focusCard(i)} />
          ))}
        </motion.div>
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {snaps.map((_, i) => (
          <span key={i} className={i === active ? "is-active" : undefined} />
        ))}
      </div>
    </section>
  );
}

function WorkCard({ item, onFocus }: { item: WorkItem; onFocus: () => void }) {
  // Show the finished state first; the toggle goes back to how it started.
  const [view, setView] = useState(item.views.length - 1);
  return (
    <article className="project-card" onFocus={onFocus}>
      <div className="project-card__media">
        {item.views.map((v, i) => (
          <Image
            key={v.src}
            src={v.src}
            alt={v.alt}
            fill
            sizes="(max-width: 700px) 80vw, 400px"
            draggable={false}
            className={i === view ? "is-shown" : undefined}
            aria-hidden={i === view ? undefined : true}
          />
        ))}
        {item.views.length > 1 && (
          <div className="view-toggle" role="group" aria-label={`${item.title} photos`}>
            {item.views.map((v, i) => (
              <button
                key={v.label}
                type="button"
                aria-pressed={i === view}
                onClick={() => setView(i)}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="project-card__body">
        <p className="project-card__tag">{item.tag}</p>
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
