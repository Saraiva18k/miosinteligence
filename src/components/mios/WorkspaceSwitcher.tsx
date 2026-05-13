import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { WorkspaceCreator, type NewWorkspace } from "@/components/mios/WorkspaceCreator";

interface Workspace {
  id: string;
  name: string;
  location: string;
  initial: string;
}

const initialWorkspaces: Workspace[] = [
  { id: "1", name: "Estética Premium SP", location: "São Paulo", initial: "E" },
  { id: "2", name: "Café Boutique RJ",    location: "Rio de Janeiro", initial: "C" },
  { id: "3", name: "Studio Pilates BH",   location: "Belo Horizonte", initial: "S" },
];

export function WorkspaceSwitcher() {
  const [open, setOpen]               = useState(false);
  const [active, setActive]           = useState(initialWorkspaces[0]);
  const [dropPos, setDropPos]         = useState({ top: 0, left: 0 });
  const [workspaces, setWorkspaces]   = useState(initialWorkspaces);
  const [creating, setCreating]       = useState(false);
  const containerRef                  = useRef<HTMLDivElement>(null);
  const buttonRef                     = useRef<HTMLButtonElement>(null);

  const handleCreated = (ws: NewWorkspace) => {
    const newWs = { id: ws.id, name: ws.name, location: ws.location, initial: ws.initial };
    setWorkspaces(prev => [...prev, newWs]);
    setActive(newWs);
  };

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left });
    }
    setOpen(v => !v);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const panel  = document.getElementById("ws-dropdown-panel");
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        panel && !panel.contains(target)
      ) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* ── Trigger ──────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 transition-all"
        style={{
          width: "100%",
          padding: "6px 8px 6px 7px",
          borderRadius: 9,
          border: `1px solid ${open ? "rgba(255,149,0,0.28)" : "rgba(255,255,255,0.07)"}`,
          background: open ? "rgba(255,149,0,0.06)" : "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          cursor: "pointer",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: 20, height: 20, borderRadius: 6,
            background: "linear-gradient(135deg, rgba(255,149,0,0.9), rgba(255,106,0,0.9))",
            fontSize: 11, fontWeight: 800, color: "var(--bg-base)",
            boxShadow: "0 0 10px rgba(255,149,0,0.3)",
          }}
        >
          {active.initial}
        </span>
        <span className="flex items-baseline gap-1.5 flex-1 min-w-0">
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {active.name}
          </span>
        </span>
        <ChevronsUpDown
          size={11}
          style={{ color: "rgba(255,255,255,0.3)", transition: "transform 200ms", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}
          strokeWidth={2.2}
        />
      </button>

      {/* ── Dropdown — rendered in portal to escape sidebar stacking context ── */}
      {open && createPortal(
        <div
          id="ws-dropdown-panel"
          role="listbox"
          className="fade-in-up"
          style={{
            position: "fixed",
            top: dropPos.top,
            left: dropPos.left,
            width: 272,
            zIndex: 9999,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(10,13,22,0.88)",
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 60px -16px rgba(0,0,0,0.8), 0 8px 24px -8px rgba(0,0,0,0.5)",
            animationDuration: "180ms",
          }}
        >
          {/* Search */}
          <div className="flex items-center gap-2 px-3" style={{ height: 38, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Search size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              autoFocus
              placeholder="Buscar workspace…"
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}
            />
          </div>

          {/* Label */}
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(255,255,255,0.22)", padding: "10px 14px 6px" }}>
            WORKSPACES
          </div>

          {/* List */}
          <div className="px-1.5 pb-1.5 mios-scroll" style={{ maxHeight: 220, overflowY: "auto" }}>
            {workspaces.map(w => {
              const isActive = w.id === active.id;
              return (
                <button
                  key={w.id}
                  onClick={() => { setActive(w); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 transition-colors"
                  style={{ padding: "7px 9px", borderRadius: 7, background: isActive ? "rgba(255,149,0,0.09)" : "transparent", cursor: "pointer" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: isActive ? "linear-gradient(135deg, rgba(255,149,0,0.9), rgba(255,106,0,0.9))" : "rgba(255,255,255,0.06)",
                      fontSize: 12, fontWeight: 800,
                      color: isActive ? "var(--bg-base)" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {w.initial}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.78)" }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{w.location}</div>
                  </div>
                  {isActive && <Check size={12} style={{ color: "var(--accent)" }} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>

          {/* New workspace */}
          <button
            className="w-full flex items-center gap-2 transition-colors"
            style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 13, fontWeight: 600, color: "rgba(255,149,0,0.85)", borderBottomLeftRadius: 12, borderBottomRightRadius: 12, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,149,0,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            onClick={() => { setOpen(false); setCreating(true); }}
          >
            <span className="flex items-center justify-center" style={{ width: 18, height: 18, borderRadius: 5, border: "1px dashed rgba(255,149,0,0.4)" }}>
              <Plus size={11} strokeWidth={2.5} />
            </span>
            Criar novo workspace
          </button>
        </div>,
        document.body
      )}
      <WorkspaceCreator
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
