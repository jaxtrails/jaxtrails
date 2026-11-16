import rawBooks from '../data/america-250.json';
import { getThoughts, type Thought } from './content';

// ---------------------------------------------------------------------------
// America 250: the reading series.
//
// The list of 250 books lives in src/data/america-250.json (one entry per book,
// in reading order). Nothing about progress is typed in by hand:
//   - A book counts as READ when a (non-sample) post in src/content/thoughts has
//       series: america-250
//       book: <its number>
//   - The book you are CURRENTLY reading is the one number below.
//   - Everything else is "Up next".
// ---------------------------------------------------------------------------

export const SERIES = {
  slug: 'america-250',
  name: 'America 250',
  total: 250,
  // Change this to the number of the book you are reading now.
  currentlyReading: 1,
} as const;

export interface Book {
  n: number;
  era: number;
  type: string;
  title: string;
  author: string;
  year: number;
  period: string;
  pages: number;
}

export const BOOKS = rawBooks as Book[];

export interface Era {
  n: number;
  name: string;
  start: number;
  end: number;
  quota: number;
}

export const ERAS: Era[] = [
  { n: 1, name: 'Native America & Contact', start: 1491, end: 1606, quota: 8 },
  { n: 2, name: 'Colonial America', start: 1607, end: 1762, quota: 16 },
  { n: 3, name: 'Revolution & Founding', start: 1763, end: 1788, quota: 26 },
  { n: 4, name: 'Early Republic', start: 1789, end: 1828, quota: 18 },
  { n: 5, name: 'Expansion & Antebellum', start: 1829, end: 1860, quota: 20 },
  { n: 6, name: 'Civil War', start: 1861, end: 1865, quota: 22 },
  { n: 7, name: 'Reconstruction & Gilded Age', start: 1866, end: 1900, quota: 22 },
  { n: 8, name: 'Progressive Era & WWI', start: 1901, end: 1919, quota: 16 },
  { n: 9, name: 'Jazz Age & Great Depression', start: 1920, end: 1940, quota: 16 },
  { n: 10, name: 'World War II', start: 1941, end: 1945, quota: 18 },
  { n: 11, name: 'Postwar & Early Cold War', start: 1946, end: 1963, quota: 16 },
  { n: 12, name: 'Civil Rights, Vietnam & Upheaval', start: 1964, end: 1980, quota: 20 },
  { n: 13, name: "Reagan Era & Cold War's End", start: 1981, end: 1991, quota: 12 },
  { n: 14, name: 'Post-Cold War to Today', start: 1992, end: 2026, quota: 20 },
];

export const eraOf = (book: Book) => ERAS[book.era - 1];
export const eraSpan = (era: Era) => `${era.start} to ${era.end}`;
export const bookByNumber = (n: number) => BOOKS.find((b) => b.n === n);

// "Atlas of a Lost World: Travels in Ice Age America" -> main + subtitle
export function splitTitle(title: string): { main: string; sub: string } {
  const i = title.indexOf(': ');
  return i === -1 ? { main: title, sub: '' } : { main: title.slice(0, i), sub: title.slice(i + 2) };
}

export type Status = 'read' | 'reading' | 'next';

export interface SeriesState {
  // Every post in the series (reviews plus the intro post), newest first.
  posts: Thought[];
  // Reviews only (posts tied to a book number), newest first.
  reviews: Thought[];
  // book number -> its review post, if one exists
  reviewByBook: Map<number, Thought>;
  // book number -> reading status
  status: (n: number) => Status;
  readCount: number;
  readByEra: number[]; // index = era number - 1
}

export async function getSeriesState(): Promise<SeriesState> {
  const all = await getThoughts();
  const posts = all.filter((t) => t.data.series === SERIES.slug);
  const reviews = posts.filter((t) => t.data.book !== undefined);
  const reviewByBook = new Map<number, Thought>();
  for (const r of reviews) reviewByBook.set(r.data.book as number, r);

  // Sample reviews show the layout but do not count toward progress.
  const countsAsRead = (n: number) => {
    const r = reviewByBook.get(n);
    return !!r && !r.data.sample;
  };

  const status = (n: number): Status =>
    countsAsRead(n) ? 'read' : n === SERIES.currentlyReading ? 'reading' : 'next';

  const readByEra = ERAS.map(() => 0);
  let readCount = 0;
  for (const b of BOOKS) {
    if (countsAsRead(b.n)) {
      readCount += 1;
      readByEra[b.era - 1] += 1;
    }
  }
  return { posts, reviews, reviewByBook, status, readCount, readByEra };
}

export const STATUS_LABEL: Record<Status, string> = { read: 'Read', reading: 'Reading', next: 'Up next' };

export const seriesUrl = () => `/thoughts/series/${SERIES.slug}/`;
export const shelfUrl = () => `/thoughts/series/${SERIES.slug}/shelf/`;
