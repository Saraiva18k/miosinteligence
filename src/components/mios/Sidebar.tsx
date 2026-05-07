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
  Concorrentes: "/concorrentes",
  Audiencia: "/audiencia",
};

function NodeDot({ status }: { status: ModuleStatus }) {
  if (status === "done") {
    return (
      <span
        className="block rounded-full shrink-0"
        style={{ width: 7, height: 7, background: "var(--accent)" }}
      />
    );
  }
  if (status === "active") {
    return (
      <span
        className="block rounded-full shrink-0"
        style={{
          width: 7,
          height: 7,
          background: "var(--bg-base)",
          border: "1.5px solid var(--accent)",
          boxShadow: "0 0 0 3px rgba(255,149,0,0.15)",
        }}
      />
    );
  }
  return (
    <span
      className="block rounded-full shrink-0"
      style={{
        width: 7,
        height: 7,
        background: "transparent",
        border: "1.5px solid rgba(255,255,255,0.12)",
      }}
    />
  );
}

function TimelineRow({ module, isLast }: { module: TimelineModule; isLast: boolean }) {
  const labelColor =
    module.status === "active"
      ? "rgba(255,149,0,0.9)"
      : module.status === "done"
        ? "rgba(255,255,255,0.46)"
        : "rgba(255,255,255,0.20)";
  const labelWeight = module.status === "active" ? 600 : 500;
  const lineColor =
    module.status === "done" || module.status === "active"
      ? "rgba(255,149,0,0.2)"
      : "rgba(255,255,255,0.06)";
  const href = moduleHrefs[module.label];

  const inner = (
    <div className="relative flex gap-3 pl-4 pr-3">
      {!isLast && (
        <span
          className="absolute"
          style={{ left: 17, top: 14, bottom: -6, width: 1, background: lineColor }}
        />
      )}
      <div className="pt-[6px]">
        <NodeDot status={module.status} />
      </div>
      <div className="pb-2.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 10, fontWeight: labelWeight, color: labelColor, letterSpacing: 0.2 }}>
            {module.label}
          </span>
          {module.alertCount && (
            <span
              className="inline-flex items-center justify-center"
              style={{
                minWidth: 14,
                height: 14,
                padding: "0 4px",
                borderRadius: 7,
                background: "#ef4444",
                border: "2px solid #04060f",
                fontSize: 8,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {module.alertCount}
            </span>
          )}
        </div>
        {module.preview && (
          <div
            className="mt-0.5 truncate"
            style={{
              fontSize: 9,
              color: module.status === "active" ? "rgba(255,149,0,0.6)" : "rgba(255,149,0,0.34)",
            }}
          >
            {module.preview}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block transition-colors hover:bg-white/[0.02]">
        {inner}
      </Link>
    );
  }
  return inner;
}

interface SidebarProps {
  activeModule?: string;
}

export function Sidebar({ activeModule }: SidebarProps = {}) {
  const [collapsed, setCollapsed] = useState(false);

  // Re-map statuses based on the active module so the sidebar reflects the current page.
  const computedSections: TimelineSection[] = activeModule
    ? sections.map((s) => ({
        ...s,
        modules: s.modules.map((m) =>
          m.label === activeModule
            ? { ...m, status: "active" as ModuleStatus }
            : m.status === "active"
              ? { ...m, status: "pending" as ModuleStatus }
              : m,
        ),
      }))
    : sections;

  // Flatten all modules for mini stepper
  const allModules = computedSections.flatMap((s) => s.modules);

  if (collapsed) {
    return (
      <aside
        className="flex flex-col shrink-0 relative z-20"
        style={{
          width: 44,
          background: "rgba(7,9,15,0.45)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center transition-colors"
          style={{
            height: 32,
            color: "rgba(255,255,255,0.4)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          aria-label="Expandir sidebar"
        >
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>

        {/* Mini stepper — evolution timeline */}
        <div className="flex-1 overflow-y-auto mios-scroll flex flex-col items-center pt-4 pb-3 gap-0">
          {allModules.map((m, idx) => {
            const isLast = idx === allModules.length - 1;
            const lineColor =
              m.status === "done" || m.status === "active"
                ? "rgba(255,149,0,0.25)"
                : "rgba(255,255,255,0.06)";
            return (
              <div
                key={m.label}
                className="relative flex flex-col items-center"
                title={m.label}
              >
                <div className="relative z-10 py-[3px]">
                  <NodeDot status={m.status} />
                </div>
                {!isLast && (
                  <span
                    style={{
                      width: 1,
                      height: 10,
                      background: lineColor,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mentor icon — highlighted at the bottom */}
        <div
          className="flex items-center justify-center pb-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <button
            className="flex items-center justify-center relative transition-transform"
            title="Mentor · IA"
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background:
                "linear-gradient(135deg, rgba(255,149,0,1), rgba(255,106,0,1))",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.15) inset, 0 6px 16px rgba(255,149,0,0.55), 0 0 0 3px rgba(255,149,0,0.10)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Brain size={15} strokeWidth={2.4} color="#04060f" />
            <span
              className="pulse-dot absolute rounded-full"
              style={{
                top: -2,
                right: -2,
                width: 7,
                height: 7,
                background: "rgb(168,85,247)",
                boxShadow: "0 0 8px rgba(168,85,247,0.8)",
              }}
            />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="flex flex-col shrink-0 relative z-20"
      style={{
        width: 220,
        background: "rgba(7,9,15,0.45)",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.02)",
      }}
    >
      {/* Toggle bar */}
      <div
        className="flex items-center justify-between px-3"
        style={{
          height: 32,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "2.5px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          PIPELINE
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="flex items-center justify-center transition-colors"
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.03)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.background = "rgba(255,149,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          }}
          aria-label="Recolher sidebar"
        >
          <ChevronLeft size={12} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 mios-scroll">
        {computedSections.map((section, sIdx) => (
          <div key={section.title}>
            <div
              className="px-4 pt-3 pb-2"
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "2.5px",
                color: "rgba(255,255,255,0.22)",
              }}
            >
              ── {section.title} ──
            </div>
            {section.modules.map((m, idx) => (
              <TimelineRow
                key={m.label}
                module={m}
                isLast={idx === section.modules.length - 1}
              />
            ))}
            {sIdx < computedSections.length - 1 && (
              <div
                className="mx-3.5 my-2"
                style={{ height: 1, background: "rgba(255,255,255,0.04)" }}
              />
            )}
          </div>
        ))}

        {/* O Mentor card — premium / "module game-changer" */}
        <div className="px-2.5 mt-4">
          <button
            className="group w-full text-left transition-all duration-300 relative overflow-hidden"
            style={{
              border: "1px solid rgba(255,149,0,0.28)",
              background:
                "linear-gradient(135deg, rgba(255,149,0,0.12) 0%, rgba(168,85,247,0.10) 100%)",
              borderRadius: 12,
              padding: "14px 13px 14px",
              boxShadow:
                "0 0 0 1px rgba(255,149,0,0.04) inset, 0 8px 24px -10px rgba(255,149,0,0.35), 0 2px 8px -2px rgba(168,85,247,0.20)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(255,149,0,0.08) inset, 0 14px 32px -10px rgba(255,149,0,0.55), 0 4px 12px -2px rgba(168,85,247,0.30)";
              e.currentTarget.style.borderColor = "rgba(255,149,0,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(255,149,0,0.04) inset, 0 8px 24px -10px rgba(255,149,0,0.35), 0 2px 8px -2px rgba(168,85,247,0.20)";
              e.currentTarget.style.borderColor = "rgba(255,149,0,0.28)";
            }}
          >
            {/* sheen */}
            <span
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                top: -40,
                left: -40,
                width: 80,
                height: 200,
                background:
                  "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
                transform: "rotate(15deg)",
                transition: "transform 700ms ease",
              }}
            />
            {/* aurora glow inside card */}
            <span
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                background:
                  "radial-gradient(circle, rgba(255,149,0,0.35), transparent 70%)",
                filter: "blur(8px)",
              }}
            />

            <div className="relative flex items-start gap-2.5">
              <span
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, rgba(255,149,0,1), rgba(255,106,0,1))",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.15) inset, 0 4px 12px rgba(255,149,0,0.45)",
                }}
              >
                <Brain size={14} strokeWidth={2.4} color="#04060f" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span
                    style={{
                      fontSize: 7,
                      fontWeight: 800,
                      letterSpacing: "2.5px",
                      color: "rgba(255,149,0,0.7)",
                    }}
                  >
                    MENTOR · IA
                  </span>
                  <Sparkles size={8} style={{ color: "rgba(168,85,247,0.85)" }} />
                </div>
                <div
                  className="mt-0.5"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.95)",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Estratégia ao vivo
                </div>
              </div>
            </div>

            <div
              className="relative mt-2"
              style={{
                fontSize: 9,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Treinado no seu projeto. Decisões em tempo real, com contexto.
            </div>

            <div className="relative mt-2.5 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "rgba(255,149,0,0.95)",
                  letterSpacing: "0.3px",
                }}
              >
                Conversar agora
                <ArrowUpRight size={10} strokeWidth={2.6} />
              </span>
              <span
                className="pulse-dot inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "var(--accent)",
                  color: "rgba(255,149,0,0.5)",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-2.5 space-y-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          className="w-full flex items-center justify-center gap-1.5 transition-all"
          style={{
            background: "rgba(255,149,0,0.10)",
            border: "1px solid rgba(255,149,0,0.20)",
            color: "rgba(255,149,0,0.80)",
            borderRadius: 9,
            padding: "10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,149,0,0.18)";
            e.currentTarget.style.borderColor = "rgba(255,149,0,0.40)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,149,0,0.10)";
            e.currentTarget.style.borderColor = "rgba(255,149,0,0.20)";
            e.currentTarget.style.color = "rgba(255,149,0,0.80)";
          }}
        >
          <Zap size={11} strokeWidth={2.5} fill="currentColor" />
          Analisar agora
        </button>
        <button
          className="w-full flex items-center justify-center gap-1.5 transition-all"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.20)",
            borderRadius: 8,
            padding: "7px 10px",
            fontSize: 10,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "rgba(255,255,255,0.40)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.20)";
          }}
        >
          <ArrowUpRight size={10} style={{ opacity: 0.5 }} />
          Exportar relatório
        </button>
      </div>
    </aside>
  );
}
