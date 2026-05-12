import { useState } from "react";
import { ChevronDown, Plus, Columns2 } from "lucide-react";

interface CompetitorSelectorProps {
  competitors: string[];
  selected: string;
  onSelect: (handle: string) => void;
  compareMode: boolean;
  onToggleCompare: () => void;
}

export function CompetitorSelector({
  competitors,
  selected,
  onSelect,
  compareMode,
  onToggleCompare,
}: CompetitorSelectorProps) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newHandle, setNewHandle] = useState("");

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Visualizando
        </span>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 transition-colors"
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {selected}
            <ChevronDown size={11} style={{ color: "rgba(255,149,0,0.6)" }} />
          </button>
          {open && (
            <div
              className="absolute left-0 mt-1 z-30 mios-float"
              style={{
                minWidth: 200,
                borderRadius: 10,
                padding: 4,
                background: "rgba(10,13,22,0.92)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {competitors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onSelect(c);
                    setOpen(false);
                  }}
                  className="w-full text-left transition-colors"
                  style={{
                    padding: "7px 10px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: c === selected ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.55)",
                    background: c === selected ? "rgba(255,149,0,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (c !== selected) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (c !== selected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {adding ? (
          <input
            autoFocus
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            onBlur={() => {
              setAdding(false);
              setNewHandle("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAdding(false);
                setNewHandle("");
              }
              if (e.key === "Escape") {
                setAdding(false);
                setNewHandle("");
              }
            }}
            placeholder="@handle ou URL"
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              background: "rgba(255,149,0,0.06)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,149,0,0.25)",
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              outline: "none",
              minWidth: 180,
            }}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 transition-colors"
            style={{
              padding: "5px 10px",
              borderRadius: 20,
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.12)",
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,149,0,0.4)";
              e.currentTarget.style.color = "rgba(255,149,0,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            <Plus size={10} strokeWidth={2.5} />
            Adicionar handle
          </button>
        )}
      </div>

      <button
        onClick={onToggleCompare}
        className="inline-flex items-center gap-1.5 transition-colors"
        style={{
          padding: "4px 10px",
          borderRadius: 6,
          background: compareMode ? "rgba(255,149,0,0.08)" : "transparent",
          border: `1px solid ${compareMode ? "rgba(255,149,0,0.3)" : "rgba(255,255,255,0.08)"}`,
          fontSize: 11,
          fontWeight: 600,
          color: compareMode ? "rgba(255,149,0,0.85)" : "rgba(255,255,255,0.4)",
          letterSpacing: "0.5px",
        }}
      >
        <Columns2 size={10} strokeWidth={2.4} />
        Comparar 2 perfis
      </button>
    </div>
  );
}