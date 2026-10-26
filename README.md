# Reichel.sec — personal cybersecurity site

Static site (plain HTML/CSS/JS) with 4 sections. Site-wide navigation, home
and footer are in English; Articles and Labs are bilingual (English/Spanish),
with each post/guide's own page staying fully in its original language.

- **Home** — landing page with links to the 3 sections.
- **Articles** — posts in English and Spanish, with a language filter and a
  cross-link (English ⇄ Spanish) between versions of the same post. Already
  includes "What is Vulnerability Management? / ¿Qué es Gestión de
  Vulnerabilidades?".
- **Labs** — hands-on practice-environment guides, also bilingual with the
  same language filter as Articles, so people who don't speak English can
  still follow along. Currently empty, ready for the first guide.
- **Cheatsheets** — grouped by category: the top-level page shows one card per
  category (e.g. "OSWA Web App Pentesting"), clicking it opens that
  category's own index listing its individual topic pages (SQL Injection,
  XSS, SSRF, XXE, SSTI, Directory Traversal, Command Injection, Auth/Session).
  This keeps unrelated future categories (networking, AD, cloud, etc.) from
  blending into one giant list. Code/command blocks are syntax-highlighted
  (highlight.js, dark theme) so payloads stand out from prose.

Palette: violet (`#7c3aed` / `#a78bfa` in dark mode) over light gray
(`#f1eef7`) / near-black in dark mode, following the system theme.

## Publishing to GitHub Pages (new repo)

1. Create the new repository on GitHub.
2. Copy this folder's contents (`README.md` + `docs/`) to the repo root.
3. From a terminal, inside the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial site: home, articles, labs, cheatsheets"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
4. On GitHub: **Settings → Pages** → Source: **Deploy from a branch** →
   Branch: `main`, folder `/docs` → Save.
5. The site will be live at `https://<your-username>.github.io/<your-repo>/`.

`docs/.nojekyll` is already included so GitHub Pages serves the files as-is
without the Jekyll processor touching them.

## Adding a new article

1. The article source lives in `content_src/articles/<lang>/<slug>.md`
   (outside `docs/`) with this frontmatter:
   ```yaml
   ---
   title: Article title
   lang: en   # or es
   date: 2026-01-01
   read_time: 10 min read
   original: https://original-link-if-any
   counterpart: ../es/slug-in-spanish.html   # leave blank if no translation
   ---
   ```
2. Ask me to regenerate the site with `build_newsite.py` and I'll republish
   it with the new article already wired into the index and language filter.

## Adding a new lab guide

1. Same pattern as articles: the source lives in
   `content_src/labs/<lang>/<slug>.md` with this frontmatter:
   ```yaml
   ---
   title: Guide title
   lang: en   # or es
   date: 2026-01-01
   read_time: 15 min read
   counterpart: ../es/slug-in-spanish.html   # leave blank if no translation
   ---
   ```
   (`original` is omitted for labs — that field is only used for articles
   that were first published elsewhere, like Hashnode.)
2. Ask me to regenerate the site with `build_newsite.py` and the guide will
   show up in the Labs index with the same English/Español filter used in
   Articles.

## Adding a new cheatsheet topic (to an existing category)

1. Source lives in `content_src/cheatsheets/<slug>.md` (no language split —
   cheatsheets stay in English) with this frontmatter:
   ```yaml
   ---
   category: OSWA Web App Pentesting
   order: 9
   summary: One-line description shown on the topic's card.
   ---
   # Topic Title

   Body content, using `##` for sections (they become the in-page
   "On this page" sidebar automatically) and fenced code blocks
   (```bash, ```sql, etc.) for commands/payloads — these get syntax-highlighted
   automatically.
   ```
2. Ask me to regenerate the site with `build_newsite.py`. The topic appears
   as a new card inside its category's page, ordered by `order`.

## Adding a brand-new cheatsheet category

Just give a new file a `category:` value that doesn't exist yet (e.g.
`category: Active Directory`). It automatically gets its own card on the
top-level Cheatsheets page and its own category index — no code changes
needed, just add the `CATEGORY_BLURBS` entry in `build_newsite.py` if you
want a one-line description under the category title (optional).

## Structure

```
docs/
  index.html
  assets/
    style.css
    site.js
  articles/
    index.html
    en/
      vulnerability-management.html
    es/
      gestion-de-vulnerabilidades.html
  labs/
    index.html
    en/
    es/
  cheatsheets/
    index.html                          (one card per category)
    oswa-web-app-pentesting/
      index.html                        (one card per topic in this category)
      sql-injection.html
      xss.html
      ssrf.html
      xxe.html
      ssti.html
      directory-traversal.html
      command-injection.html
      auth-session.html
content_src/
  articles/
    en/vulnerability-management.md
    es/gestion-de-vulnerabilidades.md
  labs/
    en/
    es/
  cheatsheets/
    sql-injection.md
    xss.md
    ssrf.md
    xxe.md
    ssti.md
    directory-traversal.md
    command-injection.md
    auth-session.md
```
