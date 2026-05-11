import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Zap, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, Brain } from "lucide-react";

type ModuleStatus = "done" | "active" | "pending";

interface TimelineModule {
  label: string;
  status: ModuleStatus;
  preview?: string;
  alertCount?: number;
}

interface TimelineSection {
  title: string;
  modules: TimelineModule[];
}

const sections: TimelineSection[] = [
  {
    title: "PESQUISA",
    modules: [
      { label: "Dores", status: "done", preview: "Gap de confiança real" },
      { label: "Concorrentes", status: "done", preview: "5 players, NPS baixo" },
      { label: "Tendências", status: "done", preview: "Busca +340% 6 meses" },
      { label: "Audiência", status: "pending" },
      { label: "Sentimento", status: "pending" },
      { label: "Canais", status: "pending" },
      { label: "Precificação", status: "pending" },
      { label: "Social Intelligence", status: "pending", alertCount: 2 },
      { label: "DNA da Marca", status: "pending" },
    ],
  },
  {
    title: "SÍNTESE",
    modules: [
      { label: "Inovação", status: "pending" },
      { label: "Compliance", status: "pending" },
      { label: "Investimento", status: "pending" },
      { label: "Business Plan", status: "pending" },
      { label: "Veredito", status: "active", preview: "Score 87 · Entrar agora" },
    ],
  },
];

const moduleHrefs: Record<string, string> = {
  Veredito: "/",
  "Social Intelligence": "/social-intelligence",
  Dores: "/dores",
  "Tendências": "/tendencias",
  Concorrentes: "/concorrentes",
  "Audiência": "/audiencia",
  Investimento: "/investimento",
  "Business Plan": "/business-plan",
};

interface SidebarProps {
  activeModule?: string;
}

export function Sidebar({ activeModule = "Veredito" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Compute progress: count modules up to and including activeModule as done
  const flat = sections.flatMap((s) => s.modules.map((m) => m.label));
  const activeIdx = flat.indexOf(activeModule);
  const total = flat.length;
  const doneCount = activeIdx >= 0 ? activeIdx : 0;
  const progress = Math.round((doneCount / total) * 100);

  const mentor = { label: "Mentor IA", icon: Brain };

  if (collapsed) {
    return (
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

        <button
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background:
              "linear-gradient(135deg, rgba(255,149,0,0.18), rgba(255,149,0,0.06))",
            border: "1px solid rgba(255,149,0,0.4)",
            color: "rgba(255,149,0,0.95)",
          }}
          aria-label="Mentor IA"
        >
          <Brain size={16} strokeWidth={2.2} />
        </button>
      </aside>
    );
  }

  return (
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
                const href = moduleHrefs[m.label];
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

                return href ? (
                  <Link key={m.label} to={href} className="block">
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

      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          className="w-full flex items-center gap-2 transition-all"
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            background:
              "linear-gradient(135deg, rgba(255,149,0,0.12), rgba(255,149,0,0.04))",
            border: "1px solid rgba(255,149,0,0.35)",
            color: "rgba(255,149,0,0.95)",
          }}
        >
          <Brain size={13} strokeWidth={2.2} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{mentor.label}</span>
          <ArrowUpRight size={11} className="ml-auto" />
          <Zap size={10} style={{ display: "none" }} />
        </button>
      </div>
    </aside>
  );
}