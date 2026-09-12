import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollTop } from "@/components/layout/ScrollTop";
import { siteConfig } from "@/config/site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <p className="follow-rail">
        Follow us:
        <a href={siteConfig.social.x} rel="noreferrer" target="_blank">
          X
        </a>
      </p>
      <main id="main" className="site-main">
        {children}
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
}
