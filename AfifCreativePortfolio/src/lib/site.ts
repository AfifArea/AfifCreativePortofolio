/**
 * Site-wide content. Edit here — every section reads from this file.
 */
export const site = {
  name: "Afif Maulana",
  brand: "Afif Portofolio",
  role: "Graphic Designer",
  location: "Jakarta, Indonesia",
  timezone: "Asia/Jakarta",
  tzLabel: "GMT+7",
  email: "afifmaulana220@gmail.com",
  phone: "+6285718901820",
  phoneDisplay: "+62 857 1890 1820",
  url: "https://afifportofolio.vercel.app",
  available: true,
  bio: "Fresh graduate in Information Systems from Trisakti University with experience in Visual Design and Social Media Design. Skilled in creating engaging visual content, social media designs, promotional materials, and creative concepts to strengthen brand identity and audience engagement. Creative, detail-oriented, and adaptable.",
  statement:
    "I design visuals that stop the scroll — social content, marks and campaigns that give a brand a voice people remember.",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/afif-maulana12/" },
    { label: "WhatsApp", href: "https://wa.me/6285718901820" },
  ],
  expertise: [
    "Visual Design",
    "Social Media Design",
    "Logo & Brand Identity",
    "Promotional Materials",
    "UI/UX Design",
  ],
  experience: [
    { role: "Brand & Social Media Designer", org: "Britter", period: "Jun 2026 — Present" },
    { role: "Brand & Social Media Designer", org: "PT Bilss.id", period: "Jan 2026 — Jul 2026" },
    { role: "UI/UX Designer Internship", org: "PT Mercu Buana Center", period: "Jan 2026 — Nov 2026" },
    { role: "Freelance Graphic Designer", org: "Independent", period: "Dec 2020 — May 2024" },
  ],
  education: [{ role: "S.Kom Information Systems", org: "Universitas Trisakti", period: "Jakarta" }],
  tools: ["Adobe Photoshop", "Adobe Illustrator", "Canva", "Figma", "Claude", "ChatGPT"],
} as const;

export const nav = [
  { label: "Main", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;
