"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { business, enquiryWhatsappLink, whatsappLink } from "@/lib/content";
import { emptyEnquiry, requiredFields, validateEnquiry, validateField, workChoices } from "@/lib/enquiry";
import type { Enquiry, EnquiryErrors } from "@/lib/enquiry";
import { PREFILL_EVENT } from "@/lib/prefill";
import { CheckIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "handoff"; url: string }
  | { kind: "error"; message: string; url?: string };

const spring = { type: "spring", bounce: 0, visualDuration: 0.35 } as const;

export default function ContactForm() {
  const [values, setValues] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Enquiry, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<Partial<Enquiry>>).detail;
      setValues((v) => {
        // Add a suggested note under anything the person has already written, never over it.
        const message =
          detail.message && v.message.trim() && !v.message.includes(detail.message)
            ? `${v.message.trim()}\n${detail.message}`
            : (detail.message ?? v.message);
        return { ...v, ...detail, message };
      });
      setErrors((err) => {
        const next = { ...err };
        (Object.keys(detail) as (keyof Enquiry)[]).forEach((k) => delete next[k]);
        return next;
      });
      setStatus((s) => (s.kind === "sent" || s.kind === "handoff" ? { kind: "idle" } : s));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const update = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Once a field has been visited, keep its message live as the person types.
    if (touched[key]) setErrors((err) => ({ ...err, [key]: validateField(key, next) }));
  };

  const blur = (key: keyof Enquiry) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((err) => ({ ...err, [key]: validateField(key, values) }));
  };

  const fieldProps = (key: keyof Enquiry) => ({
    id: `f-${key}`,
    name: key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `f-${key}-error` : undefined,
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === "sending") return;

    const found = validateEnquiry(values);
    setErrors(found);
    setTouched(Object.fromEntries(requiredFields.map((k) => [k, true])));
    const firstInvalid = (["name", "phone", "message"] as const).find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#f-${firstInvalid}`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus(data.delivered ? { kind: "sent" } : { kind: "handoff", url: data.fallbackUrl });
        return;
      }
      if (data.errors) setErrors(data.errors);
      setStatus({
        kind: "error",
        message: data.error ?? "The enquiry could not be sent. Check your connection and try again.",
        url: data.fallbackUrl,
      });
    } catch {
      setStatus({
        kind: "error",
        message: "The enquiry could not be sent. Check your connection and try again, or message us on WhatsApp.",
        url: enquiryWhatsappLink(),
      });
    }
  };

  const reset = () => {
    setValues(emptyEnquiry);
    setErrors({});
    setTouched({});
    setStatus({ kind: "idle" });
  };

  const done = status.kind === "sent" || status.kind === "handoff";
  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: spring,
      };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact__intro">
        <h2 id="contact-title" className="title">
          Tell us your problem.
        </h2>
        <p className="section__lede">
          Leave your name and number and we will call you back. Or call or WhatsApp us directly.
        </p>
        <ul className="contact__direct">
          <li>
            <a href={business.phoneHref}>
              <PhoneIcon className="contact__icon" />
              <span>
                <strong>Call</strong>
                {business.phoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="contact__icon" />
              <span>
                <strong>WhatsApp</strong>
                {business.phoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={business.secondPhoneHref}>
              <PhoneIcon className="contact__icon" />
              <span>
                <strong>Calls only, no WhatsApp</strong>
                {business.secondPhoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={`mailto:${business.email}`}>
              <MailIcon className="contact__icon" />
              <span>
                <strong>Email</strong>
                {business.email}
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="form-card">
        <AnimatePresence mode="popLayout" initial={false}>
          {done ? (
            <motion.div key="done" className="form-done" role="status" {...swap}>
              <span className="form-done__badge">
                <CheckIcon />
              </span>
              {status.kind === "sent" ? (
                <>
                  <h3>Thank you, we have your message</h3>
                  <p>
                    We will call you on <strong>{values.phone}</strong> soon.
                  </p>
                </>
              ) : (
                <>
                  <h3>One more step</h3>
                  <p>Your message is ready. Tap the green button, then press send in WhatsApp.</p>
                  <a
                    className="btn btn--whatsapp"
                    href={status.kind === "handoff" ? status.url : enquiryWhatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="btn__icon" />
                    Send on WhatsApp
                  </a>
                </>
              )}
              <button type="button" className="text-btn" onClick={reset}>
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" ref={formRef} className="form" noValidate onSubmit={onSubmit} {...swap}>
              <Field label="Your name" error={errors.name} htmlFor="f-name">
                <input
                  {...fieldProps("name")}
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                />
              </Field>

              <Field label="Mobile number" hint="We will call you or WhatsApp you on this number." error={errors.phone} htmlFor="f-phone">
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0300 1234567"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                />
              </Field>

              <fieldset className="field">
                <legend className="field__label">
                  What work do you need?
                  <span className="field__optional">Optional</span>
                </legend>
                <div className="choice-grid">
                  {workChoices.map((c) => (
                    <label key={c.id} className="choice">
                      <input
                        type="radio"
                        name="work"
                        value={c.id}
                        checked={values.work === c.id}
                        onChange={() => update("work", c.id)}
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Anything else?" optional error={errors.message} htmlFor="f-message">
                <textarea
                  {...fieldProps("message")}
                  rows={3}
                  placeholder="For example: 10 marla house, new kitchen and bathrooms."
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  onBlur={() => blur("message")}
                />
              </Field>

              {/* Honeypot for bots; hidden from people and assistive tech. */}
              <div className="hp" aria-hidden="true">
                <label>
                  Company
                  <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </label>
              </div>

              <AnimatePresence initial={false}>
                {status.kind === "error" && (
                  <motion.div
                    key="error"
                    className="form-alert"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={reduce ? { duration: 0.15 } : spring}
                  >
                    <p>{status.message}</p>
                    {status.url && (
                      <a href={status.url} target="_blank" rel="noopener noreferrer">
                        Send on WhatsApp instead
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form__footer">
                <button type="submit" className="btn btn--primary btn--wide" disabled={status.kind === "sending"}>
                  {status.kind === "sending" ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    "Call me back"
                  )}
                </button>
                <p className="form__note">We use your number only to reply to you.</p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {optional && <span className="field__optional">Optional</span>}
      </label>
      {hint && <p className="field__hint">{hint}</p>}
      {children}
      <FieldError id={`${htmlFor}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="field__error" aria-live="polite">
      {message}
    </p>
  );
}
