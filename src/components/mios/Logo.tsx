export function Logo({ size = 18 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: 4,
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
          style={{ fontSize: 12, letterSpacing: "1px", color: "var(--text-1)" }}
        >
          MIOS
        </span>
        <span
          style={{
            fontSize: 8,
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
