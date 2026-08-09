import type { Metadata } from "next";
import StrategicDecisions from "./StrategicDecisions";

export const metadata: Metadata = { title: "Strategic Decisions", robots: { index: false, follow: false } };

export default function StrategicDecisionsPage() { return <StrategicDecisions />; }
