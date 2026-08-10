"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SadmPage.module.css";

type Metric = "PR" | "BC" | "GL" | "NA" | "UA" | "TC" | "SC" | "CC" | "AV" | "EMV";
type Question = { name: string; hookTitle: string; answerStatement: string; microCopy: string; metrics: Metric[] };

const questions: Question[] = [
  { name: "忽冷忽熱卡", hookTitle: "他有時很熱，有時又像消失？", answerStatement: "他的忽冷忽熱，常常讓我忍不住一直猜他到底在想什麼。", microCopy: "不穩定的溫柔，最容易讓人誤以為是心動。", metrics: ["UA"] },
  { name: "關係霧區卡", hookTitle: "你們一直卡在「不知道算什麼」？", answerStatement: "我們之間有曖昧、有親密、有期待，但關係定位一直很模糊。", microCopy: "模糊不是浪漫，模糊有時是讓你繼續等的空間。", metrics: ["PR"] },
  { name: "麵包屑回溫卡", hookTitle: "他是不是每次你快放下時，又剛好出現？", answerStatement: "每次我快要放下，他就會突然變溫柔、突然關心，讓我又捨不得走。", microCopy: "麵包屑不是愛，是剛好不讓你走的訊號。", metrics: ["BC"] },
  { name: "未來支票卡", hookTitle: "他講過很多以後，但很少真的做到？", answerStatement: "他說過很多之後、有一天、等我忙完，但真正落地的行動很少。", microCopy: "承諾如果沒有行動，就只是讓你繼續等的劇本。", metrics: ["PR"] },
  { name: "自我懷疑卡", hookTitle: "你常常懷疑自己是不是太敏感？", answerStatement: "我明明感覺不舒服，卻常常被他說到懷疑是不是自己太敏感、太愛想。", microCopy: "當你開始不相信自己的感覺，這段互動就已經影響你了。", metrics: ["GL"] },
  { name: "反向道歉卡", hookTitle: "你提出需求後，最後反而變成你在道歉？", answerStatement: "我本來只是想說出不安或需求，但聊到最後，常常變成我在解釋、安撫，甚至道歉。", microCopy: "健康的溝通，不會讓提出需求的人變成罪人。", metrics: ["CC", "GL"] },
  { name: "情緒急救站卡", hookTitle: "他情緒不好時，你會覺得自己有責任讓他好起來？", answerStatement: "只要他低落、崩潰或脆弱，我就會自動進入照顧模式，覺得自己不能離開。", microCopy: "你可以關心他，但你不是他的情緒急救站。", metrics: ["NA"] },
  { name: "例外感上癮卡", hookTitle: "你享受他只對你示弱的感覺？", answerStatement: "當他說只有我懂他、只會跟我講這些時，我會覺得自己很特別、很重要。", microCopy: "被當成例外很迷人，但不等於被真正選擇。", metrics: ["NA"] },
  { name: "等訊息耗損卡", hookTitle: "你常常等他的訊息等到生活亂掉？", answerStatement: "我會一直看手機、猜他為什麼沒回，也會因為他的訊息影響整天心情。", microCopy: "如果你的一天被他的訊息控制，那成本已經開始變高。", metrics: ["TC"] },
  { name: "自我流失卡", hookTitle: "這段關係讓你越來越不像自己？", answerStatement: "在這段關係裡，我變得更焦慮、更小心、更常自責，也越來越不敢直接表達自己。", microCopy: "一段關係最貴的成本，是你慢慢失去自己。", metrics: ["SC"] },
  { name: "被珍惜確認卡", hookTitle: "跟他互動後，你有感覺被珍惜嗎？", answerStatement: "跟他互動後，我真的有感覺自己被尊重、被在乎、被好好對待。", microCopy: "真正的喜歡，不只讓你心跳，也會讓你感到安定。", metrics: ["EMV"] },
  { name: "刺激綁架卡", hookTitle: "你是真的喜歡他，還是被刺激感綁住？", answerStatement: "我放不下的，更多是那種忽冷忽熱、時好時壞、讓我一直想確認的刺激感。", microCopy: "有些心動，不是愛變深，而是不確定性變高。", metrics: ["AV"] }
];

const options = ["完全不像", "有一點像", "很像", "根本就是我"];
const metricNames: Record<Metric, string> = { PR: "關係模糊與高風險訊號", BC: "麵包屑與回溫牽引", GL: "自我懷疑與感受被否定", NA: "被需要感與照顧者模式", UA: "不確定性與忽冷忽熱牽引", TC: "等待與時間消耗", SC: "自我流失與情緒消耗", CC: "溝通壓力與反覆解釋", AV: "刺激感與吸引力陷阱", EMV: "被珍惜與情感收益" };

const reports = {
  stable: { title: "穩定滋養型", translation: "你在這段關係裡，不只是心動，也有被穩定對待。", insight: "你不需要一直猜，也不需要一直證明自己值得被愛。這段互動目前比較能讓你感到安心、被尊重，也比較不會讓你失去自己。", action: "保持觀察，也保持自己的生活節奏。穩定的關係不需要讓你失去自己。" },
  repair: { title: "可修正低谷型", translation: "這段關係有壓力，但還不一定是死巷。", insight: "目前的問題不一定代表完全沒救，但需要看見具體行動，而不是只聽承諾。真正的重點是，接下來有沒有穩定、具體、可持續的改善。", action: "設定 14 到 30 天觀察期，只看行動，不看情緒承諾。" },
  cost: { title: "高消耗牽引型", translation: "你不是沒有感覺，而是這段關係讓你付出的成本已經偏高。", insight: "你可能一直在想，再努力一點是不是就會變好。但如果一段關係長期讓你等、猜、自責、生活變亂，那就不是單純的愛，而是消耗正在變高。", action: "先降低投入，不要再用更多消耗證明自己值得被愛。" },
  uncertainty: { title: "不確定性上癮型", translation: "你放不下的，可能不是愛本身，而是下一次回溫的期待。", insight: "有時很甜，有時消失；有時靠近，有時又讓你猜。這種不穩定會讓大腦一直等待下一次獎賞，久了就容易把焦慮誤認成心動。", action: "接下來 7 天，先停止解碼每一則訊息，只觀察對方是否有穩定行動。" },
  needed: { title: "被需要上癮型", translation: "你可能把「被需要」誤認成「被愛」。", insight: "你很會照顧人，也很容易因為自己對他很重要，就忽略自己其實也需要被照顧。被需要很迷人，但如果只有你在承接他，這段關係就會慢慢失衡。", action: "問自己一句：這段關係有沒有也照顧到我？" },
  gaslight: { title: "煤氣燈覺察型", translation: "你可能正在慢慢失去對自己感受的信任。", insight: "當你每次提出不安，最後都變成你在懷疑自己，這段互動就已經開始影響你的判斷。你不是一定太敏感，你可能只是太常被否定。", action: "先把事實寫下來，不要只靠當下情緒判斷。你需要的是重新相信自己的感覺。" },
  warning: { title: "海王雷達高警示型", translation: "這段互動出現明顯高風險訊號。", insight: "對方不一定是故意傷害你，但目前的模式可能正在讓你一直猜、一直等、一直消耗。這不是要你立刻判他有罪，而是提醒你先保護自己的時間、情緒和自我價值。", action: "先停止加碼投入，觀察對方是否有穩定、具體、可持續的行動。" }
};

export default function SadmTarotPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(12));
  const [phase, setPhase] = useState<"quiz" | "activation" | "result">("quiz");
  const cardRef = useRef<HTMLElement>(null);

  const scores = useMemo(() => {
    const totals = Object.fromEntries(Object.keys(metricNames).map((key) => [key, 0])) as Record<Metric, number>;
    const counts = { ...totals };
    questions.forEach((question, index) => question.metrics.forEach((metric) => { totals[metric] += answers[index] ?? 0; counts[metric] += 1; }));
    return Object.fromEntries(Object.keys(totals).map((key) => [key, totals[key as Metric] / Math.max(counts[key as Metric], 1)])) as Record<Metric, number>;
  }, [answers]);

  const report = useMemo(() => {
    const riskMetrics: Metric[] = ["PR", "BC", "GL", "NA", "UA", "TC", "SC", "CC", "AV"];
    const riskAverage = riskMetrics.reduce((sum, key) => sum + scores[key], 0) / riskMetrics.length;
    const emotionalGap = 3 - scores.EMV;
    if (scores.PR >= 2.5 && riskAverage >= 2) return reports.warning;
    if (scores.GL >= 2.25 || scores.CC >= 2.75) return reports.gaslight;
    if (scores.NA >= 2.25) return reports.needed;
    if ((scores.UA + scores.BC + scores.AV) / 3 >= 2) return reports.uncertainty;
    if (riskAverage >= 1.8 || scores.SC >= 2.25 || scores.TC >= 2.25) return reports.cost;
    if (scores.EMV >= 2.2 && riskAverage < 1.2) return reports.stable;
    if (emotionalGap <= 1.25 && riskAverage < 1.7) return reports.stable;
    return reports.repair;
  }, [scores]);

  const topMetrics = useMemo(() => (Object.keys(scores) as Metric[]).sort((a, b) => {
    const aRisk = a === "EMV" ? 3 - scores[a] : scores[a];
    const bRisk = b === "EMV" ? 3 - scores[b] : scores[b];
    return bRisk - aRisk;
  }).slice(0, 3), [scores]);

  useEffect(() => { if (phase !== "quiz" || step > 0) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [step, phase]);

  function answer(value: number) {
    setAnswers((current) => current.map((answer, index) => index === step ? value : answer));
    window.setTimeout(() => step === questions.length - 1 ? setPhase("activation") : setStep((current) => current + 1), 180);
  }

  function showResult() { setPhase("result"); window.requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }
  const level = (value: number, metric: Metric) => { const normalized = metric === "EMV" ? value : value; return normalized < 1 ? "低" : normalized < 2 ? "中" : "高"; };

  return <main className={styles.pageShell}>
    <nav className={styles.nav}><Link className={styles.brand} href="/tarot/sadm"><span className={styles.brandMark}>BF</span><span>BF Tarot · SADM</span></Link></nav>
    <section className={styles.hero}>
      <div className={styles.heroContent}><p className={styles.eyebrow}>Relationship Decision Mapping System</p><h1>你不是放不下他，<br />你是還沒看清這段關係的成本。</h1><p className={styles.heroSubtitle}>用 12 張狀態卡，看懂這段互動帶給你的滋養、拉扯與消耗。</p><div className={styles.heroActions}><a className={styles.primaryButton} href="#test">開始整理這段關係</a></div></div>
      <aside className={styles.heroPanel}><p>不是問他愛不愛你，而是看這段關係如何影響你。</p><strong>憑最近一個月的真實感受作答。</strong><span>沒有標準答案，也不用替對方找理由。</span></aside>
    </section>

    <section className={styles.testSection} id="test" ref={cardRef}>
      {phase === "quiz" && <div className={styles.quizWrap}>
        <div className={styles.quizProgress}><span>關係狀態卡 {String(step + 1).padStart(2, "0")} / 12</span><div><i style={{ width: `${((step + 1) / 12) * 100}%` }} /></div></div>
        <article className={styles.questionCard}>
          <p className={styles.cardName}>{questions[step].name}</p><h2>{questions[step].hookTitle}</h2>
          <div className={styles.answerStatement}><small>請針對下面這句話作答</small><p>{questions[step].answerStatement}</p></div>
          <div className={styles.answerGrid}>{options.map((option, value) => <button key={option} type="button" className={answers[step] === value ? styles.answerSelected : ""} onClick={() => answer(value)}><span>{option}</span><small>{value} 分</small></button>)}</div>
          <p className={styles.microCopy}>{questions[step].microCopy}</p>
          <div className={styles.quizNav}><button type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>← 上一題</button><span>選擇後會自動前往下一題</span></div>
        </article>
      </div>}

      {phase === "activation" && <article className={styles.activationCard}><p className={styles.sectionKicker}>前額葉啟動</p><h2>先把心動放旁邊，看看這段關係真正留下了什麼。</h2><p>你的答案已經整理完成。結果不是替任何人貼標籤，而是幫你重新看見自己的感受、時間與界線。</p><button className={styles.primaryButton} type="button" onClick={showResult}>查看我的關係狀態</button></article>}

      {phase === "result" && <article className={styles.humanReport} aria-live="polite">
        <p className={styles.sectionKicker}>你的關係狀態</p><h2>{report.title}</h2><p className={styles.translation}>{report.translation}</p><div className={styles.insight}><h3>給你的溫柔洞察</h3><p>{report.insight}</p></div>
        <div><h3>你主要卡在這裡</h3><div className={styles.metricGrid}>{topMetrics.map((metric) => <div key={metric}><span>{metricNames[metric]}</span><strong>{level(scores[metric], metric)}</strong></div>)}</div></div>
        <div className={styles.brainAdvice}><h3>前額葉建議</h3><p>{report.action}</p></div>
        <details className={styles.details}><summary>查看詳細分數</summary>{(Object.keys(scores) as Metric[]).map((metric) => <div key={metric}><span>{metricNames[metric]}</span><b>{scores[metric].toFixed(1)} / 3</b></div>)}</details>
        <a className={styles.primaryButton} href="https://www.instagram.com/bodyfixgavin/" target="_blank" rel="noreferrer">私訊「狀態整理」，我陪你用 7 張牌看清楚</a>
      </article>}
    </section>
    <p className={styles.disclaimer}>本工具為自我覺察與決策輔助，不是醫療、心理支持、法律或安全風險評估。若關係涉及暴力、威脅、跟蹤、勒索或人身安全疑慮，請優先尋求可信任的人與專業協助。</p>
  </main>;
}
