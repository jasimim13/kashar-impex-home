import type { Enquiry } from "./enquiry";

export const PREFILL_EVENT = "kashar:prefill";

/** Pre-select fields in the contact form and bring it into view. */
export function prefillEnquiry(fields: Partial<Enquiry>) {
  window.dispatchEvent(new CustomEvent<Partial<Enquiry>>(PREFILL_EVENT, { detail: fields }));
  const target = document.getElementById("contact");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
