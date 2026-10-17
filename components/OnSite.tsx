"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { onSite } from "@/lib/content";
import { ChevronIcon } from "./Icons";

const spring = { type: "spring", bounce: 0, visualDuration: 0.4 } as const;

export default function OnSite() {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = useReducedMotion();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photos = onSite.photos;

  useEffect(() => {
    if (open === null) return;
    const lastOpened = open;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      triggers.current[lastOpened]?.focus({ preventScroll: true });
    };
    // Re-run only when opening or closing, not when stepping between photos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === null]);

  const current = open === null ? null : photos[open];
  const layout = reduce ? { duration: 0 } : spring;

  return (
    <section id="on-site" className="section onsite" aria-labelledby="onsite-title">
      <div className="section__head">
        <h2 id="onsite-title" className="title">
          {onSite.title}
        </h2>
        <p className="section__lede">{onSite.lede} Tap a photo to see it larger.</p>
      </div>

      <div className="onsite__grid">
        {photos.map((p, i) => (
          <button
            key={p.src}
            ref={(el) => {
              triggers.current[i] = el;
            }}
            type="button"
            className={`onsite__item onsite__item--${i}`}
            onClick={() => setOpen(i)}
            aria-label={`View larger: ${p.alt}`}
          >
            <motion.div layoutId={`onsite-${i}`} className="onsite__frame" transition={layout}>
              <Image
                src={p.src}
                alt=""
                fill
                sizes={i === 0 || i === 4 ? "(max-width: 640px) 100vw, 720px" : "(max-width: 640px) 50vw, 300px"}
              />
            </motion.div>
          </button>
        ))}
      </div>

      {mounted &&
        createPortal(
      <AnimatePresence>
        {current && open !== null && (
          <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt}>
            <motion.div
              className="lightbox__scrim"
              onClick={() => setOpen(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            {/* Grows out of the photo that was tapped, and returns to it on close. */}
            <motion.div
              layoutId={`onsite-${open}`}
              className="lightbox__frame"
              transition={layout}
              style={{
                aspectRatio: `${current.width} / ${current.height}`,
                width: `min(92vw, calc(82svh * ${current.width / current.height}))`,
              }}
            >
              <Image src={current.src} alt={current.alt} fill sizes="92vw" />
            </motion.div>
            <motion.div
              className="lightbox__bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="round-btn round-btn--glass"
                aria-label="Previous photo"
                onClick={() => setOpen((open - 1 + photos.length) % photos.length)}
              >
                <ChevronIcon dir="left" />
              </button>
              <span className="lightbox__count">
                {open + 1} of {photos.length}
              </span>
              <button
                type="button"
                className="round-btn round-btn--glass"
                aria-label="Next photo"
                onClick={() => setOpen((open + 1) % photos.length)}
              >
                <ChevronIcon />
              </button>
              <button ref={closeRef} type="button" className="lightbox__close" onClick={() => setOpen(null)}>
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
