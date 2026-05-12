import { useState } from "react";

// ─── Animations ───────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}
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

type Trajectory = "acelerando" | "crescendo" | "estavel" | "resfriando";
type Category   = "comportamento" | "tecnologia" | "economico" | "social" | "canal";

interface Trend {
  id:          string;
  name:        string;
  category:    Category;
  trajectory:  Trajectory;
  momentum:    number;
  change:      string;
  window:      string;
  evidence:    string;
  implication: string;
  sparkData:   number[];
}

interface Convergence {
  trends:  string[];
  title:   string;
  body:    string;
  urgency: "critico" | "alto";
  action:  string;
}

interface UrgencyItem {
  rank:   number;
  id:     string;
  name:   string;
  window: string;
  reason: string;
  color:  string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { label: "CONTEÚDO VIDEO-FIRST",       change: "+312%", dir: "up"   },
  { label: "ADS INTERROMPIDOS",          change: "−34%",  dir: "down" },
  { label: "BUSCA POR VOZ",              change: "+189%", dir: "up"   },
  { label: "PERSONALIZAÇÃO EM ESCALA",   change: "+127%", dir: "up"   },
  { label: "IA GENERATIVA NO CONSUMO",   change: "+440%", dir: "up"   },
  { label: "FIDELIDADE MARCA ÚNICA",     change: "−28%",  dir: "down" },
  { label: "CONSUMO LOCAL ESPECIALIZ.",  change: "+73%",  dir: "up"   },
  { label: "RESULTADO DOCUMENTADO",      change: "+290%", dir: "up"   },
  { label: "CANAL ÚNICO",               change: "−18%",  dir: "down" },
  { label: "MICRO-COMUNIDADES",         change: "+215%", dir: "up"   },
];

const TRENDS: Trend[] = [
  {
    id: "T-01", name: "IA no Processo de Decisão do Consumidor",
    category: "tecnologia", trajectory: "acelerando",
    momentum: 94, change: "+440%", window: "6–12 meses",
    evidence: "Busca assistida por IA cresceu 440% em 18 meses. Consumidores chegam ao primeiro contato com pesquisa prévia profunda — comparam preços, avaliações e resultados antes de clicar. Google SGE, ChatGPT e Perplexity já respondem perguntas de compra diretamente, filtrando quem não aparece.",
    implication: "Quem não tem presença estruturada nos resultados de IA é invisível para 1 em cada 3 compradores em 2026. Conteúdo estruturado — FAQ detalhado, resultado documentado, metodologia explicada — é o novo SEO. Não é opcional.",
    sparkData: [12, 18, 22, 24, 31, 38, 45, 55, 67, 78, 88, 94],
  },
  {
    id: "T-02", name: "Vídeo-First como Canal de Decisão",
    category: "canal", trajectory: "acelerando",
    momentum: 89, change: "+312%", window: "3–6 meses",
    evidence: "Reels e TikTok respondem por 68% das pesquisas pré-compra na faixa 18–45 anos. CTR de vídeo curto supera blog post em 7x para conversão direta. Algoritmos de distribuição amplificam especialização nichada com consistência mínima de 4 vídeos semanais.",
    implication: "Negócios sem estratégia de vídeo curto perdem o canal de maior crescimento antes que sature. Janela de pioneirismo fecha em 3–6 meses — cada semana de atraso é posição de autoridade entregue ao concorrente de graça.",
    sparkData: [22, 28, 33, 38, 45, 52, 60, 68, 74, 80, 86, 89],
  },
  {
    id: "T-03", name: "Resultado Documentado como Padrão de Mercado",
    category: "comportamento", trajectory: "crescendo",
    momentum: 76, change: "+290%", window: "6–9 meses",
    evidence: "Buscas por 'antes e depois' + 'resultado garantido' cresceram 290% em 12 meses. Avaliações genéricas perderam 60% da influência de compra. Taxa de conversão com prova visual documentada é 3.4x maior que sem ela.",
    implication: "Protocolo de documentação de resultado — foto padronizada, termo de garantia, follow-up registrado — vira diferencial agora e padrão obrigatório em 9 meses. Quem chega primeiro define o benchmark. O segundo apenas copia.",
    sparkData: [18, 22, 28, 34, 42, 51, 59, 65, 70, 73, 75, 76],
  },
  {
    id: "T-04", name: "Especialização Nichada Supera Generalismo",
    category: "comportamento", trajectory: "crescendo",
    momentum: 68, change: "+127%", window: "9–18 meses",
    evidence: "Buscas com qualificador específico — 'especialista em X', 'clínica focada em Y' — cresceram 127%. Consumidor paga premium de 40–70% por especialista comprovado vs generalista. Ticket médio de especialistas nichados subiu 2.1x em 24 meses.",
    implication: "Posicionamento nichado com evidência — cases, protocolos, metodologia própria — cria barreira de entrada que o generalista não replica em preço nem em volume. Generalismo vira commodity. Especialização vira monopólio de atenção.",
    sparkData: [30, 33, 37, 42, 46, 51, 55, 59, 62, 65, 67, 68],
  },
  {
    id: "T-05", name: "Micro-Comunidades como Canal de Confiança",
    category: "social", trajectory: "crescendo",
    momentum: 61, change: "+215%", window: "12–18 meses",
    evidence: "Grupos fechados — WhatsApp, Discord, comunidades pagas — respondem por 41% das recomendações de serviço. Recomendação orgânica interna converte 4x mais que anúncio. Custo de aquisição via comunidade própria é 87% menor que tráfego pago.",
    implication: "Comunidade própria construída agora custa 1/10 do que custará em 18 meses — e cria ativo permanente que anúncio nunca substitui. Canal que pertence ao negócio, não à plataforma. Quando o CPL dobrar, quem tem comunidade opera em vantagem absoluta.",
    sparkData: [15, 18, 22, 27, 32, 38, 44, 50, 55, 58, 60, 61],
  },
  {
    id: "T-06", name: "Publicidade de Interrupção Perdendo Tração",
    category: "economico", trajectory: "resfriando",
    momentum: 28, change: "−34%", window: "Já acontecendo",
    evidence: "CPL médio subiu 67% em 24 meses. CTR de display caiu 34%. Bloqueadores de anúncio atingem 42% dos usuários mobile. CPA médio cresceu 89% em 2 anos. Saturação de feed em aceleração — usuário ignora ad antes de ler.",
    implication: "Dependência exclusiva de tráfego pago é armadilha crescente. Canal alternativo — orgânico, comunidade, indicação estruturada — precisa estar em construção agora. Não quando os CPLs tornarem ads inviáveis. O sinal já está aceso.",
    sparkData: [88, 82, 76, 70, 63, 57, 51, 45, 38, 33, 30, 28],
  },
];

const CONVERGENCES: Convergence[] = [
  {
    trends: ["T-01", "T-03"],
    title: "O comprador pesquisa você antes de falar com você",
    body: "IA recupera fotos de resultado, termos de garantia e depoimentos estruturados nos primeiros resultados. Quem documenta aparece — quem não documenta é filtrado antes do primeiro contato. A decisão de compra acontece sem você na sala.",
    urgency: "critico",
    action: "Protocolo de documentação + conteúdo estruturado para SGE: 7 dias para implementar. Zero custo de ferramenta.",
  },
  {
    trends: ["T-02", "T-04"],
    title: "Autoridade em vídeo + nicho profundo = monopolizar atenção sem pagar por ela",
    body: "Especialista que publica processo, método e resultado em vídeo curto cria autoridade que generalistas não competem em preço nem em volume de anúncio. Algoritmo distribui gratuitamente o que o ad cobra caro — e a distribuição orgânica é permanente.",
    urgency: "alto",
    action: "4 vídeos/semana de processo real. Nicho explícito no perfil. Resultado em destaque. 60 dias para posição consolidada.",
  },
  {
    trends: ["T-05", "T-06"],
    title: "Canal próprio agora vs dependência de plataforma depois",
    body: "Cada R$1 investido em comunidade própria hoje substitui R$8–12 de tráfego pago em 18 meses. Anúncio aluga atenção — comunidade a compra em definitivo. Quando os CPLs tornarem ads inviáveis, quem tem canal próprio opera com custo marginal próximo de zero.",
    urgency: "alto",
    action: "Lista de transmissão ativa + grupo de clientes = infraestrutura que ads nunca substituem. Começa com 10 contatos.",
  },
];

const URGENCY_QUEUE: UrgencyItem[] = [
  { rank: 1, id: "T-02", name: "Vídeo-First",           window: "3–6 meses",  reason: "Janela de pioneirismo fechando mais rápido que qualquer outra tendência. Cada semana sem vídeo é posição de autoridade entregue ao concorrente.", color: "#ef4444" },
  { rank: 2, id: "T-03", name: "Resultado Documentado", window: "6–9 meses",  reason: "Vai virar padrão obrigatório do setor. Quem chega primeiro define o benchmark — o segundo é só uma cópia.", color: "#f97316" },
  { rank: 3, id: "T-01", name: "IA no Consumidor",      window: "6–12 meses", reason: "Invisibilidade em buscas assistidas por IA é estrutural — não se resolve com anúncio. Exige construção de conteúdo feita agora.", color: "#ff9500" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function TrendSparkline({ data, trajectory, id }: { data: number[]; trajectory: Trajectory; id: string }) {
  const W = 96, H = 38;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = (v: number) => H - ((v - min) / (max - min || 1)) * H;
  const pts  = data.map((v, i) => `${(i / (data.length - 1)) * W},${norm(v)}`).join(" ");
  const area = `M 0,${H} L ${pts.split(" ").join(" L ")} L ${W},${H} Z`;
  const gradId = `tsg-${id}`;
  const color  = trajectory === "resfriando" ? "#ef4444" : "#ff9500";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path     d={area} fill={`url(#${gradId})`} />
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Ticker() {
  const [activeTrend, setActiveTrend] = useState("T-01");
  const trend = TRENDS.find(t => t.id === activeTrend)!;

  const TRAJ: Record<Trajectory, { label: string; color: string }> = {
    acelerando: { label: "↑↑ ACELERANDO", color: "#ff9500"               },
    crescendo:  { label: "↑  CRESCENDO",  color: "rgba(255,149,0,0.6)"  },
    estavel:    { label: "→  ESTÁVEL",    color: "rgba(255,255,255,0.35)" },
    resfriando: { label: "↓  RESFRIANDO", color: "#ef4444"               },
  };

  const CAT: Record<Category, string> = {
    comportamento: "COMPORTAMENTO",
    tecnologia:    "TECNOLOGIA",
    economico:     "ECONÔMICO",
    social:        "SOCIAL",
    canal:         "CANAL",
  };

  const traj   = TRAJ[trend.trajectory];
  const isDown = trend.trajectory === "resfriando";

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── SCAN HEADER ──────────────────────────────────────────────────── */}
      <div style={{
        padding: "16px 24px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{
              fontSize: 10, fontWeight: 900, letterSpacing: 2,
              color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace",
              animation: "mios-pulse 2s infinite",
            }}>● LIVE</span>
            <span style={{
              fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
              color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace",
            }}>TENDÊNCIAS — O TICKER</span>
            <span style={{
              fontSize: 10, color: "rgba(255,255,255,0.12)",
              fontFamily: "JetBrains Mono, monospace",
            }}>v2.4.1</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {[
              { label: "SINAIS ATIVOS", value: "6",    color: "#ff9500"                 },
              { label: "ACELERANDO",    value: "2",    color: "#ff9500"                 },
              { label: "RESFRIANDO",    value: "1",    color: "#ef4444"                 },
              { label: "HORIZONTE",     value: "18M",  color: "rgba(255,255,255,0.55)"  },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{
                  fontSize: 9, letterSpacing: 1.2,
                  color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 1,
                }}>{m.label}</div>
                <div style={{
                  fontSize: 15, fontWeight: 900,
                  color: m.color, fontFamily: "JetBrains Mono, monospace",
                }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TICKER TAPE ──────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(255,149,0,0.1)",
        background: "rgba(255,149,0,0.025)",
        padding: "7px 0", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 48,
          background: "linear-gradient(to right, #04060f, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 48,
          background: "linear-gradient(to left, #04060f, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{
          display: "flex",
          animation: "ticker-scroll 55s linear infinite",
          width: "max-content", willChange: "transform",
        }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center",
              gap: 5, padding: "0 18px", whiteSpace: "nowrap",
            }}>
              <span style={{
                fontSize: 9, fontWeight: 900,
                color: item.dir === "up" ? "#ff9500" : "#ef4444",
                fontFamily: "JetBrains Mono, monospace",
              }}>{item.dir === "up" ? "▲" : "▼"}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
                color: "rgba(255,255,255,0.42)", fontFamily: "JetBrains Mono, monospace",
              }}>{item.label}</span>
              <span style={{
                fontSize: 11, fontWeight: 900,
                color: item.dir === "up" ? "#ff9500" : "#ef4444",
                fontFamily: "JetBrains Mono, monospace",
              }}>{item.change}</span>
              <span style={{
                fontSize: 10, color: "rgba(255,255,255,0.08)",
                marginLeft: 6, fontFamily: "JetBrains Mono, monospace",
              }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── BODY: index left + detail right ──────────────────────────────── */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>

        {/* Left index */}
        <div style={{
          width: 214, flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{
            padding: "10px 14px 8px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 1.8,
              color: "rgba(255,255,255,0.16)", fontFamily: "JetBrains Mono, monospace",
            }}>SINAIS DE MERCADO</span>
          </div>

          {TRENDS.map(t => {
            const isActive = t.id === activeTrend;
            const tr       = TRAJ[t.trajectory];
            const down     = t.trajectory === "resfriando";
            return (
              <button
                key={t.id}
                onClick={() => setActiveTrend(t.id)}
                style={{
                  width: "100%", textAlign: "left", display: "block",
                  padding: "11px 14px",
                  background: isActive ? "rgba(255,149,0,0.05)" : "transparent",
                  borderLeft: `2px solid ${isActive ? "#ff9500" : "transparent"}`,
                  borderRight: "none", borderTop: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace",
                  }}>{t.id}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 900,
                    color: down ? "#ef4444" : "#ff9500",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>{t.change}</span>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600, lineHeight: 1.35, marginBottom: 8,
                  color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.38)",
                }}>{t.name}</div>
                <div style={{
                  height: 2, background: "rgba(255,255,255,0.05)",
                  borderRadius: 1, overflow: "hidden", marginBottom: 4,
                }}>
                  <div style={{
                    height: "100%", width: `${t.momentum}%`,
                    background: down ? "#ef4444" : "#ff9500",
                    borderRadius: 1,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: tr.color, fontFamily: "JetBrains Mono, monospace",
                  }}>{tr.label}</span>
                  <span style={{
                    fontSize: 9, color: "rgba(255,255,255,0.15)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>{t.momentum}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right detail */}
        <div
          key={activeTrend}
          style={{ flex: 1, padding: "22px 26px", animation: "mios-sweep 0.22s ease" }}
        >
          {/* Trend header */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 10 }}>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace",
            }}>{trend.id}</span>
            <span style={{
              fontSize: 9, fontWeight: 900, letterSpacing: 1.2,
              color: traj.color, border: `1px solid ${traj.color}45`,
              background: `${traj.color}10`,
              backdropFilter: "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              borderRadius: 3, padding: "2px 7px",
              fontFamily: "JetBrains Mono, monospace",
            }}>{traj.label}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
              color: "rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 3, padding: "2px 7px",
              fontFamily: "JetBrains Mono, monospace",
            }}>{CAT[trend.category]}</span>
          </div>

          <h2 style={{
            fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 18,
            color: "rgba(255,255,255,0.88)",
          }}>{trend.name}</h2>

          {/* Metrics + sparkline */}
          <div
            className="flex items-center gap-8 flex-wrap"
            style={{
              marginBottom: 20, paddingBottom: 18,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <TrendSparkline data={trend.sparkData} trajectory={trend.trajectory} id={trend.id} />
            {[
              { label: "VARIAÇÃO 18M",   value: trend.change,            color: isDown ? "#ef4444" : "#ff9500"          },
              { label: "MOMENTUM",       value: `${trend.momentum}/100`, color: "rgba(255,255,255,0.62)"                 },
              { label: "JANELA",         value: trend.window,            color: "rgba(255,255,255,0.42)"                 },
            ].map(m => (
              <div key={m.label}>
                <div style={{
                  fontSize: 9, letterSpacing: 1.2,
                  color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 3,
                }}>{m.label}</div>
                <div style={{
                  fontSize: 17, fontWeight: 900,
                  color: m.color, fontFamily: "JetBrains Mono, monospace",
                }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Evidence block */}
          <div style={{
            padding: "15px 18px",
            background: "rgba(255,149,0,0.04)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255,149,0,0.1)",
            borderLeft: "2px solid rgba(255,149,0,0.4)",
            borderRadius: "0 6px 6px 0",
            marginBottom: 10,
          }}>
            <div style={{
              fontSize: 9, fontWeight: 900, letterSpacing: 1.5,
              color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8,
            }}>EVIDÊNCIA DE MERCADO</div>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.75,
            }}>{trend.evidence}</p>
          </div>

          {/* Implication block */}
          <div style={{
            padding: "15px 18px",
            background: "rgba(0,0,0,0.28)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderTop: "2px solid rgba(255,255,255,0.1)",
            borderRadius: "0 0 8px 8px",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 900, letterSpacing: 1.5,
              color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8,
            }}>IMPLICAÇÃO ESTRATÉGICA</div>
            <p style={{
              fontSize: 13, fontWeight: 600, lineHeight: 1.65,
              color: "rgba(255,255,255,0.7)",
            }}>{trend.implication}</p>
          </div>
        </div>

      </div>{/* end body */}

      {/* ── CONVERGENCE PANEL ────────────────────────────────────────────── */}
      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{
            fontSize: 10, fontWeight: 900, letterSpacing: 2,
            color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace",
            marginRight: 12,
          }}>PONTOS DE CONVERGÊNCIA</span>
          <span style={{
            fontSize: 9, color: "rgba(255,255,255,0.18)",
            fontFamily: "JetBrains Mono, monospace",
          }}>ONDE TENDÊNCIAS SE CRUZAM E CRIAM JANELAS ÚNICAS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
          {CONVERGENCES.map((c, i) => {
            const isCrit = c.urgency === "critico";
            const col    = isCrit ? "#ef4444" : "#f97316";
            return (
              <div key={i} style={{
                background: i === 0
                  ? (isCrit ? "rgba(239,68,68,0.04)" : "rgba(249,115,22,0.03)")
                  : "rgba(255,255,255,0.016)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                border: `1px solid ${i < 1
                  ? (isCrit ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.1)")
                  : "rgba(255,255,255,0.05)"}`,
                borderLeft: `3px solid ${col}`,
                borderRadius: "0 8px 8px 0",
                padding: "16px 20px",
              }}>
                {/* Signal refs + badge */}
                <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
                  {c.trends.map(tid => (
                    <span key={tid} style={{
                      fontSize: 9, fontWeight: 700,
                      color: "rgba(255,149,0,0.65)",
                      background: "rgba(255,149,0,0.07)",
                      borderRadius: 3, padding: "2px 6px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}>{tid}</span>
                  ))}
                  <span style={{
                    fontSize: 9, fontWeight: 900, letterSpacing: 0.8,
                    color: col, background: `${col}14`,
                    borderRadius: 3, padding: "2px 6px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>{isCrit ? "CRÍTICO" : "ALTO"}</span>
                </div>

                <h3 style={{
                  fontSize: 13, fontWeight: 800, lineHeight: 1.4, marginBottom: 8,
                  color: "rgba(255,255,255,0.82)",
                }}>{c.title}</h3>

                <p style={{
                  fontSize: 13, color: "rgba(255,255,255,0.44)", lineHeight: 1.72, marginBottom: 10,
                }}>{c.body}</p>

                <div style={{
                  padding: "8px 12px",
                  background: "rgba(255,149,0,0.05)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  border: "1px solid rgba(255,149,0,0.12)",
                  borderRadius: 4,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 900, letterSpacing: 1,
                    color: "#ff9500", fontFamily: "JetBrains Mono, monospace", marginRight: 8,
                  }}>AÇÃO</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.48)" }}>{c.action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── URGENCY QUEUE ────────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px 56px" }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{
            fontSize: 10, fontWeight: 900, letterSpacing: 2,
            color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace",
          }}>FILA DE URGÊNCIA — PRÓXIMOS 90 DIAS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {URGENCY_QUEUE.map(u => (
            <div key={u.id} style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              padding: "14px 18px",
              background: "rgba(255,255,255,0.016)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderLeft: `3px solid ${u.color}`,
              borderRadius: "0 6px 6px 0",
            }}>
              <div style={{
                flexShrink: 0, width: 32, height: 32,
                borderRadius: 6,
                background: `${u.color}14`,
                backdropFilter: "blur(12px) saturate(160%)",
                WebkitBackdropFilter: "blur(12px) saturate(160%)",
                border: `1px solid ${u.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontSize: 15, fontWeight: 900,
                  color: u.color, fontFamily: "JetBrains Mono, monospace",
                }}>{u.rank}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>{u.name}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: u.color, background: `${u.color}12`,
                    borderRadius: 3, padding: "2px 6px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>{u.id}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: "rgba(255,255,255,0.22)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>JANELA: {u.window}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.62 }}>{u.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}
