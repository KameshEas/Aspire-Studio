"use client";

import React from "react";
import { Input, Textarea } from "../system";
import type { VariablesSchema } from "../../lib/api";
import { variableLabel } from "../../lib/variables";

interface VariableFormProps {
  schema: VariablesSchema;
  values: Record<string, string>;
  errors?: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const selectClass =
  "w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-input)] px-3 py-2 text-sm text-[color:var(--text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]";

export function VariableForm({ schema, values, errors = {}, onChange }: VariableFormProps) {
  const entries = Object.entries(schema);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-[color:var(--text-muted)]">
        This prompt has no variables. Add <code>{"{{name}}"}</code> placeholders to make it reusable.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(([name, def]) => {
        const label = `${variableLabel(name, def)}${def.required ? " *" : ""}`;
        const error = errors[name];
        const value = values[name] ?? "";

        if (def.type === "textarea") {
          return (
            <Textarea
              key={name}
              label={label}
              rows={4}
              value={value}
              error={error}
              maxLength={def.maxLength}
              onChange={(e) => onChange(name, e.target.value)}
            />
          );
        }

        if (def.type === "select") {
          return (
            <div key={name}>
              <label className="mb-1.5 block text-sm font-medium text-[color:var(--text)]" htmlFor={`var-${name}`}>
                {label}
              </label>
              <select
                id={`var-${name}`}
                className={selectClass}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
              >
                <option value="">Select…</option>
                {(def.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {error && <p className="mt-1 text-xs text-[color:var(--danger)]">{error}</p>}
            </div>
          );
        }

        if (def.type === "checkbox") {
          return (
            <label key={name} className="flex items-center gap-2 text-sm text-[color:var(--text)]">
              <input
                type="checkbox"
                checked={value === "true"}
                onChange={(e) => onChange(name, e.target.checked ? "true" : "false")}
                className="h-4 w-4 rounded border-[color:var(--border-strong)] accent-[color:var(--primary-600)]"
              />
              {variableLabel(name, def)}
            </label>
          );
        }

        return (
          <Input
            key={name}
            label={label}
            type={def.type === "number" ? "number" : def.type === "date" ? "date" : "text"}
            value={value}
            error={error}
            maxLength={def.maxLength}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      })}
    </div>
  );
}
