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
  email: "arcanenftarc@gmail.com",
  openSeaUrl: "https://opensea.io/",
  social: {
    x: "https://x.com/arcanenft_arc",
    xHandle: "arcanenft_arc",
    discord: "https://discord.com/",
  },
  routes: {
    home: "/",
  },
  assets: {
    background: "/assets/background/hero.png",
    banner: "/assets/banner/og-banner.png",
    logo: "/assets/logo/Png-Logo.png",
    music: "/assets/audio/music.mp3",
    collections: [
      "/assets/collections/teaser-01.png",
      "/assets/collections/teaser-02.png",
      "/assets/collections/teaser-03.png",
    ],
    aboutArt: "/assets/collections/Sneak-Peek1.png",
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
      "Connect X on this page to apply. Whitelist tasks appear after login. No wallet is required.",
    comingMint:
      "Minting is not live. OpenSea checkout, contract calls, and metadata are out of scope for Stage 1. The public facts remain: 4,444 supply, $5 mint.",
    aboutEyebrow: "The collection",
    aboutTitle: "The Rise of Arcane",
    aboutBody:
      "Arcane is a contained drop on OpenSea. This page is the public surface — the first look at the gate, not the full reveal.",
    aboutBody2:
      "The artwork sits in one atmosphere: deep navy space, a central portal of light, and restrained cyan energy. Final traits and piece pages arrive in a later stage.",
    aboutBody3:
      "Nothing here asks for a wallet. Lore, whitelist applications, and OpenSea checkout are reserved for later stages so this site can stay a clean public front.",
    aboutBody4:
      "When those stages land, this same layout stays. Copy, stills, and dates will be replaced in place — the routes already exist.",
    processEyebrow: "Process",
    processTitle: "How to Mint",
    processNote: "No wallet is connected on this website. Minting is planned on OpenSea.",
    mintBody2:
      "Whitelist applications will open here first, with X login — not a wallet connect. Quantity and checkout happen on OpenSea when the drop is live.",
    mintBody3:
      "This website will not run a contract call. The public facts stay fixed: 4,444 supply, $5 mint, OpenSea as the marketplace.",
    mintBody4:
      "Until the date is announced, these four steps are the whole process. Gallery, traits, and metadata are later-stage work.",
    communityEyebrow: "Access",
    communityTitle: "Whitelist",
    communityBody:
      "Sign in with X, then complete the three quests. Login is read-only: we check follow and posts. We cannot tweet, follow, or DM as you. No wallet is required.",
    communityBody2:
      "Keep the same X account through the process. Mint opens on OpenSea when the date is announced.",
    whitelistCta: "Apply for whitelist",
    roadmapEyebrow: "Roadmap",
    roadmapTitle: "Roadmap",
    newsTitle: "Latest",
    newsIntro:
      "Stage 1 is the public shell. These notes mark what is live now and what is reserved.",
    videoNote: "A trailer is not published yet.",
    formNote: "Messages are not live yet. Use X for now.",
    formConsent: "I understand this form does not send mail until a later stage.",
  },
  aboutParagraphs: [
    "Arcane is a contained drop on OpenSea. This page is the public surface — the first look at the gate, not the full reveal.",
    "The artwork sits in one atmosphere: deep navy space, a central portal of light, and restrained cyan energy. Final traits and piece pages arrive in a later stage.",
    "Nothing here asks for a wallet. Lore, whitelist applications, and OpenSea checkout are reserved for later stages so this site can stay a clean public front.",
    "When those stages land, this same layout stays. Copy, stills, and dates will be replaced in place — the routes already exist.",
  ],
  mintParagraphs: [
    "Minting is planned on OpenSea at $5. This website does not connect a wallet. Checkout happens on OpenSea when the drop is live.",
    "Whitelist applications will open here first, with X login — not a wallet connect. Quantity and checkout happen on OpenSea when the drop is live.",
    "This website will not run a contract call. The public facts stay fixed: 4,444 supply, $5 mint, OpenSea as the marketplace.",
    "Until the date is announced, these four steps are the whole process. Gallery, traits, and metadata are later-stage work.",
  ],
  updates: [
    {
      n: "01",
      meta: "Stage 1 / Collection",
      title: "The gallery is not public yet",
      href: "/collection",
      body: "Filters, piece pages, and the official stills arrive later. These teasers hold the grid until then.",
      image: true,
    },
    {
      n: "02",
      meta: "Stage 1 / Lore",
      title: "Lore is reserved for a later stage",
      href: "/lore",
      body: "The route exists. The writing does not, on purpose.",
      image: false,
    },
    {
      n: "03",
      meta: "Stage 1 / Access",
      title: "Connect X to apply for whitelist",
      href: "/#whitelist",
      body: "X login is how you apply. No wallet is required.",
      image: false,
    },
    {
      n: "04",
      meta: "Stage 1 / Mint",
      title: "$5 on OpenSea when the drop is live",
      href: "/mint",
      body: "Date and contract stay unpublished until they are real.",
      image: false,
    },
  ],
  whitelistSteps: [
    {
      id: "follow",
      n: "01",
      title: "Follow",
      body: "Follow @arcanenft_arc on X.",
      href: "https://x.com/arcanenft_arc",
      action: "Follow on X",
    },
    {
      id: "comment",
      n: "02",
      title: "Comment",
      body: "The gate is opening. @arcanenft_arc",
      phrase: "The gate is opening. @arcanenft_arc",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent("The gate is opening. @arcanenft_arc")}`,
      action: "Comment on X",
    },
    {
      id: "retweet",
      n: "03",
      title: "Retweet",
      body: "Retweet or quote our page.",
      phrase: "Held at the threshold. @arcanenft_arc",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent("Held at the threshold. @arcanenft_arc")}&url=${encodeURIComponent("https://arcanenft.xyz")}`,
      action: "Quote / Post",
    },
  ],
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
    { value: "TBA", label: "Supply" },
    { value: "TBA", label: "Mint price" },
    { value: "OpenSea", label: "Platform" },
    { value: "TBA", label: "Mint date" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/#whitelist", label: "Whitelist" },
  { href: "/#about", label: "About" },
] as const;

export const pageNav = [
  { href: "/#home", label: "Home" },
  { href: "/#whitelist", label: "Whitelist" },
  { href: "/#about", label: "About" },
] as const;
