import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayTitle } from "@/components/ui/DisplayTitle";
import { Divider } from "@/components/ui/Divider";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import styles from "./HomePage.module.css";

const teasers = [
  { src: siteConfig.assets.collections[0], alt: "Portal fragment from the Arcane visual world.", caption: "Portal" },
  { src: siteConfig.assets.collections[1], alt: "A dark relic lit by ice-blue glow.", caption: "Relic" },
  { src: siteConfig.assets.collections[2], alt: "A distant stone ring gate in night sky.", caption: "Gate" },
  { src: siteConfig.assets.collections[3], alt: "Abstract cyan energy filaments forming a sigil.", caption: "Sigil" },
];

export function HomePage() {
  const collectionRow = [...teasers, ...teasers];

  return (
    <>
      <section className={styles.hero} id="home" aria-label="Arcane home">
        <div className={styles.heroBg}>
          <Image src={siteConfig.assets.background} alt="" fill sizes="100vw" className={styles.heroImage} priority />
          <div className={styles.heroOverlay} />
        </div>
        <Container className={styles.heroInner}>
          <DisplayTitle text={siteConfig.copy.heroTitle} as="h1" size="lg" />
          <HeroCarousel slides={teasers} />
          <p className={styles.heroLead}>{siteConfig.copy.heroLead}</p>
          <div className={styles.heroActions}>
            <Button href={siteConfig.routes.collection}>See collection</Button>
            <Button href={siteConfig.routes.mint} variant="secondary">
              How to mint
            </Button>
          </div>
        </Container>
      </section>

      <section className={styles.facts} aria-label="Drop facts">
        <Container>
          <ul className={styles.factGrid}>
            {siteConfig.counters.map((item) => (
              <li key={item.label}>
                <p className={styles.factValue}>{item.value}</p>
                <p className={styles.factLabel}>{item.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.about} id="about">
        <div className={styles.aboutSplit}>
          <div className={styles.aboutMedia}>
            <Image src={siteConfig.assets.collections[0]} alt="Portal fragment." width={900} height={900} />
          </div>
          <div className={styles.aboutCopy}>
            <DisplayTitle text={siteConfig.copy.aboutTitle} align="left" />
            <div className={styles.localRule} aria-hidden="true" />
            <p>{siteConfig.copy.aboutBody}</p>
            <p>{siteConfig.copy.introBody}</p>
            <Button href={siteConfig.routes.lore} variant="secondary">
              Open lore
            </Button>
          </div>
        </div>

        <Container className={styles.mintBlock}>
          <div className={styles.mintCopy}>
            <DisplayTitle id="mint-title" text={siteConfig.copy.mintTitle} align="left" />
            <div className={styles.localRule} aria-hidden="true" />
            <p>{siteConfig.copy.mintBody}</p>
            <p>{siteConfig.copy.processNote}</p>
            <Button href={siteConfig.routes.mint}>How to mint</Button>
          </div>
          <ol className={styles.steps}>
            {siteConfig.process.map((step) => (
              <li key={step.n}>
                <p className={styles.stepN}>{step.n}</p>
                <p className={styles.stepTitle}>{step.title}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Divider />

      <section className={styles.collection} id="collection">
        <Container>
          <DisplayTitle text={siteConfig.copy.collectionTitle} size="lg" />
          <div className={styles.collectionGrid}>
            {collectionRow.map((item, i) => (
              <figure className={styles.piece} key={`${item.src}-${i}`}>
                <Image src={item.src} alt={item.alt} width={640} height={640} />
              </figure>
            ))}
          </div>
          <p className={styles.centerNote}>{siteConfig.copy.collectionBody}</p>
          <div className={styles.centerActions}>
            <Button href={siteConfig.routes.collection}>See all collection</Button>
          </div>
        </Container>
      </section>

      <Divider />

      <section className={styles.roadmap} id="roadmap">
        <Container>
          <DisplayTitle text={siteConfig.copy.roadmapTitle} size="lg" />
          <div className={styles.roadTrack}>
            {siteConfig.roadmap.map((item) => (
              <article className={styles.phase} key={item.phase}>
                <p className={styles.phaseTag}>{item.phase}</p>
                <p className={styles.phaseWhen}>{item.when}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Divider />

      <section className={styles.contact} id="contact">
        <Container>
          <DisplayTitle text={siteConfig.copy.communityTitle} size="lg" />
          <div className={styles.contactGrid}>
            <p>{siteConfig.copy.communityBody}</p>
            <div>
              <p className={styles.contactLabel}>X</p>
              <a href={siteConfig.social.x} rel="noreferrer" target="_blank">
                Open X
              </a>
              <p className={styles.contactLabel}>Drop</p>
              <p>
                {siteConfig.supplyDisplay} · {siteConfig.mintPriceDisplay} · {siteConfig.mintPlatform}
              </p>
            </div>
            <div className={styles.contactActions}>
              <Button href={siteConfig.routes.whitelist}>Whitelist</Button>
              <Button href={siteConfig.routes.mint} variant="secondary">
                Mint
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
