import { Logo } from "./Logo";
import { MapPin } from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Header() {
  return (
    <header
      className="flex items-center px-4 relative z-30"
      style={{
        height: 52,
        background: "rgba(7,9,15,0.55)",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
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

      <WorkspaceSwitcher />

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
