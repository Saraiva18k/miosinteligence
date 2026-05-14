import { Target, AlertTriangle, Zap, CheckCircle2, Clock } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes okr-appear  { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
@keyframes okr-arc     { from{stroke-dashoffset:var(--from)} to{stroke-dashoffset:var(--to)} }
@keyframes okr-risk    { 0%,100%{background:rgba(239,68,68,0.00)} 50%{background:rgba(239,68,68,0.05)} }
@keyframes okr-dot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.5)} }
`;

// ─── Types & Data ─────────────────────────────────────────────────────────────

type KRStatus = "exceeded" | "on-track" | "at-risk";

interface KR {
  label: string; current: string; target: string;
  progress: number; status: KRStatus; action?: string;
}
interface Objective {
  id: string; title: string; confidence: number; krs: KR[];
}

const OBJECTIVES: Objective[] = [
  {
    id: "o1",
    title: "Dominar o canal premium local",
    confidence: 72,
    krs: [
      { label: "NPS ≥ 55",             current: "44",     target: "55",     progress: 80,  status: "on-track" },
      { label: "40 clientes premium",   current: "28",     target: "40",     progress: 70,  status: "on-track" },
      { label: "Ticket médio R$1,2k",   current: "R$980",  target: "R$1,2k", progress: 82,  status: "on-track" },
    ],
  },
  {
    id: "o2",
    title: "Escalar a máquina de aquisição",
    confidence: 42,
    krs: [
      { label: "CAC < R$320",           current: "R$380",  target: "R$320",  progress: 12,  status: "at-risk",  action: "Eliminar fontes com CAC > R$500 esta semana" },
      { label: "Indicação ≥ 25%",       current: "18%",    target: "25%",    progress: 72,  status: "on-track" },
      { label: "80 novos clientes/tri", current: "34",     target: "80",     progress: 43,  status: "at-risk",  action: "Ativar campanha de reativação + 2 parcerias até sexta" },
    ],
  },
  {
    id: "o3",
    title: "Solidificar a operação",
    confidence: 88,
    krs: [
      { label: "Churn < 2,5%",          current: "3,8%",   target: "2,5%",   progress: 40,  status: "at-risk",  action: "Ligar hoje para os 8 clientes sinalizados em risco" },
      { label: "SLA atendimento < 2h",  current: "1,8h",   target: "< 2h",   progress: 100, status: "exceeded" },
      { label: "3 SOPs documentados",   current: "2",      target: "3",      progress: 67,  status: "on-track"  },
    ],
  },
];

const QUARTER = { label: "Q2 · 2026", week: 6, totalWeeks: 13, daysLeft: 50, totalDays: 91 };
const DAY_PCT  = Math.round(((QUARTER.totalDays - QUARTER.daysLeft) / QUARTER.totalDays) * 100);

const ALL_KRS = OBJECTIVES.flatMap(o => o.krs);
const AT_RISK = OBJECTIVES.flatMap(o =>
  o.krs.filter(k => k.status === "at-risk").map(k => ({ ...k, objective: o.title }))
);

const STATUS_COLOR: Record<KRStatus, string> = {
  exceeded:  "#10b981",
  "on-track": "#ff9500",
  "at-risk":  "#ef4444",
};
const STATUS_LABEL: Record<KRStatus, string> = {
  exceeded:  "Superado",
  "on-track": "No Rumo",
  "at-risk":  "Em Risco",
};

function confColor(c: number) {
  return c >= 75 ? "#10b981" : c >= 52 ? "#ff9500" : "#ef4444";
}
function confLabel(c: number) {
  return c >= 75 ? "NO RUMO" : c >= 52 ? "ATENÇÃO" : "EM RISCO";
}

// ─── Confidence Arc ───────────────────────────────────────────────────────────

function ConfArc({ pct, size = 80, delay = 0 }: { pct: number; size?: number; delay?: number }) {
  const r = Math.round(size * 0.36);
  const c = size / 2;
  const circ = +(2 * Math.PI * r).toFixed(2);
  const gap  = +((1 - pct / 100) * circ).toFixed(2);
  const col  = confColor(pct);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      {/* Track */}
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4.5} />
      {/* Glow */}
      <circle cx={c} cy={c} r={r} fill="none" stroke={col} strokeWidth={8} opacity={0.08}
        strokeDasharray={circ} strokeDashoffset={gap} transform={`rotate(-90 ${c} ${c})`} />
      {/* Arc — animated */}
      <circle cx={c} cy={c} r={r} fill="none" stroke={col} strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circ}
        transform={`rotate(-90 ${c} ${c})`}
        style={{
          animation: `okr-arc 1.1s ease ${delay}s both`,
          ['--from' as string]: circ,
          ['--to' as string]:   gap,
        } as React.CSSProperties}
      />
      {/* Labels */}
      <text x={c} y={c - 3}  textAnchor="middle" dominantBaseline="middle"
        fill={col} fontSize={size < 70 ? 12 : 15} fontWeight={900}
        fontFamily="JetBrains Mono, monospace">
        {pct}%
      </text>
      <text x={c} y={c + 11} textAnchor="middle"
        fill="rgba(255,255,255,0.22)" fontSize={6} fontWeight={700} letterSpacing={0.6}>
        CONF.
      </text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OKRHero() {
  const onTrack  = ALL_KRS.filter(k => k.status === "on-track").length;
  const atRisk   = ALL_KRS.filter(k => k.status === "at-risk").length;
  const exceeded = ALL_KRS.filter(k => k.status === "exceeded").length;

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Quarter Command Strip ──────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -50, right: -10, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Left — Quarter info + stats */}
          <div style={{ position: "relative" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>OKR · GRUPO ESTRATÉGIA</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>{QUARTER.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Semana {QUARTER.week} de {QUARTER.totalWeeks}</div>
                </div>
              </div>
              {/* Days remaining */}
              <div style={{ marginLeft: "auto", padding: "10px 18px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#ef4444", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{QUARTER.daysLeft}</div>
                <div style={{ fontSize: 8, color: "rgba(239,68,68,0.55)", marginTop: 3, letterSpacing: 1 }}>DIAS RESTANTES</div>
              </div>
            </div>

            {/* Quarter progress bar */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Tempo do trimestre consumido</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace" }}>
                  {DAY_PCT}%
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, width: `${DAY_PCT}%`, background: "linear-gradient(90deg, rgba(255,149,0,0.9), rgba(255,149,0,0.5))" }} />
              </div>
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "No Rumo",  n: onTrack,   c: "#ff9500" },
                { label: "Em Risco", n: atRisk,    c: "#ef4444" },
                { label: "Superado", n: exceeded,  c: "#10b981" },
                { label: "KRs totais", n: ALL_KRS.length, c: "rgba(255,255,255,0.4)" },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "9px 16px", borderRadius: 10, flex: 1,
                  background: `${s.c}08`, border: `1px solid ${s.c}20`,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: s.c, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{s.n}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3 compact objective summaries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 240 }}>
            {OBJECTIVES.map((o, i) => {
              const cc = confColor(o.confidence);
              return (
                <div key={o.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.02)", border: `1px solid ${cc}14`,
                  animation: `okr-appear 0.3s ease ${i * 0.1}s both`,
                }}>
                  <ConfArc pct={o.confidence} size={62} delay={i * 0.12} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 800, color: cc, letterSpacing: 0.8, marginBottom: 3 }}>
                      {confLabel(o.confidence)}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{o.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Objective Cards — KR Detail ───────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {OBJECTIVES.map((obj, oi) => {
            const cc = confColor(obj.confidence);
            return (
              <div key={obj.id} style={{
                borderRadius: 13, overflow: "hidden",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(12px) saturate(180%)",
                WebkitBackdropFilter: "blur(12px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${cc}`,
                animation: `okr-appear 0.35s ease ${oi * 0.1}s both`,
              }}>
                {/* Objective header */}
                <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <ConfArc pct={obj.confidence} size={76} delay={oi * 0.15 + 0.25} />
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: cc, marginBottom: 4 }}>
                      OBJETIVO {oi + 1}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", lineHeight: 1.45 }}>
                      {obj.title}
                    </div>
                  </div>
                </div>

                {/* KR rows */}
                <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {obj.krs.map((kr, ki) => {
                    const kc = STATUS_COLOR[kr.status];
                    return (
                      <div key={ki}>
                        {/* Label + badge */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{kr.label}</span>
                          <span style={{ fontSize: 7.5, fontWeight: 800, padding: "1px 6px", borderRadius: 4, background: `${kc}14`, border: `1px solid ${kc}28`, color: kc, letterSpacing: 0.4 }}>
                            {STATUS_LABEL[kr.status]}
                          </span>
                        </div>
                        {/* Progress bar (thick) */}
                        <div style={{ height: 7, borderRadius: 3.5, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 5 }}>
                          <div style={{ height: "100%", borderRadius: 3.5, width: `${Math.min(kr.progress, 100)}%`, background: kc, opacity: 0.78 }} />
                        </div>
                        {/* Numbers */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: kc, fontWeight: 700 }}>{kr.current}</span>
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace" }}>→ {kr.target}</span>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.38)", fontFamily: "JetBrains Mono, monospace" }}>{kr.progress}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Em Risco — Ação Imediata ───────────────────────────────────────── */}
        <div style={{
          borderRadius: 14, overflow: "hidden",
          border: "1px solid rgba(239,68,68,0.24)",
          animation: "okr-risk 3.5s ease infinite",
        }}>
          {/* Red header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "13px 20px",
            background: "rgba(239,68,68,0.10)",
            borderBottom: "1px solid rgba(239,68,68,0.16)",
          }}>
            {/* Pulsing dot */}
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "okr-dot 1.4s ease infinite", flexShrink: 0 }} />
            <AlertTriangle size={13} style={{ color: "#ef4444" }} strokeWidth={2.2} />
            <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 1.8, color: "#ef4444" }}>
              EM RISCO — AÇÃO IMEDIATA
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 9, color: "rgba(239,68,68,0.55)", fontFamily: "JetBrains Mono, monospace" }}>
              {AT_RISK.length} KRs comprometidos · Semana {QUARTER.week}
            </span>
          </div>

          {/* At-risk rows */}
          {AT_RISK.map((kr, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "36px 1fr 72px 1fr",
              gap: 16, padding: "14px 20px", alignItems: "center",
              background: i % 2 === 0 ? "rgba(239,68,68,0.025)" : "transparent",
              borderBottom: i < AT_RISK.length - 1 ? "1px solid rgba(239,68,68,0.08)" : "none",
              animation: `okr-appear 0.3s ease ${0.1 + i * 0.07}s both`,
            }}>
              {/* Rank bubble */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.32)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, color: "#ef4444", fontFamily: "JetBrains Mono, monospace",
              }}>
                {i + 1}
              </div>

              {/* KR info */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.78)", marginBottom: 3 }}>{kr.label}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>{kr.objective}</div>
              </div>

              {/* Progress (big, red) */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#ef4444", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{kr.progress}%</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>da meta</div>
              </div>

              {/* Action */}
              <div style={{ padding: "9px 13px", borderRadius: 9, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <Zap size={9} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} strokeWidth={2.5} />
                  <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                    {kr.action}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Footer: overall confidence */}
          <div style={{
            padding: "10px 20px",
            background: "rgba(239,68,68,0.04)",
            borderTop: "1px solid rgba(239,68,68,0.08)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Clock size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
              Com {QUARTER.daysLeft} dias restantes, cada semana de atraso representa{" "}
              <span style={{ color: "rgba(239,68,68,0.7)", fontWeight: 700 }}>
                {Math.round(100 / QUARTER.totalWeeks)}% do tempo total do trimestre.
              </span>
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={10} style={{ color: "#10b981" }} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>
                {onTrack} KRs no rumo · {exceeded} superado
              </span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
