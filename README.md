# JaxTrails

Trail reviews and personal writing. Built with [Astro](https://astro.build), hosted on Cloudflare Pages.

Everything you publish is a Markdown file. Add or edit a file here on GitHub and the site rebuilds itself in about a minute.

## Where things live

```
src/content/
  parks/      one file per park        (the write-up; parks are not rated)
  trails/     one file per trail       (belongs to a park; carries the rating)
  thoughts/   one file per post        (Reflections, Books, or Everything Else)
src/pages/    the page templates (rarely touched)
src/styles/   colors and fonts live at the top of global.css
```

## Adding a park

Create `src/content/parks/your-park-name.md`:

```markdown
---
title: "Your Park Name"
visited: 2026-11-15
summary: "One sentence that shows up on cards and at the top of the page."
plan: "Optional: hours, fees, parking."
---

Your review goes here. Blank line between paragraphs.
```

The file name becomes the web address: `your-park-name.md` -> `/reviews/your-park-name/`.

## Adding a trail

Create `src/content/trails/your-trail-name.md`. The `park` line must match a park's file name (without `.md`):

```markdown
---
title: "Your Trail Name"
park: your-park-name
visited: 2026-11-15
summary: "One sentence."
distance: "3.2 mi loop"
difficulty: Moderate      # Easy, Moderate, or Hard
rating: 4                 # 1 to 5 blazes
---

Your review goes here.
```

## Adding a post

Create `src/content/thoughts/your-post-title.md`:

```markdown
---
title: "Your Post Title"
date: 2026-11-15
category: "Reflections"   # Reflections, Books, or Everything Else
summary: "One or two sentences."
---

Your writing goes here.
```

## Linking reviews and posts

Optional. On a post, list the trails it relates to (file names without `.md`):

```markdown
relatedTrails:
  - birchwood-loop
```

Or do the reverse on a trail with `relatedThoughts:`. You only need to set it on one side. Both pages show the link.

## Drafts and samples

- Add `draft: true` to hold a file back. It shows when you preview locally but never on the live site.
- Files marked `sample: true` show a dashed "Sample" tag. **Delete the sample files** (or remove that line) as you replace them with real writing.

## Changing the look

Colors and fonts are the variables at the top of `src/styles/global.css`. The blaze blue is `--blaze`.

## Hosting settings (Cloudflare Pages)

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: set by `.node-version`

## Adding your domain later

When you have a real address, put it in `astro.config.mjs` as `site: 'https://your-address'`. That unlocks things like an RSS feed and a sitemap.
