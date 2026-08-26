import { requireAdminPageSession } from "@/lib/admin-page-auth";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPageSession();
  return children;
}
