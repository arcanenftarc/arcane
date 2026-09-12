# PROJECT.md — Arcane Stage 1

## Project purpose

Arcane is a 4,444-piece NFT collection. Public mint price is $5 on OpenSea. Public domain is `arcanenft.xyz`.

This repository currently contains **Stage 1 only**: a production-shaped frontend foundation. The home page is fully designed. Secondary routes exist so navigation is real, but their interiors are later-stage placeholders.

## Current architecture

- **Framework:** Next.js App Router (React, TypeScript)
- **Host:** Cloudflare Workers via `@opennextjs/cloudflare` (OpenNext)
- **DNS:** Cloudflare (domain registered at Namecheap)
- **Styling:** CSS Modules + CSS custom properties (design tokens)
- **Fonts:** Cormorant Garamond (display/wordmark), Outfit (interface)
- **Config:** `src/config/site.ts` is the single source for public project facts and replaceable copy
- **Env:** `.env.example` lists `NEXT_PUBLIC_SITE_URL` and commented placeholders for later backend/auth secrets
- **Assets:** `public/assets/` — `banner/`, `logo/`, `background/`, `collections/`. Favicon and Open Graph also live in `src/app/`.

The frontend is structured so authentication, APIs, and mint flows can be added later as server routes, server actions, or a separate backend — without rebuilding navigation, tokens, or page shells.

```
src/
  app/                 routes + metadata
  components/
    layout/            Navbar, Footer, SiteShell
    ui/                Button, Card, Container, Glow, SectionHeading, ComingSoon
    home/              HomePage
  config/site.ts       public configuration
  styles/globals.css   tokens and base styles
```

## Design system

Tokens in `src/styles/globals.css`:

| Token | Hex | Role |
| --- | --- | --- |
| Deep Space | `#111E3D` | Foundation / page background |
| Arcane Navy | `#1C2F63` | Secondary atmosphere |
| Mystic Blue | `#2957B4` | Sparse structural accent |
| Arcane Blue | `#486EC0` | Sparse structural accent |
| Soft Periwinkle | `#7191D5` | Quiet labels |
| Celestial | `#A5B2E3` | Muted body text |
| Arcane Cyan | `#23D4F9` | CTAs, active states, energy |
| Magic Ice | `#AFECF7` | Highlight text |
| Moon White | `#F0EAEE` | Primary text |

Cyan is reserved for important actions and glow. Navy is the default field. Cards are squared (`2px` radius), not glassmorphism panels.

Reusable components:

- `Navbar` — hamburger + logo, centered one-page nav, Mint on the right, left drawer for extra routes
- `Footer` — project facts, routes, socials
- `Button` — primary / secondary / ghost
- `SectionHeading` — eyebrow + title + optional lede
- `Card` — fact tiles
- `Glow` — restrained cyan ambient
- `Container` — max-width layout
- `ComingSoon` — later-stage route shell

Hover and focus are small. `:focus-visible` is global. There is no wallet button.

## Routes

| Path | Stage 1 |
| --- | --- |
| `/` | Full home |
| `/collection` | Placeholder |
| `/lore` | Placeholder |
| `/whitelist` | Placeholder |
| `/mint` | Placeholder |

Primary navigation labels on interior pages: HOME, COLLECTION, LORE, WHITELIST, MINT.

Home header labels: HOME, ABOUT, COLLECTION, UPDATES, CONTACT, with MINT as the right-side action.

Home page structure follows the scanned MetaPortal Flask demo (Arcane theme, original CSS, no copied assets, no wallet UI):

1. Header — hamburger + logo left, one-page nav center (Home / About / Collection / Updates / Contact), Mint on the right (wallet slot)
2. `#home` — outlined title + 5-card 3D slider + one description/CTA
3. `#fun_facts` — four counters
4. `#about` — full-bleed image/text split, then How to Mint + 2×2 steps + trailer still
5. `#collection` — staggered mosaic (wide/narrow rows) + description/CTA
6. `#roadmap` — phase cards on a timeline
7. `#news` — featured update + three shorter notes (Stage 1 placeholders, not a blog)
8. `#contact` — three info columns + form shell (no backend)
9. Footer — copyright/facts + page links
10. Follow-us rail + scroll-to-top

## Configuration structure

`src/config/site.ts` holds:

- name, domain, public URL
- supply (`4444` / `4,444`)
- mint price (`5` / `$5`)
- mint platform
- mint date placeholder
- OpenSea URL placeholder
- social link placeholders (X, Discord)
- route map
- home and coming-soon copy

`.env.example`:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL for metadata
- commented later-stage secrets (`X_CLIENT_ID`, `X_CLIENT_SECRET`, `DATABASE_URL`, `MINT_CONTRACT_ADDRESS`) — **server-only, never `NEXT_PUBLIC_`**

## Intentionally not implemented (Stage 1)

- X / Twitter authentication
- Wallet connection of any kind
- Wallet submission
- Whitelist verification
- Database
- Mint contract logic
- Metadata / token URI logic
- Live OpenSea checkout
- Invented lore or final marketing claims

## Domain (before later stages)

Public hostname is `arcanenft.xyz`. The domain is registered at Namecheap. DNS and hosting are on **Cloudflare** (Workers via OpenNext). Namecheap only holds the registration and must use Cloudflare nameservers. Checklist: [DOMAIN.md](./DOMAIN.md).

Do not start collection/lore/whitelist/mint work until `https://arcanenft.xyz` serves Stage 1 with HTTPS.

## Future stages (not started)

1. **Collection** — gallery, piece pages, traits
2. **Lore** — written world, not placeholder
3. **Whitelist** — X login, application form, no wallet requirement for apply
4. **Mint** — OpenSea mint surface, contract address, live date
5. **Backend** — persistence, verification, secrets on the server

## SEO (Stage 1)

- Document title and template
- Meta description from config
- Open Graph basics (`opengraph-image.png`)
- Favicon (`icon.png`)
- Heading hierarchy: one `h1` on home (`ARCANE`); section titles are `h2`
- `robots.ts` and `sitemap.ts` from the public site URL

## Visual note

No Arcane artwork file was present in the repository at Stage 1 start. Temporary hero and teaser stills were generated to match the specified palette and a central portal of light. Replace `public/assets/background/hero.png` and files in `public/assets/collections/` with the official artwork when available. Keep overlays light enough that the portal remains visible.
