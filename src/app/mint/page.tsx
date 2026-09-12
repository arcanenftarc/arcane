import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mint",
  description: "Arcane minting is not live. 4,444 supply, $5 mint on OpenSea.",
};

export default function MintPage() {
  return <ComingSoon title="Mint" body={siteConfig.copy.comingMint} />;
}
