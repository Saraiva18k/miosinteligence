import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Minus,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────────────────

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

interface CustomInputs {
  investimentoInicial: number;
  custoFixo: number;
  ticketMedio: number;
  clientesInicio: number;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────────────────────

const DEFAULTS: CustomInputs = {
  investimentoInicial: 28000,
  custoFixo: 4800,
  ticketMedio: 310,
  clientesInicio: 28,
};

// Scenario multipliers applied on top of user base values
const MULTIPLIERS = {
  pessimista: { ticket: 0.71, clientes: 0.64, crescimento: 3 },
  realista:   { ticket: 1.00, clientes: 1.00, crescimento: 7 },
  otimista:   { ticket: 1.35, clientes: 1.36, crescimento: 12 },
};

const SCENARIO_META: Record<ScenarioKey, { label: string; color: string; bg: string }> = {
  pessimista: { label: "Pessimista", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  realista:   { label: "Realista",   color: "#ff9500", bg: "rgba(255,149,0,0.08)"  },
  otimista:   { label: "Otimista",   color: "#10b981", bg: "rgba(16,185,129,0.08)" },
};

const MONTHS_LABELS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

// ─── Helpers ─────────────────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}
function fmtK(n: number) {
  if (Math.abs(n) >= 1000) return `R$${(n / 1000).toFixed(0)}k`;
  return fmt(n);
}

function buildMonths(ticket: number, clientesInicio: number, crescimento: number, custoFixo: number): MonthData[] {
  let clientes = clientesInicio;
  return MONTHS_LABELS.map((month, i) => {
    if (i > 0) clientes = Math.round(clientes * (1 + crescimento / 100));
    const receita = ticket * clientes;
    const custoVar = receita * 0.35;
    const custos = custoFixo + custoVar;
    const lucro = receita - custos;
    return { month, receita, custos, lucro, clientes };
  });
}

function calcBreakeven(months: MonthData[]): number {
  const idx = months.findIndex(m => m.lucro > 0);
  return idx === -1 ? 13 : idx + 1;
}

function calcROI(months: MonthData[], investimento: number): number {
  const lucro12m = months.reduce((s, m) => s + m.lucro, 0);
  return Math.round((lucro12m / investimento) * 100);
}

function buildScenario(key: ScenarioKey, inputs: CustomInputs): Scenario {
  const m = MULTIPLIERS[key];
  const meta = SCENARIO_META[key];
  const ticket = Math.round(inputs.ticketMedio * m.ticket);
  const clientes = Math.round(inputs.clientesInicio * m.clientes);
  const months = buildMonths(ticket, clientes, m.crescimento, inputs.custoFixo);
  const receita12m = months.reduce((s, mo) => s + mo.receita, 0);
  const lucro12m = months.reduce((s, mo) => s + mo.lucro, 0);
  const margemLiquida = receita12m > 0 ? Math.round((lucro12m / receita12m) * 100) : 0;

  return {
    key,
    ...meta,
    ticketMedio: ticket,
    clientesMes: clientes,
    crescimentoMensal: m.crescimento,
    margemLiquida,
    breakevenMes: calcBreakeven(months),
    roi12m: calcROI(months, inputs.investimentoInicial),
    months,
  };
}

// ─── Static investment plan ───────────────────────────────────────────────────────────────────

const investmentPlan = [
  {
    category: "Estrutura Fisica",
    items: [
      { name: "Reforma e adaptacao do espaco", value: 8000, essential: true },
      { name: "Mobiliario e decoracao",        value: 4500, essential: true },
      { name: "Sinaliza e identidade visual",  value: 1200, essential: false, note: "Pode fazer em etapas" },
    ],
  },
  {
    category: "Equipamentos",
    items: [
      { name: "Equipamento principal (HIFU/RF)", value: 9500, essential: true },
      { name: "Equipamentos auxiliares",         value: 2800, essential: true },
      { name: "Sistema de esterilizacao",        value: 600,  essential: true },
    ],
  },
  {
    category: "Digital e Marketing",
    items: [
      { name: "Criacao de site e agendamento online", value: 800,  essential: true },
      { name: "Producao de conteudo (3 meses)",       value: 1800, essential: false },
      { name: "Anuncios de lancamento",               value: 2000, essential: false, note: "ROI direto — recomendado" },
    ],
  },
  {
    category: "Capital de Giro",
    items: [
      { name: "Reserva operacional (3 meses)", value: 14400, essential: true, note: "3x custo fixo" },
      { name: "Estoque inicial de insumos",    value: 1200,  essential: true },
    ],
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────────────────────────

function MetricPill({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, padding: "14px 16px", flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace",
        color: color ?? "rgba(255,255,255,0.9)", marginBottom: 2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{sub}</div>}
    </div>
  );
}

function MiniSparkline({ months, color }: { months: MonthData[]; color: string }) {
  const values = months.map(m => m.lucro);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 280; const H = 48; const pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${W - pad},${H} L ${pad},${H} Z`;
  const zeroY = H - pad - ((0 - min) / range) * (H - pad * 2);
  const gid = `sg-${color.replace("#", "")}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gid})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
      <line x1={pad} x2={W - pad} y1={zeroY} y2={zeroY}
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
              {["Mes","Clientes","Receita","Custos","Lucro","Status"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: h === "Mes" ? "left" : "right",
                  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: 0.6 }}>
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
                  <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600,
                    color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono, monospace" }}>{m.month}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 12,
                    color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono, monospace" }}>{m.clientes}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 12,
                    color: "rgba(255,255,255,0.7)", fontFamily: "JetBrains Mono, monospace" }}>{fmtK(m.receita)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 12,
                    color: "rgba(239,68,68,0.7)", fontFamily: "JetBrains Mono, monospace" }}>{fmtK(m.custos)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 13, fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                    color: isPositive ? "#10b981" : "#ef4444" }}>
                    {isPositive ? "+" : ""}{fmtK(m.lucro)}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>
                    {isPositive
                      ? <CheckCircle size={12} style={{ color: "#10b981" }} />
                      : <Minus size={12} style={{ color: "rgba(255,255,255,0.2)" }} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-center gap-2 py-2 mt-1"
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
        {expanded ? <><ChevronUp size={12} /> Ver menos</> : <><ChevronDown size={12} /> Ver 12 meses completos</>}
      </button>
    </div>
  );
}

function InvestmentSection({ investimentoInicial }: { investimentoInicial: number }) {
  const totalEssential = investmentPlan.flatMap(c => c.items.filter(i => i.essential)).reduce((s, i) => s + i.value, 0);
  const totalAll = investmentPlan.flatMap(c => c.items).reduce((s, i) => s + i.value, 0);
  return (
    <div style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, overflow: "hidden" }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <DollarSign size={13} style={{ color: "var(--accent)", opacity: 0.7 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
            PLANO DE INVESTIMENTO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 1 }}>MINIMO ESSENCIAL</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", fontFamily: "JetBrains Mono, monospace" }}>
              {fmt(totalEssential)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 1 }}>INVESTIMENTO INFORMADO</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
              {fmt(investimentoInicial)}
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
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
                  {cat.category}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace" }}>
                  {fmt(catTotal)}
                </span>
              </div>
              <div className="space-y-1.5">
                {cat.items.map(item => (
                  <div key={item.name} className="flex items-center justify-between gap-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 7, padding: "8px 12px" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: item.essential ? "#10b981" : "rgba(255,255,255,0.2)" }} />
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item.name}</span>
                        {item.note && <span style={{ fontSize: 11, color: "rgba(255,149,0,0.6)", marginLeft: 6 }}>· {item.note}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!item.essential && (
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: "1px 5px" }}>
                          opcional
                        </span>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "JetBrains Mono, monospace" }}>
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

// ─── Input row ─────────────────────────────────────────────────────────────────────────────────

function InputField({
  label, value, min, max, step, prefix, suffix, onChange, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  prefix?: string; suffix?: string; onChange: (v: number) => void; hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {prefix && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            style={{
              width: 80, background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
              color: "var(--accent)", fontSize: 13, fontWeight: 700,
              fontFamily: "JetBrains Mono, monospace",
              padding: "3px 6px", textAlign: "right", outline: "none",
            }}
          />
          {suffix && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{suffix}</span>}
        </div>
      </div>
      {/* Slider */}
      <div style={{ position: "relative", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`, borderRadius: 2,
          background: "linear-gradient(90deg, var(--accent), rgba(255,149,0,0.6))",
          boxShadow: "0 0 6px rgba(255,149,0,0.3)",
        }} />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: "-8px 0", width: "100%", height: "20px",
            opacity: 0, cursor: "pointer", margin: 0,
          }}
        />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 12, height: 12, borderRadius: "50%",
          background: "var(--accent)", border: "2px solid rgba(4,6,15,0.8)",
          boxShadow: "0 0 8px rgba(255,149,0,0.5)",
          pointerEvents: "none",
        }} />
      </div>
      {hint && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{hint}</span>}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────────────────────────

export function LiveSheet() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>("realista");
  const [panelOpen, setPanelOpen] = useState(false);
  const [inputs, setInputs] = useState<CustomInputs>(DEFAULTS);
  const isCustomized = JSON.stringify(inputs) !== JSON.stringify(DEFAULTS);

  const setField = (field: keyof CustomInputs) => (value: number) =>
    setInputs(prev => ({ ...prev, [field]: value }));

  const reset = () => setInputs(DEFAULTS);

  // Recalculate all 3 scenarios whenever inputs change
  const scenarios = useMemo<Record<ScenarioKey, Scenario>>(() => ({
    pessimista: buildScenario("pessimista", inputs),
    realista:   buildScenario("realista",   inputs),
    otimista:   buildScenario("otimista",   inputs),
  }), [inputs]);

  const s = scenarios[activeScenario];
  const lucro12m  = s.months.reduce((sum, m) => sum + m.lucro, 0);
  const receita12m = s.months.reduce((sum, m) => sum + m.receita, 0);

  return (
    <div className="space-y-5">

      {/* ── Module header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={10} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,149,0,0.8)", letterSpacing: 1.2 }}>
              ANALISE FINANCEIRA · 3 CENARIOS
            </span>
            {isCustomized && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: "var(--accent)",
                background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)",
                borderRadius: 4, padding: "1px 6px", letterSpacing: 0.5,
              }}>
                USANDO SEUS DADOS
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: -0.5, marginBottom: 4 }}>
            A Planilha Viva
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Projecoes financeiras dinamicas · Custo fixo {fmt(inputs.custoFixo)}/mes · Investimento inicial {fmt(inputs.investimentoInicial)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Personalizar button */}
          <button
            onClick={() => setPanelOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 13px", borderRadius: 8, cursor: "pointer", border: "none",
              background: panelOpen ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.04)",
              outline: panelOpen ? "1px solid rgba(255,149,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: panelOpen ? "var(--accent)" : "rgba(255,255,255,0.5)",
              fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            }}
          >
            <SlidersHorizontal size={12} />
            Personalizar
            {panelOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          {/* Scenario switcher */}
          {(["pessimista","realista","otimista"] as ScenarioKey[]).map(k => {
            const sc = scenarios[k];
            const isActive = k === activeScenario;
            return (
              <button key={k} onClick={() => setActiveScenario(k)} style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer", border: "none",
                background: isActive ? sc.bg : "rgba(255,255,255,0.03)",
                outline: isActive ? `1px solid ${sc.color}40` : "1px solid rgba(255,255,255,0.06)",
                fontSize: 13, fontWeight: 700,
                color: isActive ? sc.color : "rgba(255,255,255,0.35)",
                transition: "all 0.2s",
              }}>
                {sc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Personalizar panel ────────────────────────────────────────────── */}
      {panelOpen && (
        <div style={{
          background: "rgba(255,149,0,0.03)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          border: "1px solid rgba(255,149,0,0.15)",
          borderRadius: 12, padding: "20px 24px",
          animation: "fadeIn 0.2s ease",
        }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>
                CONFIGURE SUA REALIDADE
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                Os 3 cenarios se recalculam automaticamente com os seus numeros
              </div>
            </div>
            {isCustomized && (
              <button onClick={reset} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 11px", borderRadius: 7, cursor: "pointer", border: "none",
                background: "rgba(255,255,255,0.04)", outline: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600,
              }}>
                <RotateCcw size={10} /> Restaurar padrao
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <InputField
              label="Investimento inicial"
              value={inputs.investimentoInicial}
              min={5000} max={300000} step={1000}
              prefix="R$"
              onChange={setField("investimentoInicial")}
              hint="Base para calcular o ROI dos 3 cenarios"
            />
            <InputField
              label="Custo fixo mensal"
              value={inputs.custoFixo}
              min={500} max={50000} step={500}
              prefix="R$"
              onChange={setField("custoFixo")}
              hint="Aluguel + salarios + despesas fixas recorrentes"
            />
            <InputField
              label="Ticket medio (cenario realista)"
              value={inputs.ticketMedio}
              min={50} max={5000} step={10}
              prefix="R$"
              onChange={setField("ticketMedio")}
              hint="Pessimista usa 71% · Otimista usa 135% desse valor"
            />
            <InputField
              label="Clientes no 1o mes"
              value={inputs.clientesInicio}
              min={1} max={500} step={1}
              suffix="clientes"
              onChange={setField("clientesInicio")}
              hint="Pessimista usa 64% · Otimista usa 136% desse valor"
            />
          </div>

          {/* Live preview strip */}
          <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,149,0,0.1)" }}>
            {(["pessimista","realista","otimista"] as ScenarioKey[]).map(k => {
              const sc = scenarios[k];
              const l12 = sc.months.reduce((sum, m) => sum + m.lucro, 0);
              return (
                <div key={k} style={{
                  flex: 1, background: sc.bg, border: `1px solid ${sc.color}20`,
                  borderRadius: 8, padding: "10px 12px",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: sc.color, marginBottom: 4 }}>
                    {sc.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.85)",
                    fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
                    {fmtK(l12)}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                    lucro 12m · ROI {sc.roi12m}% · breakeven mes {sc.breakevenMes}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── KPI strip ────────────────────────────────────────────────────────────────────── */}
      <div className="flex gap-3 flex-wrap">
        <MetricPill label="TICKET MEDIO" value={fmt(s.ticketMedio)} sub={`${s.clientesMes} clientes/mes`} color={s.color} />
        <MetricPill label="RECEITA 12 MESES" value={fmtK(receita12m)} sub="projecao acumulada" />
        <MetricPill label="LUCRO 12 MESES" value={fmtK(lucro12m)}
          sub={`margem liquida ${s.margemLiquida}%`}
          color={lucro12m > 0 ? "#10b981" : "#ef4444"} />
        <MetricPill label="BREAKEVEN" value={`Mes ${s.breakevenMes}`} sub="ponto de equilibrio" color={s.color} />
        <MetricPill label="ROI 12 MESES" value={`${s.roi12m > 0 ? "+" : ""}${s.roi12m}%`}
          sub="retorno sobre investimento"
          color={s.roi12m > 50 ? "#10b981" : s.roi12m > 0 ? "#f59e0b" : "#ef4444"} />
      </div>

      {/* ── Projection chart ───────────────────────────────────────────────────── */}
      <div style={{ background: "var(--card)", border: `1px solid ${s.color}20`, borderRadius: 12, padding: "20px 24px" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
              EVOLUCAO DO LUCRO — 12 MESES
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              Crescimento mensal de {s.crescimentoMensal}% na base de clientes
            </div>
          </div>
          <div className="flex items-center gap-2">
            {s.roi12m > 0
              ? <TrendingUp size={14} style={{ color: "#10b981" }} />
              : <TrendingDown size={14} style={{ color: "#ef4444" }} />}
            <span style={{ fontSize: 13, fontWeight: 700, color: s.roi12m > 0 ? "#10b981" : "#ef4444" }}>
              ROI {s.roi12m}%
            </span>
          </div>
        </div>
        <MiniSparkline months={s.months} color={s.color} />
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div style={{ width: 20, height: 2, background: s.color, borderRadius: 1 }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Lucro mensal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 20, height: 1, borderTop: "1px dashed rgba(255,255,255,0.15)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Ponto de equilibrio</span>
          </div>
        </div>
      </div>

      {/* ── Month table ────────────────────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, overflow: "hidden" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
              PLANILHA MENSAL — CENARIO {s.label.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-2">
          <MonthTable scenario={s} />
        </div>
      </div>

      {/* ── Investment plan ────────────────────────────────────────────────────── */}
      <InvestmentSection investimentoInicial={inputs.investimentoInicial} />

      {/* ── Risk alerts ────────────────────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 12, padding: "16px 20px" }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={14} style={{ color: "#f59e0b", marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>ALERTAS FINANCEIROS</div>
            <div className="space-y-2">
              {[
                "Reserva de 3 meses de custo fixo e obrigatoria antes de qualquer lancamento",
                "Crescimento de clientes acima de 10%/mes exige contratacao de apoio operacional",
                `Ticket medio abaixo de R$${Math.round(inputs.custoFixo / (inputs.clientesInicio * 0.65))} inviabiliza o modelo no cenario pessimista atual`,
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f59e0b", marginTop: 4, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{alert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
