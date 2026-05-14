import { useState } from "react";
import {
  BarChart3, TrendingUp, TrendingDown,
  Target, Award, AlertTriangle, ChevronRight, Zap,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes bm-appear { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
@keyframes bm-pulse  { 0%,100%{opacity:0.9;transform:scale(1)} 50%{opacity:0.2;transform:scale(1.5)} }
@keyframes bm-ping   { 0%,100%{r:12;opacity:0.18} 50%{r:20;opacity:0.05} }
@keyframes bm-bar    { from{width:0} to{width:var(--w)} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTORS = [
  "Estética & Bem-estar",
  "Saúde & Clínicas",
  "Educação Premium",
  "Consultoria",
  "Serviços B2B",
];

// X = NPS (−100..+100), Y = LTV/CAC (0..10)
const COMPETITORS = [
  { name: "Player E", nps:  55,  ltvcac: 7.8, r: 8,  color: "#10b981" },
  { name: "Player C", nps:  18,  ltvcac: 6.5, r: 6,  color: "#10b981" },
  { name: "Player A", nps:  32,  ltvcac: 3.8, r: 7,  color: "#f59e0b" },
  { name: "Player B", nps: -18,  ltvcac: 2.2, r: 5,  color: "#f43f5e" },
  { name: "Player D", nps: -42,  ltvcac: 4.1, r: 6,  color: "#6366f1" },
];

interface Metric {
  id: string; label: string; unit: string;
  p25: number; median: number; p75: number; top10: number;
  lowerIsBetter: boolean; insight: string;
}

const METRICS: Metric[] = [
  { id: "cac",    label: "CAC",          unit: "R$", p25: 280, median: 340, p75: 420, top10: 190, lowerIsBetter: true,  insight: "Top 10% gasta 44% menos que a mediana — eficiência de aquisição como vantagem" },
  { id: "ltvcac", label: "LTV / CAC",    unit: "×",  p25: 2.1, median: 3.2, p75: 4.8, top10: 7.4, lowerIsBetter: false, insight: "Líderes têm 2.3× mais retorno por cliente — resultado de retenção e ticket" },
  { id: "churn",  label: "Churn Mensal", unit: "%",  p25: 6.2, median: 4.1, p75: 2.8, top10: 1.2, lowerIsBetter: true,  insight: "Top 10% retém 5× mais — protocolo pós-atendimento é o diferenciador crítico" },
  { id: "nps",    label: "NPS",          unit: "",   p25: 18,  median: 32,  p75: 51,  top10: 72,  lowerIsBetter: false, insight: "Acima de 50 entra no cluster de indicação orgânica — crescimento sem CAC" },
  { id: "ticket", label: "Ticket Médio", unit: "R$", p25: 620, median: 890, p75: 1400,top10: 2200,lowerIsBetter: false, insight: "148% de gap entre mediana e top — posicionamento premium é viável no setor" },
  { id: "margem", label: "Margem Bruta", unit: "%",  p25: 42,  median: 58,  p75: 68,  top10: 78,  lowerIsBetter: false, insight: "Margem top exige ticket premium + eficiência operacional combinados" },
];

const RANKING = [
  { rank: 1, name: "Player E",  nps:  55,  ltvcac: 7.8, churn: 1.4, score: 94, color: "#10b981", isYou: false },
  { rank: 2, name: "Player C",  nps:  18,  ltvcac: 6.5, churn: 2.1, score: 78, color: "#10b981", isYou: false },
  { rank: 3, name: "Você",      nps:  null,ltvcac: null,churn: null, score: null,color: "#ff9500",isYou: true  },
  { rank: 4, name: "Player A",  nps:  32,  ltvcac: 3.8, churn: 3.8, score: 62, color: "#f59e0b", isYou: false },
  { rank: 5, name: "Player B",  nps: -18,  ltvcac: 2.2, churn: 5.5, score: 41, color: "#f43f5e", isYou: false },
  { rank: 6, name: "Player D",  nps: -42,  ltvcac: 4.1, churn: 6.2, score: 38, color: "#6366f1", isYou: false },
];

// ─── Competitive Positioning Map ──────────────────────────────────────────────

function CompetitorMap() {
  const W = 264, H = 224, PAD = 28;
  const plotW = W - 2 * PAD, plotH = H - 2 * PAD;

  const mx = (nps: number) => PAD + ((nps + 100) / 200) * plotW;
  const my = (ltv: number) => PAD + plotH - (ltv / 10) * plotH;

  const midX = mx(0), midY = my(5);

  // Your projected position
  const youX = mx(-5), youY = my(3.2);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      {/* Faint grid */}
      {[1, 2, 3].map(i => (
        <line key={`h${i}`} x1={PAD} y1={PAD + (plotH / 4) * i} x2={W - PAD} y2={PAD + (plotH / 4) * i}
          stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
      ))}
      {[1, 2, 3].map(i => (
        <line key={`v${i}`} x1={PAD + (plotW / 4) * i} y1={PAD} x2={PAD + (plotW / 4) * i} y2={H - PAD}
          stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
      ))}

      {/* Quadrant fills */}
      <rect x={midX}  y={PAD}   width={W - PAD - midX} height={midY - PAD}     fill="rgba(16,185,129,0.04)" />
      <rect x={PAD}   y={PAD}   width={midX - PAD}      height={midY - PAD}     fill="rgba(99,102,241,0.03)" />
      <rect x={PAD}   y={midY}  width={midX - PAD}      height={H - PAD - midY} fill="rgba(244,63,94,0.03)"  />
      <rect x={midX}  y={midY}  width={W - PAD - midX}  height={H - PAD - midY} fill="rgba(255,149,0,0.03)"  />

      {/* Quadrant dividers */}
      <line x1={midX} y1={PAD} x2={midX} y2={H - PAD}
        stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1={PAD} y1={midY} x2={W - PAD} y2={midY}
        stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Quadrant labels */}
      <text x={W - PAD - 4} y={PAD + 9}  textAnchor="end"   fill="rgba(16,185,129,0.45)" fontSize={7} fontWeight={700}>LÍDER</text>
      <text x={PAD + 4}     y={PAD + 9}  textAnchor="start" fill="rgba(99,102,241,0.45)" fontSize={7} fontWeight={700}>DESAFIANTE</text>
      <text x={PAD + 4}     y={H - PAD - 3} textAnchor="start" fill="rgba(244,63,94,0.45)" fontSize={7} fontWeight={700}>EM RISCO</text>
      <text x={W - PAD - 4} y={H - PAD - 3} textAnchor="end"   fill="rgba(255,149,0,0.45)"  fontSize={7} fontWeight={700}>SOBREVIVENTE</text>

      {/* Axis labels */}
      <text x={W / 2} y={H - 6} textAnchor="middle"
        fill="rgba(255,255,255,0.12)" fontSize={6.5} fontFamily="sans-serif">
        ← Satisfação do Cliente (NPS) →
      </text>

      {/* Competitor dots */}
      {COMPETITORS.map((c, i) => {
        const x = mx(c.nps), y = my(c.ltvcac);
        return (
          <g key={i} style={{ animation: `bm-appear 0.4s ease ${i * 0.08}s both` }}>
            <circle cx={x} cy={y} r={c.r + 4} fill={c.color} opacity={0.07} />
            <circle cx={x} cy={y} r={c.r} fill={c.color} opacity={0.55} />
            <text x={x} y={y - c.r - 3} textAnchor="middle"
              fill={c.color} fontSize={6.5} fontWeight={600} opacity={0.75}>
              {c.name}
            </text>
          </g>
        );
      })}

      {/* Your position — pulsing rings */}
      <circle cx={youX} cy={youY} r={14} fill="rgba(255,149,0,0.12)" opacity={0.2}>
        <animate attributeName="r"       values="12;22;12" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx={youX} cy={youY} r={6} fill="rgba(255,149,0,0.25)"
        stroke="#ff9500" strokeWidth="1.5">
        <animate attributeName="r" values="5.5;7;5.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <text x={youX + 9} y={youY - 5} fill="#ff9500"  fontSize={7.5} fontWeight={800}>VOCÊ</text>
      <text x={youX + 9} y={youY + 5} fill="rgba(255,149,0,0.45)" fontSize={6.5}>projetado</text>

      {/* Y-axis label */}
      <text x={8} y={H / 2} textAnchor="middle"
        fill="rgba(255,255,255,0.12)" fontSize={6.5} fontFamily="sans-serif"
        transform={`rotate(-90 8 ${H / 2})`}>
        ← Eficiência (LTV/CAC) →
      </text>
    </svg>
  );
}

// ─── Metric Benchmark Card ────────────────────────────────────────────────────

function BenchmarkCard({ m }: { m: Metric }) {
  const fmt = (v: number) => {
    if (m.unit === "R$") return v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v}`;
    if (m.unit === "×")  return `${v}×`;
    if (m.unit === "%")  return `${v}%`;
    return String(v);
  };

  // Track: P25=20%, Median=46%, P75=70%, Top10=90% (visual positions, fixed)
  const zones = m.lowerIsBetter
    ? [
        { left: "0%",  w: "20%", bg: "rgba(16,185,129,0.25)"  }, // best (top10)
        { left: "20%", w: "26%", bg: "rgba(255,149,0,0.18)"   }, // p75
        { left: "46%", w: "24%", bg: "rgba(255,149,0,0.22)"   }, // median
        { left: "70%", w: "30%", bg: "rgba(244,63,94,0.20)"   }, // p25 worst
      ]
    : [
        { left: "0%",  w: "20%", bg: "rgba(244,63,94,0.18)"   }, // p25 worst
        { left: "20%", w: "26%", bg: "rgba(255,149,0,0.18)"   }, // median
        { left: "46%", w: "24%", bg: "rgba(255,149,0,0.22)"   }, // p75
        { left: "70%", w: "30%", bg: "rgba(16,185,129,0.25)"  }, // top10 best
      ];

  const ticks = [20, 46, 70, 90];
  const labels = m.lowerIsBetter
    ? [
        { pos: "0%",   label: "Top 10%", val: fmt(m.top10)  },
        { pos: "20%",  label: "P75",     val: fmt(m.p75)    },
        { pos: "46%",  label: "Mediana", val: fmt(m.median) },
        { pos: "70%",  label: "P25",     val: fmt(m.p25)    },
      ]
    : [
        { pos: "0%",   label: "P25",     val: fmt(m.p25)    },
        { pos: "20%",  label: "Mediana", val: fmt(m.median) },
        { pos: "46%",  label: "P75",     val: fmt(m.p75)    },
        { pos: "70%",  label: "Top 10%", val: fmt(m.top10)  },
      ];

  return (
    <div style={{
      padding: "16px 16px 14px", borderRadius: 13,
      background: "rgba(255,255,255,0.025)",
      backdropFilter: "blur(12px) saturate(180%)",
      WebkitBackdropFilter: "blur(12px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{m.label}</span>
        <span style={{
          fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.25)", letterSpacing: 0.5,
        }}>
          CALIBRAR
        </span>
      </div>

      {/* Percentile track */}
      <div style={{ position: "relative", height: 7, borderRadius: 4, overflow: "hidden", marginBottom: 2 }}>
        {zones.map((z, i) => (
          <div key={i} style={{
            position: "absolute", left: z.left, width: z.w, height: "100%",
            background: z.bg,
          }} />
        ))}
        {ticks.map(t => (
          <div key={t} style={{
            position: "absolute", left: `${t}%`, top: 0,
            width: 1, height: "100%",
            background: "rgba(255,255,255,0.18)",
            transform: "translateX(-0.5px)",
          }} />
        ))}
      </div>

      {/* Track labels */}
      <div style={{ position: "relative", height: 28, marginBottom: 10 }}>
        {labels.map((l, i) => (
          <div key={i} style={{
            position: "absolute", left: l.pos, transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
          }}>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap" }}>{l.label}</span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>{l.val}</span>
          </div>
        ))}
        {/* Top 10 label at far right */}
        <div style={{ position: "absolute", right: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)" }}>{m.lowerIsBetter ? "P25" : "Top 10%"}</span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: m.lowerIsBetter ? "rgba(244,63,94,0.7)" : "rgba(16,185,129,0.7)", fontFamily: "JetBrains Mono, monospace" }}>
            {m.lowerIsBetter ? fmt(m.p25) : fmt(m.top10)}
          </span>
        </div>
      </div>

      {/* Insight */}
      <div style={{
        fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8,
      }}>
        {m.insight}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BenchmarkingHero() {
  const [sector, setSector] = useState(0);

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          position: "relative", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "center",
        }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: -60, right: 180, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Left */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BarChart3 size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>
                  BENCHMARKING · GRUPO MERCADO
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>
                  Posicionamento Setorial
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, maxWidth: 480, margin: "0 0 20px" }}>
              Veja exatamente onde você está no setor — P25, mediana, P75 e top 10% —
              em cada métrica que determina competitividade e crescimento sustentável.
            </p>

            {/* Sector selector */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
                SETOR DE REFERÊNCIA
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SECTORS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSector(i)}
                    style={{
                      padding: "5px 12px", borderRadius: 7, fontSize: 11, cursor: "pointer",
                      fontWeight: sector === i ? 700 : 400,
                      background: sector === i ? "rgba(255,149,0,0.10)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${sector === i ? "rgba(255,149,0,0.32)" : "rgba(255,255,255,0.07)"}`,
                      color: sector === i ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.35)",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Competitive Map */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.6, color: "rgba(255,255,255,0.18)", alignSelf: "flex-start" }}>
              MAPA COMPETITIVO
            </div>
            <div style={{
              borderRadius: 12,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: 4,
            }}>
              <CompetitorMap />
            </div>
          </div>
        </div>

        {/* ── 6 Metric Cards ─────────────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
            MÉTRICAS SETORIAIS — CALIBRE OS SEUS NÚMEROS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {METRICS.map((m, i) => (
              <div key={m.id} style={{ animation: `bm-appear 0.35s ease ${i * 0.06}s both` }}>
                <BenchmarkCard m={m} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Competitive Ranking ────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 14, padding: "18px 20px",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Target size={12} style={{ color: "rgba(255,149,0,0.6)" }} />
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.24)" }}>
              RANKING COMPETITIVO DO SETOR
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
              {SECTORS[sector]}
            </span>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "36px 1fr 80px 80px 80px 100px",
            gap: 8, padding: "0 8px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {["#", "PLAYER", "NPS", "LTV/CAC", "CHURN", "SCORE"].map(h => (
              <span key={h} style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {RANKING.map((row, i) => {
              const medalColor = row.rank === 1 ? "#f59e0b" : row.rank === 2 ? "rgba(255,255,255,0.5)" : row.rank === 3 ? "#cd7c39" : "rgba(255,255,255,0.18)";
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "36px 1fr 80px 80px 80px 100px",
                  gap: 8, padding: "11px 8px",
                  background: row.isYou ? "rgba(255,149,0,0.05)" : "transparent",
                  border: `1px solid ${row.isYou ? "rgba(255,149,0,0.15)" : "transparent"}`,
                  borderRadius: row.isYou ? 8 : 0,
                  borderBottom: !row.isYou && i < RANKING.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                  alignItems: "center",
                  animation: `bm-appear 0.3s ease ${i * 0.05}s both`,
                }}>
                  {/* Rank */}
                  <span style={{ fontSize: 13, fontWeight: 900, color: medalColor, fontFamily: "JetBrains Mono, monospace" }}>
                    {row.rank}
                  </span>

                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%", background: row.color, flexShrink: 0,
                      boxShadow: row.isYou ? `0 0 8px ${row.color}` : undefined,
                    }} />
                    <span style={{
                      fontSize: 12, fontWeight: row.isYou ? 700 : 500,
                      color: row.isYou ? "rgba(255,149,0,0.92)" : "rgba(255,255,255,0.62)",
                    }}>
                      {row.name}
                      {row.isYou && (
                        <span style={{ marginLeft: 6, fontSize: 8, fontWeight: 800, color: "rgba(255,149,0,0.5)", letterSpacing: 0.5 }}>
                          · AGUARDANDO DADOS
                        </span>
                      )}
                    </span>
                  </div>

                  {/* NPS */}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: row.nps === null ? "rgba(255,255,255,0.18)" : row.nps >= 32 ? "#10b981" : row.nps >= 0 ? "#ff9500" : "#f43f5e",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {row.nps === null ? "—" : `${row.nps > 0 ? "+" : ""}${row.nps}`}
                  </span>

                  {/* LTV/CAC */}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: row.ltvcac === null ? "rgba(255,255,255,0.18)" : row.ltvcac >= 4.8 ? "#10b981" : row.ltvcac >= 3.2 ? "#ff9500" : "#f43f5e",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {row.ltvcac === null ? "—" : `${row.ltvcac}×`}
                  </span>

                  {/* Churn */}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: row.churn === null ? "rgba(255,255,255,0.18)" : row.churn <= 2.8 ? "#10b981" : row.churn <= 4.1 ? "#ff9500" : "#f43f5e",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {row.churn === null ? "—" : `${row.churn}%`}
                  </span>

                  {/* Score bar */}
                  <div>
                    {row.score !== null ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 2,
                            width: `${row.score}%`,
                            background: row.score >= 75 ? "#10b981" : row.score >= 50 ? "#ff9500" : "#f43f5e",
                            opacity: 0.75,
                          }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: row.color, fontFamily: "JetBrains Mono, monospace", minWidth: 22, textAlign: "right" }}>
                          {row.score}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Zap size={10} style={{ color: "rgba(255,149,0,0.5)" }} />
                        <span style={{ fontSize: 10, color: "rgba(255,149,0,0.5)", fontWeight: 600 }}>Calibrar</span>
                        <ChevronRight size={9} style={{ color: "rgba(255,149,0,0.35)" }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
