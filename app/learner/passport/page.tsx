import Link from "next/link";
import { BoundaryNotice, LearnerHero, LearnerShell } from "@/components/learner/LearnerShell";

const stages = [
  ["建立觀察", "能開始辨認姿勢、動作、呼吸與張力之間的關係。"],
  ["引導實作", "能在明確流程與指導下，進行基礎整理與回測。"],
  ["整合應用", "開始根據不同案例調整順序，並把整理結果重新接回動作。"],
  ["建立邊界", "能辨認自己的能力範圍，知道什麼可以處理，什麼應停止、轉介或尋求其他專業協助。"],
];

export default function PassportPage() {
  return <LearnerShell>
    <LearnerHero eyebrow="BODYFIX LEARNING PATH" title="從看懂，到真正會用">
      <p className="learner-lead">學習 BodyFix，不以「看完課程」作為終點。<br />真正重要的是能不能觀察、能不能安全實作，以及知不知道自己的能力邊界。</p>
      <BoundaryNotice><strong>Demo 資料</strong><br />目前為能力路徑示意，尚未代表任何人的認證、授權或完成狀態。</BoundaryNotice>
    </LearnerHero>
    <section className="content-section"><p className="section-number">LEARNING PATH · 能力框架</p><div className="learning-path-grid">{stages.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}</div></section>
    <section className="final-cta"><h2>先理解方法，再選擇下一步</h2><p>查看完整學習內容，了解 BodyFix 如何從判讀、整理走到重新使用。</p><Link className="learner-button" href="/learner/atlas">了解學習內容 <span aria-hidden="true">→</span></Link></section>
  </LearnerShell>;
}
