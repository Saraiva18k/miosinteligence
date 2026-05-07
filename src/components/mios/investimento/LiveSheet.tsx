import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScenarioKey = "pessimista" | "realista" | "otimista";

interface MonthData {
  month: string;
  receita: number;
  custos: number;
  lucro: number;
  clientes: number;
}

interface Scenario {
  key: ScenarioKey;
  label: string;
  color: string;
  bg: string;
  ticketMedio: number;
  clientesMes: number;
  crescimentoMensal: number;
  margemLiquida: number;
  breakevenMes: number;
  roi12m: number;
  months: MonthData[];
}

interface InvestmentItem {
  category: string;
  items: Array<{ name: string; value: number; essential: boolean; note?: string }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function fmtK(n: number) {
  if (n >= 1000) return `R$${(n / 1000).toFixed(0)}k`;
  return fmt(n);
}

function buildMonths(ticket: number, clientesInicio: number, crescimento: number, custoFixo: number): MonthData[] {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  let clientes = clientesInicio;
  return months.map((month, i) => {
    if (i > 0) clientes = Math.round(clientes * (1 + crescimento / 100));
    const receita = ticket * clientes;
    const custoVar = receita * 0.35;
    const custos = custoFixo + custoVar;
    const lucro = receita - custos;
    return { month, receita, custos, lucro, clientes };
  });
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

const CUSTO_FIXO = 4800;
const INVESTIMENTO_INICIAL = 28000;

const scenarios: Record<ScenarioKey, Scenario> = {
  pessimista: {
    key: "pessimista",
    label: "Pessimista",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    ticketMedio: 220,
    clientesMes: 18,
    crescimentoMensal: 3,
    margemLiquida: 22,
    breakevenMes: 9,
    roi12m: 18,
    months: buildMonths(220, 18, 3, CUSTO_FIXO),
  },
  realista: {
    key: "realista",
    label: "Realista",
    color: "#ff9500",
    bg: "rgba(255,149,0,0.08)",
    ticketMedio: 310,
    clientesMes: 28,
    crescimentoMensal: 7,
    margemLiquida: 34,
    breakevenMes: 5,
    roi12m: 67,
    months: buildMonths(310, 28, 7, CUSTO_FIXO),
  },
  otimista: {
    key: "otimista",
    label: "Otimista",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    ticketMedio: 420,
    clientesMes: 38,
    crescimentoMensal: 12,
    margemLiquida: 48,
    breakevenMes: 3,
    roi12m: 142,
    months: buildMonths(420, 38, 12, CUSTO_FIXO),
  },
};

const investmentPlan: InvestmentItem[] = [
  {
    category: "Estrutura Fisica",
    items: [
      { name: "Reforma e adaptacao do espaco", value: 8000, essential: true },
      { name: "Mobiliario e decoracao", value: 4500, essential: true },
      { name: "Sinaliza e identidade visual", value: 1200, essential: false, note: "Pode fazer em etapas" },
    ],
  },
  {
    category: "Equipamentos",
    items: [
      { name: "Equipamento principal (HIFU/RF)", value: 9500, essential: true },
      { name: "Equipamentos auxiliares", value: 2800, essential: true },
      { name: "Sistema de esterilizacao", value: 600, essential: true },
    ],
  },
  {
    category: "Digital e Marketing",
    items: [
      { name: "Criacao de site e agendamento online", value: 800, essential: true },
      { name: "Producao de conteudo (3 meses)", value: 1800, essential: false },
      { name: "Anuncios de lancamento", value: 2000, essential: false, note: "ROI direto — recomendado" },
    ],
  },
  {
    category: "Capital de Giro",
    items: [
      { name: "Reserva operacional (3 meses)", value: 14400, essential: true, note: "3x custo fixo" },
      { name: "Estoque inicial de insumos", value: 1200, essential: true },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricPill({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, padding: "14px 16px",
      flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontSize: 18, fontWeight: 800,
        fontFamily: "JetBrains Mono, monospace",
        color: color ?? "rgba(255,255,255,0.9)",
        marginBottom: 2,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{sub}</div>
      )}
    </div>
  );
}

function MiniSparkline({ months, color }: { months: MonthData[]; color: string }) {
  const values = months.map(m => m.lucro);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 280;
  const H = 48;
  const pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${W - pad},${H} L ${pad},${H} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
      {/* breakeven line */}
      <line x1={pad} x2={W - pad} y1={H - pad - ((0 - min) / range) * (H - pad * 2)}
        y2={H - pad - ((0 - min) / range) * (H - pad * 2)}
        stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" strokeWidth={1} />
    </svg>
  );
}

function MonthTable({ scenario }: { scenario: Scenario }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? scenario.months : scenario.months.slice(0, 6);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Mes", "Clientes", "Receita", "Custos", "Lucro", "Status"].map(h => (
                <th key={h} style={{
                  padding: "8px 12px", textAlign: h === "Mes" ? "left" : "right",
                  fontSize: 9, fontWeight: 600,
                  color: "rgba(255,255,255,0.25)", letterSpacing: 0.6,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((m, i) => {
              const isPositive = m.lucro > 0;
              return (
                <tr key={m.month} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}>
                  <td style={{ padding: "8px 12px", fontSize: 10, fontWeight: 600,
                    color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono, monospace" }}>
                    {m.month}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 10,
                    color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono, monospace" }}>
                    {m.clientes}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 10,
                    color: "rgba(255,255,255,0.7)", fontFamily: "JetBrains Mono, monospace" }}>
                    {fmtK(m.receita)}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 10,
                    color: "rgba(239,68,68,0.7)", fontFamily: "JetBrains Mono, monospace" }}>
                    {fmtK(m.custos)}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 11,
                    fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                    color: isPositive ? "#10b981" : "#ef4444" }}>
                    {isPositive ? "+" : ""}{fmtK(m.lucro)}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>
                    {isPositive
                      ? <CheckCircle size={12} style={{ color: "#10b981" }} />
                      : <Minus size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-center gap-2 py-2 mt-1"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.3)", fontSize: 10,
        }}
      >
        {expanded ? <><ChevronUp size={12} /> Ver menos</> : <><ChevronDown size={12} /> Ver 12 meses completos</>}
      </button>
    </div>
  );
}

function InvestmentSection() {
  const totalEssential = investmentPlan
    .flatMap(c => c.items.filter(i => i.essential))
    .reduce((s, i) => s + i.value, 0);
  const totalAll = investmentPlan
    .flatMap(c => c.items)
    .reduce((s, i) => s + i.value, 0);

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid rgba(255,255,255,0.055)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <DollarSign size={13} style={{ color: "var(--accent)", opacity: 0.7 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
            PLANO DE INVESTIMENTO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 1 }}>MINIMO ESSENCIAL</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981",
              fontFamily: "JetBrains Mono, monospace" }}>
              {fmt(totalEssential)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 1 }}>INVESTIMENTO COMPLETO</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)",
              fontFamily: "JetBrains Mono, monospace" }}>
              {fmt(totalAll)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {investmentPlan.map(cat => {
          const catTotal = cat.items.reduce((s, i) => s + i.value, 0);
          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
                  {cat.category}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)",
                  fontFamily: "JetBrains Mono, monospace" }}>
                  {fmt(catTotal)}
                </span>
              </div>
              <div className="space-y-1.5">
                {cat.items.map(item => (
                  <div key={item.name} className="flex items-center justify-between gap-3"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      borderRadius: 7, padding: "8px 12px",
                    }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                        background: item.essential ? "#10b981" : "rgba(255,255,255,0.2)",
                      }} />
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                          {item.name}
                        </span>
                        {item.note && (
                          <span style={{ fontSize: 9, color: "rgba(255,149,0,0.6)", marginLeft: 6 }}>
                            · {item.note}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!item.essential && (
                        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)",
                          background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: "1px 5px" }}>
                          opcional
                        </span>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 700,
                        color: "rgba(255,255,255,0.8)",
                        fontFamily: "JetBrains Mono, monospace" }}>
                        {fmt(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function LiveSheet() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>("realista");
  const s = scenarios[activeScenario];
  const lucro12m = s.months.reduce((sum, m) => sum + m.lucro, 0);
  const receita12m = s.months.reduce((sum, m) => sum + m.receita, 0);

  return (
    <div className="space-y-5">
      {/* Module header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={10} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,149,0,0.8)", letterSpacing: 1.2 }}>
              ANALISE FINANCEIRA · 3 CENARIOS
            </span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.92)",
            letterSpacing: -0.5, marginBottom: 4 }}>
            A Planilha Viva
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            Projecoes financeiras dinamicas · Custo fixo {fmt(CUSTO_FIXO)}/mes · Investimento inicial {fmt(INVESTIMENTO_INICIAL)}
          </p>
        </div>
        {/* Scenario switcher */}
        <div className="flex items-center gap-2">
          {(["pessimista", "realista", "otimista"] as ScenarioKey[]).map(k => {
            const sc = scenarios[k];
            const isActive = k === activeScenario;
            return (
              <button
                key={k}
                onClick={() => setActiveScenario(k)}
                style={{
                  padding: "6px 14px", borderRadius: 8, cursor: "pointer", border: "none",
                  background: isActive ? sc.bg : "rgba(255,255,255,0.03)",
                  outline: isActive ? `1px solid ${sc.color}40` : "1px solid rgba(255,255,255,0.06)",
                  fontSize: 11, fontWeight: 700,
                  color: isActive ? sc.color : "rgba(255,255,255,0.35)",
                  transition: "all 0.2s",
                }}
              >
                {sc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex gap-3 flex-wrap">
        <MetricPill
          label="TICKET MEDIO"
          value={fmt(s.ticketMedio)}
          sub={`${s.clientesMes} clientes/mes`}
          color={s.color}
        />
        <MetricPill
          label="RECEITA 12 MESES"
          value={fmtK(receita12m)}
          sub="projecao acumulada"
        />
        <MetricPill
          label="LUCRO 12 MESES"
          value={fmtK(lucro12m)}
          sub={`margem liquida ${s.margemLiquida}%`}
          color={lucro12m > 0 ? "#10b981" : "#ef4444"}
        />
        <MetricPill
          label="BREAKEVEN"
          value={`Mes ${s.breakevenMes}`}
          sub="ponto de equilibrio"
          color={s.color}
        />
        <MetricPill
          label="ROI 12 MESES"
          value={`+${s.roi12m}%`}
          sub="retorno sobre investimento"
          color={s.roi12m > 50 ? "#10b981" : s.roi12m > 0 ? "#f59e0b" : "#ef4444"}
        />
      </div>

      {/* Projection chart card */}
      <div style={{
        background: "var(--card)",
        border: `1px solid ${s.color}20`,
        borderRadius: 12, padding: "20px 24px",
      }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
              EVOLUCAO DO LUCRO — 12 MESES
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
              Crescimento mensal de {s.crescimentoMensal}% na base de clientes
            </div>
          </div>
          <div className="flex items-center gap-2">
            {s.roi12m > 0
              ? <TrendingUp size={14} style={{ color: "#10b981" }} />
              : <TrendingDown size={14} style={{ color: "#ef4444" }} />
            }
            <span style={{ fontSize: 11, fontWeight: 700,
              color: s.roi12m > 0 ? "#10b981" : "#ef4444" }}>
              ROI {s.roi12m}%
            </span>
          </div>
        </div>
        <MiniSparkline months={s.months} color={s.color} />
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div style={{ width: 20, height: 2, background: s.color, borderRadius: 1 }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Lucro mensal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)",
              borderTop: "1px dashed rgba(255,255,255,0.15)" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Ponto de equilibrio</span>
          </div>
        </div>
      </div>

      {/* Month table */}
      <div style={{
        background: "var(--card)",
        border: "1px solid rgba(255,255,255,0.055)",
        borderRadius: 12, overflow: "hidden",
      }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 6, height: 6, borderRadius: "50%",
              background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
              PLANILHA MENSAL — CENARIO {s.label.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-2">
          <MonthTable scenario={s} />
        </div>
      </div>

      {/* Investment plan */}
      <InvestmentSection />

      {/* Risk alert */}
      <div style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid rgba(245,158,11,0.18)",
        borderRadius: 12, padding: "16px 20px",
      }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={14} style={{ color: "#f59e0b", marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
              ALERTAS FINANCEIROS
            </div>
            <div className="space-y-2">
              {[
                "Reserva de 3 meses de custo fixo e obrigatoria antes de qualquer lancamento",
                "Crescimento de clientes acima de 10%/mes exige contratacao de apoio operacional",
                "Ticket medio abaixo de R$200 inviabiliza o modelo no cenario de custos atual",
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div style={{ width: 4, height: 4, borderRadius: "50%",
                    background: "#f59e0b", marginTop: 4, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                    {alert}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
