"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Clock, Copy, Download, Image as ImageIcon, Sparkles } from "lucide-react";
import { Badge, Button, Card, CardContent } from "../system";
import type { GenerateResponse } from "../../lib/api";
import { formatDuration, formatUsd } from "../../lib/variables";

interface ResultPanelProps {
  result: GenerateResponse;
  artifactsHref: string;
}

export function ResultPanel({ result, artifactsHref }: ResultPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((current) => (current === id ? null : current)), 1500);
    } catch {
      // clipboard can be unavailable (insecure context); the text stays selectable
    }
  };

  return (
    <div className="space-y-4" aria-live="polite">
      {result.candidates.map((candidate) => (
        <Card key={candidate.id} variant="elevated" padding="lg">
          <CardContent>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="success" icon={<Sparkles size={12} />}>
                Generated
              </Badge>
              <Badge variant="default">{candidate.metadata.model}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)]">
                <Clock size={12} /> {formatDuration(candidate.metadata.latencyMs)}
              </span>
              {result.usage.tokensIn + result.usage.tokensOut > 0 && (
                <span className="text-xs text-[color:var(--text-muted)]">
                  {result.usage.tokensIn} in · {result.usage.tokensOut} out · {formatUsd(result.usage.costUsd)}
                </span>
              )}
            </div>

            {candidate.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={candidate.downloadUrl}
                alt="Generated result"
                className="max-h-[480px] w-full rounded-lg border border-[color:var(--border)] object-contain"
              />
            ) : (
              <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--surface-2)] p-4 text-sm leading-relaxed text-[color:var(--text)]">
                {candidate.text}
              </pre>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.text && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied === candidate.id ? <Check size={14} /> : <Copy size={14} />}
                  onClick={() => copy(candidate.id, candidate.text ?? "")}
                >
                  {copied === candidate.id ? "Copied" : "Copy"}
                </Button>
              )}
              <a
                href={`${candidate.downloadUrl}${candidate.downloadUrl.includes("?") ? "&" : "?"}dl=1`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-sm font-medium text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]"
              >
                {candidate.type === "image" ? <ImageIcon size={14} /> : <Download size={14} />}
                Download
              </a>
              <Link
                href={artifactsHref}
                className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-[color:var(--primary-600)] hover:underline"
              >
                View in Artifacts
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
