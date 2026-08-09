import { describe, expect, it } from "vitest";
import { calculateScs, readSignal, suggestStatus } from "./strategic-decisions";

describe("strategic continuation score", () => {
  it("calculates and classifies configured score ranges", () => {
    expect(calculateScs({ result: 3, learning: 3, asset: 3, fit: 3, time: 2, cash: 2, energy: 2 })).toBe(2);
    expect(suggestStatus(1.5)).toBe("KEEP");
    expect(suggestStatus(1.2)).toBe("FIX");
    expect(suggestStatus(0.6)).toBe("TEST");
    expect(suggestStatus(0.59)).toBe("PARK");
  });

  it("safely handles a zero denominator", () => {
    expect(calculateScs({ result: 0, learning: 0, asset: 0, fit: 0, time: 0, cash: 0, energy: 0 })).toBe(0);
    expect(Number.isFinite(calculateScs({ result: 5, learning: 5, asset: 5, fit: 5, time: 0, cash: 0, energy: 0 }))).toBe(true);
  });

  it("identifies conversion problems without changing status", () => {
    expect(readSignal("up", "down").title).toBe("Conversion Problem｜可能存在轉換問題");
  });
});
