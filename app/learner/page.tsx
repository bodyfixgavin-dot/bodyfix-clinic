import type { Metadata } from "next";
import Link from "next/link";
import { LearnerHero, LearnerShell } from "@/components/learner/LearnerShell";

export const metadata: Metadata = {
  title: "BodyFix 身體判讀與整理方法",
};

const learningItems = [
  ["怎麼看身體", "從姿勢、呼吸、動作與張力分工，觀察身體目前怎麼承受、怎麼代償。"],
  ["怎麼整理張力", "使用 BodyFix 4R：READ → RESET → RECONNECT → RETURN，建立從判讀、整理到回測的操作順序。"],
  ["怎麼實際應用", "從常見案例出發，練習觀察、介入、回測與調整，而不是只記一套固定手法。"],
];

const learningStages = [
  ["看得出來", "開始辨認常見張力與代償模式。"],
  ["做得安全", "在清楚框架下進行基礎整理與回測。"],
  ["接得回動作", "把整理後的變化重新接回身體使用。"],
];

export default function LearnerPage() {
  return (
    <LearnerShell>
      <LearnerHero eyebrow="BODYFIX METHOD" title="BodyFix 身體判讀與整理方法">
        <p className="learner-lead">不是只學手法，<br />而是學會如何觀察身體張力、判讀代償，<br />再把整理重新接回動作與使用。</p>
        <p>BodyFix 以運動按摩為基礎，透過筋膜線判讀與張力分工整理，<br />在低痛感、可呼吸、身體能接受的深度裡，建立更有邏輯的身體工作方式。</p>
        <a className="learner-button" href="#learning-content">了解學習內容 <span aria-hidden="true">→</span></a>
      </LearnerHero>

      <section className="learner-material-entries" id="learning-content" aria-label="BodyFix 學習內容入口">
        <article className="material-entry material-entry-paper">
          <span className="material-entry-eyebrow">WHAT YOU WILL LEARN</span>
          <div className="paper-entry-header"><h2>你會學到什麼</h2></div>
          <p>從看懂身體、整理張力，到把結果重新接回動作，建立一套可以實際使用的判讀流程。</p>
          <ol className="learning-list">
            {learningItems.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
          </ol>
          <Link className="material-entry-cta material-entry-cta-primary" href="/learner/atlas">看看完整學習內容 <span aria-hidden="true">→</span></Link>
          <Link className="secondary-tool-link" href="/learner/field">進入既有身體判讀工具</Link>
          <i aria-hidden="true">METHOD · NOTES</i>
        </article>

        <div className="learner-secondary-entries">
          <Link className="material-entry material-entry-book" href="/learner/atlas">
            <span className="book-tab" aria-hidden="true">INDEX</span>
            <span className="material-entry-eyebrow">WHAT YOU WILL LEARN</span>
            <h2>你會學到什麼</h2>
            <p>從看懂身體、整理張力，到把結果重新接回動作，建立一套可以實際使用的判讀流程。</p>
            <ul className="book-index" aria-label="學習內容摘要">
              {learningItems.map(([title], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span>{title}</li>)}
            </ul>
            <b className="material-entry-cta">看看完整學習內容 <span aria-hidden="true">→</span></b>
          </Link>

          <Link className="material-entry material-entry-stone" href="/learner/passport">
            <span className="material-entry-eyebrow">LEARNING PATH</span>
            <h2>從看懂，到真正會用</h2>
            <p>BodyFix 不把「聽懂」當成「會做」。學習會從觀察、引導實作，一路建立到能安全判斷自己的操作邊界。</p>
            <ol className="compact-stage-list">
              {learningStages.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><small>{text}</small></div></li>)}
            </ol>
            <b className="material-entry-cta">看看學習階段 <span aria-hidden="true">→</span></b>
          </Link>
        </div>
      </section>
    </LearnerShell>
  );
}
