"use client";

import { useEffect } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { business, heroCompare, projectTypes, serviceGroups, whatsappLink } from "@/lib/content";
import BeforeAfter from "./BeforeAfter";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

const spring = { type: "spring", bounce: 0, visualDuration: 0.6 } as const;

// One orchestrated load, told as the slogan: the problem (the "before" photo), then the solution
// (the divider sweeps to "after"), then everything you can do about it. Times are in seconds.
const T = { problem: 0.1, solution: 0.95, sweep: 1.15, rest: 1.55, done: 2.4 };

const serviceCount = serviceGroups.reduce((n, g) => n + g.items.length, 0);

const stats = [
  { value: serviceCount, label: "services under one roof" },
  { value: projectTypes.length, label: "kinds of building" },
  { value: 2, label: "ways to contract" },
];

// Blueprint of a two-storey building with a crane, drawn line by line behind the hero.
const blueprint = [
  "M24 396H616",
  "M96 396V150H424V396",
  "M84 150H436",
  "M96 150V128H424V150",
  "M96 272H424",
  "M126 180h64v58h-64z",
  "M222 180h64v58h-64z",
  "M318 180h76v58h-76z",
  "M126 302h64v58h-64z",
  "M222 302h64v58h-64z",
  "M336 396v-80h44v80",
  "M96 100H424M96 92v16M424 92v16",
  "M462 150V396M454 150h16M454 396h16",
  "M532 396V56M548 396V56M532 56h16",
  "M532 96l16-20M532 136l16-20M532 176l16-20M532 216l16-20M532 256l16-20M532 296l16-20M532 336l16-20",
  "M492 56H636M512 56l28-26 28 26",
  "M612 56v74M602 130h20v14h-20z",
];

type Word = { text: string; accent?: boolean };
const lineOne: Word[] = [{ text: "You" }, { text: "have" }, { text: "a" }, { text: "problem?" }];
const lineTwo: Word[] = [{ text: "We" }, { text: "have" }, { text: "a" }, { text: "solution.", accent: true }];

function Line({ words, start, reduce }: { words: Word[]; start: number; reduce: boolean }) {
  return (
    <span className="hero__line">
      {words.map((w, i) => {
        const delay = start + i * 0.07;
        const motionProps = reduce
          ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
          : {
              initial: { opacity: 0, y: "0.45em", filter: "blur(10px)" },
              animate: { opacity: 1, y: "0em", filter: "blur(0px)" },
              transition: { ...spring, delay },
            };
        return (
          <span key={i}>
            {w.accent ? (
              <span className="hero__solution">
                <motion.span className="hero__word hero__word--accent" {...motionProps}>
                  {w.text}
                </motion.span>
                <svg className="hero__underline" viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M3 10C46 3 128 1 217 7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { pathLength: { ...spring, visualDuration: 0.7, delay: delay + 0.35 }, opacity: { duration: 0.01, delay: delay + 0.35 } }
                    }
                  />
                </svg>
              </span>
            ) : (
              <motion.span className="hero__word" {...motionProps}>
                {w.text}
              </motion.span>
            )}
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </span>
  );
}

function Count({ to, delay, reduce }: { to: number; delay: number; reduce: boolean }) {
  // Starts at the final value so the number is right without JavaScript; counts up once on load.
  const value = useMotionValue(to);
  const shown = useTransform(value, (v) => Math.round(v));
  useEffect(() => {
    if (reduce) return;
    const controls = animate(value, [0, to], { type: "spring", bounce: 0, visualDuration: 1.1, delay });
    return () => controls.stop();
  }, [value, to, delay, reduce]);
  return <motion.span>{shown}</motion.span>;
}

export default function Hero() {
  const reduce = useReducedMotion() ?? false;

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { ...spring, delay } };

  // Materialise: blur and scale arrive together.
  const appear = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
      : {
          initial: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
          animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
          transition: { ...spring, visualDuration: 0.5, delay },
        };

  // The background layers drift a little against the mouse, at different depths.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { bounce: 0, visualDuration: 0.9 });
  const sy = useSpring(py, { bounce: 0, visualDuration: 0.9 });
  const glowAX = useTransform(sx, (v) => v * -48);
  const glowAY = useTransform(sy, (v) => v * -36);
  const glowBX = useTransform(sx, (v) => v * 36);
  const glowBY = useTransform(sy, (v) => v * 28);
  const planX = useTransform(sx, (v) => v * 18);
  const planY = useTransform(sy, (v) => v * 12);

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section id="top" className="hero" onPointerMove={onPointerMove}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <motion.div className="hero__glow hero__glow--a" style={{ x: glowAX, y: glowAY }} />
        <motion.div className="hero__glow hero__glow--b" style={{ x: glowBX, y: glowBY }} />
        <motion.svg className="hero__plan" viewBox="0 0 660 420" style={{ x: planX, y: planY }}>
          {blueprint.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              initial={reduce ? { pathLength: 1, opacity: 0 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduce
                  ? { duration: 0.3 }
                  : {
                      pathLength: { type: "spring", bounce: 0, visualDuration: 1.2, delay: 0.15 + i * 0.07 },
                      opacity: { duration: 0.01, delay: 0.15 + i * 0.07 },
                    }
              }
            />
          ))}
        </motion.svg>
      </div>

      <div className="hero__inner">
        <div className="hero__copy">
          <motion.p className="hero__eyebrow" {...rise(0)}>
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Construction and renovation
          </motion.p>
          <h1 className="display hero__title">
            <Line words={lineOne} start={T.problem} reduce={reduce} />
            <Line words={lineTwo} start={T.solution} reduce={reduce} />
          </h1>
          <motion.p className="hero__lede" {...rise(T.rest)}>
            From the first drawing to the final coat of paint, {business.name} plans, builds and finishes
            homes, bank branches, brand outlets, industrial buildings and multistory projects, on turnkey or
            labour-rate contracts.
          </motion.p>
          <motion.div className="hero__actions" {...rise(T.rest + 0.1)}>
            <a className="btn btn--primary" href="#contact">
              Tell us your problem
            </a>
            <a className="btn btn--secondary" href={business.phoneHref}>
              <PhoneIcon className="btn__icon" />
              {business.phoneDisplay}
            </a>
          </motion.div>
          <motion.a
            className="hero__whatsapp"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            {...rise(T.rest + 0.18)}
          >
            <WhatsAppIcon className="hero__whatsapp-icon" />
            Or send photos of your site on WhatsApp
          </motion.a>
          <motion.dl className="hero__stats" {...rise(T.rest + 0.26)}>
            {stats.map((s, i) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  <Count to={s.value} delay={T.rest + 0.3 + i * 0.08} reduce={reduce} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure
          className="hero__media"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={reduce ? { duration: 0.3 } : { ...spring, visualDuration: 0.9, delay: 0.15 }}
        >
          <div className="hero__stage">
            <BeforeAfter
              before={heroCompare.before}
              after={heroCompare.after}
              sizes="(max-width: 900px) 100vw, 600px"
              priority
              introDelay={T.sweep}
            />
            <motion.div className="hero__chip hero__chip--done" aria-hidden="true" {...appear(T.done)}>
              <span className="hero__chip-badge">
                <CheckIcon />
              </span>
              <span>
                <strong>Built and finished</strong>
                <span>by our own team</span>
              </span>
            </motion.div>
            <motion.div className="hero__chip hero__chip--terms" aria-hidden="true" {...appear(T.done + 0.15)}>
              <span className="hero__chip-dot" />
              Turnkey or labour rate
            </motion.div>
          </div>
          <figcaption>
            {heroCompare.caption} <span>Drag the divider to compare.</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
