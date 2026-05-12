// MIOS Logo — real brand image, background removed via mix-blend-mode: screen

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>

      {/* Brain — 99x120px source → 30x36px display
          mix-blend-mode: screen makes the dark bg disappear,
          leaving only the glowing neural network visible */}
      <img
        src="/mios-brain.png"
        alt="MIOS"
        style={{
          height: 36,
          width: "auto",
          display: "block",
          mixBlendMode: "screen",
        }}
      />

      {/* MIOS wordmark */}
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
