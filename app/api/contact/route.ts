import { NextResponse } from "next/server";
import { enquiryWhatsappLink } from "@/lib/content";
import { cleanEnquiry, formatEnquiry, formatEnquiryInline, validateEnquiry } from "@/lib/enquiry";
import { sendWhatsApp } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Light in-memory rate limit: 5 enquiries per 10 minutes per IP, per server instance.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "The form data could not be read. Refresh the page and try again." },
      { status: 400 }
    );
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  // Off in development so repeated test enquiries are not blocked.
  if (process.env.NODE_ENV !== "development" && rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Wait a few minutes, or message us on WhatsApp." },
      { status: 429 }
    );
  }

  const enquiry = cleanEnquiry(body);
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Some fields need attention.", errors }, { status: 422 });
  }

  const text = formatEnquiry(enquiry);
  const result = await sendWhatsApp(text, formatEnquiryInline(enquiry));

  if (result.status === "sent") {
    return NextResponse.json({ ok: true, delivered: true });
  }
  if (result.status === "not-configured") {
    return NextResponse.json({ ok: true, delivered: false, fallbackUrl: enquiryWhatsappLink(text) });
  }

  console.error("[contact] WhatsApp delivery failed:", result.detail);
  return NextResponse.json(
    {
      ok: false,
      error: "The enquiry could not be delivered just now. Send it on WhatsApp instead; it is already written for you.",
      fallbackUrl: enquiryWhatsappLink(text),
    },
    { status: 502 }
  );
}
