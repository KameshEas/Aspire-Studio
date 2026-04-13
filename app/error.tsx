"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ color: "#666", marginBottom: 24 }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer", background: "#000", color: "#fff" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
