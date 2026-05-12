import { useState } from "react";

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
@keyframes flow-fill {
  0%   { width: 0%; }
  100% { width: var(--w); }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type ChannelType      = "pago" | "organico" | "direto" | "referencia";
type Competition      = "baixa" | "media" | "alta" | "saturada";
type Recommendation   = "invest" | "hold" | "cut" | "explore";
type Trend            = "crescendo" | "estavel" | "caindo";

interface Canal {
  id:               string;
  name:             string;
  type:             ChannelType;
  volumeK:          number;   // reach/month in thousands
  cac:              number;   // R$ per acquisition
  convRate:         number;   // % conversion from reach
  competition:      Competition;
  compPresence:     number;   // % of competitors active here 0-100
  trend:            Trend;
  recommendation:   Recommendation;
  opportunityScore: number;   // 0-100
  evidence:         string;
  implication:      string;
}

interface Opportunity {
  canal:    string;
  why:      string;
  action:   string;
  urgency:  "critico" | "alto" | "medio";
  gain:     string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CANAIS: Canal[] = [
  {
    id: "C-01", name: "Google SEO Orgânico", type: "organico",
    volumeK: 28, cac: 38, convRate: 4.2, competition: "media", compPresence: 42,
    trend: "crescendo", recommendation: "invest", opportunityScore: 88,
    evidence: "28.000 buscas/mês com intenção de compra no nicho, 42% dos concorrentes com presença orgânica estruturada. Custo de aquisição 73% menor que Google Ads equivalente. Conteúdo estruturado (FAQ, resultado, metodologia) indexa em posição 1-3 em média 90 dias após publicação.",
    implication: "Canal de maior ROI no longo prazo — e o único que cresce enquanto dorme. Cada R$1 investido em conteúdo estruturado agora vale R$8-12 em 18 meses. Janela de diferenciação orgânica: 3-5 meses antes da saturação do nicho.",
  },
  {
    id: "C-02", name: "TikTok Orgânico", type: "organico",
    volumeK: 56, cac: 22, convRate: 2.8, competition: "baixa", compPresence: 18,
    trend: "crescendo", recommendation: "invest", opportunityScore: 94,
    evidence: "56.000 impressões/mês alcançáveis com 4 vídeos semanais de processo real. Apenas 18% dos concorrentes com presença ativa. CAC 67% menor que Instagram Ads. Algoritmo distribui conteúdo especializado sem custo de mídia.",
    implication: "Canal mais subexplorado e com maior potencial de crescimento imediato. Especialização nichada + resultado documentado em vídeo = autoridade orgânica que ads não compram. Janela de pioneirismo: 3-6 meses.",
  },
  {
    id: "C-03", name: "WhatsApp / Indicação", type: "direto",
    volumeK: 4, cac: 0, convRate: 38, compPresence: 12,
    competition: "baixa", trend: "estavel", recommendation: "invest", opportunityScore: 82,
    evidence: "Taxa de conversão de 38% — a mais alta de todos os canais, 9x acima da média. CAC zero para base de clientes existente. 12% dos concorrentes com programa de indicação estruturado. Recomendação pessoal converte 4x mais que anúncio.",
    implication: "Canal mais eficiente em custo e conversão — e o menos explorado pelo mercado. Lista de transmissão ativa + protocolo de indicação = pipeline que custa próximo de zero e não depende de plataforma.",
  },
  {
    id: "C-04", name: "Instagram Orgânico", type: "organico",
    volumeK: 32, cac: 45, convRate: 1.9, competition: "alta", compPresence: 78,
    trend: "estavel", recommendation: "hold", opportunityScore: 48,
    evidence: "78% dos concorrentes com presença ativa. Alcance orgânico médio caindo 3% ao mês. Canal ainda relevante para prova social e reputação — não para aquisição direta. Comentários de resultado têm 3x mais engajamento que posts de produto.",
    implication: "Manter presença para credibilidade, não para aquisição. Foco em prova social (resultado documentado) em vez de posts promocionais. Reduzir frequência para 3x/semana e redirecionar esforço para TikTok.",
  },
  {
    id: "C-05", name: "Google Ads (Search)", type: "pago",
    volumeK: 18, cac: 280, convRate: 3.1, competition: "saturada", compPresence: 91,
    trend: "caindo", recommendation: "cut", opportunityScore: 22,
    evidence: "CPL médio subiu 67% em 24 meses. 91% dos concorrentes competindo pelo mesmo inventário. CPC médio no nicho: R$4.80 → R$8.20 em 2 anos. ROI positivo apenas para buscas com intenção altíssima ('clínica + bairro + procedimento').",
    implication: "Reduzir para campanhas ultra-segmentadas (procedimento + localização + intent) e eliminar campanhas genéricas. Budget liberado deve ir para SEO e TikTok — mesmos leads com 70% menos custo.",
  },
  {
    id: "C-06", name: "Instagram Ads", type: "pago",
    volumeK: 22, cac: 340, convRate: 1.2, competition: "saturada", compPresence: 85,
    trend: "caindo", recommendation: "cut", opportunityScore: 15,
    evidence: "CAC mais alto do portfólio. CTR médio de 0.8% — abaixo do benchmark de 1.5% do setor. 85% dos concorrentes competindo no mesmo público-alvo. Usuário ignora ad antes de ler na maioria das impressões (banner blindness consolidado).",
    implication: "Eliminar ou pausar. Budget realocado para canais orgânicos retorna 4-8x mais em 6 meses. Manter apenas para remarketing de visitantes de site (custo marginal baixo, intenção alta).",
  },
  {
    id: "C-07", name: "YouTube Orgânico", type: "organico",
    volumeK: 8, cac: 55, convRate: 5.8, competition: "baixa", compPresence: 14,
    trend: "crescendo", recommendation: "explore", opportunityScore: 71,
    evidence: "Taxa de conversão mais alta do portfólio (5.8%) — usuário de YouTube pesquisa com intenção profunda. Apenas 14% dos concorrentes com canal ativo. Conteúdo de processo/metodologia performa melhor que conteúdo promocional.",
    implication: "Canal com maior potencial de longo prazo após TikTok. Vídeos mais longos (8-12 min) sobre processo e resultado posicionam como autoridade irrefutável. Requer consistência mínima de 2 vídeos/semana por 6 meses para ganhar tração.",
  },
  {
    id: "C-08", name: "E-mail / CRM", type: "direto",
    volumeK: 3, cac: 8, convRate: 12, competition: "baixa", compPresence: 22,
    trend: "estavel", recommendation: "explore", opportunityScore: 65,
    evidence: "Base de clientes existentes com CAC de R$8 para reativação. Taxa de abertura média do setor: 22%. Clientes que recebem follow-up estruturado pós-procedimento têm 3.2x mais chance de retornar e 4.8x mais chance de indicar.",
    implication: "Canal inexplorado para o ativo mais valioso: base de clientes existente. Sequência de e-mail pós-procedimento (D+3, D+7, D+30) + oferta de retorno = receita recorrente com custo marginal próximo de zero.",
  },
];

const OPPORTUNITIES: Opportunity[] = [
  {
    canal: "TikTok Orgânico",
    why: "94/100 de oportunidade. 18% de concorrentes ativos. Algoritmo distribui especialização sem custo.",
    action: "4 vídeos/semana de processo real + resultado documentado. Nicho explícito na bio.",
    urgency: "critico",
    gain: "56k impressões/mês · CAC R$22 · janela 3-6 meses",
  },
  {
    canal: "Google SEO Orgânico",
    why: "CAC 73% menor que Ads. Conteúdo indexa em 90 dias. Cresce enquanto dorme.",
    action: "FAQ detalhado + páginas de procedimento + resultado documentado. Mínimo 4 conteúdos/mês.",
    urgency: "critico",
    gain: "28k buscas/mês · CAC R$38 · ROI permanente",
  },
  {
    canal: "WhatsApp / Indicação",
    why: "Conversão de 38%. CAC zero. O canal mais eficiente e o menos explorado do portfólio.",
    action: "Protocolo de indicação pós-resultado: mensagem no D+7 com link de indicação + benefício.",
    urgency: "alto",
    gain: "38% conversão · CAC R$0 · ativa base existente",
  },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

const REC_CONFIG: Record<Recommendation, { label: string; color: string; bg: string }> = {
  invest:  { label: "INVEST",   color: "#ff9500",               bg: "rgba(255,149,0,0.1)"   },
  hold:    { label: "HOLD",     color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.05)" },
  cut:     { label: "CUT",      color: "#ef4444",               bg: "rgba(239,68,68,0.1)"   },
  explore: { label: "EXPLORE",  color: "#a78bfa",               bg: "rgba(167,139,250,0.08)" },
};

const COMP_CONFIG: Record<Competition, { label: string; color: string }> = {
  baixa:    { label: "BAIXA",    color: "#ff9500"               },
  media:    { label: "MÉDIA",    color: "rgba(255,149,0,0.55)"  },
  alta:     { label: "ALTA",     color: "#f97316"               },
  saturada: { label: "SATURADA", color: "#ef4444"               },
};

const TYPE_LABEL: Record<ChannelType, string> = {
  pago:       "PAGO",
  organico:   "ORGÂNICO",
  direto:     "DIRETO",
  referencia: "REFERÊNCIA",
};

const TREND_CONFIG = {
  crescendo: { label: "↑ CRESCENDO", color: "#ff9500"               },
  estavel:   { label: "→ ESTÁVEL",   color: "rgba(255,255,255,0.35)" },
  caindo:    { label: "↓ CAINDO",    color: "#ef4444"               },
};

function RecBadge({ rec }: { rec: Recommendation }) {
  const c = REC_CONFIG[rec];
  return (
    <span style={{
      fontSize: 9, fontWeight: 900, letterSpacing: 1.2,
      color: c.color, background: c.bg,
      border: `1px solid ${c.color}40`,
      borderRadius: 3, padding: "2px 7px",
      fontFamily: "JetBrains Mono, monospace",
    }}>{c.label}</span>
  );
}

function OpportunityBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace", width: 28, flexShrink: 0 }}>{score}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Fluxo() {
  const [activeCanal, setActiveCanal] = useState("C-01");
  const canal = CANAIS.find(c => c.id === activeCanal)!;
  const rec   = REC_CONFIG[canal.recommendation];
  const comp  = COMP_CONFIG[canal.competition];
  const trend = TREND_CONFIG[canal.trend];

  const totalVolume = CANAIS.reduce((s, c) => s + c.volumeK, 0);
  const maxVolume   = Math.max(...CANAIS.map(c => c.volumeK));

  const investCount = CANAIS.filter(c => c.recommendation === "invest").length;
  const cutCount    = CANAIS.filter(c => c.recommendation === "cut").length;

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── SCAN HEADER ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>CANAIS — O MAPA DE FLUXO</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", fontFamily: "JetBrains Mono, monospace" }}>v1.0.0</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {[
              { label: "CANAIS MAPEADOS", value: "8",                                       color: "#ff9500"                },
              { label: "INVEST",          value: String(investCount),                        color: "#ff9500"                },
              { label: "CUT",             value: String(cutCount),                           color: "#ef4444"                },
              { label: "ALCANCE/MÊS",     value: totalVolume + "k",                          color: "rgba(255,255,255,0.55)" },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 1 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOW MAP OVERVIEW ────────────────────────────────────────────── */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>VISÃO GERAL DO FLUXO — VOLUME × SAÚDE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {CANAIS.map(c => {
            const r      = REC_CONFIG[c.recommendation];
            const barPct = (c.volumeK / maxVolume) * 100;
            const isAct  = c.id === activeCanal;
            return (
              <button key={c.id} onClick={() => setActiveCanal(c.id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                background: "transparent", border: "none", cursor: "pointer",
                padding: "3px 0", textAlign: "left",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, width: 36, flexShrink: 0, textAlign: "right",
                  color: isAct ? "#ff9500" : "rgba(255,255,255,0.22)",
                  fontFamily: "JetBrains Mono, monospace",
                }}>{c.id}</span>
                <span style={{
                  fontSize: 12, fontWeight: 600, width: 170, flexShrink: 0,
                  color: isAct ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{c.name}</span>
                {/* Flow bar */}
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", width: `${barPct}%`, borderRadius: 3,
                    background: c.recommendation === "cut"
                      ? "rgba(239,68,68,0.5)"
                      : c.recommendation === "invest"
                      ? "rgba(255,149,0,0.6)"
                      : c.recommendation === "explore"
                      ? "rgba(167,139,250,0.4)"
                      : "rgba(255,255,255,0.15)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, width: 36, flexShrink: 0, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{c.volumeK}k</span>
                <RecBadge rec={c.recommendation} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BODY: canal index + detalhe ──────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Canal index */}
        <div style={{ width: 214, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.16)", fontFamily: "JetBrains Mono, monospace" }}>CANAIS</span>
          </div>
          {CANAIS.map(c => {
            const isActive = c.id === activeCanal;
            const r        = REC_CONFIG[c.recommendation];
            return (
              <button key={c.id} onClick={() => setActiveCanal(c.id)} style={{
                width: "100%", textAlign: "left", display: "block", padding: "10px 14px",
                background: isActive ? "rgba(255,149,0,0.05)" : "transparent",
                borderLeft: `2px solid ${isActive ? "#ff9500" : "transparent"}`,
                borderRight: "none", borderTop: "none",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{c.id}</span>
                  <RecBadge rec={c.recommendation} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 7, color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.38)" }}>{c.name}</div>
                <OpportunityBar score={c.opportunityScore} color={r.color} />
              </button>
            );
          })}
        </div>

        {/* Canal detalhe */}
        <div key={activeCanal} style={{ flex: 1, padding: "22px 26px", animation: "mios-sweep 0.22s ease" }}>

          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{canal.id}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)", borderRadius: 3, padding: "2px 7px", fontFamily: "JetBrains Mono, monospace" }}>{TYPE_LABEL[canal.type]}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: trend.color, border: `1px solid ${trend.color}45`, borderRadius: 3, padding: "2px 7px", fontFamily: "JetBrains Mono, monospace" }}>{trend.label}</span>
            <RecBadge rec={canal.recommendation} />
          </div>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "rgba(255,255,255,0.88)", lineHeight: 1.3, marginBottom: 18 }}>{canal.name}</h2>

          {/* Metrics grid */}
          <div style={{ display: "flex", gap: 0, marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
            {[
              { label: "ALCANCE/MÊS",     value: canal.volumeK + "k",                                       color: "#ff9500"                },
              { label: "CAC",             value: canal.cac === 0 ? "R$0" : `R$${canal.cac}`,                 color: canal.cac < 50 ? "#ff9500" : canal.cac < 150 ? "rgba(255,149,0,0.6)" : "#ef4444" },
              { label: "CONV. RATE",      value: canal.convRate + "%",                                       color: canal.convRate > 5 ? "#ff9500" : "rgba(255,255,255,0.6)"                         },
              { label: "CONCORRÊNCIA",    value: comp.label,                                                 color: comp.color               },
              { label: "PRESENÇA COMP.",  value: canal.compPresence + "%",                                   color: canal.compPresence > 70 ? "#ef4444" : canal.compPresence > 40 ? "#f97316" : "#ff9500" },
              { label: "OPORTUNIDADE",    value: canal.opportunityScore + "/100",                            color: rec.color                },
            ].map(m => (
              <div key={m.label} style={{ padding: "10px 18px 10px 0", minWidth: 120 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Evidence */}
          <div style={{ padding: "14px 18px", background: "rgba(255,149,0,0.03)", border: "1px solid rgba(255,149,0,0.08)", borderLeft: "2px solid rgba(255,149,0,0.35)", borderRadius: "0 6px 6px 0", marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>EVIDÊNCIA DE CANAL</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.75 }}>{canal.evidence}</p>
          </div>

          {/* Implication */}
          <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(255,255,255,0.1)", borderRadius: "0 0 8px 8px" }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>IMPLICAÇÃO ESTRATÉGICA</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>{canal.implication}</p>
          </div>

        </div>
      </div>{/* end body */}

      {/* ── OPORTUNIDADES PRIORITÁRIAS ────────────────────────────────────── */}
      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>OPORTUNIDADES PRIORITÁRIAS</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>CANAIS COM MAIOR RETORNO E MENOR PRESSÃO COMPETITIVA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
          {OPPORTUNITIES.map((o, i) => {
            const isCrit = o.urgency === "critico";
            const col    = isCrit ? "#ef4444" : o.urgency === "alto" ? "#f97316" : "#ff9500";
            return (
              <div key={i} style={{
                padding: "16px 20px",
                background: i === 0 ? "rgba(239,68,68,0.03)" : "rgba(255,255,255,0.016)",
                border: `1px solid ${i === 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)"}`,
                borderLeft: `3px solid ${col}`, borderRadius: "0 8px 8px 0",
              }}>
                <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.82)" }}>{o.canal}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 0.8, color: col, background: `${col}14`, borderRadius: 3, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>
                    {isCrit ? "CRÍTICO" : o.urgency === "alto" ? "ALTO" : "MÉDIO"}
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace" }}>{o.gain}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.44)", lineHeight: 1.68, marginBottom: 10 }}>{o.why}</p>
                <div style={{ padding: "7px 12px", background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.12)", borderRadius: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", marginRight: 8 }}>AÇÃO</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.48)" }}>{o.action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ALOCAÇÃO RECOMENDADA ──────────────────────────────────────────── */}
      <div style={{ padding: "0 24px 56px" }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>REALOCAÇÃO DE BUDGET — MAPA DE DECISÃO</span>
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {[
            { action: "INVEST", channels: ["Google SEO", "TikTok", "WhatsApp/Indicação"], pct: 60, color: "#ff9500",               desc: "Canais orgânicos e diretos com menor CAC e maior potencial de crescimento sustentável." },
            { action: "HOLD",   channels: ["Instagram Orgânico", "YouTube"],              pct: 25, color: "rgba(255,255,255,0.4)", desc: "Presença mínima para credibilidade e prova social. Reduzir frequência, manter qualidade." },
            { action: "CUT",    channels: ["Instagram Ads", "Google Ads genérico"],       pct: 15, color: "#ef4444",               desc: "Budget liberado alimenta canais INVEST. Manter apenas remarketing ultra-segmentado." },
          ].map(b => (
            <div key={b.action} style={{
              flex: 1, minWidth: 200, padding: "16px 18px",
              background: "rgba(255,255,255,0.016)",
              border: `1px solid ${b.color}25`,
              borderTop: `2px solid ${b.color}`,
              borderRadius: "0 0 8px 8px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5, color: b.color, fontFamily: "JetBrains Mono, monospace" }}>{b.action}</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: b.color, fontFamily: "JetBrains Mono, monospace" }}>{b.pct}%</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
                {b.channels.map(ch => (
                  <span key={ch} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono, monospace" }}>· {ch}</span>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 3, padding: "18px 22px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderTop: "2px solid rgba(255,255,255,0.08)", borderRadius: "0 0 8px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>SÍNTESE DO FLUXO</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 680 }}>
            O mercado está pagando caro para competir onde todos estão. Os canais com maior retorno são os menos disputados — e os menos usados.{" "}
            <span style={{ color: "#ff9500" }}>Mover 60% do budget de canais pagos saturados para orgânicos e diretos</span>{" "}
            reduz CAC médio em 68% e cria ativos permanentes que pagos nunca constroem.
          </p>
        </div>
      </div>
    </>
  );
}
