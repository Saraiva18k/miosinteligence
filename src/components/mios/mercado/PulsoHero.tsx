import { useState, useEffect, useRef } from "react";
import { Activity, Radio, Zap, TrendingUp, TrendingDown, AlertCircle, Clock, ArrowUpRight, Filter, RefreshCw } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes pulso-live   { 0%,100%{opacity:1;transform:scale(1)}   50%{opacity:0.5;transform:scale(0.92)} }
@keyframes pulso-ripple { 0%{transform:scale(1);opacity:0.7}       100%{transform:scale(3.2);opacity:0}  }
@keyframes pulso-bar    { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
@keyframes pulso-slide  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulso-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes pulso-glow   { 0%,100%{box-shadow:0 0 0 0 rgba(255,149,0,0)} 50%{box-shadow:0 0 24px -4px rgba(255,149,0,0.25)} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

type SignalType = "alert" | "trend" | "signal" | "neutral" | "opportunity";

interface Signal {
  id: number;
  time: string;
  type: SignalType;
  source: string;
  text: string;
  delta?: string;
  deltaUp?: boolean;
}

const INITIAL_SIGNALS: Signal[] = [
  { id: 1,  time: "agora",   type: "alert",       source: "Concorrentes",  text: "Player principal reduziu preço em 12% — possível resposta à queda de NPS detectada",                delta: "−12%",  deltaUp: false },
  { id: 2,  time: "3 min",   type: "trend",       source: "Buscas",        text: "Volume de busca por 'gestão de times remotos' acelera: +28% nas últimas 2 horas",                    delta: "+28%",  deltaUp: true  },
  { id: 3,  time: "11 min",  type: "opportunity", source: "Social",        text: "Fórum setorial com 4.2k membros debatendo dor exatamente mapeada no módulo Dores",                   delta: "4.2k",  deltaUp: true  },
  { id: 4,  time: "34 min",  type: "signal",      source: "Autoridade",    text: "Nova publicação de referência do setor — potencial de agenda-setting nos próximos 14 dias",          delta: null,    deltaUp: true  },
  { id: 5,  time: "1h",      type: "neutral",     source: "Regulação",     text: "Consulta pública em andamento — prazo de comentários encerra em 18 dias",                           delta: "18d",   deltaUp: false },
  { id: 6,  time: "1h 20m",  type: "trend",       source: "Buscas",        text: "Palavra-chave secundária do seu segmento entra no top 10 do Google Trends Brasil",                  delta: "Top 10",deltaUp: true  },
  { id: 7,  time: "2h",      type: "alert",       source: "Concorrentes",  text: "Concorrente B lançou feature nova — captura direta do gap identificado no mapeamento MIOS",        delta: null,    deltaUp: false },
  { id: 8,  time: "3h",      type: "opportunity", source: "Mercado",       text: "Janela 22h–23h mantém-se sem cobertura por qualquer player — oportunidade de ativação exclusiva",  delta: null,    deltaUp: true  },
];

const TICKER_ITEMS = [
  "🔴  Concorrente A  −12% preço",
  "🟢  Busca orgânica  +28% (2h)",
  "🟡  Consulta pública  18 dias",
  "🟢  Fórum setorial  4.2k membros",
  "🔴  Feature lançada  Concorrente B",
  "🟢  Janela 22h–23h  sem cobertura",
  "🟢  Tendência  Top 10 Brasil",
  "🟡  Publicação autoridade  14 dias",
];

const SIGNAL_CONFIG: Record<SignalType, { color: string; bg: string; border: string; label: string }> = {
  alert:       { color: "rgba(239,68,68,0.9)",   bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.18)",   label: "ALERTA"      },
  trend:       { color: "rgba(255,149,0,0.9)",   bg: "rgba(255,149,0,0.06)",   border: "rgba(255,149,0,0.18)",   label: "TENDÊNCIA"   },
  opportunity: { color: "rgba(16,185,129,0.9)",  bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.18)",  label: "OPORTUNIDADE"},
  signal:      { color: "rgba(99,102,241,0.85)", bg: "rgba(99,102,241,0.06)",  border: "rgba(99,102,241,0.18)",  label: "SINAL"       },
  neutral:     { color: "rgba(255,255,255,0.35)",bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", label: "INFO"        },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ff9500", animation: "pulso-live 1.8s ease infinite" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,149,0,0.5)", animation: "pulso-ripple 2s ease-out infinite" }} />
    </div>
  );
}

function Equalizer({ bars = 28, height = 48 }: { bars?: number; height?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height, paddingBottom: 2 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const baseH = 8 + Math.random() * (height - 12);
        const delay = (i * 0.07).toFixed(2);
        const dur   = (0.6 + Math.random() * 0.9).toFixed(2);
        return (
          <div
            key={i}
            style={{
              flex: 1, borderRadius: "1px 1px 0 0",
              background: `rgba(255,149,0,${0.18 + (i % 3) * 0.12})`,
              height: baseH,
              transformOrigin: "bottom",
              animation: `pulso-bar ${dur}s ease ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function SignalRow({ signal, isNew }: { signal: Signal; isNew?: boolean }) {
  const cfg = SIGNAL_CONFIG[signal.type];
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "11px 14px", borderRadius: 10,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        animation: isNew ? "pulso-slide 0.35s ease" : undefined,
        transition: "all 0.2s",
      }}
    >
      {/* Type badge */}
      <span style={{
        flexShrink: 0, marginTop: 1,
        fontSize: 7, fontWeight: 800, letterSpacing: 1,
        padding: "2px 6px", borderRadius: 4,
        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}>
        {cfg.label}
      </span>

      {/* Source */}
      <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", flexShrink: 0, marginTop: 2, minWidth: 72 }}>
        {signal.source}
      </span>

      {/* Text */}
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55, flex: 1 }}>
        {signal.text}
      </span>

      {/* Delta */}
      {signal.delta && (
        <span style={{
          flexShrink: 0, marginTop: 1,
          fontSize: 10, fontWeight: 700,
          color: signal.deltaUp ? "rgba(16,185,129,0.85)" : "rgba(239,68,68,0.85)",
          fontFamily: "JetBrains Mono, monospace",
        }}>
          {signal.delta}
        </span>
      )}

      {/* Time */}
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", flexShrink: 0, marginTop: 2, minWidth: 44, textAlign: "right" }}>
        {signal.time}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const FILTER_TYPES: Array<{ key: SignalType | "all"; label: string }> = [
  { key: "all",         label: "Todos"        },
  { key: "alert",       label: "Alertas"      },
  { key: "opportunity", label: "Oportunidades"},
  { key: "trend",       label: "Tendências"   },
  { key: "signal",      label: "Sinais"       },
];

export function PulsoHero() {
  const [filter, setFilter]     = useState<SignalType | "all">("all");
  const [signals, setSignals]   = useState<Signal[]>(INITIAL_SIGNALS);
  const [newId, setNewId]       = useState<number | null>(null);
  const nextId = useRef(INITIAL_SIGNALS.length + 1);

  // Simulate live incoming signal every ~8s
  useEffect(() => {
    const LIVE_SIGNALS: Omit<Signal, "id" | "time">[] = [
      { type: "trend",       source: "Buscas",      text: "Novo pico de busca: +44% em termos relacionados ao seu posicionamento",   delta: "+44%", deltaUp: true  },
      { type: "opportunity", source: "Mercado",      text: "Menção positiva em newsletter com 12k assinantes do setor",               delta: "12k",  deltaUp: true  },
      { type: "alert",       source: "Concorrentes", text: "Concorrente C atualizou landing page — mudança de proposta de valor",     delta: null,   deltaUp: false },
    ];
    let i = 0;
    const interval = setInterval(() => {
      const base = LIVE_SIGNALS[i % LIVE_SIGNALS.length];
      const id   = nextId.current++;
      const sig: Signal = { ...base, id, time: "agora" };
      setSignals(prev => [sig, ...prev.slice(0, 11)]);
      setNewId(id);
      setTimeout(() => setNewId(null), 600);
      // Age existing signals
      setSignals(prev => prev.map((s, idx) => idx === 0 ? s : {
        ...s,
        time: s.time === "agora" ? "1 min" :
              s.time === "1 min" ? "3 min" : s.time,
      }));
      i++;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "all" ? signals : signals.filter(s => s.type === filter);

  const counts = {
    alert:       signals.filter(s => s.type === "alert").length,
    opportunity: signals.filter(s => s.type === "opportunity").length,
    trend:       signals.filter(s => s.type === "trend").length,
  };

  return (
    <>
      <style>{KF}</style>

      {/* ── Hero header ──────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 16, marginBottom: 20, padding: "24px 28px 20px",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, rgba(255,149,0,0.09) 0%, rgba(4,6,15,0) 100%)",
        border: "1px solid rgba(255,149,0,0.18)",
        animation: "pulso-glow 4s ease infinite",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.06) 0%, transparent 68%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 20 }}>
          {/* Left: identity */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>PULSO DO MERCADO · GRUPO MERCADO</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.3px" }}>Monitoramento em Tempo Real</div>
              </div>

              {/* Live badge */}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.22)" }}>
                <LiveDot />
                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,149,0,0.85)", letterSpacing: "1.5px" }}>AO VIVO</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, maxWidth: 560, marginBottom: 16 }}>
              Sinais contínuos de mercado filtrados pela lente do seu negócio — concorrentes, tendências,
              sentimento e regulação, em tempo real e com contexto estratégico.
            </p>

            {/* Equalizer */}
            <Equalizer bars={40} height={36} />
          </div>

          {/* Right: counters */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            {[
              { label: "ALERTAS",       value: counts.alert,       color: "rgba(239,68,68,0.85)"  },
              { label: "OPORTUNIDADES", value: counts.opportunity, color: "rgba(16,185,129,0.85)" },
              { label: "TENDÊNCIAS",    value: counts.trend,       color: "rgba(255,149,0,0.85)"  },
            ].map(c => (
              <div key={c.label} style={{ padding: "8px 14px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "right", minWidth: 100 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1, marginTop: 3 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ticker ───────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 10, marginBottom: 18, padding: "9px 0", overflow: "hidden",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
      }}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(to right, rgba(4,6,15,0.9), transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(to left, rgba(4,6,15,0.9), transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ display: "flex", animation: "pulso-ticker 28s linear infinite", whiteSpace: "nowrap" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", padding: "0 28px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {FILTER_TYPES.map(f => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                  background: isActive ? "rgba(255,149,0,0.10)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(255,149,0,0.32)" : "rgba(255,255,255,0.07)"}`,
                  color: isActive ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.38)",
                  transition: "all 0.15s",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={11} style={{ color: "rgba(255,255,255,0.28)" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>Atualiza a cada 30s</span>
        </div>
      </div>

      {/* ── Signal feed ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {filtered.map(sig => (
          <SignalRow key={sig.id} signal={sig} isNew={sig.id === newId} />
        ))}
      </div>

      {/* ── Setup cards ──────────────────────────────────────────────────────── */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>
        CONFIGURE O MONITORAMENTO
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { Icon: Zap,        title: "Alertas inteligentes",  body: "Defina limiares e receba notificação apenas quando sinais superam o threshold estratégico configurado.", cta: "Configurar alertas"  },
          { Icon: Radio,      title: "Fontes monitoradas",    body: "Conecte buscas, redes sociais, portais setoriais e movimentos da concorrência em um único feed unificado.", cta: "Adicionar fontes"   },
          { Icon: TrendingUp, title: "Frequência de análise", body: "Escolha entre tempo real, resumo diário às 8h ou relatório semanal estratégico entregue toda segunda-feira.", cta: "Definir frequência" },
        ].map(({ Icon, title, body, cta }) => (
          <div
            key={title}
            style={{
              padding: "18px 18px 16px", borderRadius: 13,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              cursor: "pointer", transition: "all 0.18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background    = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor   = "rgba(255,149,0,0.2)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background    = "rgba(255,255,255,0.02)";
              (e.currentTarget as HTMLElement).style.borderColor   = "rgba(255,255,255,0.06)";
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon size={15} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.7)" }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.72)", marginBottom: 7 }}>{title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: 14 }}>{body}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,149,0,0.65)" }}>{cta}</span>
              <ArrowUpRight size={11} style={{ color: "rgba(255,149,0,0.45)" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
