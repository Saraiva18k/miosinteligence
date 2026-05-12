import { useEffect, useState } from "react";

const KEYFRAMES = `
@keyframes verdict-glow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.04); }
}
@keyframes bar-rise {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes window-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes dot-live {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
}
@keyframes endpoint-pulse {
  0%, 100% { r: 4; opacity: 1; }
  50%       { r: 6; opacity: 0.6; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SIGNALS = [
  { label: "Timing",       value: 91, unit: "%", verdict: "Janela aberta",    color: "rgba(16,185,129,0.85)" },
  { label: "Atratividade", value: 82, unit: "%", verdict: "Mercado favorável", color: "rgba(16,185,129,0.85)" },
  { label: "Demanda",      value: 78, unit: "%", verdict: "Reprimida e real",  color: "rgba(16,185,129,0.85)" },
  { label: "Competição",   value: 54, unit: "%", verdict: "Fragmentada",       color: "#ff9500"                },
  { label: "NPS Rival",    value: 31, unit: "pts", verdict: "Vulnerável",     color: "#ff9500"                },
  { label: "Risco Legal",  value: 22, unit: "%", verdict: "Gerenciável",       color: "rgba(255,255,255,0.4)" },
];

const EVIDENCE = [
  {
    type: "force" as const,
    stat: "78%",
    statLabel: "das clientes",
    title: "Pagaria +R$150/sessão por atendimento boutique",
    body: "Pesquisa com 340 respondentes revela disposição clara de pagar premium — desde que a entrega justifique. O mercado atual entrega processo industrializado. A oportunidade é a diferença entre o que existe e o que o cliente quer comprar.",
    color: "rgba(16,185,129,0.85)",
    bg: "rgba(16,185,129,0.04)",
    border: "rgba(16,185,129,0.15)",
  },
  {
    type: "force" as const,
    stat: "31",
    statLabel: "NPS médio",
    title: "Concorrentes com aprovação crítica",
    body: "Análise de 4.200 reviews públicos revela frustração consistente com pós-venda e personalização. NPS de 31 em um mercado onde 70+ é padrão de excelência — a brecha não é de produto, é de relacionamento e entrega de valor.",
    color: "rgba(16,185,129,0.85)",
    bg: "rgba(16,185,129,0.04)",
    border: "rgba(16,185,129,0.15)",
  },
  {
    type: "warn" as const,
    stat: "+62%",
    statLabel: "CPL em 12 meses",
    title: "Meta Ads saturado no nicho em SP capital",
    body: "Custo por lead via tráfego pago subiu 62% em 12 meses no segmento estético premium. A estratégia de entrada deve priorizar indicação estruturada e parcerias — escalar em paid media é o segundo movimento, não o primeiro.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.04)",
    border: "rgba(249,115,22,0.15)",
  },
  {
    type: "risk" as const,
    stat: "2",
    statLabel: "protocolos",
    title: "Compliance ANVISA obrigatório antes de operar",
    body: "Criolipólise e radiofrequência fracionada exigem registro técnico e responsável habilitado. Não é impeditivo — é custo de entrada que os concorrentes atuais já pagaram ou estão em risco. Resolver antes de lançar é vantagem, não obstáculo.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.04)",
    border: "rgba(239,68,68,0.15)",
  },
];

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const size = 240;
  const stroke = 10;
  const r = (size - stroke) / 2 - 8;
  const c = 2 * Math.PI * r;
  const progress = (score / 100) * c;
  const angle = (score / 100) * 360 - 90;
  const endX = size/2 + r * Math.cos((angle * Math.PI) / 180);
  const endY = size/2 + r * Math.sin((angle * Math.PI) / 180);

  return (
    <div style={{ position: "relative", width: size, height: size + 28, flexShrink: 0 }}>
      {/* Outer ambient glow */}
      <div style={{
        position: "absolute",
        inset: "-20px -20px 8px -20px",
        background: "radial-gradient(circle at 50% 42%, rgba(255,149,0,0.18), transparent 60%)",
        filter: "blur(16px)",
        pointerEvents: "none",
      }} />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block", transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="vg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd080" />
            <stop offset="40%" stopColor="#ff9500" />
            <stop offset="100%" stopColor="#ff5500" />
          </linearGradient>
          <filter id="vglow2">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 360;
          const isMajor = i % 5 === 0;
          const inner = r - stroke - (isMajor ? 2 : 5);
          const outer = r - stroke - (isMajor ? 8 : 7);
          const x1 = size/2 + inner * Math.cos((a * Math.PI)/180);
          const y1 = size/2 + inner * Math.sin((a * Math.PI)/180);
          const x2 = size/2 + outer * Math.cos((a * Math.PI)/180);
          const y2 = size/2 + outer * Math.sin((a * Math.PI)/180);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isMajor ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}
            strokeWidth={isMajor ? 1.5 : 1} />;
        })}

        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />

        {/* Progress */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#vg2)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - progress}
          filter="url(#vglow2)"
          style={{ transition: "stroke-dashoffset 60ms linear" }} />

        {/* Endpoint pulse dot */}
        {score > 0 && (
          <circle cx={endX} cy={endY} r={5} fill="#ff9500"
            style={{ animation: "endpoint-pulse 1.8s ease infinite" }} />
        )}
      </svg>

      {/* Center */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 28,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>SCORE</div>
        <div style={{
          fontSize: 76, fontWeight: 900, color: "#ff9500", letterSpacing: -4, lineHeight: 1,
          fontFamily: "JetBrains Mono, monospace",
          textShadow: "0 0 40px rgba(255,149,0,0.45)",
          fontVariantNumeric: "tabular-nums",
        }}>{score}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1, marginTop: 4 }}>/ 100</div>
      </div>

      {/* Badge */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        padding: "6px 18px", borderRadius: 999,
        background: "linear-gradient(180deg, rgba(22,16,4,0.97), rgba(10,7,2,0.97))",
        border: "1px solid rgba(255,149,0,0.35)",
        fontSize: 9, fontWeight: 900, letterSpacing: 3, color: "#ff9500",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(255,149,0,0.2), 0 0 0 1px rgba(0,0,0,0.5)",
      }}>★ EXCEPCIONAL</div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function VerdictHero() {
  const target = 87;
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ paddingBottom: 8 }}>
      <style>{KEYFRAMES}</style>

      {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr",
        gap: 48, alignItems: "center",
        padding: "32px 32px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        animation: mounted ? "fade-up 0.5s ease" : "none",
      }}>
        <ScoreRing score={score} />

        <div>
          {/* Live + module tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "dot-live 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 8, letterSpacing: 2, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace" }}>VEREDITO DE MERCADO · Q2 2026</span>
          </div>

          {/* Big verdict headline */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10, textTransform: "uppercase" }}>O mercado confirma:</div>
            <h1 style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,0.95)", letterSpacing: -1.5, lineHeight: 1.05, margin: 0 }}>
              Você encontrou<br />
              <span style={{ color: "#ff9500" }}>uma veia de ouro.</span>
            </h1>
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.85, maxWidth: 480, marginBottom: 24 }}>
            Mercado fragmentado. Dores críticas sem solução premium. Concorrentes com NPS de 31.
            CAC comportável. Janela de 4 a 7 meses antes da consolidação. A análise de 14 módulos
            converge num único sinal — <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>entrar agora</span>.
          </p>

          {/* 3 KPIs */}
          <div style={{ display: "flex", gap: 2 }}>
            {[
              { label: "Timing de entrada",  value: "91%",      color: "rgba(16,185,129,0.85)" },
              { label: "Demanda reprimida",   value: "78%",      color: "rgba(16,185,129,0.85)" },
              { label: "NPS dos rivais",      value: "31 pts",   color: "#ff9500"               },
            ].map((k, i) => (
              <div key={i} style={{
                flex: 1, padding: "14px 18px",
                background: i === 0 ? "rgba(16,185,129,0.05)" : i === 1 ? "rgba(16,185,129,0.04)" : "rgba(255,149,0,0.04)",
                border: `1px solid ${i < 2 ? "rgba(16,185,129,0.15)" : "rgba(255,149,0,0.15)"}`,
                borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : 0,
                borderLeft: i > 0 ? "none" : undefined,
              }}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: k.color, fontFamily: "JetBrains Mono, monospace" }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SIGNAL EQUALIZER ──────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ padding: "12px 32px 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.4)", fontFamily: "JetBrains Mono, monospace" }}>SINAIS DO MERCADO</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.12)", fontFamily: "JetBrains Mono, monospace" }}>6 DIMENSÕES</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
          {SIGNALS.map((sig, i) => {
            const barHeight = 80;
            const fill = (sig.value / 100) * barHeight;
            return (
              <div key={i} style={{
                padding: "16px 20px 18px",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
              }}>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase" }}>{sig.label}</div>

                {/* Vertical bar */}
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 24, height: barHeight, background: "rgba(255,255,255,0.04)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: `${fill}px`,
                      background: sig.color,
                      borderRadius: 4,
                      boxShadow: `0 0 12px ${sig.color}`,
                      animation: `bar-rise 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s both`,
                      transformOrigin: "bottom",
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: sig.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                    {sig.value}<span style={{ fontSize: 11, opacity: 0.6 }}>{sig.unit}</span>
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 4 }}>{sig.verdict}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: EVIDENCE WALL ─────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ padding: "12px 32px 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.4)", fontFamily: "JetBrains Mono, monospace" }}>EVIDÊNCIAS DO VEREDITO</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.12)", fontFamily: "JetBrains Mono, monospace" }}>2 FORÇAS · 1 ATENÇÃO · 1 RISCO</span>
        </div>

        {EVIDENCE.map((ev, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "180px 1fr",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            borderLeft: `3px solid ${ev.color}`,
          }}>
            {/* Stat hero */}
            <div style={{
              padding: "22px 24px",
              background: ev.bg,
              borderRight: `1px solid ${ev.border}`,
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
            }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: ev.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, letterSpacing: -2 }}>{ev.stat}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", marginTop: 4 }}>{ev.statLabel}</div>
            </div>

            {/* Text */}
            <div style={{ padding: "20px 28px" }}>
              <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: ev.color, fontFamily: "JetBrains Mono, monospace", marginBottom: 7, textTransform: "uppercase" }}>
                {ev.type === "force" ? "FORÇA" : ev.type === "warn" ? "ATENÇÃO" : "RISCO"}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.85)", lineHeight: 1.3, marginBottom: 10 }}>{ev.title}</div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.75 }}>{ev.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION 4: ENTRY WINDOW ──────────────────────────────────────── */}
      <div style={{ padding: "20px 32px 40px" }}>
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.4)", fontFamily: "JetBrains Mono, monospace" }}>JANELA DE ENTRADA</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(16,185,129,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "dot-live 2s infinite" }}>● ATIVA</span>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", height: 48, marginBottom: 18 }}>
          {/* Track */}
          <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3 }} />
          {/* Active window */}
          <div style={{
            position: "absolute", top: 20, left: "15%", width: "45%", height: 6,
            background: "linear-gradient(90deg, rgba(16,185,129,0.4), rgba(255,149,0,0.5))",
            borderRadius: 3,
            animation: "window-grow 1s cubic-bezier(0.34,1.56,0.64,1) 0.4s both",
            transformOrigin: "left",
            boxShadow: "0 0 16px rgba(16,185,129,0.3)",
          }} />
          {/* Markers */}
          {[
            { label: "Hoje",          pos: "15%",  color: "rgba(16,185,129,0.8)"  },
            { label: "+4 meses",      pos: "38%",  color: "rgba(255,149,0,0.6)"   },
            { label: "+7 meses",      pos: "60%",  color: "rgba(255,149,0,0.4)"   },
            { label: "Consolidação",  pos: "82%",  color: "rgba(239,68,68,0.4)"   },
          ].map((m, i) => (
            <div key={i} style={{ position: "absolute", left: m.pos, top: 0, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: m.color, fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap", marginBottom: 4 }}>{m.label}</div>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, marginTop: 17 }} />
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: 620 }}>
          A análise identifica uma janela de <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>4 a 7 meses</span> antes da consolidação competitiva do nicho. Após esse período, o custo de entrada aumenta e o diferencial de pioneirismo se dilui. O score de 87 não é eterno — é a leitura do mercado hoje.
        </p>
      </div>
    </div>
  );
}
