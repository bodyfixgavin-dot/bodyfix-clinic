import type { Metadata } from "next";
import { Suspense } from "react";
import AdminConsoleClient from "./AdminConsoleClient";

export const metadata: Metadata = {
  title: "Restricted Interface",
  robots: { index: false, follow: false },
};

export default function AdminConsolePage() {
  return <Suspense fallback={null}><AdminConsoleClient /></Suspense>;
}
