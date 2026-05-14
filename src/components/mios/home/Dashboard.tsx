import { Link } from "@tanstack/react-router";
import {
  Globe, Users, Layers, Compass, Award, Brain,
  AlertTriangle, TrendingDown, FileText, Star,
  ArrowRight, MapPin, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes online-ripple {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0;   }
}
@keyframes feed-in {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0);   }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

interface GroupData {
  id: string;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  href: string;
  color: string;
  score: number;
  modules: number;
  done: number;
  insight: string;
  alert?: boolean;
}

const GROUPS: GroupData[] = [
  {
    id: "mercado",    label: "Mercado",        shortLabel: "Mercado",
    Icon: Globe,    href: "/mercado",        color: "#3b82f6",
    score: 79, modules: 6, done: 4,
    insight: "Concorrente principal recuou 18% em menções positivas esta semana",
  },
  {
    id: "audiencia",  label: "Audiência",       shortLabel: "Audiência",
    Icon: Users,    href: "/audiencia-hub",  color: "#6366f1",
    score: 78, modules: 4, done: 4,
    insight: "2 personas confirmadas · Canal Instagram com CTR +42%",
  },
  {
    id: "marca",      label: "Marca & Produto", shortLabel: "Marca",
    Icon: Layers,   href: "/marca-hub",      color: "#10b981",
    score: 74, modules: 3, done: 3,
    insight: "Consistência acima da média setorial · Diferenciação em alta",
  },
  {
    id: "estrategia", label: "Estratégia",      shortLabel: "Estratégia",
    Icon: Compass,  href: "/estrategia-hub", color: "#06b6d4",
    score: 67, modules: 5, done: 3,
    insight: "2 iniciativas críticas pendentes — Business Plan requer revisão",
    alert: true,
  },
  {
    id: "veredito",   label: "Veredito",        shortLabel: "Veredito",
    Icon: Award,    href: "/veredito",       color: "#f59e0b",
    score: 76, modules: 4, done: 1,
    insight: "Score 76/100 · Janela de entrada estratégica confirmada ativa",
  },
];

const COMPOSITE = Math.round(GROUPS.reduce((s, g) => s + g.score, 0) / GROUPS.length);

interface FeedItem {
  time: string;
  group: string;
  color: string;
  Icon: LucideIcon;
  text: string;
  tag: string;
  tagColor: string;
}

const INTEL_FEED: FeedItem[] = [
  {
    time: "Agora", group: "Mercado",    color: "#3b82f6", Icon: TrendingDown,
    text: "Monitoramento detectou queda de 18% nas menções positivas do concorrente principal",
    tag: "ALERTA",       tagColor: "#f43f5e",
  },
  {
    time: "2h",    group: "Estratégia", color: "#06b6d4", Icon: FileText,
    text: "Business Plan revisado — premissa de crescimento ajustada para 34% a.a.",
    tag: "ATUALIZAÇÃO",  tagColor: "#3b82f6",
  },
  {
    time: "5h",    group: "Audiência",  color: "#6366f1", Icon: Users,
    text: "Nova persona emergiu: Profissional Liberal 35–45 com CAC estimado 40% menor",
    tag: "INSIGHT",      tagColor: "#8b5cf6",
  },
  {
    time: "1d",    group: "Marca",      color: "#10b981", Icon: Star,
    text: "Índice de Consistência subiu 4 pontos após refinamento do DNA da Marca",
    tag: "MELHORA",      tagColor: "#10b981",
  },
  {
    time: "2d",    group: "Mercado",    color: "#3b82f6", Icon: AlertTriangle,
    text: "Tendência 'personalização em massa' atingiu +340% de crescimento de busca — janela de 6 meses",
    tag: "OPORTUNIDADE", tagColor: "#f59e0b",
  },
];

const MACRO_INSIGHTS = [
  {
    text: "Posicionamento premium da Marca contradiz a estratégia de volume em Precificação — tensão que reduz ~4 pts do score composto",
    priority: "ALTA",   color: "#f43f5e",
  },
  {
    text: "Janela de aquisição 22h–23h (Audiência) ainda não está no plano de canais de Estratégia — oportunidade de 14 dias",
    priority: "MÉDIA",  color: "#ff9500",
  },
  {
    text: "Score de Estratégia (67) é o maior vetor de melhora — priorizá-lo elevaria o Composto em ~6 pontos",
    priority: "AÇÃO",   color: "#10b981",
  },
];

const PRIORITY_SIGNALS = [
  { label: "Revisar Business Plan",     group: "Estratégia", color: "#06b6d4", urgency: "CRÍTICO" },
  { label: "Ativar janela 22h–23h",     group: "Audiência",  color: "#6366f1", urgency: "ALTA"    },
  { label: "Alinhar pricing com marca", group: "Marca",      color: "#10b981", urgency: "MÉDIA"   },
];

// ─── Pentagon Radar ───────────────────────────────────────────────────────────

function PentagonRadar() {
  const cx = 80, cy = 82, maxR = 60;
  const n = GROUPS.length;

  function pt(idx: number, r: number): [number, number] {
    const angle = (idx * (360 / n) - 90) * (Math.PI / 180);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const rings = [0.25, 0.5, 0.75, 1.0];
  const scorePoints = GROUPS.map((g, i) => pt(i, (g.score / 100) * maxR));

  return (
    <svg width={160} height={168} viewBox="0 0 160 168">
      {/* Grid rings */}
      {rings.map((pct, ri) => {
        const pts = GROUPS.map((_, i) => {
          const [x, y] = pt(i, maxR * pct);
          return `${x},${y}`;
        }).join(" ");
        return (
          <polygon key={ri} points={pts} fill="none"
            stroke={ri === 3 ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)"}
            strokeWidth={0.8}
          />
        );
      })}

      {/* Spokes */}
      {GROUPS.map((_, i) => {
        const [x, y] = pt(i, maxR);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.8}
          />
        );
      })}

      {/* Score polygon */}
      <polygon
        points={scorePoints.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="rgba(255,149,0,0.09)"
        stroke="rgba(255,149,0,0.5)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Vertex dots per group color */}
      {scorePoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={GROUPS[i].color}
          style={{ filter: `drop-shadow(0 0 4px ${GROUPS[i].color})` }}
        />
      ))}

      {/* Group labels at outer rim */}
      {GROUPS.map((g, i) => {
        const [lx, ly] = pt(i, maxR + 16);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill={g.color} fontSize={8} fontWeight={700} opacity={0.85}>
            {g.shortLabel}
          </text>
        );
      })}

      {/* Center: composite score */}
      <text x={cx} y={cy - 7} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.92)" fontSize={24} fontWeight={900}
        fontFamily="JetBrains Mono, monospace">
        {COMPOSITE}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,149,0,0.5)" fontSize={7} fontWeight={700} letterSpacing={2}>
        MATURIDADE
      </text>
    </svg>
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────

function GroupCard({ label, Icon, href, color, score, modules, done, insight, alert }: GroupData) {
  const modPct = Math.round((done / modules) * 100);

  return (
    <Link
      to={href as any}
      style={{
        display: "flex", flexDirection: "column", gap: 10,
        padding: "14px 14px 12px",
        borderRadius: 12, textDecoration: "none",
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: `1px solid ${alert ? "rgba(244,63,94,0.18)" : "rgba(255,255,255,0.06)"}`,
        borderTop: `2px solid ${color}`,
        transition: "all 0.18s",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top: icon + score */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}18`, border: `1px solid ${color}30`,
        }}>
          <Icon size={13} style={{ color }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: 10, color: `${color}55`, fontFamily: "JetBrains Mono, monospace" }}>/100</span>
        </div>
      </div>

      {/* Label + progress */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.78)", lineHeight: 1.2 }}>
            {label}
          </span>
          {alert && (
            <span style={{ fontSize: 8, fontWeight: 800, color: "#f43f5e", letterSpacing: 0.5 }}>● ATENÇÃO</span>
          )}
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 5 }}>
          <div style={{
            height: "100%", width: `${modPct}%`, borderRadius: 2,
            background: color, opacity: 0.7, transition: "width 0.6s ease",
          }} />
        </div>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
          {done}/{modules} módulos
        </span>
      </div>

      {/* Insight */}
      <div style={{
        fontSize: 10, color: "rgba(255,255,255,0.36)", lineHeight: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8, flex: 1,
      }}>
        {insight}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: `${color}85` }}>Ver Hub</span>
        <ArrowRight size={10} style={{ color: `${color}85` }} />
      </div>
    </Link>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function Dashboard() {
  const alertCount   = GROUPS.filter(g => g.alert).length;
  const doneModules  = GROUPS.reduce((s, g) => s + g.done,    0);
  const totalModules = GROUPS.reduce((s, g) => s + g.modules, 0);
  const completePct  = Math.round((doneModules / totalModules) * 100);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Workspace Hero ─────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 80px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          position: "relative", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr auto 216px", gap: 28, alignItems: "center",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: -80, left: "38%",
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,149,0,0.06) 0%, transparent 68%)",
            pointerEvents: "none",
          }} />

          {/* ── Left: workspace info ─────────────────────────────────────────── */}
          <div style={{ position: "relative" }}>
            {/* Header pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,149,0,0.55)" }}>
                WORKSPACE ATIVO
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.25)",
                color: "rgba(255,149,0,0.85)",
              }}>
                Ativo
              </span>
              {alertCount > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: "rgba(244,63,94,0.10)", border: "1px solid rgba(244,63,94,0.28)",
                  color: "rgba(244,63,94,0.88)",
                }}>
                  {alertCount} alerta{alertCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{
              fontSize: 30, fontWeight: 900, color: "rgba(255,255,255,0.93)",
              letterSpacing: -1, margin: "0 0 8px", lineHeight: 1.1,
            }}>
              Estética Premium SP
            </h1>

            {/* Meta line */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <MapPin size={10} style={{ color: "rgba(255,149,0,0.5)" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>São Paulo</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>·</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                {doneModules} de {totalModules} módulos concluídos
              </span>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>·</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%", background: "#10b981",
                  boxShadow: "0 0 6px rgba(16,185,129,0.7)",
                }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Análise ativa</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { label: "Score Composto",  value: `${COMPOSITE}/100`, color: "#ff9500"                   },
                { label: "Módulos ok",      value: `${doneModules}/${totalModules}`, color: "rgba(255,255,255,0.72)" },
                { label: "Completude",      value: `${completePct}%`,  color: "#10b981"                   },
                { label: "Grupos ativos",   value: "5/5",              color: "#6366f1"                   },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontSize: 20, fontWeight: 900, color: stat.color,
                    fontFamily: "JetBrains Mono, monospace", lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.26)", marginTop: 4, letterSpacing: 0.4 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Center: Pentagon Radar ───────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <PentagonRadar />
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: 2,
              color: "rgba(255,255,255,0.15)", textTransform: "uppercase",
            }}>
              Saúde Estratégica
            </span>
          </div>

          {/* ── Right: group score bars ──────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,255,255,0.18)", marginBottom: 2 }}>
              POR GRUPO
            </span>
            {GROUPS.map(({ id, label, Icon: GIcon, color, score }) => (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <GIcon size={10} style={{ color, flexShrink: 0, opacity: 0.75 }} />
                <div style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: "rgba(255,255,255,0.05)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${score}%`, borderRadius: 2,
                    background: color, opacity: 0.7,
                  }} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, color,
                  fontFamily: "JetBrains Mono, monospace",
                  minWidth: 18, textAlign: "right", opacity: 0.85,
                }}>
                  {score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5 Group Cards ──────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {GROUPS.map(g => <GroupCard key={g.id} {...g} />)}
        </div>

        {/* ── Bottom Grid ────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 316px", gap: 14, alignItems: "start" }}>

          {/* ── Intel Feed ─────────────────────────────────────────────────── */}
          <div style={{
            borderRadius: 14, padding: "18px 20px",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Activity size={11} style={{ color: "rgba(255,149,0,0.6)" }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.24)" }}>
                INTELIGÊNCIA EM TEMPO REAL
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{
                fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 700,
                background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.22)",
                color: "rgba(16,185,129,0.72)",
              }}>
                LIVE
              </span>
            </div>

            {/* Feed items */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {INTEL_FEED.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "11px 0",
                  borderBottom: i < INTEL_FEED.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  animation: `feed-in 0.35s ease ${i * 0.07}s both`,
                }}>
                  {/* Icon badge */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${item.color}14`, border: `1px solid ${item.color}25`,
                    marginTop: 1,
                  }}>
                    <item.Icon size={12} style={{ color: item.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                        background: `${item.tagColor}14`, border: `1px solid ${item.tagColor}32`,
                        color: item.tagColor, letterSpacing: 0.5,
                      }}>
                        {item.tag}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: item.color, opacity: 0.75 }}>
                        {item.group}
                      </span>
                      <span style={{
                        marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.2)",
                        fontFamily: "JetBrains Mono, monospace", flexShrink: 0,
                      }}>
                        {item.time}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.52)", lineHeight: 1.55 }}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column ─────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Mentor Macro */}
            <div style={{
              borderRadius: 14, padding: "18px 18px",
              background: "linear-gradient(145deg, rgba(255,149,0,0.09) 0%, rgba(255,80,0,0.04) 100%)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,149,0,0.2)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Glow orb */}
              <div style={{
                position: "absolute", top: -28, right: -28, width: 110, height: 110,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,149,0,0.10) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, position: "relative" }}>
                <div style={{ position: "relative", width: 8, height: 8 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(16,185,129,0.5)", animation: "online-ripple 2s ease-out infinite" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: "#ff9500" }}>MENTOR IA</span>
                <span style={{ fontSize: 9, color: "rgba(255,149,0,0.4)", letterSpacing: 0.5 }}>· VISÃO MACRO</span>
              </div>

              {/* Cross-domain insights */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, position: "relative" }}>
                {MACRO_INSIGHTS.map((ins, i) => (
                  <div key={i} style={{
                    padding: "9px 10px", borderRadius: 8,
                    background: "rgba(255,149,0,0.05)",
                    border: "1px solid rgba(255,149,0,0.10)",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{
                        fontSize: 7, fontWeight: 900, padding: "2px 5px", borderRadius: 4,
                        background: `${ins.color}18`, border: `1px solid ${ins.color}35`,
                        color: ins.color, letterSpacing: 0.4, flexShrink: 0, marginTop: 1,
                      }}>
                        {ins.priority}
                      </span>
                      <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                        {ins.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/mentor"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "9px 14px", borderRadius: 9, textDecoration: "none",
                  background: "rgba(255,149,0,0.13)", border: "1px solid rgba(255,149,0,0.28)",
                  fontSize: 12, fontWeight: 700, color: "rgba(255,149,0,0.9)",
                }}
              >
                <Brain size={12} /> Aprofundar com o Mentor
              </Link>
            </div>

            {/* Priority Signals */}
            <div style={{
              borderRadius: 14, padding: "16px 16px",
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <AlertTriangle size={11} style={{ color: "rgba(244,63,94,0.65)" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.22)" }}>
                  SINAIS PRIORITÁRIOS
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {PRIORITY_SIGNALS.map((s, i) => {
                  const urgencyColor = s.urgency === "CRÍTICO" ? "#f43f5e" : s.urgency === "ALTA" ? "#ff9500" : "rgba(255,255,255,0.3)";
                  const urgencyBg    = s.urgency === "CRÍTICO" ? "rgba(244,63,94,0.12)" : s.urgency === "ALTA" ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.05)";
                  const urgencyBd    = s.urgency === "CRÍTICO" ? "rgba(244,63,94,0.3)"  : s.urgency === "ALTA" ? "rgba(255,149,0,0.3)"  : "rgba(255,255,255,0.1)";
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 10px", borderRadius: 8,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: s.color, flexShrink: 0,
                        boxShadow: `0 0 5px ${s.color}80`,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.62)", marginBottom: 2 }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.22)" }}>{s.group}</div>
                      </div>
                      <span style={{
                        fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 4, flexShrink: 0,
                        background: urgencyBg, border: `1px solid ${urgencyBd}`, color: urgencyColor,
                      }}>
                        {s.urgency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
