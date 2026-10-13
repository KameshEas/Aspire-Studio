import type { VariableDefinition, VariablesSchema } from "./api";

const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

/** Unique {{variable}} names in a prompt, in order of first appearance. */
export function extractVariables(prompt: string): string[] {
  const seen = new Set<string>();
  for (const match of prompt.matchAll(VARIABLE_PATTERN)) seen.add(match[1]);
  return [...seen];
}

/** Keep existing definitions, add text fields for newly detected variables, drop variables no longer in the prompt. */
export function syncSchemaWithPrompt(prompt: string, existing: VariablesSchema = {}): VariablesSchema {
  const next: VariablesSchema = {};
  for (const name of extractVariables(prompt)) {
    next[name] = existing[name] ?? { type: "text", required: true };
  }
  return next;
}

export function variableLabel(name: string, def?: VariableDefinition): string {
  if (def?.label) return def.label;
  const spaced = name.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Initial form values: a definition's default, "false" for checkboxes, empty string otherwise. */
export function defaultValues(schema: VariablesSchema): Record<string, string> {
  return Object.fromEntries(
    Object.entries(schema).map(([name, def]) => {
      if (def.default !== undefined && def.default !== null) return [name, String(def.default)];
      return [name, def.type === "checkbox" ? "false" : ""];
    })
  );
}

/** Returns a message per invalid field; an empty object means the values are valid. */
export function validateValues(schema: VariablesSchema, values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [name, def] of Object.entries(schema)) {
    const value = values[name] ?? "";
    const label = variableLabel(name, def);

    if (def.required && def.type !== "checkbox" && value.trim() === "") {
      errors[name] = `${label} is required`;
      continue;
    }
    if (value === "") continue;

    if (def.type === "number" && Number.isNaN(Number(value))) errors[name] = `${label} must be a number`;
    else if (def.minLength && value.length < def.minLength) errors[name] = `${label} must be at least ${def.minLength} characters`;
    else if (def.maxLength && value.length > def.maxLength) errors[name] = `${label} must be at most ${def.maxLength} characters`;
    else if (def.type === "select" && def.options && !def.options.includes(value)) errors[name] = `${label} must be one of the listed options`;
  }
  return errors;
}

/** Same {{var}} interpolation the backend uses, for live previews. Unknown variables become [name]. */
export function renderPrompt(prompt: string, values: Record<string, string>): string {
  return prompt.replace(VARIABLE_PATTERN, (_match, name: string) => {
    const value = values[name];
    return value === undefined || value === "" ? `[${name}]` : value;
  });
}

/** Cheap word-based estimate matching the backend's heuristic. */
export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  return Math.ceil(Math.ceil(text.trim().split(/\s+/).length * 1.3) * 1.05);
}

export function estimateCostUsd(tokensIn: number, tokensOut: number, costInputPer1M: number, costOutputPer1M: number): number {
  return (tokensIn * costInputPer1M + tokensOut * costOutputPer1M) / 1_000_000;
}

export function formatUsd(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.01) return "<$0.01";
  return `$${usd.toFixed(usd < 1 ? 3 : 2)}`;
}

export function formatDuration(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export function formatBytes(value: string | number | null | undefined): string {
  const bytes = Number(value ?? 0);
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function timeAgo(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** JSON.stringify with sorted keys, so objects compare equal regardless of key order (jsonb reorders keys). */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
