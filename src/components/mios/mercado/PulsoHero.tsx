import { useState, useEffect, useRef } from "react";
import {
  Activity, Radio, Zap, TrendingUp, TrendingDown,
  AlertCircle, Clock, ArrowUpRight, RefreshCw,
  Eye, Target, Flame,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes pulso-ripple  { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(3.2);opacity:0} }
@keyframes pulso-ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes pulso-slide   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulso-beat    { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.35);opacity:0.3} }
@keyframes pulso-scan    { 0%{transform:translateX(-100%)} 100%{transform:translateX(340%)} }
@keyframes ekg-draw      { 0%{stroke-dashoffset:1300} 100%{stroke-dashoffset:0} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

type SignalType = "alert" | "trend" | "signal" | "neutral" | "opportunity";

interface Signal {
  id: number; time: string; type: SignalType;
  source: string; text: string; delta?: string; deltaUp?: boolean;
}

const INITIAL_SIGNALS: Signal[] = [
  { id: 1, time: "agora",  type: "alert",       source: "Concorrentes", text: "Player principal reduziu preço em 12% — resposta direta à queda de NPS detectada na semana passada",     delta: "−12%",  deltaUp: false },
  { id: 2, time: "3 min",  type: "trend",       source: "Buscas",       text: "Volume de busca por 'estética premium sp' acelera: +28% nas últimas 2 horas — tendência validada",          delta: "+28%",  deltaUp: true  },
  { id: 3, time: "11 min", type: "opportunity", source: "Social",        text: "Fórum setorial com 4.2k membros debatendo exatamente a dor mapeada no módulo Dores — janela aberta",        delta: "4.2k",  deltaUp: true  },
  { id: 4, time: "34 min", type: "signal",      source: "Autoridade",   text: "Nova publicação de referência do setor — potencial de agenda-setting nos próximos 14 dias",                 delta: null,    deltaUp: true  },
  { id: 5, time: "1h",     type: "neutral",     source: "Regulação",    text: "Consulta pública em andamento — prazo de comentários encerra em 18 dias, risco de impacto moderado",         delta: "18d",   deltaUp: false },
  { id: 6, time: "1h 20m", type: "trend",       source: "Buscas",       text: "Palavra-chave secundária do segmento entra no top 10 do Google Trends Brasil — oportunidade de conteúdo",   delta: "Top 10",deltaUp: true  },
  { id: 7, time: "2h",     type: "alert",       source: "Concorrentes", text: "Concorrente B lançou feature nova — captura direta do gap identificado no mapeamento MIOS",                 delta: null,    deltaUp: false },
  { id: 8, time: "3h",     type: "opportunity", source: "Mercado",       text: "Janela 22h–23h mantém-se sem cobertura por qualquer player — oportunidade de ativação exclusiva",           delta: null,    deltaUp: true  },
];

const TICKER_ITEMS = [
  "● ALERTA  ·  Concorrente A  −12% preço",
  "● TENDÊNCIA  ·  Busca orgânica  +28% (2h)",
  "● INFO  ·  Consulta pública  18 dias",
  "● OPORTUNIDADE  ·  Fórum setorial  4.2k membros",
  "● ALERTA  ·  Feature lançada  Concorrente B",
  "● OPORTUNIDADE  ·  Janela 22h–23h  sem cobertura",
  "● TENDÊNCIA  ·  Top 10 Brasil  palavra-chave",
  "● SINAL  ·  Publicação autoridade  agenda 14 dias",
];

const SIGNAL_CONFIG: Record<SignalType, { color: string; bg: string; border: string; label: string }> = {
  alert:       { color: "#f43f5e", bg: "rgba(244,63,94,0.05)",   border: "rgba(244,63,94,0.18)",   label: "ALERTA"       },
  trend:       { color: "#ff9500", bg: "rgba(255,149,0,0.05)",   border: "rgba(255,149,0,0.18)",   label: "TENDÊNCIA"    },
  opportunity: { color: "#10b981", bg: "rgba(16,185,129,0.05)",  border: "rgba(16,185,129,0.18)",  label: "OPORTUNIDADE" },
  signal:      { color: "#6366f1", bg: "rgba(99,102,241,0.05)",  border: "rgba(99,102,241,0.18)",  label: "SINAL"        },
  neutral:     { color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.08)", label: "INFO" },
};

const VITALS = [
  { label: "Momentum",         value: "ALTA",   sub: "acelerando",     color: "#10b981", Icon: TrendingUp,   up: true  },
  { label: "Sinais / hora",    value: "8",      sub: "últimas 2h",     color: "#ff9500", Icon: Activity,     up: true  },
  { label: "Ativ. Competitiva",value: "3",      sub: "eventos ativos", color: "#f43f5e", Icon: AlertCircle,  up: false },
  { label: "Veloc. de Busca",  value: "+340%",  sub: "6 meses",        color: "#6366f1", Icon: Zap,          up: true  },
  { label: "Sentimento",       value: "74",     sub: "/100 · forte",   color: "#06b6d4", Icon: Eye,          up: true  },
];

const SEARCH_TERMS = [
  { term: "gestão estética premium",   growth: "+340%", pct: 91, hot: true  },
  { term: "clínica de estética sp",    growth: "+128%", pct: 65, hot: true  },
  { term: "tratamento facial 2026",    growth: "+94%",  pct: 48, hot: false },
  { term: "spa day são paulo",         growth: "+71%",  pct: 36, hot: false },
  { term: "skincare profissional sp",  growth: "+52%",  pct: 26, hot: false },
];

const COMPETITORS = [
  { name: "Player A", tag: "Preço",    event: "Reduziu pricing em 12%",        color: "#f43f5e", time: "2h",  bars: 3 },
  { name: "Player B", tag: "Produto",  event: "Lançou nova feature de booking", color: "#f59e0b", time: "3h",  bars: 2 },
  { name: "Player C", tag: "Conteúdo", event: "Campanha agressiva no Instagram", color: "#6366f1", time: "5h",  bars: 1 },
];

const FILTER_TYPES: Array<{ key: SignalType | "all"; label: string }> = [
  { key: "all",         label: "Todos"         },
  { key: "alert",       label: "Alertas"       },
  { key: "opportunity", label: "Oportunidades" },
  { key: "trend",       label: "Tendências"    },
  { key: "signal",      label: "Sinais"        },
];

// ─── Market ECG ───────────────────────────────────────────────────────────────

const EKG_POINTS = "0,32 18,32 24,32 30,8 36,56 42,4 48,60 54,32 60,32 80,32 86,32 92,20 98,44 104,32 120,32 140,32 146,32 152,14 158,50 164,32 180,32 200,32 206,32 212,18 218,46 224,32 240,32 260,32 266,32 272,22 278,42 284,32 300,32";
const EKG_DOUBLED = EKG_POINTS + " " + EKG_POINTS.split(" ").map(p => {
  const [x, y] = p.split(","); return `${+x + 300},${y}`;
}).join(" ");

function MarketECG() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Fade masks */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, background: "linear-gradient(to right, rgba(4,6,15,1), transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, background: "linear-gradient(to left, rgba(4,6,15,1), transparent)", zIndex: 2, pointerEvents: "none" }} />

      <svg width="100%" height="64" viewBox="0 0 600 64" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="pulso-ecg-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,149,0,0.00)" />
            <stop offset="40%"  stopColor="rgba(255,149,0,0.35)" />
            <stop offset="82%"  stopColor="rgba(255,149,0,0.75)" />
            <stop offset="100%" stopColor="rgba(255,149,0,0.95)" />
          </linearGradient>
          <filter id="pulso-ecg-glow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="0" y1="32" x2="600" y2="32" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* Negative zone tint */}
        <rect x="0" y="32" width="600" height="32" fill="rgba(239,68,68,0.02)" />

        {/* Glow layer */}
        <polyline
          points={EKG_DOUBLED}
          stroke="rgba(255,149,0,0.18)" strokeWidth="5"
          fill="none" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#pulso-ecg-glow)"
          strokeDasharray="1300" strokeDashoffset="0"
          style={{ animation: "ekg-draw 3s ease forwards" }}
        />

        {/* Main ECG line */}
        <polyline
          points={EKG_DOUBLED}
          stroke="url(#pulso-ecg-grad)" strokeWidth="1.8"
          fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="1300" strokeDashoffset="0"
          style={{ animation: "ekg-draw 3s ease forwards" }}
        />

        {/* Live endpoint pulse rings */}
        <circle cx="600" cy="32" r="10" fill="rgba(255,149,0,0.12)">
          <animate attributeName="r" values="8;18;8" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Live endpoint core */}
        <circle cx="600" cy="32" r="3.5" fill="#ff9500" filter="url(#pulso-ecg-glow)">
          <animate attributeName="r" values="3.5;5;3.5" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Label */}
      <div style={{ position: "absolute", right: 56, top: "50%", transform: "translateY(-50%)", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.14)", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5, zIndex: 3 }}>
        PULSO · 12 MESES
      </div>
    </div>
  );
}

// ─── Live dot ─────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ff9500" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,149,0,0.5)", animation: "pulso-ripple 2s ease-out infinite" }} />
    </div>
  );
}

// ─── Signal Row ───────────────────────────────────────────────────────────────

function SignalRow({ signal, isNew }: { signal: Signal; isNew?: boolean }) {
  const cfg = SIGNAL_CONFIG[signal.type];
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 12px", borderRadius: 9,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      animation: isNew ? "pulso-slide 0.35s ease" : undefined,
      transition: "all 0.2s",
    }}>
      <span style={{
        flexShrink: 0, marginTop: 1,
        fontSize: 7, fontWeight: 800, letterSpacing: 0.8,
        padding: "2px 5px", borderRadius: 4,
        background: `${cfg.color}18`, color: cfg.color,
        border: `1px solid ${cfg.color}30`, whiteSpace: "nowrap",
      }}>
        {cfg.label}
      </span>
      <span style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: 1.5, minWidth: 68 }}>
        {signal.source}
      </span>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, flex: 1 }}>
        {signal.text}
      </span>
      {signal.delta && (
        <span style={{
          flexShrink: 0, marginTop: 1,
          fontSize: 10, fontWeight: 800,
          color: signal.deltaUp ? "#10b981" : "#f43f5e",
          fontFamily: "JetBrains Mono, monospace",
        }}>
          {signal.delta}
        </span>
      )}
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 1.5, minWidth: 40, textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>
        {signal.time}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PulsoHero() {
  const [filter, setFilter]   = useState<SignalType | "all">("all");
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [newId, setNewId]     = useState<number | null>(null);
  const nextId                = useRef(INITIAL_SIGNALS.length + 1);

  // Simulate live signals
  useEffect(() => {
    const LIVE: Omit<Signal, "id" | "time">[] = [
      { type: "trend",       source: "Buscas",       text: "Novo pico de busca: +44% em termos ligados ao seu posicionamento — janela de ativação",          delta: "+44%", deltaUp: true  },
      { type: "opportunity", source: "Mercado",       text: "Menção positiva em newsletter com 12k assinantes do setor — potencial de tráfego orgânico",       delta: "12k",  deltaUp: true  },
      { type: "alert",       source: "Concorrentes",  text: "Concorrente C atualizou proposta de valor na landing — possível resposta ao seu posicionamento",   delta: null,   deltaUp: false },
    ];
    let i = 0;
    const timer = setInterval(() => {
      const base = LIVE[i % LIVE.length];
      const id = nextId.current++;
      setSignals(prev => {
        const aged = prev.map((s, idx) => idx === 0 ? s : {
          ...s,
          time: s.time === "agora" ? "1 min" : s.time === "1 min" ? "3 min" : s.time,
        });
        return [{ ...base, id, time: "agora" }, ...aged.slice(0, 11)];
      });
      setNewId(id);
      setTimeout(() => setNewId(null), 600);
      i++;
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filter === "all" ? signals : signals.filter(s => s.type === filter);
  const counts   = {
    alert:       signals.filter(s => s.type === "alert").length,
    opportunity: signals.filter(s => s.type === "opportunity").length,
    trend:       signals.filter(s => s.type === "trend").length,
  };

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero Header ────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "24px 28px 20px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,149,0,0.14)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.10), 0 1px 0 rgba(255,255,255,0.04) inset",
          position: "relative", overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          {/* Scan shimmer */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.04), transparent)", animation: "pulso-scan 5s ease-in-out infinite" }} />
          </div>

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "center" }}>
            {/* Left: identity + counters */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Activity size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>
                    PULSO DO MERCADO · GRUPO MERCADO
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>
                    Monitoramento em Tempo Real
                  </div>
                </div>
                <div style={{
                  marginLeft: "auto", display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 12px", borderRadius: 8,
                  background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.22)",
                }}>
                  <LiveDot />
                  <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,149,0,0.88)", letterSpacing: 1.5 }}>AO VIVO</span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, maxWidth: 520, margin: "0 0 18px" }}>
                Sinais contínuos filtrados pela lente do seu negócio — concorrentes, tendências,
                sentimento e regulação com contexto estratégico em tempo real.
              </p>

              {/* ECG */}
              <MarketECG />
            </div>

            {/* Right: signal counters */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>
                RESUMO ATUAL
              </div>
              {[
                { label: "ALERTAS",        value: counts.alert,       color: "#f43f5e", Icon: AlertCircle  },
                { label: "OPORTUNIDADES",  value: counts.opportunity, color: "#10b981", Icon: Target       },
                { label: "TENDÊNCIAS",     value: counts.trend,       color: "#ff9500", Icon: TrendingUp   },
              ].map(c => (
                <div key={c.label} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  background: `${c.color}08`, border: `1px solid ${c.color}20`,
                }}>
                  <c.Icon size={15} style={{ color: c.color, flexShrink: 0, opacity: 0.8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1, marginBottom: 1 }}>
                      {c.label}
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: c.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                    {c.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Market Vitals Strip ────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {VITALS.map(v => (
            <div key={v.label} style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(12px) saturate(180%)",
              WebkitBackdropFilter: "blur(12px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${v.color}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <v.Icon size={12} style={{ color: v.color, opacity: 0.75 }} />
                {v.up
                  ? <TrendingUp size={10} style={{ color: "#10b981", opacity: 0.7 }} />
                  : <TrendingDown size={10} style={{ color: "#f43f5e", opacity: 0.7 }} />
                }
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: v.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 4 }}>
                {v.value}
              </div>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: 0.4, marginBottom: 1 }}>
                {v.label}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.18)" }}>{v.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Ticker ─────────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 10, padding: "8px 0", overflow: "hidden",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, background: "linear-gradient(to right, rgba(4,6,15,0.95), transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, background: "linear-gradient(to left, rgba(4,6,15,0.95), transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ display: "flex", animation: "pulso-ticker 34s linear infinite", whiteSpace: "nowrap" }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} style={{
                fontSize: 9.5, fontWeight: 600,
                color: "rgba(255,255,255,0.35)",
                padding: "0 32px",
                borderRight: "1px solid rgba(255,255,255,0.05)",
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Main Grid ──────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, alignItems: "start" }}>

          {/* ── Signal Feed ──────────────────────────────────────────────────── */}
          <div style={{
            borderRadius: 14, padding: "18px 18px",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {/* Feed header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Radio size={12} style={{ color: "rgba(255,149,0,0.6)" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.24)" }}>
                  FEED DE SINAIS
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={10} style={{ color: "rgba(255,255,255,0.22)" }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)" }}>Atualiza a cada 30s</span>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
              {FILTER_TYPES.map(f => {
                const isActive = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    style={{
                      padding: "4px 11px", borderRadius: 6,
                      fontSize: 10.5, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                      background: isActive ? "rgba(255,149,0,0.10)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? "rgba(255,149,0,0.32)" : "rgba(255,255,255,0.07)"}`,
                      color: isActive ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.35)",
                      transition: "all 0.15s",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Signals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.map(sig => (
                <SignalRow key={sig.id} signal={sig} isNew={sig.id === newId} />
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
                  Nenhum sinal deste tipo no momento
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Search Velocity */}
            <div style={{
              borderRadius: 14, padding: "16px 16px",
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <Zap size={11} style={{ color: "rgba(255,149,0,0.6)" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.24)" }}>
                  VELOCIDADE DE BUSCA
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SEARCH_TERMS.map((s, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minWidth: 0 }}>
                        {s.hot && (
                          <Flame size={9} style={{ color: "#f43f5e", flexShrink: 0 }} />
                        )}
                        <span style={{
                          fontSize: 10, fontWeight: s.hot ? 600 : 400,
                          color: s.hot ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.42)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {s.term}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 800, flexShrink: 0, marginLeft: 6,
                        color: s.hot ? "#10b981" : "rgba(255,255,255,0.35)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {s.growth}
                      </span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        width: `${s.pct}%`,
                        background: s.hot
                          ? "linear-gradient(90deg, rgba(255,149,0,0.8), rgba(16,185,129,0.7))"
                          : "rgba(255,255,255,0.18)",
                        transition: "width 0.7s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Activity */}
            <div style={{
              borderRadius: 14, padding: "16px 16px",
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <Target size={11} style={{ color: "rgba(255,149,0,0.6)" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.24)" }}>
                  ATIVIDADE COMPETITIVA
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {COMPETITORS.map((c, i) => (
                  <div key={i} style={{
                    padding: "10px 12px", borderRadius: 9,
                    background: `${c.color}08`, border: `1px solid ${c.color}22`,
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* Left accent */}
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: 3, borderRadius: "9px 0 0 9px",
                      background: c.color, opacity: 0.6,
                    }} />
                    <div style={{ paddingLeft: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{c.name}</span>
                          <span style={{
                            fontSize: 7.5, fontWeight: 800, padding: "1px 5px", borderRadius: 4,
                            background: `${c.color}18`, border: `1px solid ${c.color}32`,
                            color: c.color, letterSpacing: 0.5,
                          }}>
                            {c.tag.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace" }}>
                          {c.time}
                        </span>
                      </div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.45, marginBottom: 6 }}>
                        {c.event}
                      </div>
                      {/* Intensity bars */}
                      <div style={{ display: "flex", gap: 3 }}>
                        {[1, 2, 3].map(n => (
                          <div key={n} style={{
                            height: 3, flex: 1, borderRadius: 2,
                            background: n <= c.bars ? c.color : "rgba(255,255,255,0.06)",
                            opacity: n <= c.bars ? 0.7 : 1,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configure Alerts — compact */}
            <div style={{
              padding: "14px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.015)",
              border: "1px dashed rgba(255,149,0,0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <RefreshCw size={11} style={{ color: "rgba(255,149,0,0.5)" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: "rgba(255,149,0,0.45)" }}>
                  MONITORAMENTO CONTÍNUO
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.5, marginBottom: 10 }}>
                Configure fontes, alertas e frequência de análise para o seu segmento.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,149,0,0.6)" }}>Configurar monitoramento</span>
                <ArrowUpRight size={11} style={{ color: "rgba(255,149,0,0.45)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
