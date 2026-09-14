import { XSessionProvider } from "@/components/auth/XSession";
import { Footer } from "@/components/layout/Footer";
import { InPageScroll } from "@/components/layout/InPageScroll";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollTop } from "@/components/layout/ScrollTop";
import { SoundLayer } from "@/components/layout/SoundLayer";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <XSessionProvider>
      <div className="site-backdrop" aria-hidden>
        <Image
          src={siteConfig.assets.siteBackground}
          alt=""
          fill
          sizes="100vw"
          priority
          unoptimized
        />
      </div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <InPageScroll />
      <SoundLayer />
      <Navbar />
      <main id="main" className="site-main">
        {children}
      </main>
      <Footer />
      <ScrollTop />
    </XSessionProvider>
  );
}
