# Arcane — Stage 1

Public frontend foundation for **Arcane**, a 4,444 NFT collection minting at **$5** on OpenSea.

Domain: [arcanenft.xyz](https://arcanenft.xyz)

## Current stage

Stage 1 only:

- Home page (hero, intro, collection teaser, supply/price facts, gallery, whitelist CTA, mint CTA, footer)
- Working routes for Collection, Lore, Whitelist, and Mint (intentional later-stage placeholders)
- Design system and central site configuration
- No wallet connection, no X login, no backend, no mint contract

See [PROJECT.md](./PROJECT.md) for architecture, what is out of scope, and later stages.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Domain

Public domain: **arcanenft.xyz** (Namecheap). See [DOMAIN.md](./DOMAIN.md) for Vercel deploy and Namecheap DNS. Do not start later stages until the live domain serves this site.

## Configuration

Editable public facts live in `src/config/site.ts` (name, supply, price, social URLs, copy).

Environment variables that should stay out of git are documented in `.env.example`. Do not put secrets in `NEXT_PUBLIC_*` variables.
