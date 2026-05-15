import { TrendingUp, TrendingDown, Minus, Calendar, ArrowRight } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes cv-appear { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
@keyframes cv-bar    { from{width:0} to{width:var(--w)} }
@keyframes cv-draw   { from{opacity:0;stroke-dashoffset:800} to{opacity:1;stroke-dashoffset:0} }
@keyframes cv-fill   { from{opacity:0} to{opacity:1} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SNAP_A = { label: "Jan 2026", tag: "Diagnóstico Inicial" };
const SNAP_B = { label: "Mai 2026", tag: "Diagnóstico Atual"   };

interface Group { id: string; label: string; color: string; a: number; b: number; }
const GROUPS: Group[] = [
  { id: "mercado",    label: "Mercado",    color: "#3b82f6", a: 55, b: 67 },
  { id: "audiencia",  label: "Audiência",  color: "#ec4899", a: 78, b: 74 },
  { id: "marca",      label: "Marca",      color: "#8b5cf6", a: 60, b: 62 },
  { id: "estrategia", label: "Estratégia", color: "#10b981", a: 42, b: 61 },
  { id: "veredito",   label: "Veredito",   color: "#ff9500", a: 52, b: 75 },
];

const SCORE_A = Math.round(GROUPS.reduce((s, g) => s + g.a, 0) / GROUPS.length);
const SCORE_B = Math.round(GROUPS.reduce((s, g) => s + g.b, 0) / GROUPS.length);
const DELTA   = SCORE_B - SCORE_A;

interface Module {
  name: string; group: string; color: string; a: number; b: number;
}
const MODULES: Module[] = [
  { name: "Business Plan",    group: "Estratégia", color: "#10b981", a: 40, b: 65 },
  { name: "Concorrentes",     group: "Mercado",    color: "#3b82f6", a: 48, b: 71 },
  { name: "Benchmarking",     group: "Mercado",    color: "#3b82f6", a: 55, b: 74 },
  { name: "Veredito",         group: "Veredito",   color: "#ff9500", a: 52, b: 75 },
  { name: "OKR",              group: "Estratégia", color: "#10b981", a: 38, b: 52 },
  { name: "Compliance",       group: "Estratégia", color: "#10b981", a: 45, b: 60 },
  { name: "Pulso do Mercado", group: "Mercado",    color: "#3b82f6", a: 52, b: 65 },
  { name: "Dores",            group: "Audiência",  color: "#ec4899", a: 75, b: 80 },
  { name: "DNA da Marca",     group: "Marca",      color: "#8b5cf6", a: 65, b: 68 },
  { name: "Tendências",       group: "Mercado",    color: "#3b82f6", a: 60, b: 68 },
  { name: "Audiência",        group: "Audiência",  color: "#ec4899", a: 82, b: 70 },
  { name: "Canais",           group: "Audiência",  color: "#ec4899", a: 74, b: 72 },
  { name: "Sentimento",       group: "Mercado",    color: "#3b82f6", a: 62, b: 60 },
  { name: "Precificação",     group: "Marca",      color: "#8b5cf6", a: 55, b: 58 },
].sort((a, b) => Math.abs(b.b - b.a) - Math.abs(a.b - a.a));

// ─── Dual Pentagon Radar ──────────────────────────────────────────────────────

const CX = 148, CY = 138, MAX_R = 88;

function pt(i: number, score: number): [number, number] {
  const rad = (i * 72 - 90) * Math.PI / 180;
  const r   = (score / 100) * MAX_R;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}
function labelPt(i: number): [number, number] {
  const rad = (i * 72 - 90) * Math.PI / 180;
  const r   = MAX_R * 1.26;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}
function toPolygon(scores: number[]) {
  return scores.map((s, i) => pt(i, s).join(",")).join(" ");
}

function DualRadar() {
  const scoresA = GROUPS.map(g => g.a);
  const scoresB = GROUPS.map(g => g.b);
  const rings   = [25, 50, 75, 100];

  return (
    <svg width={296} height={276} viewBox="0 0 296 276" style={{ display: "block" }}>
      {/* Grid rings */}
      {rings.map(r => (
        <polygon key={r}
          points={toPolygon(Array(5).fill(r))}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={0.7}
        />
      ))}
      {/* Axis lines */}
      {GROUPS.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.7} />;
      })}

      {/* ── BEFORE polygon (dashed, gray) ── */}
      <polygon
        points={toPolygon(scoresA)}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1.4}
        strokeDasharray="5 4"
        style={{ animation: "cv-fill 0.5s ease 0.1s both" }}
      />

      {/* ── AFTER polygon (solid, orange glow) ── */}
      <polygon
        points={toPolygon(scoresB)}
        fill="rgba(255,149,0,0.07)"
        stroke="rgba(255,149,0,0.75)"
        strokeWidth={1.8}
        strokeDasharray="800"
        style={{ animation: "cv-draw 1.4s ease 0.3s both" }}
      />

      {/* Group vertex dots — before (gray) */}
      {GROUPS.map((g, i) => {
        const [x, y] = pt(i, g.a);
        return <circle key={`a${i}`} cx={x} cy={y} r={3} fill="rgba(255,255,255,0.3)" />;
      })}
      {/* Group vertex dots — after (colored) */}
      {GROUPS.map((g, i) => {
        const [x, y] = pt(i, g.b);
        return (
          <g key={`b${i}`} style={{ animation: `cv-appear 0.3s ease ${0.4 + i * 0.07}s both` }}>
            <circle cx={x} cy={y} r={5.5} fill={g.color} opacity={0.12} />
            <circle cx={x} cy={y} r={3.5} fill={g.color} opacity={0.85} />
          </g>
        );
      })}

      {/* Vertex labels */}
      {GROUPS.map((g, i) => {
        const [lx, ly] = labelPt(i);
        const delta    = g.b - g.a;
        return (
          <g key={`lbl${i}`} style={{ animation: `cv-appear 0.3s ease ${0.6 + i * 0.06}s both` }}>
            <text x={lx} y={ly - 5} textAnchor="middle" dominantBaseline="middle"
              fill={g.color} fontSize={8} fontWeight={800}>
              {g.label}
            </text>
            <text x={lx} y={ly + 7} textAnchor="middle"
              fill={delta >= 0 ? "#10b981" : "#ef4444"} fontSize={7.5} fontWeight={700}
              fontFamily="JetBrains Mono, monospace">
              {delta >= 0 ? "+" : ""}{delta}
            </text>
          </g>
        );
      })}

      {/* Center: overall scores */}
      <text x={CX} y={CY - 10} textAnchor="middle"
        fill="rgba(255,255,255,0.9)" fontSize={22} fontWeight={900}
        fontFamily="JetBrains Mono, monospace">
        {SCORE_B}
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle"
        fill={DELTA >= 0 ? "#10b981" : "#ef4444"} fontSize={10} fontWeight={800}
        fontFamily="JetBrains Mono, monospace">
        {DELTA >= 0 ? "+" : ""}{DELTA} pts
      </text>
      <text x={CX} y={CY + 20} textAnchor="middle"
        fill="rgba(255,255,255,0.2)" fontSize={6.5} fontWeight={600} letterSpacing={0.5}>
        SCORE GERAL
      </text>

      {/* Legend */}
      <g transform="translate(8, 256)">
        <line x1={0} y1={4} x2={18} y2={4} stroke="rgba(255,255,255,0.3)" strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={22} y={8} fill="rgba(255,255,255,0.3)" fontSize={7}>{SNAP_A.label}</text>
      </g>
      <g transform="translate(90, 256)">
        <line x1={0} y1={4} x2={18} y2={4} stroke="rgba(255,149,0,0.75)" strokeWidth={1.8} />
        <text x={22} y={8} fill="rgba(255,149,0,0.75)" fontSize={7}>{SNAP_B.label}</text>
      </g>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ComparativoHero() {
  const improved  = GROUPS.filter(g => g.b > g.a).length;
  const regressed = GROUPS.filter(g => g.b < g.a).length;

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          display: "grid", gridTemplateColumns: "1fr 312px", gap: 32, alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: 220, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Left */}
          <div style={{ position: "relative" }}>
            {/* Module label */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>COMPARATIVO · GRUPO VEREDITO</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>Evolução do Diagnóstico</div>
              </div>
            </div>

            {/* Snapshot selector bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <Calendar size={11} style={{ color: "rgba(255,255,255,0.25)" }} />
              <div style={{ padding: "4px 12px", borderRadius: 7, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 1 }}>{SNAP_A.tag}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", fontFamily: "JetBrains Mono, monospace" }}>{SNAP_A.label}</div>
              </div>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)", position: "relative" }}>
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", padding: "2px 8px", borderRadius: 4, background: "#04060f", border: "1px solid rgba(255,255,255,0.08)", fontSize: 8, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                  4 meses
                </div>
              </div>
              <div style={{ padding: "4px 12px", borderRadius: 7, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.25)" }}>
                <div style={{ fontSize: 8, color: "rgba(255,149,0,0.5)", marginBottom: 1 }}>{SNAP_B.tag}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,149,0,0.9)", fontFamily: "JetBrains Mono, monospace" }}>{SNAP_B.label}</div>
              </div>
            </div>

            {/* Score delta — the big number */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>{SNAP_A.label}</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{SCORE_A}</div>
              </div>
              <div style={{ textAlign: "center", paddingBottom: 6 }}>
                <div style={{ fontSize: 24, color: "rgba(255,255,255,0.15)" }}>→</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(255,149,0,0.5)", marginBottom: 4 }}>{SNAP_B.label}</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{SCORE_B}</div>
              </div>
              <div style={{ paddingBottom: 8, marginLeft: 4 }}>
                <div style={{
                  padding: "6px 14px", borderRadius: 10,
                  background: DELTA >= 0 ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
                  border: `1px solid ${DELTA >= 0 ? "rgba(16,185,129,0.28)" : "rgba(239,68,68,0.28)"}`,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: DELTA >= 0 ? "#10b981" : "#ef4444", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                    {DELTA >= 0 ? "+" : ""}{DELTA}
                  </div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>pontos</div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Grupos melhoraram", value: improved,  color: "#10b981" },
                { label: "Grupos regrediram", value: regressed, color: "#ef4444" },
                { label: "Módulos avaliados", value: MODULES.length, color: "rgba(255,255,255,0.4)" },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, padding: "10px 12px", borderRadius: 10,
                  background: `${s.color}08`, border: `1px solid ${s.color}1a`,
                  display: "flex", flexDirection: "column", gap: 2,
                }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dual Pentagon Radar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.6, color: "rgba(255,255,255,0.18)", alignSelf: "flex-start" }}>
              RADAR DE EVOLUÇÃO
            </div>
            <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: 4 }}>
              <DualRadar />
            </div>
          </div>
        </div>

        {/* ── Group-by-group deltas ─────────────────────────────────────────── */}
        <div style={{
          borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 80px 280px 80px 1fr",
            gap: 12, padding: "10px 24px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.22)", textAlign: "right" }}>{SNAP_A.label}</span>
            <span />
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.22)", textAlign: "center" }}>EVOLUÇÃO POR GRUPO</span>
            <span />
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1, color: "rgba(255,149,0,0.5)" }}>{SNAP_B.label}</span>
          </div>

          {/* Group rows */}
          {GROUPS.map((g, i) => {
            const delta = g.b - g.a;
            const Icon  = delta > 2 ? TrendingUp : delta < -2 ? TrendingDown : Minus;
            const dc    = delta > 2 ? "#10b981"  : delta < -2 ? "#ef4444"   : "rgba(255,255,255,0.35)";
            return (
              <div key={g.id} style={{
                display: "grid", gridTemplateColumns: "1fr 80px 280px 80px 1fr",
                gap: 12, padding: "14px 24px", alignItems: "center",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: i < GROUPS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                animation: `cv-appear 0.3s ease ${i * 0.07}s both`,
              }}>
                {/* Before score */}
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>{g.a}</span>
                </div>

                {/* Before bar (right-aligned) */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ width: `${g.a * 0.7}px`, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.10)" }} />
                </div>

                {/* Center: group name + delta */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: g.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.72)" }}>{g.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "1px 8px", borderRadius: 5, background: `${dc}12`, border: `1px solid ${dc}25` }}>
                      <Icon size={9} style={{ color: dc }} strokeWidth={2.2} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: dc, fontFamily: "JetBrains Mono, monospace" }}>
                        {delta >= 0 ? "+" : ""}{delta}
                      </span>
                    </div>
                  </div>
                </div>

                {/* After bar (left-aligned) */}
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ width: `${g.b * 0.7}px`, height: 7, borderRadius: 4, background: g.color, opacity: 0.65 }} />
                </div>

                {/* After score */}
                <div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: g.color, fontFamily: "JetBrains Mono, monospace" }}>{g.b}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Module movement table ─────────────────────────────────────────── */}
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 90px 80px 80px 90px 120px",
            gap: 8, padding: "10px 20px",
            background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {["MÓDULO", "GRUPO", SNAP_A.label, SNAP_B.label, "VARIAÇÃO", "MOVIMENTO"].map(h => (
              <span key={h} style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)" }}>{h}</span>
            ))}
          </div>

          {MODULES.map((m, i) => {
            const delta  = m.b - m.a;
            const pct    = Math.round((delta / m.a) * 100);
            const dc     = delta > 2 ? "#10b981" : delta < -2 ? "#ef4444" : "rgba(255,255,255,0.3)";
            const Icon   = delta > 2 ? TrendingUp : delta < -2 ? TrendingDown : Minus;
            const barMax = 100;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 90px 80px 80px 90px 120px",
                gap: 8, padding: "11px 20px", alignItems: "center",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: i < MODULES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                animation: `cv-appear 0.3s ease ${i * 0.04}s both`,
              }}>
                <span style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>{m.name}</span>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>{m.group}</span>
                </div>

                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>{m.a}</span>

                <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.b}</span>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon size={10} style={{ color: dc }} strokeWidth={2.2} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: dc, fontFamily: "JetBrains Mono, monospace" }}>
                    {delta >= 0 ? "+" : ""}{delta} ({pct >= 0 ? "+" : ""}{pct}%)
                  </span>
                </div>

                {/* Progress comparison bars */}
                <div style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                  {/* Before bar (dim) */}
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 3, width: `${(m.a / barMax) * 100}%`, background: "rgba(255,255,255,0.14)" }} />
                  {/* After bar (colored, on top) */}
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 3, width: `${(m.b / barMax) * 100}%`, background: m.color, opacity: 0.65 }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
