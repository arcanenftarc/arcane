import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayTitle } from "@/components/ui/DisplayTitle";
import { Sigil } from "@/components/ui/Sigil";
import { XLoginButton } from "@/components/auth/XLoginButton";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { WhitelistQuest } from "@/components/home/WhitelistQuest";
import styles from "./HomePage.module.css";

const teasers = [
  { src: siteConfig.assets.collections[0], alt: "Arcane teaser still one." },
  { src: siteConfig.assets.collections[1], alt: "Arcane teaser still two." },
  { src: siteConfig.assets.collections[2], alt: "Arcane teaser still three." },
  { src: siteConfig.assets.collections[3], alt: "Arcane teaser still four." },
];

export function HomePage() {
  return (
    <>
      <section className={styles.hero} id="home" aria-label="Arcane home">
        <Container>
          <div className={styles.heroTitle}>
            <DisplayTitle text={siteConfig.copy.heroTitle} as="h1" size="lg" />
            <Sigil />
          </div>
        </Container>
        <HeroCarousel slides={teasers} />
        <Container>
          <div className={styles.heroActions} data-reveal>
            <Button href="/whitelist">{siteConfig.copy.whitelistCta}</Button>
          </div>
        </Container>
      </section>

      <section className={styles.facts} id="fun_facts" aria-label="Drop facts">
        <Container>
          <ul className={styles.factGrid}>
            {siteConfig.counters.map((item) => (
              <li key={item.label} data-reveal data-aura>
                <p className={styles.factValue}>{item.value}</p>
                <p className={styles.factLabel}>{item.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.contact} id="whitelist">
        <Container>
          <header className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>{siteConfig.copy.communityEyebrow}</p>
            <DisplayTitle text={siteConfig.copy.communityTitle} />
            <Sigil />
          </header>
          <div className={styles.whitelistLayout}>
            <div data-reveal>
              <p>{siteConfig.copy.communityBody}</p>
              <WhitelistQuest />
            </div>
            <div className={styles.whitelistLogin} data-reveal data-aura>
              <XLoginButton />
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.about} id="about">
        <div className={styles.aboutSplit}>
          <div className={styles.aboutMedia}>
            <div className={styles.aboutBg}>
              <Image src={siteConfig.assets.background} alt="" fill sizes="60vw" className={styles.aboutBgImg} />
              <div className={styles.aboutBgDim} />
            </div>
            <div className={styles.aboutFrame} data-reveal data-aura>
              <Image src={siteConfig.assets.aboutArt} alt="Arcane teaser art." width={900} height={900} />
              <span
                className={styles.ornament}
                style={{ backgroundImage: `url("${siteConfig.assets.collectionBorder}")` }}
                aria-hidden
              />
            </div>
          </div>
          <div className={styles.aboutCopy}>
            <div className={styles.aboutCopyInner} data-reveal>
              <p className={styles.kicker}>{siteConfig.copy.aboutEyebrow}</p>
              <DisplayTitle text={siteConfig.copy.aboutTitle} />
              <Sigil className={styles.aboutSigil} />
              <div className={styles.copyStack}>
                {siteConfig.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
