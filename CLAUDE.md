# Azirona — Claude Code Instructions

## Project Overview
Static site for azirona.com — portfolio and blog for Alek Miller (author, game designer) and Juleah Miller (artist, developer). Hosted on GitHub Pages. No build step; plain HTML/CSS/JS with JSON data files.

## Key Files
- `index.html` — main homepage (self-contained, all CSS and JS inline)
- `work-status.json` — all creative works data, loaded dynamically by index.html
- `tools.json` — tools and utilities
- `blog/posts.json` — blog posts synced automatically from Telegram via GitHub Actions
- `scripts/fetch-telegram.js` — Telegram sync script (do not edit casually)

## Adding a Creative Work
All creative works live in `work-status.json` under the `"projects"` array. When adding a new entry, **all of the following fields are required**:

```json
{
  "id": "unique-kebab-case-id",
  "title": "Full Title of the Work",
  "author": "First Last" or "First & Last Miller",
  "status": "completed" | "work-in-progress" | "planning" | "paused",
  "type": "book" | "web game" | "game" | "comic" | "art book" | "children's book",
  "description": "Full description. Can be multi-paragraph using \\n\\n. Be specific — this shows in the detail panel.",
  "extraNotes": "Behind-the-scenes notes, credits, tools used, fun context. Shows in italics in the panel.",
  "backgroundImage": "assets/filename.ext or empty string if none",
  "completedDate": "YYYY-MM-DD (for completed works) or empty string",
  "estimatedCompletion": "Human-readable estimate e.g. 'Summer 2026' (for in-progress) or empty string",
  "platform": "HTML | Gumroad | Lulu | Itch.io | Webtoon | Boardgame | Pico-8 | etc.",
  "webFile": "path/to/game/index.html or directory/ — used for Play button on web games",
  "gameType": "e.g. Clicker / Space Builder — for games only, else empty string",
  "collaboration": true | false,
  "externalLinks": [
    { "label": "Buy on Gumroad", "url": "https://..." }
  ]
}
```

After adding, increment `"totalProjects"` and update `"lastUpdated"` to today's ISO date.

### Required fields summary
| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Full title |
| `author` | ✅ | "Alek Miller", "Juleah Miller", or "Alek & Juleah Miller" |
| `status` | ✅ | See values above |
| `description` | ✅ | Full description, not a one-liner |
| `extraNotes` | ✅ | Credits, context, tools used — leave `""` only if truly nothing to add |
| `backgroundImage` | ✅ | Path to image asset, or `""` if none yet |
| `completedDate` or `estimatedCompletion` | ✅ | At least one must be set for completed/in-progress works |

## Deploying
Always commit `index.html` and `work-status.json` together when making project updates. Push to `master` — GitHub Pages deploys automatically.

```bash
git add index.html work-status.json
git commit -m "Description of change"
git push
```

## Blog
Posts are auto-synced from Telegram hourly. The `posts.json` format has **no separate title field** — the first line of `post.text` is the title, body follows after the first blank line (`\n\n`).

## Style Notes
- Fonts: Cormorant Garant (headings), Lora (body), Oswald (labels/nav)
- Colors: terracotta `#B85C38`, adobe parchment `#F3E9D2`, turquoise `#1B7878`, gold `#C08A10`
- All CSS and JS is inline in `index.html` — no separate stylesheet for the homepage
