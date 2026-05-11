// ─── DNA da Marca — O Espectro ───────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes radar-draw {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes word-appear {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pillar-rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gap-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(255,149,0,0.3); }
  50%       { box-shadow: 0 0 10px rgba(255,149,0,0.5); }
}
`;

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface Archetype {
  name: string;
  role: "primary" | "secondary" | "shadow";
  pct: number;
  desc: string;
  color: string;
}

interface Dimension {
  leftLabel: string;
  rightLabel: string;
  current: number; // 0–100
  ideal: number;   // 0–100
  gap: number;     // ideal - current
}

interface ContentPillar {
  code: string;
  title: string;
  desc: string;
  formats: string[];
  share: number; // % of content mix
}

const ARCHETYPES: Archetype[] = [
  {
    name: "O Sábio",
    role: "primary",
    pct: 62,
    desc: "Conhecimento especializado como diferencial. Resultado documentado, protocolo com ciência, autoridade técnica que educa antes de vender.",
    color: "#ff9500",
  },
  {
    name: "O Cuidador",
    role: "secondary",
    pct: 28,
    desc: "Cuidado genuíno e presença contínua. O follow-up estruturado, a comunicação empática, o cliente que sente que foi visto — não apenas atendido.",
    color: "rgba(255,149,0,0.6)",
  },
  {
    name: "O Criador",
    role: "shadow",
    pct: 10,
    desc: "Potencial latente: protocolos exclusivos, combinações únicas, abordagem autoral. Ainda não comunicado — oportunidade de diferenciação.",
    color: "rgba(255,149,0,0.3)",
  },
];

// Radar axes match archetype order: Sabio, Cuidador, Criador + 3 more axes
const RADAR_AXES = [
  { label: "Autoridade",    current: 52, ideal: 82 },
  { label: "Acolhimento",   current: 48, ideal: 74 },
  { label: "Inovação",      current: 28, ideal: 55 },
  { label: "Clareza",       current: 55, ideal: 80 },
  { label: "Presença",      current: 35, ideal: 68 },
  { label: "Consistência",  current: 42, ideal: 76 },
];

const DIMENSIONS: Dimension[] = [
  { leftLabel: "Tradicional",  rightLabel: "Inovador",      current: 34, ideal: 62, gap: 28 },
  { leftLabel: "Acessível",    rightLabel: "Premium",        current: 38, ideal: 72, gap: 34 },
  { leftLabel: "Técnico",      rightLabel: "Emocional",      current: 65, ideal: 52, gap: -13 },
  { leftLabel: "Reservado",    rightLabel: "Expressivo",     current: 28, ideal: 58, gap: 30 },
  { leftLabel: "Genérico",     rightLabel: "Especializado",  current: 44, ideal: 84, gap: 40 },
  { leftLabel: "Frio",         rightLabel: "Acolhedor",      current: 46, ideal: 76, gap: 30 },
];

const WORDS_OWN  = ["Resultado", "Protocolo", "Garantia", "Segurança", "Especialista", "Follow-up", "Documentado", "Exclusivo"];
const WORDS_AVOID = ["Barato", "Promoção", "Normal", "Qualquer", "Rápido", "Simples"];

const PILLARS: ContentPillar[] = [
  {
    code: "P1",
    title: "Prova de Resultado",
    desc: "Antes/depois documentados com protocolo, data e contexto. Resultado como argumento de venda.",
    formats: ["Foto padronizada", "Depoimento estruturado", "Comparativo técnico"],
    share: 35,
  },
  {
    code: "P2",
    title: "Educação Técnica",
    desc: "Ciência por trás do procedimento, ingredientes, mecanismo de ação. Autoridade que educa.",
    formats: ["Explicação de protocolo", "Mito vs. Realidade", "Bastidores técnicos"],
    share: 30,
  },
  {
    code: "P3",
    title: "Humanização",
    desc: "A equipe, o processo, o cuidado nos detalhes. O que acontece antes, durante e depois.",
    formats: ["Equipe em ação", "Ritual de atendimento", "Follow-up real"],
    share: 20,
  },
  {
    code: "P4",
    title: "Transformação Real",
    desc: "Histórias de clientes com contexto emocional. Não o procedimento — o impacto na vida.",
    formats: ["Jornada do cliente", "Impacto além da estética", "Histórias de confiança"],
    share: 15,
  },
];

const TONE_MATRIX = [
  { x: "Sim", y: "Confiante",   desc: "Afirma o que entrega. Não pede permissão." },
  { x: "Sim", y: "Técnico",     desc: "Usa o vocabulário correto — explica sem simplificar." },
  { x: "Sim", y: "Acolhedor",   desc: "Cuida do tom — o cliente se sente visto." },
  { x: "Sim", y: "Claro",       desc: "Uma ideia por vez. Sem enrolação." },
  { x: "Não", y: "Arrogante",   desc: "Não compara depreciativamente com concorrentes." },
  { x: "Não", y: "Informal",    desc: "Não usa gírias ou tom de amizade excessivo." },
  { x: "Não", y: "Vago",        desc: "Sem promessas sem fundamento ou superlativo vazio." },
  { x: "Não", y: "Promocional", desc: "Não tem urgência artificial — o valor já convence." },
];

// ─── Radar SVG ────────────────────────────────────────────────────────────────

function RadarChart() {
  const CX = 120, CY = 120, R = 90;
  const N = RADAR_AXES.length;

  const point = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (val / 100) * R;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  const labelPt = (i: number) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = R + 16;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  const currentPts = RADAR_AXES.map((a, i) => point(a.current, i));
  const idealPts   = RADAR_AXES.map((a, i) => point(a.ideal, i));
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <svg viewBox="0 0 240 240" style={{ width: "100%", height: "100%", display: "block", animation: "radar-draw 0.5s ease" }}>
      {/* Grid rings */}
      {gridLevels.map(lvl => {
        const pts = RADAR_AXES.map((_, i) => point(lvl, i));
        return <path key={lvl} d={toPath(pts)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />;
      })}

      {/* Grid spokes */}
      {RADAR_AXES.map((_, i) => {
        const outer = point(100, i);
        return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />;
      })}

      {/* Ideal area */}
      <path d={toPath(idealPts)} fill="rgba(255,149,0,0.08)" stroke="rgba(255,149,0,0.35)" strokeWidth="1.2" strokeDasharray="3,2" />

      {/* Current area */}
      <path d={toPath(currentPts)} fill="rgba(255,149,0,0.05)" stroke="rgba(255,149,0,0.6)" strokeWidth="1.5" />

      {/* Current nodes */}
      {currentPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#ff9500" opacity="0.85" />
      ))}

      {/* Ideal nodes */}
      {idealPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill="none" stroke="#ff9500" strokeWidth="1" opacity="0.55" />
      ))}

      {/* Axis labels */}
      {RADAR_AXES.map((a, i) => {
        const lp = labelPt(i);
        const isRight = lp.x > CX + 5;
        const isLeft  = lp.x < CX - 5;
        const anchor  = isRight ? "start" : isLeft ? "end" : "middle";
        return (
          <text key={i} x={lp.x} y={lp.y + 1.5} textAnchor={anchor} fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="JetBrains Mono">
            {a.label}
          </text>
        );
      })}

      {/* Center label */}
      <text x={CX} y={CY + 2} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.15)" fontFamily="JetBrains Mono">DNA</text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Espectro() {
  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>DNA DA MARCA — O ESPECTRO</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "ARQUÉTIPO PRIMÁRIO",  value: "SÁBIO",    color: "#ff9500"                },
              { label: "ALINHAMENTO DNA",      value: "41%",      color: "#ef4444"                },
              { label: "GAP CRÍTICO",          value: "EXPRESSÃO",color: "#ef4444"                },
              { label: "PILARES DEFINIDOS",    value: "4",        color: "rgba(255,255,255,0.55)" },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 1: RADAR + ARCHETYPES ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Radar */}
        <div style={{ padding: "24px", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace" }}>PERFIL DO DNA</div>
          <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
            <RadarChart />
          </div>
          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 22, height: 1.5, background: "rgba(255,149,0,0.65)", flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>DNA atual — 41% alinhado</span>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ width: 22, height: 1.5, background: "rgba(255,149,0,0.4)", flexShrink: 0, borderTop: "1px dashed rgba(255,149,0,0.4)" }} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>DNA ideal — referência alvo</span>
            </div>
          </div>
        </div>

        {/* Archetypes */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>PERFIL ARQUETÍPICO</div>
          {ARCHETYPES.map((arch, i) => (
            <div key={i} style={{
              padding: "18px 20px",
              background: arch.role === "primary" ? "rgba(255,149,0,0.05)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${arch.role === "primary" ? "rgba(255,149,0,0.2)" : "rgba(255,255,255,0.05)"}`,
              borderLeft: `3px solid ${arch.color}`,
              borderRadius: "0 8px 8px 0",
              animation: `word-appear 0.3s ease ${i * 0.1}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                    {arch.role === "primary" ? "PRIMÁRIO" : arch.role === "secondary" ? "SECUNDÁRIO" : "SOMBRA (LATENTE)"}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: arch.color }}>{arch.name}</div>
                </div>
                <div style={{
                  fontSize: 28, fontWeight: 900, color: arch.color, fontFamily: "JetBrains Mono, monospace",
                  opacity: arch.role === "primary" ? 1 : 0.6, lineHeight: 1,
                }}>{arch.pct}%</div>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{arch.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: DIMENSION SPECTRUM ────────────────────────────────── */}
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace" }}>ESPECTRO DE DIMENSÕES</span>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginLeft: 12 }}>POSIÇÃO ATUAL vs. POSIÇÃO IDEAL — GAP DO DNA</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
          {DIMENSIONS.map((dim, i) => {
            const isNegGap = dim.gap < 0;
            const gapAbs   = Math.abs(dim.gap);
            const gapColor = gapAbs > 30 ? "#ef4444" : gapAbs > 15 ? "#f97316" : "#ff9500";
            const delay    = i * 0.06;
            return (
              <div key={i} style={{ animation: `word-appear 0.3s ease ${delay}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono, monospace" }}>{dim.leftLabel}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono, monospace" }}>{dim.rightLabel}</span>
                </div>

                {/* Track */}
                <div style={{ position: "relative", height: 28 }}>
                  {/* Background track */}
                  <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, transform: "translateY(-50%)", background: "rgba(255,255,255,0.05)", borderRadius: 2 }} />

                  {/* Gap fill between current and ideal */}
                  <div style={{
                    position: "absolute", top: "50%", height: 4, transform: "translateY(-50%)",
                    left: `${Math.min(dim.current, dim.ideal)}%`,
                    width: `${gapAbs}%`,
                    background: `${gapColor}30`,
                    borderRadius: 2,
                    animation: `bar-grow 0.5s ease ${delay}s both`,
                    transformOrigin: "left",
                  }} />

                  {/* Current marker */}
                  <div style={{
                    position: "absolute", top: "50%", left: `${dim.current}%`,
                    transform: "translate(-50%, -50%)",
                    width: 14, height: 14, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    zIndex: 2,
                  }}>
                    <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 3,
                      fontSize: 7, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>
                      {dim.current}
                    </div>
                  </div>

                  {/* Ideal marker */}
                  <div style={{
                    position: "absolute", top: "50%", left: `${dim.ideal}%`,
                    transform: "translate(-50%, -50%)",
                    width: 14, height: 14, borderRadius: "50%",
                    background: "#ff9500",
                    border: "1.5px solid #ff9500",
                    boxShadow: "0 0 8px rgba(255,149,0,0.5)",
                    zIndex: 2,
                    animation: "gap-pulse 2.5s infinite",
                  }}>
                    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 3,
                      fontSize: 7, fontWeight: 700, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>
                      {dim.ideal}
                    </div>
                  </div>
                </div>

                {/* Gap label */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: gapColor, fontFamily: "JetBrains Mono, monospace" }}>
                    gap {isNegGap ? "−" : "+"}{gapAbs} pts {gapAbs > 30 ? "● CRÍTICO" : gapAbs > 15 ? "● ALTO" : "● OK"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: VERBAL IDENTITY + TONE ────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Verbal Identity */}
        <div style={{ padding: "24px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>IDENTIDADE VERBAL</div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>PALAVRAS QUE DEFINEM A MARCA</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {WORDS_OWN.map((w, i) => (
                <span key={i} style={{
                  padding: "5px 12px", fontSize: 10, fontWeight: 700,
                  background: "rgba(255,149,0,0.08)", color: "#ff9500",
                  border: "1px solid rgba(255,149,0,0.22)", borderRadius: 4,
                  fontFamily: "JetBrains Mono, monospace",
                  animation: `word-appear 0.25s ease ${i * 0.05}s both`,
                }}>{w}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>PALAVRAS A EVITAR</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {WORDS_AVOID.map((w, i) => (
                <span key={i} style={{
                  padding: "5px 12px", fontSize: 10, fontWeight: 700,
                  background: "rgba(239,68,68,0.06)", color: "rgba(239,68,68,0.7)",
                  border: "1px solid rgba(239,68,68,0.18)", borderRadius: 4,
                  fontFamily: "JetBrains Mono, monospace",
                  textDecoration: "line-through",
                  animation: `word-appear 0.25s ease ${i * 0.05}s both`,
                }}>{w}</span>
              ))}
            </div>
          </div>

          {/* Brand essence */}
          <div style={{ marginTop: 20, padding: "16px 18px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.12)", borderLeft: "3px solid #ff9500", borderRadius: "0 6px 6px 0" }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>ESSÊNCIA DA MARCA</div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, fontStyle: "italic" }}>
              "Somos o especialista que te acompanha — não o serviço que te esquece."
            </p>
          </div>
        </div>

        {/* Tone Matrix */}
        <div style={{ padding: "24px" }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>TOM DE VOZ</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {/* SIM column header */}
            <div style={{ padding: "8px 12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "6px 6px 0 0", textAlign: "center" }}>
              <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 1.5, color: "rgba(16,185,129,0.8)", fontFamily: "JetBrains Mono, monospace" }}>✓ A MARCA É</span>
            </div>
            <div style={{ padding: "8px 12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "6px 6px 0 0", textAlign: "center" }}>
              <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 1.5, color: "rgba(239,68,68,0.8)", fontFamily: "JetBrains Mono, monospace" }}>✗ A MARCA NÃO É</span>
            </div>

            {/* SIM items */}
            {TONE_MATRIX.filter(t => t.x === "Sim").map((t, i) => (
              <div key={i} style={{
                padding: "12px 14px",
                background: "rgba(16,185,129,0.025)",
                border: "1px solid rgba(16,185,129,0.07)",
                borderTop: "none",
                animation: `word-appear 0.25s ease ${i * 0.07}s both`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(16,185,129,0.8)", marginBottom: 3 }}>{t.y}</div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}

            {/* NÃO items — rendered alongside SIM items using CSS grid flow */}
            {TONE_MATRIX.filter(t => t.x === "Não").map((t, i) => (
              <div key={i} style={{
                padding: "12px 14px",
                background: "rgba(239,68,68,0.025)",
                border: "1px solid rgba(239,68,68,0.07)",
                borderTop: "none",
                gridColumn: 2,
                gridRow: i + 2,
                animation: `word-appear 0.25s ease ${i * 0.07}s both`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(239,68,68,0.7)", marginBottom: 3 }}>{t.y}</div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 4: CONTENT PILLARS ───────────────────────────────────── */}
      <div style={{ padding: "24px 24px 48px" }}>
        <div style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace" }}>PILARES DE CONTEÚDO</span>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginLeft: 12 }}>MIX EDITORIAL RECOMENDADO</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,149,0,0.12)",
              borderTop: "3px solid rgba(255,149,0,0.5)",
              borderRadius: "0 0 8px 8px",
              padding: "18px 16px 20px",
              animation: `pillar-rise 0.35s ease ${i * 0.08}s both`,
            }}>
              {/* Code + share */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1 }}>{p.code}</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{p.share}%</span>
              </div>

              {/* Share bar */}
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${p.share * 2}%`, // *2 so max(35%) fills 70%
                  background: "#ff9500", borderRadius: 2,
                  animation: `bar-grow 0.5s ease ${0.2 + i * 0.08}s both`,
                  transformOrigin: "left",
                }} />
              </div>

              <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.82)", marginBottom: 8, lineHeight: 1.3 }}>{p.title}</div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>

              {/* Formats */}
              {p.formats.map((f, j) => (
                <div key={j} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}>
                  <span style={{ color: "rgba(255,149,0,0.5)", fontSize: 10, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mix bar */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>MIX EDITORIAL RECOMENDADO</div>
          <div style={{ height: 20, borderRadius: 5, overflow: "hidden", display: "flex" }}>
            {PILLARS.map((p, i) => (
              <div key={i} style={{
                flex: p.share,
                background: `rgba(255,149,0,${0.25 + i * 0.15})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: `bar-grow 0.6s ease ${i * 0.06}s both`,
                transformOrigin: "left",
              }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: "rgba(255,255,255,0.85)", fontFamily: "JetBrains Mono, monospace" }}>{p.share}%</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {PILLARS.map((p, i) => (
              <span key={i} style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{p.title}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
