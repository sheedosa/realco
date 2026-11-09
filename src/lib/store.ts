// All managed-home, stay and project data goes through this module. In the preview it reads listings.json; at launch
// the same interface is implemented against the management system / channel manager feed, and components do not change.
import data from "../data/listings.json";
import type { ProjectType, ServiceLevelId } from "../data/site";

export type Room = { name: string; x: number; y: number; w: number; h: number; outside?: boolean; new?: boolean };
export type Plan = { w: number; h: number; rooms: Room[] };
export type Area = { name: string; x: number; y: number };

/** A home Realco manages for a landlord. Shown as evidence of the work, never as a home to rent. */
export type ManagedHome = {
  handle: string; title: string; area: string; postcode: string; type: string;
  beds: number; baths: number; sqft: number; level: ServiceLevelId; summary: string; plan: Plan;
};
export type Stay = {
  handle: string; title: string; area: string; postcode: string;
  sleeps: number; beds: number; baths: number; minNights: number;
  summary: string; features: string[]; photo: string; plan: Plan;
};
export type Project = {
  handle: string; title: string; area: string; type: ProjectType; size: string; duration: string;
  summary: string; scope: string[]; before: string; after: string; plan: Plan;
};

const d = data as unknown as { areas: Area[]; lettings: ManagedHome[]; stays: Stay[]; projects: Project[] };

export const store = {
  areas: (): Area[] => d.areas,
  managed: (): ManagedHome[] => d.lettings,
  stays: (): Stay[] => d.stays,
  stay: (handle: string) => d.stays.find((p) => p.handle === handle),
  projects: (type?: ProjectType | null): Project[] => d.projects.filter((p) => !type || p.type === type),
  project: (handle: string) => d.projects.find((p) => p.handle === handle),
};

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
