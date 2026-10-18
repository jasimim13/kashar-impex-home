# Kashar Home Solutions website: project context

This file carries over the context from the claude.ai chat where this project was designed and built.
Claude Code loads it automatically, so keep it up to date as decisions change.

## The business

- **Name:** Kashar Home Solutions (the logo reads "Kashar Imp / Home Solutions"), a construction and renovation company in Pakistan. The real project
  photos are from Sialkot.
- **Main number, calls and WhatsApp:** 0332 1788788 (international form: 923321788788). Enquiries are
  delivered to this WhatsApp.
- **Second line, calls only (no WhatsApp):** 0300 8616788 (923008616788). Shown in the contact list and footer.
- **Landline:** 052-4267888 (+92 52 4267888). Shown in the contact list and footer.
- **Email:** Kashar_impex@yahoo.com
- **Slogan:** "You have a problem? We have a solution." It is the hero headline.
- **Colours:** the flyer used burgundy `#6B1530` and gold `#B8862B`. The site now uses deep teal `#0F6B64`
  as the primary and safety amber `#E3A33A` as the accent (`--gold`; use `--gold-ink` when amber is text).
  Teal was chosen over blueprint blue (too generic) and terracotta (too close to the old burgundy).
- **Project types:** homes, bank branches, brand outlets, industrial buildings, multistory projects.
- **Contracts offered:** lump sum (one fixed price for the whole job; this replaced "turnkey", which
  clients found confusing) or labour rate (client buys materials, pays for work at agreed rates).
- **Services:** 19 services in 4 groups. The list lives in `lib/content.ts` under `serviceGroups`.
  "Road repair and paving" was added because the owner's photos show that work.

## History

1. The business started from a flyer for another company ("3J Solutions"). It was rebranded to Kashar,
   given the new phone and email, recoloured burgundy and gold, and upscaled.
2. This website was then built in Next.js using the `apple-design` skill: fluid spring motion, direct
   manipulation, translucent materials, the system font and reduced-motion support.
3. The owner then supplied 14 real project photos. These replaced every stock or flyer image.
4. Redesign: light theme by default with an opt-in dark theme, teal and amber palette, and an animated
   hero built around the slogan.

## Stack

- Next.js 15.5.27 (App Router), React 19.1.9, TypeScript 5.9, `motion` 12.43.0
- Exact versions are pinned on purpose; update deliberately rather than in passing.
- Font: Plus Jakarta Sans for everything, self-hosted through `next/font/google` in `app/layout.tsx`
  (CSS variable `--font-jakarta`). Chosen over Manrope, Onest, Instrument Sans and Bricolage Grotesque.
  It is wider than the system font, so the hero slogan size is tuned to keep each half on one line.
- Plain CSS in `app/globals.css`, no Tailwind. Design tokens are CSS variables on `:root`; dark tokens live
  under `:root[data-theme="dark"]`. The site is light by default and ignores the OS colour scheme.
  `ThemeToggle` stores the choice in `localStorage` (`kashar-theme`), and an inline script in
  `app/layout.tsx` applies it before first paint.

## Structure

```
app/layout.tsx            metadata, viewport, theme colours
app/page.tsx              section order
app/globals.css           every style (tokens, components, responsive, accessibility queries)
app/api/contact/route.ts  POST endpoint (unused by the form now): validate, honeypot, rate limit, send to WhatsApp
components/Nav.tsx           translucent nav, active-section pill, theme toggle, mobile menu sheet
components/ThemeToggle.tsx   light/dark switch; the new theme grows from the button (View Transitions)
components/Hero.tsx          big logo, slogan, blueprint background, stats, and the BeforeAfter reveal of the stage
                             (the nav logo stays hidden while the hero logo, #hero-logo, is in view)
components/BeforeAfter.tsx   drag, flick or tap slider with rubber-banding; keyboard accessible (role="slider");
                             `introDelay` plays the hero reveal (full before → after → middle)
components/WorkGrid.tsx      "Our work": one titled grid per category (#work-<id>), each revealed card by
                             card on first scroll into view; cards keep the before/after toggle;
                             empty categories show a slim "Photos coming soon." row
components/OnSite.tsx        house renovation gallery; lightbox grows from the tile (layoutId), portalled to body
components/Services.tsx      grouped inset lists
components/Engagement.tsx    Lump sum / Labour rate segmented control
components/Promises.tsx      five promises
components/ContactForm.tsx   short form (name, mobile, optional work type and note); listens for prefill events
components/Location.tsx      office address, Google Maps embed and directions (from `office` in lib/content.ts)
components/Footer.tsx, Logo.tsx, Icons.tsx
lib/content.ts    ALL copy, contact details, services, work items and photos
lib/enquiry.ts    Enquiry type; validation shared by client and server; message formatting
lib/whatsapp.ts   providers: CallMeBot, Meta Cloud API, or none
lib/prefill.ts    prefillEnquiry(): adds a suggested note to the form from other sections, scrolls to #contact
```

## Page order

Hero (stage before/after) → Our work → On site now → Services → Two ways to work → Promises →
Contact → Location → Footer.

## How the contact form reaches WhatsApp

The form opens WhatsApp directly from the submit tap, with the enquiry already written
(`formatEnquiry` in `lib/enquiry.ts`); the visitor only presses send. There is no confirmation screen.
The window is opened synchronously inside the submit handler so browsers don't block it as a pop-up; if
a new tab is blocked anyway, the current tab navigates to WhatsApp.

`app/api/contact/route.ts` and `lib/whatsapp.ts` (CallMeBot or Meta Cloud API delivery) are no longer
called by the form. They remain in case automatic delivery is wanted later; see `README.md`.

## Photos (`public/images/`)

- **Adding work:** put the photos in `public/images/`, then add an entry to `work` in `lib/content.ts`
  with a `category` from `workCategories` and one or more `views` (each view is a labelled photo, such as
  Before and After). The grid picks it up automatically. If the photos are from different sites rather
  than stages of one job, set `gallery: true`: the card steps through them (‹ 2 / 6 ›) instead of showing a
  Before/After toggle, so unrelated places are never presented as a before and after.
- **`roads/`:** 19 asphalt photos from different sites, grouped by stage into three gallery cards:
  `laying-1..8` (laying-8 is the old cantonment-gate photo), `rolling-1..5`, `finished-1..6`. The owner
  sent them unlabelled; the stage grouping was judged from the photos.
- **`pcc/`:** one forecourt job in front of a row of shops. `stage-ground/base/concrete` are one photo per
  stage for the stage toggle; `job-1..8` are the rest, in job order, for a gallery card.
- **`paint/`:** `house-before/after` (same house front: patched plaster, then painted) and
  `door-polishing/finished` (same door) are true pairs; `classrooms-1..6` are a gallery because the
  in-progress and finished rooms could not be matched. Two near-duplicate house photos were left out.
- **`ceiling/`:** 18 photos from several houses, no true pairs, so four gallery cards: `borders-1..4`
  (one job, in order), `medallion-1/2`, `false-1..5`, `walls-1..7` (wall mouldings and panels the owner
  filed under ceiling design; could move to Panelling). Black bars and WhatsApp screen edges were cropped.
- **`media-wall/`:** `marble-fitting/detail/finished` (one lounge, stage toggle), `fluted-1/2` (split
  from one side-by-side collage), and `designs-1..5`. designs-1..3 are cropped from screenshots of
  Facebook/Instagram posts (the app UI and account names were cropped out) and designs-4/5 look like
  renders; the owner asked for them to be used anyway. If originals of the owner's own jobs arrive,
  prefer those.
- **`roof/`:** `membrane-1..4` (bare roof, primer, torch-on rolls; may be more than one roof, so a
  gallery) and `bitumen-coat` (a single photo of a hot bitumen coat).
- **`tile/`:** `floor-1..4`, `marble-1..3`, `stairs-1/2`, `wall-1..4`, `roof-tiles` (Tilework section,
  five cards). Three near-identical shots taken seconds apart were left out.
- **`wood/`:** `doors-1/2`, `bookcase-workshop/installed` (paired by the matching cube layout; confirm
  with the owner), `storage-1/2` (storage-2 looks like a render).
- **`construction/`:** `building-1..4` (new three-storey build), `walls-1..6` (opening up and rebuilding
  walls), `kitchen-1..4` (strip-out, then the rebuilt kitchen; kitchen-4 matched by eye).
- **`askari-162/`:** Askari 2, House #162. The owner requires these cards (`exterior-1..4`,
  `openings-1..5`, `interior-1..3`), now led by a Before / Final design card. `elevation-design` is a 3D
  render of the planned front, so it is labelled "Final design", not "After"; swap in a real photo once
  the elevation is built to stay first in the Construction section. The house is named
  publicly at the owner's request, and exterior-4 shows the "162" plate unblurred. It may be the same
  house as the "On site now" gallery, whose `reno-exterior` photo has the number blurred.
- **`tuff-tile/`:** `relaying-1/2`, the same roadside junction from two angles, mid-job; a gallery card.
- **Categories (page order):** Roads, Woodwork, Tilework, Roof treatment, Media wall, Paint work, Ceiling
  design, LCD walls, Panelling, Plumbing, Tuff tile, PCC, Footpath, Steel work, Construction. Roads, Roof
  treatment, Woodwork, Tilework, Media wall, Paint work, Ceiling design, Tuff tile, PCC and Construction have photos; the owner is sending the rest.

- **`stage-before` / `stage-after`:** two photos aligned to each other (the before photo shifted
  +53px, −45px), then cropped to the same frame. If either is replaced, re-align it or the slider will
  jump.
- **`repaint-*`, `filtration-plant-*`, `slab-*`:** cut from side-by-side collages the owner sent. The
  filtration plant card was first captioned an ablution area; the owner corrected it.
- **`waterproof-1/2/3`:** three panels from one collage. `waterproof-1` is currently unused.
- **`reno-exterior`:** the house number and the scooter's number plate are blurred on purpose. Keep
  them blurred.
- One near-duplicate interior photo was left out of the gallery.

## Design rules to keep

- Springs with no bounce by default (`bounce: 0`). Allow a little bounce only after a flick that
  carried momentum.
- Start every animation from the value currently on screen (`x.stop()` / `pos.stop()` on pointer
  down), so a moving element can be grabbed mid-flight.
- Give feedback on pointer down, not on release (`:active` scale 0.97).
- Wait for about 10px of movement before committing to a direction, and use `touch-action: pan-y` so
  pages still scroll vertically on phones.
- Use only one orchestrated load animation (the hero). Don't add fade-in animations to other sections;
  the one exception, at the owner's request, is the "Our work" grids, which rise in once on scroll.
  The hero tells the slogan: "You have a problem?" over the before photo, then "We have a solution." as
  the divider sweeps to the after photo. Its timeline is the `T` object in `Hero.tsx`.
- On one-column layouts the hero photo sits right under the slogan (`.hero__copy { display: contents }`)
  so the reveal plays on screen.
- Honour reduced motion, reduced transparency and increased contrast. The media queries are at the end
  of `globals.css`.
- Write copy in plain sentence case, with no all-caps labels.

## Contact form

- The audience is mostly middle-aged men, so the form is deliberately short: only name and mobile number
  are required. Work type is four big buttons, and the note is optional. Fields and text are large.
- **Testing:** set `NEXT_PUBLIC_ENQUIRY_WHATSAPP` in `.env.local` to send form enquiries to another
  WhatsApp number without changing the numbers on the page. It is empty now, so enquiries go to 0332 1788788.

## Open items

- Office: Shop No. 14–15, First Floor, Cantonment Plaza, Jamia Masjid Road, Sialkot Cantt. The map
  searches "Cantonment Plaza, Jamia Masjid Road, Sialkot Cantt" (`office.mapQuery`). The pin has not been
  checked by eye; a dropped-pin link or coordinates from the owner would make it exact.

- Confirm the work captions with the owner. For example: is the two-storey building an office or a
  school? Is "cantonment gate" the right description for the road job?
- Set `NEXT_PUBLIC_SITE_URL` once a domain exists.
- Possible next steps: deploy to Vercel, add an Urdu version, add more projects to `recentWork`.

## Commands

```bash
npm install
cp .env.example .env.local
npm run dev     # http://localhost:3000
npm run build && npm start
```
