import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  location: string;
  initial: string;
}

const initialWorkspaces: Workspace[] = [
  { id: "1", name: "Estética Premium SP", location: "São Paulo", initial: "E" },
  { id: "2", name: "Café Boutique RJ", location: "Rio de Janeiro", initial: "C" },
  { id: "3", name: "Studio Pilates BH", location: "Belo Horizonte", initial: "S" },
];

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initialWorkspaces[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 transition-all"
        style={{
          padding: "4px 8px 4px 5px",
          borderRadius: 8,
          border: `1px solid ${open ? "rgba(255,149,0,0.25)" : "rgba(255,255,255,0.06)"}`,
          background: open ? "rgba(255,149,0,0.05)" : "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: "linear-gradient(135deg, rgba(255,149,0,0.9), rgba(255,106,0,0.9))",
            fontSize: 9,
            fontWeight: 800,
            color: "var(--bg-base)",
            letterSpacing: 0,
            boxShadow: "0 0 12px rgba(255,149,0,0.25)",
          }}
        >
          {active.initial}
        </span>
        <span className="flex items-baseline gap-1.5 min-w-0">
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.78)",
              whiteSpace: "nowrap",
            }}
          >
            {active.name}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
            · {active.location}
          </span>
        </span>
        <ChevronsUpDown
          size={11}
          style={{
            color: "rgba(255,255,255,0.35)",
            transition: "transform 200ms",
            transform: open ? "rotate(180deg)" : "none",
          }}
          strokeWidth={2.2}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-50 fade-in-up"
          style={{
            top: "calc(100% + 6px)",
            width: 280,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(10,13,22,0.62)",
            backdropFilter: "blur(36px) saturate(180%)",
            WebkitBackdropFilter: "blur(36px) saturate(180%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -16px rgba(0,0,0,0.7), 0 8px 20px -8px rgba(0,0,0,0.5)",
            animationDuration: "180ms",
          }}
        >
          <div
            className="flex items-center gap-2 px-3"
            style={{
              height: 36,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Search size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              autoFocus
              placeholder="Buscar workspace…"
              className="flex-1 bg-transparent outline-none"
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.85)",
              }}
            />
          </div>

          <div
            className="px-2 py-2"
            style={{
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: "2.5px",
              color: "rgba(255,255,255,0.22)",
              padding: "10px 14px 6px",
            }}
          >
            WORKSPACES
          </div>

          <div className="px-1.5 pb-1.5 mios-scroll" style={{ maxHeight: 220, overflowY: "auto" }}>
            {initialWorkspaces.map((w) => {
              const isActive = w.id === active.id;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    setActive(w);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 transition-colors"
                  style={{
                    padding: "7px 9px",
                    borderRadius: 7,
                    background: isActive ? "rgba(255,149,0,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: isActive
                        ? "linear-gradient(135deg, rgba(255,149,0,0.9), rgba(255,106,0,0.9))"
                        : "rgba(255,255,255,0.05)",
                      fontSize: 10,
                      fontWeight: 800,
                      color: isActive ? "var(--bg-base)" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {w.initial}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: isActive
                          ? "rgba(255,149,0,0.9)"
                          : "rgba(255,255,255,0.78)",
                      }}
                    >
                      {w.name}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.3)",
                        marginTop: 1,
                      }}
                    >
                      {w.location}
                    </div>
                  </div>
                  {isActive && (
                    <Check size={12} style={{ color: "var(--accent)" }} strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="w-full flex items-center gap-2 transition-colors"
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,149,0,0.85)",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,149,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: "1px dashed rgba(255,149,0,0.4)",
              }}
            >
              <Plus size={11} strokeWidth={2.5} />
            </span>
            Criar novo workspace
          </button>
        </div>
      )}
    </div>
  );
}
