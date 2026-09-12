import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Collection",
  description: "Arcane collection gallery arrives in a later stage.",
};

export default function CollectionPage() {
  return <ComingSoon title="Collection" body={siteConfig.copy.comingCollection} />;
}
