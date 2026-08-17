import { describe, expect, it } from "vitest";
import { legacyClinicDestination } from "./crm-routes";

describe("legacyClinicDestination", () => {
  it("maps the root", () => expect(legacyClinicDestination()).toBe("/admin/crm"));
  it("preserves dynamic segments and query values", () => {
    expect(legacyClinicDestination(["clients", "abc 123"], { tab: "timeline", filter: ["open", "late"] }))
      .toBe("/admin/crm/clients/abc%20123?tab=timeline&filter=open&filter=late");
  });
});
