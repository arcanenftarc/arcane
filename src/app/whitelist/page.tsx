import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Whitelist",
  description: "Arcane whitelist applications are not open yet.",
};

export default function WhitelistPage() {
  return <ComingSoon title="Whitelist" body={siteConfig.copy.comingWhitelist} />;
}
