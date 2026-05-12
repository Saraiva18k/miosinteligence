import { useState } from "react";

// ─── Animations ───────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes pulse-beat {
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50%       { opacity: 0.6; transform: scaleY(0.85); }
}
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes mios-sweep {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes ekg-draw {
  0%   { stroke-dashoffset: 800; }
  100% { stroke-dashoffset: 0; }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type SentimentTone = "positivo" | "neutro" | "negativo" | "critico";
type EmotionType   = "frustracao" | "desconfianca" | "esperanca" | "confianca" | "entusiasmo" | "indiferenca";

interface ChannelSentiment {
  id:       string;
  name:     string;
  source:   string;
  score:    number;   // -100 a +100
  volume:   number;   // mentions/month
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
  emotion: EmotionType;
  reach:   string;
}

interface EmotionBand {
  emotion:  EmotionType;
  label:    string;
  pct:      number;
  color:    string;
  insight:  string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const EKG_POINTS = "0,32 18,32 24,32 30,8 36,56 42,4 48,60 54,32 60,32 80,32 86,32 92,20 98,44 104,32 120,32 140,32 146,32 152,14 158,50 164,32 180,32 200,32 206,32 212,18 218,46 224,32 240,32 260,32 266,32 272,22 278,42 284,32 300,32";

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
    dominant: "critico" as any,
    sample: "Terceira reclamação. Nenhuma resposta em 30 dias. Padrão do setor.",
  },
];

const VERBATIMS: Verbatim[] = [
  {
    id: "V-01",
    text: "Resultado ficou exatamente como eu queria, mas depois que saí da clínica pareceu que eu nunca existí. Nenhum follow-up, nenhuma mensagem. Tive uma dúvida e tive que ligar 4 vezes.",
    source: "Google · 3 estrelas",
    tone: "neutro",
    emotion: "esperanca",
    reach: "847 visualizações",
  },
  {
    id: "V-02",
    text: "Marquei, confirmaram, cheguei no horário e esperei 1h10min. Não foi dado nenhum aviso. Quando entrei, ninguém pediu desculpa. Cancelei o retorno.",
    source: "Grupo WhatsApp local · 234 membros",
    tone: "critico",
    emotion: "frustracao",
    reach: "Compartilhado 18x",
  },
  {
    id: "V-03",
    text: "Queria saber se alguém aqui tem experiência real com resultado garantido nesse tipo de procedimento. Procuro faz semanas e não acho nada confiável.",
    source: "Reddit r/beleza · 2.1k upvotes",
    tone: "neutro",
    emotion: "desconfianca",
    reach: "2.100 upvotes · 189 comentários",
  },
  {
    id: "V-04",
    text: "Fui indicada por três amigas. Atendimento impecável, resultado acima da expectativa. O único ponto é que o preço que estava no site não era o final.",
    source: "Instagram · comentário fixado",
    tone: "positivo",
    emotion: "confianca",
    reach: "1.340 curtidas",
  },
  {
    id: "V-05",
    text: "Já tive experiências ruins no mercado. Aqui o processo foi transparente do início ao fim — até mandaram foto de acompanhamento no D+7. Voltarei com certeza.",
    source: "Google · 5 estrelas",
    tone: "positivo",
    emotion: "confianca",
    reach: "412 curtidas · marcado como útil",
  },
];

const EMOTIONS: EmotionBand[] = [
  { emotion: "frustracao",    label: "Frustração",    pct: 38, color: "#ef4444", insight: "Espera, silêncio e promessa não cumprida. Recorrência em todos os canais negativos."     },
  { emotion: "desconfianca",  label: "Desconfiança",  pct: 27, color: "#f97316", insight: "Mercado sem garantia documentada gera ceticismo antes mesmo do primeiro contato."          },
  { emotion: "esperanca",     label: "Esperança",     pct: 18, color: "#ff9500", insight: "Cliente quer acreditar — resultado existe, mas experiência pós-venda destrói a memória."   },
  { emotion: "confianca",     label: "Confiança",     pct: 11, color: "rgba(255,255,255,0.4)", insight: "Concentrada em canais com prova visual + follow-up documentado. Convertível." },
  { emotion: "entusiasmo",    label: "Entusiasmo",    pct: 4,  color: "rgba(255,255,255,0.2)", insight: "Picos em conteúdo de vídeo autêntico. Canal TikTok mostra maior potencial."  },
  { emotion: "indiferenca",   label: "Indiferença",   pct: 2,  color: "rgba(255,255,255,0.1)", insight: "Usuário sem contato prévio — ainda não foi atingido por nenhuma comunicação." },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const pct     = Math.abs(score);
  const isPos   = score >= 0;
  const color   = score >= 20 ? "#ff9500" : score >= 0 ? "rgba(255,149,0,0.5)" : score >= -40 ? "#f97316" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* negative side */}
      <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
        {!isPos && (
          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, marginLeft: "auto" }} />
        )}
      </div>
      <span style={{ fontSize: 13, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace", width: 34, textAlign: "center", flexShrink: 0 }}>
        {isPos ? "+" : ""}{score}
      </span>
      {/* positive side */}
      <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
        {isPos && (
          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2 }} />
        )}
      </div>
    </div>
  );
}

function ToneBadge({ tone }: { tone: SentimentTone }) {
  const MAP = {
    positivo:  { label: "POSITIVO", color: "#ff9500",              bg: "rgba(255,149,0,0.08)"    },
    neutro:    { label: "NEUTRO",   color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.04)"  },
    negativo:  { label: "NEGATIVO", color: "#f97316",              bg: "rgba(249,115,22,0.08)"   },
    critico:   { label: "CRÍTICO",  color: "#ef4444",              bg: "rgba(239,68,68,0.08)"    },
  };
  const s = MAP[tone];
  return (
    <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: s.color, background: s.bg, backdropFilter: "blur(10px) saturate(150%)", WebkitBackdropFilter: "blur(10px) saturate(150%)", border: `1px solid ${s.color}30`, borderRadius: 3, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>
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

  const TREND_COLOR = {
    subindo: "#ff9500",
    caindo:  "#ef4444",
    estavel: "rgba(255,255,255,0.35)",
  };
  const TREND_LABEL = {
    subindo: "↑ SUBINDO",
    caindo:  "↓ CAINDO",
    estavel: "→ ESTÁVEL",
  };

  const scoreColor = macroScore >= 0 ? "#ff9500" : macroScore >= -40 ? "#f97316" : "#ef4444";

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── SCAN HEADER ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>SENTIMENTO — O PULSO</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", fontFamily: "JetBrains Mono, monospace" }}>v1.0.0</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {[
              { label: "SCORE MACRO",    value: `${macroScore > 0 ? "+" : ""}${macroScore}`, color: scoreColor         },
              { label: "CANAIS",         value: "6",                                          color: "#ff9500"          },
              { label: "VOLUME/MÊS",     value: totalVolume,                                 color: "rgba(255,255,255,0.55)" },
              { label: "TOM DOMINANTE",  value: "FRUSTRAÇÃO",                                color: "#ef4444"          },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 1 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EKG STRIP ────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,149,0,0.08)", background: "rgba(255,149,0,0.02)", padding: "10px 24px", flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, background: "linear-gradient(to right, #04060f, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, background: "linear-gradient(to left, #04060f, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <svg width="100%" height="64" viewBox="0 0 600 64" preserveAspectRatio="none" fill="none">
          <line x1="0" y1="32" x2="600" y2="32" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <polyline
            points={EKG_POINTS + " " + EKG_POINTS.split(" ").map(p => { const [x,y] = p.split(","); return `${+x+300},${y}`; }).join(" ")}
            stroke="#ff9500"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="800"
            strokeDashoffset="0"
            style={{ animation: "ekg-draw 2.5s ease forwards" }}
            opacity="0.7"
          />
          {/* Negative zone tint */}
          <rect x="0" y="32" width="600" height="32" fill="rgba(239,68,68,0.03)" />
        </svg>
        <div style={{ position: "absolute", right: 72, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>PULSO DE MERCADO · 12 MESES</span>
        </div>
      </div>

      {/* ── BODY: canal index + detalhe ──────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Canal index */}
        <div style={{ width: 214, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.16)", fontFamily: "JetBrains Mono, monospace" }}>CANAIS MONITORADOS</span>
          </div>
          {CHANNELS.map(c => {
            const isActive = c.id === activeChannel;
            const col = c.score >= 0 ? "#ff9500" : c.score >= -40 ? "#f97316" : "#ef4444";
            return (
              <button key={c.id} onClick={() => setActiveChannel(c.id)} style={{
                width: "100%", textAlign: "left", display: "block",
                padding: "10px 14px",
                background: isActive ? "rgba(255,149,0,0.05)" : "transparent",
                borderLeft: `2px solid ${isActive ? "#ff9500" : "transparent"}`,
                borderRight: "none", borderTop: "none",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{c.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 900, color: col, fontFamily: "JetBrains Mono, monospace" }}>{c.score > 0 ? "+" : ""}{c.score}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 6, color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.38)" }}>{c.name}</div>
                {/* mini score bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                  <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.abs(c.score)}%`, background: col, borderRadius: 1, marginLeft: c.score >= 0 ? 0 : "auto" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, color: TREND_COLOR[c.trend], fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{TREND_LABEL[c.trend]}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace" }}>{(c.volume/1000).toFixed(1)}k/mês</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Canal detalhe */}
        <div key={activeChannel} style={{ flex: 1, padding: "22px 26px", animation: "mios-sweep 0.22s ease" }}>
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{ch.id}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px) saturate(150%)", WebkitBackdropFilter: "blur(10px) saturate(150%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3, padding: "2px 7px", fontFamily: "JetBrains Mono, monospace" }}>{ch.source}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: TREND_COLOR[ch.trend], background: `${TREND_COLOR[ch.trend]}10`, backdropFilter: "blur(10px) saturate(150%)", WebkitBackdropFilter: "blur(10px) saturate(150%)", fontFamily: "JetBrains Mono, monospace", padding: "2px 7px", border: `1px solid ${TREND_COLOR[ch.trend]}40`, borderRadius: 3 }}>{TREND_LABEL[ch.trend]}</span>
          </div>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "rgba(255,255,255,0.88)", lineHeight: 1.3, marginBottom: 18 }}>{ch.name}</h2>

          {/* Metrics */}
          <div className="flex items-center gap-8 flex-wrap" style={{ marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>SCORE DE SENTIMENTO</div>
              <ScoreBar score={ch.score} />
            </div>
            {[
              { label: "VOLUME/MÊS",     value: ch.volume.toLocaleString("pt-BR") + " menções" },
              { label: "VARIAÇÃO",       value: ch.trendVal                                     },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Sample verbatim */}
          <div style={{ padding: "14px 18px", background: "rgba(255,149,0,0.03)", backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", border: "1px solid rgba(255,149,0,0.08)", borderLeft: "2px solid rgba(255,149,0,0.35)", borderRadius: "0 6px 6px 0", marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>VERBATIM REPRESENTATIVO</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.72, fontStyle: "italic" }}>"{ch.sample}"</p>
          </div>

          {/* Diagnosis */}
          <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.28)", backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(255,255,255,0.1)", borderRadius: "0 0 8px 8px" }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>DIAGNÓSTICO DO CANAL</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.62)", lineHeight: 1.65 }}>
              {ch.id === "CH-01" && "Avaliações públicas com maior peso decisório. Score negativo puxado por espera e silêncio pós-atendimento — não pela qualidade do resultado. Reversível com protocolo operacional."}
              {ch.id === "CH-02" && "Canal de maior alcance e tom mais positivo, mas superficial. Comentários enaltecem o resultado e silenciam o processo. Não resolve desconfiança de novos clientes."}
              {ch.id === "CH-03" && "Canal mais crítico e com maior queda. Grupos fechados amplificam experiências negativas sem filtro e sem resposta da marca. Invisível para a empresa, visível para 890 potenciais clientes/mês."}
              {ch.id === "CH-04" && "Volume baixo, impacto alto. Fóruns são consultados por clientes em fase de pesquisa profunda — os que mais convertem. Score fortemente negativo aqui filtra leads de alta intenção."}
              {ch.id === "CH-05" && "Único canal com tendência positiva e subindo. Conteúdo autêntico e resultado real superam qualquer anúncio em conversão. Canal com maior potencial de crescimento orgânico no setor."}
              {ch.id === "CH-06" && "Score mais baixo de todos os canais. Reclame Aqui é consultado como validação final antes da compra — score crítico aqui elimina clientes que já quase decidiram. Cada reclamação não respondida custa múltiplas conversões."}
            </p>
          </div>
        </div>

      </div>{/* end body */}

      {/* ── VERBATIMS REAIS ──────────────────────────────────────────────── */}
      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>ESCUTA DIRETA</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>VERBATIMS REAIS — O QUE O MERCADO ESTÁ DIZENDO AGORA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
          {VERBATIMS.map((v, i) => {
            const toneCol = { positivo: "#ff9500", neutro: "rgba(255,255,255,0.3)", negativo: "#f97316", critico: "#ef4444" }[v.tone];
            return (
              <div key={v.id} style={{
                padding: "15px 20px",
                background: i === 0 || i === 1 ? "rgba(239,68,68,0.03)" : "rgba(255,255,255,0.016)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                border: `1px solid ${i < 2 ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)"}`,
                borderLeft: `3px solid ${toneCol}`,
                borderRadius: "0 8px 8px 0",
              }}>
                <div className="flex items-start gap-3">
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.60)", lineHeight: 1.72, fontStyle: "italic", marginBottom: 10 }}>
                      "{v.text}"
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <ToneBadge tone={v.tone} />
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace" }}>{v.source}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,149,0,0.45)", fontFamily: "JetBrains Mono, monospace" }}>{v.reach}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAPA EMOCIONAL ───────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px 56px" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>FREQUÊNCIA EMOCIONAL — COMPOSIÇÃO DO SENTIMENTO</span>
        </div>

        {/* Stacked bar */}
        <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 20 }}>
          {EMOTIONS.map(e => (
            <div key={e.emotion} style={{ width: `${e.pct}%`, background: e.color, transition: "width 0.4s ease" }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {EMOTIONS.map(e => (
            <div key={e.emotion} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "12px 18px",
              background: "rgba(255,255,255,0.016)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderLeft: `3px solid ${e.color}`,
              borderRadius: "0 6px 6px 0",
            }}>
              <div style={{ flexShrink: 0, width: 52, textAlign: "right" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: e.color, fontFamily: "JetBrains Mono, monospace" }}>{e.pct}%</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.72)", marginBottom: 3 }}>{e.label}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.58 }}>{e.insight}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom synthesis */}
        <div style={{ marginTop: 3, padding: "20px 22px", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", border: "1px solid rgba(255,255,255,0.05)", borderTop: "2px solid rgba(255,255,255,0.08)", borderRadius: "0 0 8px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>SÍNTESE DO PULSO</div>
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
