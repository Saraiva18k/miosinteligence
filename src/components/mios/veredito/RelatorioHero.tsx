import { useState } from "react";
import { Download, Printer, Lock, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Share2 } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes rl-appear { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes rl-bar    { from{width:0} to{width:var(--w)} }
@keyframes rl-score  { from{stroke-dashoffset:var(--full)} to{stroke-dashoffset:var(--gap)} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const META = {
  title:    "Diagnóstico Estratégico",
  subtitle: "Relatório de Inteligência Competitiva",
  quarter:  "Q2 · 2026",
  date:     "14 de Maio de 2026",
  period:   "Janeiro → Maio 2026",
  version:  "v2.0",
};

const SCORE = { curr: 68, prev: 57 };
const DELTA = SCORE.curr - SCORE.prev;

interface ModuleRow { name: string; score: number; prev: number }
interface Group {
  id: string; name: string; color: string;
  score: number; prev: number;
  modules: ModuleRow[];
  insight: string;
}
const GROUPS: Group[] = [
  {
    id: "mercado", name: "Mercado", color: "#3b82f6", score: 67, prev: 55,
    modules: [
      { name: "Pulso do Mercado", score: 65, prev: 52 },
      { name: "Concorrentes",     score: 71, prev: 48 },
      { name: "Benchmarking",     score: 74, prev: 55 },
      { name: "Tendências",       score: 68, prev: 60 },
      { name: "Sentimento",       score: 60, prev: 62 },
    ],
    insight: "Forte evolução competitiva — Benchmarking avançou +19 pts. Atenção ao Sentimento de Mercado, que regrediu 2 pts, indicando pressão externa crescente.",
  },
  {
    id: "audiencia", name: "Audiência", color: "#ec4899", score: 74, prev: 78,
    modules: [
      { name: "Audiência", score: 70, prev: 82 },
      { name: "Dores",     score: 80, prev: 75 },
      { name: "Canais",    score: 72, prev: 74 },
    ],
    insight: "Único grupo com regressão no período (−4 pts). Dores avançou, mas Audiência e Canais regrediram — desalinhamento entre proposta de valor e expectativas do público.",
  },
  {
    id: "marca", name: "Marca", color: "#8b5cf6", score: 62, prev: 60,
    modules: [
      { name: "DNA da Marca", score: 68, prev: 65 },
      { name: "Precificação", score: 58, prev: 55 },
    ],
    insight: "Progresso modesto mas consistente (+2 pts). Precificação abaixo do benchmark setorial — oportunidade de ajuste estratégico com potencial de ganho rápido.",
  },
  {
    id: "estrategia", name: "Estratégia", color: "#10b981", score: 61, prev: 42,
    modules: [
      { name: "Business Plan", score: 65, prev: 40 },
      { name: "OKR",           score: 52, prev: 38 },
      { name: "Cenários",      score: 68, prev: 45 },
      { name: "Compliance",    score: 60, prev: 45 },
    ],
    insight: "Maior avanço absoluto do período (+19 pts). Estruturação estratégica acelerada. OKR exige atenção — 2 KRs em risco crítico comprometem a meta de Q2.",
  },
  {
    id: "veredito", name: "Veredito", color: "#ff9500", score: 75, prev: 52,
    modules: [
      { name: "Score Final", score: 68, prev: 57 },
      { name: "Comparativo", score: 75, prev: 52 },
      { name: "Exportar",    score: 80, prev: 48 },
      { name: "Histórico",   score: 77, prev: 50 },
    ],
    insight: "Maior evolução proporcional (+23 pts). A consolidação do Diagnóstico reflete a maturidade operacional conquistada — base sólida para o ciclo Q3.",
  },
];

interface Rec { priority: string; title: string; desc: string; owner: string; deadline: string; color: string }
const RECS: Rec[] = [
  { priority: "CRÍTICO", title: "Reverter regressão de Audiência",  desc: "Revisão da estratégia de engajamento — Audiência caiu 12 pts e Canais perdeu 2 pts no período.", owner: "Marketing",    deadline: "30 Mai 2026", color: "#ef4444" },
  { priority: "CRÍTICO", title: "OKRs em risco de Q2",              desc: "KRs 'Crescimento de Receita' e 'NPS > 70' em estado crítico — exigem plano de recuperação urgente.", owner: "C-Level",       deadline: "20 Mai 2026", color: "#ef4444" },
  { priority: "ALTO",    title: "Revisão de precificação",           desc: "Score 58 — abaixo do benchmark setorial (72). Análise de margens e reposicionamento recomendados.",  owner: "Comercial",    deadline: "05 Jun 2026", color: "#ff9500" },
  { priority: "MÉDIO",   title: "Monitorar Sentimento de Mercado",   desc: "Queda de 2 pts em Sentimento — acompanhar indicadores externos antes que se agravem.",                owner: "Inteligência", deadline: "Contínuo",    color: "#6366f1" },
  { priority: "MÉDIO",   title: "Fortalecer DNA da Marca",           desc: "Ganho de apenas 3 pts — alinhamento de identidade e comunicação pode acelerar o score em Q3.",        owner: "Marca",        deadline: "30 Jun 2026", color: "#6366f1" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreArc({ score, size, color, delay = 0 }: { score: number; size: number; color: string; delay?: number }) {
  const r    = (size - 10) / 2;
  const circ = +(2 * Math.PI * r).toFixed(2);
  const gap  = +((1 - score / 100) * circ).toFixed(2);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round" strokeDasharray={circ}
        style={{
          transform: `rotate(-90deg)`,
          transformOrigin: `${size/2}px ${size/2}px`,
          strokeDashoffset: gap,
          animation: `rl-score 1s ease ${delay}s both`,
          ['--full' as string]: circ,
          ['--gap'  as string]: gap,
        } as React.CSSProperties}
      />
      <text x={size/2} y={size/2 - 2} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.92)" fontSize={size * 0.28} fontWeight={900}
        fontFamily="JetBrains Mono, monospace">{score}</text>
      <text x={size/2} y={size/2 + size*0.2} textAnchor="middle"
        fill="rgba(255,255,255,0.22)" fontSize={size * 0.13} fontWeight={600}>pts</text>
    </svg>
  );
}

function DeltaBadge({ delta, size = "sm" }: { delta: number; size?: "sm" | "lg" }) {
  const pos  = delta >= 0;
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const c    = delta > 0 ? "#10b981" : delta < 0 ? "#ef4444" : "rgba(255,255,255,0.4)";
  const fs   = size === "lg" ? 18 : 11;
  const pad  = size === "lg" ? "6px 14px" : "2px 8px";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: pad, borderRadius: 6, background: `${c}12`, border: `1px solid ${c}28` }}>
      <Icon size={size === "lg" ? 14 : 9} style={{ color: c }} strokeWidth={2.2} />
      <span style={{ fontSize: fs, fontWeight: 900, color: c, fontFamily: "JetBrains Mono, monospace" }}>
        {pos ? "+" : ""}{delta}
      </span>
    </div>
  );
}

function ScoreBar({ score, color, maxW = 100 }: { score: number; color: string; maxW?: number }) {
  return (
    <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 3, background: color, opacity: 0.75,
        width: `${(score / maxW) * 100}%`,
      }} />
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ num, title, accent, children }: { num: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.02)",
    }}>
      {/* Section header */}
      <div style={{
        padding: "14px 24px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 14,
        borderLeft: `3px solid ${accent}`,
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: accent, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5 }}>{num}</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.2px" }}>{title}</span>
      </div>
      <div style={{ padding: "20px 24px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RelatorioHero() {
  const [format, setFormat] = useState<"html" | "pdf">("html");

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: 48 }}>

        {/* ── Viewer Toolbar ─────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: "14px 14px 0 0", padding: "10px 20px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {/* Format tabs */}
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
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Diagnóstico Estratégico — Q2 2026</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Lock size={9} style={{ color: "#ef4444" }} strokeWidth={2} />
            <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444", letterSpacing: 0.5 }}>CONFIDENCIAL</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[
              { Icon: Printer, label: "Imprimir" },
              { Icon: Share2,  label: "Compartilhar" },
              { Icon: Download, label: "Baixar" },
            ].map(({ Icon, label }) => (
              <div key={label} title={label} style={{
                width: 30, height: 30, borderRadius: 7, cursor: "pointer",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={13} style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Document ───────────────────────────────────────────────────────── */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.07)",
          borderTop: "none", borderRadius: "0 0 14px 14px",
          background: "rgba(4,6,15,0.98)",
          display: "flex", flexDirection: "column", gap: 1,
          overflow: "hidden",
        }}>

          {/* ── CAPA ──────────────────────────────────────────────────────────── */}
          <div style={{
            padding: "48px 40px 40px", position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(255,149,0,0.04) 0%, rgba(4,6,15,0) 60%)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {/* Decorative radial */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Top bar */}
            <div style={{ height: 3, width: "100%", background: "linear-gradient(90deg, #ff9500 0%, rgba(255,149,0,0.3) 60%, transparent 100%)", borderRadius: 2, marginBottom: 36 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-start", gap: 24 }}>
              <div>
                {/* Wordmark */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>M</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>MIOS</div>
                    <div style={{ fontSize: 7.5, fontWeight: 600, color: "rgba(255,149,0,0.5)", letterSpacing: 1.5 }}>INTELLIGENCE PLATFORM</div>
                  </div>
                </div>

                {/* Title block */}
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "rgba(255,149,0,0.55)", marginBottom: 8 }}>
                  RELATÓRIO DE INTELIGÊNCIA COMPETITIVA
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "rgba(255,255,255,0.95)", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
                  Diagnóstico<br />Estratégico
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>
                  Análise integrada de inteligência de mercado, audiência,<br />marca, estratégia e veredito consolidado.
                </div>

                {/* Meta pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: META.quarter },
                    { label: META.period },
                    { label: META.date },
                    { label: `${META.version} · ${format.toUpperCase()}` },
                  ].map(m => (
                    <div key={m.label} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Score block (cover) */}
              <div style={{ textAlign: "center", padding: "20px 28px", borderRadius: 16, background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.15)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,149,0,0.5)", marginBottom: 12 }}>SCORE GERAL</div>
                <ScoreArc score={SCORE.curr} size={88} color="#ff9500" />
                <div style={{ marginTop: 10 }}>
                  <DeltaBadge delta={DELTA} size="lg" />
                </div>
                <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>vs. Jan 2026</div>
              </div>
            </div>
          </div>

          {/* ── SUMÁRIO EXECUTIVO ─────────────────────────────────────────────── */}
          <div style={{ padding: "28px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5 }}>01</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>Sumário Executivo</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              {/* Key findings */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>PRINCIPAIS ACHADOS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: TrendingUp,    color: "#10b981", text: "Score geral evoluiu +11 pts em 4 meses — maior avanço desde a criação da empresa." },
                    { icon: TrendingUp,    color: "#10b981", text: "Estratégia avançou +19 pts — estruturação estratégica acelerou significativamente." },
                    { icon: TrendingDown,  color: "#ef4444", text: "Audiência regrediu −4 pts — único grupo com queda no período. Requer ação imediata." },
                    { icon: AlertTriangle, color: "#ff9500", text: "2 KRs de OKR em risco crítico comprometem a meta de receita de Q2." },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: `${f.color}12`, border: `1px solid ${f.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <f.icon size={10} style={{ color: f.color }} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score por grupo */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>SCORE POR GRUPO</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {GROUPS.map((g, i) => {
                    const delta = g.score - g.prev;
                    const dc    = delta >= 0 ? "#10b981" : "#ef4444";
                    return (
                      <div key={g.id} style={{ animation: `rl-appear 0.3s ease ${i * 0.07}s both` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: g.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.65)", flex: 1 }}>{g.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: g.color, fontFamily: "JetBrains Mono, monospace" }}>{g.score}</span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: dc, fontFamily: "JetBrains Mono, monospace", width: 32, textAlign: "right" }}>
                            {delta >= 0 ? "+" : ""}{delta}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <ScoreBar score={g.prev} color="rgba(255,255,255,0.2)" />
                          <ScoreBar score={g.score} color={g.color} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── GROUP SECTIONS ─────────────────────────────────────────────────── */}
          {GROUPS.map((g, gi) => {
            const delta = g.score - g.prev;
            return (
              <div key={g.id} style={{
                padding: "24px 40px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                borderLeft: `3px solid ${g.color}`,
                animation: `rl-appear 0.3s ease ${gi * 0.1}s both`,
              }}>
                {/* Group header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: g.color, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5 }}>0{gi + 2}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>{g.name}</span>
                  <DeltaBadge delta={delta} />
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>Anterior: <span style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>{g.prev}</span></span>
                    <ScoreArc score={g.score} size={52} color={g.color} delay={gi * 0.1} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Module table */}
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", marginBottom: 8 }}>MÓDULOS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {g.modules.map(m => {
                        const md   = m.score - m.prev;
                        const Icon = md > 0 ? TrendingUp : md < 0 ? TrendingDown : Minus;
                        const mc   = md > 0 ? "#10b981" : md < 0 ? "#ef4444" : "rgba(255,255,255,0.3)";
                        return (
                          <div key={m.name} style={{ display: "grid", gridTemplateColumns: "1fr 36px 40px 28px", gap: 8, alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{m.name}</div>
                              <ScoreBar score={m.score} color={g.color} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.7)", fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>{m.score}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: mc, fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>
                              {md >= 0 ? "+" : ""}{md}
                            </span>
                            <Icon size={10} style={{ color: mc }} strokeWidth={2.2} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Insight */}
                  <div style={{
                    padding: "14px 16px", borderRadius: 10,
                    background: `${g.color}06`, border: `1px solid ${g.color}18`,
                    display: "flex", flexDirection: "column", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.2, color: `${g.color}70`, marginBottom: 8 }}>ANÁLISE DO PERÍODO</div>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{g.insight}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── RECOMENDAÇÕES ─────────────────────────────────────────────────── */}
          <div style={{ padding: "28px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5 }}>07</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>Recomendações Estratégicas</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {RECS.map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr 100px 110px",
                  gap: 16, padding: "14px 18px", borderRadius: 10, alignItems: "flex-start",
                  background: `${r.color}06`, border: `1px solid ${r.color}18`,
                  animation: `rl-appear 0.3s ease ${i * 0.07}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ padding: "3px 9px", borderRadius: 5, background: `${r.color}14`, border: `1px solid ${r.color}28`, fontSize: 8.5, fontWeight: 800, color: r.color, whiteSpace: "nowrap" }}>
                      {r.priority}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.78)", marginBottom: 4 }}>{r.title}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{r.desc}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", marginBottom: 2 }}>RESPONSÁVEL</div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{r.owner}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", marginBottom: 2 }}>PRAZO</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: r.color, fontFamily: "JetBrains Mono, monospace" }}>{r.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RODAPÉ ────────────────────────────────────────────────────────── */}
          <div style={{
            padding: "16px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.01)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 8, fontWeight: 900, color: "rgba(255,149,0,0.4)", letterSpacing: 2, fontFamily: "JetBrains Mono, monospace" }}>MIOS</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)" }}>Intelligence Platform · {META.version}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={9} style={{ color: "#10b981" }} strokeWidth={2} />
              <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)" }}>Gerado em {META.date}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 5, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <Lock size={8} style={{ color: "#ef4444" }} strokeWidth={2} />
              <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(239,68,68,0.7)", letterSpacing: 0.5 }}>CONFIDENCIAL · USO INTERNO</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
