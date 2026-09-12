import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Glow } from "@/components/ui/Glow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./HomePage.module.css";

const teasers = [
  { src: siteConfig.assets.collections[0], alt: "Cyan energy portal fragment from the Arcane visual world.", caption: "Portal" },
  { src: siteConfig.assets.collections[1], alt: "A dark relic lit by ice-blue glow.", caption: "Relic" },
  { src: siteConfig.assets.collections[2], alt: "A distant stone ring gate in night sky.", caption: "Gate" },
  { src: siteConfig.assets.collections[3], alt: "Abstract cyan energy filaments forming a sigil.", caption: "Sigil" },
];

export function HomePage() {
  return (
    <>
      <div className={styles.fixedScene}>
        <Image
          src={siteConfig.assets.background}
          alt="A circular cyan portal of light in a deep navy atmosphere."
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>
      <section className={styles.hero} aria-label="Arcane hero">
        <Container className={styles.content}>
          <p className={styles.kicker}>{siteConfig.copy.heroKicker}</p>
          <h1 className={styles.title}>{siteConfig.copy.heroTitle}</h1>
          <div className={styles.rule} aria-hidden="true" />
          <p className={styles.facts}>
            <span>{siteConfig.supplyDisplay} NFTs</span>
            <span>{siteConfig.mintPriceDisplay} mint</span>
            <span>{siteConfig.mintPlatform}</span>
          </p>
          <p className={styles.lead}>{siteConfig.copy.heroLead}</p>
          <div className={styles.actions}>
            <Button href={siteConfig.routes.collection}>Explore collection</Button>
            <Button href={siteConfig.routes.whitelist} variant="secondary">
              Apply for whitelist
            </Button>
          </div>
        </Container>
      </section>

      <section className={`${styles.section} ${styles.sectionIntro}`} aria-labelledby="intro-title">
        <Container>
          <SectionHeading
            id="intro-title"
            eyebrow={siteConfig.copy.introEyebrow}
            title={siteConfig.copy.introTitle}
            lede={siteConfig.copy.introBody}
          />
        </Container>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="collection-title">
        <Container>
          <div className={styles.split}>
            <SectionHeading
              id="collection-title"
              eyebrow={siteConfig.copy.collectionEyebrow}
              title={siteConfig.copy.collectionTitle}
              lede={siteConfig.copy.collectionBody}
            />
            <div>
              <Button href={siteConfig.routes.collection} variant="secondary">
                Open collection page
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.section} aria-labelledby="facts-title">
        <Container>
          <SectionHeading
            id="facts-title"
            eyebrow={siteConfig.copy.statsEyebrow}
            title={siteConfig.copy.statsTitle}
            lede={siteConfig.copy.statsNote}
          />
          <div className={styles.stats}>
            <Card label="Supply" value={siteConfig.supplyDisplay}>
              Closed set. No additional supply on this page.
            </Card>
            <Card label="Mint price" value={siteConfig.mintPriceDisplay}>
              Public mint price in USD.
            </Card>
            <Card label="Platform" value={siteConfig.mintPlatform}>
              Mint date: {siteConfig.mintDateDisplay}.
            </Card>
          </div>
        </Container>
      </section>

      <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="gallery-title">
        <Container>
          <SectionHeading
            id="gallery-title"
            eyebrow={siteConfig.copy.galleryEyebrow}
            title={siteConfig.copy.galleryTitle}
            lede={siteConfig.copy.galleryCaption}
          />
          <div className={styles.gallery}>
            {teasers.map((item) => (
              <figure className={styles.frame} key={item.src}>
                <Image src={item.src} alt={item.alt} width={720} height={720} />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.section} aria-labelledby="whitelist-title">
        <Container>
          <div className={styles.split} style={{ position: "relative" }}>
            <Glow />
            <SectionHeading
              id="whitelist-title"
              eyebrow={siteConfig.copy.whitelistEyebrow}
              title={siteConfig.copy.whitelistTitle}
              lede={siteConfig.copy.whitelistBody}
            />
            <div className={styles.ctaRow}>
              <Button href={siteConfig.routes.whitelist}>Apply for whitelist</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="mint-title">
        <Container>
          <div className={styles.split}>
            <SectionHeading
              id="mint-title"
              eyebrow={siteConfig.copy.mintEyebrow}
              title={siteConfig.copy.mintTitle}
              lede={siteConfig.copy.mintBody}
            />
            <div className={styles.ctaRow}>
              <Button href={siteConfig.routes.mint} variant="secondary">
                View mint page
              </Button>
              <Button href={siteConfig.openSeaUrl} variant="ghost" external>
                OpenSea
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
