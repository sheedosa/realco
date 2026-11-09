// Facts for the Realco site. Confirmed by the client: the company (I & A Realco Ltd, part of the I&A group), the three
// services and who they are for. Every other business detail is a labelled placeholder listed in toConfirm, and
// SITE.preview keeps the concept strip on every page.
export const SITE = {
  name: "Realco",
  legalName: "I & A Realco Ltd",
  group: "the I&A group",
  companyNumber: "[COMPANY NUMBER]",
  address: "[ADDRESS]",
  phone: "[PHONE]",
  email: "[EMAIL]",
  region: "South London",
  areasServed: "[AREAS SERVED]",
  hours: "[OPENING HOURS]",
  alsoListedOn: ["Airbnb", "Booking.com"],
  url: "https://sheedosa.github.io/realco",
  preview: true, // concept preview: managed homes, stays and projects are samples; nothing is sent or booked
  toConfirm: [
    "areas served (the eight areas on the map and list are a sample)",
    "service lines to confirm: Realco's own cleaners for stays; a site visit then a written quote for build",
    "Realco logo files (client has one); the roof-and-bricks marque stands in until then",
    "company number and registered address",
    "phone, email, opening hours and how enquiries are answered",
    "areas served (we assume South London)",
    "management fees for Rent collection and Fully managed (and VAT treatment), and exactly what each level covers",
    "whether tenant-finding is offered to landlords (the site shows management only)",
    "redress scheme and client money protection membership",
    "short-stay nightly prices, minimum stays, cleaning and deposit terms, check-in method, any benefit of booking direct",
    "building insurance and accreditations, typical lead times, guarantee terms",
    "real managed homes, apartments and completed projects, with before and after photographs",
    "client reviews (none are quoted in the preview)",
  ],
};

// Door order follows the audience: landlords and building clients first, guests third.
export type DoorId = "lettings" | "stays" | "build";
export const DOORS: { id: DoorId; name: string; path: string; strap: string; who: string }[] = [
  { id: "lettings", name: "Lettings", path: "/lettings", strap: "Property management for landlords", who: "For landlords" },
  { id: "build", name: "Build", path: "/build", strap: "Refurbishments and extensions", who: "For homeowners and landlords" },
  { id: "stays", name: "Stays", path: "/stays", strap: "Short stays, booked direct", who: "For guests" },
];
export const doorById = (id: DoorId) => DOORS.find((d) => d.id === id)!;

// Landlord calculator. Percentages are SAMPLE figures so the calculator works in the preview; the client supplies
// the real fee schedule (and VAT treatment) before launch. Each is a share of monthly rent.
export const SERVICE_LEVELS = [
  {
    id: "collect", name: "Rent collection", pct: 10,
    includes: ["Rent collected and chased", "Monthly statements", "Deposit and tenancy paperwork kept in order", "Annual rent review"],
    note: "You arrange repairs; we handle the money.",
  },
  {
    id: "managed", name: "Fully managed", pct: 14,
    includes: ["Everything in Rent collection", "Repairs arranged, through our own Build team where it helps", "Inspections and safety certificates", "Renewals and move-outs", "The tenant calls us, not you"],
    note: "We look after the home and the tenancy.",
  },
] as const;
export type ServiceLevelId = (typeof SERVICE_LEVELS)[number]["id"];

export const PROJECT_TYPES = ["Refurbishment", "Extension"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];
