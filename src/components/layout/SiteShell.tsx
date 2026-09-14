import { XSessionProvider } from "@/components/auth/XSession";
import { Footer } from "@/components/layout/Footer";
import { InPageScroll } from "@/components/layout/InPageScroll";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollTop } from "@/components/layout/ScrollTop";
import { SoundLayer } from "@/components/layout/SoundLayer";
import { siteConfig } from "@/config/site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <XSessionProvider>
      <div
        className="site-backdrop"
        aria-hidden
        style={{ backgroundImage: `url("${siteConfig.assets.siteBackground}")` }}
      />
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
