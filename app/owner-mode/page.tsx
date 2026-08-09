import { redirect } from "next/navigation";

export default async function LegacyOwnerModePage({ searchParams }: { searchParams: Promise<{ entry?: string }> }) {
  const { entry } = await searchParams;
  redirect(`/builder-mode${entry ? `?entry=${encodeURIComponent(entry)}` : ""}`);
}
