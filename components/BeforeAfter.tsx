"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Photo } from "@/lib/content";
import { ChevronIcon } from "./Icons";

type Props = {
  before: Photo;
  after: Photo;
  sizes: string;
  priority?: boolean;
  /** Seconds after load to play the reveal: start on the full "before", sweep to "after", settle mid-way. */
  introDelay?: number;
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Progressive resistance past an edge, in pixels. */
function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Where a flick comes to rest; 0.99 gives a snappier stop than page scrolling. */
function project(velocity: number, decelerationRate = 0.99) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

type Drag = {
  id: number;
  x0: number;
  y0: number;
  startPos: number;
  engaged: boolean;
  history: { t: number; x: number }[];
};

export default function BeforeAfter({ before, after, sizes, priority, introDelay }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const intro = introDelay !== undefined;
  const pos = useMotionValue(intro ? 1 : 0.5); // share of the width showing "before"
  const reduce = useReducedMotion();
  const drag = useRef<Drag | null>(null);
  const [pressed, setPressed] = useState(false);
  const [value, setValue] = useState(intro ? 100 : 50);
  const interacted = useRef(false);

  const clip = useTransform(pos, (p) => `inset(0 ${(1 - clamp(p)) * 100}% 0 0)`);
  const left = useTransform(pos, (p) => `${p * 100}%`);

  useEffect(() => pos.on("change", (p) => setValue(Math.round(clamp(p) * 100))), [pos]);

  // On load, either the hero's reveal (problem → solution) or one gentle nudge hinting that the divider
  // moves. Each step is skipped once the person touches it, and a press grabs it mid-flight.
  useEffect(() => {
    if (reduce) {
      pos.set(0.5);
      return;
    }
    const steps: [number, number, number][] = intro
      ? [
          [0.08, 1.1, (introDelay ?? 0) * 1000],
          [0.5, 0.7, 650],
        ]
      : [
          [0.62, 0.45, 900],
          [0.5, 0.45, 0],
        ];
    let cancelled = false;
    let timer = 0;
    const run = async () => {
      for (const [target, visualDuration, wait] of steps) {
        if (wait) await new Promise((r) => (timer = window.setTimeout(r, wait)));
        if (cancelled || interacted.current) return;
        await animate(pos, target, { type: "spring", bounce: 0, visualDuration });
      }
    };
    run();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pos, reduce, intro, introDelay]);

  const settle = (target: number, velocity = 0) => {
    if (reduce) {
      pos.set(target);
      return;
    }
    animate(pos, target, { type: "spring", velocity, bounce: 0, visualDuration: 0.35 });
  };

  const width = () => ref.current?.getBoundingClientRect().width ?? 1;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    interacted.current = true;
    pos.stop(); // grab it from wherever it is right now
    setPressed(true);
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      startPos: pos.get(),
      engaged: false,
      history: [{ t: e.timeStamp, x: e.clientX }],
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.engaged) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // The person is scrolling the page, not comparing.
        drag.current = null;
        setPressed(false);
        return;
      }
      d.engaged = true;
      d.x0 = e.clientX;
      ref.current?.setPointerCapture(e.pointerId);
    }
    // Move relative to where it was grabbed, 1:1 with the finger.
    const w = width();
    const px = d.startPos * w + (e.clientX - d.x0);
    let next = px;
    if (px < 0) next = rubberband(px, w);
    else if (px > w) next = w + rubberband(px - w, w);
    pos.set(next / w);
    d.history.push({ t: e.timeStamp, x: e.clientX });
    while (d.history.length > 2 && e.timeStamp - d.history[0].t > 100) d.history.shift();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    setPressed(false);
    if (!d) return;
    const w = width();

    if (!d.engaged) {
      // A tap: move the divider to where the person tapped.
      const rect = ref.current?.getBoundingClientRect();
      if (rect) settle(clamp((e.clientX - rect.left) / rect.width, 0.02, 0.98));
      return;
    }

    const h = d.history;
    const last = h[h.length - 1];
    const first = h[0];
    const dt = last.t - first.t;
    const velocityPx = dt > 0 && e.timeStamp - last.t < 80 ? ((last.x - first.x) / dt) * 1000 : 0;
    const projected = pos.get() + project(velocityPx) / w;
    settle(clamp(projected, 0.02, 0.98), velocityPx / w);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const p = clamp(pos.get());
    const step = e.shiftKey ? 0.2 : 0.05;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = p - step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = p + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    interacted.current = true;
    settle(clamp(next));
  };

  return (
    <div
      ref={ref}
      className={`compare${pressed ? " compare--pressed" : ""}`}
      style={{ aspectRatio: `${after.width} / ${after.height}` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
        setPressed(false);
        settle(clamp(pos.get(), 0.02, 0.98));
      }}
    >
      <Image src={after.src} alt={after.alt} fill sizes={sizes} priority={priority} draggable={false} />
      <motion.div className="compare__before" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} priority={priority} draggable={false} />
      </motion.div>

      <span className="compare__tag compare__tag--before">Before</span>
      <span className="compare__tag compare__tag--after">After</span>

      <motion.div
        className="compare__handle"
        style={{ left }}
        role="slider"
        tabIndex={0}
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}% before, ${100 - value}% after`}
        onKeyDown={onKeyDown}
      >
        <span className="compare__knob" aria-hidden="true">
          <ChevronIcon dir="left" />
          <ChevronIcon />
        </span>
      </motion.div>
    </div>
  );
}
