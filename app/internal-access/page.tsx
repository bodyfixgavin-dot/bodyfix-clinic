import { redirect } from "next/navigation";

export default async function LegacyInternalAccessPage({ searchParams }: { searchParams: Promise<{ entry?: string }> }) {
  const { entry } = await searchParams;
  redirect(`/admin-console${entry ? `?entry=${encodeURIComponent(entry)}` : ""}`);
}
