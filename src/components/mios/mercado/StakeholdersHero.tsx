import { useState } from "react";
import { Network, Users, TrendingUp, Building2, Star, Zap, Clock } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes sk-appear   { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
@keyframes sk-dash-cw  { from{stroke-dashoffset:0} to{stroke-dashoffset:-11} }
@keyframes sk-dash-ccw { from{stroke-dashoffset:0} to{stroke-dashoffset:11} }
@keyframes sk-bar      { from{width:0} to{width:var(--w)} }
`;

// ─── Constants & Data ─────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  center:     "#ff9500",
  investor:   "#10b981",
  partner:    "#818cf8",
  influencer: "#ec4899",
  community:  "#f59e0b",
};

const TYPE_LABEL: Record<string, string> = {
  all:        "Todos",
  investor:   "Investidores",
  partner:    "Parceiros",
  influencer: "Influenciadores",
  community:  "Comunidades",
};

// ─── Orbital Map ──────────────────────────────────────────────────────────────

const CX = 144, CY = 144;
const RADII = [52, 90, 124];

function toXY(orbit: number, angle: number): [number, number] {
  if (orbit < 0) return [CX, CY];
  const r = RADII[orbit];
  const rad = (angle - 90) * Math.PI / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

interface ONode { id: string; label: string; type: string; orbit: number; angle: number; }

const NODES: ONode[] = [
  { id: "you", label: "Você",          type: "center",     orbit: -1, angle: 0   },
  // Inner orbit (r = 52) — highest influence
  { id: "n1",  label: "Fundo Alpha",   type: "investor",   orbit: 0,  angle: 0   },
  { id: "n2",  label: "Distribuidora", type: "partner",    orbit: 0,  angle: 120 },
  { id: "n3",  label: "@TopCreator",   type: "influencer", orbit: 0,  angle: 240 },
  // Middle orbit (r = 90)
  { id: "n4",  label: "Angel João",    type: "investor",   orbit: 1,  angle: 50  },
  { id: "n5",  label: "Parceiro Tech", type: "partner",    orbit: 1,  angle: 140 },
  { id: "n6",  label: "Assoc. Setor",  type: "community",  orbit: 1,  angle: 220 },
  { id: "n7",  label: "Podcast Líder", type: "influencer", orbit: 1,  angle: 315 },
  // Outer orbit (r = 124) — monitoring
  { id: "n8",  label: "Aceleradora",   type: "investor",   orbit: 2,  angle: 60  },
  { id: "n9",  label: "Fornecedor",    type: "partner",    orbit: 2,  angle: 180 },
  { id: "n10", label: "Revista Setor", type: "influencer", orbit: 2,  angle: 300 },
];

const EDGES: [string, string][] = [
  ["you","n1"], ["you","n2"], ["you","n3"],
  ["you","n4"], ["you","n6"], ["you","n7"],
  ["n1","n4"],  ["n1","n8"],  ["n2","n5"],
];

function OrbitalMap({ filter }: { filter: string }) {
  return (
    <svg width={288} height={288} viewBox="0 0 288 288" style={{ display: "block" }}>
      {/* Orbit rings */}
      {RADII.map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={0.8}
          strokeDasharray="4 7"
          style={{
            animation: `${i % 2 === 0 ? "sk-dash-cw" : "sk-dash-ccw"} ${8 + i * 3}s linear infinite`,
          }}
        />
      ))}

      {/* Connection lines */}
      {EDGES.map(([a, b]) => {
        const na = NODES.find(n => n.id === a)!;
        const nb = NODES.find(n => n.id === b)!;
        const [x1, y1] = toXY(na.orbit, na.angle);
        const [x2, y2] = toXY(nb.orbit, nb.angle);
        const color = TYPE_COLOR[nb.type] ?? TYPE_COLOR[na.type];
        const active = filter === "all" || filter === nb.type || filter === na.type;
        return (
          <line key={`${a}-${b}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth={0.7}
            strokeDasharray="3 5"
            opacity={active ? 0.28 : 0.05}
          />
        );
      })}

      {/* Center pulsing rings */}
      <circle cx={CX} cy={CY} r={26} fill="none" stroke="rgba(255,149,0,0.3)">
        <animate attributeName="r"       values="22;36;22" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={CX} cy={CY} r={18}
        fill="rgba(255,149,0,0.10)"
        stroke="rgba(255,149,0,0.8)"
        strokeWidth={1.5}
      />
      <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
        fill="#ff9500" fontSize={7} fontWeight={900} letterSpacing={0.5}>
        VOCÊ
      </text>

      {/* Stakeholder nodes */}
      {NODES.filter(n => n.orbit >= 0).map((node, i) => {
        const [x, y] = toXY(node.orbit, node.angle);
        const color = TYPE_COLOR[node.type];
        const active = filter === "all" || filter === node.type;
        const r = [10, 8, 7][node.orbit] ?? 7;
        // Label above for bottom-half nodes (angle 130–250°)
        const a = ((node.angle % 360) + 360) % 360;
        const labelDY = a > 130 && a < 250 ? -(r + 10) : r + 10;
        return (
          <g key={node.id}
            opacity={active ? 1 : 0.12}
            style={{ animation: `sk-appear 0.4s ease ${i * 0.07}s both` }}
          >
            <circle cx={x} cy={y} r={r + 5} fill={color} opacity={0.07} />
            <circle cx={x} cy={y} r={r}
              fill={`${color}18`}
              stroke={color}
              strokeWidth={1.2}
            />
            <text x={x} y={y + labelDY}
              textAnchor="middle"
              fill={color}
              fontSize={6.5}
              fontWeight={600}
              opacity={0.78}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Power × Interest Matrix ──────────────────────────────────────────────────

interface MatrixNode { label: string; power: number; interest: number; type: string; }

const MATRIX: MatrixNode[] = [
  { label: "Fundo Alpha",   power: 88, interest: 90, type: "investor"   },
  { label: "Distribuidora", power: 78, interest: 82, type: "partner"    },
  { label: "@TopCreator",   power: 70, interest: 87, type: "influencer" },
  { label: "Angel João",    power: 82, interest: 30, type: "investor"   },
  { label: "Fornecedor",    power: 72, interest: 38, type: "partner"    },
  { label: "Assoc. Setor",  power: 36, interest: 74, type: "community"  },
  { label: "Podcast Líder", power: 40, interest: 68, type: "influencer" },
  { label: "Parceiro Tech", power: 28, interest: 28, type: "partner"    },
  { label: "Aceleradora",   power: 22, interest: 32, type: "investor"   },
  { label: "Revista Setor", power: 18, interest: 42, type: "influencer" },
];

function PowerMatrix({ filter }: { filter: string }) {
  const W = 520, H = 200, PAD = 44;
  const pW = W - 2 * PAD, pH = H - 2 * PAD;
  const midX = PAD + pW / 2;
  const midY = PAD + pH / 2;

  const mx = (interest: number) => PAD + (interest / 100) * pW;
  const my = (power: number)    => PAD + pH - (power / 100) * pH;

  const quadrants = [
    { x: midX, y: PAD,  w: W - PAD - midX, h: midY - PAD,     fill: "rgba(16,185,129,0.05)",  label: "ENGAJAR DE PERTO",  lx: midX + 5, ly: PAD + 9,       color: "rgba(16,185,129,0.45)",  anchor: "start" as const },
    { x: PAD,  y: PAD,  w: midX - PAD,     h: midY - PAD,     fill: "rgba(99,102,241,0.04)",  label: "MANTER SATISFEITO", lx: midX - 5, ly: PAD + 9,       color: "rgba(99,102,241,0.40)",  anchor: "end"   as const },
    { x: midX, y: midY, w: W - PAD - midX, h: H - PAD - midY, fill: "rgba(245,158,11,0.04)",  label: "MANTER INFORMADO",  lx: midX + 5, ly: H - PAD - 4,   color: "rgba(245,158,11,0.40)",  anchor: "start" as const },
    { x: PAD,  y: midY, w: midX - PAD,     h: H - PAD - midY, fill: "rgba(255,255,255,0.01)", label: "MONITORAR",         lx: midX - 5, ly: H - PAD - 4,   color: "rgba(255,255,255,0.18)", anchor: "end"   as const },
  ];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      {quadrants.map((q, i) => (
        <rect key={i} x={q.x} y={q.y} width={q.w} height={q.h} fill={q.fill} />
      ))}
      {/* Dividers */}
      <line x1={midX} y1={PAD}   x2={midX} y2={H - PAD}
        stroke="rgba(255,255,255,0.10)" strokeWidth={0.8} strokeDasharray="3 4" />
      <line x1={PAD}  y1={midY}  x2={W - PAD} y2={midY}
        stroke="rgba(255,255,255,0.10)" strokeWidth={0.8} strokeDasharray="3 4" />
      {/* Quadrant labels */}
      {quadrants.map((q, i) => (
        <text key={i} x={q.lx} y={q.ly}
          textAnchor={q.anchor}
          fill={q.color}
          fontSize={7} fontWeight={800} letterSpacing={0.8}
        >
          {q.label}
        </text>
      ))}
      {/* Axis labels */}
      <text x={W / 2} y={H - 5} textAnchor="middle"
        fill="rgba(255,255,255,0.12)" fontSize={7}>
        ← Baixo Interesse · Alto Interesse →
      </text>
      <text x={9} y={H / 2} textAnchor="middle"
        fill="rgba(255,255,255,0.12)" fontSize={7}
        transform={`rotate(-90 9 ${H / 2})`}>
        ← Baixo Poder · Alto Poder →
      </text>
      {/* Dots */}
      {MATRIX.map((m, i) => {
        const x = mx(m.interest), y = my(m.power);
        const color = TYPE_COLOR[m.type];
        const active = filter === "all" || filter === m.type;
        return (
          <g key={i}
            opacity={active ? 1 : 0.12}
            style={{ animation: `sk-appear 0.35s ease ${i * 0.05}s both` }}
          >
            <circle cx={x} cy={y} r={9} fill={color} opacity={0.07} />
            <circle cx={x} cy={y} r={5} fill={color} opacity={0.55} />
            <text x={x} y={y - 9} textAnchor="middle"
              fill={color} fontSize={6.5} fontWeight={600} opacity={0.82}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Priority Card ────────────────────────────────────────────────────────────

interface PriorityNode {
  name: string; type: string; influence: number;
  lastTouch: string; nextAction: string; urgency: "high" | "medium" | "low";
}

const PRIORITY: PriorityNode[] = [
  { name: "Fundo Alpha",   type: "investor",   influence: 88, lastTouch: "há 3 dias",   nextAction: "Reunião Q2",         urgency: "high"   },
  { name: "@TopCreator",   type: "influencer", influence: 70, lastTouch: "há 1 semana", nextAction: "Proposta de collab", urgency: "medium" },
  { name: "Distribuidora", type: "partner",    influence: 78, lastTouch: "há 2 dias",   nextAction: "Revisar contrato",   urgency: "high"   },
];

function StakeholderCard({ data }: { data: PriorityNode }) {
  const color = TYPE_COLOR[data.type];
  const urgencyColor  = data.urgency === "high" ? "#ef4444" : data.urgency === "medium" ? "#ff9500" : "#10b981";
  const urgencyLabel  = data.urgency === "high" ? "URGENTE"  : data.urgency === "medium" ? "ATENÇÃO"  : "OK";

  return (
    <div style={{
      padding: "16px 16px 14px", borderRadius: 13,
      background: "rgba(255,255,255,0.025)",
      backdropFilter: "blur(12px) saturate(180%)",
      WebkitBackdropFilter: "blur(12px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderTop: `2px solid ${color}`,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 4 }}>
            {data.name}
          </div>
          <span style={{
            fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            background: `${color}18`, border: `1px solid ${color}35`,
            color, letterSpacing: 0.5,
          }}>
            {TYPE_LABEL[data.type] ?? data.type}
          </span>
        </div>
        <span style={{
          fontSize: 7.5, fontWeight: 800, padding: "3px 7px", borderRadius: 5,
          background: `${urgencyColor}12`, border: `1px solid ${urgencyColor}32`,
          color: urgencyColor, letterSpacing: 0.5,
        }}>
          {urgencyLabel}
        </span>
      </div>

      {/* Influence bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Influência</span>
          <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "JetBrains Mono, monospace" }}>
            {data.influence}%
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, opacity: 0.75,
            width: `${data.influence}%`, background: color,
          }} />
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={9} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)" }}>
            Último contato:{" "}
            <span style={{ color: "rgba(255,255,255,0.55)" }}>{data.lastTouch}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={9} style={{ color, flexShrink: 0 }} />
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)" }}>
            Próxima ação:{" "}
            <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{data.nextAction}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CategoryDef {
  type: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  count: number; active: number; total: number; label: string;
}

const CATEGORIES: CategoryDef[] = [
  { type: "investor",   Icon: TrendingUp, count: 3, active: 2, total: 12, label: "Investidores"    },
  { type: "partner",    Icon: Building2,  count: 3, active: 2, total: 8,  label: "Parceiros"       },
  { type: "influencer", Icon: Star,       count: 4, active: 3, total: 23, label: "Influenciadores" },
  { type: "community",  Icon: Users,      count: 1, active: 1, total: 5,  label: "Comunidades"     },
];

export function StakeholdersHero() {
  const [filter, setFilter] = useState("all");

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero: Title + Orbital Map ──────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          position: "relative", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 296px", gap: 28, alignItems: "center",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: -50, right: 210, width: 280, height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,149,0,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Left */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Network size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>
                  STAKEHOLDERS · GRUPO MERCADO
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>
                  Mapa do Ecossistema
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, maxWidth: 460, margin: "0 0 20px" }}>
              Visualize e gerencie todos os agentes ao redor do negócio — investidores, parceiros,
              criadores e comunidades que determinam seu acesso e influência no mercado.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
              {[
                { label: "Mapeados",       value: "11", color: "#ff9500"  },
                { label: "Alta influência", value: "3",  color: "#10b981"  },
                { label: "Ação pendente",   value: "2",  color: "#ef4444"  },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Type filter */}
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
                FILTRAR POR TIPO
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(TYPE_LABEL).map(([key, label]) => {
                  const color = key === "all" ? "#ff9500" : TYPE_COLOR[key];
                  const active = filter === key;
                  return (
                    <button key={key} onClick={() => setFilter(key)} style={{
                      padding: "5px 12px", borderRadius: 7, fontSize: 11, cursor: "pointer",
                      fontWeight: active ? 700 : 400,
                      background: active ? `${color}18` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active ? `${color}40` : "rgba(255,255,255,0.07)"}`,
                      color: active ? color : "rgba(255,255,255,0.35)",
                      transition: "all 0.15s",
                    }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Orbital Map */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.6, color: "rgba(255,255,255,0.18)", alignSelf: "flex-start" }}>
              MAPA ORBITAL
            </div>
            <div style={{
              borderRadius: 12,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: 4,
            }}>
              <OrbitalMap filter={filter} />
            </div>
          </div>
        </div>

        {/* ── Power × Interest Matrix ─────────────────────────────────────────── */}
        <div style={{
          borderRadius: 14, padding: "18px 20px 14px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.24)" }}>
              MATRIZ PODER × INTERESSE
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
              {filter === "all" ? "Todos os stakeholders" : TYPE_LABEL[filter]}
            </span>
          </div>
          <PowerMatrix filter={filter} />
        </div>

        {/* ── Priority Stakeholders ──────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
            AÇÃO PRIORITÁRIA — TOP 3 STAKEHOLDERS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {PRIORITY.map((p, i) => (
              <div key={p.name} style={{ animation: `sk-appear 0.35s ease ${i * 0.08}s both` }}>
                <StakeholderCard data={p} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Category Summary ──────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {CATEGORIES.map((cat, i) => {
            const color = TYPE_COLOR[cat.type];
            const isActive = filter === cat.type;
            return (
              <div key={cat.type}
                onClick={() => setFilter(isActive ? "all" : cat.type)}
                style={{
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                  background: isActive ? `${color}10` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? `${color}30` : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.15s",
                  animation: `sk-appear 0.4s ease ${i * 0.07}s both`,
                }}
              >
                <cat.Icon size={16} strokeWidth={1.8} style={{ color, marginBottom: 10, display: "block" }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>
                  {cat.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace" }}>
                    {cat.count}
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)" }}>
                    / {cat.total} potenciais
                  </span>
                </div>
                {/* Activation bar */}
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${(cat.active / cat.count) * 100}%`,
                    background: color, opacity: 0.6,
                  }} />
                </div>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", marginTop: 5 }}>
                  {cat.active} ativos
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
