export const business = {
  name: "Kashar Home Solutions",
  // Main number, used for calls and WhatsApp.
  phoneDisplay: "0332 1788788",
  phoneHref: "tel:+923321788788",
  whatsappNumber: "923321788788",
  // Second line for calls.
  secondPhoneDisplay: "0300 8616788",
  secondPhoneHref: "tel:+923008616788",
  email: "Kashar_impex@yahoo.com",
};

// Office location. Write the address as people should read it; line breaks are kept. mapQuery is what
// Google Maps searches for: shop and floor numbers confuse it, so it names the plaza and road only.
export const office = {
  address: "Shop No. 14–15, First Floor\nCantonment Plaza No. 2\nJamia Masjid Road, Sialkot Cantt",
  mapQuery: "Cantonment Plaza, Jamia Masjid Road, Sialkot Cantt",
};

const officeQuery = () => office.mapQuery || office.address;
export const mapEmbedUrl = () => `https://www.google.com/maps?q=${encodeURIComponent(officeQuery())}&z=16&output=embed`;
export const directionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeQuery())}`;

export const whatsappLink = (text?: string, number: string = business.whatsappNumber) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Where contact-form enquiries go when they are handed to the visitor's WhatsApp. Normally the business
// number; NEXT_PUBLIC_ENQUIRY_WHATSAPP overrides it for testing without changing the numbers on the page.
export const enquiryWhatsappNumber = process.env.NEXT_PUBLIC_ENQUIRY_WHATSAPP || business.whatsappNumber;
export const enquiryWhatsappLink = (text?: string) => whatsappLink(text, enquiryWhatsappNumber);

export const projectTypes = [
  { id: "homes", title: "Homes" },
  { id: "bank-branches", title: "Bank branches" },
  { id: "brand-outlets", title: "Brand outlets" },
  { id: "industrial", title: "Industrial buildings" },
  { id: "multistory", title: "Multistory projects" },
];

export type Photo = { src: string; alt: string; width: number; height: number };
export type WorkView = Photo & { label: string };

export const heroCompare = {
  caption: "An open-air stage we built and finished.",
  before: {
    src: "/images/stage-before.jpg",
    alt: "Stage platform with grey plastered walls, rubble and workers in front",
    width: 1220,
    height: 910,
  },
  after: {
    src: "/images/stage-after.jpg",
    alt: "The finished stage with clad stepped sides and three white backdrop walls",
    width: 1220,
    height: 910,
  },
};

export type WorkItem = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  service?: string;
  views: WorkView[];
};

export const recentWork: WorkItem[] = [
  {
    id: "repaint",
    tag: "Renovation",
    title: "Two-storey building, repainted",
    summary: "Damaged plaster repaired, walls painted white, and trims and window canopies picked out in grey.",
    service: "Paint and polish works",
    views: [
      { label: "Before", src: "/images/repaint-before.jpg", alt: "Building with stained, peeling cream walls and red window canopies", width: 1148, height: 760 },
      { label: "After", src: "/images/repaint-after.jpg", alt: "The same building freshly painted white with grey trims and canopies", width: 1148, height: 760 },
    ],
  },
  {
    id: "ablution",
    tag: "Civil works",
    title: "Ablution area, new floor and steps",
    summary: "The broken slab over the drain replaced with a new concrete floor, steps and walkway.",
    service: "Finishing works",
    views: [
      { label: "Before", src: "/images/ablution-before.jpg", alt: "Ablution area with a broken concrete step over an open drain", width: 1148, height: 760 },
      { label: "After", src: "/images/ablution-after.jpg", alt: "New concrete floor and steps in front of the ablution taps, taped off to cure", width: 1148, height: 760 },
    ],
  },
  {
    id: "slab",
    tag: "Structure",
    title: "New roof slab",
    summary: "Steel mesh and electrical conduits laid out, then the concrete poured and levelled.",
    service: "Gray structure",
    views: [
      { label: "Steel", src: "/images/slab-steel.jpg", alt: "Workers laying steel reinforcement and conduits on a roof over brick walls", width: 1148, height: 760 },
      { label: "Concrete", src: "/images/slab-pour.jpg", alt: "Workers levelling freshly poured concrete over the roof steel", width: 1148, height: 760 },
    ],
  },
  {
    id: "waterproofing",
    tag: "Waterproofing",
    title: "Roof waterproofing",
    summary: "The old roof cleaned and coated with bitumen, sealed right up to the parapet walls.",
    service: "Water proofing",
    views: [
      { label: "Applying", src: "/images/waterproof-3.jpg", alt: "A worker spreading bitumen across a flat roof with a squeegee", width: 1080, height: 476 },
      { label: "Coated", src: "/images/waterproof-2.jpg", alt: "A flat roof fully coated in glossy black bitumen", width: 1080, height: 466 },
    ],
  },
  {
    id: "road",
    tag: "Road works",
    title: "Road patching at a cantonment gate",
    summary: "A damaged stretch relaid with fresh asphalt, with the road kept open to traffic.",
    service: "Road repair and paving",
    views: [
      { label: "On site", src: "/images/road.jpg", alt: "Workers laying asphalt behind a work in progress sign at a cantonment gate", width: 960, height: 1280 },
    ],
  },
];

export const onSite = {
  title: "On site now: a full house renovation.",
  lede:
    "Old plaster and tiles are coming off, walls are being opened up for new windows and doors, and fresh plaster is going on.",
  photos: [
    { src: "/images/reno-exterior.jpg", alt: "Front of the two-storey house under renovation, with new wooden gates", width: 1600, height: 1200 },
    { src: "/images/reno-breaking.jpg", alt: "A worker breaking up an old floor with a demolition hammer", width: 1200, height: 1600 },
    { src: "/images/reno-opening.jpg", alt: "A worker opening up a wall for a new window", width: 1200, height: 1600 },
    { src: "/images/reno-plaster.jpg", alt: "A worker on a plank plastering a wall beside a window opening", width: 1200, height: 1600 },
    { src: "/images/reno-interior-1.jpg", alt: "Upper floor stripped back to brick and concrete, ready for new walls and finishes", width: 1600, height: 1200 },
  ] as Photo[],
};

export const serviceGroups = [
  {
    title: "Planning and design",
    summary: "Know what you are building, and what it will cost, before work starts.",
    items: [
      "Construction and renovation plans",
      "Design layouts and drawings",
      "2D and 3D views",
      "Consultancy",
      "Project management and supervision",
    ],
  },
  {
    title: "Structure and civil works",
    summary: "The frame, the roof, the ground around it, and everything that keeps water out.",
    items: ["Gray structure", "Water proofing", "Carpentry and steel work", "Road repair and paving"],
  },
  {
    title: "Building services",
    summary: "Power, water and cooling, installed before the walls are closed.",
    items: ["MEP works", "Electrical wiring", "Plumbing works", "AC and HVAC projects"],
  },
  {
    title: "Finishing",
    summary: "The surfaces you see and touch every day.",
    items: [
      "Finishing works",
      "Interior and exterior works",
      "Ceiling and aluminium glass works",
      "Tiles and marble works",
      "Paint and polish works",
      "Landscaping",
    ],
  },
];

export const engagements = [
  {
    id: "turnkey",
    label: "Turnkey",
    title: "Turnkey contract",
    description:
      "Hand us the whole job. We prepare the plans, source the materials, run every trade and hand the building back ready to use.",
    points: [
      "Plans, drawings and 2D or 3D views",
      "Materials sourced and checked by our team",
      "Every trade scheduled and supervised",
      "One team accountable from start to handover",
    ],
    cta: "Ask for a turnkey quote",
  },
  {
    id: "labour",
    label: "Labour rate",
    title: "Labour-rate contract",
    description:
      "Keep control of materials and spending. We bring skilled teams and engineering supervision, and you pay for the work done.",
    points: [
      "You choose and buy the materials",
      "Our engineers and skilled trades on site",
      "Work measured and billed at agreed rates",
      "Suits renovations and phased projects",
    ],
    cta: "Ask for labour rates",
  },
];

export const promises = [
  { id: "materials", title: "Quality materials", text: "Materials checked before they go into your building." },
  { id: "team", title: "Expert team", text: "Professional engineers leading skilled trades." },
  { id: "safe", title: "Safe and reliable", text: "Safe sites and work that holds up for years." },
  { id: "time", title: "On-time completion", text: "A schedule agreed at the start, and kept." },
  { id: "rates", title: "Reasonable rates", text: "Fair prices for homes and businesses alike." },
] as const;
