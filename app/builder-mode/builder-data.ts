export type BuildNote = {
  problem: string;
  original: string;
  issue: string;
  decision: string;
  aiRole: string;
  humanDecision: string;
  beforeAfter: string;
  status: string;
  nextValidation: string;
};

export type BuilderSection = {
  id: string;
  label: string;
  subtitle: string;
  paragraphs: string[];
  notes: BuildNote[];
};

const emptyNote: BuildNote = {
  problem: "Build note coming soon",
  original: "尚未整理",
  issue: "尚未整理",
  decision: "尚未整理",
  aiRole: "尚未記錄",
  humanDecision: "尚未記錄",
  beforeAfter: "尚未提供",
  status: "等待第一份可查證的建造紀錄",
  nextValidation: "新增紀錄時，確認決策、AI 參與與人工判斷均有來源。",
};

export const builderSections: BuilderSection[] = [
  { id: "service", label: "SERVICE", subtitle: "服務如何被翻譯成網站", paragraphs: ["一項只能靠本人說明的服務，要如何變成客戶能理解、能選擇，也知道下一步怎麼走的網站內容？", "這裡拆解 BodyFix 如何整理服務名稱、方法、價格、界線與選擇路徑。"], notes: [emptyNote] },
  { id: "flow", label: "FLOW", subtitle: "預約與使用路徑如何被整理", paragraphs: ["網站不只是放上一顆預約按鈕。從第一次理解服務、選擇項目，到留下資料與完成確認，每一步都會影響使用者是否繼續。", "這裡記錄表單、分流與使用者流程的設計方式。"], notes: [emptyNote] },
  { id: "build-log", label: "BUILD LOG", subtitle: "留下錯誤、版本與重做的痕跡", paragraphs: ["完成的畫面看不見中間發生過什麼。哪些方向被放棄、哪些文案被重寫、哪些功能曾經失敗，才是最值得留下的部分。", "這裡保存 BodyFix OS 的版本演進與 AI 協作紀錄。"], notes: [emptyNote] },
  { id: "tools", label: "TOOLS", subtitle: "AI、程式工具與 Prompt", paragraphs: ["工具不會替人完成判斷。真正重要的是如何提問、如何驗證輸出，以及什麼時候應該推翻重來。", "這裡整理製作網站時使用的工具、Prompt、元件與技術選擇。"], notes: [emptyNote] },
];
