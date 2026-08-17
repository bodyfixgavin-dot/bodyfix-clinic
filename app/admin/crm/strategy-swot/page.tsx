import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClinicNotice, CrmShell } from "@/components/crm/CrmShell";
import { requireClinicAdmin } from "@/lib/clinic-api";
import { StrategySwotDashboard } from "./StrategySwotDashboard";

export const metadata: Metadata = {
  title: "BodyFix OS 策略全局分析",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StrategySwotPage() {
  const auth = await requireClinicAdmin("/admin/crm/strategy-swot");

  if (!auth.ok) {
    if (auth.response.status === 401) {
      redirect("/admin");
    }

    return (
      <CrmShell title="BodyFix OS 策略全局分析" subtitle="內部 admin-only 決策支援頁：檢視 BodyFix OS 的優勢、弱點、機會與風險。">
        <ClinicNotice
          error="後台已登入，但 Supabase 與後台環境變數檢查失敗。請確認 Vercel Environment Variables 後重新部署。"
          diagnostics={{
            loginState: "authenticated",
            databaseState: "failed",
            requestPath: "/admin/crm/strategy-swot",
            failedRequest: "/admin/crm/strategy-swot",
            errorReason: "Supabase 與後台環境變數檢查失敗",
            nextStep: "請確認 Vercel env 後重新部署。"
          }}
        />
      </CrmShell>
    );
  }

  return <StrategySwotDashboard />;
}
