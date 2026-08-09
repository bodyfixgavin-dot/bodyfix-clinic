import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Builder Mode",
  robots: { index: false, follow: false },
};

export default function BuilderModePage() {
  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.topbar}>
          <Link href="/">BODYFIX OS</Link>
          <span>BUILDER MODE</span>
        </header>

        <section className={styles.hero} aria-labelledby="builder-mode-title">
          <p>BODYFIX OS / INTERNAL WORKSPACE</p>
          <h1 id="builder-mode-title">BUILDER MODE</h1>
          <span>用決策系統整理現在該持續、修正、測試或暫停的方向。</span>
        </section>

        <section className={styles.entries} aria-label="Builder Mode tools">
          <Link className={styles.decisionCard} href="/owner-mode/strategic-decisions">
            <span className={styles.cardIndex}>01 / DECISION SYSTEM</span>
            <div>
              <h2>STRATEGIC DECISIONS</h2>
              <p>進入完整的 KEEP / FIX / TEST / PARK 決策工作區。</p>
            </div>
            <strong aria-hidden="true">ENTER →</strong>
          </Link>
        </section>
      </div>
    </main>
  );
}
