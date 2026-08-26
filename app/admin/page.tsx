"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AccessState = "checking" | "authenticated" | "login" | "error";

type SessionPayload = { authenticated?: boolean; bypassMode?: boolean };

export default function AdminPage() {
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [password, setPassword] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function initializeAccess() {
      try {
        const sessionResponse = await fetch("/api/admin/session", { cache: "no-store" });
        if (!sessionResponse.ok) throw new Error("session check failed");
        const session = await sessionResponse.json() as SessionPayload;
        setPreviewMode(Boolean(session.bypassMode));

        if (session.authenticated) {
          setAccessState("authenticated");
          return;
        }

        if (session.bypassMode) {
          const bootstrapResponse = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bypass: true }),
          });
          if (!bootstrapResponse.ok) throw new Error("preview session bootstrap failed");
          setAccessState("authenticated");
          return;
        }

        setAccessState("login");
      } catch {
        setErrorMessage("無法建立管理 session，請重新整理或確認 Preview 環境設定。");
        setAccessState("error");
      }
    }

    initializeAccess();
  }, []);

  async function login() {
    setErrorMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setErrorMessage("密碼錯誤，或後台環境變數尚未設定。");
      return;
    }
    setPassword("");
    setAccessState("authenticated");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAccessState(previewMode ? "checking" : "login");
    if (previewMode) window.location.reload();
  }

  if (accessState === "checking") {
    return <AdminAccessStatus message="正在進入 Preview 管理後台…" />;
  }

  if (accessState === "login" || accessState === "error") {
    return (
      <main className="bf-container bf-admin-login-shell">
        <section className="bf-hero">
          <div className="bf-brand"><span className="bf-logo-box">BF</span> BODYFIX ADMIN</div>
          <h1>管理後台登入</h1>
          <div className="bf-form bf-login-form">
            <label>後台密碼<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="bf-primary" type="button" onClick={login}>登入</button>
            {errorMessage ? <div className="bf-notice" role="alert">{errorMessage}</div> : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bf-container bf-admin-mobile-safe">
      <section className="bf-hero bf-admin-overview-hero">
        <div className="bf-brand"><span className="bf-logo-box">BF</span> BODYFIX ADMIN</div>
        <h1>營運管理總覽</h1>
        <p className="bf-subtitle">客戶、服務紀錄、預約、追蹤、收入與營運決策，共用同一個 BodyFix 管理入口。</p>
        <p className="bf-body-copy">從這裡進入 CRM、預約管理與每日營運工具。</p>
        <button className="bf-small-btn" type="button" onClick={logout}>登出</button>
      </section>

      <section className="bf-admin-crm-entry" aria-labelledby="admin-crm-title">
        <p className="bf-admin-entry-eyebrow">CORE OPERATIONS</p>
        <h2 id="admin-crm-title">BODYFIX CRM</h2>
        <strong>核心營運系統</strong>
        <p>客戶主檔、服務紀錄、問卷、追蹤、方案與轉換，集中在同一個工作區。</p>
        <p className="bf-admin-flow">客戶 → 服務 → 追蹤 → 方案 → 轉換</p>
        <Link className="bf-admin-entry-link bf-admin-entry-link-primary" href="/admin/crm">進入 CRM →</Link>
      </section>

      <section className="bf-admin-operations" aria-labelledby="admin-operations-title">
        <h2 id="admin-operations-title" className="bf-section-title">核心營運入口</h2>
        <div className="bf-admin-entry-grid">
          <AdminEntry eyebrow="BOOKING" title="預約管理" description="管理可約時段、預約申請、確認、取消與完成。" label="管理預約 →" href="/admin/booking" />
          <AdminEntry eyebrow="PULSE" title="今日營運節奏" description="查看今日收入、目標差額、未來預約與回訪狀態。" label="進入 Pulse →" href="/admin/crm/pulse" />
          <AdminEntry eyebrow="STRATEGIC DECISIONS" title="策略決策" description="判斷目前工作應該繼續、修正、測試或暫停，讓時間與資源流向更值得投入的地方。" label="進入策略決策 →" href="/admin/strategic-decisions" />
          <AdminEntry eyebrow="OPERATIONS" title="營運工具" description="Business Foundation、AI Copilot、Codebook、Calendar Backfill 與其他系統維護工具。" label="查看營運工具 →" href="/admin/crm" />
        </div>
      </section>

      {previewMode ? <div className="bf-notice bf-admin-notice">Preview Mode｜此環境供功能驗收使用；Booking 維持 Local Preview Mode，不會寫入正式資料庫。</div> : null}
    </main>
  );
}

function AdminAccessStatus({ message }: { message: string }) {
  return <main className="bf-container bf-admin-login-shell"><section className="bf-hero"><div className="bf-brand"><span className="bf-logo-box">BF</span> BODYFIX ADMIN</div><p className="bf-subtitle" role="status">{message}</p></section></main>;
}

function AdminEntry({ eyebrow, title, description, label, href }: { eyebrow: string; title: string; description: string; label: string; href: string }) {
  return <article className="bf-admin-entry-card"><p className="bf-admin-entry-eyebrow">{eyebrow}</p><h3>{title}</h3><p>{description}</p><Link className="bf-admin-entry-link" href={href}>{label}</Link></article>;
}
