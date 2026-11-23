/**
 * Project content. Images live in /public/work/<slug>/.
 * Add, remove or reorder projects here — the 3D line, index, gallery
 * and detail pages all update automatically.
 */

export type Category = "UI/UX" | "Branding" | "Social" | "Apparel";

export type Plate = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Set to false to keep a plate on its project page but off the Gallery table. */
  inGallery?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: Category;
  discipline: string;
  year: string;
  role: string;
  tools: string[];
  deliverables: string[];
  summary: string;
  description: string[];
  /** Index into `plates` used on the 3D line and as the cover. */
  cover: number;
  plates: Plate[];
};

const L = (slug: string, n: string, width: number, height: number, alt: string): Plate => ({
  src: `/work/${slug}/${n}`,
  width,
  height,
  alt,
});

export const projects: Project[] = [
  {
    slug: "lapor-pak",
    title: "Lapor Pak!",
    client: "Academic project",
    category: "UI/UX",
    discipline: "Mobile & web UI/UX",
    year: "2023",
    role: "UI/UX & visual design",
    tools: ["Figma", "Adobe Photoshop"],
    deliverables: ["Mobile app flows", "Admin dashboard", "Presentation boards"],
    summary: "A crime-reporting app, designed end to end — from sign-up to the officer's desk.",
    description: [
      "Lapor Pak! lets citizens report incidents from their phone and lets administrators follow every report through to resolution. The brief was to make a stressful moment feel calm and guided.",
      "The mobile flow covers registration, identity verification with a KTP upload and OTP, and report submission. The web dashboard gives admins a clear queue: who reported, what happened and whether it still needs a response.",
      "A deep, trustworthy blue carries the brand across both surfaces, with generous form spacing and plain-language prompts throughout.",
    ],
    cover: 0,
    plates: [
      L("lapor-pak", "00.webp", 1750, 1250, "Lapor Pak! mobile screens: login, registration, KTP verification and review"),
      { ...L("lapor-pak", "01.jpg", 2400, 1714, "Lapor Pak! mobile and web UI/UX cover board"), inGallery: false },
      L("lapor-pak", "03.jpg", 1080, 1080, "Lapor Pak! registration and KTP verification screens"),
      L("lapor-pak", "04.jpg", 1750, 1250, "Lapor Pak! admin dashboard"),
      L("lapor-pak", "05.jpg", 1750, 1250, "Lapor Pak! admin report list with response status"),
      { ...L("lapor-pak", "06.jpg", 1080, 1080, "Lapor Pak! admin dashboard with report history"), inGallery: false },
    ],
  },
  {
    slug: "mascot-marks",
    title: "Mascot Marks",
    client: "Freelance gig gallery",
    category: "Branding",
    discipline: "Logo & mascot design",
    year: "2023",
    role: "Illustration & logo design",
    tools: ["Adobe Photoshop"],
    deliverables: ["Mascot logos", "Crest emblems", "Gig gallery boards"],
    summary: "Esports mascots and crests — loud, symmetrical, built to read at thumbnail size.",
    description: [
      "A series of mascot and crest marks made for a freelance gig gallery: a lizard for Yummy, a winged crest for Aero League, and two badge-style emblems.",
      "Each mark is drawn for the places esports logos actually live — avatars, jerseys and stream overlays — so silhouettes stay bold and colours stay limited.",
    ],
    cover: 0,
    plates: [
      L("mascot-marks", "01.jpg", 2100, 1500, "Yummy esports lizard mascot logo"),
      L("mascot-marks", "02.jpg", 2100, 1500, "Purple and gold shield crest logo"),
      L("mascot-marks", "03.jpg", 2100, 1500, "Red winged emblem logo"),
      L("mascot-marks", "04.jpg", 2100, 1500, "Aero League winged crest logo"),
    ],
  },
  {
    slug: "britter",
    title: "Britter",
    client: "Britter",
    category: "Social",
    discipline: "Social media carousel",
    year: "2026",
    role: "Social media design",
    tools: ["Adobe Photoshop"],
    deliverables: ["Instagram carousels", "Feed layouts", "Mascot compositions"],
    summary: "Editorial carousels on education and current topics, fronted by an owl mascot.",
    description: [
      "Carousel content for Britter's Instagram feed — explainers and news-style posts on education and current topics.",
      "A fixed system of teal, navy and yellow panels keeps a busy feed consistent, while the owl mascot gives the account a friendly face on the most-shared slides.",
    ],
    cover: 0,
    plates: [L("britter", "01.jpg", 1750, 1250, "Britter Instagram carousel series with owl mascot")],
  },
  {
    slug: "streetwear",
    title: "Furies & M-Series",
    client: "Apparel concepts",
    category: "Apparel",
    discipline: "T-shirt graphics",
    year: "2023",
    role: "Apparel graphic design",
    tools: ["Adobe Photoshop"],
    deliverables: ["Front & back prints", "Mock-ups", "Stand-alone artwork"],
    summary: "Streetwear prints: a halftone horror-film tribute and a quiet car-culture tee.",
    description: [
      "Two apparel graphics with opposite tempers. Furies is loud — a halftone, acid-green figure under hand-drawn orange lettering, printed edge to edge.",
      "The M-Series tee is restrained: a small chest mark on the front and a classic car with a short spec paragraph across the back.",
    ],
    cover: 0,
    plates: [
      L("streetwear", "01.jpg", 1080, 1080, "Furies t-shirt front and back mock-up"),
      { ...L("streetwear", "02.jpg", 2400, 2400, "Furies halftone figure artwork"), inGallery: false },
      L("streetwear", "03.jpg", 1080, 1080, "M-Series car tee front and back mock-up"),
      { ...L("streetwear", "04.jpg", 2400, 2400, "M-Series tee back print"), inGallery: false },
      { ...L("streetwear", "05.jpg", 2400, 2400, "M-Series tee front with small chest mark"), inGallery: false },
    ],
  },
  {
    slug: "fromfit",
    title: "Fromfit",
    client: "Editorial blog concept",
    category: "UI/UX",
    discipline: "Landing page design",
    year: "2023",
    role: "Web & visual design",
    tools: ["Figma"],
    deliverables: ["Landing page", "Feature layout", "Feed promo"],
    summary: "A dark, cinematic landing page for a lifestyle and culture blog.",
    description: [
      "Fromfit is a blog covering lifestyle, movies, sport, tech and music. The landing page leads with one big, moody feature story and lets the rest of the grid follow.",
      "A near-black canvas, restrained navigation and large photography give the writing room to breathe.",
    ],
    cover: 0,
    plates: [
      L("fromfit", "01.jpg", 1750, 1250, "Fromfit blog landing page in dark theme"),
      { ...L("fromfit", "02.jpg", 1080, 1080, "Fromfit landing page promotional post"), inGallery: false },
    ],
  },
  {
    slug: "bca-mobile",
    title: "Mobile Banking Study",
    client: "Self-initiated concept",
    category: "UI/UX",
    discipline: "Mobile UI concept",
    year: "2023",
    role: "UI design",
    tools: ["Figma"],
    deliverables: ["Login screen", "Home dashboard", "Presentation board"],
    summary: "A redesign study of a mobile banking home screen — fewer taps, clearer hierarchy.",
    description: [
      "A self-initiated redesign study of a familiar banking app. The login screen is reduced to three large entry points; the home screen groups everyday actions into a single icon grid with recent transactions underneath.",
      "This is an unofficial concept, made for practice and not affiliated with the bank.",
    ],
    cover: 0,
    plates: [L("bca-mobile", "01.jpg", 1750, 1250, "Mobile banking app concept: login and home screens")],
  },
  {
    slug: "bilss",
    title: "Bilss",
    client: "PT Bilss.id",
    category: "Social",
    discipline: "Brand & social media",
    year: "2026",
    role: "Brand & social media design",
    tools: ["Adobe Photoshop", "Adobe Illustrator"],
    deliverables: ["Instagram feed posts", "Campaign series", "Educational content"],
    summary: "Social content for a cleaning and security service — hooks that stop the scroll, in one strong blue.",
    description: [
      "Instagram content for Bilss, a cleaning and security service provider. The feed mixes campaign hooks like \"Too Busy to Maintain a Clean Spot?\" and \"Choose Your Path!\" with educational series such as Mitos atau Fakta, Did You Know and Stop Scroll!",
      "A single deep-blue system, bold tilted headlines and real team photography keep every post recognisably Bilss, while contact details sit in a consistent footer so each post works as a lead generator.",
    ],
    cover: 0,
    plates: [L("bilss", "01.jpg", 1750, 1250, "Bilss Instagram feed: cleaning and security service campaign posts")],
  },
  {
    slug: "mercu-buana-center",
    title: "Mercu Buana Center",
    client: "PT Mercu Buana Center",
    category: "UI/UX",
    discipline: "Website UI/UX redesign",
    year: "2026",
    role: "UI/UX designer (internship)",
    tools: ["Figma"],
    deliverables: ["Website redesign", "Wireframes & high-fidelity prototypes", "Usability testing"],
    summary: "A company-profile website redesign for an outsourcing and consulting group — clearer services, proof and trust.",
    description: [
      "PT Mercu Buana Center is an outsourcing and consulting group behind the Bilss and Britter brands. During my internship I redesigned its website interfaces across 38 pages and 12 screens to make the services easier to understand and the company easier to trust.",
      "The pages lead with what the company does, then back it up: headline numbers, a \"Why choose us\" section, client testimonials, a client logo wall, and vision and mission. A navy and teal system with real team photography keeps every page consistent.",
      "I worked from wireframes to high-fidelity prototypes in Figma, improved navigation and user flows, and ran usability testing with 4 participants, reaching a 98% task completion rate.",
    ],
    cover: 0,
    plates: [L("mercu-buana-center", "01.jpg", 1750, 1250, "Mercu Buana Center website redesign: services, stats, clients, vision and mission")],
  },
  {
    slug: "amor-esports",
    title: "Amor Esports",
    client: "Amor Esports",
    category: "Social",
    discipline: "Social media posters",
    year: "2020",
    role: "Graphic & social media design",
    tools: ["Adobe Photoshop"],
    deliverables: ["Commemorative posts", "Motivational posters", "Illustrated artwork"],
    summary: "Gritty red-and-white posters for an esports team — hand lettering, paper grain and lightning cracks.",
    description: [
      "Social media posters for Amor Esports, built around one rough, physical look: grainy paper, red brush strokes and lightning-crack textures.",
      "The set covers a Hari Sumpah Pemuda commemoration with a raised fist wrapped in the red-and-white flag, hand-lettered motivational posters like \"We Believe We Are Strong\" and \"Change / Amor Win\", and a silhouetted character illustration that carries the same mood.",
    ],
    cover: 0,
    plates: [L("amor-esports", "01.jpg", 1750, 1250, "Amor Esports social media posters: Sumpah Pemuda, motivational lettering and illustration")],
  },
  {
    slug: "rocket-crest",
    title: "Rocket Crest",
    client: "Freelance logo commission",
    category: "Branding",
    discipline: "Esports crest logo",
    year: "2023",
    role: "Logo design",
    tools: ["Adobe Illustrator", "Adobe Photoshop"],
    deliverables: ["Shield crest logo", "Colour version", "Presentation board"],
    summary: "A purple-and-gold shield crest where the letter A doubles as a rocket on lift-off.",
    description: [
      "A crest logo built on one idea: the letter A drawn as a rocket rising out of the shield, with curved exhaust trails sweeping up either side.",
      "Deep purple, bright gold and a soft lilac white keep the mark high-contrast, and the thick shield outline holds its shape at avatar and jersey sizes.",
    ],
    cover: 0,
    plates: [L("rocket-crest", "01.jpg", 1750, 1250, "Purple and gold shield crest logo with an A-shaped rocket")],
  },
];

export const categories: Category[] = ["UI/UX", "Branding", "Social", "Apparel"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNeighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return {
    index: i,
    prev: projects[(i - 1 + n) % n],
    next: projects[(i + 1) % n],
  };
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** Every plate shown on the Gallery table. */
export const allPlates = projects.flatMap((p) =>
  p.plates
    .map((plate, i) => ({ ...plate, project: p, plateIndex: i }))
    .filter((plate) => plate.inGallery !== false),
);
