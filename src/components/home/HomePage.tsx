import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayTitle } from "@/components/ui/DisplayTitle";
import { Divider } from "@/components/ui/Divider";
import { SlashRule } from "@/components/ui/SlashRule";
import { XLoginButton } from "@/components/auth/XLoginButton";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import styles from "./HomePage.module.css";

const teasers = [
  { src: siteConfig.assets.collections[0], alt: "Portal fragment from the Arcane visual world." },
  { src: siteConfig.assets.collections[1], alt: "A dark relic lit by ice-blue glow." },
  { src: siteConfig.assets.collections[2], alt: "A distant stone ring gate in night sky." },
  { src: siteConfig.assets.collections[3], alt: "Abstract cyan energy filaments forming a sigil." },
];

export function HomePage({ xStatus }: { xStatus?: string }) {
  return (
    <>
      <section className={styles.hero} id="home" aria-label="Arcane home">
        <Container>
          <div className={styles.heroTitle}>
            <DisplayTitle text={siteConfig.copy.heroTitle} as="h1" size="lg" />
          </div>
          <HeroCarousel slides={teasers} />
          <div className={styles.desc}>
            <p>{siteConfig.copy.heroLead}</p>
            <div className={styles.heroActions}>
              <Button href="/#whitelist">{siteConfig.copy.whitelistCta}</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.facts} id="fun_facts" aria-label="Drop facts">
        <Container>
          <ul className={styles.factGrid}>
            {siteConfig.counters.map((item) => (
              <li key={item.label}>
                <p className={styles.factValue}>{item.value}</p>
                <p className={styles.factLabel}>{item.label}</p>
                <span className={styles.factRule} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.about} id="about">
        <div className={styles.aboutSplit}>
          <div className={styles.aboutMedia}>
            <div className={styles.aboutBg}>
              <Image src={siteConfig.assets.background} alt="" fill sizes="60vw" className={styles.aboutBgImg} />
              <div className={styles.aboutBgDim} />
            </div>
            <div className={styles.aboutFrame}>
              <Image src={siteConfig.assets.collections[0]} alt="Portal fragment." width={900} height={900} />
            </div>
          </div>
          <div className={styles.aboutCopy}>
            <div className={styles.aboutCopyInner}>
              <DisplayTitle text={siteConfig.copy.aboutTitle} />
              <SlashRule align="center" />
              <div className={styles.copyStack}>
                {siteConfig.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              <Button href={siteConfig.routes.lore} variant="secondary">
                Open lore
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section className={styles.contact} id="whitelist">
        <Container>
          <DisplayTitle text={siteConfig.copy.communityTitle} size="lg" />
          <div className={styles.whitelistLayout}>
            <div>
              <p>{siteConfig.copy.communityBody}</p>
              <p>{siteConfig.copy.communityBody2}</p>
              <ol className={styles.whitelistSteps}>
                {siteConfig.whitelistSteps.map((step) => (
                  <li key={step.n}>
                    <p className={styles.stepN}>{step.n}</p>
                    <p className={styles.stepTitle}>{step.title}</p>
                    <p>{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.whitelistLogin}>
              <p className={styles.contactLabel}>Sign in</p>
              <p className={styles.whitelistLead}>Connect X to apply. This is not a wallet connect.</p>
              <XLoginButton />
              {xStatus === "setup" ? <p className={styles.notice}>{siteConfig.copy.xSetup}</p> : null}
              {xStatus === "error" ? <p className={styles.notice}>{siteConfig.copy.xError}</p> : null}
              {xStatus === "ok" ? <p className={styles.notice}>{siteConfig.copy.xOk}</p> : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
