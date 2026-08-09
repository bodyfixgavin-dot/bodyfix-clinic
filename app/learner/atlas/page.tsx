import Link from "next/link";
import { LearnerHero, LearnerShell } from "@/components/learner/LearnerShell";
import { readingLenses, readPositions } from "@/lib/learner/data";

const abilities = [
  ["看懂身體", "觀察姿勢、呼吸、動作與張力，建立對目前身體狀態的假設。"],
  ["整理張力", "不追求越痛越有效，而是在低痛感、可呼吸、身體能接受的深度裡，重新整理張力分工。"],
  ["重新接回使用", "整理不是終點。透過回測與動作，觀察身體是否真的找到新的使用方式。"],
];
const fourR = [
  ["READ", "判讀", "看懂身體目前怎麼承受、哪裡正在過度分工。"],
  ["RESET", "整理", "把承受過多、長期代償的張力重新整理。"],
  ["RECONNECT", "整合", "讓原本沒有好好參與的區域重新加入。"],
  ["RETURN", "回到使用", "把變化帶回站立、走路、訓練或日常動作。"],
];
const audiences = [
  ["健身教練", "想更理解動作背後的張力與代償，而不只調整表面姿勢。"],
  ["運動按摩／身體工作者", "已經會操作手法，但希望建立更有順序的判讀與回測邏輯。"],
  ["運動相關工作者", "希望把身體觀察、手法整理與動作重新接起來。"],
  ["有身體學習經驗的人", "想理解 BodyFix 如何從觀察、整理到重新使用建立完整流程。"],
];
const takeaways = [
  ["觀察框架", "知道從哪裡開始看，而不是看到哪裡緊就處理哪裡。"],
  ["4R 操作順序", "從 READ 到 RETURN，知道每一階段正在解決什麼問題。"],
  ["回測能力", "整理完不是直接結束，而是重新觀察動作與張力是否真的改變。"],
  ["安全邊界", "知道什麼可以繼續，什麼時候不應硬做。"],
];

function NumberedCards({ items }: { items: string[][] }) {
  return <div className="content-card-grid">{items.map(([title, text], index) => <article className="content-card" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

export default function AtlasPage() {
  const groups = ["READ", "RESET", "RECONNECT", "RETURN"];
  return <LearnerShell>
    <LearnerHero eyebrow="WHAT YOU WILL LEARN" title="你會學到什麼">
      <p className="learner-lead">從觀察、整理到回測，建立可以實際使用的身體判讀流程。</p>
      <a className="learner-button" href="#who-its-for">查看適合對象 <span aria-hidden="true">→</span></a>
    </LearnerHero>

    <section className="content-section"><p className="section-number">SECTION 01</p><h2>不是先背手法，而是先知道自己在看什麼</h2><p>身體出現緊繃、卡住或動作受限時，真正需要理解的往往不是「哪裡最痛」，而是現在有哪些位置正在承受過多張力，哪些地方沒有參與原本應有的分工。</p><p>BodyFix 會先建立觀察，再決定整理方式。</p></section>
    <section className="content-section"><p className="section-number">SECTION 02 · 三個核心能力</p><NumberedCards items={abilities} /></section>
    <section className="content-section"><p className="section-number">SECTION 03 · BODYFIX 4R</p><h2>一套從觀察到重新使用的流程</h2><div className="four-r-grid">{fourR.map(([english, chinese, text]) => <article key={english}><span>{english}</span><h3>{chinese}</h3><p>{text}</p></article>)}</div></section>
    <section className="content-section"><p className="section-number">SECTION 04</p><h2>五大閱讀鏡頭</h2><p>BodyFix 不會只從一個部位判斷身體。我們把常用的五種觀察角度，整理成「五大閱讀鏡頭」。</p>{readingLenses.map((lens) => <details className="learner-detail" key={lens.name}><summary>{lens.name}</summary><p>{lens.question}</p></details>)}</section>
    <section className="content-section"><p className="section-number">SECTION 05</p><h2>十二讀位</h2><p>「十二讀位」不是十二個需要硬壓的痛點，而是用來整理觀察順序的身體區域。實際操作仍會依個人狀況調整，不會用固定模板套在每個人身上。</p>{groups.map((stage) => <div className="position-group" key={stage}><h3>{stage}</h3><div className="position-grid">{readPositions.filter((item) => item.stage === stage).map((item) => <article className="position-card" key={item.index}><span>{item.index.toString().padStart(2, "0")} · {item.stage}</span><h4>{item.name}</h4><p>{item.question}</p></article>)}</div></div>)}</section>
    <section className="content-section" id="who-its-for"><p className="section-number">WHO IT&apos;S FOR</p><h2>這套方法適合誰</h2><NumberedCards items={audiences} /><p className="section-note">不同課程會有不同的先備能力要求，實際開課內容與實作範圍以當期課程說明為準。</p></section>
    <section className="content-section"><p className="section-number">WHAT YOU TAKE AWAY</p><h2>學完之後，你帶走的不是一套固定手法</h2><NumberedCards items={takeaways} /></section>
    <section className="content-section why-section"><p className="section-number">WHY BODYFIX</p><h2>不是教你按得更重，而是知道為什麼要做這一步</h2><p>很多手法課會先教「怎麼做」。BodyFix 更在意的是：為什麼現在做這裡？身體目前是怎麼分工？整理之後有沒有真的改變？下一步應該繼續、換方向，還是停止？</p><p>我們不把越痛當成越有效，也不把短暫放鬆當成唯一結果。</p><div className="method-equation"><span>筋膜線判讀</span><b>＋</b><span>張力分工整理</span><b>＋</b><span>回測</span><b>＋</b><span>重新接回使用</span></div><p>讓手法背後有判斷，而不是只有流程。</p></section>
    <section className="final-cta"><p className="section-number">COURSE INFORMATION</p><h2>想知道 BodyFix 的學習方式適不適合你？</h2><p>不同背景需要建立的能力不一樣。先了解課程內容、先備條件與實作範圍，再決定是否進一步學習。</p><Link className="learner-button" href="/method">取得課程資訊 <span aria-hidden="true">→</span></Link></section>
  </LearnerShell>;
}
