"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculateScs, DECISION_STATUSES, DEMO_STRATEGIC_DECISIONS, readSignal, suggestStatus, type DecisionStatus, type StrategicDecision } from "@/lib/strategic-decisions";
import styles from "./page.module.css";

const STORAGE_KEY = "bodyfix-strategic-decisions-v1";
const trend = { up: "↑", flat: "→", down: "↓" } as const;
const scoreFields = [
  ["result", "R", "Result｜實際結果"], ["learning", "L", "Learning｜學習價值"], ["asset", "A", "Asset｜資產累積"], ["fit", "F", "Fit｜策略吻合度"],
  ["time", "T", "Time｜時間成本"], ["cash", "C", "Cash｜金錢成本"], ["energy", "E", "Energy｜Owner 能量成本"],
] as const;

export default function StrategicDecisions() {
  const [items, setItems] = useState<StrategicDecision[]>(DEMO_STRATEGIC_DECISIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { try { setItems(JSON.parse(saved)); } catch { /* keep clearly labelled demo seed */ } } setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, hydrated]);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const counts = useMemo(() => Object.fromEntries(DECISION_STATUSES.map((status) => [status, items.filter((item) => item.ownerStatus === status).length])) as Record<DecisionStatus, number>, [items]);
  const activeTests = counts.TEST;
  const update = (next: StrategicDecision) => setItems((current) => current.map((item) => item.id === next.id ? next : item));

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}><div><Link href="/owner-mode">BODYFIX OS / OWNER MODE</Link><span> / STRATEGIC DECISIONS</span></div><span className={styles.localBadge}>LOCAL WORKSPACE · DEMO SEED</span></header>
      <section className={styles.hero}>
        <div><p className={styles.eyebrow}>STRATEGIC ABANDONMENT FRAMEWORK</p><h1>資源應該<br />繼續流向哪裡？</h1></div>
        <div className={styles.principle}><strong>READ SIGNALS → SCORE → DECIDE → REVIEW</strong><p>從現在開始，再投入下一個小時，預期能換到什麼？</p></div>
      </section>

      <section className={styles.summary} aria-label="Strategic Allocation summary">
        <div><span>STRATEGIC ALLOCATION</span><strong>{items.length}</strong><small>items under review</small></div>
        {DECISION_STATUSES.map((status) => <div key={status}><span>{status}</span><strong>{counts[status]}</strong><small>Owner decision</small></div>)}
      </section>
      {activeTests > 3 && <p className={styles.warning}>Too many active experiments. <span>Focus is being fragmented.</span></p>}
      <p className={styles.demoNote}>Development preview — 以下為 UI 驗證用 demo data，未與會員、預約或營收資料同步。</p>

      <section className={styles.board} aria-label="Strategic decision board">
        {DECISION_STATUSES.map((status) => <section className={styles.column} key={status}>
          <header><h2>{status}</h2><span>{counts[status]}</span></header>
          <p className={styles.columnIntent}>{status === "KEEP" ? "Proven value" : status === "FIX" ? "Keep the goal, repair the bottleneck" : status === "TEST" ? "Bounded exploration" : "Preserve, pause, review later"}</p>
          {items.filter((item) => item.ownerStatus === status).map((item) => {
            const scs = calculateScs(item.scores); const suggested = suggestStatus(scs);
            return <button className={styles.card} key={item.id} onClick={() => setSelectedId(item.id)}>
              <span className={styles.category}>{item.category}</span><h3>{item.name}</h3>
              <div className={styles.score}><strong>{scs.toFixed(2)}</strong><span>SCS</span></div>
              <dl><div><dt>Suggested</dt><dd>{suggested}</dd></div><div><dt>Owner</dt><dd>{item.ownerStatus}{suggested !== item.ownerStatus && " · OVERRIDE"}</dd></div><div><dt>Last review</dt><dd>{item.lastReview}</dd></div><div><dt>Next review</dt><dd>{item.nextReview || "Not set"}</dd></div><div><dt>Time invested</dt><dd>{item.timeInvested}</dd></div></dl>
              <div className={styles.signals}><span>LEADING {trend[item.leadingTrend]}</span><span>LAGGING {trend[item.laggingTrend]}</span></div>
            </button>;
          })}
        </section>)}
      </section>
      {selected && <Detail item={selected} onClose={() => setSelectedId(null)} onUpdate={update} />}
    </main>
  );
}

function Detail({ item, onClose, onUpdate }: { item: StrategicDecision; onClose: () => void; onUpdate: (item: StrategicDecision) => void }) {
  const scs = calculateScs(item.scores); const suggested = suggestStatus(scs); const signal = readSignal(item.leadingTrend, item.laggingTrend, item.weakCycles);
  const set = <K extends keyof StrategicDecision>(key: K, value: StrategicDecision[K]) => onUpdate({ ...item, [key]: value });
  const saveReview = () => { const note = window.prompt("Owner Note｜這次 review 的判斷？", "") ?? ""; onUpdate({ ...item, lastReview: new Date().toISOString().slice(0,10), decisionLog: [{ date: new Date().toISOString().slice(0,10), from: item.decisionLog.at(-1)?.to ?? item.ownerStatus, to: item.ownerStatus, scs, note, overrideReason: item.overrideReason }, ...item.decisionLog] }); };
  return <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={`${item.name} detail`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><article className={styles.detail}>
    <header className={styles.detailHeader}><div><span>{item.category}</span><h2>{item.name}</h2><p>{item.description}</p></div><button onClick={onClose} aria-label="Close detail">×</button></header>
    <section className={styles.decisionStrip}><div><small>SCS</small><strong>{scs.toFixed(2)}</strong></div><div><small>SYSTEM SUGGESTED</small><strong>{suggested}</strong></div><label><span>OWNER DECISION</span><select value={item.ownerStatus} onChange={(e) => set("ownerStatus", e.target.value as DecisionStatus)}>{DECISION_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label></section>
    {suggested !== item.ownerStatus && <label className={styles.fullLabel}>為什麼 override？<textarea value={item.overrideReason} onChange={(e) => set("overrideReason", e.target.value)} placeholder="記錄 Owner 判斷與系統建議不同的原因" /></label>}
    <section className={styles.detailSection}><h3>SCS / CONTINUATION VALUE</h3><p className={styles.formula}>SCS = (R + L + A + F) / (T + C + E) · 每項 0–5</p><div className={styles.scoreGrid}>{scoreFields.map(([key, code, label]) => <label key={key}><span><b>{code}</b>{label}</span><input type="range" min="0" max="5" value={item.scores[key]} onChange={(e) => onUpdate({ ...item, scores: { ...item.scores, [key]: Number(e.target.value) } })} /><output>{item.scores[key]}</output></label>)}</div></section>
    <section className={styles.detailSection}><h3>READ SIGNALS</h3><div className={styles.signalFinding}><strong>{signal.title}</strong><p>{signal.message}</p></div><div className={styles.twoCol}><label>Leading Indicators<textarea value={item.leadingIndicators} onChange={(e) => set("leadingIndicators", e.target.value)} /></label><label>Lagging Indicators<textarea value={item.laggingIndicators} onChange={(e) => set("laggingIndicators", e.target.value)} /></label></div></section>
    <section className={styles.detailSection}><h3>EVIDENCE</h3><div className={styles.twoCol}>{(["evidence","customerFeedback","revenueResult","learning"] as const).map((key) => <label key={key}>{({ evidence:"實際數據", customerFeedback:"客戶回饋", revenueResult:"營收結果", learning:"目前學習" })[key]}<textarea value={item[key]} onChange={(e) => set(key, e.target.value)} /></label>)}</div></section>
    {item.ownerStatus === "TEST" && <section className={styles.detailSection}><h3>EXPERIMENT TIMEBOX</h3><p className={styles.hint}>建議：7 天（CTA / 文案 / Hook）· 14 天（流程 / Landing Page）· 4 週（內容 / 渠道）· 6–8 週（新服務定位）</p><div className={styles.formGrid}><label>Test Hypothesis<input value={item.hypothesis} onChange={(e) => set("hypothesis", e.target.value)} /></label><label>Success Metric<input value={item.successMetric} onChange={(e) => set("successMetric", e.target.value)} /></label><label>Start Date<input type="date" value={item.startDate} onChange={(e) => set("startDate", e.target.value)} /></label><label>Review Date<input type="date" value={item.nextReview} onChange={(e) => set("nextReview", e.target.value)} /></label><label>Maximum Time Budget<input value={item.maximumTimeBudget} onChange={(e) => set("maximumTimeBudget", e.target.value)} /></label><label>Maximum Cash Budget<input value={item.maximumCashBudget} onChange={(e) => set("maximumCashBudget", e.target.value)} /></label></div></section>}
    <section className={`${styles.detailSection} ${styles.future}`}><h3>FUTURE VALUE / FUTURE COST</h3><blockquote>不要問「已經做了多少」。<br />問「從現在開始，再投入下一個小時是否值得？」</blockquote><div className={styles.futureInputs}><label>Future Expected Value (0–5)<input type="number" min="0" max="5" value={item.futureExpectedValue} onChange={(e) => set("futureExpectedValue", Number(e.target.value))} /></label><label>Future Expected Cost (0–5)<input type="number" min="0" max="5" value={item.futureExpectedCost} onChange={(e) => set("futureExpectedCost", Number(e.target.value))} /></label></div><p>歷史投入（僅供參考，不加入公式）：{item.timeInvested}</p></section>
    <section className={styles.detailSection}><div className={styles.sectionTitle}><h3>DECISION LOG</h3><button onClick={saveReview}>SAVE REVIEW</button></div>{item.decisionLog.length ? <div className={styles.log}>{item.decisionLog.map((log, i) => <div key={`${log.date}-${i}`}><b>{log.date}</b><span>{log.from} → {log.to}</span><span>SCS {log.scs.toFixed(2)}</span><p>{log.note || "No owner note"}{log.overrideReason && ` · Override: ${log.overrideReason}`}</p></div>)}</div> : <p className={styles.empty}>尚無 review 紀錄。儲存後會保留日期、狀態、SCS、Owner Note 與 Override Reason。</p>}</section>
  </article></div>;
}
