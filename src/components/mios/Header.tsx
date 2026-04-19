import { Logo } from "./Logo";
import { MapPin } from "lucide-react";

export function Header() {
  return (
    <header
      className="flex items-center px-4"
      style={{
        height: 44,
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Logo />

      <div
        className="mx-3"
        style={{
          width: 1,
          height: 14,
          background: "rgba(255,255,255,0.07)",
        }}
      />

      <div style={{ fontSize: 11 }}>
        <span style={{ color: "var(--text-2)", fontWeight: 500 }}>
          Estética Premium SP
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)" }}> · </span>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>São Paulo</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1"
          style={{
            border: "1px solid rgba(255,149,0,0.15)",
            background: "rgba(255,149,0,0.04)",
            borderRadius: 20,
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 5, height: 5, background: "var(--accent)" }}
          />
          <MapPin
            size={9}
            style={{ color: "rgba(255,149,0,0.7)" }}
            strokeWidth={2.5}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1px",
              color: "rgba(255,149,0,0.85)",
            }}
          >
            LOCAL · SP
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="pulse-dot inline-block rounded-full"
            style={{
              width: 5,
              height: 5,
              background: "var(--success)",
              color: "rgba(16,185,129,0.5)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "var(--text-3)",
            }}
          >
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
