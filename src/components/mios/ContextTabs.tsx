import { useState } from "react";

const TABS = ["Análise", "Histórico", "Base de Conhecimento"] as const;
type Tab = (typeof TABS)[number];

interface ContextTabsProps {
  show?: boolean;
  defaultTab?: Tab;
}

export function ContextTabs({ show = true, defaultTab = "Análise" }: ContextTabsProps) {
  const [active, setActive]     = useState<Tab>(defaultTab);
  const [expanded, setExpanded] = useState(false);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
          /* grows leftward because it's right-anchored */
          maxWidth: expanded ? 380 : 28,
          height: 28,
          opacity: expanded ? 1 : 0.28,
          transition:
            "max-width 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
          borderRadius: 10,
          background: "rgba(8,11,20,0.86)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: expanded
            ? "0 8px 28px -8px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.04) inset"
            : "none",
          padding: "0 4px",
          gap: 2,
        }}
      >
        {/* Tabs — rendered first so they appear to the left of the trigger */}
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                padding: "0 11px",
                height: 20,
                borderRadius: 6,
                fontSize: 11,
                fontWeight: isActive ? 600 : 500,
                background: isActive ? "rgba(255,149,0,0.11)" : "transparent",
                border: `1px solid ${isActive ? "rgba(255,149,0,0.28)" : "transparent"}`,
                color: isActive
                  ? "rgba(255,149,0,0.92)"
                  : "rgba(255,255,255,0.42)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                opacity: expanded ? 1 : 0,
                transitionDelay: expanded ? "0.08s" : "0s",
              }}
            >
              {tab}
            </button>
          );
        })}

        {/* Separator */}
        <div
          style={{
            flexShrink: 0,
            width: 1,
            height: 12,
            background: "rgba(255,255,255,0.09)",
            margin: "0 4px",
            opacity: expanded ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        />

        {/* Trigger icon — always visible (rightmost, never clipped) */}
        <div
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: expanded ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.7)",
            transition: "color 0.2s",
          }}
        >
          {/* Three horizontal lines icon */}
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <rect width="12" height="1.4" rx="0.7" fill="currentColor" />
            <rect y="3.8" width="8"  height="1.4" rx="0.7" fill="currentColor" />
            <rect y="7.6" width="10" height="1.4" rx="0.7" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
