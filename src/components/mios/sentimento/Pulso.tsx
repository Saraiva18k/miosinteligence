import { useState, useEffect, useRef } from "react";

// ─── Animations ───────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes mios-sweep {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type SentimentTone = "positivo" | "neutro" | "negativo" | "critico";
type EmotionType   = "frustracao" | "desconfianca" | "esperanca" | "confianca" | "entusiasmo" | "indiferenca";

interface ChannelSentiment {
  id:       string;
  name:     string;
  source:   string;
  score:    number;
  volume:   number;
  trend:    "subindo" | "caindo" | "estavel";
  trendVal: string;
  dominant: EmotionType;
  sample:   string;
}

interface Verbatim {
  id:      string;
  text:    string;
  source:  string;
  tone:    SentimentTone;
  reach:   string;
}

interface EmotionBand {
  emotion: EmotionType;
  label:   string;
  pct:     number;
  color:   string;
  insight: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CHANNELS: ChannelSentiment[] = [
  {
    id: "CH-01", name: "Google Avaliações", source: "Google Business",
    score: -42, volume: 1840, trend: "caindo", trendVal: "−8 pts/mês",
    dominant: "frustracao",
    sample: "Esperei 50 minutos além do horário. Ninguém avisou nada.",
  },
  {
    id: "CH-02", name: "Instagram Comentários", source: "Instagram",
    score: +31, volume: 3200, trend: "estavel", trendVal: "±2 pts/mês",
    dominant: "esperanca",
    sample: "Resultado incrível! Mas o pós-atendimento some completamente.",
  },
  {
    id: "CH-03", name: "Grupos Fechados", source: "WhatsApp / Telegram",
    score: -67, volume: 890, trend: "caindo", trendVal: "−14 pts/mês",
    dominant: "desconfianca",
    sample: "Alguém sabe se eles realmente garantem o resultado? Perguntei e não responderam.",
  },
  {
    id: "CH-04", name: "Reddit / Fóruns", source: "Reddit BR · Fóruns",
    score: -55, volume: 420, trend: "caindo", trendVal: "−11 pts/mês",
    dominant: "frustracao",
    sample: "Paguei adiantado, o resultado não veio como prometido e o suporte é zero.",
  },
  {
    id: "CH-05", name: "TikTok Comentários", source: "TikTok",
    score: +18, volume: 5600, trend: "subindo", trendVal: "+6 pts/mês",
    dominant: "entusiasmo",
    sample: "Esse vídeo me convenceu mais do que qualquer anúncio que já vi.",
  },
  {
    id: "CH-06", name: "Reclame Aqui", source: "Reclame Aqui",
    score: -81, volume: 312, trend: "caindo", trendVal: "−5 pts/mês",
    dominant: "frustracao",
    sample: "Terceira reclamação. Nenhuma resposta em 30 dias. Padrão do setor.",
  },
];

const VERBATIMS: Verbatim[] = [
  {
    id: "V-01",
    text: "Resultado ficou exatamente como eu queria, mas depois que saí da clínica pareceu que eu nunca existí. Nenhum follow-up, nenhuma mensagem. Tive uma dúvida e tive que ligar 4 vezes.",
    source: "Google · 3 estrelas", tone: "neutro", reach: "847 visualizações",
  },
  {
    id: "V-02",
    text: "Marquei, confirmaram, cheguei no horário e esperei 1h10min. Não foi dado nenhum aviso. Quando entrei, ninguém pediu desculpa. Cancelei o retorno.",
    source: "Grupo WhatsApp local · 234 membros", tone: "critico", reach: "Compartilhado 18x",
  },
  {
    id: "V-03",
    text: "Queria saber se alguém aqui tem experiência real com resultado garantido nesse tipo de procedimento. Procuro faz semanas e não acho nada confiável.",
    source: "Reddit r/beleza · 2.1k upvotes", tone: "neutro", reach: "2.100 upvotes · 189 comentários",
  },
  {
    id: "V-04",
    text: "Fui indicada por três amigas. Atendimento impecável, resultado acima da expectativa. O único ponto é que o preço que estava no site não era o final.",
    source: "Instagram · comentário fixado", tone: "positivo", reach: "1.340 curtidas",
  },
  {
    id: "V-05",
    text: "Já tive experiências ruins no mercado. Aqui o processo foi transparente do início ao fim — até mandaram foto de acompanhamento no D+7. Voltarei com certeza.",
    source: "Google · 5 estrelas", tone: "positivo", reach: "412 curtidas · marcado como útil",
  },
];

const EMOTIONS: EmotionBand[] = [
  { emotion: "frustracao",   label: "Frustração",   pct: 38, color: "#ef4444",               insight: "Espera, silêncio e promessa não cumprida. Recorrência em todos os canais negativos."     },
  { emotion: "desconfianca", label: "Desconfiança",  pct: 27, color: "#f97316",               insight: "Mercado sem garantia documentada gera ceticismo antes mesmo do primeiro contato."          },
  { emotion: "esperanca",    label: "Esperança",    pct: 18, color: "#ff9500",               insight: "Cliente quer acreditar — resultado existe, mas experiência pós-venda destrói a memória."   },
  { emotion: "confianca",    label: "Confiança",    pct: 11, color: "rgba(255,255,255,0.4)", insight: "Concentrada em canais com prova visual + follow-up documentado. Altamente convertível."    },
  { emotion: "entusiasmo",   label: "Entusiasmo",   pct: 4,  color: "rgba(255,255,255,0.2)", insight: "Picos em conteúdo de vídeo autêntico. TikTok mostra maior potencial de crescimento."       },
  { emotion: "indiferenca",  label: "Indiferença",  pct: 2,  color: "rgba(255,255,255,0.1)", insight: "Usuário sem contato prévio — ainda não foi atingido por nenhuma comunicação da marca."     },
];

// ─── EKG Monitor — canvas hospital-style ─────────────────────────────────────

function EKGMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const xRef      = useRef<number>(0);
  const prevYRef  = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const BG    = "#04060f";
    const BEAT  = 180;   // pixels per heartbeat cycle
    const SPEED = 1.8;   // px per frame
    const ERASE = 28;    // eraser zone px ahead of head

    const init = () => {
      canvas.width  = canvas.offsetWidth  || 800;
      canvas.height = canvas.offsetHeight || 72;
      prevYRef.current = canvas.height / 2;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    init();

    const ro = new ResizeObserver(() => { init(); xRef.current = 0; });
    ro.observe(canvas);

    // ECG waveform — returns Y pixel for a given absolute x
    function ekgY(x: number): number {
      const H   = canvas.height;
      const mid = H * 0.5;
      const amp = H * 0.40;
      const p   = (x % BEAT) / BEAT; // 0..1 within one beat

      if (p < 0.10) return mid;
      if (p < 0.20) return mid - Math.sin(((p - 0.10) / 0.10) * Math.PI) * amp * 0.18;
      if (p < 0.27) return mid;
      if (p < 0.31) return mid + Math.sin(((p - 0.27) / 0.04) * Math.PI) * amp * 0.14;
      if (p < 0.35) return mid - Math.sin(((p - 0.31) / 0.04) * Math.PI) * amp;
      if (p < 0.39) return mid + Math.sin(((p - 0.35) / 0.04) * Math.PI) * amp * 0.42;
      if (p < 0.44) return mid + (1 - ((p - 0.39) / 0.05)) * amp * 0.04;
      if (p < 0.53) return mid;
      if (p < 0.70) return mid - Math.sin(((p - 0.53) / 0.17) * Math.PI) * amp * 0.20;
      return mid;
    }

    function draw() {
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      const W  = canvas.width;
      const H  = canvas.height;
      const x  = xRef.current;
      const nx = x + SPEED;
      const ny = ekgY(nx);
      const py = prevYRef.current;

      // Erase zone ahead of head
      ctx.fillStyle = BG;
      ctx.fillRect(nx, 0, ERASE, H);

      // Grid line in erase zone
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(nx + 1, H / 2);
      ctx.lineTo(nx + ERASE, H / 2);
      ctx.stroke();

      // Outer glow
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "rgba(255,149,0,0.15)";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Inner glow
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "rgba(255,149,0,0.35)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Main line
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "#ff9500";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Bright head dot
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffbb55";
      ctx.fill();

      prevYRef.current = ny;

      if (nx + ERASE >= W) {
        xRef.current = 0;
        prevYRef.current = H / 2;
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, ERASE + 4, H);
      } else {
        xRef.current = nx;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const isPos = score >= 0;
  const pct   = Math.abs(score);
  const color = score >= 20 ? "#ff9500" : score >= 0 ? "rgba(255,149,0,0.5)" : score >= -40 ? "#f97316" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
        {!isPos && <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, marginLeft: "auto" }} />}
      </div>
      <span style={{ fontSize: 11, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace", width: 34, textAlign: "center", flexShrink: 0 }}>
        {isPos ? "+" : ""}{score}
      </span>
      <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
        {isPos && <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2 }} />}
      </div>
    </div>
  );
}

function ToneBadge({ tone }: { tone: SentimentTone }) {
  const MAP = {
    positivo: { label: "POSITIVO", color: "#ff9500",               bg: "rgba(255,149,0,0.08)"   },
    neutro:   { label: "NEUTRO",   color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.04)" },
    negativo: { label: "NEGATIVO", color: "#f97316",               bg: "rgba(249,115,22,0.08)"  },
    critico:  { label: "CRÍTICO",  color: "#ef4444",               bg: "rgba(239,68,68,0.08)"   },
  };
  const s = MAP[tone];
  return (
    <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1, color: s.color, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 3, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>
      {s.label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Pulso() {
  const [activeChannel, setActiveChannel] = useState("CH-01");
  const ch = CHANNELS.find(c => c.id === activeChannel)!;

  const macroScore = Math.round(
    CHANNELS.reduce((sum, c) => sum + c.score * c.volume, 0) /
    CHANNELS.reduce((sum, c) => sum + c.volume, 0)
  );
  const totalVolume = CHANNELS.reduce((s, c) => s + c.volume, 0).toLocaleString("pt-BR");

  const TREND_COLOR = { subindo: "#ff9500", caindo: "#ef4444", estavel: "rgba(255,255,255,0.35)" };
  const TREND_LABEL = { subindo: "↑ SUBINDO", caindo: "↓ CAINDO", estavel: "→ ESTÁVEL" };
  const scoreColor  = macroScore >= 0 ? "#ff9500" : macroScore >= -40 ? "#f97316" : "#ef4444";

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── SCAN HEADER ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{
              fontSize: 8, fontWeight: 900, letterSpacing: 2,
              color: "rgba(255,149,0,0.9)", fontFamily: "JetBrains Mono, monospace",
              animation: "mios-pulse 1.4s ease-in-out infinite",
            }}>● LIVE</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>SENTIMENTO — O PULSO</span>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.12)", fontFamily: "JetBrains Mono, monospace" }}>v1.0.0</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {[
              { label: "SCORE MACRO",   value: `${macroScore > 0 ? "+" : ""}${macroScore}`, color: scoreColor                 },
              { label: "CANAIS",        value: "6",                                          color: "#ff9500"                   },
              { label: "VOLUME/MÊS",    value: totalVolume,                                  color: "rgba(255,255,255,0.55)"    },
              { label: "TOM DOMINANTE", value: "FRUSTRAÇÃO",                                 color: "#ef4444"                  },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 1 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EKG MONITOR (live canvas) ────────────────────────────────────── */}
      <div style={{
        position: "relative", height: 72,
        borderBottom: "1px solid rgba(255,149,0,0.08)",
        background: "#04060f", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 32, background: "linear-gradient(to right, #04060f, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 32, background: "linear-gradient(to left, #04060f, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 40, bottom: 8, zIndex: 3, pointerEvents: "none" }}>
          <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace" }}>PULSO DE MERCADO · 12 MESES</span>
        </div>
        <EKGMonitor />
      </div>

      {/* ── BODY: canal index + detalhe ──────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Canal index */}
        <div style={{ width: 214, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.16)", fontFamily: "JetBrains Mono, monospace" }}>CANAIS MONITORADOS</span>
          </div>
          {CHANNELS.map(c => {
            const isActive = c.id === activeChannel;
            const col = c.score >= 0 ? "#ff9500" : c.score >= -40 ? "#f97316" : "#ef4444";
            return (
              <button key={c.id} onClick={() => setActiveChannel(c.id)} style={{
                width: "100%", textAlign: "left", display: "block", padding: "10px 14px",
                background: isActive ? "rgba(255,149,0,0.05)" : "transparent",
                borderLeft: `2px solid ${isActive ? "#ff9500" : "transparent"}`,
                borderRight: "none", borderTop: "none", borderBottom: "1px solid rgba(255,255,255,0.03)",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{c.id}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, color: col, fontFamily: "JetBrains Mono, monospace" }}>{c.score > 0 ? "+" : ""}{c.score}</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.3, marginBottom: 6, color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.38)" }}>{c.name}</div>
                <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${Math.abs(c.score)}%`, background: col, borderRadius: 1, marginLeft: c.score >= 0 ? 0 : "auto" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 7, color: TREND_COLOR[c.trend], fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{TREND_LABEL[c.trend]}</span>
                  <span style={{ fontSize: 7, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace" }}>{(c.volume / 1000).toFixed(1)}k/mês</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Canal detalhe */}
        <div key={activeChannel} style={{ flex: 1, padding: "22px 26px", animation: "mios-sweep 0.22s ease" }}>
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{ch.id}</span>
            <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)", borderRadius: 3, padding: "2px 7px", fontFamily: "JetBrains Mono, monospace" }}>{ch.source}</span>
            <span style={{ fontSize: 7, fontWeight: 700, color: TREND_COLOR[ch.trend], fontFamily: "JetBrains Mono, monospace", padding: "2px 7px", border: `1px solid ${TREND_COLOR[ch.trend]}40`, borderRadius: 3 }}>{TREND_LABEL[ch.trend]}</span>
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "rgba(255,255,255,0.88)", lineHeight: 1.3, marginBottom: 18 }}>{ch.name}</h2>
          <div className="flex items-center gap-8 flex-wrap" style={{ marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>SCORE DE SENTIMENTO</div>
              <ScoreBar score={ch.score} />
            </div>
            {[
              { label: "VOLUME/MÊS", value: ch.volume.toLocaleString("pt-BR") + " menções" },
              { label: "VARIAÇÃO",   value: ch.trendVal },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 18px", background: "rgba(255,149,0,0.03)", border: "1px solid rgba(255,149,0,0.08)", borderLeft: "2px solid rgba(255,149,0,0.35)", borderRadius: "0 6px 6px 0", marginBottom: 10 }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>VERBATIM REPRESENTATIVO</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.72, fontStyle: "italic" }}>"{ch.sample}"</p>
          </div>
          <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(255,255,255,0.1)", borderRadius: "0 0 8px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>DIAGNÓSTICO DO CANAL</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.62)", lineHeight: 1.65 }}>
              {ch.id === "CH-01" && "Avaliações públicas com maior peso decisório. Score negativo puxado por espera e silêncio pós-atendimento — não pela qualidade do resultado. Reversível com protocolo operacional."}
              {ch.id === "CH-02" && "Canal de maior alcance e tom mais positivo, mas superficial. Comentários enaltecem o resultado e silenciam o processo. Não resolve desconfiança de novos clientes."}
              {ch.id === "CH-03" && "Canal mais crítico e com maior queda. Grupos fechados amplificam experiências negativas sem filtro e sem resposta da marca. Invisível para a empresa, visível para 890 potenciais clientes/mês."}
              {ch.id === "CH-04" && "Volume baixo, impacto alto. Fóruns são consultados por clientes em fase de pesquisa profunda — os que mais convertem. Score fortemente negativo aqui filtra leads de alta intenção."}
              {ch.id === "CH-05" && "Único canal com tendência positiva e subindo. Conteúdo autêntico e resultado real superam qualquer anúncio em conversão. Canal com maior potencial de crescimento orgânico no setor."}
              {ch.id === "CH-06" && "Score mais baixo de todos os canais. Reclame Aqui é consultado como validação final antes da compra — score crítico aqui elimina clientes que já quase decidiram."}
            </p>
          </div>
        </div>

      </div>

      {/* ── VERBATIMS REAIS ──────────────────────────────────────────────── */}
      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>ESCUTA DIRETA</span>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>VERBATIMS REAIS — O QUE O MERCADO ESTÁ DIZENDO AGORA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
          {VERBATIMS.map((v, i) => {
            const toneCol = { positivo: "#ff9500", neutro: "rgba(255,255,255,0.3)", negativo: "#f97316", critico: "#ef4444" }[v.tone];
            return (
              <div key={v.id} style={{
                padding: "15px 20px",
                background: i < 2 ? "rgba(239,68,68,0.03)" : "rgba(255,255,255,0.016)",
                border: `1px solid ${i < 2 ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)"}`,
                borderLeft: `3px solid ${toneCol}`, borderRadius: "0 8px 8px 0",
              }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: 1.72, fontStyle: "italic", marginBottom: 10 }}>"{v.text}"</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <ToneBadge tone={v.tone} />
                  <span style={{ fontSize: 7, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace" }}>{v.source}</span>
                  <span style={{ fontSize: 7, color: "rgba(255,149,0,0.45)", fontFamily: "JetBrains Mono, monospace" }}>{v.reach}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAPA EMOCIONAL ───────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px 56px" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>FREQUÊNCIA EMOCIONAL — COMPOSIÇÃO DO SENTIMENTO</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 20 }}>
          {EMOTIONS.map(e => <div key={e.emotion} style={{ width: `${e.pct}%`, background: e.color }} />)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {EMOTIONS.map(e => (
            <div key={e.emotion} style={{
              display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 18px",
              background: "rgba(255,255,255,0.016)", border: "1px solid rgba(255,255,255,0.04)",
              borderLeft: `3px solid ${e.color}`, borderRadius: "0 6px 6px 0",
            }}>
              <div style={{ flexShrink: 0, width: 52, textAlign: "right" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: e.color, fontFamily: "JetBrains Mono, monospace" }}>{e.pct}%</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.72)", marginBottom: 3 }}>{e.label}</div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.58 }}>{e.insight}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 3, padding: "20px 22px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderTop: "2px solid rgba(255,255,255,0.08)", borderRadius: "0 0 8px 8px" }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>SÍNTESE DO PULSO</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 680 }}>
            O mercado não odeia o resultado — odeia o vácuo que vem depois. Frustração (38%) e Desconfiança (27%) são emoções de processo, não de entrega. O cliente que sai satisfeito ainda assim não volta nem indica porque{" "}
            <span style={{ color: "#ff9500" }}>ninguém fechou o ciclo.</span>{" "}
            Protocolo de follow-up estruturado transforma o maior problema emocional do setor em vantagem imediata.
          </p>
        </div>
      </div>
    </>
  );
}
