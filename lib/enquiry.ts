import { business } from "./content";

// Kept short on purpose: most visitors would rather be called back than fill in a long form.
// Only a name and a number are required.
export type Enquiry = {
  name: string;
  phone: string;
  work: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export const emptyEnquiry: Enquiry = {
  name: "",
  phone: "",
  work: "",
  message: "",
};

export const workChoices = [
  { id: "new", label: "New building" },
  { id: "renovation", label: "Renovation" },
  { id: "repair", label: "Repairs" },
  { id: "other", label: "Something else" },
];

const limits: Record<keyof Enquiry, number> = {
  name: 80,
  phone: 24,
  work: 20,
  message: 2000,
};

/** Normalise untrusted input into an Enquiry: strings only, trimmed, length-capped. */
export function cleanEnquiry(input: unknown): Enquiry {
  const source = (input ?? {}) as Record<string, unknown>;
  const out = { ...emptyEnquiry };
  (Object.keys(limits) as (keyof Enquiry)[]).forEach((key) => {
    const value = source[key];
    out[key] = typeof value === "string" ? value.trim().slice(0, limits[key]) : "";
  });
  if (out.work && !workChoices.some((c) => c.id === out.work)) out.work = "";
  return out;
}

export function validateField(key: keyof Enquiry, e: Enquiry): string | undefined {
  switch (key) {
    case "name":
      return e.name.trim().length < 2 ? "Please write your name." : undefined;
    case "phone": {
      const digits = e.phone.replace(/\D/g, "");
      return digits.length < 10 || digits.length > 13
        ? "Please write your mobile number, like 0300 1234567."
        : undefined;
    }
    case "message":
      return e.message.trim().length > limits.message ? "Please keep this under 2,000 characters." : undefined;
    default:
      return undefined;
  }
}

export const requiredFields: (keyof Enquiry)[] = ["name", "phone"];

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  (["name", "phone", "message"] as const).forEach((key) => {
    const err = validateField(key, e);
    if (err) errors[key] = err;
  });
  return errors;
}

function enquiryLines(e: Enquiry): [string, string][] {
  const lines: [string, string][] = [
    ["Name", e.name],
    ["Phone", e.phone],
  ];
  const work = workChoices.find((c) => c.id === e.work);
  if (work) lines.push(["Work", work.label]);
  if (e.message) lines.push(["Details", e.message]);
  return lines;
}

/** Multi-line message for WhatsApp text messages. */
export function formatEnquiry(e: Enquiry): string {
  return [
    // Sent from the visitor's own WhatsApp, so it reads as their message.
    `Hello ${business.name}, I found you on your website.`,
    "",
    ...enquiryLines(e).map(([k, v]) => `*${k}:* ${v}`),
  ].join("\n");
}

/** Single-line version for WhatsApp template variables, which may not contain newlines. */
export function formatEnquiryInline(e: Enquiry): string {
  return enquiryLines(e)
    .map(([k, v]) => `${k}: ${v.replace(/\s+/g, " ")}`)
    .join(" | ")
    .slice(0, 1000);
}
