import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollTop } from "@/components/layout/ScrollTop";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="site-main">
        {children}
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
}
