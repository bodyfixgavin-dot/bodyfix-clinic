"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { builderSections } from "./builder-data";
import { trackStealthEvent } from "@/lib/stealth-analytics";
import styles from "./page.module.css";

const noteLabels = [["problem", "本次問題"], ["original", "原始做法"], ["issue", "發現的問題"], ["decision", "修改決策"], ["aiRole", "AI 在哪裡參與"], ["humanDecision", "人最後做了什麼判斷"], ["beforeAfter", "修改前／修改後"], ["status", "目前狀態"], ["nextValidation", "下一次要驗證什麼"]] as const;
const intents = ["我也正在用 AI 學習做網站", "我想交流技術或設計問題", "我想研究 BodyFix 的服務系統", "我有合作或教學想法"];

export default function BuilderModeClient() {
  const entry = useSearchParams().get("entry") ?? undefined;
  useEffect(() => trackStealthEvent("builder_mode_enter", { entry }), [entry]);
  return <main className={styles.shell}><div className={styles.wrap}>
    <header className={styles.topbar}><span>BODYFIX OS / BUILD LOG</span><nav aria-label="Builder Mode sections">{builderSections.map(section => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</nav></header>
    <section className={styles.hero} aria-labelledby="builder-title"><div><p className={styles.eyebrow}>BODYFIX OS / BUILD LOG</p><h1 id="builder-title">BUILDER<br />MODE</h1></div><div className={styles.intro}><p>你真的走到這裡了。</p><p>那你看到的，大概不只是一項 BodyFix 服務。</p><p>BodyFix 原本是一項由人提供的服務。<br />當內容、預約、紀錄與方法開始被整理，它逐漸成為一套可以閱讀、測試與持續修改的系統。</p><p>這裡留下的不只是成果，<br />也包含使用 AI 製作網站時的判斷、錯誤、推翻與重做。</p><small>This is not the operations dashboard.<br />No private client or business data is available here.</small></div></section>
    <section className={styles.grid} aria-label="BodyFix website build areas">{builderSections.map((section, index) => <article id={section.id} className={styles.module} key={section.id}><span className={styles.index}>0{index + 1}</span><h2>{section.label}</h2><h3>{section.subtitle}</h3>{section.paragraphs.map(p => <p key={p}>{p}</p>)}<details onToggle={event => { if (event.currentTarget.open) trackStealthEvent("builder_section_open", { section: section.id }); }}><summary>查看建造紀錄骨架</summary>{section.notes.map((note, noteIndex) => <dl key={noteIndex}>{noteLabels.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{note[key]}</dd></div>)}</dl>)}</details></article>)}</section>
    <section className={styles.contact} aria-labelledby="contact-title"><p className={styles.eyebrow}>OPEN SIGNAL</p><h2 id="contact-title">如果你也在做類似的事，這裡可以不是終點。</h2><p>你可能正在學習用 AI 製作網站、整理自己的服務，<br />或者剛好對其中一個設計與技術問題有想法。</p><p>不需要先成為工程師，也不需要假裝什麼都懂。<br />如果有值得交換的問題，可以留下訊號。</p><fieldset><legend>你想交流的方向</legend>{intents.map(intent => <label key={intent}><input type="radio" name="intent" value={intent} onChange={() => trackStealthEvent("builder_contact_intent", { intent })} />{intent}</label>)}</fieldset><p className={styles.availability}>此頁目前未開放表單送出，也不會儲存你的選擇。請改用既有聯絡方式。</p><a className={styles.contactLink} href="https://instagram.com/bodyfix.fascia" target="_blank" rel="noreferrer">前往 BodyFix Instagram →</a></section>
  </div></main>;
}
