import Image from "next/image";
import Link from "next/link";
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
  { src: siteConfig.assets.collections[0], alt: "Portal fragment from the Arcane visual world.", caption: "Portal" },
  { src: siteConfig.assets.collections[1], alt: "A dark relic lit by ice-blue glow.", caption: "Relic" },
  { src: siteConfig.assets.collections[2], alt: "A distant stone ring gate in night sky.", caption: "Gate" },
  { src: siteConfig.assets.collections[3], alt: "Abstract cyan energy filaments forming a sigil.", caption: "Sigil" },
];

export function HomePage({ xStatus }: { xStatus?: string }) {
  const collectionRow = [...teasers, ...teasers];
  const collectionTop = collectionRow.slice(0, 4);
  const collectionBottom = collectionRow.slice(4, 8);
  const featured = siteConfig.updates[0];
  const sideUpdates = siteConfig.updates.slice(1);

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
              <Button href="/#mint-title" variant="secondary">
                How to mint
              </Button>
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
              <DisplayTitle text={siteConfig.copy.aboutTitle} align="left" />
              <SlashRule />
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

        <Container className={styles.mintBlock}>
          <div className={styles.mintCopy}>
            <DisplayTitle id="mint-title" text={siteConfig.copy.mintTitle} align="left" />
            <SlashRule />
            <div className={styles.copyStack}>
              {siteConfig.mintParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <Button href={siteConfig.routes.mint}>How to mint</Button>
          </div>
          <div className={styles.mintRight}>
            <ol className={styles.steps}>
              {siteConfig.process.map((step) => (
                <li key={step.n}>
                  <div className={styles.step}>
                    <p className={styles.stepN}>{step.n}</p>
                    <p className={styles.stepTitle}>{step.title}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.video}>
              <Image src={siteConfig.assets.background} alt="" width={1280} height={720} />
              <p className={styles.play} aria-hidden="true">
                ▶
              </p>
              <p className={styles.videoNote}>{siteConfig.copy.videoNote}</p>
            </div>
          </div>
        </Container>
      </section>

      <Divider />

      <section className={styles.collection} id="collection">
        <Container>
          <DisplayTitle text={siteConfig.copy.collectionTitle} size="lg" />
          <div className={styles.mosaic}>
            <div className={styles.mosaicTop}>
              {collectionTop.map((item, i) => (
                <figure className={styles.piece} key={`top-${item.src}-${i}`}>
                  <div className={styles.pieceIn}>
                    <Image src={item.src} alt={item.alt} width={640} height={640} />
                  </div>
                </figure>
              ))}
            </div>
            <div className={styles.mosaicBottom}>
              {collectionBottom.map((item, i) => (
                <figure className={styles.piece} key={`bot-${item.src}-${i}`}>
                  <div className={styles.pieceIn}>
                    <Image src={item.src} alt={item.alt} width={640} height={640} />
                  </div>
                </figure>
              ))}
            </div>
          </div>
          <div className={styles.desc}>
            <p>{siteConfig.copy.collectionBody}</p>
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
                <span className={styles.phaseDot} aria-hidden="true" />
                <p className={styles.phaseTag}>{item.phase}</p>
                <div className={styles.phaseBody}>
                  <p className={styles.phaseWhen}>{item.when}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Divider />

      <section className={styles.news} id="news">
        <Container>
          <DisplayTitle text={siteConfig.copy.newsTitle} size="lg" />
          <div className={styles.newsPart}>
            <article className={styles.newsFeature}>
              <p className={styles.newsN}>{featured.n}</p>
              <p className={styles.newsMeta}>{featured.meta}</p>
              <h3>
                <Link href={featured.href}>{featured.title}</Link>
              </h3>
              <div className={styles.newsImage}>
                <Image src={teasers[0].src} alt="" width={900} height={640} />
              </div>
              <Link className={styles.readMore} href={featured.href}>
                Read more
              </Link>
            </article>
            <div className={styles.newsSide}>
              {sideUpdates.map((item) => (
                <article className={styles.newsItem} key={item.n}>
                  <p className={styles.newsN}>{item.n}</p>
                  <p className={styles.newsMeta}>{item.meta}</p>
                  <h3>
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                  <Link className={styles.readMore} href={item.href}>
                    Read more
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.newsBottom}>
            <Button href={siteConfig.routes.lore} full>
              Read all updates
            </Button>
            <p>{siteConfig.copy.newsIntro}</p>
          </div>
        </Container>
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
