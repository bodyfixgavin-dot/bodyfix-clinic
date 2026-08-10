import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SADM 關係決策整理系統｜BF Tarot",
  description: "透過 12 張關係狀態卡，看懂互動中的滋養、拉扯與消耗。"
};

export default function SadmLayout({ children }: { children: ReactNode }) {
  return children;
}
