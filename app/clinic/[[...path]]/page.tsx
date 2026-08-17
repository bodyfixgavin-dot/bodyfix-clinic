import { permanentRedirect } from "next/navigation";
import { legacyClinicDestination, type QueryValue } from "@/lib/crm-routes";

export default async function LegacyClinicRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, QueryValue>>;
}) {
  const [{ path }, query] = await Promise.all([params, searchParams]);
  permanentRedirect(legacyClinicDestination(path, query));
}
