"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Logo from "./Logo";
import { business } from "@/lib/content";
import { PhoneIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#work", label: "Recent work" },
  { href: "#on-site", label: "On site" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
  { href: "#location", label: "Location" },
];

const sheetSpring = { type: "spring", bounce: 0, visualDuration: 0.3 } as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  // The current section is the last one whose top has passed the middle of the screen. At the very
  // bottom the last link wins, since a short final section never reaches the middle.
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        setActive(links[links.length - 1].href);
        return;
      }
      let current: string | null = null;
      for (const l of links) {
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) current = l.href;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Materialise: blur and scale arrive together, anchored to the menu button.
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(10px)" };

  return (
    <header className="nav-wrap">
      <div className={`nav${scrolled ? " nav--scrolled" : ""}`}>
        <div className="nav__inner">
          <a href="#top" className="nav__brand" aria-label={`${business.name}, back to top`}>
            <Logo />
          </a>
          <nav className="nav__links" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href} aria-current={active === l.href ? "true" : undefined}>
                {active === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav__pill"
                    transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, visualDuration: 0.35 }}
                  />
                )}
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav__end">
            <ThemeToggle />
            <a className="btn btn--primary btn--small nav__cta" href="#contact">
              Get a quote
            </a>
            <button
              type="button"
              className="nav__menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`burger${open ? " burger--open" : ""}`} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="scrim"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="menu"
              id="mobile-menu"
              className="menu-sheet"
              style={{ transformOrigin: "top right" }}
              initial={hidden}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={hidden}
              transition={reduce ? { duration: 0.15 } : sheetSpring}
            >
              <nav aria-label="Mobile">
                {links.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                ))}
              </nav>
              <a className="btn btn--primary menu-sheet__call" href={business.phoneHref}>
                <PhoneIcon className="btn__icon" />
                Call {business.phoneDisplay}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
