import Link from "next/link";

export default function BodyFixOsEntryPage() {
  return (
    <main className="bf-container">
      <section className="bf-hero">
        <Link className="bf-brand" href="/" aria-label="BodyFix OS 首頁">
          <span className="bf-logo-box">BF</span> BodyFix OS
        </Link>
        <p className="portal-kicker">BODYFIX SERVICE OPERATING SYSTEM</p>
        <h1>一個入口，接回完整營運脈絡</h1>
        <p className="bf-subtitle">預約、客戶主檔、服務紀錄、追蹤與營運工具，共用同一套 BodyFix 資料核心。</p>
        <div className="clinic-actions">
          <Link className="bf-primary bf-link-button" href="/admin/crm">進入 BodyFix CRM</Link>
          <Link className="bf-secondary bf-link-button" href="/admin">管理登入</Link>
        </div>
      </section>
    </main>
  );
}
