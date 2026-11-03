// All listing, stay and project data goes through this module. In the preview it reads listings.json; at launch the
// same interface is implemented against the lettings CRM / channel manager feed, and components do not change.
import data from "../data/listings.json";
import type { ProjectType } from "../data/site";

export type Room = { name: string; x: number; y: number; w: number; h: number; outside?: boolean; new?: boolean };
export type Plan = { w: number; h: number; rooms: Room[] };
export type Area = { name: string; x: number; y: number };

export type Letting = {
  handle: string; title: string; area: string; postcode: string; type: string;
  beds: number; baths: number; sqft: number; furnished: boolean; band: 1 | 2 | 3; available: string;
  summary: string; features: string[]; plan: Plan;
};
export type Stay = {
  handle: string; title: string; area: string; postcode: string;
  sleeps: number; beds: number; baths: number; minNights: number;
  summary: string; features: string[]; plan: Plan;
};
export type Project = {
  handle: string; title: string; area: string; type: ProjectType; size: string; duration: string;
  summary: string; scope: string[]; photos: string[]; plan: Plan;
};

const d = data as unknown as { areas: Area[]; lettings: Letting[]; stays: Stay[]; projects: Project[] };

export type LettingFilter = { beds?: number[]; band?: number[]; area?: string[]; furnished?: boolean | null };

export const store = {
  areas: (): Area[] => d.areas,
  lettings: (f: LettingFilter = {}): Letting[] =>
    d.lettings.filter((p) =>
      (!f.beds?.length || f.beds.includes(Math.min(p.beds, 3))) &&
      (!f.band?.length || f.band.includes(p.band)) &&
      (!f.area?.length || f.area.includes(p.area)) &&
      (f.furnished == null || p.furnished === f.furnished)),
  letting: (handle: string) => d.lettings.find((p) => p.handle === handle),
  stays: (): Stay[] => d.stays,
  stay: (handle: string) => d.stays.find((p) => p.handle === handle),
  projects: (type?: ProjectType | null): Project[] => d.projects.filter((p) => !type || p.type === type),
  project: (handle: string) => d.projects.find((p) => p.handle === handle),
};

