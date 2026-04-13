"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ textAlign: "center", maxWidth: 480, padding: 32 }}>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>An unexpected error occurred. Please try again.</p>
            <button
              onClick={reset}
              style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer", background: "#000", color: "#fff" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
