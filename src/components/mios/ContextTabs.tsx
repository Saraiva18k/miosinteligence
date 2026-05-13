import { useState } from "react";

const TABS = ["Análise", "Histórico", "Base de Conhecimento"] as const;
type Tab = (typeof TABS)[number];

interface ContextTabsProps {
  /** Pass false to hide (e.g. dashboard with no analyses yet) */
  show?: boolean;
  defaultTab?: Tab;
}

export function ContextTabs({ show = true, defaultTab = "Análise" }: ContextTabsProps) {
  const [active, setActive] = useState<Tab>(defaultTab);

  if (!show) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 20,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "inline-flex",
          gap: 2,
          padding: 4,
          borderRadius: 12,
          background: "rgba(8,11,20,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px -8px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                padding: "5px 13px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: isActive ? 600 : 500,
                letterSpacing: isActive ? 0.2 : 0,
                background: isActive
                  ? "rgba(255,149,0,0.11)"
                  : "transparent",
                border: `1px solid ${isActive ? "rgba(255,149,0,0.28)" : "transparent"}`,
                color: isActive
                  ? "rgba(255,149,0,0.9)"
                  : "rgba(255,255,255,0.38)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.58)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.38)";
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
