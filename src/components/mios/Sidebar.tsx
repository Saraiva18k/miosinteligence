import { Zap, ArrowUpRight } from "lucide-react";

type ModuleStatus = "done" | "active" | "pending";

interface TimelineModule {
  label: string;
  status: ModuleStatus;
  preview?: string;
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
      {
        label: "Concorrentes",
        status: "done",
        preview: "5 players, NPS baixo",
      },
      {
        label: "Tendências",
        status: "done",
        preview: "Busca +340% 6 meses",
      },
      { label: "Audiência", status: "pending" },
      { label: "Sentimento", status: "pending" },
      { label: "Canais", status: "pending" },
      { label: "Precificação", status: "pending" },
      { label: "Social Intelligence", status: "pending" },
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
      {
        label: "Veredito",
        status: "active",
        preview: "Score 87 · Entrar agora",
      },
    ],
  },
];

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
        background: "var(--bg-base)",
        border: "1.5px solid rgba(255,255,255,0.1)",
      }}
    />
  );
}

function TimelineRow({
  module,
  isLast,
}: {
  module: TimelineModule;
  isLast: boolean;
}) {
  const labelColor =
    module.status === "active"
      ? "rgba(255,149,0,0.9)"
      : module.status === "done"
        ? "rgba(255,255,255,0.42)"
        : "rgba(255,255,255,0.18)";
  const labelWeight = module.status === "active" ? 600 : 500;
  const lineColor =
    module.status === "done" || module.status === "active"
      ? "rgba(255,149,0,0.2)"
      : "rgba(255,255,255,0.06)";

  return (
    <div className="relative flex gap-3 pl-4 pr-3">
      {/* connector line */}
      {!isLast && (
        <span
          className="absolute"
          style={{
            left: 17,
            top: 14,
            bottom: -6,
            width: 1,
            background: lineColor,
          }}
        />
      )}
      <div className="pt-[6px]">
        <NodeDot status={module.status} />
      </div>
      <div className="pb-2.5 min-w-0">
        <div
          style={{
            fontSize: 10,
            fontWeight: labelWeight,
            color: labelColor,
            letterSpacing: 0.2,
          }}
        >
          {module.label}
        </div>
        {module.preview && (
          <div
            className="mt-0.5 truncate"
            style={{
              fontSize: 9,
              color:
                module.status === "active"
                  ? "rgba(255,149,0,0.55)"
                  : "rgba(255,149,0,0.32)",
            }}
          >
            {module.preview}
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: 200,
        background: "var(--bg-base)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <div className="flex-1 overflow-y-auto py-3 mios-scroll">
        {sections.map((section, sIdx) => (
          <div key={section.title}>
            <div
              className="px-4 pt-3 pb-2"
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "2.5px",
                color: "rgba(255,255,255,0.18)",
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
            {sIdx < sections.length - 1 && (
              <div
                className="mx-3.5 my-2"
                style={{ height: 1, background: "rgba(255,255,255,0.04)" }}
              />
            )}
          </div>
        ))}

        {/* O Mentor card */}
        <div className="px-2.5 mt-3">
          <button
            className="group w-full text-left transition-all duration-200 relative"
            style={{
              border: "1px solid rgba(255,149,0,0.18)",
              background: "rgba(255,149,0,0.06)",
              borderRadius: 10,
              padding: "12px 12px 14px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,149,0,0.10)";
              e.currentTarget.style.borderColor = "rgba(255,149,0,0.30)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,149,0,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,149,0,0.18)";
            }}
          >
            <span
              className="absolute pulse-dot rounded-full"
              style={{
                top: 10,
                right: 10,
                width: 6,
                height: 6,
                background: "var(--accent)",
                color: "rgba(255,149,0,0.5)",
              }}
            />
            <div
              style={{
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: "2.5px",
                color: "rgba(255,149,0,0.45)",
              }}
            >
              PLANO EXECUÇÃO
            </div>
            <div
              className="mt-1.5"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,149,0,0.85)",
              }}
            >
              Consultar o Mentor
            </div>
            <div
              className="mt-1"
              style={{
                fontSize: 9,
                lineHeight: 1.5,
                color: "rgba(255,149,0,0.4)",
              }}
            >
              IA treinada no seu projeto. Estratégia em tempo real.
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-2.5 space-y-1.5"
        style={{ borderTop: "1px solid var(--border)" }}
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
