"use client";

import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const MAX_PREVIEW_CHARS = 20_000;

interface ArtifactPreviewProps {
  type: string;
  downloadUrl: string;
  alt?: string;
  className?: string;
}

/** Renders an image artifact inline, or fetches and shows the start of a text artifact. */
export function ArtifactPreview({ type, downloadUrl, alt = "Artifact preview", className = "" }: ArtifactPreviewProps) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (type === "image") return;
    const controller = new AbortController();
    setText(null);
    setFailed(false);
    fetch(downloadUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then(setText)
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, [type, downloadUrl]);

  if (type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={downloadUrl} alt={alt} className={`rounded-lg border border-[color:var(--border)] object-contain ${className}`} />;
  }

  if (failed) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--text-muted)]">
        <FileText size={16} /> Preview unavailable. Use Download to open this file.
      </div>
    );
  }

  return (
    <pre className={`overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--text)] ${className}`}>
      {text === null ? "Loading…" : text.length > MAX_PREVIEW_CHARS ? `${text.slice(0, MAX_PREVIEW_CHARS)}\n\n… (truncated)` : text}
    </pre>
  );
}
