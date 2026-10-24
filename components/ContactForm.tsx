"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { business, enquiryWhatsappLink, whatsappLink } from "@/lib/content";
import {
  emptyEnquiry,
  formatEnquiry,
  requiredFields,
  validateEnquiry,
  validateField,
  workChoices,
} from "@/lib/enquiry";
import type { Enquiry, EnquiryErrors } from "@/lib/enquiry";
import { PREFILL_EVENT } from "@/lib/prefill";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

export default function ContactForm() {
  const [values, setValues] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Enquiry, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

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

  // Sends the enquiry straight to WhatsApp, written and ready: the visitor only has to press send.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const found = validateEnquiry(values);
    setErrors(found);
    setTouched(Object.fromEntries(requiredFields.map((k) => [k, true])));
    const firstInvalid = (["name", "phone", "message"] as const).find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#f-${firstInvalid}`)?.focus();
      return;
    }

    // Opened directly from the tap so browsers treat it as the visitor's own action, not a pop-up.
    // If a new tab is blocked anyway, WhatsApp opens in this one.
    const url = enquiryWhatsappLink(formatEnquiry(values));
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact__intro">
        <h2 id="contact-title" className="title">
          Tell us your problem.
        </h2>
        <p className="section__lede">
          Fill this in and send it to us on WhatsApp, or call us directly.
        </p>
        <ul className="contact__direct">
          <li>
            <a href={business.phoneHref}>
              <PhoneIcon className="contact__icon" />
              <span>
                <strong>Call</strong>{" "}
                {business.phoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="contact__icon" />
              <span>
                <strong>WhatsApp</strong>{" "}
                {business.phoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={business.secondPhoneHref}>
              <PhoneIcon className="contact__icon" />
              <span>
                <strong>Calls only, no WhatsApp</strong>{" "}
                {business.secondPhoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={business.landlineHref}>
              <PhoneIcon className="contact__icon" />
              <span>
                <strong>Landline</strong>{" "}
                {business.landlineDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={`mailto:${business.email}`}>
              <MailIcon className="contact__icon" />
              <span>
                <strong>Email</strong>{" "}
                {business.email}
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="form-card">
        <form ref={formRef} className="form" noValidate onSubmit={onSubmit}>
          <Field label="Your name" error={errors.name} htmlFor="f-name">
            <input
              {...fieldProps("name")}
              autoComplete="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => blur("name")}
            />
          </Field>

          <Field label="Mobile number" hint="So we can call you back." error={errors.phone} htmlFor="f-phone">
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

          <div className="form__footer">
            <button type="submit" className="btn btn--whatsapp">
              <WhatsAppIcon className="btn__icon" />
              Send on WhatsApp
            </button>
            <p className="form__note">WhatsApp opens with your message ready. Just press send.</p>
          </div>
        </form>
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
