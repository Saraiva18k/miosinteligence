interface SubTabsProps {
  active: "concorrentes" | "estrategia";
  onChange: (tab: "concorrentes" | "estrategia") => void;
}

const tabs: Array<{ id: "concorrentes" | "estrategia"; label: string }> = [
  { id: "concorrentes", label: "Inteligência de Concorrentes" },
  { id: "estrategia", label: "Estratégia & Ação" },
];

export function SubTabs({ active, onChange }: SubTabsProps) {
  return (
    <div
      className="flex"
      style={{
        gap: 4,
        paddingTop: 4,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: "7px 16px",
              borderRadius: "8px 8px 0 0",
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.3)",
              background: isActive ? "rgba(255,149,0,0.04)" : "rgba(255,255,255,0.008)",
              backdropFilter: "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              borderBottom: `2px solid ${isActive ? "#ff9500" : "transparent"}`,
              marginBottom: -1,
              transition: "all 0.15s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}