export const business = {
  name: "Kashar Home Solutions",
  // Main number, used for calls and WhatsApp.
  phoneDisplay: "0332 1788788",
  phoneHref: "tel:+923321788788",
  whatsappNumber: "923321788788",
  // Second line for calls.
  secondPhoneDisplay: "0300 8616788",
  secondPhoneHref: "tel:+923008616788",
  // Office landline, calls only.
  landlineDisplay: "052-4267888",
  landlineHref: "tel:+92524267888",
  email: "Kashar_impex@yahoo.com",
};

// Office location. Write the address as people should read it; line breaks are kept. mapQuery is what
// Google Maps searches for: shop and floor numbers confuse it, so it names the plaza and road only.
export const office = {
  address: "Shop No. 14–15, First Floor\nCantonment Plaza\nJamia Masjid Road, Sialkot Cantt",
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

// The types of work the "Our work" grid can be filtered by, in the order the chips appear.
export const workCategories = [
  { id: "roads", label: "Roads" },
  { id: "woodwork", label: "Woodwork" },
  { id: "tilework", label: "Tilework" },
  { id: "roof-treatment", label: "Roof treatment" },
  { id: "media-wall", label: "Media wall" },
  { id: "paint-work", label: "Paint work" },
  { id: "ceiling-design", label: "Ceiling design" },
  { id: "plumbing", label: "Plumbing" },
  { id: "tuff-tile", label: "Tuff tile" },
  { id: "pcc", label: "PCC" },
  { id: "steel-work", label: "Steel work" },
  { id: "construction", label: "Construction" },
] as const;

export type WorkCategory = (typeof workCategories)[number]["id"];

export type WorkItem = {
  id: string;
  category: WorkCategory;
  title: string;
  summary: string;
  // One photo, or several stages (before and after, steel and concrete) switched on the card.
  views: WorkView[];
  // Photos from different sites rather than stages of one: the card steps through them (‹ 2 / 6 ›).
  gallery?: boolean;
};

const photos = (dir: string, name: string, list: [string, number, number][]): WorkView[] =>
  list.map(([alt, width, height], i) => ({
    label: `Photo ${i + 1}`,
    src: `/images/${dir}/${name}-${i + 1}.jpg`,
    alt,
    width,
    height,
  }));

export const work: WorkItem[] = [
  {
    id: "repaint",
    category: "paint-work",
    title: "Two-storey building, repainted",
    summary: "Damaged plaster repaired, walls painted white, and trims and window canopies picked out in grey.",
    views: [
      { label: "Before", src: "/images/repaint-before.jpg", alt: "Building with stained, peeling cream walls and red window canopies", width: 1148, height: 760 },
      { label: "After", src: "/images/repaint-after.jpg", alt: "The same building freshly painted white with grey trims and canopies", width: 1148, height: 760 },
    ],
  },
  {
    id: "paint-house",
    category: "paint-work",
    title: "House exterior, patched and repainted",
    summary: "Cracks and patches filled and sanded, then the walls painted cream with maroon window surrounds.",
    views: [
      { label: "Before", src: "/images/paint/house-before.jpg", alt: "A house front with bare, patched plaster and filler marks, workers on the roof", width: 1280, height: 720 },
      { label: "After", src: "/images/paint/house-after.jpg", alt: "The same house front painted cream with maroon window surrounds, a painter finishing the top", width: 1599, height: 899 },
    ],
  },
  {
    id: "paint-door",
    category: "paint-work",
    title: "Wooden door, polished",
    summary: "An old panelled door stained and polished by hand to a deep, even gloss.",
    views: [
      { label: "Polishing", src: "/images/paint/door-polishing.jpg", alt: "A painter brushing polish onto a panelled wooden door over protective sheets", width: 1204, height: 1600 },
      { label: "Finished", src: "/images/paint/door-finished.jpg", alt: "The same door finished in a deep, glossy brown polish", width: 720, height: 1280 },
    ],
  },
  {
    id: "paint-classrooms",
    category: "paint-work",
    title: "School classrooms repainted",
    summary: "Damp-damaged plaster scraped back and repaired, then the classrooms and corridor repainted.",
    gallery: true,
    views: photos("paint", "classrooms", [
      ["A classroom with peeling, damp-damaged plaster above the window, a painter starting work", 1204, 1600],
      ["A painter rolling paint below damaged plaster, desks covered with plastic sheeting", 1600, 1204],
      ["A painter rolling fresh paint high on a classroom wall", 1204, 1600],
      ["A painter preparing a corridor wall near the floor", 780, 1040],
      ["A finished classroom with clean cream walls, desks and boards", 1040, 780],
      ["Another finished classroom with fresh cream walls and cabinets along one side", 1040, 780],
    ]),
  },
  {
    id: "wood-doors",
    category: "woodwork",
    title: "Carved panel doors",
    summary: "Solid doors with carved panels and mouldings, made in our workshop and finished in deep green.",
    gallery: true,
    views: photos("wood", "doors", [
      ["A row of carved green panel doors lined up in the workshop", 1600, 1200],
      ["Close-up of a carved green door with raised panels and a centre motif", 1200, 1600],
    ]),
  },
  {
    id: "wood-bookcase",
    category: "woodwork",
    title: "Built-in bookcase",
    summary: "A floor-to-ceiling bookcase with cube shelves and drawers, made in the workshop and fitted on site.",
    views: [
      { label: "Workshop", src: "/images/wood/bookcase-workshop.jpg", alt: "A cube-shelf bookcase carcass standing in the carpentry workshop", width: 960, height: 1280 },
      { label: "Installed", src: "/images/wood/bookcase-installed.jpg", alt: "The finished bookcase fitted into a wall niche, with cube shelves and drawers", width: 960, height: 1280 },
    ],
  },
  {
    id: "wood-storage",
    category: "woodwork",
    title: "Shelving and storage",
    summary: "Tall cabinets and open shelving built to fit the space exactly.",
    gallery: true,
    views: photos("wood", "storage", [
      ["A tall wood-finish cabinet with open shelves and an upper cupboard, fitted into a narrow niche", 576, 1280],
      ["Open wooden shelving with white drawers and recessed lights in a wall niche", 853, 1280],
    ]),
  },
  {
    id: "tile-floors",
    category: "tilework",
    title: "Large-format floor tiles",
    summary: "Glossy porcelain tiles laid with levelling clips over a prepared bed, then grouted with tight, even joints.",
    gallery: true,
    views: photos("tile", "floor", [
      ["A long room with new glossy floor tiles laid, walls still being plastered", 1200, 1600],
      ["Newly laid floor tiles in a room under renovation, ready for grouting", 1200, 1600],
      ["A worker laying large glossy tiles with levelling clips across a hall", 1200, 1600],
      ["Grey floor tiles laid with straight, even joints in a doorway", 900, 1600],
    ]),
  },
  {
    id: "tile-marble",
    category: "tilework",
    title: "Marble floors, laid and polished",
    summary: "Marble laid with dark border strips, then ground and polished on site to a mirror finish.",
    gallery: true,
    views: photos("tile", "marble", [
      ["A floor polishing machine working over a marble floor with dark border strips", 899, 1599],
      ["A polished marble floor with a dark border strip, reflecting the light", 1599, 899],
      ["Marble floor slabs laid in an open courtyard, before polishing", 720, 1280],
    ]),
  },
  {
    id: "tile-stairs",
    category: "tilework",
    title: "Granite staircase",
    summary: "Black granite treads and risers fitted to an open staircase, with matching skirting.",
    gallery: true,
    views: photos("tile", "stairs", [
      ["A black granite staircase with new treads and risers, seen from the side", 1530, 1530],
      ["The same granite staircase from below, finished up to the landing", 1530, 1530],
    ]),
  },
  {
    id: "tile-walls",
    category: "tilework",
    title: "Kitchen and bathroom wall tiles",
    summary: "Walls tiled floor to ceiling in kitchens and bathrooms, including feature patterns.",
    gallery: true,
    views: photos("tile", "wall", [
      ["White wall tiles going up around a bathroom being rebuilt", 1040, 780],
      ["A worker tiling the lower part of a kitchen wall in white", 1040, 780],
      ["A worker fitting grey and white wall tiles above a kitchen counter", 1280, 720],
      ["A feature wall of black and white zigzag tiles", 720, 1280],
    ]),
  },
  {
    id: "tile-roof",
    category: "tilework",
    title: "Rooftop tiles",
    summary: "Light, heat-reflecting tiles laid across an open rooftop on a fresh mortar bed.",
    views: [
      { label: "Laying", src: "/images/tile/roof-tiles.jpg", alt: "A worker laying white tiles on a mortar bed across an open rooftop", width: 1204, height: 1600 },
    ],
  },
  {
    id: "media-wall-marble",
    category: "media-wall",
    title: "Marble-effect media wall with fluted panels",
    summary: "A gold-veined marble sheet framed by dark fluted panels, fitted under a new false ceiling.",
    views: [
      { label: "Fitting", src: "/images/media-wall/marble-fitting.jpg", alt: "Two workers fitting a gold-veined marble-effect sheet to a lounge wall, sofas wrapped in plastic", width: 720, height: 1280 },
      { label: "Close-up", src: "/images/media-wall/marble-detail.jpg", alt: "Close-up of the marble-effect panel and the dark fluted panels either side", width: 1200, height: 1600 },
      { label: "Finished", src: "/images/media-wall/marble-finished.jpg", alt: "The finished media wall: a marble-effect centre panel between dark fluted panels, under downlights", width: 1200, height: 1600 },
    ],
  },
  {
    id: "media-wall-fluted",
    category: "media-wall",
    title: "TV walls with fluted panelling",
    summary: "Full-height fluted panels and a matching TV console, fitted on site.",
    gallery: true,
    views: photos("media-wall", "fluted", [
      ["A full-height dark fluted panel wall with a white and wood TV console, newly fitted", 538, 1439],
      ["A grey TV wall with a white marble-effect console, newly fitted", 538, 1439],
    ]),
  },
  {
    id: "media-wall-backlit",
    category: "media-wall",
    title: "Fluted and backlit TV walls",
    summary: "Fluted panels, stone-effect sheets and hidden LED strips that make the TV wall the centre of the room.",
    gallery: true,
    views: [
      { label: "Photo 1", src: "/images/media-wall/designs-1.jpg", alt: "A white TV panel with a warm LED glow, set against wooden fluted panels above a white console", width: 600, height: 1030 },
      { label: "Photo 2", src: "/images/media-wall/designs-2.jpg", alt: "Workers fitting stone-effect sheets between wooden fluted panels, with track lights above", width: 620, height: 1075 },
      { label: "Photo 3", src: "/images/media-wall/designs-3.jpg", alt: "A textured feature wall framed in wood, with open shelves above and a white floating console", width: 630, height: 1075 },
    ],
  },
  {
    id: "media-wall-wood",
    category: "media-wall",
    title: "Wood-finish media walls with shelving",
    summary: "Warm wood panelling, lit display niches and long floating consoles built as one piece.",
    gallery: true,
    views: [
      { label: "Photo 1", src: "/images/media-wall/designs-4.jpg", alt: "A media wall with a stone-effect centre panel, wooden fluted sides, lit shelves and a long wooden console", width: 1080, height: 1211 },
      { label: "Photo 2", src: "/images/media-wall/designs-5.jpg", alt: "A wooden fluted TV panel beside lit display shelves, above a white and wood floating console", width: 1080, height: 1236 },
    ],
  },
  {
    id: "ceiling-borders",
    category: "ceiling-design",
    title: "Carved ceiling borders",
    summary: "A false ceiling framed over the bare slab, then a carved border fitted and finished around it.",
    gallery: true,
    views: photos("ceiling", "borders", [
      ["Two workers on a scaffold fixing ceiling boards under a bare concrete slab", 1080, 1435],
      ["A worker on a scaffold beside a newly fitted carved ceiling border", 869, 1551],
      ["A worker finishing the carved border around a recessed ceiling panel", 876, 1575],
      ["The finished carved border framing a recessed ceiling, with a worker below", 847, 1414],
    ]),
  },
  {
    id: "ceiling-medallions",
    category: "ceiling-design",
    title: "Ornamental medallions and cove lighting",
    summary: "Decorative plaster medallions fitted by hand, with warm cove lights set into the ceiling.",
    gallery: true,
    views: photos("ceiling", "medallion", [
      ["A worker fitting a large ornamental plaster medallion to a ceiling", 913, 1573],
      ["A finished living room with ceiling medallions, cove lighting and an ornamental wall roundel", 720, 1284],
    ]),
  },
  {
    id: "ceiling-false",
    category: "ceiling-design",
    title: "Gypsum false ceilings",
    summary: "Stepped false ceilings with recessed edges, ready for lights and fans.",
    gallery: true,
    views: photos("ceiling", "false", [
      ["A stepped gypsum false ceiling over a room with a split AC and a fan", 720, 1280],
      ["A false ceiling with a recessed border and a ceiling fan, in a room under renovation", 720, 1280],
      ["A diagonal stepped false ceiling with downlights in a room being finished", 720, 1280],
      ["A finished false ceiling with a raised centre panel and downlights", 720, 1280],
      ["A panelled false ceiling over a wall finished in wave-pattern panels", 720, 1280],
    ]),
  },
  {
    id: "ceiling-walls",
    category: "ceiling-design",
    title: "Matching wall mouldings and panels",
    summary: "Cornices, columns, carved panels and lit features that carry the ceiling design down the walls.",
    gallery: true,
    views: photos("ceiling", "walls", [
      ["A worker fitting a decorative moulding to a wall", 1035, 1377],
      ["A worker shaping a carved feature beside fluted wall panels", 901, 1575],
      ["A worker beside a fluted wall panel, newly fitted", 872, 1555],
      ["A wall of carved ornamental panels and columns, nearly finished", 1080, 812],
      ["A hall finished with plain moulded wall panels", 1029, 1580],
      ["A lit wall feature with diamond insets and a glowing border", 720, 1280],
      ["A doorway lined with wave-pattern 3D wall panels", 720, 1280],
    ]),
  },
  {
    id: "plumbing-drains",
    category: "plumbing",
    title: "New drainage pipework",
    summary: "Old floors opened up and new PVC drain and supply lines laid in channels, ready to be covered.",
    gallery: true,
    views: photos("plumbing", "pipes", [
      ["New PVC drain pipes and fittings laid in an opened-up bathroom floor", 720, 1280],
      ["Two new PVC pipes laid in a channel cut through a concrete floor", 720, 1280],
    ]),
  },
  {
    id: "tuff-tile-junction",
    category: "tuff-tile",
    title: "Relaying tuff tile at a roadside junction",
    summary: "Broken and sunken paving lifted, the bed levelled, and the tiles relaid in a herringbone pattern.",
    gallery: true,
    views: photos("tuff-tile", "relaying", [
      ["A worker relaying tuff tiles by hand at a roadside junction, with lifted tiles stacked nearby", 899, 1599],
      ["Newly relaid herringbone paving beside the road, with old tiles and cement bags still to clear", 1530, 1530],
    ]),
  },
  {
    id: "pcc-forecourt",
    category: "pcc",
    title: "Concrete forecourt for a row of shops",
    summary: "The ground levelled, a brick ballast base laid and compacted, then plain cement concrete poured.",
    views: [
      { label: "Ground", src: "/images/pcc/stage-ground.jpg", alt: "A tractor levelling bare earth in front of a two-storey row of shops", width: 1280, height: 1280 },
      { label: "Brick base", src: "/images/pcc/stage-base.jpg", alt: "Broken brick spread as a base layer beside a paved footpath, with a tractor behind", width: 1280, height: 1280 },
      { label: "Concrete", src: "/images/pcc/stage-concrete.jpg", alt: "Freshly poured concrete covering the whole area in front of the shops", width: 1280, height: 960 },
    ],
  },
  {
    id: "pcc-forecourt-steps",
    category: "pcc",
    title: "The same job, step by step",
    summary: "Every stage of the forecourt, from clearing the ground to the finished concrete.",
    gallery: true,
    views: photos("pcc", "job", [
      ["A tractor clearing and levelling the ground beside the road", 1280, 1280],
      ["A tractor and worker levelling earth next to a paved footpath", 1280, 720],
      ["A worker spreading broken brick across the levelled ground", 1530, 1530],
      ["A worker with a shovel spreading the brick base in front of the shops", 1530, 1530],
      ["Two workers levelling the brick base in front of the shop row", 1530, 1530],
      ["Fresh concrete poured up to the edge of the brick base", 1204, 1600],
      ["The finished concrete forecourt in front of the shops, looking down the road", 1280, 960],
      ["The finished concrete stretching across to the junction", 1280, 960],
    ]),
  },
  {
    id: "filtration-plant",
    category: "pcc",
    title: "Water filtration plant, new floor and steps",
    summary: "The broken slab over the drain replaced with a new concrete floor, steps and walkway.",
    views: [
      { label: "Before", src: "/images/filtration-plant-before.jpg", alt: "Water filtration plant with a broken concrete step over an open drain", width: 1148, height: 760 },
      { label: "After", src: "/images/filtration-plant-after.jpg", alt: "New concrete floor and steps in front of the water filtration plant taps, taped off to cure", width: 1148, height: 760 },
    ],
  },
  {
    id: "steel-canopy",
    category: "steel-work",
    title: "Steel lattice canopy",
    summary: "A steel frame welded together on the roof, raised into place and finished with a patterned panel ceiling.",
    gallery: true,
    views: photos("steel", "canopy", [
      ["A welded steel lattice frame laid out on a rooftop", 720, 1280],
      ["Workers welding the steel lattice frame on the roof", 780, 1040],
      ["The finished canopy from below, steel lattice over patterned ceiling panels", 1280, 1280],
    ]),
  },
  {
    id: "steel-pergola",
    category: "steel-work",
    title: "Steel pergola with decorative columns",
    summary: "Lattice steel columns and a patterned frame welded on site over a terrace.",
    views: [
      { label: "Welding", src: "/images/steel/pergola.jpg", alt: "A welder in a mask joining the top of a decorative steel pergola over a terrace", width: 720, height: 1450 },
    ],
  },
  {
    id: "steel-benches",
    category: "steel-work",
    title: "Steel-framed benches",
    summary: "Rows of steel-framed benches made for an outdoor seating area.",
    views: [
      { label: "Benches", src: "/images/steel/benches.jpg", alt: "Rows of new steel-framed benches with curved grey seats on a lawn", width: 720, height: 1280 },
    ],
  },
  {
    id: "askari-162-elevation",
    category: "construction",
    title: "Askari 2, House #162",
    summary: "A full renovation of a two-storey house in Askari 2, Sialkot Cantt, with a new modern front elevation.",
    views: [
      { label: "Before", src: "/images/askari-162/exterior-1.jpg", alt: "The old front of House #162 in Askari 2, plain grey plaster with wooden gates", width: 1600, height: 1200 },
      { label: "Final design", src: "/images/askari-162/elevation-design.jpg", alt: "3D design of the new front elevation of House #162: stone-effect cladding, black marble panels, a slatted feature screen and a black gate", width: 1210, height: 1280 },
    ],
  },
  {
    id: "askari-162-exterior",
    category: "construction",
    title: "Askari 2, House #162: work under way",
    summary: "The house during the renovation, with materials on site and the upper floor being opened up.",
    gallery: true,
    views: photos("askari-162", "exterior", [
      ["Front of House #162 in Askari 2, with new wooden gates and building sand outside", 1600, 1200],
      ["House #162 from the street, renovation under way", 1600, 1200],
      ["House #162 from the other side of the street, with materials piled by the gate", 1600, 1200],
      ["The gate of House #162, with the house number plate and the upper floor being opened up", 1200, 1600],
    ]),
  },
  {
    id: "askari-162-openings",
    category: "construction",
    title: "Askari 2, House #162: new openings",
    summary: "Walls cut through for new windows and doorways, with the edges trimmed and squared by hand.",
    gallery: true,
    views: photos("askari-162", "openings", [
      ["A worker cutting a new window opening through a wall at House #162", 1200, 1600],
      ["A worker breaking out a new doorway beside the staircase", 1200, 1600],
      ["A worker on a plank squaring the top of a new opening", 1200, 1600],
      ["A worker shaping the edge of a new window opening against the light", 1200, 1600],
      ["A new opening cut through, with the worker standing on a plank across it", 1200, 1600],
    ]),
  },
  {
    id: "askari-162-interior",
    category: "construction",
    title: "Askari 2, House #162: stripped back and replastered",
    summary: "The upper floor opened into one space down to the structure, then the walls replastered.",
    gallery: true,
    views: photos("askari-162", "interior", [
      ["The upper floor of House #162 stripped back to the structure, opened into one space", 1600, 1200],
      ["The same floor from the other end, with new openings along the front", 1600, 1200],
      ["A worker replastering a wall at House #162", 1600, 1200],
    ]),
  },
  {
    id: "slab",
    category: "construction",
    title: "New roof slab",
    summary: "Steel mesh and electrical conduits laid out, then the concrete poured and levelled.",
    views: [
      { label: "Steel", src: "/images/slab-steel.jpg", alt: "Workers laying steel reinforcement and conduits on a roof over brick walls", width: 1148, height: 760 },
      { label: "Concrete", src: "/images/slab-pour.jpg", alt: "Workers levelling freshly poured concrete over the roof steel", width: 1148, height: 760 },
    ],
  },
  {
    id: "construction-building",
    category: "construction",
    title: "New three-storey building",
    summary: "From the first walls on a cleared plot, through the propped slabs and brick structure, to the plastered shell.",
    gallery: true,
    views: photos("construction", "building", [
      ["The first walls rising on a cleared plot, with rubble still to clear", 1280, 960],
      ["Steel props holding up a freshly cast slab overnight", 720, 1280],
      ["A three-storey brick structure with balconies, still under construction", 1280, 960],
      ["The three-storey building with its frame plastered and box balconies formed", 1280, 960],
    ]),
  },
  {
    id: "construction-walls",
    category: "construction",
    title: "Opening up and rebuilding walls",
    summary: "Old walls cut back for wider openings, then new brick walls built and supported for the next stage.",
    gallery: true,
    views: photos("construction", "walls", [
      ["A wall opened up in a hall, with rubble and scaffolding inside the new opening", 1600, 1200],
      ["The same hall from the stairs, with the new openings cut through", 1600, 1200],
      ["Looking through the cut openings into the rooms beyond", 1600, 1200],
      ["A room stripped back to brick, with new openings and doorways", 1600, 1200],
      ["Two workers building a new brick wall beside the staircase", 1200, 1600],
      ["A worker building a new brick wall across an opening", 900, 1600],
    ]),
  },
  {
    id: "construction-kitchen",
    category: "construction",
    title: "Kitchen stripped out and rebuilt",
    summary: "Old tiles and walls taken down to the brick, then the kitchen rebuilt with new counters.",
    gallery: true,
    views: photos("construction", "kitchen", [
      ["A kitchen with old wall tiles stripped back to the brick, rubble on the floor", 1600, 1200],
      ["The same kitchen from another angle during the strip-out", 1600, 1200],
      ["Looking into the stripped kitchen through the doorway", 1200, 1600],
      ["The rebuilt kitchen with a black stone counter and fresh walls", 1200, 1600],
    ]),
  },
  {
    id: "waterproofing",
    category: "roof-treatment",
    title: "Roof waterproofing",
    summary: "The old roof cleaned and coated with bitumen, sealed right up to the parapet walls.",
    views: [
      { label: "Applying", src: "/images/waterproof-3.jpg", alt: "A worker spreading bitumen across a flat roof with a squeegee", width: 1080, height: 476 },
      { label: "Coated", src: "/images/waterproof-2.jpg", alt: "A flat roof fully coated in glossy black bitumen", width: 1080, height: 466 },
    ],
  },
  {
    id: "roof-membrane",
    category: "roof-treatment",
    title: "Torch-on membrane waterproofing",
    summary: "The bare roof cleaned and primed with bitumen, then membrane rolls torched down and sealed at every joint.",
    gallery: true,
    views: photos("roof", "membrane", [
      ["A bare, plastered flat roof cleaned and ready for waterproofing", 1280, 720],
      ["The corner of a flat roof cleaned down to the concrete before treatment", 1280, 720],
      ["A worker brushing bitumen primer onto the roof beside rolls of membrane", 900, 1600],
      ["A worker torching membrane rolls down onto the primed roof", 900, 1600],
    ]),
  },
  {
    id: "roof-bitumen",
    category: "roof-treatment",
    title: "Hot bitumen roof coating",
    summary: "A thick, glossy coat of bitumen spread across the roof and up to the parapet walls.",
    views: [
      { label: "Coating", src: "/images/roof/bitumen-coat.jpg", alt: "A flat roof half covered in a fresh, glossy black bitumen coat", width: 1204, height: 1600 },
    ],
  },
  {
    id: "roads-laying",
    category: "roads",
    title: "Laying fresh asphalt",
    summary: "Damaged stretches cut back and filled with hot asphalt, then raked level by hand.",
    gallery: true,
    views: photos("roads", "laying", [
      ["Workers raking hot asphalt into a road patch beside a white boundary wall", 1204, 1600],
      ["Loose asphalt spread along a road edge next to a lawn, with workers and a tractor behind", 1204, 1600],
      ["A worker levelling a wide asphalt patch with a rake", 1204, 1600],
      ["A worker raking asphalt into a patch at a market corner beside paving tiles", 1204, 1600],
      ["A patch of loose asphalt at a road junction, with a motorcyclist passing", 1204, 1600],
      ["A narrow strip of fresh asphalt beside a stop barrier, with a roller waiting behind", 1204, 1600],
      ["Fresh asphalt laid along one side of a residential road lined with villas and palms", 1200, 1600],
      ["Workers laying asphalt behind a work in progress sign at a cantonment gate", 960, 1280],
    ]),
  },
  {
    id: "roads-rolling",
    category: "roads",
    title: "Rolling and compacting",
    summary: "A road roller presses every patch flat and firm, so it holds up under traffic.",
    gallery: true,
    views: photos("roads", "rolling", [
      ["A road roller compacting a long asphalt patch in the shade", 1204, 1600],
      ["A road roller beside a freshly filled patch, ready to compact it", 1280, 960],
      ["A road roller standing on a compacted patch at a junction", 1280, 960],
      ["A long strip of new asphalt down a tree-lined road, with the roller at work in the distance", 1204, 1600],
      ["A rolled asphalt patch at a busy crossing, with the roller beside the traffic", 1600, 1204],
    ]),
  },
  {
    id: "roads-finished",
    category: "roads",
    title: "Finished road patches",
    summary: "Smooth, level patches that meet the old road cleanly and are ready for traffic.",
    gallery: true,
    views: photos("roads", "finished", [
      ["A smooth, finished asphalt patch across a wide tree-lined road", 1204, 1600],
      ["A smooth new asphalt strip down a residential road lined with villas", 1204, 1600],
      ["A finished asphalt patch along a road edge beside a fenced lawn", 1280, 960],
      ["A finished asphalt stretch on a road lined with palm trees", 1204, 1600],
      ["A finished asphalt patch at a roundabout, with a car driving over it", 1204, 1600],
      ["Workers finishing the edge of a smooth, rolled asphalt patch next to a tractor", 1204, 1600],
    ]),
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
    id: "lumpsum",
    label: "Lump sum",
    title: "Lump sum contract",
    description:
      "One fixed price for the whole job. We make the plans, buy the materials, run every trade and hand the building over ready to use.",
    points: [
      "Plans, drawings and 2D or 3D views",
      "Materials sourced and checked by our team",
      "Every trade scheduled and supervised",
      "One team accountable from start to handover",
    ],
    cta: "Ask for a lump sum price",
  },
  {
    id: "labour",
    label: "Labour rate",
    title: "Labour-rate contract",
    description:
      "You buy the materials. We bring skilled workers and engineers, and you pay for the work done at agreed rates.",
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
