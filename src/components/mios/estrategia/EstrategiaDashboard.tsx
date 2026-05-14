import { Link } from "@tanstack/react-router";
import {
  FileText, TrendingUp, ShieldCheck, MapPin, Target,
  ArrowUpRight, Brain, Lock,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes est-shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
@keyframes est-pulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
@keyframes est-fadein  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes est-glow    { 0%,100%{opacity:0.35} 50%{opacity:0.85} }
@keyframes est-ping    { 0%{r:14;opacity:0.5} 100%{r:22;opacity:0} }
@keyframes est-dash    { to{stroke-dashoffset:-12} }
`;

// ─── Strategic Matrix (2×2 bubble chart) ─────────────────────────────────────

const INITIATIVES = [
  { label: "BP",  name: "Business Plan", readiness: 84, impact: 88, color: "#06b6d4", r: 15, done: true  },
  { label: "INV", name: "Investimento",  readiness: 72, impact: 82, color: "#3b82f6", r: 13, done: true  },
  { label: "CMP", name: "Compliance",    readiness: 91, impact: 60, color: "#f59e0b", r: 11, done: true  },
  { label: "CEN", name: "Cenários",      readiness: 28, impact: 84, color: "#8b5cf6", r: 13, done: false },
  { label: "OKR", name: "OKR",           readiness: 42, impact: 74, color: "#10b981", r: 11, done: false },
];

function StrategicMatrix() {
  const W = 210, H = 210, cx = 105, cy = 105, scale = 1.82;

  function pos(readiness: number, impact: number): [number, number] {
    return [cx + (readiness - 50) * scale, cy - (impact - 50) * scale];
  }

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <defs>
        <filter id="est-gf">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Q1 highlight — high impact, high readiness */}
      <rect x={cx} y={0} width={cx} height={cy} rx={4}
        fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.08)" strokeWidth={0.5} />

      {/* Grid lines */}
      <line x1={cx} y1={4}   x2={cx} y2={H-4} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
      <line x1={4}   y1={cy} x2={W-4} y2={cy} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />

      {/* Quadrant labels */}
      <text x={cx+5}  y={12}   fontSize={6.5} fontWeight={800} fill="rgba(6,182,212,0.55)"  letterSpacing={1}>PRIORIDADE</text>
      <text x={5}     y={12}   fontSize={6.5} fontWeight={700} fill="rgba(255,255,255,0.2)"  letterSpacing={0.8}>PREPARAR</text>
      <text x={cx+5}  y={H-5}  fontSize={6.5} fontWeight={700} fill="rgba(255,255,255,0.18)" letterSpacing={0.8}>EXECUTAR</text>
      <text x={5}     y={H-5}  fontSize={6.5} fontWeight={700} fill="rgba(255,255,255,0.14)" letterSpacing={0.8}>MONITORAR</text>

      {/* Axis labels */}
      <text x={W/2} y={H+2} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.2)" letterSpacing={0.5}>PRONTIDÃO →</text>
      <text x={-4} y={H/2} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.2)" letterSpacing={0.5}
        transform={`rotate(-90 -4 ${H/2})`}>↑ IMPACTO</text>

      {/* Bubbles */}
      {INITIATIVES.map((init) => {
        const [x, y] = pos(init.readiness, init.impact);
        return (
          <g key={init.label}>
            {/* Ping for active done items */}
            {init.done && (
              <circle cx={x} cy={y} r={init.r}
                fill="none" stroke={init.color} strokeWidth={1}
                opacity={0.25}
                style={{ animation: `est-ping 2.4s ease-out ${INITIATIVES.indexOf(init) * 0.5}s infinite` }}
              />
            )}
            {/* Dashed ring for pending */}
            {!init.done && (
              <circle cx={x} cy={y} r={init.r + 5}
                fill="none" stroke={init.color} strokeWidth={1}
                strokeDasharray="4 3" opacity={0.35}
                style={{ animation: "est-dash 1.2s linear infinite" }}
              />
            )}
            {/* Main bubble */}
            <circle cx={x} cy={y} r={init.r}
              fill={init.done ? `${init.color}1a` : "rgba(255,255,255,0.03)"}
              stroke={init.color} strokeWidth={init.done ? 1.5 : 1}
              opacity={init.done ? 1 : 0.55}
              filter={init.done ? "url(#est-gf)" : undefined}
            />
            {/* Label */}
            <text x={x} y={y + 0.5}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={init.done ? 7 : 6.5} fontWeight={900}
              fill={init.color} opacity={init.done ? 1 : 0.5}>
              {init.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Micro-viz: Exec progress bars ────────────────────────────────────────────

function ExecBars() {
  const metrics = [
    { label: "Receita projetada",  pct: 67, color: "#06b6d4" },
    { label: "Margem operacional", pct: 54, color: "#3b82f6" },
    { label: "Ratio CAC / LTV",    pct: 82, color: "#10b981" },
    { label: "Runway restante",    pct: 71, color: "#f59e0b" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {metrics.map(m => (
        <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", minWidth: 110, flex: "0 0 110px" }}>{m.label}</span>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${m.pct}%`, borderRadius: 2, background: m.color, opacity: 0.75 }} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: m.color, fontFamily: "JetBrains Mono, monospace", minWidth: 28, opacity: 0.9 }}>{m.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Micro-viz: Funding track ─────────────────────────────────────────────────

function FundingTrack() {
  const stages: { label: string; done: boolean; active?: boolean; next?: boolean }[] = [
    { label: "Pre-seed", done: true  },
    { label: "Seed",     done: true, active: true },
    { label: "Series A", done: false, next: true   },
    { label: "Series B", done: false },
  ];
  return (
    <div>
      <div style={{ position: "relative", height: 32, marginBottom: 8 }}>
        {/* Track line */}
        <div style={{ position: "absolute", top: 14, left: 12, right: 12, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
          <div style={{ width: "38%", height: "100%", background: "linear-gradient(90deg, rgba(6,182,212,0.7), rgba(59,130,246,0.7))", borderRadius: 1 }} />
        </div>
        {/* Nodes */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {stages.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: s.active ? "rgba(59,130,246,0.15)" : s.done ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                border: `${s.active ? 2 : 1.5}px solid ${s.active ? "rgba(59,130,246,0.8)" : s.done ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.12)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: s.active ? "0 0 14px rgba(59,130,246,0.4)" : "none",
                animation: s.active ? "est-glow 2s ease infinite" : "none",
              }}>
                {s.done && !s.active && (
                  <svg width={8} height={8} viewBox="0 0 8 8">
                    <polyline points="1,4 3,6 7,2" fill="none" stroke="rgba(6,182,212,0.8)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {s.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(59,130,246,0.85)" }} />}
                {s.next && <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>→</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {stages.map((s, i) => (
          <span key={i} style={{ fontSize: 7.5, fontWeight: s.active ? 700 : 500, color: s.active ? "rgba(59,130,246,0.8)" : s.done ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.15)", textAlign: "center", width: "25%", letterSpacing: 0.3 }}>{s.label}</span>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
        Rodada <span style={{ color: "rgba(59,130,246,0.75)", fontWeight: 700 }}>Seed ativa</span> — preparação para Series A estimada em <span style={{ color: "rgba(6,182,212,0.65)", fontWeight: 600 }}>Q2 / 2027</span>
      </div>
    </div>
  );
}

// ─── Micro-viz: Compliance badges ────────────────────────────────────────────

function ComplianceBadges() {
  const areas = [
    { label: "LGPD",       status: "ok",      color: "#10b981" },
    { label: "Tributário", status: "ok",      color: "#10b981" },
    { label: "Trabalhista",status: "ok",      color: "#10b981" },
    { label: "ISO 27001",  status: "pending", color: "#f59e0b" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      {areas.map(a => (
        <div key={a.label} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8,
          background: a.status === "ok" ? "rgba(16,185,129,0.07)" : "rgba(245,158,11,0.07)",
          border: `1px solid ${a.status === "ok" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: a.color,
            animation: a.status === "pending" ? "est-glow 1.6s ease infinite" : "none",
          }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: a.color, letterSpacing: 0.4 }}>{a.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── New module teaser ────────────────────────────────────────────────────────

function NewModuleTeaser({ color }: { color: string }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Blurred fake bars */}
      <div style={{ filter: "blur(3px)", opacity: 0.3, display: "flex", flexDirection: "column", gap: 5, pointerEvents: "none" }}>
        {[78, 52, 91, 64].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 70, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: color, opacity: 0.7, flex: 1 }} />
          </div>
        ))}
      </div>
      {/* Lock overlay */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 7, flexDirection: "column",
      }}>
        <Lock size={14} style={{ color: `${color}`, opacity: 0.7 }} />
        <span style={{ fontSize: 8, fontWeight: 800, color, opacity: 0.65, letterSpacing: 1.2 }}>EM CONFIGURAÇÃO</span>
      </div>
    </div>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────

interface EstModule {
  id: string; label: string; Icon: any; href: string;
  metric: string; metricSub: string; insight: string;
  viz: React.ReactNode;
  accentColor: string;
  isNew?: boolean;
}

const MODULES: EstModule[] = [
  {
    id: "EST-001", label: "Business Plan",  Icon: FileText,    href: "/business-plan",
    metric: "74%",  metricSub: "execução do plano",
    insight: "Ritmo 18% acima da média setorial — requer calibração de recursos para sustentabilidade",
    viz: <ExecBars />,
    accentColor: "rgba(6,182,212,0.85)",
  },
  {
    id: "EST-002", label: "Investimento",   Icon: TrendingUp,  href: "/investimento",
    metric: "3.2×", metricSub: "potencial de alavancagem",
    insight: "Gap CAC×LTV identifica janela de 90 dias para reposicionamento pré-rodada",
    viz: <FundingTrack />,
    accentColor: "rgba(59,130,246,0.85)",
  },
  {
    id: "EST-003", label: "Compliance",     Icon: ShieldCheck, href: "/compliance",
    metric: "3/4",  metricSub: "áreas certificadas",
    insight: "ISO 27001 em andamento — pendência crítica para abertura de rodada institucional",
    viz: <ComplianceBadges />,
    accentColor: "rgba(245,158,11,0.85)",
  },
  {
    id: "EST-004", label: "Cenários",       Icon: MapPin,      href: "/cenarios",
    metric: "—",    metricSub: "em configuração",
    insight: "3 cenários estratégicos identificados sem mapeamento formal — risco de decisão cega",
    viz: <NewModuleTeaser color="#8b5cf6" />,
    accentColor: "rgba(139,92,246,0.7)",
    isNew: true,
  },
  {
    id: "EST-005", label: "OKR",            Icon: Target,      href: "/okr",
    metric: "—",    metricSub: "em configuração",
    insight: "Metas de ciclo definidas sem framework de acompanhamento — desvio silencioso detectado",
    viz: <NewModuleTeaser color="#10b981" />,
    accentColor: "rgba(16,185,129,0.7)",
    isNew: true,
  },
];

function ModuleCard({ mod }: { mod: EstModule }) {
  const { Icon } = mod;
  return (
    <Link
      to={mod.href as any}
      style={{
        display: "block", textDecoration: "none", borderRadius: 14,
        overflow: "hidden", position: "relative",
        background: mod.isNew ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px) saturate(170%)",
        WebkitBackdropFilter: "blur(16px) saturate(170%)",
        border: mod.isNew ? "1px dashed rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        transition: "all 0.2s ease",
        opacity: mod.isNew ? 0.75 : 1,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.opacity = "1";
        el.style.background = mod.isNew ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.12)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.opacity = mod.isNew ? "0.75" : "1";
        el.style.background = mod.isNew ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)";
        el.style.borderColor = mod.isNew ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.08)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Accent strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${mod.accentColor}, transparent)` }} />
      {!mod.isNew && <div style={{ position: "absolute", top: 0, bottom: 0, width: "38%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)", animation: "est-shimmer 8s ease infinite", pointerEvents: "none" }} />}

      <div style={{ padding: "18px 18px 16px", position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: mod.accentColor.replace("0.85","0.1").replace("0.7","0.08"),
            border: `1px solid ${mod.accentColor.replace("0.85","0.22").replace("0.7","0.18")}`,
          }}>
            <Icon size={14} strokeWidth={2} style={{ color: mod.accentColor }} />
          </div>
          <div>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: mod.accentColor.replace("0.85","0.5").replace("0.7","0.45"), marginBottom: 2 }}>{mod.id}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)" }}>{mod.label}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: mod.isNew ? "rgba(245,158,11,0.8)" : "rgba(16,185,129,0.85)", animation: mod.isNew ? "est-glow 2s ease infinite" : "none" }} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.8, color: mod.isNew ? "rgba(245,158,11,0.65)" : "rgba(16,185,129,0.7)" }}>{mod.isNew ? "EM BREVE" : "ATIVO"}</span>
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
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", lineHeight: 1.5, flex: 1 }}>{mod.insight}</span>
          <ArrowUpRight size={11} style={{ color: mod.accentColor.replace("0.85","0.45").replace("0.7","0.35"), flexShrink: 0, marginTop: 1 }} />
        </div>
      </div>
    </Link>
  );
}

// ─── Strategic intelligence insights ─────────────────────────────────────────

const INSIGHTS = [
  {
    label: "EXECUÇÃO ACIMA DO RITMO",
    text: "Business Plan com 74% de execução em 4 meses — 18% acima da média setorial para stage equivalente. Risco de burnout de recursos se o ritmo não for calibrado antes da Series A.",
    color: "rgba(6,182,212,0.85)", bg: "rgba(6,182,212,0.06)", border: "rgba(6,182,212,0.15)",
  },
  {
    label: "JANELA DE INVESTIMENTO",
    text: "Gap entre CAC e LTV aponta alavancagem de 3.2× com otimização de mix de canal. Janela de 90 dias para reposicionamento pré-rodada antes de pressão sazonal de mercado.",
    color: "rgba(59,130,246,0.85)", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)",
  },
  {
    label: "CENÁRIO SEM MAPEAMENTO",
    text: "3 cenários estratégicos de alta relevância identificados como não mapeados. Risco de decisão cega em contexto de alta volatilidade — configuração de Cenários é ação prioritária.",
    color: "rgba(139,92,246,0.85)", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.16)",
  },
  {
    label: "DESVIO SILENCIOSO NO OKR",
    text: "Metas do ciclo atual definidas sem framework de acompanhamento estruturado. Desvio detectado em KR2 (Aquisição) e KR4 (Retenção) — configuração de OKR é prioridade imediata.",
    color: "rgba(245,158,11,0.85)", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function EstrategiaDashboard() {
  return (
    <>
      <style>{KF}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 18, marginBottom: 20, overflow: "hidden", position: "relative",
        background: "radial-gradient(ellipse at 70% 35%, rgba(6,182,212,0.07) 0%, rgba(59,130,246,0.04) 40%, rgba(4,6,15,0) 70%), rgba(255,255,255,0.025)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
      }}>
        {/* Accent line — cyan → blue → amber */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(6,182,212,0.6), rgba(59,130,246,0.55), rgba(245,158,11,0.4), transparent)" }} />

        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Left — identity + metrics */}
          <div style={{ flex: 1, padding: "28px 28px 24px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(6,182,212,0.6)", marginBottom: 6 }}>
              GRUPO DE INTELIGÊNCIA · MIOS
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,0.94)", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>
              Estratégia
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24, lineHeight: 1.5 }}>
              Plano de negócio, investimento, conformidade e cenários para decisões de alta confiança.
            </div>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "EXEC SCORE", value: "74%",   sub: "plano executado",   color: "#06b6d4"               },
                { label: "ALAVANCAGEM",value: "3.2×",  sub: "potencial ROI",     color: "rgba(59,130,246,0.85)" },
                { label: "COMPLIANCE",  value: "3/4",   sub: "áreas certificadas",color: "rgba(245,158,11,0.85)" },
                { label: "COBERTURA",   value: "3/5",   sub: "módulos ativos",    color: "rgba(6,182,212,0.7)"   },
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

            {/* Coverage bar — 60% with pending indicator */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.28)" }}>COBERTURA DO GRUPO</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(6,182,212,0.65)", fontFamily: "JetBrains Mono, monospace" }}>3/5 ativos · 2 em breve</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", width: "60%", borderRadius: 2, background: "linear-gradient(90deg, rgba(6,182,212,0.8), rgba(59,130,246,0.7), rgba(245,158,11,0.6))" }} />
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {["Business Plan","Investimento","Compliance"].map(l => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(16,185,129,0.7)" }} />
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>{l}</span>
                  </div>
                ))}
                {["Cenários","OKR"].map(l => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(245,158,11,0.5)", animation: "est-glow 2s ease infinite" }} />
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Strategic Matrix */}
          <div style={{
            flexShrink: 0, width: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, rgba(59,130,246,0.03) 50%, transparent 78%)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            padding: "24px 20px", gap: 12,
          }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.22)" }}>STRATEGIC MATRIX</div>
            <StrategicMatrix />
            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 12px", justifyContent: "center" }}>
              {INITIATIVES.map(init => (
                <div key={init.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: init.color, opacity: init.done ? 1 : 0.45, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: init.done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)" }}>{init.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Module grid — 3+2 layout ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>MÓDULOS DE INTELIGÊNCIA ESTRATÉGICA</span>
          <span style={{ fontSize: 9, color: "rgba(6,182,212,0.6)", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>3 ATIVOS · 2 EM BREVE</span>
        </div>
        {/* Row 1 — 3 done modules */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
          {MODULES.slice(0,3).map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
        {/* Row 2 — 2 new modules */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {MODULES.slice(3).map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
      </div>

      {/* ── Strategic intelligence — 2x2 ─────────────────────────────────────── */}
      <div style={{ marginTop: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>INTELIGÊNCIA ESTRATÉGICA</span>
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(59,130,246,0.4), transparent)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.03), transparent)", animation: "est-shimmer 7s ease infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Brain size={17} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "est-pulse 2s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: "#ff9500" }}>MENTOR IA · VISÃO ESTRATÉGICA</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, marginBottom: 14 }}>
              A matrix estratégica revela duas realidades simultâneas: os módulos ativos estão na zona certa —
              Business Plan e Investimento no quadrante <span style={{ color: "rgba(6,182,212,0.75)", fontWeight: 600 }}>Prioridade</span> — mas Cenários e OKR ainda não entram na equação.
              Tomar decisões de alta complexidade sem mapeamento de cenários é o maior risco estratégico atual.
              Configure esses dois módulos antes de avançar para Veredito.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Business Plan",  href: "/business-plan" },
                { label: "Ver Compliance", href: "/compliance"    },
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
