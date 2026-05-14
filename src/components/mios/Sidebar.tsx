import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft, ChevronRight, ChevronDown,
  Globe, Users, Layers, Compass, Award, Brain,
  MapPin, Home, ArrowUpRight, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/mios/Logo";
import { WorkspaceSwitcher } from "@/components/mios/WorkspaceSwitcher";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mentor-shimmer {
  0%   { transform: translateX(-130%); }
  100% { transform: translateX(230%); }
}
@keyframes mentor-glow {
  0%,100% { box-shadow: 0 4px 24px -6px rgba(255,149,0,0.14), 0 0 0 1px rgba(255,149,0,0.05) inset; }
  50%      { box-shadow: 0 6px 32px -4px rgba(255,149,0,0.28), 0 0 0 1px rgba(255,149,0,0.10) inset; }
}
@keyframes online-ripple {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

type ModuleStatus = "done" | "active" | "pending";

interface SidebarModule {
  label: string;
  href: string;
  status: ModuleStatus;
  isNew?: boolean;
}

interface SidebarGroup {
  id: string;
  label: string;
  Icon: LucideIcon;
  href: string;
  modules: SidebarModule[];
}

const GROUPS: SidebarGroup[] = [
  {
    id: "mercado",
    label: "Mercado",
    Icon: Globe,
    href: "/mercado",
    modules: [
      { label: "Concorrentes",     href: "/concorrentes",        status: "done"    },
      { label: "Tendências",       href: "/tendencias",          status: "done"    },
      { label: "Sentimento",       href: "/sentimento",          status: "done"    },
      { label: "Pulso do Mercado", href: "/pulso",               status: "pending", isNew: true },
      { label: "Benchmarking",     href: "/benchmarking",        status: "pending", isNew: true },
      { label: "Stakeholders",     href: "/stakeholders",        status: "pending", isNew: true },
    ],
  },
  {
    id: "audiencia",
    label: "Audiência",
    Icon: Users,
    href: "/audiencia-hub",
    modules: [
      { label: "Dores",              href: "/dores",               status: "done" },
      { label: "Audiência",          href: "/audiencia",           status: "done" },
      { label: "Social Intelligence",href: "/social-intelligence", status: "done" },
      { label: "Canais",             href: "/canais",              status: "done" },
    ],
  },
  {
    id: "marca",
    label: "Marca & Produto",
    Icon: Layers,
    href: "/marca-hub",
    modules: [
      { label: "DNA da Marca",  href: "/dna",        status: "done" },
      { label: "Precificação",  href: "/precificacao",status: "done" },
      { label: "Inovação",      href: "/inovacao",    status: "done" },
    ],
  },
  {
    id: "estrategia",
    label: "Estratégia",
    Icon: Compass,
    href: "/estrategia-hub",
    modules: [
      { label: "Business Plan", href: "/business-plan", status: "done"    },
      { label: "Investimento",  href: "/investimento",  status: "done"    },
      { label: "Compliance",    href: "/compliance",    status: "done"    },
      { label: "Cenários",      href: "/cenarios",      status: "pending", isNew: true },
      { label: "OKR",           href: "/okr",           status: "pending", isNew: true },
    ],
  },
  {
    id: "veredito",
    label: "Veredito",
    Icon: Award,
    href: "/veredito",
    modules: [
      { label: "Score Final", href: "/score-final", status: "active"  },
      { label: "Exportação",  href: "/exportacao",  status: "pending", isNew: true },
      { label: "Histórico",   href: "/historico",   status: "pending", isNew: true },
      { label: "Comparativo", href: "/comparativo", status: "pending", isNew: true },
    ],
  },
];

function resolveActiveGroup(activeModule: string): string | null {
  for (const g of GROUPS) {
    if (g.label === activeModule || g.id === activeModule) return g.id;
    if (g.modules.some(m => m.label === activeModule))    return g.id;
  }
  return null;
}

const MENTOR_INSIGHT = "Janela 22h–23h ignorada por todos os concorrentes mapeados";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeModule?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({ activeModule = "" }: SidebarProps) {
  const [collapsed, setCollapsed]         = useState(false);
  const [mentorExpanded, setMentorExpanded] = useState(false);
  const [mentorNew, setMentorNew]           = useState(false);

  const activeGroupId = useMemo(() => resolveActiveGroup(activeModule), [activeModule]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(activeGroupId);

  // Auto-expand correct group when route changes
  useEffect(() => {
    if (activeGroupId) setExpandedGroup(activeGroupId);
  }, [activeGroupId]);

  // Mentor IA auto-expand sequence
  useEffect(() => {
    const t1 = setTimeout(() => setMentorNew(true), 1200);
    const t2 = setTimeout(() => { setMentorNew(false); setMentorExpanded(true); }, 2800);
    const t3 = setTimeout(() => setMentorExpanded(false), 11000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const allModules = GROUPS.flatMap(g => g.modules);
  const doneCount  = allModules.filter(m => m.status === "done").length;
  const total      = allModules.length;
  const progress   = Math.round((doneCount / total) * 100);

  const toggleGroup = (id: string) =>
    setExpandedGroup(prev => (prev === id ? null : id));

  // ── Collapsed ───────────────────────────────────────────────────────────────

  if (collapsed) {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <aside
          className="flex flex-col items-center shrink-0"
          style={{
            width: 56,
            margin: "12px 0 12px 12px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)",
            padding: "12px 0 10px",
            gap: 6,
          }}
        >
          {/* Brain → Home */}
          <Link to="/" style={{ textDecoration: "none", marginBottom: 4 }}>
            <img src="/mios-brain.png" alt="MIOS" style={{ height: 28, width: "auto", mixBlendMode: "screen" }} />
          </Link>

          {/* Expand */}
          <button
            onClick={() => setCollapsed(false)}
            style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 6 }}
            aria-label="Expandir"
          >
            <ChevronRight size={13} strokeWidth={2.4} />
          </button>

          {/* Group icons */}
          {GROUPS.map(({ id, label, Icon, href }) => {
            const isActive = activeGroupId === id;
            return (
              <Link
                key={id} to={href as any} title={label}
                style={{
                  width: 34, height: 34, borderRadius: 9,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isActive ? "rgba(255,149,0,0.10)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(255,149,0,0.38)" : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={14} strokeWidth={2.2} />
              </Link>
            );
          })}

          {/* Mentor */}
          <div style={{ flex: 1 }} />
          <Link
            to="/mentor"
            title="Mentor IA"
            style={{
              width: 34, height: 34, borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(255,149,0,0.18), rgba(255,80,0,0.08))",
              border: "1px solid rgba(255,149,0,0.4)",
              color: "rgba(255,149,0,0.9)",
              textDecoration: "none",
              animation: "mentor-glow 3s ease infinite",
            }}
          >
            <Brain size={15} strokeWidth={2.2} />
          </Link>
        </aside>
      </>
    );
  }

  // ── Expanded ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{KEYFRAMES}</style>
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 248,
          margin: "12px 0 12px 12px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "0 8px 32px -8px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.05) inset",
          overflow: "hidden",
        }}
      >
        {/* ── Logo ──────────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "14px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Logo size={44} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link
              to="/"
              aria-label="Home"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 7, textDecoration: "none",
                background: activeModule === "Home" ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeModule === "Home" ? "rgba(255,149,0,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: activeModule === "Home" ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.3)",
              }}
            >
              <Home size={12} strokeWidth={2.2} />
            </Link>
            <button
              onClick={() => setCollapsed(true)}
              style={{ color: "rgba(255,255,255,0.28)", lineHeight: 0, background: "none", border: "none", cursor: "pointer" }}
              aria-label="Recolher"
            >
              <ChevronLeft size={14} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* ── Workspace ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <WorkspaceSwitcher />
        </div>

        {/* ── Status badges ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-4"
          style={{ padding: "6px 14px 7px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="pulse-dot inline-block rounded-full" style={{ width: 5, height: 5, background: "var(--success)", flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "var(--text-3)" }}>LIVE</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={8} style={{ color: "rgba(255,149,0,0.55)" }} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.8px", color: "rgba(255,149,0,0.6)" }}>LOCAL · SP</span>
          </div>
        </div>

        {/* ── Group accordion ───────────────────────────────────────────────── */}
        <div className="mios-scroll flex-1 overflow-y-auto" style={{ padding: "8px 8px" }}>
          {GROUPS.map(group => {
            const { Icon } = group;
            const isActiveGroup = activeGroupId === group.id;
            const isExpanded    = expandedGroup === group.id;
            const done = group.modules.filter(m => m.status === "done").length;
            const gtotal = group.modules.length;

            return (
              <div key={group.id} style={{ marginBottom: 2 }}>

                {/* Group row */}
                <div
                  style={{
                    display: "flex", alignItems: "center",
                    borderRadius: 8,
                    background: isActiveGroup ? "rgba(255,149,0,0.07)" : "transparent",
                    border: `1px solid ${isActiveGroup ? "rgba(255,149,0,0.16)" : "transparent"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {/* Icon + label → navigate to group dashboard */}
                  <Link
                    to={group.href as any}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      flex: 1, padding: "8px 6px 8px 8px",
                      textDecoration: "none",
                    }}
                  >
                    <Icon
                      size={14} strokeWidth={2.2}
                      style={{ color: isActiveGroup ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.38)", flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: isActiveGroup ? "rgba(255,149,0,0.95)" : "rgba(255,255,255,0.62)",
                      flex: 1,
                    }}>
                      {group.label}
                    </span>
                  </Link>

                  {/* Progress fraction */}
                  <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.22)", paddingRight: 4, flexShrink: 0 }}>
                    {done}/{gtotal}
                  </span>

                  {/* Chevron — toggle submenu only */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    style={{
                      width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                      background: "none", border: "none", cursor: "pointer",
                      color: isExpanded ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.22)",
                      flexShrink: 0,
                    }}
                    aria-label={isExpanded ? "Recolher" : "Expandir"}
                  >
                    <ChevronDown
                      size={12} strokeWidth={2.4}
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.22s ease" }}
                    />
                  </button>
                </div>

                {/* Submenu */}
                <div style={{
                  maxHeight: isExpanded ? group.modules.length * 30 + 4 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.28s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  <div style={{ padding: "2px 0 4px" }}>
                    {group.modules.map(m => {
                      const isActiveMod = m.label === activeModule;
                      const dotColor =
                        m.status === "done"  ? "rgba(16,185,129,0.75)" :
                        isActiveMod          ? "rgba(255,149,0,0.95)"  :
                                               "rgba(255,255,255,0.14)";
                      return (
                        <Link
                          key={m.label}
                          to={m.href as any}
                          style={{
                            display: "flex", alignItems: "center", gap: 7,
                            padding: "5px 8px 5px 28px",
                            borderRadius: 6, textDecoration: "none",
                            background: isActiveMod ? "rgba(255,149,0,0.06)" : "transparent",
                            border: `1px solid ${isActiveMod ? "rgba(255,149,0,0.15)" : "transparent"}`,
                            transition: "all 0.12s",
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, flexShrink: 0,
                            boxShadow: isActiveMod ? "0 0 6px rgba(255,149,0,0.6)" : undefined }} />
                          <span style={{
                            fontSize: 11, flex: 1,
                            fontWeight: isActiveMod ? 600 : 400,
                            color: isActiveMod       ? "rgba(255,149,0,0.9)"  :
                                   m.status === "done" ? "rgba(255,255,255,0.48)" :
                                                         "rgba(255,255,255,0.28)",
                          }}>
                            {m.label}
                          </span>
                          {m.isNew && (
                            <span style={{
                              fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                              background: "rgba(255,149,0,0.10)", color: "rgba(255,149,0,0.65)",
                              border: "1px solid rgba(255,149,0,0.18)", flexShrink: 0,
                            }}>
                              NEW
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Mentor card (dynamic) ─────────────────────────────────────────── */}
        <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "8px 10px 10px" }}>

          {/* Expandable detail */}
          <div style={{ maxHeight: mentorExpanded ? 240 : 0, overflow: "hidden", transition: "max-height 0.42s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{
              opacity: mentorExpanded ? 1 : 0,
              transition: "opacity 0.28s ease",
              transitionDelay: mentorExpanded ? "0.12s" : "0s",
              padding: "12px 14px 10px",
              borderRadius: "10px 10px 0 0",
              background: "linear-gradient(135deg, rgba(255,149,0,0.15) 0%, rgba(255,80,0,0.06) 100%)",
              border: "1px solid rgba(255,149,0,0.40)",
              borderBottom: "none",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, width: "55%", background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.07), transparent)", animation: "mentor-shimmer 4.5s ease infinite", pointerEvents: "none" }} />

              {/* Score + progress */}
              <div className="flex items-end justify-between" style={{ marginBottom: 10, position: "relative" }}>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: 30, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>87</span>
                  <span style={{ fontSize: 10, color: "rgba(255,149,0,0.4)", fontFamily: "JetBrains Mono, monospace" }}>/100</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,149,0,0.85)", fontFamily: "JetBrains Mono, monospace" }}>{progress}%</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{doneCount}/{total} módulos</div>
                </div>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,149,0,0.9), rgba(255,149,0,0.5))" }} />
              </div>
              <div style={{ padding: "7px 10px", borderRadius: 8, background: "rgba(255,149,0,0.07)", border: "1px solid rgba(255,149,0,0.14)" }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,149,0,0.5)", letterSpacing: 1, marginBottom: 3 }}>INSIGHT DO MENTOR</div>
                <div style={{ fontSize: 9, color: "rgba(255,149,0,0.5)", lineHeight: 1.4 }}>💡 {MENTOR_INSIGHT}</div>
              </div>
            </div>
          </div>

          {/* Compact row */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 12px",
              borderRadius: mentorExpanded ? "0 0 10px 10px" : 10,
              background: "linear-gradient(135deg, rgba(255,149,0,0.18) 0%, rgba(255,80,0,0.08) 100%)",
              border: "1px solid rgba(255,149,0,0.45)",
              borderTop: mentorExpanded ? "1px solid rgba(255,149,0,0.16)" : undefined,
              animation: "mentor-glow 3s ease infinite",
              cursor: "pointer",
              transition: "border-radius 0.42s cubic-bezier(0.4,0,0.2,1)",
            }}
            onClick={() => setMentorExpanded(v => !v)}
          >
            <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(16,185,129,0.95)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(16,185,129,0.5)", animation: "online-ripple 2s ease-out infinite" }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: "#ff9500" }}>MENTOR IA</span>
            {mentorNew && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9500", boxShadow: "0 0 8px rgba(255,149,0,0.9)", flexShrink: 0 }} />}
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "rgba(255,149,0,0.85)", fontFamily: "JetBrains Mono, monospace", flexShrink: 0 }}>87</span>
            {mentorExpanded ? (
              <button
                onClick={e => { e.stopPropagation(); setMentorExpanded(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)", cursor: "pointer", flexShrink: 0 }}
              >
                <X size={9} strokeWidth={2.5} />
              </button>
            ) : (
              <Link
                to="/mentor"
                onClick={e => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 7px", borderRadius: 6, background: "rgba(255,149,0,0.13)", border: "1px solid rgba(255,149,0,0.28)", textDecoration: "none", flexShrink: 0 }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,149,0,0.85)" }}>Conversar</span>
                <ArrowUpRight size={9} style={{ color: "rgba(255,149,0,0.65)" }} />
              </Link>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}
