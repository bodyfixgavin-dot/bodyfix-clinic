import { permanentRedirect } from "next/navigation";
import { destinationWithQuery, type QueryValue } from "@/lib/crm-routes";

export default async function LegacyDashboardRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, QueryValue>>;
}) {
  permanentRedirect(destinationWithQuery("/admin", await searchParams));
}
