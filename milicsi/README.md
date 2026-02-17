# Milicsi — Joornaal Falsafadeed

A minimal, Somali-language philosophy journal for publishing essays and articles about philosophy, ethics, and meaningful living. Calm, readable, and responsive.

**Milicsi** means "reflection" in Somali — a space dedicated to thoughtful contemplation on philosophy, the art of living, and the pursuit of clarity in the modern world.

## Contents

- **Bogga Hore (Home)** — Introduction and featured articles in Somali
- **Qoraallo (Articles)** — Full article list with search filter
- **Akhris (Reading)** — Recommended reading list
- **Ku Saabsan (About)** — Biography and background

## Features

- Soft neutral palette (beige, off-white, muted brown) with dark mode
- Serif type for content (Philosopher), sans-serif for UI (Source Sans 3)
- Dark/light theme toggle (persists in `localStorage`, respects system preference)
- Smooth scroll, mobile menu, article search, reading progress bar on article pages
- Fully Somali-language interface and content
- SEO optimized with Open Graph and JSON-LD structured data
- RSS feed for article subscriptions
- Vanilla HTML, CSS, and JavaScript; no frameworks

## Current Articles

- **Dhammaanteen dambiilayaal ayaan nahay** (We are all sinners) — Ethics
- **Adigoo PhD wata ayaad noqon kartaa doqon** (You can be a fool with a PhD) — Wisdom

## Run Locally

Open `index.html` in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port shown).

## Structure

```
./
├── index.html              # Home page (Somali)
├── articles.html           # Article listing with search
├── about.html              # About page
├── reading.html            # Reading list
├── essays/                 # Individual essays
│   ├── dhammaanteen-dambiilayaal.html
│   └── adigoo-phd-wata.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── art.js
├── assets/                 # Images and media
├── feed.xml                # RSS feed
└── README.md
```

## Adding New Articles

1. Create a new HTML file in the `essays/` directory
2. Use the existing article structure as a template
3. Add article metadata (title, date, category, reading time)
4. Link the article from `articles.html` and optionally feature it on `index.html`
5. Update `feed.xml` with the new entry

## About the Project

Milicsi is a personal philosophy journal published entirely in Somali, focusing on making philosophical concepts accessible to Somali-speaking audiences. Topics include ethics (akhlaaq), wisdom (xikmad), and reflections on meaningful living.

**Domain:** https://milicsi.sharafdin.com  
**Language:** Somali (so)  
**Author:** Mr Sharafdin
