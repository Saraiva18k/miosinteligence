import { useState } from "react";

const tabs = ["Análise", "Histórico", "Base de Conhecimento"];

export function TopBar() {
  const [active, setActive] = useState("Análise");
  return (
    <div
      className="flex items-center px-6 gap-6"
      style={{
        height: 40,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(7,9,15,0.45)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className="relative h-full transition-colors"
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: isActive ? "rgba(255,149,0,0.85)" : "var(--text-3)",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.color = "rgba(255,255,255,0.40)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--text-3)";
            }}
          >
            {tab}
            {isActive && (
              <span
                className="absolute left-0 right-0"
                style={{
                  bottom: -1,
                  height: 2,
                  background: "var(--accent)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
