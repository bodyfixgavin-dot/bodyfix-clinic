import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  ["/admin/crm", "CRM"],
  ["/admin/crm/pulse", "戰況"],
  ["/admin/crm/pulse/income", "收入"],
  ["/admin/crm/pulse/appointments", "預約"],
  ["/admin/crm/pulse/followups", "回訪"],
  ["/admin/crm/pulse/settings", "設定"],
];

export function PulseShell({ children, title, eyebrow = "OWNER CONTROL" }: { children: ReactNode; title: string; eyebrow?: string }) {
  return (
    <main className="pulse">
      <header className="pulse-head">
        <Link href="/admin/crm/pulse" className="pulse-brand">
          <span>BF</span>
          <div><small>BODYFIX</small><strong>Pulse</strong></div>
        </Link>
        <Link href="/admin" className="live">BodyFix Admin</Link>
      </header>
      <section className="pulse-title"><p>{eyebrow}</p><h1>{title}</h1></section>
      {children}
      <nav className="pulse-nav">{nav.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    </main>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="pulse-field"><span>{label}</span>{children}</label>;
}
