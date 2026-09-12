export const siteConfig = {
  name: "Arcane",
  domain: "arcanenft.xyz",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://arcanenft.xyz",
  tagline: "A limited collection at the edge of light and dark.",
  description:
    "Arcane is a 4,444 NFT collection. Mint price $5 on OpenSea. Stage 1 site foundation.",
  supply: 4444,
  supplyDisplay: "4,444",
  mintPriceUsd: 5,
  mintPriceDisplay: "$5",
  mintPlatform: "OpenSea",
  mintDateDisplay: "To be announced",
  mintDateIso: null as string | null,
  openSeaUrl: "https://opensea.io/",
  social: {
    x: "https://x.com/",
    discord: "https://discord.com/",
  },
  routes: {
    home: "/",
    collection: "/collection",
    lore: "/lore",
    whitelist: "/whitelist",
    mint: "/mint",
  },
  copy: {
    heroKicker: "Limited collection",
    heroTitle: "ARCANE",
    heroLead:
      "A contained drop. Four thousand four hundred forty-four pieces. Five dollars to mint.",
    introEyebrow: "Introduction",
    introTitle: "Held at the threshold",
    introBody:
      "Arcane is a visual collection built around a single atmosphere: deep navy space, a central gate of light, and restrained cyan energy. This page is the Stage 1 public surface. Lore, mint mechanics, and applications will land in later stages.",
    collectionEyebrow: "Collection",
    collectionTitle: "A closed set of 4,444",
    collectionBody:
      "The full gallery and trait system are not public yet. This teaser is a stand-in so the home page already feels like a collection site, not a placeholder document.",
    statsEyebrow: "Drop facts",
    statsTitle: "Supply, price, platform",
    statsNote: "Dates and contract details will be published when minting is ready.",
    galleryEyebrow: "Visual teaser",
    galleryTitle: "Fragments from the gate",
    galleryCaption: "Temporary stills. Replace with final artwork when the collection is revealed.",
    whitelistEyebrow: "Access",
    whitelistTitle: "Whitelist applications",
    whitelistBody:
      "Applications will open in a later stage. This site will not ask for a wallet. Sign-in with X is planned for the application flow — it is not live yet.",
    mintEyebrow: "Mint",
    mintTitle: "$5 on OpenSea",
    mintBody:
      "Minting is planned on OpenSea at $5. The mint page and contract connection are intentionally not implemented in Stage 1.",
    comingCollection:
      "The collection gallery, filters, and piece pages arrive in a later stage. Navigation is live so the site structure is already in place.",
    comingLore:
      "Lore is not written here on purpose. This route exists so the word can be replaced later without rebuilding the site map.",
    comingWhitelist:
      "Whitelist applications are not open. X login and any verification logic are reserved for a later stage. No wallet is required anywhere on this site.",
    comingMint:
      "Minting is not live. OpenSea checkout, contract calls, and metadata are out of scope for Stage 1. The public facts remain: 4,444 supply, $5 mint.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const navItems = [
  { href: siteConfig.routes.home, label: "Home" },
  { href: siteConfig.routes.collection, label: "Collection" },
  { href: siteConfig.routes.lore, label: "Lore" },
  { href: siteConfig.routes.whitelist, label: "Whitelist" },
  { href: siteConfig.routes.mint, label: "Mint" },
] as const;
