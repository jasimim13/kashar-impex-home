export type SendResult =
  | { status: "sent" }
  | { status: "not-configured" }
  | { status: "failed"; detail: string };

const TIMEOUT_MS = 15000;

/** CallMeBot: free, delivers to your own WhatsApp number once you have activated it. */
async function viaCallMeBot(text: string): Promise<SendResult> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return { status: "not-configured" };

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apikey)}`;

  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  const body = await res.text();
  if (res.ok && /queued|sent/i.test(body)) return { status: "sent" };
  return {
    status: "failed",
    detail: `CallMeBot ${res.status}: ${body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200)}`,
  };
}

/** Meta WhatsApp Cloud API. */
async function viaCloudApi(text: string, inlineText: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO;
  if (!token || !phoneNumberId || !to) return { status: "not-configured" };

  const version = process.env.WHATSAPP_API_VERSION || "v21.0";
  const template = process.env.WHATSAPP_TEMPLATE;

  // Business-initiated messages need an approved template. Plain text only arrives
  // if the receiving number has messaged the business number in the last 24 hours.
  const payload = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
          components: [{ type: "body", parameters: [{ type: "text", text: inlineText }] }],
        },
      }
    : { messaging_product: "whatsapp", to, type: "text", text: { preview_url: false, body: text } };

  const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.ok) return { status: "sent" };
  const body = await res.text();
  return { status: "failed", detail: `Cloud API ${res.status}: ${body.slice(0, 300)}` };
}

export async function sendWhatsApp(text: string, inlineText: string): Promise<SendResult> {
  const provider = (process.env.WHATSAPP_PROVIDER || "").trim().toLowerCase();
  try {
    if (provider === "callmebot") return await viaCallMeBot(text);
    if (provider === "cloud") return await viaCloudApi(text, inlineText);
    return { status: "not-configured" };
  } catch (err) {
    return { status: "failed", detail: err instanceof Error ? err.message : String(err) };
  }
}
