"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackStealthEvent } from "@/lib/stealth-analytics";
import styles from "./page.module.css";

export default function AdminConsoleClient() {
  const searchParams = useSearchParams();
  const entry = searchParams.get("entry") ?? undefined;
  const [attempts, setAttempts] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => trackStealthEvent("admin_console_view", { entry }), [entry]);

  const denied = attempts === 1;
  const revealed = attempts >= 2;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    formRef.current?.reset();
    setAttempts((current) => {
      const next = Math.min(current + 1, 2);
      trackStealthEvent(next === 1 ? "stealth_attempt_1" : "stealth_attempt_2", { entry });
      return next;
    });
    setShakeKey((current) => current + 1);
  }

  return (
    <main className={styles.systemAccessShell}>
      <section className={styles.systemAccessPanel} aria-labelledby="system-access-title">
        <p className={styles.systemAccessEyebrow}>BodyFix OS / Restricted Interface</p>
        <h1 id="system-access-title" className={styles.systemAccessTitle}>
          Restricted system interface.
        </h1>
        <p className={styles.systemAccessLead}>Internal authorization required.</p>
        <p className={styles.systemAccessNote}>本介面僅供 BodyFix 授權人員存取。</p>

        <form ref={formRef} className={styles.systemAccessForm} onSubmit={handleSubmit}>
          <label className={styles.systemAccessLabel} htmlFor="access-key">
            ACCESS KEY
          </label>
          <input
            key={shakeKey}
            id="access-key"
            className={`${styles.systemAccessInput} ${denied ? styles.systemAccessInputDenied : ""}`}
            name="access-key"
            type="text"
            autoComplete="off"
            inputMode="text"
            placeholder="Enter authorization key"
            aria-describedby="access-status"
          />
          <button className={styles.systemAccessButton} type="submit">
            VERIFY ACCESS
          </button>
        </form>

        <div id="access-status" className={styles.systemAccessStatus} aria-live="polite">
          {denied ? (
            <p className={styles.systemAccessDenied}>
              ACCESS DENIED.
              <br />
              Credentials are not the interesting part.
            </p>
          ) : null}

          {revealed ? (
            <div className={styles.systemAccessReveal}>
              <p>密碼不對。</p>
              <p>不過，這裡本來就沒有你需要猜中的密碼。</p>
              <p>你找到的不是 BodyFix 的營運後台，<br />而是服務網站被建造、推翻與重新整理的地方。</p>
              <Link className={styles.systemAccessRevealLink} href="/builder-mode?entry=retry">
                進入 Builder Mode →
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
