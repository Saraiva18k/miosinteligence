import { useState } from "react";

// ─── Animations ───────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes node-appear {
  0%   { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes gap-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player {
  id:      string;
  name:    string;
  x:       number; // preço 0-100
  y:       number; // valor percebido 0-100
  isTarget: boolean;
  tier:    "commodity" | "medio" | "premium" | "armadilha" | "oculto";
}

interface PriceRow {
  procedure: string;
  alpha:     string;
  centro:    string;
  studio:    string;
  premium:   string;
  media:     string;
  target:    string;
}

interface BalanceItem {
  market:  string;
  client:  string;
  gap:     "alto" | "medio" | "baixo";
}

interface PriceTier {
  name:        string;
  price:       string;
  anchor:      string;
  inclusions:  string[];
  positioning: string;
  color:       string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PLAYERS: Player[] = [
  { id: "P1", name: "Mega Rede",     x: 22, y: 28, isTarget: false, tier: "commodity" },
  { id: "P2", name: "Alpha Clinic",  x: 38, y: 42, isTarget: false, tier: "medio"     },
  { id: "P3", name: "Centro Beauty", x: 68, y: 35, isTarget: false, tier: "armadilha" },
  { id: "P4", name: "Studio Plus",   x: 52, y: 54, isTarget: false, tier: "medio"     },
  { id: "P5", name: "Premium Ref.",  x: 82, y: 76, isTarget: false, tier: "premium"   },
  { id: "TG", name: "→ POSIÇÃO ALVO", x: 62, y: 81, isTarget: true, tier: "oculto"  },
];

const TIER_CONFIG = {
  commodity:  { color: "rgba(255,255,255,0.3)",  label: "COMMODITY"  },
  medio:      { color: "rgba(255,149,0,0.5)",    label: "MÉDIO"      },
  armadilha:  { color: "#ef4444",                label: "ARMADILHA"  },
  premium:    { color: "rgba(255,149,0,0.75)",   label: "PREMIUM"    },
  oculto:     { color: "#ff9500",                label: "OCULTO"     },
};

const PRICE_TABLE: PriceRow[] = [
  { procedure: "Procedimento Base",    alpha: "R$180",  centro: "R$340",  studio: "R$260",  premium: "R$490",  media: "R$318",  target: "R$290"  },
  { procedure: "Protocolo Intensivo",  alpha: "R$420",  centro: "R$680",  studio: "R$530",  premium: "R$920",  media: "R$638",  target: "R$580"  },
  { procedure: "Sessão Completa",      alpha: "R$650",  centro: "R$980",  studio: "R$790",  premium: "R$1.380", media: "R$950", target: "R$860"  },
  { procedure: "Pacote Mensal",        alpha: "R$890",  centro: "N/D",    studio: "R$1.100", premium: "R$2.100", media: "R$1.363", target: "R$1.200" },
  { procedure: "Consulta Inicial",     alpha: "R$0",    centro: "R$150",  studio: "R$80",   premium: "R$200",  media: "R$108",  target: "R$0"    },
];

const BALANCE_ITEMS: BalanceItem[] = [
  { market: "Preço não publicado — cliente descobre no final",          client: "Preço final claro antes de qualquer decisão",           gap: "alto"  },
  { market: "Garantia inexistente — promessa verbal sem compromisso",   client: "Garantia documentada de resultado por escrito",         gap: "alto"  },
  { market: "Pós-atendimento zero — cliente some após pagamento",       client: "Follow-up estruturado D+3, D+7 e D+30 incluído",       gap: "alto"  },
  { market: "Tempo de espera não comunicado nem compensado",            client: "Pontualidade como compromisso — compensação se atrasar", gap: "medio" },
  { market: "Qualidade inconsistente entre profissionais",              client: "Protocolo padronizado com resultado documentado",        gap: "medio" },
];

const PRICE_TIERS: PriceTier[] = [
  {
    name: "Entrada",
    price: "R$260–R$320",
    anchor: "−10% abaixo da média de mercado",
    inclusions: [
      "Procedimento base completo",
      "Resultado documentado (foto padronizada)",
      "Retorno em 30 dias incluso",
    ],
    positioning: "Porta de entrada para novos clientes. Preço abaixo da média com entrega acima — cria referência de valor imediata.",
    color: "rgba(255,149,0,0.5)",
  },
  {
    name: "Completo",
    price: "R$560–R$640",
    anchor: "Média de mercado com entrega superior",
    inclusions: [
      "Protocolo intensivo com 2 sessões",
      "Garantia documentada de resultado",
      "Follow-up D+3, D+7 e D+30",
      "Suporte prioritário por 60 dias",
    ],
    positioning: "Carro-chefe. Preço de mercado com percepção de valor premium — converte o cliente que pesquisa resultado documentado.",
    color: "#ff9500",
  },
  {
    name: "Premium",
    price: "R$1.100–R$1.300",
    anchor: "Premium justificado — abaixo do top 1 do mercado",
    inclusions: [
      "Sessão completa + protocolo exclusivo",
      "Resultado garantido em 2 sessões ou reembolso",
      "Acompanhamento mensal por 90 dias",
      "Acesso prioritário à agenda",
      "Relatório fotográfico completo",
    ],
    positioning: "Posicionamento de autoridade. Preço abaixo do competidor premium com proposta de garantia superior — captura quem quer o melhor mas não encontra justificativa clara.",
    color: "rgba(255,149,0,0.8)",
  },
];

// ─── Positioning Matrix SVG ───────────────────────────────────────────────────

function PositioningMatrix() {
  const W = 100, H = 100; // viewBox percentages
  const PAD = 12;

  // Convert player coords to SVG coords
  const toSVG = (x: number, y: number) => ({
    cx: PAD + (x / 100) * (W - PAD * 2),
    cy: (H - PAD) - (y / 100) * (H - PAD * 2),
  });

  const quadrants = [
    { x: PAD, y: PAD, label: "ALTO VALOR\nPREÇO BAIXO", sub: "zona oculta", color: "rgba(255,149,0,0.06)" },
    { x: W / 2, y: PAD, label: "ALTO VALOR\nPREÇO ALTO", sub: "zona premium", color: "rgba(255,149,0,0.03)" },
    { x: PAD, y: H / 2, label: "BAIXO VALOR\nPREÇO BAIXO", sub: "commodity", color: "rgba(255,255,255,0.015)" },
    { x: W / 2, y: H / 2, label: "BAIXO VALOR\nPREÇO ALTO", sub: "armadilha", color: "rgba(239,68,68,0.04)" },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Quadrant backgrounds */}
      {quadrants.map((q, i) => (
        <rect key={i} x={i % 2 === 0 ? PAD : W / 2} y={i < 2 ? PAD : H / 2}
          width={W / 2 - PAD / 2} height={H / 2 - PAD / 2}
          fill={q.color} rx="1"
        />
      ))}

      {/* Grid lines */}
      <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="1,1" />
      <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="1,1" />

      {/* Axes */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />

      {/* Axis labels */}
      <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="3.5" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono">PREÇO →</text>
      <text x={2.5} y={H / 2} textAnchor="middle" fontSize="3.5" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono" transform={`rotate(-90, 2.5, ${H / 2})`}>VALOR PERCEBIDO →</text>

      {/* Quadrant corner labels */}
      <text x={W / 2 + 2} y={PAD + 4} fontSize="2.8" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono">PREMIUM</text>
      <text x={PAD + 1} y={PAD + 4} fontSize="2.8" fill="rgba(255,149,0,0.5)" fontFamily="JetBrains Mono" fontWeight="bold">OCULTO ★</text>
      <text x={PAD + 1} y={H - PAD - 1} fontSize="2.8" fill="rgba(255,255,255,0.15)" fontFamily="JetBrains Mono">COMMODITY</text>
      <text x={W / 2 + 2} y={H - PAD - 1} fontSize="2.8" fill="rgba(239,68,68,0.6)" fontFamily="JetBrains Mono">ARMADILHA</text>

      {/* Target zone highlight */}
      {(() => {
        const t = toSVG(62, 81);
        return (
          <circle cx={t.cx} cy={t.cy} r="10"
            fill="rgba(255,149,0,0.04)"
            stroke="rgba(255,149,0,0.2)"
            strokeWidth="0.4"
            strokeDasharray="1.5,1"
          />
        );
      })()}

      {/* Players */}
      {PLAYERS.map((p, i) => {
        const { cx, cy } = toSVG(p.x, p.y);
        const cfg = TIER_CONFIG[p.tier];
        const delay = i * 0.12;
        return (
          <g key={p.id} style={{ animation: `node-appear 0.4s ease ${delay}s both` }}>
            {p.isTarget ? (
              <>
                <circle cx={cx} cy={cy} r="2.8" fill="#ff9500" opacity="0.9" />
                <circle cx={cx} cy={cy} r="4.5" fill="none" stroke="#ff9500" strokeWidth="0.5" opacity="0.4" />
                <text x={cx + 4} y={cy + 1} fontSize="3" fill="#ff9500" fontFamily="JetBrains Mono" fontWeight="bold">ALVO</text>
              </>
            ) : (
              <>
                <circle cx={cx} cy={cy} r="2" fill={cfg.color} />
                <text x={cx + 2.5} y={cy + 1} fontSize="2.6" fill="rgba(255,255,255,0.4)" fontFamily="JetBrains Mono">{p.name}</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Balanca() {
  const [activeTab, setActiveTab] = useState<"matrix" | "tabela" | "balanca" | "arquitetura">("matrix");

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── SCAN HEADER ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>PRECIFICAÇÃO — A BALANÇA</span>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.12)", fontFamily: "JetBrains Mono, monospace" }}>v1.0.0</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {[
              { label: "PLAYERS MAPEADOS", value: "5",        color: "#ff9500"                },
              { label: "POSIÇÃO ALVO",     value: "OCULTO",   color: "#ff9500"                },
              { label: "GAP DE VALOR",     value: "CRÍTICO",  color: "#ef4444"                },
              { label: "TIERS PROPOSTOS",  value: "3",        color: "rgba(255,255,255,0.55)" },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 1 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB NAV ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
        {([
          { key: "matrix",       label: "Mapa de Posicionamento" },
          { key: "tabela",       label: "Inteligência de Preços"  },
          { key: "balanca",      label: "A Balança"               },
          { key: "arquitetura",  label: "Arquitetura de Preços"   },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: "10px 20px", fontSize: 10, fontWeight: 700,
            color: activeTab === t.key ? "#ff9500" : "rgba(255,255,255,0.3)",
            borderBottom: `2px solid ${activeTab === t.key ? "#ff9500" : "transparent"}`,
            background: "transparent", border: "none",
            borderBottomStyle: "solid",
            borderBottomWidth: 2,
            borderBottomColor: activeTab === t.key ? "#ff9500" : "transparent",
            cursor: "pointer", whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: MAPA DE POSICIONAMENTO ──────────────────────────────────── */}
      {activeTab === "matrix" && (
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>QUADRANTE DE POSICIONAMENTO</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>PREÇO × VALOR PERCEBIDO — 5 PLAYERS DO MERCADO</span>
          </div>

          {/* Matrix */}
          <div style={{ height: 340, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
            <PositioningMatrix />
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            {Object.entries(TIER_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono, monospace" }}>{cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div style={{ padding: "18px 22px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.12)", borderLeft: "3px solid #ff9500", borderRadius: "0 8px 8px 0" }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>LEITURA DO MAPA</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: 10 }}>
              A zona <span style={{ color: "#ff9500" }}>OCULTO</span> (alto valor, preço médio-alto) está vazia no mercado local. Nenhum player ocupa esse quadrante — todos estão ou no commodity ou pagando caro por baixa entrega.
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
              Posicionamento alvo: preço 10-15% acima da média de mercado com entrega de valor 40-60% superior — garantia documentada, follow-up estruturado, resultado comprovado. O quadrante vazio não exige guerra de preço. Exige prova de valor.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB: INTELIGÊNCIA DE PREÇOS ──────────────────────────────────── */}
      {activeTab === "tabela" && (
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>INTELIGÊNCIA DE PREÇOS</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>COMPARATIVO DE MERCADO POR PROCEDIMENTO</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["PROCEDIMENTO", "MEGA REDE", "ALPHA", "CENTRO", "STUDIO", "PREMIUM REF.", "MÉDIA", "POSIÇÃO ALVO"].map((h, i) => (
                    <th key={h} style={{
                      padding: "8px 14px", textAlign: i === 0 ? "left" : "right",
                      fontSize: 7, fontWeight: 700, letterSpacing: 1.2,
                      color: i === 7 ? "#ff9500" : "rgba(255,255,255,0.25)",
                      fontFamily: "JetBrains Mono, monospace",
                      background: i === 7 ? "rgba(255,149,0,0.05)" : "transparent",
                      borderLeft: i === 7 ? "1px solid rgba(255,149,0,0.15)" : "none",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                    <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{row.procedure}</td>
                    {[row.alpha, row.centro, row.studio, row.studio, row.premium, row.media].map((v, j) => (
                      <td key={j} style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono, monospace" }}>{v}</td>
                    ))}
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", background: "rgba(255,149,0,0.04)", borderLeft: "1px solid rgba(255,149,0,0.12)" }}>{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
              <span style={{ color: "#ff9500", fontWeight: 700 }}>Leitura:</span> Posição alvo está 8-15% abaixo do Premium Ref. e 10-20% acima da média — faixa que permite entrada acessível sem guerra de preço com commodities. A diferença não é no número: é no que está incluso.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB: A BALANÇA ───────────────────────────────────────────────── */}
      {activeTab === "balanca" && (
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>A BALANÇA</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>O QUE O MERCADO ENTREGA VS O QUE O CLIENTE QUER PAGAR</span>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 0, marginBottom: 4 }}>
            <div style={{ padding: "10px 16px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "8px 0 0 0", textAlign: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "#ef4444", fontFamily: "JetBrains Mono, monospace" }}>O QUE O MERCADO ENTREGA</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>GAP</span>
            </div>
            <div style={{ padding: "10px 16px", background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.12)", borderRadius: "0 8px 0 0", textAlign: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>O QUE O CLIENTE VALORIZA</span>
            </div>
          </div>

          {/* Balance rows */}
          {BALANCE_ITEMS.map((item, i) => {
            const gapColor = item.gap === "alto" ? "#ef4444" : item.gap === "medio" ? "#f97316" : "#ff9500";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 0, marginBottom: 2 }}>
                <div style={{
                  padding: "14px 16px",
                  background: "rgba(239,68,68,0.03)",
                  border: "1px solid rgba(239,68,68,0.07)",
                  borderRight: "none",
                }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.55 }}>{item.market}</p>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${gapColor}08`,
                  border: `1px solid ${gapColor}20`,
                  borderLeft: "none", borderRight: "none",
                }}>
                  <span style={{
                    fontSize: 7, fontWeight: 900, color: gapColor,
                    fontFamily: "JetBrains Mono, monospace",
                    animation: item.gap === "alto" ? "gap-pulse 2s infinite" : "none",
                    writingMode: "vertical-rl", textOrientation: "mixed",
                  }}>{item.gap.toUpperCase()}</span>
                </div>
                <div style={{
                  padding: "14px 16px",
                  background: "rgba(255,149,0,0.03)",
                  border: "1px solid rgba(255,149,0,0.07)",
                  borderLeft: "none",
                }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, fontWeight: 500 }}>{item.client}</p>
                </div>
              </div>
            );
          })}

          {/* Synthesis */}
          <div style={{ marginTop: 16, padding: "20px 22px", background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.15)", borderTop: "2px solid #ff9500", borderRadius: "0 0 8px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>LEITURA DA BALANÇA</div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.78)", lineHeight: 1.65 }}>
              O mercado cobra pelo procedimento. O cliente quer pagar pelo <span style={{ color: "#ff9500" }}>resultado com segurança</span>. Quem fechar esse gap primeiro não precisa competir em preço — porque ninguém mais está vendendo o que o cliente realmente quer comprar.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB: ARQUITETURA DE PREÇOS ────────────────────────────────────── */}
      {activeTab === "arquitetura" && (
        <div style={{ padding: "24px 24px 56px" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginRight: 12 }}>ARQUITETURA DE PREÇOS</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>3 TIERS PROPOSTOS — POSICIONAMENTO E JUSTIFICATIVA</span>
          </div>

          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 20 }}>
            {PRICE_TIERS.map((tier, i) => (
              <div key={i} style={{
                flex: 1, minWidth: 220,
                background: "rgba(255,255,255,0.016)",
                border: `1px solid ${tier.color}30`,
                borderTop: `3px solid ${tier.color}`,
                borderRadius: "0 0 8px 8px",
                padding: "20px 18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>TIER {i + 1}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>{tier.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: tier.color, fontFamily: "JetBrains Mono, monospace" }}>{tier.price}</div>
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace" }}>{tier.anchor}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  {tier.inclusions.map((inc, j) => (
                    <div key={j} className="flex items-start gap-2" style={{ marginBottom: 5 }}>
                      <span style={{ color: tier.color, fontSize: 10, flexShrink: 0, marginTop: 1 }}>·</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.52)", lineHeight: 1.45 }}>{inc}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "10px 12px", background: `${tier.color}08`, border: `1px solid ${tier.color}20`, borderRadius: 5 }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.58 }}>{tier.positioning}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "18px 22px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderTop: "2px solid rgba(255,255,255,0.08)", borderRadius: "0 0 8px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>LÓGICA DA ARQUITETURA</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 680 }}>
              Tier 1 captura o cliente novo com preço acessível e entrega superior — cria referência. Tier 2 converte a maioria com o preço do mercado e entrega premium — é o carro-chefe. Tier 3 posiciona autoridade e{" "}
              <span style={{ color: "#ff9500" }}>ancora a percepção de valor do Tier 2</span>, fazendo-o parecer razoável por comparação. Três tiers não são três produtos — são uma estratégia de percepção.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
