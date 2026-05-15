import { useState } from "react";
import { Flag, RefreshCw, AlertTriangle, Send, Zap, Activity, Clock, Filter } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes hi-appear { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes hi-bar    { from{transform:scaleY(0)} to{transform:scaleY(1)} }
@keyframes hi-blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

type Range = "30D" | "3M" | "6M" | "1A";

interface Week {
  label: string;  // month label shown at first week of month, else ""
  m: number; a: number; mr: number; e: number; v: number;
}
// 26 weeks oldest→newest (18 Nov 2025 → 14 Mai 2026)
const WEEKS: Week[] = [
  { label: "",    m:0, a:0, mr:0, e:0, v:0 },
  { label: "",    m:0, a:0, mr:0, e:0, v:0 },
  { label: "",    m:1, a:0, mr:0, e:0, v:0 },
  { label: "",    m:0, a:0, mr:1, e:0, v:0 },
  { label: "Dez", m:1, a:0, mr:0, e:0, v:1 },
  { label: "",    m:0, a:1, mr:1, e:0, v:0 },
  { label: "",    m:1, a:0, mr:0, e:1, v:0 },
  { label: "",    m:0, a:0, mr:0, e:0, v:0 },
  { label: "Jan", m:2, a:2, mr:2, e:0, v:2 },
  { label: "",    m:3, a:1, mr:2, e:1, v:1 },
  { label: "",    m:1, a:2, mr:1, e:1, v:2 },
  { label: "",    m:2, a:1, mr:0, e:2, v:0 },
  { label: "Fev", m:1, a:0, mr:2, e:0, v:1 },
  { label: "",    m:0, a:2, mr:0, e:1, v:0 },
  { label: "",    m:2, a:0, mr:1, e:0, v:1 },
  { label: "",    m:1, a:1, mr:0, e:1, v:0 },
  { label: "Mar", m:0, a:1, mr:2, e:0, v:2 },
  { label: "",    m:3, a:0, mr:0, e:1, v:0 },
  { label: "",    m:1, a:2, mr:1, e:0, v:1 },
  { label: "",    m:2, a:1, mr:0, e:2, v:0 },
  { label: "Abr", m:0, a:1, mr:1, e:1, v:2 },
  { label: "",    m:1, a:2, mr:0, e:3, v:1 },
  { label: "",    m:2, a:0, mr:2, e:1, v:0 },
  { label: "",    m:1, a:1, mr:1, e:2, v:1 },
  { label: "Mai", m:2, a:2, mr:0, e:1, v:1 },
  { label: "",    m:3, a:1, mr:1, e:2, v:2 },
];

const GROUP_COLORS = { m: "#3b82f6", a: "#ec4899", mr: "#8b5cf6", e: "#10b981", v: "#ff9500" };
const GROUP_KEYS   = ["m", "a", "mr", "e", "v"] as const;

interface Event {
  date: string; daysAgo: number;
  time: string;
  type: "milestone" | "update" | "alert" | "export" | "insight";
  module: string; group: string; color: string;
  desc: string;
}
const EVENTS: Event[] = [
  { date: "14 Mai 2026", daysAgo: 0,   time: "09:42", type: "milestone", module: "Diagnóstico Q2",    group: "Veredito",   color: "#ff9500", desc: "Diagnóstico Q2 concluído — todos os 14 módulos avaliados" },
  { date: "10 Mai 2026", daysAgo: 4,   time: "14:18", type: "export",    module: "Exportação",        group: "Veredito",   color: "#ff9500", desc: "PDF enviado para board@empresa.com (6 módulos)" },
  { date: "07 Mai 2026", daysAgo: 7,   time: "11:33", type: "alert",     module: "OKR",               group: "Estratégia", color: "#10b981", desc: "KR 'Crescimento de receita' em risco crítico — 22% abaixo da meta" },
  { date: "03 Mai 2026", daysAgo: 11,  time: "16:52", type: "update",    module: "Comparativo",       group: "Veredito",   color: "#ff9500", desc: "Novo snapshot registrado: Jan 2026 → Mai 2026 (+11 pts)" },
  { date: "28 Abr 2026", daysAgo: 16,  time: "10:05", type: "insight",   module: "Audiência",         group: "Audiência",  color: "#ec4899", desc: "Padrão detectado: 68% da audiência migrou para consumo mobile" },
  { date: "22 Abr 2026", daysAgo: 22,  time: "08:30", type: "update",    module: "Business Plan",     group: "Estratégia", color: "#10b981", desc: "Plano revisado com cenários Q3 — projeção +19% receita" },
  { date: "15 Abr 2026", daysAgo: 29,  time: "15:44", type: "alert",     module: "Benchmarking",      group: "Mercado",    color: "#3b82f6", desc: "Concorrente lançou produto similar — vantagem competitiva reduzida" },
  { date: "08 Abr 2026", daysAgo: 36,  time: "09:22", type: "export",    module: "Exportação",        group: "Veredito",   color: "#ff9500", desc: "XLSX semanal enviado automaticamente para analista@empresa.com" },
  { date: "31 Mar 2026", daysAgo: 44,  time: "11:00", type: "milestone", module: "Score Final",       group: "Veredito",   color: "#ff9500", desc: "Relatório trimestral Q1 gerado — score consolidado: 57 pts" },
  { date: "24 Mar 2026", daysAgo: 51,  time: "14:20", type: "insight",   module: "Cenários",          group: "Estratégia", color: "#10b981", desc: "Cenário Otimista ganha probabilidade após dados de mercado" },
  { date: "10 Mar 2026", daysAgo: 65,  time: "10:45", type: "update",    module: "Pulso do Mercado",  group: "Mercado",    color: "#3b82f6", desc: "Atualização semanal — índice de confiança do setor subiu 4 pts" },
  { date: "20 Jan 2026", daysAgo: 114, time: "10:15", type: "milestone", module: "Diagnóstico Inicial", group: "Veredito", color: "#ff9500", desc: "Diagnóstico Inicial concluído — baseline estabelecido em 57 pts" },
  { date: "15 Jan 2026", daysAgo: 119, time: "14:30", type: "update",    module: "Todos os módulos",  group: "Mercado",    color: "#3b82f6", desc: "14 módulos calibrados com dados históricos de referência" },
];

const DAYS_BY_RANGE: Record<Range, number> = { "30D": 30, "3M": 91, "6M": 183, "1A": 365 };

interface ModuleFreshness { name: string; group: string; color: string; days: number }
const MODULE_FRESHNESS: ModuleFreshness[] = [
  { name: "OKR",              group: "Estratégia", color: "#10b981", days: 1  },
  { name: "Pulso do Mercado", group: "Mercado",    color: "#3b82f6", days: 2  },
  { name: "Audiência",        group: "Audiência",  color: "#ec4899", days: 3  },
  { name: "Cenários",         group: "Estratégia", color: "#10b981", days: 4  },
  { name: "Benchmarking",     group: "Mercado",    color: "#3b82f6", days: 5  },
  { name: "Business Plan",    group: "Estratégia", color: "#10b981", days: 6  },
  { name: "Concorrentes",     group: "Mercado",    color: "#3b82f6", days: 7  },
  { name: "DNA da Marca",     group: "Marca",      color: "#8b5cf6", days: 8  },
  { name: "Dores",            group: "Audiência",  color: "#ec4899", days: 9  },
  { name: "Canais",           group: "Audiência",  color: "#ec4899", days: 11 },
  { name: "Tendências",       group: "Mercado",    color: "#3b82f6", days: 12 },
  { name: "Sentimento",       group: "Mercado",    color: "#3b82f6", days: 14 },
  { name: "Precificação",     group: "Marca",      color: "#8b5cf6", days: 18 },
  { name: "Compliance",       group: "Estratégia", color: "#10b981", days: 22 },
];

// ─── Activity Bar Chart ───────────────────────────────────────────────────────

function ActivityChart() {
  const CW = 560, CH = 160, PL = 8, PR = 8, PT = 8, PB = 28;
  const innerW = CW - PL - PR;
  const innerH = CH - PT - PB;
  const slotW  = innerW / 26;
  const barW   = slotW * 0.72;
  const barGap = (slotW - barW) / 2;
  const maxTotal = Math.max(...WEEKS.map(w => w.m + w.a + w.mr + w.e + w.v), 1);

  return (
    <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ display: "block" }}>
      {/* Y gridlines */}
      {[0.25, 0.5, 0.75, 1].map(frac => {
        const y = PT + innerH * (1 - frac);
        return <line key={frac} x1={PL} y1={y} x2={CW - PR} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.7} />;
      })}
      {/* Bottom baseline */}
      <line x1={PL} y1={PT + innerH} x2={CW - PR} y2={PT + innerH} stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />

      {/* Bars */}
      {WEEKS.map((w, i) => {
        const total  = w.m + w.a + w.mr + w.e + w.v;
        const x      = PL + barGap + i * slotW;
        const bottom = PT + innerH;
        let cumH     = 0;
        return (
          <g key={i} style={{ transformOrigin: `${x + barW / 2}px ${bottom}px`, animation: `hi-bar 0.5s ease ${i * 0.018}s both` }}>
            {total === 0 && (
              <rect x={x} y={bottom - 2} width={barW} height={2} rx={1} fill="rgba(255,255,255,0.04)" />
            )}
            {GROUP_KEYS.map(k => {
              const count = w[k];
              if (!count) return null;
              const h   = (count / maxTotal) * innerH;
              const y   = bottom - cumH - h;
              const col = GROUP_COLORS[k];
              cumH += h;
              return (
                <rect key={k} x={x} y={y} width={barW} height={h}
                  rx={0} fill={col} opacity={0.75} />
              );
            })}
            {/* Rounded top cap on last segment */}
            {total > 0 && (() => {
              const h    = (WEEKS[i][GROUP_KEYS.slice().reverse().find(k => WEEKS[i][k] > 0)!] / maxTotal) * innerH;
              const topY = bottom - (total / maxTotal) * innerH;
              const col  = GROUP_COLORS[GROUP_KEYS.slice().reverse().find(k => WEEKS[i][k] > 0)!];
              return <rect x={x} y={topY} width={barW} height={Math.min(h, 4)} rx={1.5} fill={col} opacity={0.9} />;
            })()}
          </g>
        );
      })}

      {/* Month labels */}
      {WEEKS.map((w, i) => {
        if (!w.label) return null;
        const x = PL + barGap + i * slotW + barW / 2;
        return (
          <text key={i} x={x} y={CH - 6} textAnchor="middle"
            fill="rgba(255,255,255,0.22)" fontSize={7.5} fontWeight={600} letterSpacing={0.5}>
            {w.label}
          </text>
        );
      })}

      {/* "Hoje" marker on last bar */}
      <line x1={PL + barGap + 25 * slotW + barW / 2} y1={PT} x2={PL + barGap + 25 * slotW + barW / 2} y2={PT + innerH}
        stroke="rgba(255,149,0,0.35)" strokeWidth={1} strokeDasharray="3 3" />
      <text x={PL + barGap + 25 * slotW + barW / 2} y={PT - 1} textAnchor="middle"
        fill="rgba(255,149,0,0.6)" fontSize={6.5} fontWeight={800}>HOJE</text>
    </svg>
  );
}

// ─── Event Type Meta ──────────────────────────────────────────────────────────

const TYPE_META = {
  milestone: { label: "MARCO",     Icon: Flag,          color: "#ff9500" },
  update:    { label: "ATUALIZ.",  Icon: RefreshCw,     color: "#3b82f6" },
  alert:     { label: "ALERTA",    Icon: AlertTriangle,  color: "#ef4444" },
  export:    { label: "EXPORT",    Icon: Send,           color: "#10b981" },
  insight:   { label: "INSIGHT",   Icon: Zap,           color: "#8b5cf6" },
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

function freshnessColor(days: number) {
  if (days <= 7)  return "#10b981";
  if (days <= 21) return "#ff9500";
  return "#ef4444";
}
function freshnessLabel(days: number) {
  if (days <= 7)  return "Recente";
  if (days <= 21) return "Moderado";
  return "Desatualizado";
}

export function HistoricoHero() {
  const [range, setRange] = useState<Range>("3M");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const maxDays    = DAYS_BY_RANGE[range];
  const filtered   = EVENTS.filter(e =>
    e.daysAgo <= maxDays && (typeFilter === null || e.type === typeFilter)
  );

  const totalEvents  = EVENTS.filter(e => e.daysAgo <= maxDays).length;
  const totalAlerts  = EVENTS.filter(e => e.daysAgo <= maxDays && e.type === "alert").length;
  const staleModules = MODULE_FRESHNESS.filter(m => m.days > 21).length;

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "22px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: 60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>HISTÓRICO · GRUPO VEREDITO</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>Cronologia de Inteligência</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", maxWidth: 400, lineHeight: 1.6 }}>
              Registro completo de todas as atualizações, alertas, marcos e insights gerados pela plataforma.
            </div>
          </div>

          {/* Stats + range */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
            {/* Range tabs */}
            <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["30D", "3M", "6M", "1A"] as Range[]).map(r => (
                <div key={r} onClick={() => setRange(r)} style={{
                  padding: "5px 14px", borderRadius: 7, cursor: "pointer", fontSize: 10, fontWeight: 700,
                  color: range === r ? "#ff9500" : "rgba(255,255,255,0.3)",
                  background: range === r ? "rgba(255,149,0,0.10)" : "transparent",
                  border: range === r ? "1px solid rgba(255,149,0,0.22)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}>{r}</div>
              ))}
            </div>
            {/* Quick stats */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { value: totalEvents,  label: "Eventos",      color: "#ff9500", Icon: Activity },
                { value: totalAlerts,  label: "Alertas",      color: "#ef4444", Icon: AlertTriangle },
                { value: staleModules, label: "Desatualizados", color: "#ef4444", Icon: Clock },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "10px 14px", borderRadius: 11,
                  background: `${s.color}08`, border: `1px solid ${s.color}1a`,
                  display: "flex", flexDirection: "column", gap: 3, minWidth: 80,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <s.Icon size={10} style={{ color: s.color }} strokeWidth={2} />
                    <span style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{s.value}</span>
                  </div>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity Chart + Module Freshness ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 210px", gap: 14 }}>

          {/* Activity bar chart */}
          <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.2)" }}>ATIVIDADE SEMANAL · 6 MESES</div>
              <div style={{ display: "flex", gap: 12 }}>
                {(["m","a","mr","e","v"] as const).map((k, i) => {
                  const names = ["Mercado","Audiência","Marca","Estratégia","Veredito"];
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: GROUP_COLORS[k] }} />
                      <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.25)" }}>{names[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <ActivityChart />
          </div>

          {/* Module freshness */}
          <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.2)" }}>ATUALIDADE DOS MÓDULOS</div>
            </div>
            <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
              {MODULE_FRESHNESS.map((m, i) => {
                const fc = freshnessColor(m.days);
                const pct = Math.max(5, 100 - (m.days / 25) * 100);
                return (
                  <div key={m.name} style={{ animation: `hi-appear 0.3s ease ${i * 0.04}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)" }}>{m.name}</span>
                      </div>
                      <span style={{ fontSize: 8.5, fontWeight: 700, color: fc, fontFamily: "JetBrains Mono, monospace" }}>
                        {m.days}d
                      </span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: fc, opacity: 0.7 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 10 }}>
              {[["#10b981","≤ 7 dias"],["#ff9500","8–21 dias"],["#ef4444","> 21 dias"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c as string }} />
                  <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.22)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Event Log ──────────────────────────────────────────────────────── */}
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Header */}
          <div style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Activity size={11} style={{ color: "rgba(255,255,255,0.25)" }} strokeWidth={2} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.25)" }}>LOG DE EVENTOS</span>
            <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.18)" }}>— {range}</span>
            {/* Type filter pills */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
              <Filter size={9} style={{ color: "rgba(255,255,255,0.2)" }} strokeWidth={2} />
              {Object.entries(TYPE_META).map(([type, meta]) => {
                const active = typeFilter === type;
                return (
                  <div key={type}
                    onClick={() => setTypeFilter(active ? null : type)}
                    style={{
                      padding: "3px 9px", borderRadius: 5, cursor: "pointer", fontSize: 8.5, fontWeight: 700,
                      color: active ? meta.color : "rgba(255,255,255,0.25)",
                      background: active ? `${meta.color}12` : "transparent",
                      border: `1px solid ${active ? `${meta.color}30` : "transparent"}`,
                      transition: "all 0.15s ease",
                    }}>{meta.label}</div>
                );
              })}
            </div>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "110px 80px 1fr 120px",
            gap: 8, padding: "7px 20px",
            background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            {["DATA · HORA", "TIPO", "DESCRIÇÃO", "MÓDULO"].map(h => (
              <span key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.15)" }}>{h}</span>
            ))}
          </div>

          {/* Events */}
          {filtered.length === 0 && (
            <div style={{ padding: "28px 20px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
              Nenhum evento no período selecionado.
            </div>
          )}
          {filtered.map((ev, i) => {
            const meta = TYPE_META[ev.type];
            const isToday = ev.daysAgo === 0;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "110px 80px 1fr 120px",
                gap: 8, padding: "13px 20px", alignItems: "center",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                animation: `hi-appear 0.3s ease ${i * 0.04}s both`,
                borderLeft: `3px solid ${isToday ? "#ff9500" : "transparent"}`,
              }}>
                {/* Date + time */}
                <div>
                  <div style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: isToday ? "rgba(255,149,0,0.8)" : "rgba(255,255,255,0.4)", fontWeight: isToday ? 700 : 400 }}>
                    {ev.date}
                  </div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>
                    {ev.time}
                    {isToday && <span style={{ marginLeft: 6, animation: "hi-blink 1.4s ease-in-out infinite", color: "#ff9500" }}>●</span>}
                  </div>
                </div>

                {/* Type badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 8px", borderRadius: 5,
                    background: `${meta.color}12`, border: `1px solid ${meta.color}28`,
                  }}>
                    <meta.Icon size={9} style={{ color: meta.color }} strokeWidth={2} />
                    <span style={{ fontSize: 7.5, fontWeight: 800, color: meta.color, letterSpacing: 0.4 }}>{meta.label}</span>
                  </div>
                </div>

                {/* Description */}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{ev.desc}</span>

                {/* Module + group */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{ev.module}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
