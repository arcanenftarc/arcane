import { HomePage } from "@/components/home/HomePage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ x?: string }>;
}) {
  const { x } = await searchParams;
  return <HomePage xStatus={x} />;
}
