"use client";

import { useEffect } from "react";

export default function ConsoleEasterEgg() {
  useEffect(() => {
    console.group("%c[BodyFix OS / Builder Mode]", "color:#c6a46c;font-family:monospace;font-weight:700;");
    console.log("%cGUEST TRACE DETECTED.", "color:#8f9aa8;font-family:monospace;font-weight:700;");
    console.log("%cYou found a layer most visitors never inspect.", "color:#f4efe6;font-family:monospace;");
    console.log("%c這裡不是營運後台。\n這是一份關於 BodyFix 網站如何被建造、推翻與重新整理的紀錄。", "color:#aeb8c4;font-family:monospace;line-height:1.7;");
    console.log("%cOpen /builder-mode?entry=console", "color:#c6a46c;font-family:monospace;font-weight:700;");
    console.groupEnd();
  }, []);
  return null;
}
