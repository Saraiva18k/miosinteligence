import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Zap, AlertCircle, CheckCircle2, Activity } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes cn-appear { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
@keyframes cn-draw   { from{stroke-dashoffset:1500} to{stroke-dashoffset:0} }
@keyframes cn-fill   { from{opacity:0} to{opacity:1} }
@keyframes cn-bar    { from{width:0} to{width:var(--w)} }
`;

// ─── Chart helpers ────────────────────────────────────────────────────────────

const CW = 560, CH = 180;
const PL = 50, PR = 16, PT = 16, PB = 34;
const pW = CW - PL - PR, pH = CH - PT - PB;
const T = [0, 1 / 3, 2 / 3, 1];
const Y_MIN = 88, Y_MAX = 200;

const mx = (t: number) => PL + t * pW;
const my = (v: number) => PT + pH - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * pH;

// Revenue index: 100 = today's baseline
const SERIES: Record<string, number[]> = {
  otimista:   [100, 118, 153, 185],
  base:       [100, 109, 122, 138],
  pessimista: [100, 102, 104, 108],
};

function smoothPath(vals: number[]): string {
  const xs = T.map(mx), ys = vals.map(my);
  let d = `M ${xs[0]},${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const dx = (xs[i] - xs[i - 1]) * 0.5;
    d += ` C ${xs[i-1]+dx},${ys[i-1]} ${xs[i]-dx},${ys[i]} ${xs[i]},${ys[i]}`;
  }
  return d;
}

function fanPath(): string {
  // Forward along optimistic, then backward along pessimistic
  const optXs = T.map(mx), optYs = SERIES.otimista.map(my);
  const pesXs = T.map(mx), pesYs = SERIES.pessimista.map(my);
  let d = `M ${optXs[0]},${optYs[0]}`;
  for (let i = 1; i < optXs.length; i++) {
    const dx = (optXs[i] - optXs[i-1]) * 0.5;
    d += ` C ${optXs[i-1]+dx},${optYs[i-1]} ${optXs[i]-dx},${optYs[i]} ${optXs[i]},${optYs[i]}`;
  }
  d += ` L ${pesXs[pesXs.length-1]},${pesYs[pesYs.length-1]}`;
  for (let i = pesXs.length - 2; i >= 0; i--) {
    const dx = (pesXs[i+1] - pesXs[i]) * 0.5;
    d += ` C ${pesXs[i+1]-dx},${pesYs[i+1]} ${pesXs[i]+dx},${pesYs[i]} ${pesXs[i]},${pesYs[i]}`;
  }
  return d + ' Z';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Scenario {
  id: string; label: string; probability: number; color: string;
  icon: "up" | "flat" | "down";
  revenue: string; marketShare: string; nps: number;
  drivers: string[]; actions: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "otimista", label: "Otimista", probability: 25, color: "#10b981", icon: "up",
    revenue: "+85%", marketShare: "18%", nps: 65,
    drivers: [
      "Lançamento de linha premium no 1º trimestre",
      "Fechamento de parceria estratégica regional",
      "Expansão para 2 novas cidades até julho",
    ],
    actions: [
      "Escalar operação com contratações antecipadas",
      "Abrir rodada seed de R$ 1,2M em Q1",
      "Negociar exclusividade com fornecedores-chave",
    ],
  },
  {
    id: "base", label: "Base", probability: 55, color: "#ff9500", icon: "flat",
    revenue: "+38%", marketShare: "11%", nps: 48,
    drivers: [
      "Crescimento orgânico dentro das projeções",
      "Retenção acima da média setorial (< 4%)",
      "Ticket médio crescendo 12% ao ano",
    ],
    actions: [
      "Manter cadência de conteúdo e indicações",
      "Focar upsell e cross-sell na base atual",
      "Consolidar processos antes de expandir",
    ],
  },
  {
    id: "pessimista", label: "Pessimista", probability: 20, color: "#ef4444", icon: "down",
    revenue: "+8%", marketShare: "7%", nps: 32,
    drivers: [
      "Entrada de concorrente com funding relevante",
      "CAC sobe 40% por saturação de canais",
      "Desaceleração econômica no segmento",
    ],
    actions: [
      "Ativar modo de eficiência operacional",
      "Refocar em clientes de maior LTV e NPS",
      "Diversificar canais de aquisição urgente",
    ],
  },
];

interface Indicator {
  label: string; current: string; threshold: string;
  status: "ok" | "watch" | "alert"; aligns: string;
}

const INDICATORS: Indicator[] = [
  { label: "CAC mensal",         current: "R$ 380", threshold: "R$ 420",  status: "ok",    aligns: "base"       },
  { label: "Taxa de indicação",  current: "18%",    threshold: "25%+",    status: "watch", aligns: "pessimista" },
  { label: "Pipeline fechado",   current: "R$ 28k", threshold: "R$ 50k+", status: "watch", aligns: "pessimista" },
  { label: "NPS últimos 30d",    current: "44",     threshold: "50+",     status: "ok",    aligns: "base"       },
  { label: "Churn mensal",       current: "3.8%",   threshold: "> 5%",    status: "ok",    aligns: "base"       },
];

// ─── Fan Chart ────────────────────────────────────────────────────────────────

function FanChart({ active }: { active: string | null }) {
  const lines = [
    { id: "otimista",   color: "#10b981", vals: SERIES.otimista,   delay: "0.4s" },
    { id: "base",       color: "#ff9500", vals: SERIES.base,       delay: "0.6s" },
    { id: "pessimista", color: "#ef4444", vals: SERIES.pessimista, delay: "0.8s" },
  ];

  const nowX = mx(0), endX = mx(1);
  const timeLabels = [
    { t: 0,    label: "AGORA" },
    { t: 1/3,  label: "+ 3M"  },
    { t: 2/3,  label: "+ 6M"  },
    { t: 1,    label: "+ 12M" },
  ];
  const yLabels = [100, 130, 160, 185].map(v => ({ v, label: `${v}` }));

  return (
    <svg width="100%" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      {/* Horizontal grid */}
      {yLabels.map(({ v }) => (
        <line key={v} x1={PL} y1={my(v)} x2={CW - PR} y2={my(v)}
          stroke="rgba(255,255,255,0.04)" strokeWidth={0.6} />
      ))}
      {/* Y labels */}
      {yLabels.map(({ v, label }) => (
        <text key={v} x={PL - 6} y={my(v) + 3.5}
          textAnchor="end" fill="rgba(255,255,255,0.14)" fontSize={7} fontFamily="JetBrains Mono, monospace">
          {label}
        </text>
      ))}
      {/* Y axis label */}
      <text x={10} y={PT + pH / 2} textAnchor="middle"
        fill="rgba(255,255,255,0.1)" fontSize={6.5}
        transform={`rotate(-90 10 ${PT + pH / 2})`}>
        Índice de Receita (hoje = 100)
      </text>

      {/* Vertical time markers */}
      {timeLabels.map(({ t, label }) => (
        <g key={label}>
          <line x1={mx(t)} y1={PT} x2={mx(t)} y2={PT + pH}
            stroke={t === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)"}
            strokeWidth={t === 0 ? 1.5 : 0.6}
            strokeDasharray={t === 0 ? undefined : "3 4"}
          />
          <text x={mx(t)} y={CH - 6} textAnchor="middle"
            fill="rgba(255,255,255,0.22)" fontSize={7} fontWeight={t === 0 ? 700 : 400}>
            {label}
          </text>
        </g>
      ))}

      {/* Fan fill */}
      <path d={fanPath()}
        fill="rgba(255,149,0,0.05)"
        style={{ animation: "cn-fill 0.5s ease 0.2s both" }}
      />

      {/* Scenario lines */}
      {lines.map(({ id, color, vals, delay }) => {
        const opacity = active === null || active === id ? 1 : 0.12;
        const endY = my(vals[vals.length - 1]);
        const endVal = vals[vals.length - 1];
        return (
          <g key={id} opacity={opacity} style={{ transition: "opacity 0.2s" }}>
            <path
              d={smoothPath(vals)}
              fill="none"
              stroke={color}
              strokeWidth={active === id ? 2.2 : 1.4}
              strokeLinecap="round"
              strokeDasharray="1500"
              strokeDashoffset="1500"
              style={{ animation: `cn-draw 1.8s ease ${delay} forwards` }}
            />
            {/* End dot + label */}
            <circle cx={endX} cy={endY} r={4} fill={color} opacity={0.9}
              style={{ animation: `cn-appear 0.3s ease ${delay} both` }}
            />
            <text x={endX + 7} y={endY + 3.5}
              fill={color} fontSize={8} fontWeight={700}
              style={{ animation: `cn-appear 0.3s ease ${delay} both` }}
            >
              {endVal}
            </text>
          </g>
        );
      })}

      {/* NOW marker */}
      <circle cx={nowX} cy={my(100)} r={5} fill="rgba(255,255,255,0.6)" />
      <circle cx={nowX} cy={my(100)} r={3} fill="#04060f" />
    </svg>
  );
}

// ─── Scenario Card ────────────────────────────────────────────────────────────

function ScenarioCard({ s, active, onClick }: { s: Scenario; active: boolean; onClick: () => void }) {
  const Icon = s.icon === "up" ? TrendingUp : s.icon === "down" ? TrendingDown : Minus;
  return (
    <div onClick={onClick} style={{
      padding: "18px 18px 16px", borderRadius: 13, cursor: "pointer",
      background: active ? `${s.color}08` : "rgba(255,255,255,0.025)",
      backdropFilter: "blur(12px) saturate(180%)",
      WebkitBackdropFilter: "blur(12px) saturate(180%)",
      border: `1px solid ${active ? `${s.color}32` : "rgba(255,255,255,0.06)"}`,
      borderTop: `2px solid ${s.color}`,
      transition: "all 0.15s",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <Icon size={13} style={{ color: s.color }} strokeWidth={2.2} />
            <span style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.2px" }}>
              {s.label}
            </span>
          </div>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Cenário estratégico</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
            {s.probability}%
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.22)", marginTop: 2 }}>probabilidade</div>
        </div>
      </div>

      {/* Probability bar */}
      <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 14 }}>
        <div style={{ height: "100%", borderRadius: 2, width: `${s.probability}%`, background: s.color, opacity: 0.7 }} />
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Receita", value: s.revenue },
          { label: "Mkt Share", value: s.marketShare },
          { label: "NPS alvo", value: String(s.nps) },
        ].map(m => (
          <div key={m.label} style={{
            padding: "7px 8px", borderRadius: 8, textAlign: "center",
            background: `${s.color}08`, border: `1px solid ${s.color}18`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>
              {m.value}
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Drivers */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", marginBottom: 7 }}>
          PREMISSAS
        </div>
        {s.drivers.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: s.color, opacity: 0.7, marginTop: 4, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
        <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", marginBottom: 7 }}>
          AÇÕES ESTRATÉGICAS
        </div>
        {s.actions.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
            <Zap size={8} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} strokeWidth={2.5} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CenariosHero() {
  const [active, setActive] = useState<string | null>(null);

  const toggle = (id: string) => setActive(prev => prev === id ? null : id);

  const statusColor = { ok: "#10b981", watch: "#ff9500", alert: "#ef4444" };
  const statusIcon  = {
    ok:    <CheckCircle2 size={10} style={{ color: "#10b981" }} />,
    watch: <AlertCircle  size={10} style={{ color: "#ff9500" }} />,
    alert: <AlertCircle  size={10} style={{ color: "#ef4444" }} />,
  };

  const scenarioColor: Record<string, string> = {
    otimista: "#10b981", base: "#ff9500", pessimista: "#ef4444",
  };

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px 20px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          position: "relative", overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: -40, right: -20, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Module label + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, position: "relative" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Activity size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>
                CENÁRIOS · GRUPO ESTRATÉGIA
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>
                Projeção de Cenários
              </div>
            </div>

            {/* Scenario alignment badge */}
            <div style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.22)" }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>ALINHAMENTO ATUAL</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff9500" }}>Cenário Base</div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 20px", position: "relative" }}>
            Três futuros possíveis para os próximos 12 meses — com premissas, probabilidades e
            as ações estratégicas exatas para cada trajetória. Monitore os indicadores antecipados.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 28, marginBottom: 20, position: "relative" }}>
            {SCENARIOS.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>
                    {s.probability}% prob.
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fan Chart */}
          <div style={{
            borderRadius: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "8px 4px 0",
            position: "relative",
          }}>
            <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,255,255,0.18)", padding: "0 12px 6px" }}>
              TRAJETÓRIA DE RECEITA — 12 MESES
            </div>
            <FanChart active={active} />
          </div>
        </div>

        {/* ── Scenario Cards ─────────────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
            DETALHAMENTO DOS CENÁRIOS — CLIQUE PARA DESTACAR NO GRÁFICO
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {SCENARIOS.map((s, i) => (
              <div key={s.id} style={{ animation: `cn-appear 0.35s ease ${i * 0.08}s both` }}>
                <ScenarioCard
                  s={s}
                  active={active === s.id}
                  onClick={() => toggle(s.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Early Warning Indicators ───────────────────────────────────────── */}
        <div style={{
          borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 110px 110px 100px 120px",
            gap: 8, padding: "10px 20px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {["INDICADOR ANTECIPADO", "VALOR ATUAL", "LIMIAR CRÍTICO", "STATUS", "ALINHA COM"].map(h => (
              <span key={h} style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {INDICATORS.map((ind, i) => (
            <div key={ind.label} style={{
              display: "grid", gridTemplateColumns: "1fr 110px 110px 100px 120px",
              gap: 8, padding: "12px 20px", alignItems: "center",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              borderBottom: i < INDICATORS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              animation: `cn-appear 0.3s ease ${i * 0.05}s both`,
            }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", fontWeight: 500 }}>{ind.label}</span>

              <span style={{
                fontSize: 12, fontWeight: 700,
                color: statusColor[ind.status],
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {ind.current}
              </span>

              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>
                {ind.threshold}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {statusIcon[ind.status]}
                <span style={{ fontSize: 9, fontWeight: 700, color: statusColor[ind.status] }}>
                  {ind.status === "ok" ? "Normal" : ind.status === "watch" ? "Atenção" : "Crítico"}
                </span>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 9px", borderRadius: 6,
                background: `${scenarioColor[ind.aligns]}10`,
                border: `1px solid ${scenarioColor[ind.aligns]}25`,
                width: "fit-content",
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: scenarioColor[ind.aligns] }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: scenarioColor[ind.aligns], textTransform: "capitalize" }}>
                  {ind.aligns}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
