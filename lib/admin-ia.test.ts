import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const admin = readFileSync("app/admin/page.tsx", "utf8");
const booking = readFileSync("components/admin/BookingAdmin.tsx", "utf8");
const crmShell = readFileSync("components/crm/CrmShell.tsx", "utf8");

describe("BodyFix Admin information architecture", () => {
  it("keeps the Admin Hub free of embedded Booking operations", () => {
    expect(admin.includes('href="/admin/booking"')).toBe(true);
    expect(admin.includes("createSlot")).toBe(false);
    expect(admin.includes("updateBookingStatus")).toBe(false);
    expect(admin.includes("bodyfix-preview-slots")).toBe(false);
  });

  it("keeps the complete Booking operations in the canonical module", () => {
    expect(booking.includes("新增可約時段")).toBe(true);
    expect(booking.includes("預約申請")).toBe(true);
    expect(booking.includes("所有時段")).toBe(true);
    expect(booking.includes("bodyfix-preview-slots")).toBe(true);
  });

  it("uses the canonical Booking link from CRM", () => {
    expect(crmShell.includes('href: "/admin/booking"')).toBe(true);
    expect(crmShell.includes("/admin#booking")).toBe(false);
  });
});
