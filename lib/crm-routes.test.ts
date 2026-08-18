import { describe, expect, it } from "vitest";
import { destinationWithQuery, legacyClinicDestination, legacyPulseDestination } from "./crm-routes";

describe("legacyClinicDestination", () => {
  it("maps the root", () => expect(legacyClinicDestination()).toBe("/admin/crm"));
  it("preserves dynamic segments and query values", () => {
    expect(legacyClinicDestination(["clients", "abc 123"], { tab: "timeline", filter: ["open", "late"] }))
      .toBe("/admin/crm/clients/abc%20123?tab=timeline&filter=open&filter=late");
  });
  it("does not double encode an already encoded segment", () => {
    expect(legacyClinicDestination(["clients", "abc%20123"], { tab: "timeline" }))
      .toBe("/admin/crm/clients/abc%20123?tab=timeline");
  });
});

describe("legacyPulseDestination", () => {
  it("preserves a Pulse subpath and query", () => {
    expect(legacyPulseDestination(["income"], { month: "2026-08" }))
      .toBe("/admin/crm/pulse/income?month=2026-08");
  });
});

it("adds query parameters to a fixed canonical route", () => {
  expect(destinationWithQuery("/admin", { from: "dashboard" })).toBe("/admin?from=dashboard");
});
