// MIOS Logo — uses the real brand image with mix-blend-mode: screen
// The dark background of the PNG blends away against the dark header,
// leaving only the glowing brain visible. No image editing needed.

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>

      {/* ── Brain icon ───────────────────────────────────────────
          Container clips the image to show only the brain portion
          (the right side has the "MIOS" text which we render separately).
          mix-blend-mode: screen removes the dark background.         ── */}
      <div style={{
        width: 28,
        height: 32,
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <img
          src="/mios-brain.png"
          alt="MIOS brain"
          style={{
            height: 32,
            width: "auto",
            display: "block",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* ── MIOS wordmark ──────────────────────────────────────── */}
      <span style={{
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "3px",
        color: "rgba(255,255,255,0.93)",
        fontFamily: "inherit",
        lineHeight: 1,
      }}>
        MIOS
      </span>

    </div>
  );
}
