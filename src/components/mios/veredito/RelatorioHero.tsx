import { useState } from "react";
import { Download, Printer, Lock, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Share2, Zap, Target, BarChart2 } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes rl-appear { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes rl-bar    { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes rl-score  { from{stroke-dashoffset:var(--full)} to{stroke-dashoffset:var(--gap)} }
@keyframes rl-pulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.12;transform:scale(1.15)} }
`;

// ─── MIOS Brand ───────────────────────────────────────────────────────────────

// Neural brain network — faithful SVG recreation of the MIOS logo
function MIOSBrain({ size = 56, opacity = 1 }: { size?: number; opacity?: number }) {
  // Left hemisphere nodes [x, y, r] — orange, glowing
  const LN: [number,number,number][] = [
    [42,50,7],[65,32,9],[92,25,7.5],[118,38,6],
    [30,78,6],[60,68,10],[90,60,8],
    [26,108,5.5],[56,98,8.5],[84,90,7],
    [40,135,6],[68,125,7.5],[96,118,6],
  ];
  // Right hemisphere nodes [x, y, r] — silver/dim
  const RN: [number,number,number][] = [
    [132,42,5],[152,32,4.5],[170,52,4.5],
    [145,68,5.5],[168,75,4],[183,90,4.5],
    [150,95,5],[173,108,4],[158,122,4.5],
    [140,140,4],
  ];
  const ALL = [...LN, ...RN];
  // Left edges (orange wires)
  const LE = [
    [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,5],
    [4,5],[5,6],[4,7],[5,8],[6,9],[3,6],
    [7,8],[8,9],[7,10],[8,11],[9,12],
    [10,11],[11,12],
  ];
  // Right edges (silver wires)
  const RE = [
    [13,14],[14,15],[13,16],[15,17],[16,17],
    [16,19],[17,18],[17,20],[18,20],
    [19,21],[20,21],[21,22],
  ];
  // Cross hemisphere edges
  const XE = [[3,13],[6,16],[9,19],[12,22]];

  return (
    <svg width={size} height={Math.round(size * 0.83)} viewBox="0 0 210 175"
      style={{ display: "block", opacity }}>
      <defs>
        <filter id="mb-glow-hi" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b1"/>
          <feGaussianBlur stdDeviation="2.5" result="b2"/>
          <feMerge>
            <feMergeNode in="b1"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="b2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="mb-glow-lo" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Right (silver) edges */}
      {RE.map(([a,b],i) => (
        <line key={`re${i}`}
          x1={ALL[a][0]} y1={ALL[a][1]} x2={ALL[b][0]} y2={ALL[b][1]}
          stroke="#64748b" strokeWidth="0.7" opacity="0.45" />
      ))}
      {/* Left (orange) edges */}
      {LE.map(([a,b],i) => (
        <line key={`le${i}`}
          x1={ALL[a][0]} y1={ALL[a][1]} x2={ALL[b][0]} y2={ALL[b][1]}
          stroke="#ff9500" strokeWidth="0.9" opacity="0.38" />
      ))}
      {/* Cross edges */}
      {XE.map(([a,b],i) => (
        <line key={`xe${i}`}
          x1={ALL[a][0]} y1={ALL[a][1]} x2={ALL[b][0]} y2={ALL[b][1]}
          stroke="#ff9500" strokeWidth="0.6" opacity="0.2" />
      ))}

      {/* Right hemisphere nodes (silver) */}
      {RN.map(([x,y,r],i) => (
        <circle key={`rn${i}`} cx={x} cy={y} r={r} fill="#94a3b8" opacity="0.55" />
      ))}
      {/* Left hemisphere nodes (orange, glowing) */}
      {LN.map(([x,y,r],i) => {
        const bright = i < 9;
        return (
          <circle key={`ln${i}`} cx={x} cy={y} r={r}
            fill={bright ? "#ff9500" : "#c07010"}
            filter={bright ? "url(#mb-glow-hi)" : "url(#mb-glow-lo)"}
            opacity={bright ? 1 : 0.75} />
        );
      })}
    </svg>
  );
}

function MIOSWordmark({ scale = 1 }: { scale?: number }) {
  const brainSize = Math.round(56 * scale);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(16 * scale) }}>
      <MIOSBrain size={brainSize} />
      <div>
        <div style={{
          fontSize: Math.round(24 * scale), fontWeight: 900, letterSpacing: "0.14em",
          color: "#ffffff", lineHeight: 1, fontFamily: "'Inter', sans-serif",
        }}>MIOS</div>
        <div style={{
          fontSize: Math.round(7 * scale), fontWeight: 700, letterSpacing: "0.22em",
          color: "rgba(255,149,0,0.5)", marginTop: Math.round(3 * scale),
        }}>INTELLIGENCE PLATFORM</div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const META = { quarter: "Q2 · 2026", date: "14 de Maio de 2026", period: "Jan → Mai 2026", months: 4, version: "v2.0" };
const SCORE = { curr: 68, prev: 57 };
const DELTA = SCORE.curr - SCORE.prev;

interface ModRow { name: string; score: number; prev: number; benchmark?: number }
interface Group {
  id: string; name: string; color: string; score: number; prev: number; benchmark: number;
  modules: ModRow[]; insight: string; risk?: string;
}
const GROUPS: Group[] = [
  {
    id: "mercado", name: "Mercado", color: "#3b82f6", score: 67, prev: 55, benchmark: 64,
    modules: [
      { name: "Pulso do Mercado", score: 65, prev: 52, benchmark: 60 },
      { name: "Concorrentes",     score: 71, prev: 48, benchmark: 68 },
      { name: "Benchmarking",     score: 74, prev: 55, benchmark: 70 },
      { name: "Tendências",       score: 68, prev: 60, benchmark: 65 },
      { name: "Sentimento",       score: 60, prev: 62, benchmark: 66 },
    ],
    insight: "Forte evolução competitiva — Benchmarking e Concorrentes avançaram juntos +37 pts, posicionando a empresa acima do benchmark setorial pela primeira vez. Sentimento regrediu 2 pts; tendência de pressão externa que exige monitoramento contínuo.",
  },
  {
    id: "audiencia", name: "Audiência", color: "#ec4899", score: 74, prev: 78, benchmark: 71,
    modules: [
      { name: "Audiência", score: 70, prev: 82, benchmark: 74 },
      { name: "Dores",     score: 80, prev: 75, benchmark: 69 },
      { name: "Canais",    score: 72, prev: 74, benchmark: 70 },
    ],
    insight: "Único grupo com regressão no período (−4 pts). Dores evoluiu +5 pts — indicativo de que a empresa entende melhor o problema do cliente. Audiência (−12 pts) e Canais (−2 pts) sinalizam desalinhamento entre proposta de valor e canais de distribuição.",
    risk: "Regressão de Audiência pode indicar perda de relevância junto ao público-alvo. Recomenda-se revisão imediata da estratégia de engajamento e comunicação.",
  },
  {
    id: "marca", name: "Marca", color: "#8b5cf6", score: 62, prev: 60, benchmark: 67,
    modules: [
      { name: "DNA da Marca", score: 68, prev: 65, benchmark: 72 },
      { name: "Precificação", score: 58, prev: 55, benchmark: 63 },
    ],
    insight: "Evolução modesta (+2 pts) — abaixo do benchmark setorial (67). DNA da Marca avança mas permanece inferior à referência. Precificação é o ponto de maior oportunidade: 5 pts abaixo do mercado, com potencial direto de ganho em margem.",
  },
  {
    id: "estrategia", name: "Estratégia", color: "#10b981", score: 61, prev: 42, benchmark: 58,
    modules: [
      { name: "Business Plan", score: 65, prev: 40, benchmark: 62 },
      { name: "OKR",           score: 52, prev: 38, benchmark: 55 },
      { name: "Cenários",      score: 68, prev: 45, benchmark: 60 },
      { name: "Compliance",    score: 60, prev: 45, benchmark: 56 },
    ],
    insight: "Maior avanço absoluto entre todos os grupos (+19 pts). Business Plan e Cenários são os destaques, ambos superando o benchmark. OKR avançou +14 pts mas é o único módulo abaixo da referência — 2 KRs em risco crítico comprometem a meta de Q2.",
  },
  {
    id: "veredito", name: "Veredito", color: "#ff9500", score: 75, prev: 52, benchmark: 60,
    modules: [
      { name: "Score Final", score: 68, prev: 57, benchmark: 58 },
      { name: "Comparativo", score: 75, prev: 52, benchmark: 60 },
      { name: "Exportar",    score: 80, prev: 48, benchmark: 55 },
      { name: "Histórico",   score: 77, prev: 50, benchmark: 57 },
    ],
    insight: "Maior evolução proporcional do período (+23 pts, +44%). A consolidação do diagnóstico em Veredito reflete amadurecimento operacional significativo. Todos os módulos superam o benchmark setorial — base sólida para o ciclo Q3.",
  },
];

const ALL_MODULES: ModRow[] = GROUPS.flatMap(g =>
  g.modules.map(m => ({ ...m, group: g.name, color: g.color } as ModRow & { group: string; color: string }))
).sort((a, b) => Math.abs(b.score - b.prev) - Math.abs(a.score - a.prev));

interface Rec { priority: string; pColor: string; title: string; desc: string; impact: string; owner: string; deadline: string; kpi: string }
const RECS: Rec[] = [
  { priority: "CRÍTICO", pColor: "#ef4444", title: "Reverter regressão de Audiência",  desc: "Redesenho da estratégia de engajamento e canais. Audiência perdeu 12 pts — maior regressão individual do período. Requer diagnóstico específico do canal e proposta de valor.", impact: "Alto", owner: "Marketing & Produto", deadline: "30 Mai 2026", kpi: "Audiência ≥ 80 pts até Q3" },
  { priority: "CRÍTICO", pColor: "#ef4444", title: "Plano de recuperação — OKRs Q2",  desc: "2 KRs em estado crítico: 'Crescimento de Receita' (conf. 38%) e 'NPS > 70' (conf. 44%). Gap de execução exige revisão de metas ou aceleração tática nas próximas 6 semanas.", impact: "Alto", owner: "C-Level", deadline: "20 Mai 2026", kpi: "Confiança ≥ 65% em ambos os KRs" },
  { priority: "ALTO",    pColor: "#ff9500", title: "Revisão estratégica de precificação", desc: "Score 58 pts — 5 pts abaixo do benchmark setorial (63). Análise de margens, posicionamento de preço e elasticidade da demanda. Oportunidade direta de ganho em receita.", impact: "Médio-Alto", owner: "Comercial & Financeiro", deadline: "05 Jun 2026", kpi: "Precificação ≥ 65 pts; margem bruta +2%" },
  { priority: "MÉDIO",   pColor: "#6366f1", title: "Monitoramento contínuo — Sentimento", desc: "Queda de 2 pts em Sentimento de Mercado — único indicador de mercado em regressão. Implantação de painel de monitoramento semanal antes que sinais externos se agravem.", impact: "Médio", owner: "Inteligência", deadline: "Contínuo", kpi: "Sentimento ≥ 65 pts" },
  { priority: "MÉDIO",   pColor: "#6366f1", title: "Aceleração do DNA da Marca",         desc: "Crescimento de apenas 3 pts no período — 4 pts abaixo do benchmark (72). Alinhamento de identidade visual, tom de voz e posicionamento pode acelerar percepção de mercado.", impact: "Médio", owner: "Marca & Comunicação", deadline: "30 Jun 2026", kpi: "DNA da Marca ≥ 74 pts" },
];

const OKR_KRS = [
  { obj: "01", name: "Crescimento de Receita",   kr: "ARR alcançar R$ 1,2M",         conf: 38, status: "risk",  curr: "R$ 820K",   target: "R$ 1,2M" },
  { obj: "01", name: "Crescimento de Receita",   kr: "CAC abaixo de R$ 450",         conf: 62, status: "watch", curr: "R$ 510",    target: "R$ 450"  },
  { obj: "02", name: "Excelência de Produto",    kr: "NPS acima de 70",              conf: 44, status: "risk",  curr: "52",        target: "70"      },
  { obj: "02", name: "Excelência de Produto",    kr: "Churn mensal abaixo de 2%",    conf: 75, status: "track", curr: "2.4%",      target: "< 2%"    },
  { obj: "03", name: "Expansão de Mercado",      kr: "3 novos parceiros estratégicos", conf: 80, status: "track", curr: "2",        target: "3"       },
  { obj: "03", name: "Expansão de Mercado",      kr: "Presença em 2 novos segmentos", conf: 90, status: "track", curr: "2",        target: "2"       },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreArc({ score, size, color, delay = 0 }: { score: number; size: number; color: string; delay?: number }) {
  const r    = (size - 10) / 2;
  const circ = +(2 * Math.PI * r).toFixed(2);
  const gap  = +((1 - score / 100) * circ).toFixed(2);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round" strokeDasharray={circ}
        style={{
          transform: "rotate(-90deg)", transformOrigin: `${size/2}px ${size/2}px`,
          strokeDashoffset: gap,
          animation: `rl-score 1.1s ease ${delay}s both`,
          ['--full' as string]: circ, ['--gap' as string]: gap,
        } as React.CSSProperties}
      />
      <text x={size/2} y={size/2 - 2} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.93)" fontSize={size * 0.28} fontWeight={900}
        fontFamily="JetBrains Mono, monospace">{score}</text>
      <text x={size/2} y={size/2 + size * 0.2} textAnchor="middle"
        fill="rgba(255,255,255,0.2)" fontSize={size * 0.13} fontWeight={600}>pts</text>
    </svg>
  );
}

function DeltaBadge({ delta, size = "sm" }: { delta: number; size?: "sm" | "md" | "lg" }) {
  const pos  = delta >= 0;
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const c    = delta > 0 ? "#10b981" : delta < 0 ? "#ef4444" : "rgba(255,255,255,0.35)";
  const fs   = size === "lg" ? 22 : size === "md" ? 14 : 10;
  const pad  = size === "lg" ? "8px 18px" : size === "md" ? "5px 12px" : "2px 8px";
  const r    = size === "lg" ? 10 : size === "md" ? 7 : 5;
  const iSz  = size === "lg" ? 16 : size === "md" ? 11 : 9;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: pad, borderRadius: r, background: `${c}12`, border: `1px solid ${c}28` }}>
      <Icon size={iSz} style={{ color: c }} strokeWidth={2.2} />
      <span style={{ fontSize: fs, fontWeight: 900, color: c, fontFamily: "JetBrains Mono, monospace" }}>
        {pos ? "+" : ""}{delta} pts
      </span>
    </div>
  );
}

// Mini pentagon radar
function GroupRadar() {
  const CX = 110, CY = 108, MAX_R = 75;
  const prevScores = GROUPS.map(g => g.prev);
  const currScores = GROUPS.map(g => g.score);
  const rings = [25, 50, 75, 100];

  function pt(i: number, score: number): [number, number] {
    const rad = (i * 72 - 90) * Math.PI / 180;
    const r   = (score / 100) * MAX_R;
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
  }
  function poly(scores: number[]) {
    return scores.map((s, i) => pt(i, s).join(",")).join(" ");
  }
  function labelPt(i: number): [number, number] {
    const rad = (i * 72 - 90) * Math.PI / 180;
    const r   = MAX_R * 1.28;
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
  }

  return (
    <svg width={220} height={216} viewBox="0 0 220 216" style={{ display: "block" }}>
      {rings.map(r => (
        <polygon key={r} points={poly(Array(5).fill(r))} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.7} />
      ))}
      {GROUPS.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.7} />;
      })}
      <polygon points={poly(prevScores)} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.22)" strokeWidth={1.4} strokeDasharray="4 3" />
      <polygon points={poly(currScores)} fill="rgba(255,149,0,0.06)" stroke="rgba(255,149,0,0.7)" strokeWidth={1.8} strokeDasharray="800" style={{ animation: "rl-score 1.4s ease 0.3s both", ['--full' as string]: '800', ['--gap' as string]: '0' } as React.CSSProperties} />
      {GROUPS.map((g, i) => {
        const [ax, ay] = pt(i, g.prev);
        const [bx, by] = pt(i, g.score);
        const d = g.score - g.prev;
        return (
          <g key={i}>
            <circle cx={ax} cy={ay} r={3} fill="rgba(255,255,255,0.3)" />
            <circle cx={bx} cy={by} r={4.5} fill={g.color} opacity={0.15} />
            <circle cx={bx} cy={by} r={3} fill={g.color} opacity={0.85} />
            {(() => {
              const [lx, ly] = labelPt(i);
              return (
                <g>
                  <text x={lx} y={ly - 5} textAnchor="middle" fill={g.color} fontSize={7.5} fontWeight={800}>{g.name.slice(0,3).toUpperCase()}</text>
                  <text x={lx} y={ly + 5} textAnchor="middle" fill={d >= 0 ? "#10b981" : "#ef4444"} fontSize={7} fontWeight={700} fontFamily="JetBrains Mono, monospace">
                    {d >= 0 ? "+" : ""}{d}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}
      <text x={CX} y={CY - 2} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={16} fontWeight={900} fontFamily="JetBrains Mono, monospace">{SCORE.curr}</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fill="#10b981" fontSize={9} fontWeight={800} fontFamily="JetBrains Mono, monospace">+{DELTA}</text>
    </svg>
  );
}

function confColor(c: number) { return c >= 70 ? "#10b981" : c >= 50 ? "#ff9500" : "#ef4444"; }

// ─── Main Component ───────────────────────────────────────────────────────────

export function RelatorioHero() {
  const [format, setFormat] = useState<"html" | "pdf">("html");

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: 48 }}>

        {/* ── Viewer Toolbar ─────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: "14px 14px 0 0", padding: "10px 22px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ display: "flex", gap: 2, padding: 2, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["html","pdf"] as const).map(f => (
              <div key={f} onClick={() => setFormat(f)} style={{
                padding: "4px 14px", borderRadius: 5, cursor: "pointer",
                fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5,
                color: format === f ? "#ff9500" : "rgba(255,255,255,0.3)",
                background: format === f ? "rgba(255,149,0,0.10)" : "transparent",
                border: format === f ? "1px solid rgba(255,149,0,0.22)" : "1px solid transparent",
                transition: "all 0.15s ease",
              }}>{f.toUpperCase()}</div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Diagnóstico Estratégico Q2 2026 · {META.date}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
            <Lock size={9} style={{ color: "#ef4444" }} strokeWidth={2} />
            <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444", letterSpacing: 0.5 }}>CONFIDENCIAL</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[{ Icon: Printer, t: "Imprimir" }, { Icon: Share2, t: "Compartilhar" }, { Icon: Download, t: "Baixar" }].map(({ Icon, t }) => (
              <div key={t} title={t} style={{ width: 30, height: 30, borderRadius: 7, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={13} style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>

        {/* ── DOCUMENT ───────────────────────────────────────────────────────── */}
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", borderRadius: "0 0 14px 14px", background: "#04060f", overflow: "hidden" }}>

          {/* ════════ CAPA ════════════════════════════════════════════════════ */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Top orange bar */}
            <div style={{ height: 4, background: "linear-gradient(90deg, #ff9500 0%, rgba(255,149,0,0.35) 65%, transparent 100%)" }} />

            {/* Giant background MIOS mark watermark */}
            <div style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", opacity: 0.035, pointerEvents: "none" }}>
              <MIOSBrain size={480} opacity={1} />
            </div>

            {/* Gradient radial */}
            <div style={{ position: "absolute", top: -80, left: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.055) 0%, transparent 65%)", pointerEvents: "none" }} />

            <div style={{ padding: "48px 52px 40px", position: "relative" }}>
              {/* Header row: logo left, confidential right */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 52 }}>
                <MIOSWordmark scale={1.1} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <Lock size={9} style={{ color: "#ef4444" }} strokeWidth={2} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444", letterSpacing: 0.8 }}>CONFIDENCIAL · USO RESTRITO</span>
                  </div>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>
                    {META.version} · {format.toUpperCase()} · {META.date}
                  </span>
                </div>
              </div>

              {/* Main title + score */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "rgba(255,149,0,0.5)", marginBottom: 10 }}>
                    RELATÓRIO DE INTELIGÊNCIA COMPETITIVA
                  </div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,0.95)", letterSpacing: "-2px", lineHeight: 1.0, marginBottom: 14 }}>
                    Diagnóstico<br />Estratégico
                  </div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,0.3)", marginBottom: 24, lineHeight: 1.5 }}>
                    Análise integrada de Mercado, Audiência, Marca,<br />Estratégia e Veredito consolidado · {META.quarter}
                  </div>
                  {/* Period breadcrumb */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {[META.quarter, META.period, `${META.months} meses de acompanhamento`, "14 módulos avaliados"].map((t, i) => (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {i > 0 && <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 10 }}>·</span>}
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", padding: "3px 10px", borderRadius: 5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score big */}
                <div style={{ textAlign: "center", padding: "28px 36px", borderRadius: 20, background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.14)", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(circle at 50% 30%, rgba(255,149,0,0.06), transparent 70%)", pointerEvents: "none" }} />
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,149,0,0.45)", marginBottom: 14 }}>SCORE GERAL</div>
                  <ScoreArc score={SCORE.curr} size={100} color="#ff9500" delay={0.2} />
                  <div style={{ marginTop: 14 }}>
                    <DeltaBadge delta={DELTA} size="md" />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 9.5, color: "rgba(255,255,255,0.22)" }}>
                    vs. Jan 2026 · era {SCORE.prev} pts
                  </div>
                </div>
              </div>

              {/* KPI Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[
                  { label: "Evolução Geral",        value: `+${DELTA} pts`, sub: "em 4 meses",          color: "#10b981" },
                  { label: "Grupos Melhorados",      value: "4 / 5",        sub: "Audiência regrediu",   color: "#ff9500" },
                  { label: "Módulos Avaliados",      value: "14",           sub: "5 grupos completos",   color: "#3b82f6" },
                  { label: "Módulos Acima Benchmark",value: "9 / 14",       sub: "benchmark setorial",   color: "#8b5cf6" },
                  { label: "Alertas Ativos",         value: "2",            sub: "requerem ação urgente", color: "#ef4444" },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    padding: "14px 16px", borderRadius: 12,
                    background: `${s.color}08`, border: `1px solid ${s.color}1a`,
                    animation: `rl-appear 0.3s ease ${i * 0.07}s both`,
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom accent line */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,149,0,0.25) 30%, rgba(255,149,0,0.25) 70%, transparent 100%)" }} />
          </div>

          {/* ════════ 01 · SUMÁRIO EXECUTIVO ══════════════════════════════════ */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Section header */}
            <div style={{ padding: "16px 52px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: "3px solid #ff9500", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", letterSpacing: 2 }}>01</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "rgba(255,255,255,0.88)" }}>Sumário Executivo</span>
            </div>
            <div style={{ padding: "28px 52px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 36, marginBottom: 24 }}>
                {/* Pentagon radar */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.18)", alignSelf: "flex-start" }}>RADAR DE EVOLUÇÃO</div>
                  <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: 4 }}>
                    <GroupRadar />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 16, height: 1.5, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
                      <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.28)" }}>Jan 2026</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 16, height: 2, background: "rgba(255,149,0,0.75)", borderRadius: 1 }} />
                      <span style={{ fontSize: 7.5, color: "rgba(255,149,0,0.6)" }}>Mai 2026</span>
                    </div>
                  </div>
                </div>

                {/* Findings + score table */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>PRINCIPAIS ACHADOS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { Icon: TrendingUp,    c: "#10b981", text: "Score geral evoluiu +11 pts em 4 meses (57 → 68) — evolução mais expressiva desde a fundação." },
                        { Icon: TrendingUp,    c: "#10b981", text: "Estratégia avançou +19 pts, maior ganho absoluto entre os grupos. Cenários e Business Plan lideram." },
                        { Icon: TrendingDown,  c: "#ef4444", text: "Audiência regrediu −4 pts — único grupo em queda. Módulo Audiência perdeu 12 pts no período." },
                        { Icon: AlertTriangle, c: "#ff9500", text: "2 KRs de OKR em risco crítico: 'Crescimento de Receita' (conf. 38%) e 'NPS > 70' (conf. 44%)." },
                        { Icon: TrendingUp,    c: "#10b981", text: "9 de 14 módulos superam o benchmark setorial — posição competitiva fortalecida." },
                      ].map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 22, height: 22, borderRadius: 6, background: `${f.c}10`, border: `1px solid ${f.c}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <f.Icon size={10} style={{ color: f.c }} strokeWidth={2.2} />
                          </div>
                          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{f.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score por grupo */}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>SCORE POR GRUPO · EVOLUÇÃO</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {GROUPS.map((g, i) => {
                        const d = g.score - g.prev;
                        const dc = d >= 0 ? "#10b981" : "#ef4444";
                        return (
                          <div key={g.id} style={{ animation: `rl-appear 0.3s ease ${i * 0.07}s both` }}>
                            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 36px 38px 50px", gap: 8, alignItems: "center", marginBottom: 4 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: g.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{g.name}</span>
                              </div>
                              <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${g.prev}%`, background: "rgba(255,255,255,0.18)", borderRadius: 3 }} />
                                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${g.score}%`, background: g.color, borderRadius: 3, opacity: 0.7 }} />
                              </div>
                              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>{g.prev}</span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: g.color, fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>{g.score}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: dc, fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>{d >= 0 ? "+" : ""}{d}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical alerts strip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { c: "#ef4444", Icon: AlertTriangle, title: "ALERTA CRÍTICO · Audiência",    body: "Módulo Audiência regrediu 12 pts (82→70). Pressão sobre Canais também detectada." },
                  { c: "#ff9500", Icon: AlertTriangle, title: "ATENÇÃO · OKR Q2 em Risco",     body: "Confiança média dos KRs em risco: 41%. Com 50 dias restantes, recuperação exige ação imediata." },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 10, background: `${a.c}07`, border: `1px solid ${a.c}20` }}>
                    <a.Icon size={16} style={{ color: a.c, flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: a.c, letterSpacing: 0.5, marginBottom: 5 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{a.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════════ 02 · VISÃO COMPLETA — MÓDULOS ══════════════════════════ */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ padding: "16px 52px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: "3px solid #6366f1", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#6366f1", fontFamily: "JetBrains Mono, monospace", letterSpacing: 2 }}>02</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "rgba(255,255,255,0.88)" }}>Todos os Módulos — Visão Comparativa</span>
            </div>
            <div style={{ padding: "24px 52px" }}>
              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 50px 50px 55px 90px", gap: 12, padding: "0 0 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 8 }}>
                {["MÓDULO / GRUPO", "BENCHMARK", "ANT.", "ATUAL", "Δ", "POSIÇÃO"].map(h => (
                  <span key={h} style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.8, color: "rgba(255,255,255,0.18)" }}>{h}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                {(ALL_MODULES as (ModRow & { group: string; color: string })[]).map((m, i) => {
                  const d = m.score - m.prev;
                  const dc = d > 0 ? "#10b981" : d < 0 ? "#ef4444" : "rgba(255,255,255,0.3)";
                  const Icon = d > 0 ? TrendingUp : d < 0 ? TrendingDown : Minus;
                  const aboveBench = m.benchmark ? m.score >= m.benchmark : false;
                  return (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "1fr 80px 50px 50px 55px 90px",
                      gap: 12, padding: "11px 0", alignItems: "center",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      paddingRight: i % 2 === 0 ? 20 : 0,
                      paddingLeft: i % 2 === 1 ? 20 : 0,
                      borderLeft: i % 2 === 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.65)", marginBottom: 3 }}>{m.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: m.color }} />
                          <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)" }}>{m.group}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{m.benchmark ?? "—"}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>{m.prev}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.score}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Icon size={9} style={{ color: dc }} strokeWidth={2.2} />
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: dc, fontFamily: "JetBrains Mono, monospace" }}>{d >= 0 ? "+" : ""}{d}</span>
                      </div>
                      <div style={{ padding: "2px 7px", borderRadius: 4, background: aboveBench ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.08)", border: `1px solid ${aboveBench ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.18)"}` }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: aboveBench ? "#10b981" : "#ef4444" }}>{aboveBench ? "↑ Benchmark" : "↓ Benchmark"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ════════ GRUPOS 03–07 ════════════════════════════════════════════ */}
          {GROUPS.map((g, gi) => {
            const sectionNum = `0${gi + 3}`;
            const delta = g.score - g.prev;
            const aboveBench = g.score >= g.benchmark;
            return (
              <div key={g.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Section header */}
                <div style={{
                  padding: "16px 52px",
                  background: `${g.color}05`,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  borderLeft: `3px solid ${g.color}`,
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: g.color, fontFamily: "JetBrains Mono, monospace", letterSpacing: 2 }}>{sectionNum}</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "rgba(255,255,255,0.88)" }}>Grupo · {g.name}</span>
                  <DeltaBadge delta={delta} size="sm" />
                  {g.risk && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 10px", borderRadius: 5, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)", marginLeft: 4 }}>
                      <AlertTriangle size={9} style={{ color: "#ef4444" }} strokeWidth={2} />
                      <span style={{ fontSize: 8.5, fontWeight: 700, color: "#ef4444" }}>REGRESSÃO</span>
                    </div>
                  )}
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)" }}>benchmark: <span style={{ color: aboveBench ? "#10b981" : "#ef4444", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{g.benchmark}</span></span>
                    <ScoreArc score={g.score} size={56} color={g.color} delay={gi * 0.08} />
                  </div>
                </div>

                <div style={{ padding: "24px 52px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                    {/* Module table */}
                    <div>
                      <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", marginBottom: 12 }}>MÓDULOS</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {/* Column labels */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 44px 44px 36px 70px", gap: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 4 }}>
                          {["", "ANT.", "ATUAL", "Δ", "BENCHMARK"].map(h => (
                            <span key={h} style={{ fontSize: 7.5, fontWeight: 700, color: "rgba(255,255,255,0.18)" }}>{h}</span>
                          ))}
                        </div>
                        {g.modules.map((m, mi) => {
                          const md = m.score - m.prev;
                          const Icon = md > 0 ? TrendingUp : md < 0 ? TrendingDown : Minus;
                          const mc = md > 0 ? "#10b981" : md < 0 ? "#ef4444" : "rgba(255,255,255,0.3)";
                          const aboveM = m.benchmark ? m.score >= m.benchmark : false;
                          return (
                            <div key={m.name} style={{ display: "grid", gridTemplateColumns: "1fr 44px 44px 36px 70px", gap: 8, padding: "10px 0", borderBottom: mi < g.modules.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                              <div>
                                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{m.name}</div>
                                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${m.prev}%`, background: "rgba(255,255,255,0.2)", borderRadius: 2 }} />
                                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${m.score}%`, background: g.color, borderRadius: 2, opacity: 0.75 }} />
                                </div>
                              </div>
                              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>{m.prev}</span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: g.color, fontFamily: "JetBrains Mono, monospace" }}>{m.score}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Icon size={9} style={{ color: mc }} strokeWidth={2.2} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: mc, fontFamily: "JetBrains Mono, monospace" }}>{md >= 0 ? "+" : ""}{md}</span>
                              </div>
                              <div style={{ padding: "2px 6px", borderRadius: 4, background: aboveM ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.08)", border: `1px solid ${aboveM ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.18)"}`, textAlign: "center" }}>
                                <span style={{ fontSize: 8, fontWeight: 700, color: aboveM ? "#10b981" : "#ef4444" }}>{m.benchmark} {aboveM ? "✓" : "!"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {/* Analysis */}
                      <div style={{ padding: "16px 18px", borderRadius: 10, background: `${g.color}06`, border: `1px solid ${g.color}18` }}>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.2, color: `${g.color}70`, marginBottom: 8 }}>ANÁLISE DO PERÍODO</div>
                        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>{g.insight}</p>
                      </div>

                      {/* Benchmark position */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <BarChart2 size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} strokeWidth={1.8} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>Posição vs. Benchmark Setorial</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: aboveBench ? "#10b981" : "#ef4444", fontFamily: "JetBrains Mono, monospace" }}>
                              {g.score > g.benchmark ? "+" : ""}{g.score - g.benchmark} pts
                            </span>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{aboveBench ? "acima" : "abaixo"} do benchmark ({g.benchmark})</span>
                          </div>
                        </div>
                      </div>

                      {/* OKR inline for Estratégia */}
                      {g.id === "estrategia" && (
                        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(16,185,129,0.2)" }}>
                          <div style={{ padding: "8px 14px", background: "rgba(16,185,129,0.07)", borderBottom: "1px solid rgba(16,185,129,0.15)", display: "flex", alignItems: "center", gap: 6 }}>
                            <Target size={10} style={{ color: "#10b981" }} strokeWidth={2} />
                            <span style={{ fontSize: 8.5, fontWeight: 800, color: "#10b981", letterSpacing: 0.5 }}>OKR Q2 2026 · Semana 6/13</span>
                          </div>
                          <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                            {OKR_KRS.map((kr, ki) => {
                              const cc = confColor(kr.conf);
                              return (
                                <div key={ki} style={{ display: "grid", gridTemplateColumns: "1fr 70px 60px", gap: 8, alignItems: "center" }}>
                                  <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)" }}>{kr.kr}</span>
                                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${kr.conf}%`, background: cc, borderRadius: 2, opacity: 0.8 }} />
                                  </div>
                                  <span style={{ fontSize: 9, fontWeight: 800, color: cc, fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>{kr.conf}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Risk card for Audiencia */}
                      {g.risk && (
                        <div style={{ padding: "12px 16px", borderRadius: 9, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <AlertTriangle size={14} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
                          <p style={{ fontSize: 11, color: "rgba(255,100,100,0.7)", lineHeight: 1.6, margin: 0 }}>{g.risk}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ════════ 08 · RECOMENDAÇÕES ══════════════════════════════════════ */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ padding: "16px 52px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: "3px solid #ff9500", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", letterSpacing: 2 }}>08</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "rgba(255,255,255,0.88)" }}>Recomendações Estratégicas</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>— ordenadas por prioridade e urgência</span>
            </div>
            <div style={{ padding: "24px 52px", display: "flex", flexDirection: "column", gap: 10 }}>
              {RECS.map((r, i) => (
                <div key={i} style={{
                  borderRadius: 12, overflow: "hidden",
                  border: `1px solid ${r.pColor}20`,
                  animation: `rl-appear 0.3s ease ${i * 0.08}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: `${r.pColor}08`, borderBottom: `1px solid ${r.pColor}15` }}>
                    <div style={{ padding: "3px 10px", borderRadius: 5, background: `${r.pColor}15`, border: `1px solid ${r.pColor}30`, fontSize: 8.5, fontWeight: 800, color: r.pColor }}>{r.priority}</div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.82)" }}>{r.title}</span>
                  </div>
                  <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 100px 110px 100px 120px", gap: 16, alignItems: "flex-start" }}>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                    <div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>IMPACTO</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>{r.impact}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>RESPONSÁVEL</div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{r.owner}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>PRAZO</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: r.pColor, fontFamily: "JetBrains Mono, monospace" }}>{r.deadline}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>KPI ALVO</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{r.kpi}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════ RODAPÉ ══════════════════════════════════════════════════ */}
          <div style={{ padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.01)" }}>
            <MIOSWordmark scale={0.65} />
            <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>
              Diagnóstico Estratégico · {META.quarter} · Gerado em {META.date}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 6, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <Lock size={9} style={{ color: "#ef4444" }} strokeWidth={2} />
              <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(239,68,68,0.65)", letterSpacing: 0.5 }}>CONFIDENCIAL · USO INTERNO</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
