import { getCollection, type CollectionEntry } from 'astro:content';

export type Park = CollectionEntry<'parks'>;
export type Trail = CollectionEntry<'trails'>;
export type Thought = CollectionEntry<'thoughts'>;

// Drafts show while you work locally, but never on the live site.
const visible = <T extends { data: { draft: boolean } }>(e: T) =>
  import.meta.env.PROD ? !e.data.draft : true;

export async function getParks(): Promise<Park[]> {
  const all = (await getCollection('parks')).filter(visible);
  return all.sort((a, b) => b.data.visited.getTime() - a.data.visited.getTime());
}

export async function getTrails(): Promise<Trail[]> {
  const all = (await getCollection('trails')).filter(visible);
  return all.sort((a, b) => b.data.visited.getTime() - a.data.visited.getTime());
}

export async function getThoughts(): Promise<Thought[]> {
  const all = (await getCollection('thoughts')).filter(visible);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function trailsInPark(trails: Trail[], parkId: string): Trail[] {
  return trails.filter((t) => t.data.park.id === parkId);
}

// Links work from either side: set them on the trail, the post, or both.
export function thoughtsForTrail(trail: Trail, thoughts: Thought[]): Thought[] {
  const ids = new Set(trail.data.relatedThoughts.map((r) => r.id));
  return thoughts.filter(
    (t) => ids.has(t.id) || t.data.relatedTrails.some((r) => r.id === trail.id),
  );
}

export function trailsForThought(thought: Thought, trails: Trail[]): Trail[] {
  const ids = new Set(thought.data.relatedTrails.map((r) => r.id));
  return trails.filter(
    (t) => ids.has(t.id) || t.data.relatedThoughts.some((r) => r.id === thought.id),
  );
}

export const CATEGORIES = [
  { name: 'Reflections', slug: 'reflections', blurb: 'Slow, personal essays.' },
  { name: 'Books', slug: 'books', blurb: "What I'm reading and what it stirs up." },
  { name: 'Everything Else', slug: 'everything-else', blurb: "Whatever doesn't fit elsewhere." },
] as const;

export const categorySlug = (name: string) =>
  CATEGORIES.find((c) => c.name === name)?.slug ?? 'everything-else';

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const trailCount = (n: number) => `${n} ${n === 1 ? 'trail' : 'trails'} reviewed`;
