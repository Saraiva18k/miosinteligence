import { Link } from "@tanstack/react-router";
import {
  Globe, Target, TrendingUp, MessageSquare,
  Activity, BarChart3, Network,
  ArrowUpRight, Brain, Zap, AlertCircle,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes md-glow {
  0%,100% { opacity: 0.6 }
  50%      { opacity: 1   }
}
@keyframes md-pulse {
  0%,100% { transform: scale(1);   opacity: 0.5 }
  50%      { transform: scale(1.4); opacity: 0   }
}
@keyframes md-shimmer {
  0%   { transform: translateX(-120%) }
  100% { transform: translateX(220%)  }
}
`;

// ─── Module cards data ────────────────────────────────────────────────────────

const MODULES = [
  {
    label: "Concorrentes",
    Icon: Target,
    href: "/concorrentes",
    status: "done" as const,
    metric: "5",
    metricLabel: "players mapeados",
    insight: "NPS médio 3.2 · gap de confiança identificado",
    alert: false,
  },
  {
    label: "Tendências",
    Icon: TrendingUp,
    href: "/tendencias",
    status: "done" as const,
    metric: "+340%",
    metricLabel: "busca em 6 meses",
    insight: "Janela crítica de entrada nos próximos 90 dias",
    alert: false,
  },
  {
    label: "Sentimento",
    Icon: MessageSquare,
    href: "/sentimento",
    status: "done" as const,
    metric: "7.2",
    metricLabel: "score de mercado",
    insight: "89% positivo · principal driver: inovação",
    alert: false,
  },
  {
    label: "Pulso do Mercado",
    Icon: Activity,
    href: "/pulso",
    status: "new" as const,
    metric: null,
    metricLabel: null,
    insight: "Monitoramento em tempo real de sinais e movimentos de mercado",
    alert: false,
  },
  {
    label: "Benchmarking",
    Icon: BarChart3,
    href: "/benchmarking",
    status: "new" as const,
    metric: null,
    metricLabel: null,
    insight: "Compare suas métricas com os benchmarks reais do seu setor",
    alert: false,
  },
  {
    label: "Stakeholders",
    Icon: Network,
    href: "/stakeholders",
    status: "new" as const,
    metric: null,
    metricLabel: null,
    insight: "Mapeamento do ecossistema: investidores, parceiros e influenciadores",
    alert: false,
  },
];

const CROSS_INSIGHTS = [
  {
    label: "Oportunidade de entrada",
    text: "Janela de 22h–23h ignorada por todos os concorrentes mapeados. Sentimento positivo nesse horário.",
    type: "opportunity",
  },
  {
    label: "Risco de timing",
    text: "Tendência de +340% pode saturar em 120 dias. Entrada acima de 90 dias reduz vantagem competitiva.",
    type: "risk",
  },
  {
    label: "Diferencial confirmado",
    text: "Gap de NPS médio (3.2) aliado ao sentimento de inovação (89%) valida proposta de valor premium.",
    type: "signal",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModuleCard({ mod }: { mod: typeof MODULES[number] }) {
  const { Icon } = mod;
  const isDone = mod.status === "done";

  return (
    <Link
      to={mod.href as any}
      style={{
        display: "block", textDecoration: "none",
        borderRadius: 14, overflow: "hidden", position: "relative",
        background: isDone
          ? "linear-gradient(135deg, rgba(255,149,0,0.07) 0%, rgba(255,255,255,0.02) 100%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isDone ? "rgba(255,149,0,0.22)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.18s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = isDone
          ? "linear-gradient(135deg, rgba(255,149,0,0.11) 0%, rgba(255,255,255,0.03) 100%)"
          : "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = isDone ? "rgba(255,149,0,0.38)" : "rgba(255,255,255,0.10)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = isDone
          ? "linear-gradient(135deg, rgba(255,149,0,0.07) 0%, rgba(255,255,255,0.02) 100%)"
          : "rgba(255,255,255,0.02)";
        (e.currentTarget as HTMLElement).style.borderColor = isDone ? "rgba(255,149,0,0.22)" : "rgba(255,255,255,0.06)";
      }}
    >
      {/* Shimmer on done cards */}
      {isDone && (
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.05), transparent)", animation: "md-shimmer 6s ease infinite", pointerEvents: "none" }} />
      )}

      <div style={{ padding: "18px 18px 16px", position: "relative" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isDone ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${isDone ? "rgba(255,149,0,0.25)" : "rgba(255,255,255,0.07)"}`,
          }}>
            <Icon size={16} strokeWidth={2} style={{ color: isDone ? "rgba(255,149,0,0.85)" : "rgba(255,255,255,0.28)" }} />
          </div>

          {isDone ? (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(16,185,129,0.10)", color: "rgba(16,185,129,0.85)", border: "1px solid rgba(16,185,129,0.2)", letterSpacing: 0.5 }}>
              CONCLUÍDO
            </span>
          ) : (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(255,149,0,0.08)", color: "rgba(255,149,0,0.65)", border: "1px solid rgba(255,149,0,0.18)", letterSpacing: 0.5 }}>
              EM BREVE
            </span>
          )}
        </div>

        {/* Module name */}
        <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.4)", marginBottom: 10 }}>
          {mod.label}
        </div>

        {/* Metric (done) or description (new) */}
        {isDone && mod.metric ? (
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
              {mod.metric}
            </span>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{mod.metricLabel}</div>
          </div>
        ) : (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", lineHeight: 1.55, marginBottom: 10, minHeight: 46 }}>
            {mod.insight}
          </div>
        )}

        {/* Insight or CTA */}
        {isDone ? (
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ flex: 1 }}>{mod.insight}</span>
            <ArrowUpRight size={12} style={{ color: "rgba(255,149,0,0.5)", flexShrink: 0, marginLeft: 8 }} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 5, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 10 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)" }}>Disponível em breve</span>
          </div>
        )}

      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MercadoDashboard() {
  const doneCount  = MODULES.filter(m => m.status === "done").length;
  const totalCount = MODULES.length;
  const groupScore = 74; // intelligence score for Mercado group

  return (
    <>
      <style>{KF}</style>

      {/* ── Group hero ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderRadius: 16, marginBottom: 24, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg, rgba(255,149,0,0.10) 0%, rgba(255,80,0,0.04) 50%, rgba(4,6,15,0) 100%)",
          border: "1px solid rgba(255,149,0,0.20)",
          padding: "28px 28px 24px",
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: -40, left: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.28)",
              boxShadow: "0 0 24px -8px rgba(255,149,0,0.3)",
            }}>
              <Globe size={24} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.9)" }} />
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(255,149,0,0.55)", marginBottom: 4 }}>GRUPO DE INTELIGÊNCIA</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "rgba(255,255,255,0.94)", letterSpacing: "-0.5px" }}>Mercado</div>
            </div>
            {/* Group intelligence score */}
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,149,0,0.5)", marginBottom: 4 }}>INTELIGÊNCIA</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                {groupScore}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{doneCount}/{totalCount} módulos</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 18, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(doneCount / totalCount) * 100}%`, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,149,0,0.9), rgba(255,149,0,0.5))", transition: "width 1s ease" }} />
          </div>

          {/* Key signals row */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Concorrentes",  value: "5 players",  sub: "NPS médio 3.2"   },
              { label: "Tendência",     value: "+340%",       sub: "em 6 meses"     },
              { label: "Sentimento",    value: "89%",         sub: "positivo"       },
              { label: "Cobertura",     value: "3/6",         sub: "módulos ativos" },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginBottom: 5 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "rgba(255,149,0,0.88)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Module grid ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>MÓDULOS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {MODULES.map(mod => <ModuleCard key={mod.label} mod={mod} />)}
        </div>
      </div>

      {/* ── Cross-insights ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>SÍNTESE CRUZADA</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CROSS_INSIGHTS.map(ins => {
            const color =
              ins.type === "opportunity" ? "rgba(16,185,129,0.8)"  :
              ins.type === "risk"        ? "rgba(239,68,68,0.8)"   :
                                          "rgba(255,149,0,0.8)";
            const bg =
              ins.type === "opportunity" ? "rgba(16,185,129,0.06)"  :
              ins.type === "risk"        ? "rgba(239,68,68,0.06)"   :
                                          "rgba(255,149,0,0.06)";
            const border =
              ins.type === "opportunity" ? "rgba(16,185,129,0.18)"  :
              ins.type === "risk"        ? "rgba(239,68,68,0.18)"   :
                                          "rgba(255,149,0,0.18)";
            return (
              <div key={ins.label} style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12, background: bg, border: `1px solid ${border}` }}>
                <div style={{ width: 3, borderRadius: 2, background: color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 5, letterSpacing: 0.3 }}>{ins.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", lineHeight: 1.6 }}>{ins.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mentor IA contextualizado ──────────────────────────────────────── */}
      <div style={{
        borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, rgba(255,149,0,0.12) 0%, rgba(255,80,0,0.05) 100%)",
        border: "1px solid rgba(255,149,0,0.30)",
      }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "50%", background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.07), transparent)", animation: "md-shimmer 5s ease infinite", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ position: "relative", width: 8, height: 8 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(16,185,129,0.5)", animation: "md-pulse 2s ease-out infinite" }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: "#ff9500" }}>MENTOR IA · MERCADO</span>
            <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,149,0,0.45)" }}>Análise cruzada</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 14 }}>
            Os três módulos ativos revelam uma convergência rara: sentimento positivo alto,
            concorrência com NPS baixo e tendência acelerando. A janela de entrada é real e
            tem prazo — os próximos 90 dias são determinantes para capturar a vantagem.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["Ativar Pulso do Mercado", "Ver Veredito", "Conversar com Mentor"].map((cta, i) => (
              <Link
                key={cta}
                to={i === 0 ? "/pulso" : i === 1 ? "/veredito" : "/mentor"}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 12px",
                  borderRadius: 8, textDecoration: "none",
                  background: i === 2 ? "rgba(255,149,0,0.14)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i === 2 ? "rgba(255,149,0,0.32)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {i === 2 && <Brain size={11} style={{ color: "rgba(255,149,0,0.8)" }} />}
                <span style={{ fontSize: 11, fontWeight: 600, color: i === 2 ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.55)" }}>{cta}</span>
                <ArrowUpRight size={10} style={{ color: i === 2 ? "rgba(255,149,0,0.6)" : "rgba(255,255,255,0.3)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
