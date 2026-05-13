export function Logo({ size = 18 }: { size?: number }) {
  const textSize = Math.round(size * 0.67);
  const subSize  = Math.round(size * 0.44);

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
          background: "var(--accent)",
        }}
        aria-label="MIOS logo"
      >
        <div
          style={{
            width: size * 0.39,
            height: size * 0.39,
            background: "var(--bg-base)",
            transform: "rotate(45deg)",
          }}
        />
      </div>
      <div className="flex items-baseline gap-[2px]">
        <span
          className="font-extrabold"
          style={{ fontSize: textSize, letterSpacing: "1px", color: "var(--text-1)" }}
        >
          MIOS
        </span>
        <span
          style={{
            fontSize: subSize,
            letterSpacing: "2px",
            fontWeight: 700,
            color: "rgba(255,149,0,0.4)",
          }}
        >
          os
        </span>
      </div>
    </div>
  );
}
