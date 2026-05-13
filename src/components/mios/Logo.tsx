export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      <img
        src="/mios-brain.png"
        alt="MIOS"
        style={{
          height: size,
          width: "auto",
          display: "block",
          mixBlendMode: "screen",
        }}
      />
      <span style={{
        fontSize: Math.round(size * 0.42),
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
