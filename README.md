# Kashar Home Solutions website

Next.js 15 (App Router), TypeScript and Motion. Single page with:

- **Hero** with a before/after slider of the open-air stage (drag, flick or tap; arrow keys work too)
- **Recent work** carousel with real project photos, each with its own before/after toggle
- **On site now** gallery of the house renovation, with photos that zoom out of the grid
- **Services**, **Two ways to work** (lump sum or labour rate), **Promises**
- **Contact form** that sends the enquiry to WhatsApp

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the WhatsApp settings below
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`, or deploy to Vercel (add the same environment variables in the
project settings). Set `NEXT_PUBLIC_SITE_URL` to the live address so link previews show the right image.

## WhatsApp delivery

The contact form opens WhatsApp on the visitor's phone with the enquiry already written, addressed to the
business number. The visitor only presses send. No setup is needed.

To test with another number, set `NEXT_PUBLIC_ENQUIRY_WHATSAPP` in `.env.local` (international format, no
`+`). The numbers shown on the page don't change.

### Optional: automatic delivery (not used by the form now)

`/api/contact` can deliver enquiries without the visitor pressing send, through CallMeBot or the Meta
WhatsApp Cloud API. The form doesn't call it at the moment. To use it again, the form's submit handler
would post to `/api/contact` instead of opening WhatsApp. The setup notes are below.

### Option A: CallMeBot (free, simplest)

1. Open https://www.callmebot.com/blog/free-api-whatsapp-messages/ and save the CallMeBot number shown there
   on the phone that uses **0332 1788788** (the WhatsApp number).
2. Send that number this WhatsApp message: `I allow callmebot to send me messages`
3. You will receive an API key. Put it in `.env.local`:

```
WHATSAPP_PROVIDER=callmebot
CALLMEBOT_PHONE=923321788788
CALLMEBOT_APIKEY=your-key
```

Every enquiry now arrives on that WhatsApp number automatically.

### Option B: Meta WhatsApp Cloud API (official)

Needs a Meta Business account and a separate business phone number. Messages sent to you that you did not
start need an **approved template** with one body variable `{{1}}`; the whole enquiry is placed in it.

```
WHATSAPP_PROVIDER=cloud
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_TO=923321788788
WHATSAPP_TEMPLATE=new_enquiry
WHATSAPP_TEMPLATE_LANG=en
```

## Editing content

All text, phone numbers, services and project photos live in `lib/content.ts`. Photos are in
`public/images/`. To add a project to **Recent work**, add an entry to `recentWork` with one or more
`views` (each a photo with a label such as Before / After).
