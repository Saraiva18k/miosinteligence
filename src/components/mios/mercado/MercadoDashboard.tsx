import { Link } from "@tanstack/react-router";
import {
  Globe, Target, TrendingUp, MessageSquare,
  Activity, BarChart3, Network,
  ArrowUpRight, Brain, Zap,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes radar-spin   { from { transform: rotate(0deg) }  to { transform: rotate(360deg) } }
@keyframes radar-blip   { 0%,100%{opacity:0.9;r:4}          50%{opacity:0.4;r:2.5}           }
@keyframes radar-trail  { 0%{opacity:0.35} 100%{opacity:0}  }
@keyframes mkt-shimmer  { 0%{transform:translateX(-120%)}   100%{transform:translateX(220%)} }
@keyframes mkt-pulse    { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
@keyframes mkt-ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes mkt-fadein   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes mkt-ring     { from{stroke-dashoffset:251} to{stroke-dashoffset:66} }
@keyframes mkt-scan     { 0%,100%{opacity:0} 10%,90%{opacity:1} }
`;

// ─── Radar SVG ────────────────────────────────────────────────────────────────

function RadarViz() {
  const cx = 130, cy = 130, R = 120;
  const rings = [R * 0.28, R * 0.55, R * 0.78, R];
  // Competitor blips: [angle°, radius_fraction, color, label]
  const blips: [number, number, string, string][] = [
    [42,  0.68, "rgba(239,68,68,0.9)",  "A"],
    [115, 0.82, "rgba(239,68,68,0.7)",  "B"],
    [200, 0.52, "rgba(239,68,68,0.65)", "C"],
    [290, 0.74, "rgba(239,68,68,0.55)", "D"],
    [330, 0.91, "rgba(239,68,68,0.45)", "E"],
    [168, 0.35, "rgba(255,149,0,0.95)", "YOU"],
  ];

  return (
    <svg width={260} height={260} style={{ overflow: "visible", flexShrink: 0 }}>
      {/* Rings */}
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`rgba(255,149,0,${0.04 + i * 0.02})`}
          strokeWidth="1"
          strokeDasharray={i === rings.length - 1 ? "3 4" : undefined}
        />
      ))}
      {/* Cross hairs */}
      <line x1={cx} y1={cy - R - 4} x2={cx} y2={cy + R + 4} stroke="rgba(255,149,0,0.05)" strokeWidth="1" />
      <line x1={cx - R - 4} y1={cy} x2={cx + R + 4} y2={cy} stroke="rgba(255,149,0,0.05)" strokeWidth="1" />

      {/* Rotating scan group */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "radar-spin 5s linear infinite" }}>
        {/* Sweep sector */}
        <path
          d={`M ${cx} ${cy} L ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx + R * Math.sin((75 * Math.PI) / 180)} ${cy - R * Math.cos((75 * Math.PI) / 180)} Z`}
          fill="url(#sweep-grad)"
          opacity="0.55"
        />
        {/* Leading edge */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - R}
          stroke="rgba(255,149,0,0.8)" strokeWidth="1.5"
        />
      </g>

      <defs>
        <radialGradient id="sweep-grad" cx="0%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="rgba(255,149,0,0)"    />
          <stop offset="100%" stopColor="rgba(255,149,0,0.18)" />
        </radialGradient>
      </defs>

      {/* Blips */}
      {blips.map(([angle, frac, color, label]) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const bx = cx + R * frac * Math.cos(rad);
        const by = cy + R * frac * Math.sin(rad);
        const isYou = label === "YOU";
        return (
          <g key={label}>
            {/* Ping ring for YOU */}
            {isYou && <circle cx={bx} cy={by} r={10} fill="none" stroke="rgba(255,149,0,0.3)" strokeWidth="1" style={{ animation: "mkt-pulse 2s ease infinite" }} />}
            <circle cx={bx} cy={by} r={isYou ? 5 : 4}
              fill={color}
              style={{ animation: `radar-blip ${1.5 + Math.random()}s ease infinite` }}
            />
            <text x={bx + (isYou ? 8 : 7)} y={by + 4}
              fontSize={isYou ? 9 : 8} fontWeight={isYou ? 800 : 600}
              fill={color} fontFamily="JetBrains Mono, monospace"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Score ring overlay */}
      <circle cx={cx} cy={cy} r={18} fill="rgba(4,6,15,0.85)" stroke="rgba(255,149,0,0.2)" strokeWidth="1" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={900} fill="#ff9500" fontFamily="JetBrains Mono, monospace">74</text>
    </svg>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 80, h = 28;
  const min = Math.min(...points), max = Math.max(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(v => h - ((v - min) / (max - min + 1)) * h);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.slice(5, 10)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.slice(5, 10)})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Gauge ────────────────────────────────────────────────────────────────────

function Gauge({ value, color }: { value: number; color: string }) {
  const r = 22, circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100) * 0.75;
  return (
    <svg width={54} height={36} viewBox="0 0 54 36">
      <path d={`M 6 34 A 22 22 0 0 1 48 34`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" strokeLinecap="round" />
      <path d={`M 6 34 A 22 22 0 0 1 48 34`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${circ * 0.75}`}
        strokeDashoffset={offset}
      />
      <text x={27} y={30} textAnchor="middle" fontSize={10} fontWeight={800} fill={color} fontFamily="JetBrains Mono, monospace">{value}</text>
    </svg>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────

interface ModDef {
  id: string; label: string; Icon: any; href: string;
  status: "done" | "new";
  metric?: string; metricSub?: string;
  insight?: string;
  viz?: React.ReactNode;
  accentColor?: string;
}

function ModuleCard({ mod, large }: { mod: ModDef; large?: boolean }) {
  const { Icon } = mod;
  const done     = mod.status === "done";
  const accent   = mod.accentColor ?? "rgba(255,149,0,0.85)";

  return (
    <Link
      to={mod.href as any}
      style={{
        display: "block", textDecoration: "none",
        borderRadius: 14, overflow: "hidden", position: "relative",
        background: done
          ? "rgba(255,255,255,0.025)"
          : "rgba(255,255,255,0.015)",
        border: `1px solid ${done ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
        transition: "all 0.2s ease",
        ...(large ? { gridColumn: "span 1" } : {}),
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background   = done ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)";
        el.style.borderColor  = done ? "rgba(255,149,0,0.22)"   : "rgba(255,255,255,0.07)";
        el.style.transform    = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background   = done ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)";
        el.style.borderColor  = done ? "rgba(255,255,255,0.08)"  : "rgba(255,255,255,0.04)";
        el.style.transform    = "translateY(0)";
      }}
    >
      {/* Shimmer on hover */}
      {done && <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent)", animation: "mkt-shimmer 7s ease infinite", pointerEvents: "none" }} />}

      {/* Color accent strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: done ? `linear-gradient(90deg, ${accent}, transparent)` : "transparent" }} />

      <div style={{ padding: large ? "20px 20px 18px" : "16px 16px 14px", position: "relative" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: done ? `rgba(255,149,0,0.08)` : "rgba(255,255,255,0.04)",
              border: `1px solid ${done ? "rgba(255,149,0,0.18)" : "rgba(255,255,255,0.06)"}`,
            }}>
              <Icon size={14} strokeWidth={2} style={{ color: done ? accent : "rgba(255,255,255,0.22)" }} />
            </div>
            <div>
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: done ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.2)", marginBottom: 2 }}>
                {mod.id}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: done ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.32)" }}>
                {mod.label}
              </div>
            </div>
          </div>

          {done ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(16,185,129,0.85)" }} />
              <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(16,185,129,0.7)", letterSpacing: 0.8 }}>ATIVO</span>
            </div>
          ) : (
            <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.22)", letterSpacing: 0.8, border: "1px solid rgba(255,255,255,0.06)" }}>
              EM BREVE
            </span>
          )}
        </div>

        {/* Metric + viz */}
        {done && mod.metric ? (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: large ? 32 : 26, fontWeight: 900, color: accent, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{mod.metric}</div>
              {mod.metricSub && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{mod.metricSub}</div>}
            </div>
            {mod.viz && <div>{mod.viz}</div>}
          </div>
        ) : !done ? (
          <div style={{ marginBottom: 10 }}>
            {/* Redacted lines for new modules */}
            {[100, 75, 88].map((w, i) => (
              <div key={i} style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", marginBottom: 5, width: `${w}%` }} />
            ))}
          </div>
        ) : null}

        {/* Insight */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 10, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 10, color: done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)", lineHeight: 1.5, flex: 1 }}>
            {done ? mod.insight : mod.insight}
          </span>
          {done && <ArrowUpRight size={11} style={{ color: "rgba(255,149,0,0.4)", flexShrink: 0, marginTop: 1 }} />}
        </div>

      </div>
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const MODULES: ModDef[] = [
  {
    id: "MKT-001", label: "Concorrentes",     Icon: Target,       href: "/concorrentes", status: "done",
    metric: "5",     metricSub: "players ativos",
    insight: "NPS médio 3.2 · gap de confiança como alavanca de entrada",
    viz: <Sparkline points={[3.8,3.5,3.2,3.6,3.1,3.2]} color="rgba(239,68,68,0.7)" />,
    accentColor: "rgba(239,68,68,0.8)",
  },
  {
    id: "MKT-002", label: "Tendências",       Icon: TrendingUp,   href: "/tendencias",   status: "done",
    metric: "+340%", metricSub: "busca em 6 meses",
    insight: "Janela de entrada crítica: próximos 90 dias",
    viz: <Sparkline points={[40,55,70,110,180,280,340]} color="rgba(255,149,0,0.8)" />,
  },
  {
    id: "MKT-003", label: "Sentimento",       Icon: MessageSquare,href: "/sentimento",   status: "done",
    metric: "89%",   metricSub: "percepção positiva",
    insight: "Score 7.2 · principal driver: inovação e confiança",
    viz: <Gauge value={89} color="rgba(16,185,129,0.85)" />,
    accentColor: "rgba(16,185,129,0.8)",
  },
  {
    id: "MKT-004", label: "Pulso do Mercado", Icon: Activity,     href: "/pulso",        status: "new",
    insight: "Sinais contínuos de mercado em tempo real, filtrados para o seu contexto",
  },
  {
    id: "MKT-005", label: "Benchmarking",     Icon: BarChart3,    href: "/benchmarking", status: "new",
    insight: "Compare suas métricas com os benchmarks reais do setor",
  },
  {
    id: "MKT-006", label: "Stakeholders",     Icon: Network,      href: "/stakeholders", status: "new",
    insight: "Mapeie investidores, parceiros e influenciadores do ecossistema",
  },
];

const INSIGHTS = [
  { type: "opportunity", color: "rgba(16,185,129,0.85)", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)", label: "OPORTUNIDADE", text: "Janela 22h–23h sem cobertura por nenhum dos 5 concorrentes mapeados — ativação exclusiva viável." },
  { type: "risk",        color: "rgba(239,68,68,0.8)",   bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.14)",   label: "RISCO",        text: "Tendência de +340% pode saturar em 120 dias — cada semana de atraso reduz a vantagem competitiva." },
  { type: "signal",      color: "rgba(255,149,0,0.85)",  bg: "rgba(255,149,0,0.06)",   border: "rgba(255,149,0,0.14)",   label: "CONVERGÊNCIA", text: "NPS baixo (3.2) + sentimento de inovação (89%) + tendência acelerando: entrada premium justificada." },
];

export function MercadoDashboard() {
  return (
    <>
      <style>{KF}</style>

      {/* ── Hero — Radar + Identity ───────────────────────────────────────── */}
      <div style={{
        borderRadius: 18, marginBottom: 20, overflow: "hidden", position: "relative",
        background: "radial-gradient(ellipse at 20% 50%, rgba(255,149,0,0.07) 0%, rgba(4,6,15,0) 60%), rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(255,149,0,0.6), rgba(255,149,0,0.1), transparent)" }} />

        <div style={{ display: "flex", alignItems: "stretch" }}>

          {/* Left — identity + metrics */}
          <div style={{ flex: 1, padding: "28px 28px 24px" }}>

            <div style={{ marginBottom: 6, fontSize: 8, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(255,149,0,0.45)" }}>
              GRUPO DE INTELIGÊNCIA · MIOS
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,0.94)", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>
              Mercado
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24, lineHeight: 1.5 }}>
              Inteligência competitiva, tendências e percepção de mercado em tempo real.
            </div>

            {/* Metric strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "SCORE",       value: "74",  sub: "inteligência",  color: "#ff9500"              },
                { label: "PLAYERS",     value: "5",   sub: "mapeados",      color: "rgba(239,68,68,0.85)" },
                { label: "TENDÊNCIA",   value: "+340%",sub: "em 6m",        color: "rgba(255,149,0,0.8)"  },
                { label: "SENTIMENTO",  value: "89%", sub: "positivo",      color: "rgba(16,185,129,0.85)"},
              ].map(m => (
                <div key={m.label} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.28)", marginBottom: 5 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 2 }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.28)" }}>COBERTURA DO GRUPO</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace" }}>3/6 módulos</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "50%", borderRadius: 2, background: "linear-gradient(90deg, rgba(255,149,0,0.9), rgba(255,149,0,0.4))" }} />
              </div>
            </div>
          </div>

          {/* Right — radar */}
          <div style={{
            flexShrink: 0, width: 280, display: "flex", alignItems: "center", justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            background: "radial-gradient(ellipse at center, rgba(255,149,0,0.04) 0%, transparent 70%)",
            padding: "20px 10px",
          }}>
            <RadarViz />
          </div>

        </div>
      </div>

      {/* ── Module grid — asymmetric ──────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>MÓDULOS DE INTELIGÊNCIA</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>3 ATIVOS · 3 EM BREVE</span>
        </div>

        {/* Row 1: 3 done modules */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          {MODULES.slice(0, 3).map((m, i) => <ModuleCard key={m.id} mod={m} large={i === 0} />)}
        </div>

        {/* Row 2: 3 new modules — different treatment */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {MODULES.slice(3).map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
      </div>

      {/* ── Cross-insights ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>SÍNTESE CRUZADA</span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {INSIGHTS.map(ins => (
            <div key={ins.label} style={{ padding: "14px 16px", borderRadius: 12, background: ins.bg, border: `1px solid ${ins.border}` }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: ins.color, letterSpacing: 1.5, marginBottom: 8 }}>{ins.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{ins.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mentor contextualizado ────────────────────────────────────────── */}
      <div style={{
        borderRadius: 14, padding: "20px 22px", position: "relative", overflow: "hidden",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.4), transparent)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.03), transparent)", animation: "mkt-shimmer 6s ease infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Brain size={17} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "mkt-pulse 2s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: "#ff9500" }}>MENTOR IA · VISÃO DO MERCADO</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 14 }}>
              Três sinais se convergem aqui: sentimento positivo alto, concorrência vulnerável e tendência acelerando.
              Essa combinação acontece raramente. A janela de entrada existe — e tem prazo de 90 dias.
              Ativar o Pulso do Mercado agora é prioritário para monitorar se essa janela começa a fechar.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Ativar Pulso", href: "/pulso" },
                { label: "Ver Veredito", href: "/veredito" },
                { label: "Conversar",    href: "/mentor", primary: true },
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
