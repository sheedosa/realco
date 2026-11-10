import { SITE } from "../data/site";

// A fact in SITE is "known" once the client has replaced its [PLACEHOLDER]. Controls (call buttons, phone and email
// links) are only drawn for known facts; until then the page shows one plain line where a reader looks for them.
export const known = (v: string) => !/\[[^\]]*\]/.test(v);
const or = (v: string) => (known(v) ? v : null);

export const CONTACT = { phone: or(SITE.phone), email: or(SITE.email), address: or(SITE.address), hours: or(SITE.hours) };
export const hasContact = Boolean(CONTACT.phone || CONTACT.email);
export const CONTACT_TO_COME = "Phone, email, office address and opening hours to come.";
