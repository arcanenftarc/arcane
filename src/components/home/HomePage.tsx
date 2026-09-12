import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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
      <section className={styles.hero} aria-label="Arcane hero">
        <div className={styles.media}>
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

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="about-title">
        <Container>
          <div className={styles.about}>
            <div>
              <SectionHeading
                id="about-title"
                index="01"
                eyebrow={siteConfig.copy.aboutEyebrow}
                title={siteConfig.copy.aboutTitle}
                lede={siteConfig.copy.aboutBody}
              />
              <div className={styles.ctaRow}>
                <Button href={siteConfig.routes.lore} variant="secondary">
                  Open lore
                </Button>
              </div>
            </div>
            <figure className={styles.aboutFrame}>
              <Image
                src={siteConfig.assets.collections[0]}
                alt="Portal fragment from the Arcane visual world."
                width={720}
                height={720}
              />
            </figure>
          </div>
        </Container>
      </section>

      <section className={styles.counters} aria-label="Drop facts">
        <Container>
          <ul className={styles.counterGrid}>
            {siteConfig.counters.map((item) => (
              <li key={item.label}>
                <p className={styles.counterValue}>{item.value}</p>
                <p className={styles.counterLabel}>{item.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="gallery-title">
        <Container>
          <SectionHeading
            id="gallery-title"
            index="02"
            eyebrow={siteConfig.copy.galleryEyebrow}
            title={siteConfig.copy.collectionTitle}
            lede={siteConfig.copy.collectionBody}
          />
          <div className={styles.strip}>
            {teasers.map((item) => (
              <figure className={styles.frame} key={item.src}>
                <Image src={item.src} alt={item.alt} width={720} height={720} />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className={styles.ctaRow}>
            <Button href={siteConfig.routes.collection} variant="secondary">
              Open collection
            </Button>
          </div>
        </Container>
      </section>

      <section className={styles.section} aria-labelledby="process-title">
        <Container>
          <SectionHeading
            id="process-title"
            index="03"
            eyebrow={siteConfig.copy.processEyebrow}
            title={siteConfig.copy.processTitle}
            lede={siteConfig.copy.processNote}
          />
          <ol className={styles.steps}>
            {siteConfig.process.map((step) => (
              <li className={styles.step} key={step.n}>
                <p className={styles.stepN}>{step.n}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="roadmap-title">
        <Container>
          <SectionHeading
            id="roadmap-title"
            index="04"
            eyebrow={siteConfig.copy.roadmapEyebrow}
            title={siteConfig.copy.roadmapTitle}
          />
          <ol className={styles.timeline}>
            {siteConfig.roadmap.map((item) => (
              <li className={styles.milestone} key={item.phase}>
                <p className={styles.when}>
                  {item.phase} · {item.when}
                </p>
                <h3 className={styles.mileTitle}>{item.title}</h3>
                <p className={styles.mileBody}>{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className={styles.section} aria-labelledby="community-title">
        <Container>
          <div className={styles.community}>
            <SectionHeading
              id="community-title"
              index="05"
              eyebrow={siteConfig.copy.communityEyebrow}
              title={siteConfig.copy.communityTitle}
              lede={siteConfig.copy.communityBody}
            />
            <div className={styles.ctaRow}>
              <Button href={siteConfig.routes.whitelist}>Apply for whitelist</Button>
              <Button href={siteConfig.routes.mint} variant="secondary">
                View mint
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
