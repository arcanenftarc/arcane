import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Lore",
  description: "Arcane lore will be published in a later stage.",
};

export default function LorePage() {
  return <ComingSoon title="Lore" body={siteConfig.copy.comingLore} />;
}
