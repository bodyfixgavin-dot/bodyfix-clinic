import { BookingAdmin } from "@/components/admin/BookingAdmin";
import { requireAdminPageSession } from "@/lib/admin-page-auth";

export default async function BookingPage() {
  await requireAdminPageSession();
  return <BookingAdmin />;
}
