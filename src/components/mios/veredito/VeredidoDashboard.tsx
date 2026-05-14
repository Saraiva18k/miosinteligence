import { Link } from "@tanstack/react-router";
import {
  Award, Globe, Users, Layers, Compass,
  ArrowUpRight, Brain, AlertTriangle, TrendingUp,
  Lock, Download, History, GitCompare,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes vrd-shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
@keyframes vrd-pulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
@keyframes vrd-fadein  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes vrd-glow    { 0%,100%{opacity:0.35} 50%{opacity:0.9} }
@keyframes vrd-spin    { from{stroke-dashoffset:0} to{stroke-dashoffset:-40} }
`;

// ─── Conviction Gauge (4 concentric semi-arcs) ────────────────────────────────

const GROUPS = [
  { label: "Mercado",    score: 82, color: "#ff9500", R: 88 },
  { label: "Audiência",  score: 78, color: "#6366f1", R: 68 },
  { label: "Marca",      score: 74, color: "#10b981", R: 48 },
  { label: "Estratégia", score: 67, color: "#06b6d4", R: 28 },
];

function arcPath(cx: number, cy: number, R: number, pct: number): string {
  if (pct <= 0) return "";
  if (pct >= 100) {
    return `M ${cx - R},${cy} A ${R},${R} 0 0 1 ${cx},${cy - R} A ${R},${R} 0 0 1 ${cx + R},${cy}`;
  }
  const angleDeg = 180 - (pct / 100) * 180;
  const rad = angleDeg * Math.PI / 180;
  const ex = (cx + R * Math.cos(rad)).toFixed(2);
  const ey = (cy - R * Math.sin(rad)).toFixed(2);
  return `M ${cx - R},${cy} A ${R},${R} 0 0 1 ${ex},${ey}`;
}

function ConvictionGauge() {
  const cx = 140, cy = 136, SW = 9;
  const overallScore = Math.round(GROUPS.reduce((a, g) => a + g.score, 0) / GROUPS.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.22)" }}>CONVICTION GAUGE</div>
      <svg width={284} height={148} style={{ overflow: "visible" }}>
        <defs>
          <filter id="vrd-arc-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {GROUPS.map((g) => (
          <g key={g.label}>
            {/* Background track */}
            <path
              d={`M ${cx - g.R},${cy} A ${g.R},${g.R} 0 0 1 ${cx + g.R},${cy}`}
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={SW} strokeLinecap="round"
            />
            {/* Score arc */}
            <path
              d={arcPath(cx, cy, g.R, g.score)}
              fill="none" stroke={g.color} strokeWidth={SW} strokeLinecap="round"
              opacity={0.88} filter="url(#vrd-arc-glow)"
            />
            {/* Score endpoint dot */}
            {(() => {
              const angleDeg = 180 - (g.score / 100) * 180;
              const rad = angleDeg * Math.PI / 180;
              const dx = cx + g.R * Math.cos(rad);
              const dy = cy - g.R * Math.sin(rad);
              return <circle cx={dx} cy={dy} r={4} fill={g.color} stroke="rgba(4,6,15,0.9)" strokeWidth={1.5} />;
            })()}
          </g>
        ))}

        {/* Center score */}
        <text x={cx} y={cy - 6}  textAnchor="middle" fontSize={34} fontWeight={900} fill="rgba(255,255,255,0.95)" fontFamily="JetBrains Mono, monospace">{overallScore}</text>
        <text x={cx} y={cy + 9}  textAnchor="middle" fontSize={7.5} fontWeight={700} fill="rgba(245,158,11,0.7)" letterSpacing={1.6}>CONVICÇÃO</text>

        {/* Zone labels */}
        <text x={cx - 98} y={cy + 14} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.18)" letterSpacing={0.5}>0</text>
        <text x={cx + 98} y={cy + 14} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.18)" letterSpacing={0.5}>100</text>
      </svg>

      {/* Group legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 18px" }}>
        {GROUPS.map(g => (
          <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: g.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.42)", flex: 1 }}>{g.label}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: g.color, fontFamily: "JetBrains Mono, monospace", opacity: 0.85 }}>{g.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Group summary cards ──────────────────────────────────────────────────────

const GROUP_SUMMARY = [
  { label: "Mercado",    Icon: Globe,    color: "#ff9500",  score: 82, status: "Radar posicionado · 2 alertas ativos",      href: "/mercado"       },
  { label: "Audiência",  Icon: Users,    color: "#6366f1",  score: 78, status: "3 personas · 100% cobertura · canal dual", href: "/audiencia-hub" },
  { label: "Marca",      Icon: Layers,   color: "#10b981",  score: 74, status: "Brand 78/100 · gap de comunicação",        href: "/marca-hub"     },
  { label: "Estratégia", Icon: Compass,  color: "#06b6d4",  score: 67, status: "3/5 módulos · Cenários e OKR pendentes",   href: "/estrategia-hub"},
];

function GroupCard({ g }: { g: typeof GROUP_SUMMARY[0] }) {
  const { Icon } = g;
  const tier = g.score >= 80 ? "SÓLIDO" : g.score >= 70 ? "BOM" : "ATENÇÃO";
  const tierColor = g.score >= 80 ? "rgba(16,185,129,0.75)" : g.score >= 70 ? "rgba(245,158,11,0.75)" : "rgba(239,68,68,0.7)";
  return (
    <Link to={g.href as any} style={{
      display: "block", textDecoration: "none", borderRadius: 12, position: "relative", overflow: "hidden",
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(14px) saturate(170%)",
      WebkitBackdropFilter: "blur(14px) saturate(170%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 4px 20px -8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
      transition: "all 0.18s ease",
      padding: "14px 16px",
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,0.05)"; el.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,0.03)"; el.style.transform="translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${g.color}, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${g.color}18`, border: `1px solid ${g.color}38`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={13} strokeWidth={2} style={{ color: g.color }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)", flex: 1 }}>{g.label}</span>
        <span style={{ fontSize: 7.5, fontWeight: 800, color: tierColor, letterSpacing: 0.8 }}>{tier}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: g.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 6 }}>{g.score}<span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.25)", marginLeft: 3 }}>/100</span></div>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.5 }}>{g.status}</div>
    </Link>
  );
}

// ─── Recommendations ──────────────────────────────────────────────────────────

const RECS = [
  {
    n: "01", priority: "CRÍTICA",
    title: "Fechar o gap de comunicação da marca",
    body: "Consistência (91%) é o maior ativo mas não se traduz em reconhecimento (65%). Ação de posicionamento aumentaria percepção de mercado em 18–24 pontos em 90 dias.",
    color: "rgba(239,68,68,0.85)", bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.2)",
    href: "/dna",
  },
  {
    n: "02", priority: "ALTA",
    title: "Configurar Cenários e OKR antes da rodada",
    body: "Dois módulos estratégicos sem framework operacional representam risco de decisão cega. Bloquear abertura de Series A até configuração completa é a decisão mais segura.",
    color: "rgba(245,158,11,0.85)", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)",
    href: "/estrategia-hub",
  },
  {
    n: "03", priority: "MÉDIA",
    title: "Ativar canal do Influenciador como alavanca",
    body: "O Influenciador (25% da audiência) inicia 60% das buscas mas é invisível no processo formal. Canal de conteúdo técnico gera pipeline com Decisor em 14–21 dias sem disputa direta.",
    color: "rgba(99,102,241,0.85)", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.2)",
    href: "/audiencia-hub",
  },
];

// ─── Risk register ────────────────────────────────────────────────────────────

const RISKS = [
  { severity: "CRÍTICO", label: "Cenários não mapeados", detail: "Decisões estratégicas sem visibilidade de alternativas — risco sistêmico antes de rodada de investimento.", color: "rgba(239,68,68,0.85)", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.18)" },
  { severity: "ALTO",    label: "Reconhecimento de marca baixo", detail: "34% do público-alvo não associa o produto ao problema que resolve — conversão comprometida.", color: "rgba(245,158,11,0.85)", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.16)" },
  { severity: "MÉDIO",   label: "ISO 27001 pendente", detail: "Certificação ausente bloqueia participação em rodadas com investidores institucionais e contratos enterprise.", color: "rgba(251,191,36,0.8)", bg: "rgba(251,191,36,0.05)", border: "rgba(251,191,36,0.14)" },
  { severity: "ATENÇÃO", label: "2 alertas de mercado ativos", detail: "Movimentos de concorrentes A e B detectados no Pulso — janela de resposta de 14 dias identificada.", color: "rgba(99,102,241,0.8)", bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.15)" },
];

// ─── New module teasers ───────────────────────────────────────────────────────

const NEW_MODULES = [
  { id: "VRD-002", label: "Exportação",  Icon: Download,    href: "/exportacao",  color: "rgba(245,158,11,0.7)" },
  { id: "VRD-003", label: "Histórico",   Icon: History,     href: "/historico",   color: "rgba(16,185,129,0.7)" },
  { id: "VRD-004", label: "Comparativo", Icon: GitCompare,  href: "/comparativo", color: "rgba(99,102,241,0.7)" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function VeredidoDashboard() {
  return (
    <>
      <style>{KF}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 18, marginBottom: 20, overflow: "hidden", position: "relative",
        background: "radial-gradient(ellipse at 65% 40%, rgba(245,158,11,0.08) 0%, rgba(255,149,0,0.04) 35%, rgba(4,6,15,0) 68%), rgba(255,255,255,0.025)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
      }}>
        {/* Accent line — ALL groups: orange → indigo → emerald → cyan → gold */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(255,149,0,0.55), rgba(99,102,241,0.5), rgba(16,185,129,0.5), rgba(6,182,212,0.45), rgba(245,158,11,0.6), transparent)" }} />

        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Left — identity */}
          <div style={{ flex: 1, padding: "28px 28px 24px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(245,158,11,0.6)", marginBottom: 6 }}>
              SÍNTESE ESTRATÉGICA COMPLETA · MIOS
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,0.94)", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>
              Veredito
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24, lineHeight: 1.5 }}>
              Toda inteligência convergida. Recomendações priorizadas. Decisão com alta convicção.
            </div>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "CONVICÇÃO",    value: "76%",  sub: "nível geral",         color: "#f59e0b"               },
                { label: "GRUPOS",       value: "4/4",  sub: "analisados",          color: "rgba(16,185,129,0.85)" },
                { label: "RECOMENDAÇÕES",value: "3",    sub: "ações priorizadas",   color: "rgba(239,68,68,0.8)"   },
                { label: "RISCOS",       value: "4",    sub: "identificados",       color: "rgba(245,158,11,0.85)" },
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

            {/* Conviction level + all-groups bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.28)" }}>SÍNTESE DOS 4 GRUPOS</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(245,158,11,0.75)", fontFamily: "JetBrains Mono, monospace" }}>ALTA CONVICÇÃO</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "76%", borderRadius: 2, background: "linear-gradient(90deg, rgba(255,149,0,0.8), rgba(99,102,241,0.75), rgba(16,185,129,0.75), rgba(6,182,212,0.7), rgba(245,158,11,0.85))" }} />
              </div>
            </div>
          </div>

          {/* Right — ConvictionGauge */}
          <div style={{
            flexShrink: 0, width: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, rgba(255,149,0,0.03) 50%, transparent 75%)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            padding: "20px 16px",
          }}>
            <ConvictionGauge />
          </div>
        </div>
      </div>

      {/* ── Group intelligence summary ────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>SÍNTESE POR GRUPO</span>
          <span style={{ fontSize: 9, color: "rgba(245,158,11,0.6)", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>4/4 ANALISADOS</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {GROUP_SUMMARY.map(g => <GroupCard key={g.label} g={g} />)}
        </div>
      </div>

      {/* ── Recommendations ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>RECOMENDAÇÕES PRIORIZADAS</span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECS.map(rec => (
            <Link key={rec.n} to={rec.href as any} style={{
              display: "block", textDecoration: "none", padding: "18px 20px", borderRadius: 14,
              background: rec.bg,
              backdropFilter: "blur(16px) saturate(170%)",
              WebkitBackdropFilter: "blur(16px) saturate(170%)",
              border: `1px solid ${rec.border}`,
              boxShadow: "0 4px 20px -8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
              position: "relative", overflow: "hidden",
              transition: "all 0.18s ease",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(-1px)"; el.style.boxShadow="0 8px 28px -8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 4px 20px -8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                {/* Number badge */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: rec.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, opacity: 0.9 }}>{rec.n}</div>
                  <div style={{ fontSize: 7, fontWeight: 800, color: rec.color, letterSpacing: 1.2, opacity: 0.75, whiteSpace: "nowrap" }}>{rec.priority}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.88)", marginBottom: 6, lineHeight: 1.3 }}>{rec.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.48)", lineHeight: 1.65 }}>{rec.body}</div>
                </div>
                <ArrowUpRight size={14} style={{ color: rec.color, opacity: 0.5, flexShrink: 0, marginTop: 4 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Risk register ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.25)" }}>REGISTER DE RISCOS</span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {RISKS.map(risk => (
            <div key={risk.label} style={{
              padding: "14px 16px", borderRadius: 12,
              background: risk.bg,
              backdropFilter: "blur(14px) saturate(170%)",
              WebkitBackdropFilter: "blur(14px) saturate(170%)",
              border: `1px solid ${risk.border}`,
              boxShadow: "0 4px 20px -8px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <AlertTriangle size={14} strokeWidth={2} style={{ color: risk.color, flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 7.5, fontWeight: 800, color: risk.color, letterSpacing: 1.2 }}>{risk.severity}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.78)" }}>{risk.label}</span>
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>{risk.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming modules — 3 pills ────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.04)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", color: "rgba(255,255,255,0.2)" }}>MÓDULOS EM BREVE</span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.04)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {NEW_MODULES.map(m => {
            const { Icon } = m;
            return (
              <div key={m.id} style={{
                padding: "14px 16px", borderRadius: 12, position: "relative", overflow: "hidden",
                background: "rgba(255,255,255,0.015)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px dashed rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", gap: 12, opacity: 0.65,
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${m.color}12`, border: `1px solid ${m.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} strokeWidth={2} style={{ color: m.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: m.color, opacity: 0.6, letterSpacing: 1, marginBottom: 2 }}>{m.id}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{m.label}</div>
                </div>
                <Lock size={11} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mentor IA — final synthesis ───────────────────────────────────────── */}
      <div style={{
        borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px -10px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.4), rgba(245,158,11,0.55), rgba(255,149,0,0.3), transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.03), transparent)", animation: "vrd-shimmer 8s ease infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 20px rgba(255,149,0,0.1)" }}>
            <Brain size={18} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.9)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "vrd-pulse 2s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.3, color: "#ff9500" }}>MENTOR IA · VEREDITO FINAL</span>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.75, marginBottom: 16 }}>
              Você chegou ao Veredito com uma base sólida — e com clareza suficiente para agir com convicção.
              Mercado e Audiência estão bem mapeados. Marca tem uma vantagem real ainda não comunicada.
              Estratégia precisa de dois módulos antes de uma rodada sem imprevisto.{" "}
              <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>A próxima decisão não é construir mais — é comunicar melhor o que já existe e fechar as lacunas que travam o crescimento.</span>{" "}
              Configure Cenários e OKR. Invista na narrativa de marca. Depois, abra a rodada.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Ver Marca",      href: "/marca-hub",     },
                { label: "Ver Estratégia", href: "/estrategia-hub" },
                { label: "Ver Audiência",  href: "/audiencia-hub"  },
                { label: "Conversar com Mentor", href: "/mentor", primary: true },
              ].map(cta => (
                <Link key={cta.label} to={cta.href as any} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 13px",
                  borderRadius: 8, textDecoration: "none",
                  background: (cta as any).primary ? "rgba(255,149,0,0.13)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${(cta as any).primary ? "rgba(255,149,0,0.35)" : "rgba(255,255,255,0.08)"}`,
                  transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: (cta as any).primary ? "rgba(255,149,0,0.95)" : "rgba(255,255,255,0.52)" }}>{cta.label}</span>
                  <ArrowUpRight size={10} style={{ color: (cta as any).primary ? "rgba(255,149,0,0.65)" : "rgba(255,255,255,0.3)" }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
