import { Link } from "@tanstack/react-router";
import {
  Layers, Fingerprint, DollarSign, Lightbulb,
  ArrowUpRight, Brain, TrendingUp,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes mrc-shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
@keyframes mrc-pulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
@keyframes mrc-web     { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
@keyframes mrc-fadein  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes mrc-dot     { 0%,100%{opacity:0.9} 50%{opacity:0.35} }
@keyframes mrc-glow    { 0%,100%{opacity:0.4} 50%{opacity:0.85} }
@keyframes mrc-price   { from{width:0} to{width:var(--w)} }
`;

// ─── Brand polygon (spider chart) ─────────────────────────────────────────────

const DIMS = [
  { label: "Diferenciação",  score: 82, color: "#10b981" },
  { label: "Percepção",      score: 78, color: "#8b5cf6" },
  { label: "Consistência",   score: 91, color: "#f59e0b" },
  { label: "Reconhecimento", score: 65, color: "#ec4899" },
  { label: "Relevância",     score: 74, color: "#3b82f6" },
];

function BrandPolygon() {
  const cx = 100, cy = 100, maxR = 80, n = 5;

  function pt(idx: number, r: number): [number, number] {
    const rad = (idx * (360 / n) - 90) * (Math.PI / 180);
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  const gridRings = [0.25, 0.5, 0.75, 1.0].map(pct =>
    Array.from({ length: n }, (_, i) => pt(i, maxR * pct).join(",")).join(" ")
  );

  const scorePoly = DIMS.map((d, i) => pt(i, maxR * d.score / 100).join(",")).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <svg width={200} height={200} style={{ animation: "mrc-web 0.9s cubic-bezier(0.4,0,0.2,1) both", overflow: "visible" }}>
        <defs>
          <linearGradient id="mrc-poly-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(16,185,129,0.22)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.10)" />
          </linearGradient>
          <filter id="mrc-glow-f">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {gridRings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}

        {/* Spokes */}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = pt(i, maxR);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
        })}

        {/* Score polygon */}
        <polygon
          points={scorePoly}
          fill="url(#mrc-poly-g)"
          stroke="rgba(16,185,129,0.6)"
          strokeWidth={1.5}
          filter="url(#mrc-glow-f)"
        />

        {/* Vertex dots */}
        {DIMS.map((d, i) => {
          const [x, y] = pt(i, maxR * d.score / 100);
          return (
            <circle key={i} cx={x} cy={y} r={4.5}
              fill={d.color} stroke="rgba(4,6,15,0.9)" strokeWidth={1.5}
              style={{ animation: `mrc-dot ${1.6 + i * 0.28}s ease ${i * 0.18}s infinite` }}
            />
          );
        })}

        {/* Center */}
        <circle cx={cx} cy={cy} r={24} fill="rgba(4,6,15,0.75)" />
        <text x={cx} y={cy - 4}  textAnchor="middle" fontSize={22} fontWeight={900} fill="rgba(255,255,255,0.92)" fontFamily="JetBrains Mono, monospace">78</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={7}  fontWeight={700} fill="rgba(255,255,255,0.26)" letterSpacing={1.4}>SCORE</text>
      </svg>

      {/* Legend — 5 items in 2-col grid (last spans) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", width: "100%", padding: "0 6px" }}>
        {DIMS.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.42)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.label}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: d.color, fontFamily: "JetBrains Mono, monospace", opacity: 0.85 }}>{d.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Micro-viz: Brand DNA bars ─────────────────────────────────────────────────

function BrandDNA() {
  const attrs = [
    { label: "Confiança",    score: 91, color: "#10b981" },
    { label: "Inovador",     score: 78, color: "#8b5cf6" },
    { label: "Premium",      score: 74, color: "#f59e0b" },
    { label: "Acessível",    score: 62, color: "#3b82f6" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {attrs.map(a => (
        <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", minWidth: 62 }}>{a.label}</span>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${a.score}%`, borderRadius: 2, background: a.color, opacity: 0.72 }} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: a.color, fontFamily: "JetBrains Mono, monospace", minWidth: 26, opacity: 0.85 }}>{a.score}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Micro-viz: Price positioning ─────────────────────────────────────────────

function PricePosition() {
  const competitors = [
    { label: "C", pct: 24 },
    { label: "A", pct: 71 },
    { label: "B", pct: 86 },
  ];
  const youPct = 52;
  return (
    <div>
      {/* Position bar */}
      <div style={{ position: "relative", height: 36, marginBottom: 8 }}>
        {/* Track */}
        <div style={{ position: "absolute", top: 16, left: 0, right: 0, height: 3, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))" }} />
        {/* Competitors */}
        {competitors.map(c => (
          <div key={c.label} style={{
            position: "absolute", top: 9, left: `${c.pct}%`, transform: "translateX(-50%)",
            width: 18, height: 18, borderRadius: "50%",
            background: "rgba(239,68,68,0.12)", border: "1.5px solid rgba(239,68,68,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 7, fontWeight: 800, color: "rgba(239,68,68,0.65)" }}>{c.label}</span>
          </div>
        ))}
        {/* You */}
        <div style={{
          position: "absolute", top: 7, left: `${youPct}%`, transform: "translateX(-50%)",
          width: 22, height: 22, borderRadius: "50%",
          background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 14px rgba(16,185,129,0.35)",
          animation: "mrc-glow 2.4s ease infinite",
        }}>
          <span style={{ fontSize: 7, fontWeight: 900, color: "#10b981" }}>V</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)", letterSpacing: 0.5 }}>Econômico</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)", letterSpacing: 0.5 }}>Premium</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
        Posicionado no <span style={{ color: "rgba(16,185,129,0.7)", fontWeight: 700 }}>mid-premium</span> — 23% abaixo de A e B com qualidade equivalente
      </div>
    </div>
  );
}

// ─── Micro-viz: Innovation pipeline ───────────────────────────────────────────

function InovacaoPipeline() {
  const stages = [
    { label: "Feature A", qtr: "Q1", status: "done"   },
    { label: "Feature B", qtr: "Q2", status: "done"   },
    { label: "Feature C", qtr: "Q3", status: "active" },
    { label: "Feature D", qtr: "Q4", status: "todo"   },
  ];
  const colorMap: Record<string, string> = {
    done:   "#10b981",
    active: "#f59e0b",
    todo:   "rgba(255,255,255,0.14)",
  };
  return (
    <div>
      {/* Timeline */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ position: "absolute", top: 9, left: 9, right: 9, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {stages.map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: colorMap[s.status],
                boxShadow: s.status === "active" ? "0 0 12px rgba(245,158,11,0.55)" : "none",
                opacity: s.status === "todo" ? 0.35 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: s.status === "active" ? "mrc-glow 2s ease infinite" : "none",
              }}>
                {s.status === "done" && (
                  <svg width={9} height={9} viewBox="0 0 9 9">
                    <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" fill="none" stroke="rgba(4,6,15,0.9)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.5 }}>{s.qtr}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Stat row */}
      <div style={{ display: "flex", gap: 14 }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>Entregues</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#10b981", fontFamily: "JetBrains Mono, monospace" }}>2</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>Em curso</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#f59e0b", fontFamily: "JetBrains Mono, monospace" }}>1</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>Roadmap</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>1</div>
        </div>
      </div>
    </div>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────

interface MrcModule {
  id: string; label: string; Icon: any; href: string;
  metric: string; metricSub: string; insight: string;
  viz: React.ReactNode;
  accentColor: string;
}

const MODULES: MrcModule[] = [
  {
    id: "MRC-001", label: "DNA da Marca",  Icon: Fingerprint, href: "/dna",
    metric: "4",    metricSub: "atributos core mapeados",
    insight: "Consistência (91%) é o ativo mais forte e o menos comunicado externamente",
    viz: <BrandDNA />,
    accentColor: "rgba(16,185,129,0.85)",
  },
  {
    id: "MRC-002", label: "Precificação",  Icon: DollarSign,  href: "/precificacao",
    metric: "23%",  metricSub: "gap vs. concorrentes A e B",
    insight: "Oportunidade de reposicionamento — qualidade percebida equivalente a preço superior",
    viz: <PricePosition />,
    accentColor: "rgba(245,158,11,0.85)",
  },
  {
    id: "MRC-003", label: "Inovação",      Icon: Lightbulb,   href: "/inovacao",
    metric: "3",    metricSub: "features lançadas",
    insight: "Inovação real (78%) não se converte em percepção — gap de narrativa identificado",
    viz: <InovacaoPipeline />,
    accentColor: "rgba(139,92,246,0.85)",
  },
];

function ModuleCard({ mod }: { mod: MrcModule }) {
  const { Icon } = mod;
  return (
    <Link
      to={mod.href as any}
      style={{
        display: "block", textDecoration: "none", borderRadius: 14,
        overflow: "hidden", position: "relative",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px) saturate(170%)",
        WebkitBackdropFilter: "blur(16px) saturate(170%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background  = "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.13)";
        el.style.transform   = "translateY(-2px)";
        el.style.boxShadow   = "0 8px 28px -8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background  = "rgba(255,255,255,0.03)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.transform   = "translateY(0)";
        el.style.boxShadow   = "0 4px 20px -8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset";
      }}
    >
      {/* Accent strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${mod.accentColor}, transparent)` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, width: "38%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)", animation: "mrc-shimmer 8s ease infinite", pointerEvents: "none" }} />

      <div style={{ padding: "18px 18px 16px", position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: mod.accentColor.replace("0.85", "0.1"),
            border: `1px solid ${mod.accentColor.replace("0.85", "0.22")}`,
          }}>
            <Icon size={14} strokeWidth={2} style={{ color: mod.accentColor }} />
          </div>
          <div>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: mod.accentColor.replace("0.85","0.5"), marginBottom: 2 }}>{mod.id}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)" }}>{mod.label}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(16,185,129,0.85)" }} />
            <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(16,185,129,0.7)", letterSpacing: 0.8 }}>ATIVO</span>
          </div>
        </div>

        {/* Metric */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: mod.accentColor, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{mod.metric}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 3 }}>{mod.metricSub}</div>
        </div>

        {/* Visualization */}
        <div style={{ marginBottom: 12 }}>{mod.viz}</div>

        {/* Insight */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", lineHeight: 1.5, flex: 1 }}>{mod.insight}</span>
          <ArrowUpRight size={11} style={{ color: mod.accentColor.replace("0.85","0.45"), flexShrink: 0, marginTop: 1 }} />
        </div>
      </div>
    </Link>
  );
}

// ─── Brand intelligence insights ──────────────────────────────────────────────

const INSIGHTS = [
  {
    label: "DIFERENCIAÇÃO CONFIRMADA",
    text: "Consistência de marca (91%) é o maior diferencial frente à concorrência — e paradoxalmente, o atributo menos comunicado. Há gap mensurável entre ativo real e percepção de mercado.",
    color: "rgba(16,185,129,0.85)", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)",
  },
  {
    label: "BRECHA DE PRECIFICAÇÃO",
    text: "Concorrentes A e B precificam 23% acima com percepção de qualidade equivalente. Reposicionamento de preço poderia aumentar margem sem perda de volume projetada superior a 12%.",
    color: "rgba(245,158,11,0.85)", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)",
  },
  {
    label: "INOVAÇÃO INVISÍVEL",
    text: "3 features lançadas nos últimos 6 meses não converteram em ganho de percepção de inovação. Score de inovação (78%) é subestimado pelo mercado — gap de narrativa, não de produto.",
    color: "rgba(139,92,246,0.85)", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.16)",
  },
  {
    label: "RECONHECIMENTO: ALERTA",
    text: "Reconhecimento (65%) é o vértice mais frágil do pentágono. 34% do público-alvo não associa o produto ao problema que ele resolve. Ação de posicionamento é prioridade imediata.",
    color: "rgba(236,72,153,0.8)", bg: "rgba(236,72,153,0.06)", border: "rgba(236,72,153,0.16)",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function MarcaDashboard() {
  return (
    <>
      <style>{KF}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 18, marginBottom: 20, overflow: "hidden", position: "relative",
        background: "radial-gradient(ellipse at 72% 38%, rgba(16,185,129,0.07) 0%, rgba(139,92,246,0.04) 40%, rgba(4,6,15,0) 70%), rgba(255,255,255,0.025)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
      }}>
        {/* Accent line — emerald → violet → amber */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(16,185,129,0.6), rgba(139,92,246,0.55), rgba(245,158,11,0.4), transparent)" }} />

        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Left — identity + metrics */}
          <div style={{ flex: 1, padding: "28px 28px 24px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(16,185,129,0.6)", marginBottom: 6 }}>
              GRUPO DE INTELIGÊNCIA · MIOS
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,0.94)", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>
              Marca & Produto
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24, lineHeight: 1.5 }}>
              Identidade, posicionamento, percepção de valor e ciclo de inovação do seu produto.
            </div>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "BRAND SCORE", value: "78",   sub: "/ 100",         color: "#10b981"               },
                { label: "NPS",         value: "+67",  sub: "brand loyalty",  color: "rgba(139,92,246,0.85)" },
                { label: "PMF SCORE",   value: "74%",  sub: "product-market", color: "rgba(245,158,11,0.85)" },
                { label: "COBERTURA",   value: "3/3",  sub: "módulos ativos", color: "rgba(16,185,129,0.85)" },
              ].map(m => (
                <div key={m.label} style={{
                  padding: "10px 12px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px) saturate(160%)",
                  WebkitBackdropFilter: "blur(12px) saturate(160%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 2px 12px -4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04) inset",
                }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.28)", marginBottom: 5 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 2 }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Coverage bar — tri-color */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.28)" }}>COBERTURA DO GRUPO</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(16,185,129,0.7)", fontFamily: "JetBrains Mono, monospace" }}>3/3 · Completo</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", borderRadius: 2, background: "linear-gradient(90deg, rgba(16,185,129,0.8), rgba(139,92,246,0.7), rgba(245,158,11,0.75))" }} />
              </div>
            </div>
          </div>

          {/* Right — BrandPolygon */}
          <div style={{
            flexShrink: 0, width: 296, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 78%)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            padding: "22px 20px",
          }}>
            {/* Label */}
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.22)", marginBottom: 14 }}>BRAND POLYGON</div>
            <BrandPolygon />
          </div>
        </div>
      </div>

      {/* ── Module grid — 3 columns ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>MÓDULOS DE INTELIGÊNCIA DE MARCA</span>
          <span style={{ fontSize: 9, color: "rgba(16,185,129,0.6)", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>3/3 ATIVOS</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {MODULES.map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
      </div>

      {/* ── Brand intelligence — 2x2 ─────────────────────────────────────────── */}
      <div style={{ marginTop: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>INTELIGÊNCIA DE MARCA</span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {INSIGHTS.map(ins => (
            <div key={ins.label} style={{
              padding: "16px 18px", borderRadius: 12,
              background: ins.bg,
              backdropFilter: "blur(14px) saturate(170%)",
              WebkitBackdropFilter: "blur(14px) saturate(170%)",
              border: `1px solid ${ins.border}`,
              boxShadow: "0 4px 20px -8px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
            }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: ins.color, letterSpacing: 1.5, marginBottom: 8 }}>{ins.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", lineHeight: 1.65 }}>{ins.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mentor contextualizado ────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 14, padding: "20px 22px", position: "relative", overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px -10px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), rgba(139,92,246,0.4), transparent)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.03), transparent)", animation: "mrc-shimmer 7s ease infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Brain size={17} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "mrc-pulse 2s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: "#ff9500" }}>MENTOR IA · VISÃO DE MARCA & PRODUTO</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, marginBottom: 14 }}>
              O pentágono revela algo contraintuitivo: a marca tem mais força do que ela própria comunica.
              Consistência (91%) e diferenciação (82%) são sólidas — mas reconhecimento (65%) e percepção
              de valor ainda não acompanham. O próximo movimento não é construir mais produto;
              é fechar o gap entre o que a marca <em style={{ color: "rgba(255,255,255,0.7)", fontStyle: "normal", fontWeight: 600 }}>é</em> e o que o mercado <em style={{ color: "rgba(255,255,255,0.7)", fontStyle: "normal", fontWeight: 600 }}>enxerga</em>.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Ver DNA",        href: "/dna"          },
                { label: "Ver Precificação", href: "/precificacao" },
                { label: "Conversar",      href: "/mentor", primary: true },
              ].map(cta => (
                <Link key={cta.label} to={cta.href as any} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                  borderRadius: 8, textDecoration: "none",
                  background: (cta as any).primary ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${(cta as any).primary ? "rgba(255,149,0,0.30)" : "rgba(255,255,255,0.07)"}`,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: (cta as any).primary ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.5)" }}>{cta.label}</span>
                  <ArrowUpRight size={10} style={{ color: (cta as any).primary ? "rgba(255,149,0,0.6)" : "rgba(255,255,255,0.3)" }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
