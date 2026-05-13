import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, Brain } from "lucide-react";

const MENTOR_KF = `
@keyframes mentor-shimmer {
  0%   { transform: translateX(-130%); }
  100% { transform: translateX(230%); }
}
@keyframes mentor-glow {
  0%,100% { box-shadow: 0 0 8px rgba(255,149,0,0.08); }
  50%      { box-shadow: 0 0 22px rgba(255,149,0,0.22), 0 0 40px rgba(255,149,0,0.06); }
}
@keyframes online-ripple {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
}
`;

type ModuleStatus = "done" | "active" | "pending";

interface TimelineModule {
  label: string;
  status: ModuleStatus;
  preview?: string;
  alertCount?: number;
  href?: string;
}

interface TimelineSection {
  title: string;
  modules: TimelineModule[];
}

const sections: TimelineSection[] = [
  {
    title: "PESQUISA",
    modules: [
      { label: "Dores",              status: "done",    href: "/dores",              preview: "Gap de confiança real"   },
      { label: "Concorrentes",       status: "done",    href: "/concorrentes",       preview: "5 players, NPS baixo"    },
      { label: "Tendências",         status: "done",    href: "/tendencias",         preview: "Busca +340% 6 meses"     },
      { label: "Audiência",          status: "done",    href: "/audiencia"                                              },
      { label: "Sentimento",         status: "done",    href: "/sentimento"                                              },
      { label: "Canais",             status: "done",    href: "/canais"                                                  },
      { label: "Precificação",       status: "done",    href: "/precificacao"                                           },
      { label: "Social Intelligence",status: "done",    href: "/social-intelligence",alertCount: 2                     },
      { label: "DNA da Marca",       status: "done",    href: "/dna"                                                    },
    ],
  },
  {
    title: "SÍNTESE",
    modules: [
      { label: "Inovação",      status: "done",    href: "/inovacao"                                               },
      { label: "Compliance",    status: "done",    href: "/compliance"                                             },
      { label: "Investimento",  status: "done",    href: "/investimento"                                               },
      { label: "Business Plan", status: "done",    href: "/business-plan"                                              },
      { label: "Veredito",      status: "active",  href: "/",                   preview: "Score 87 · Entrar agora"    },
    ],
  },
];

interface SidebarProps {
  activeModule?: string;
}

export function Sidebar({ activeModule = "Veredito" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Compute progress: count modules with status "done" over total
  const flat = sections.flatMap((s) => s.modules);
  const total = flat.length;
  const doneCount = flat.filter((m) => m.status === "done").length;
  const progress = Math.round((doneCount / total) * 100);

  if (collapsed) {
    return (
      <>
      <style>{MENTOR_KF}</style>
      <aside
        className="flex flex-col items-center shrink-0"
        style={{
          width: 56,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(7,9,15,0.45)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
          padding: "12px 0",
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center transition-colors"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
          }}
          aria-label="Expandir sidebar"
        >
          <ChevronRight size={14} strokeWidth={2.4} />
        </button>

        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{ width: "100%", padding: "16px 0" }}
        >
          <div
            style={{
              width: 3,
              flex: 1,
              borderRadius: 2,
              background: "rgba(255,255,255,0.05)",
              position: "relative",
              overflow: "hidden",
              minHeight: 120,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: `${progress}%`,
                background:
                  "linear-gradient(to bottom, rgba(255,149,0,0.8), rgba(255,149,0,0.3))",
                borderRadius: 2,
              }}
            />
          </div>
          <span
            className="mt-2"
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,149,0,0.7)",
              letterSpacing: "0.5px",
            }}
          >
            {progress}%
          </span>
        </div>

        <Link
          to="/mentor"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, rgba(255,149,0,0.2), rgba(255,149,0,0.07))",
            border: `1px solid ${activeModule === "Mentor IA" ? "rgba(255,149,0,0.7)" : "rgba(255,149,0,0.4)"}`,
            color: "rgba(255,149,0,0.95)",
            textDecoration: "none",
            animation: "mentor-glow 3s ease infinite",
          }}
          aria-label="Mentor IA"
        >
          <Brain size={16} strokeWidth={2.2} />
        </Link>
      </aside>
      </>
    );
  }

  return (
    <>
    <style>{MENTOR_KF}</style>
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: 240,
        borderRight: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(7,9,15,0.45)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} style={{ color: "rgba(255,149,0,0.7)" }} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            EVOLUÇÃO · {progress}%
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          style={{ color: "rgba(255,255,255,0.35)" }}
          aria-label="Recolher sidebar"
        >
          <ChevronLeft size={14} strokeWidth={2.4} />
        </button>
      </div>

      <div className="mios-scroll flex-1 overflow-y-auto" style={{ padding: "10px 8px" }}>
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.25)",
                padding: "4px 8px",
              }}
            >
              {section.title}
            </div>
            <div className="mt-1">
              {section.modules.map((m) => {
                const isActive = m.label === activeModule;
                const dotColor =
                  m.status === "done"
                    ? "rgba(16,185,129,0.8)"
                    : isActive
                    ? "rgba(255,149,0,0.95)"
                    : "rgba(255,255,255,0.15)";

                const content = (
                  <div
                    className="flex items-center gap-2 transition-colors"
                    style={{
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: isActive ? "rgba(255,149,0,0.06)" : "transparent",
                      border: `1px solid ${
                        isActive ? "rgba(255,149,0,0.18)" : "transparent"
                      }`,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: dotColor,
                        boxShadow: isActive
                          ? "0 0 8px rgba(255,149,0,0.6)"
                          : undefined,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="flex-1 truncate"
                      style={{
                        fontSize: 11,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive
                          ? "rgba(255,149,0,0.95)"
                          : m.status === "done"
                          ? "rgba(255,255,255,0.55)"
                          : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {m.label}
                    </span>
                    {m.alertCount && (
                      <span
                        style={{
                          fontSize: 8,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 8,
                          background: "rgba(239,68,68,0.18)",
                          color: "rgba(239,68,68,0.95)",
                          border: "1px solid rgba(239,68,68,0.35)",
                        }}
                      >
                        {m.alertCount}
                      </span>
                    )}
                  </div>
                );

                return m.href ? (
                  <Link key={m.label} to={m.href as any} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={m.label}>{content}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 12px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link
          to="/mentor"
          style={{
            display: "block",
            borderRadius: 12,
            textDecoration: "none",
            overflow: "hidden",
            position: "relative",
            animation: "mentor-glow 3s ease infinite",
            background: activeModule === "Mentor IA"
              ? "linear-gradient(135deg, rgba(255,149,0,0.22) 0%, rgba(255,80,0,0.12) 100%)"
              : "linear-gradient(135deg, rgba(255,149,0,0.16) 0%, rgba(255,80,0,0.07) 100%)",
            border: `1px solid ${activeModule === "Mentor IA" ? "rgba(255,149,0,0.75)" : "rgba(255,149,0,0.5)"}`,
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            boxShadow: "0 4px 24px -6px rgba(255,149,0,0.18), 0 0 0 1px rgba(255,149,0,0.06) inset",
          }}
        >
          {/* Shimmer sweep */}
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            width: "55%",
            background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.12), transparent)",
            animation: "mentor-shimmer 4s ease infinite",
            pointerEvents: "none",
          }} />

          <div style={{ padding: "12px 14px", position: "relative" }}>
            {/* Row 1: Online + label + score */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
              {/* Pulsing online dot with ripple */}
              <div style={{ position: "relative", width: 9, height: 9, flexShrink: 0 }}>
                <div style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.95)",
                }} />
                <div style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.5)",
                  animation: "online-ripple 2s ease-out infinite",
                }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: "#ff9500" }}>
                MENTOR IA
              </span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: 1 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>87</span>
                <span style={{ fontSize: 9, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace" }}>/100</span>
              </div>
            </div>

            {/* Row 2: Description */}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", marginBottom: 10, lineHeight: 1.4 }}>
              O Sócio · {total} módulos integrados
            </div>

            {/* Row 3: CTA */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 10px",
              borderRadius: 7,
              background: "rgba(255,149,0,0.12)",
              border: "1px solid rgba(255,149,0,0.25)",
            }}>
              <Brain size={11} style={{ color: "rgba(255,149,0,0.85)", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,149,0,0.9)", letterSpacing: 0.3 }}>
                Janela ativa · Conversar
              </span>
              <ArrowUpRight size={11} style={{ color: "rgba(255,149,0,0.7)", marginLeft: "auto" }} />
            </div>
          </div>
        </Link>
      </div>
    </aside>
    </>
  );
}
