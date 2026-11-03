// Facts for the Realco site. Nothing here has been confirmed by the client yet: every business detail is a
// labelled placeholder, listed in toConfirm, and SITE.preview keeps the concept banner on every page.
export const SITE = {
  name: "Realco",
  legalName: "[COMPANY NAME]",
  companyNumber: "[COMPANY NUMBER]",
  address: "[ADDRESS]",
  phone: "[PHONE]",
  email: "[EMAIL]",
  region: "South London",
  areasServed: "[AREAS SERVED]",
  hours: "[OPENING HOURS]",
  url: "https://sheedosa.github.io/realco",
  preview: true, // concept preview: listings, stays and projects are samples; nothing is sent or booked
  toConfirm: [
    "legal company name, company number, registered address",
    "phone, email, opening hours and how enquiries are answered",
    "areas served (we assume South London)",
    "lettings service levels and fees (Let only / Rent collection / Fully managed) and what each includes",
    "tenant fees under the Tenant Fees Act, deposit scheme, referencing provider",
    "redress scheme and client money protection membership",
    "short-let nightly prices, minimum stays, cleaning and deposit terms, check-in method",
    "construction services offered, insurance and accreditations, typical lead times, guarantee terms",
    "real listings, apartments and completed projects with photographs",
    "client reviews (none are quoted in the preview)",
  ],
};

export type DoorId = "lettings" | "stays" | "build";
export const DOORS: { id: DoorId; name: string; path: string; strap: string; verb: string }[] = [
  { id: "lettings", name: "Lettings", path: "/lettings", strap: "Let and manage your property, or find your next home", verb: "Let or rent" },
  { id: "stays", name: "Stays", path: "/stays", strap: "Short-term lets in South London, serviced and ready", verb: "Book a stay" },
  { id: "build", name: "Build", path: "/build", strap: "Refurbishments, extensions, lofts and new builds", verb: "Get a quote" },
];
export const doorById = (id: DoorId) => DOORS.find((d) => d.id === id)!;

// Landlord calculator. Percentages are SAMPLE figures so the calculator works in the preview; the client supplies
// the real fee schedule (and VAT treatment) before launch. Each is a share of monthly rent.
export const SERVICE_LEVELS = [
  { id: "let", name: "Let only", pct: 8, includes: ["Marketing and photographs", "Viewings and referencing", "Tenancy agreement and deposit registration"], note: "You manage the tenancy day to day." },
  { id: "collect", name: "Rent collection", pct: 10, includes: ["Everything in Let only", "Rent collected and chased", "Monthly statements"], note: "You handle maintenance; we handle the money." },
  { id: "managed", name: "Fully managed", pct: 14, includes: ["Everything in Rent collection", "Repairs and contractors arranged", "Inspections, compliance and renewals"], note: "We look after everything and the tenant calls us." },
] as const;
export type ServiceLevelId = (typeof SERVICE_LEVELS)[number]["id"];

export const PRICE_BANDS = [
  { id: 1, label: "Up to £[BAND 1] pcm" },
  { id: 2, label: "£[BAND 1] to £[BAND 2] pcm" },
  { id: 3, label: "Over £[BAND 2] pcm" },
] as const;

export const PROJECT_TYPES = ["Refurbishment", "Extension", "Loft conversion", "New build"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];
