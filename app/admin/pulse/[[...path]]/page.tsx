import { permanentRedirect } from "next/navigation";
import { legacyPulseDestination, type QueryValue } from "@/lib/crm-routes";

export default async function LegacyPulseRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, QueryValue>>;
}) {
  const [{ path }, query] = await Promise.all([params, searchParams]);
  permanentRedirect(legacyPulseDestination(path, query));
}
