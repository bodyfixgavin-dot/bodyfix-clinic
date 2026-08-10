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
          <span>建造、修改與研究 BodyFix OS 的內部工作區。</span>
        </section>
      </div>
    </main>
  );
}
