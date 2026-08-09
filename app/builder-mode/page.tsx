import type { Metadata } from "next";
import { Suspense } from "react";
import BuilderModeClient from "./BuilderModeClient";

export const metadata: Metadata = { title: "Builder Mode", robots: { index: false, follow: false } };

export default function BuilderModePage() { return <Suspense fallback={null}><BuilderModeClient /></Suspense>; }
