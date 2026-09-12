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
  assets: {
    background: "/assets/background/hero.png",
    banner: "/assets/banner/og-banner.png",
    logo: "/assets/logo/icon.png",
    collections: [
      "/assets/collections/teaser-01.png",
      "/assets/collections/teaser-02.png",
      "/assets/collections/teaser-03.png",
      "/assets/collections/teaser-04.png",
    ],
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
    collectionTitle: "Our Collection",
    collectionBody:
      "The full gallery and trait system are not public yet. These stills stand in until the set is revealed.",
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
    mintTitle: "How to Mint",
    mintBody:
      "Minting is planned on OpenSea at $5. This website does not connect a wallet. Checkout happens on OpenSea when the drop is live.",
    comingCollection:
      "The collection gallery, filters, and piece pages arrive in a later stage. Navigation is live so the site structure is already in place.",
    comingLore:
      "Lore is not written here on purpose. This route exists so the word can be replaced later without rebuilding the site map.",
    comingWhitelist:
      "Whitelist applications are not open. X login and any verification logic are reserved for a later stage. No wallet is required anywhere on this site.",
    comingMint:
      "Minting is not live. OpenSea checkout, contract calls, and metadata are out of scope for Stage 1. The public facts remain: 4,444 supply, $5 mint.",
    aboutEyebrow: "The collection",
    aboutTitle: "The Rise of Arcane",
    aboutBody:
      "Arcane is 4,444 pieces. Mint is $5 on OpenSea. This page is the public surface. Lore, applications, and mint checkout land in later stages.",
    processEyebrow: "Process",
    processTitle: "How to Mint",
    processNote: "No wallet is connected on this website. Minting is planned on OpenSea.",
    communityEyebrow: "Community",
    communityTitle: "Contact",
    communityBody:
      "Applications are not open yet. When they are, this site will use X login — not a wallet. Mint remains $5 on OpenSea.",
    roadmapEyebrow: "Roadmap",
    roadmapTitle: "Roadmap",
  },
  process: [
    { n: "01", title: "Apply for whitelist", body: "When applications open, request access here. No wallet required." },
    { n: "02", title: "Wait for the date", body: "The mint date is still to be announced. It will be posted on this site." },
    { n: "03", title: "Mint on OpenSea", body: "Public mint is planned at $5 on OpenSea. This site will not run a wallet checkout." },
    { n: "04", title: "Receive your piece", body: "Your token lives on the marketplace. Gallery and traits arrive in a later stage." },
  ],
  roadmap: [
    { phase: "Phase 01", when: "Now", title: "Public site", body: "Home, routes, and visual language. No mint. No login." },
    { phase: "Phase 02", when: "Next", title: "Collection", body: "Gallery, pieces, and the official stills in place of teasers." },
    { phase: "Phase 03", when: "Later", title: "Whitelist", body: "X login and applications. Still no wallet on this site." },
    { phase: "Phase 04", when: "Drop", title: "Mint", body: "OpenSea at $5. Date and contract when they are public." },
  ],
  counters: [
    { value: "4,444", label: "Total items" },
    { value: "$5", label: "Mint price" },
    { value: "OpenSea", label: "Platform" },
    { value: "TBA", label: "Mint date" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const navItems = [
  { href: siteConfig.routes.home, label: "Home" },
  { href: siteConfig.routes.collection, label: "Collection" },
  { href: siteConfig.routes.lore, label: "Lore" },
  { href: siteConfig.routes.whitelist, label: "Whitelist" },
  { href: siteConfig.routes.mint, label: "Mint" },
] as const;

export const pageNav = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#collection", label: "Collection" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#contact", label: "Contact" },
] as const;
