import { Link } from "@tanstack/react-router";
import {
  Users, AlertTriangle, UserCheck, Radio, Share2,
  ArrowUpRight, Brain, Zap,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes aud-shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
@keyframes aud-pulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
@keyframes aud-ring-1  { from{stroke-dashoffset:366} to{stroke-dashoffset:134} }
@keyframes aud-ring-2  { from{stroke-dashoffset:534} to{stroke-dashoffset:-107} }
@keyframes aud-ring-3  { from{stroke-dashoffset:534} to{stroke-dashoffset:-267} }
@keyframes aud-fadein  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes aud-bar     { from{width:0} to{width:var(--w)} }
@keyframes aud-node    { 0%,100%{r:4;opacity:0.85} 50%{r:3;opacity:0.5} }
`;

// ─── Persona colors ───────────────────────────────────────────────────────────

const PERSONAS = {
  decisor:      { color: "rgba(255,149,0,0.9)",   bg: "rgba(255,149,0,0.08)",   border: "rgba(255,149,0,0.22)",   dot: "#ff9500"  },
  executor:     { color: "rgba(99,102,241,0.85)",  bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.22)",  dot: "#6366f1"  },
  influenciador:{ color: "rgba(236,72,153,0.8)",   bg: "rgba(236,72,153,0.07)",  border: "rgba(236,72,153,0.2)",   dot: "#ec4899"  },
};

// ─── Persona ring ─────────────────────────────────────────────────────────────

function PersonaRing() {
  const cx = 110, cy = 110, r = 78, sw = 20;
  const circ = 2 * Math.PI * r; // 490.09
  const GAP = 9;

  // Pre-computed dashoffsets (start at 12 o'clock = offset circ*0.25)
  const segs = [
    {
      arc: circ * 0.45 - GAP,       // 211.5
      dashoffset: circ * 0.25,       // 122.5  — Decisor starts at top
      color: "#ff9500",
      anim: "aud-ring-1 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s both",
    },
    {
      arc: circ * 0.30 - GAP,       // 138.0
      dashoffset: circ * 0.25 - circ * 0.45, // -97.8 — Executor starts after Decisor
      color: "#6366f1",
      anim: "aud-ring-2 1.1s cubic-bezier(0.4,0,0.2,1) 0.5s both",
    },
    {
      arc: circ * 0.25 - GAP,       // 113.5
      dashoffset: circ * 0.25 - circ * 0.75, // -245.0 — Influenciador last
      color: "#ec4899",
      anim: "aud-ring-3 1.1s cubic-bezier(0.4,0,0.2,1) 0.8s both",
    },
  ];

  return (
    <svg width={220} height={220} style={{ flexShrink: 0 }}>
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />

      {/* Glow filter */}
      <defs>
        <filter id="seg-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Segments */}
      {segs.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${seg.arc} ${circ - seg.arc}`}
          strokeDashoffset={seg.dashoffset}
          filter="url(#seg-glow)"
          style={{ animation: seg.anim }}
        />
      ))}

      {/* Center */}
      <circle cx={cx} cy={cy} r={r - sw - 8} fill="rgba(4,6,15,0.6)" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={28} fontWeight={900} fill="rgba(255,255,255,0.9)" fontFamily="JetBrains Mono, monospace">3</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill="rgba(255,255,255,0.35)" letterSpacing={1.5}>PERSONAS</text>
    </svg>
  );
}

// ─── Micro-viz: Pain bars ──────────────────────────────────────────────────────

function PainBars() {
  const items = [
    { label: "Complexidade operacional", pct: 94 },
    { label: "Falta de visibilidade",    pct: 87 },
    { label: "Processos manuais",         pct: 79 },
    { label: "Dificuldade de escala",     pct: 72 },
    { label: "Custo de ferramentas",      pct: 61 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map(it => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${it.pct}%`, borderRadius: 2, background: `linear-gradient(90deg, rgba(239,68,68,0.7), rgba(255,149,0,0.5))` }} />
          </div>
          <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace", minWidth: 24 }}>{it.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Micro-viz: Segment bars ───────────────────────────────────────────────────

function SegmentBars() {
  const segs = [
    { label: "Decisor",       pct: 45, color: "#ff9500" },
    { label: "Executor",      pct: 30, color: "#6366f1" },
    { label: "Influenciador", pct: 25, color: "#ec4899" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {segs.map(s => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", minWidth: 80 }}>{s.label}</span>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${s.pct}%`, borderRadius: 3, background: s.color, opacity: 0.75 }} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: s.color, fontFamily: "JetBrains Mono, monospace", minWidth: 26, opacity: 0.9 }}>{s.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Micro-viz: Social network nodes ──────────────────────────────────────────

function SocialNodes() {
  const nodes = [
    { x: 30,  y: 30,  r: 7,  color: "#6366f1" },
    { x: 80,  y: 20,  r: 5,  color: "#ec4899" },
    { x: 120, y: 38,  r: 9,  color: "#ff9500" },
    { x: 50,  y: 58,  r: 6,  color: "#6366f1" },
    { x: 100, y: 65,  r: 5,  color: "#ec4899" },
    { x: 20,  y: 72,  r: 4,  color: "#10b981" },
  ];
  const edges = [[0,1],[0,3],[1,2],[2,4],[3,4],[3,5],[1,4]];
  return (
    <svg width={140} height={88}>
      {edges.map(([a,b],i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r}
          fill={n.color} opacity={0.75}
          style={{ animation: `aud-node ${1.5 + i * 0.3}s ease ${i * 0.2}s infinite` }}
        />
      ))}
    </svg>
  );
}

// ─── Micro-viz: Channel bars ───────────────────────────────────────────────────

function ChannelBars() {
  const channels = [
    { label: "LinkedIn",  pct: 68, color: "#6366f1" },
    { label: "WhatsApp",  pct: 52, color: "#10b981" },
    { label: "E-mail",    pct: 34, color: "#ff9500" },
    { label: "Eventos",   pct: 28, color: "#ec4899" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {channels.map(c => (
        <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", minWidth: 52 }}>{c.label}</span>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${c.pct}%`, borderRadius: 2, background: c.color, opacity: 0.7 }} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: c.color, fontFamily: "JetBrains Mono, monospace", minWidth: 26, opacity: 0.9 }}>{c.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────

interface AudModule {
  id: string; label: string; Icon: any; href: string;
  metric: string; metricSub: string; insight: string;
  viz: React.ReactNode;
  accentColor: string;
}

const MODULES: AudModule[] = [
  {
    id: "AUD-001", label: "Dores",              Icon: AlertTriangle, href: "/dores",
    metric: "11",  metricSub: "dores catalogadas",
    insight: "Dor primária: complexidade operacional (94% de intensidade)",
    viz: <PainBars />,
    accentColor: "rgba(239,68,68,0.8)",
  },
  {
    id: "AUD-002", label: "Audiência",           Icon: UserCheck,     href: "/audiencia",
    metric: "3",   metricSub: "personas mapeadas",
    insight: "Decisor concentra 45% · ciclo de compra distinto por perfil",
    viz: <SegmentBars />,
    accentColor: "rgba(255,149,0,0.85)",
  },
  {
    id: "AUD-003", label: "Social Intelligence", Icon: Radio,         href: "/social-intelligence",
    metric: "6",   metricSub: "plataformas monitoradas",
    insight: "2 alertas ativos · LinkedIn concentra 68% do engajamento decisor",
    viz: <SocialNodes />,
    accentColor: "rgba(99,102,241,0.85)",
  },
  {
    id: "AUD-004", label: "Canais",              Icon: Share2,        href: "/canais",
    metric: "4",   metricSub: "canais mapeados",
    insight: "Decisor: LinkedIn · Executor: WhatsApp · canais divergem por perfil",
    viz: <ChannelBars />,
    accentColor: "rgba(236,72,153,0.8)",
  },
];

function ModuleCard({ mod }: { mod: AudModule }) {
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
        el.style.borderColor = "rgba(255,255,255,0.12)";
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
      <div style={{ position: "absolute", top: 0, bottom: 0, width: "35%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)", animation: "aud-shimmer 8s ease infinite", pointerEvents: "none" }} />

      <div style={{ padding: "18px 18px 16px", position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${mod.accentColor.replace("0.8", "0.1").replace("0.85", "0.1")}`,
            border: `1px solid ${mod.accentColor.replace("0.8", "0.22").replace("0.85", "0.22")}`,
          }}>
            <Icon size={14} strokeWidth={2} style={{ color: mod.accentColor }} />
          </div>
          <div>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: mod.accentColor.replace("0.8","0.5").replace("0.85","0.5"), marginBottom: 2 }}>{mod.id}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)" }}>{mod.label}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(16,185,129,0.85)" }} />
            <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(16,185,129,0.7)", letterSpacing: 0.8 }}>ATIVO</span>
          </div>
        </div>

        {/* Metric */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, color: mod.accentColor, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{mod.metric}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{mod.metricSub}</div>
          </div>
        </div>

        {/* Visualization */}
        <div style={{ marginBottom: 12 }}>{mod.viz}</div>

        {/* Insight */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", lineHeight: 1.5, flex: 1 }}>{mod.insight}</span>
          <ArrowUpRight size={11} style={{ color: mod.accentColor.replace("0.8","0.45").replace("0.85","0.45"), flexShrink: 0, marginTop: 1 }} />
        </div>
      </div>
    </Link>
  );
}

// ─── Behavioral insights ──────────────────────────────────────────────────────

const INSIGHTS = [
  {
    label: "COMPORTAMENTO NÃO VERBALIZADO",
    text: "Principal dor detectada em comportamento, não em pesquisa: urgência por simplificação. 83% dos Decisores abandonam soluções complexas na fase de onboarding.",
    color: "rgba(255,149,0,0.85)", bg: "rgba(255,149,0,0.06)", border: "rgba(255,149,0,0.15)",
  },
  {
    label: "DIVERGÊNCIA DE CANAL",
    text: "Decisor converte via LinkedIn (68%) · Executor retém via WhatsApp (52%). Mensagem única perde os dois — estratégia dual de ativação é prioritária.",
    color: "rgba(99,102,241,0.85)", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.18)",
  },
  {
    label: "INFLUÊNCIA OCULTA",
    text: "Influenciador (25%) inicia 60% das pesquisas de solução, mas raramente aparece no processo formal de compra. Canal crítico subestimado.",
    color: "rgba(236,72,153,0.8)", bg: "rgba(236,72,153,0.06)", border: "rgba(236,72,153,0.16)",
  },
  {
    label: "JANELA DE ATIVAÇÃO",
    text: "Executor pesquisa 3× mais que Decisor antes de recomendar. Conteúdo técnico direcionado ao Executor gera pipeline indireto com Decisor em 14–21 dias.",
    color: "rgba(16,185,129,0.85)", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AudienciaDashboard() {
  return (
    <>
      <style>{KF}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 18, marginBottom: 20, overflow: "hidden", position: "relative",
        background: "radial-gradient(ellipse at 75% 40%, rgba(99,102,241,0.07) 0%, rgba(255,149,0,0.04) 40%, rgba(4,6,15,0) 70%), rgba(255,255,255,0.025)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
      }}>
        {/* Accent line — violet to orange */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(255,149,0,0.5), rgba(99,102,241,0.6), rgba(236,72,153,0.4), transparent)" }} />

        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Left — identity */}
          <div style={{ flex: 1, padding: "28px 28px 24px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(99,102,241,0.6)", marginBottom: 6 }}>
              GRUPO DE INTELIGÊNCIA · MIOS
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,0.94)", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>
              Audiência
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24, lineHeight: 1.5 }}>
              Comportamento, motivações e jornada de cada persona que compõe seu mercado.
            </div>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "PERSONAS",  value: "3",    sub: "mapeadas",    color: "#ff9500"              },
                { label: "DORES",     value: "11",   sub: "catalogadas", color: "rgba(239,68,68,0.85)" },
                { label: "CANAIS",    value: "4",    sub: "analisados",  color: "rgba(99,102,241,0.85)"},
                { label: "COBERTURA", value: "100%", sub: "do grupo",    color: "rgba(16,185,129,0.85)"},
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

            {/* 100% coverage bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.28)" }}>COBERTURA DO GRUPO</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(16,185,129,0.7)", fontFamily: "JetBrains Mono, monospace" }}>4/4 · Completo</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", borderRadius: 2, background: "linear-gradient(90deg, rgba(255,149,0,0.8), rgba(99,102,241,0.7), rgba(16,185,129,0.8))" }} />
              </div>
            </div>
          </div>

          {/* Right — persona ring */}
          <div style={{
            flexShrink: 0, width: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, rgba(236,72,153,0.03) 50%, transparent 75%)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            padding: "20px 16px",
            gap: 14,
          }}>
            <PersonaRing />

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", paddingLeft: 8 }}>
              {[
                { label: "Decisor",       pct: "45%", color: "#ff9500" },
                { label: "Executor",      pct: "30%", color: "#6366f1" },
                { label: "Influenciador", pct: "25%", color: "#ec4899" },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", flex: 1 }}>{p.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.color, fontFamily: "JetBrains Mono, monospace" }}>{p.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Module grid — 2x2 ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>MÓDULOS DE INTELIGÊNCIA HUMANA</span>
          <span style={{ fontSize: 9, color: "rgba(16,185,129,0.6)", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>4/4 ATIVOS</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {MODULES.map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
      </div>

      {/* ── Behavioral insights — 2x2 ────────────────────────────────────────── */}
      <div style={{ marginTop: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>INTELIGÊNCIA COMPORTAMENTAL</span>
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
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{ins.text}</div>
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,149,0,0.4), transparent)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.03), transparent)", animation: "aud-shimmer 6s ease infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Brain size={17} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "aud-pulse 2s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: "#ff9500" }}>MENTOR IA · VISÃO DA AUDIÊNCIA</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 14 }}>
              A audiência está completamente mapeada — e ela revela uma assimetria estratégica importante.
              O Influenciador (25%) inicia 60% das buscas, mas é invisível no processo formal.
              Ativar esse canal com conteúdo técnico direcionado ao Executor pode gerar pipeline
              com o Decisor em 14 a 21 dias, sem disputa direta com concorrentes.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Ver Dores",     href: "/dores"     },
                { label: "Ver Canais",    href: "/canais"    },
                { label: "Conversar",     href: "/mentor", primary: true },
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
