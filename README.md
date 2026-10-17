# Kashar Home Solutions website

Next.js 15 (App Router), TypeScript and Motion. Single page with:

- **Hero** with a before/after slider of the open-air stage (drag, flick or tap; arrow keys work too)
- **Recent work** carousel with real project photos, each with its own before/after toggle
- **On site now** gallery of the house renovation, with photos that zoom out of the grid
- **Services**, **Two ways to work** (turnkey or labour rate), **Promises**
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

The form posts to `/api/contact`, which validates the enquiry and sends it to WhatsApp. Pick one option in
`.env.local`:

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

### No setup

If `WHATSAPP_PROVIDER` is empty, the visitor sees **Send on WhatsApp**, which opens WhatsApp with their
enquiry already written. If a provider is set but sending fails, the visitor gets the same button, so no
enquiry is lost.

The route also has a hidden honeypot field for bots and allows 5 enquiries per 10 minutes per connection.

## Editing content

All text, phone numbers, services and project photos live in `lib/content.ts`. Photos are in
`public/images/`. To add a project to **Recent work**, add an entry to `recentWork` with one or more
`views` (each a photo with a label such as Before / After).
