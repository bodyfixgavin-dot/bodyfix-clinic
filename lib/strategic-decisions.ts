export const DECISION_STATUSES = ["KEEP", "FIX", "TEST", "PARK"] as const;
export type DecisionStatus = (typeof DECISION_STATUSES)[number];
export type SignalTrend = "up" | "flat" | "down";

export const SCS_THRESHOLDS = {
  keep: 1.5,
  fix: 1,
  test: 0.6,
} as const;

export type StrategicScores = {
  result: number; learning: number; asset: number; fit: number;
  time: number; cash: number; energy: number;
};

export type DecisionLog = {
  date: string; from: DecisionStatus; to: DecisionStatus; scs: number;
  note: string; overrideReason: string;
};

export type StrategicDecision = {
  id: string; name: string; description: string; category: string;
  ownerStatus: DecisionStatus; scores: StrategicScores;
  lastReview: string; nextReview: string; timeInvested: string;
  leadingTrend: SignalTrend; laggingTrend: SignalTrend; weakCycles: number;
  evidence: string; customerFeedback: string; revenueResult: string; learning: string;
  leadingIndicators: string; laggingIndicators: string;
  hypothesis: string; startDate: string; successMetric: string;
  maximumTimeBudget: string; maximumCashBudget: string;
  futureExpectedValue: number; futureExpectedCost: number;
  overrideReason: string; decisionLog: DecisionLog[];
};

export function calculateScs(scores: StrategicScores) {
  const value = scores.result + scores.learning + scores.asset + scores.fit;
  const cost = scores.time + scores.cash + scores.energy;
  return cost === 0 ? value : value / cost;
}

export function suggestStatus(score: number): DecisionStatus {
  if (score >= SCS_THRESHOLDS.keep) return "KEEP";
  if (score >= SCS_THRESHOLDS.fix) return "FIX";
  if (score >= SCS_THRESHOLDS.test) return "TEST";
  return "PARK";
}

export function readSignal(leading: SignalTrend, lagging: SignalTrend, weakCycles = 0) {
  if (leading === "up" && lagging === "flat") return { title: "Possible Valley｜可能處於成果延遲期", message: "領先指標正在改善，結果指標尚未跟上，不建議只因短期沒有營收就停止。" };
  if (leading === "up" && lagging === "down") return { title: "Conversion Problem｜可能存在轉換問題", message: "市場訊號存在，但結果沒有承接，優先檢查流程、CTA、價格、服務說明或預約體驗；優先考慮 FIX。" };
  if (leading === "down" && lagging === "down" && weakCycles >= 2) return { title: "Weak Signal｜持續弱訊號", message: "多個 Review Cycle 訊號持續偏弱，可考慮 TEST → PARK；系統不會自動切換。" };
  return { title: "Observe｜持續觀察", message: "目前沒有足夠的方向性訊號，請在下一個 Review Cycle 再判讀。" };
}

const score = (result: number, learning: number, asset: number, fit: number, time: number, cash: number, energy: number): StrategicScores => ({ result, learning, asset, fit, time, cash, energy });

export const DEMO_STRATEGIC_DECISIONS: StrategicDecision[] = [
  { id: "core-services", name: "BodyFix Core Services", description: "已驗證的核心身體服務與客戶體驗。", category: "Core service", ownerStatus: "KEEP", scores: score(5,4,4,5,3,2,3), lastReview: "2026-08-01", nextReview: "2026-09-01", timeInvested: "持續營運", leadingTrend: "up", laggingTrend: "up", weakCycles: 0, evidence: "穩定服務需求與回訪。", customerFeedback: "客戶能理解服務價值。", revenueResult: "已有穩定營收。", learning: "持續累積服務 SOP。", leadingIndicators: "詢問與回訪意圖上升", laggingIndicators: "預約與營收上升", hypothesis: "", startDate: "", successMetric: "", maximumTimeBudget: "", maximumCashBudget: "", futureExpectedValue: 5, futureExpectedCost: 3, overrideReason: "", decisionLog: [] },
  { id: "tension-booking", name: "Body Tension Test → Booking Flow", description: "改善完成測驗後到預約服務的承接。", category: "Conversion", ownerStatus: "FIX", scores: score(2,5,4,5,3,1,3), lastReview: "2026-08-03", nextReview: "2026-08-17", timeInvested: "18 hr", leadingTrend: "up", laggingTrend: "down", weakCycles: 0, evidence: "測驗完成量有訊號，預約承接不足。", customerFeedback: "部分使用者不知道下一步選哪個服務。", revenueResult: "轉換率低於期待。", learning: "CTA 與服務說明是主要瓶頸。", leadingIndicators: "測驗完成 ↑ / 預約頁點擊 ↑", laggingIndicators: "預約 ↓", hypothesis: "簡化結果頁 CTA 能提高預約頁到達率。", startDate: "2026-08-03", successMetric: "預約頁點擊率提升 20%", maximumTimeBudget: "8 hr", maximumCashBudget: "NT$ 0", futureExpectedValue: 5, futureExpectedCost: 2, overrideReason: "", decisionLog: [] },
  { id: "pelvic-hook", name: "Pelvic Core Hook Experiment", description: "驗證新的骨盆核心內容 Hook 是否帶來有效詢問。", category: "Marketing experiment", ownerStatus: "TEST", scores: score(1,4,3,4,2,1,2), lastReview: "2026-08-05", nextReview: "2026-08-19", timeInvested: "4 hr", leadingTrend: "up", laggingTrend: "flat", weakCycles: 0, evidence: "初期收藏與 DM 增加。", customerFeedback: "Hook 容易理解，但服務連結仍不明確。", revenueResult: "尚無可歸因營收。", learning: "受眾對骨盆核心語言有反應。", leadingIndicators: "收藏 ↑ / DM ↑", laggingIndicators: "預約 →", hypothesis: "清楚的骨盆核心 Hook 會增加合格 DM。", startDate: "2026-08-05", successMetric: "14 天取得 8 個合格 DM", maximumTimeBudget: "6 hr", maximumCashBudget: "NT$ 1,500", futureExpectedValue: 4, futureExpectedCost: 2, overrideReason: "", decisionLog: [] },
  { id: "visual-polish", name: "Non-critical Website Visual Polish", description: "非核心頁面的細節視覺調整。", category: "Website", ownerStatus: "PARK", scores: score(0,1,1,1,4,1,3), lastReview: "2026-07-28", nextReview: "2026-10-01", timeInvested: "6 hr", leadingTrend: "flat", laggingTrend: "flat", weakCycles: 1, evidence: "目前沒有直接營運影響。", customerFeedback: "無。", revenueResult: "無可歸因結果。", learning: "改善屬偏好而非瓶頸。", leadingIndicators: "→", laggingIndicators: "→", hypothesis: "", startDate: "", successMetric: "", maximumTimeBudget: "", maximumCashBudget: "", futureExpectedValue: 1, futureExpectedCost: 4, overrideReason: "", decisionLog: [] },
];
