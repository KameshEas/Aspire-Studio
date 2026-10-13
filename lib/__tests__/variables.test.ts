import { describe, expect, it } from "vitest";
import {
  defaultValues,
  estimateCostUsd,
  estimateTokens,
  extractVariables,
  formatBytes,
  formatDuration,
  formatUsd,
  renderPrompt,
  stableStringify,
  syncSchemaWithPrompt,
  timeAgo,
  validateValues,
  variableLabel,
} from "../variables";

describe("extractVariables", () => {
  it("returns unique names in order of first appearance", () => {
    expect(extractVariables("{{b}} {{a}} {{b}}")).toEqual(["b", "a"]);
  });

  it("ignores malformed placeholders", () => {
    expect(extractVariables("{{ spaced }} {single} {{1bad}} {{ok_1}}")).toEqual(["ok_1"]);
  });
});

describe("syncSchemaWithPrompt", () => {
  it("keeps existing definitions, adds new variables as required text, and drops removed ones", () => {
    const next = syncSchemaWithPrompt("{{keep}} {{added}}", {
      keep: { type: "number" },
      removed: { type: "text" },
    });
    expect(next).toEqual({ keep: { type: "number" }, added: { type: "text", required: true } });
  });
});

describe("variableLabel", () => {
  it("prefers an explicit label", () => {
    expect(variableLabel("x", { type: "text", label: "Custom" })).toBe("Custom");
  });

  it("humanizes snake_case and camelCase names", () => {
    expect(variableLabel("target_audience")).toBe("Target audience");
    expect(variableLabel("brandVoice")).toBe("Brand Voice");
  });
});

describe("defaultValues", () => {
  it("uses defaults, false for checkboxes and empty strings otherwise", () => {
    expect(
      defaultValues({
        a: { type: "text", default: "hi" },
        b: { type: "checkbox" },
        c: { type: "number" },
      })
    ).toEqual({ a: "hi", b: "false", c: "" });
  });
});

describe("validateValues", () => {
  it("flags missing required values", () => {
    expect(validateValues({ name: { type: "text", required: true } }, { name: "  " })).toEqual({
      name: "Name is required",
    });
  });

  it("does not require checkboxes", () => {
    expect(validateValues({ agree: { type: "checkbox", required: true } }, { agree: "false" })).toEqual({});
  });

  it("skips constraints on optional empty values", () => {
    expect(validateValues({ n: { type: "number" } }, { n: "" })).toEqual({});
  });

  it("validates numbers, lengths and select options", () => {
    const schema = {
      n: { type: "number" as const },
      s: { type: "text" as const, minLength: 3 },
      l: { type: "text" as const, maxLength: 2 },
      o: { type: "select" as const, options: ["a", "b"] },
    };
    const errors = validateValues(schema, { n: "abc", s: "ab", l: "abc", o: "z" });
    expect(Object.keys(errors).sort()).toEqual(["l", "n", "o", "s"]);
  });
});

describe("renderPrompt", () => {
  it("fills known variables and brackets missing ones", () => {
    expect(renderPrompt("Hi {{name}}, about {{topic}}", { name: "Ada", topic: "" })).toBe("Hi Ada, about [topic]");
  });

  it("inserts values containing $ and & verbatim", () => {
    expect(renderPrompt("{{p}}", { p: "$100 & $&" })).toBe("$100 & $&");
  });
});

describe("estimates", () => {
  it("estimateTokens is 0 for blank text and grows with words", () => {
    expect(estimateTokens("   ")).toBe(0);
    expect(estimateTokens("word ".repeat(100))).toBeGreaterThan(estimateTokens("word ".repeat(10)));
  });

  it("estimateCostUsd uses per-million pricing", () => {
    expect(estimateCostUsd(1_000_000, 1_000_000, 1, 3)).toBe(4);
  });
});

describe("formatters", () => {
  it("formatUsd", () => {
    expect(formatUsd(0)).toBe("$0.00");
    expect(formatUsd(0.0004)).toBe("<$0.01");
    expect(formatUsd(0.5)).toBe("$0.500");
    expect(formatUsd(12.345)).toBe("$12.35");
  });

  it("formatDuration", () => {
    expect(formatDuration(420)).toBe("420ms");
    expect(formatDuration(1500)).toBe("1.5s");
  });

  it("formatBytes", () => {
    expect(formatBytes(null)).toBe("—");
    expect(formatBytes("512")).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });

  it("timeAgo", () => {
    const now = Date.parse("2026-01-10T12:00:00Z");
    expect(timeAgo("2026-01-10T11:59:50Z", now)).toBe("just now");
    expect(timeAgo("2026-01-10T11:30:00Z", now)).toBe("30m ago");
    expect(timeAgo("2026-01-10T09:00:00Z", now)).toBe("3h ago");
    expect(timeAgo("2026-01-08T12:00:00Z", now)).toBe("2d ago");
  });
});

describe("stableStringify", () => {
  it("is independent of key order, at any depth", () => {
    expect(stableStringify({ a: 1, b: { c: 2, d: 3 } })).toBe(stableStringify({ b: { d: 3, c: 2 }, a: 1 }));
  });

  it("distinguishes different values and ignores undefined properties", () => {
    expect(stableStringify({ a: 1 })).not.toBe(stableStringify({ a: 2 }));
    expect(stableStringify({ a: 1, b: undefined })).toBe(stableStringify({ a: 1 }));
  });
});
