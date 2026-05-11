import { useState } from "react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes scale-tilt {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(-8deg); }
}
@keyframes node-pop {
  0%   { opacity: 0; r: 0; }
  60%  { opacity: 1; r: 5; }
  100% { opacity: 1; r: 3.5; }
}
@keyframes bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes gap-blink {
  0%, 100% { opacity: 0.8; }
  50%       { opacity: 1; box-shadow: 0 0 12px rgba(239,68,68,0.6); }
}
@keyframes tier-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sweep-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "mapa" | "precos" | "balanca" | "tiers";

interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  isTarget: boolean;
  zone: "commodity" | "medio" | "premium" | "armadilha" | "oculto";
}

interface PriceBar {
  label: string;
  min: number;
  max: number;
  avg: number;
  target: number;
  isTarget?: boolean;
}

interface GapRow {
  dimension: string;
  market: string;
  client: string;
  gap: "CRÍTICO" | "ALTO" | "MÉDIO";
}

interface Tier {
  number: number;
  name: string;
  range: string;
  anchor: string;
  share: number; // expected revenue %
  items: string[];
  tagline: string;
  color: string;
  dimColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAYERS: Player[] = [
  { id: "P1", name: "Mega Rede",     x: 22, y: 28, isTarget: false, zone: "commodity" },
  { id: "P2", name: "Alpha Clinic",  x: 38, y: 42, isTarget: false, zone: "medio"     },
  { id: "P3", name: "Centro Beauty", x: 68, y: 35, isTarget: false, zone: "armadilha" },
  { id: "P4", name: "Studio Plus",   x: 52, y: 54, isTarget: false, zone: "medio"     },
  { id: "P5", name: "Premium Ref.",  x: 82, y: 76, isTarget: false, zone: "premium"   },
  { id: "TG", name: "POSIÇÃO ALVO",  x: 62, y: 82, isTarget: true,  zone: "oculto"    },
];

const ZONE_STYLE: Record<string, { color: string; label: string; bg: string }> = {
  commodity:  { color: "rgba(255,255,255,0.4)",  label: "COMMODITY",  bg: "rgba(255,255,255,0.015)" },
  medio:      { color: "rgba(255,149,0,0.55)",   label: "MÉDIO",      bg: "rgba(255,149,0,0.02)"   },
  armadilha:  { color: "#ef4444",                label: "ARMADILHA",  bg: "rgba(239,68,68,0.04)"   },
  premium:    { color: "rgba(255,149,0,0.85)",   label: "PREMIUM",    bg: "rgba(255,149,0,0.04)"   },
  oculto:     { color: "#ff9500",                label: "OCULTO",     bg: "rgba(255,149,0,0.08)"   },
};

const PRICE_BARS: PriceBar[] = [
  { label: "Procedimento Base",   min: 150, max: 520,  avg: 318,  target: 290  },
  { label: "Protocolo Intensivo", min: 380, max: 950,  avg: 638,  target: 580  },
  { label: "Sessão Completa",     min: 600, max: 1450, avg: 950,  target: 860  },
  { label: "Pacote Mensal",       min: 850, max: 2200, avg: 1363, target: 1200 },
  { label: "Consulta Inicial",    min: 0,   max: 250,  avg: 108,  target: 0,   isTarget: true },
];

const GAP_ROWS: GapRow[] = [
  { dimension: "Transparência",  market: "Preço revelado apenas na finalização",           client: "Preço total antes da decisão",                    gap: "CRÍTICO" },
  { dimension: "Garantia",       market: "Promessa verbal — sem compromisso escrito",       client: "Garantia documentada de resultado",               gap: "CRÍTICO" },
  { dimension: "Pós-venda",      market: "Contato zero após pagamento",                    client: "Follow-up D+3, D+7 e D+30 incluído",              gap: "CRÍTICO" },
  { dimension: "Pontualidade",   market: "Atraso não comunicado, nunca compensado",         client: "Pontualidade garantida ou compensação",           gap: "ALTO"    },
  { dimension: "Consistência",   market: "Resultado varia por profissional",               client: "Protocolo padronizado — resultado documentado",   gap: "ALTO"    },
];

const TIERS: Tier[] = [
  {
    number: 1,
    name: "Entrada",
    range: "R$260 – R$320",
    anchor: "−12% da média de mercado",
    share: 25,
    items: ["Procedimento base completo", "Foto padronizada de resultado", "Retorno em 30 dias"],
    tagline: "Porta de entrada. Preço menor, entrega maior — cria referência e confiança.",
    color: "#ff9500",
    dimColor: "rgba(255,149,0,0.45)",
  },
  {
    number: 2,
    name: "Completo",
    range: "R$560 – R$640",
    anchor: "Média de mercado + entrega premium",
    share: 55,
    items: ["Protocolo intensivo — 2 sessões", "Garantia documentada de resultado", "Follow-up D+3, D+7, D+30", "Suporte prioritário por 60 dias"],
    tagline: "Carro-chefe. Converte quem pesquisa valor — é aqui que a receita acontece.",
    color: "#ff9500",
    dimColor: "rgba(255,149,0,0.55)",
  },
  {
    number: 3,
    name: "Premium",
    range: "R$1.100 – R$1.300",
    anchor: "Abaixo do top-1 do mercado",
    share: 20,
    items: ["Sessão completa + protocolo exclusivo", "Garantia total ou reembolso", "Acompanhamento mensal 90 dias", "Acesso prioritário à agenda", "Relatório fotográfico completo"],
    tagline: "Âncora de percepção. Faz o Tier 2 parecer razoável por comparação.",
    color: "#ff9500",
    dimColor: "rgba(255,149,0,0.7)",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MapaTab() {
  const W = 100, H = 100, PAD = 10;
  const toSVG = (x: number, y: number) => ({
    cx: PAD + (x / 100) * (W - PAD * 2),
    cy: (H - PAD) - (y / 100) * (H - PAD * 2),
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, padding: "24px", animation: "sweep-in 0.3s ease" }}>
      {/* Matrix */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace" }}>QUADRANTE PREÇO × VALOR PERCEBIDO</span>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginLeft: 12 }}>5 PLAYERS DO MERCADO + POSIÇÃO ALVO</span>
        </div>
        <div style={{ aspectRatio: "1 / 1", maxHeight: 420, background: "rgba(4,6,15,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
            {/* Zone backgrounds */}
            <rect x={PAD} y={PAD} width={W/2-PAD/2} height={H/2-PAD/2} fill="rgba(255,149,0,0.05)" rx="1" />
            <rect x={W/2} y={PAD} width={W/2-PAD} height={H/2-PAD/2} fill="rgba(255,149,0,0.02)" rx="1" />
            <rect x={PAD} y={H/2} width={W/2-PAD/2} height={H/2-PAD} fill="rgba(255,255,255,0.01)" rx="1" />
            <rect x={W/2} y={H/2} width={W/2-PAD} height={H/2-PAD} fill="rgba(239,68,68,0.04)" rx="1" />

            {/* Zone labels */}
            <text x={PAD+1} y={PAD+5} fontSize="3.2" fill="rgba(255,149,0,0.7)" fontFamily="JetBrains Mono" fontWeight="bold">OCULTO ★</text>
            <text x={PAD+1} y={PAD+8.5} fontSize="2.4" fill="rgba(255,149,0,0.35)" fontFamily="JetBrains Mono">zona vazia — oportunidade</text>
            <text x={W/2+2} y={PAD+5} fontSize="3.2" fill="rgba(255,255,255,0.25)" fontFamily="JetBrains Mono">PREMIUM</text>
            <text x={PAD+1} y={H-PAD-2} fontSize="3.2" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono">COMMODITY</text>
            <text x={W/2+2} y={H-PAD-2} fontSize="3.2" fill="rgba(239,68,68,0.65)" fontFamily="JetBrains Mono">ARMADILHA</text>

            {/* Grid */}
            <line x1={W/2} y1={PAD} x2={W/2} y2={H-PAD} stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" strokeDasharray="1.5,1" />
            <line x1={PAD} y1={H/2} x2={W-PAD} y2={H/2} stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" strokeDasharray="1.5,1" />

            {/* Axes */}
            <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
            <text x={W/2} y={H-1.5} textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono">PREÇO →</text>
            <text x={2.5} y={H/2} textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono" transform={`rotate(-90, 2.5, ${H/2})`}>VALOR PERCEBIDO →</text>

            {/* Target zone halo */}
            {(() => { const t = toSVG(62, 82); return (
              <circle cx={t.cx} cy={t.cy} r="11" fill="rgba(255,149,0,0.06)" stroke="rgba(255,149,0,0.25)" strokeWidth="0.5" strokeDasharray="2,1.5" />
            ); })()}

            {/* Players */}
            {PLAYERS.map((p, i) => {
              const { cx, cy } = toSVG(p.x, p.y);
              const zs = ZONE_STYLE[p.zone];
              const delay = i * 0.08;
              if (p.isTarget) return (
                <g key={p.id} style={{ animation: `node-pop 0.5s ease ${delay}s both` }}>
                  <circle cx={cx} cy={cy} r="3.8" fill="#ff9500" opacity="0.95" />
                  <circle cx={cx} cy={cy} r="6" fill="none" stroke="#ff9500" strokeWidth="0.6" opacity="0.5" />
                  <text x={cx+4.5} y={cy+1} fontSize="3.2" fill="#ff9500" fontFamily="JetBrains Mono" fontWeight="bold">ALVO</text>
                </g>
              );
              return (
                <g key={p.id} style={{ animation: `node-pop 0.5s ease ${delay}s both` }}>
                  <circle cx={cx} cy={cy} r="2.5" fill={zs.color} />
                  <text x={cx+3} y={cy+1} fontSize="2.6" fill="rgba(255,255,255,0.38)" fontFamily="JetBrains Mono">{p.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Zone legend */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "16px" }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>ZONAS DO MAPA</div>
          {Object.entries(ZONE_STYLE).map(([key, zs]) => (
            <div key={key} className="flex items-center gap-3" style={{ marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: zs.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: zs.color, fontFamily: "JetBrains Mono, monospace" }}>{zs.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Insight card */}
        <div style={{ flex: 1, background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.15)", borderLeft: "3px solid #ff9500", borderRadius: "0 8px 8px 0", padding: "18px 16px" }}>
          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>LEITURA DO MAPA</div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 12 }}>
            A zona <span style={{ color: "#ff9500" }}>OCULTO</span> está vazia.
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>
            Nenhum player local ocupa o quadrante alto valor + preço médio-alto. Todos estão ou no commodity ou cobrando caro por baixa entrega. O quadrante vazio não pede guerra de preço — pede prova de valor.
          </p>
        </div>

        {/* Player count */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "PLAYERS", value: "5",       color: "rgba(255,255,255,0.55)" },
            { label: "ZONA VAZIA", value: "1",     color: "#ff9500" },
            { label: "ARMADILHAS", value: "1",     color: "#ef4444" },
            { label: "GAP DE VALOR", value: "↑40%", color: "#ff9500" },
          ].map(m => (
            <div key={m.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrecosTab() {
  const MAX_PRICE = 2400;
  return (
    <div style={{ padding: "24px", animation: "sweep-in 0.3s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace" }}>INTELIGÊNCIA DE PREÇOS</span>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginLeft: 12 }}>AMPLITUDE DE MERCADO POR PROCEDIMENTO</span>
      </div>

      {/* Scale header */}
      <div style={{ display: "flex", gap: 0, marginBottom: 4, paddingLeft: 200 }}>
        {[0, 25, 50, 75, 100].map(p => (
          <div key={p} style={{ flex: 1, textAlign: "center", fontSize: 7, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace" }}>
            R${Math.round(MAX_PRICE * p / 100).toLocaleString("pt-BR")}
          </div>
        ))}
      </div>

      {PRICE_BARS.map((bar, i) => {
        const minPct  = (bar.min  / MAX_PRICE) * 100;
        const maxPct  = (bar.max  / MAX_PRICE) * 100;
        const avgPct  = (bar.avg  / MAX_PRICE) * 100;
        const tgtPct  = (bar.target / MAX_PRICE) * 100;
        const delay   = i * 0.06;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            {/* Label */}
            <div style={{ width: 188, flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{bar.label}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>média R${bar.avg.toLocaleString("pt-BR")}</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>
                  {bar.isTarget ? "GRÁTIS" : `alvo R$${bar.target.toLocaleString("pt-BR")}`}
                </span>
              </div>
            </div>

            {/* Track */}
            <div style={{ flex: 1, position: "relative", height: 32 }}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(p => (
                <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)" }} />
              ))}

              {/* Market range bar */}
              <div style={{
                position: "absolute",
                left: `${minPct}%`,
                width: `${maxPct - minPct}%`,
                top: "50%",
                height: 10,
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 5,
                transformOrigin: "left center",
                animation: `bar-grow 0.5s ease ${delay}s both`,
              }} />

              {/* Avg marker */}
              <div style={{
                position: "absolute",
                left: `${avgPct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 2,
                height: 22,
                background: "rgba(255,255,255,0.3)",
                borderRadius: 1,
              }} />

              {/* Target marker */}
              {bar.target > 0 && (
                <div style={{
                  position: "absolute",
                  left: `${tgtPct}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  <div style={{ width: 3, height: 26, background: "#ff9500", borderRadius: 1.5, boxShadow: "0 0 8px rgba(255,149,0,0.5)" }} />
                </div>
              )}

              {/* Min/max labels */}
              <div style={{ position: "absolute", left: `${minPct}%`, top: "100%", marginTop: 2, fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", transform: "translateX(-50%)" }}>
                {bar.min === 0 ? "0" : `R$${bar.min}`}
              </div>
              <div style={{ position: "absolute", left: `${maxPct}%`, top: "100%", marginTop: 2, fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", transform: "translateX(-50%)" }}>
                R${bar.max.toLocaleString("pt-BR")}
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginTop: 24, padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6 }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>Amplitude do mercado</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 2, height: 18, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>Média de mercado</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 3, height: 18, background: "#ff9500", borderRadius: 1.5, boxShadow: "0 0 8px rgba(255,149,0,0.4)" }} />
          <span style={{ fontSize: 9, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>Posição alvo</span>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: "14px 18px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.12)", borderLeft: "3px solid #ff9500", borderRadius: "0 6px 6px 0" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
          <span style={{ color: "#ff9500", fontWeight: 700 }}>Estratégia:</span> Posição alvo fica 8–15% abaixo do Premium Ref. e 10–20% acima da média — diferencial está no <em>o que está incluso</em>, não apenas no número.
        </p>
      </div>
    </div>
  );
}

function BalancaTab() {
  const gapStyle: Record<string, { color: string; bg: string }> = {
    "CRÍTICO": { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
    "ALTO":    { color: "#f97316", bg: "rgba(249,115,22,0.1)"  },
    "MÉDIO":   { color: "#ff9500", bg: "rgba(255,149,0,0.1)"   },
  };

  return (
    <div style={{ padding: "24px", animation: "sweep-in 0.3s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace" }}>A BALANÇA</span>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginLeft: 12 }}>O QUE O MERCADO ENTREGA vs. O QUE O CLIENTE QUER</span>
      </div>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr", marginBottom: 3 }}>
        <div style={{ padding: "12px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px 0 0 0", textAlign: "center" }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 1.5, color: "#ef4444", fontFamily: "JetBrains Mono, monospace" }}>MERCADO ENTREGA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: "none", borderRight: "none" }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>GAP</span>
        </div>
        <div style={{ padding: "12px 18px", background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.15)", borderRadius: "0 8px 0 0", textAlign: "center" }}>
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 1.5, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>CLIENTE QUER</span>
        </div>
      </div>

      {GAP_ROWS.map((row, i) => {
        const gs = gapStyle[row.gap];
        const isCritical = row.gap === "CRÍTICO";
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr", marginBottom: 3 }}>
            {/* Market side */}
            <div style={{
              padding: "16px 18px",
              background: "rgba(239,68,68,0.025)",
              border: "1px solid rgba(239,68,68,0.08)",
              borderRight: "none",
              borderTop: i > 0 ? "none" : undefined,
            }}>
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 5 }}>{row.dimension}</div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>{row.market}</p>
            </div>

            {/* Gap column */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: gs.bg,
              border: `1px solid ${gs.color}25`,
              borderLeft: "none", borderRight: "none",
              borderTop: i > 0 ? "none" : undefined,
            }}>
              <div style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: 8, fontWeight: 900,
                color: gs.color,
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: 2,
                animation: isCritical ? "gap-blink 1.8s infinite" : "none",
              }}>{row.gap}</div>
            </div>

            {/* Client side */}
            <div style={{
              padding: "16px 18px",
              background: "rgba(255,149,0,0.025)",
              border: "1px solid rgba(255,149,0,0.08)",
              borderLeft: "none",
              borderTop: i > 0 ? "none" : undefined,
            }}>
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 5 }}>{row.dimension}</div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>{row.client}</p>
            </div>
          </div>
        );
      })}

      {/* GAP count */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "16px 0" }}>
        {[
          { label: "CRÍTICO", count: GAP_ROWS.filter(r => r.gap === "CRÍTICO").length, color: "#ef4444" },
          { label: "ALTO",    count: GAP_ROWS.filter(r => r.gap === "ALTO").length,    color: "#f97316" },
          { label: "MÉDIO",   count: GAP_ROWS.filter(r => r.gap === "MÉDIO").length,   color: "#ff9500" },
        ].map(g => (
          <div key={g.label} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${g.color}25`, borderTop: `2px solid ${g.color}`, borderRadius: "0 0 6px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: g.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{g.count}</div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: `${g.color}80`, fontFamily: "JetBrains Mono, monospace", marginTop: 4 }}>GAP {g.label}</div>
          </div>
        ))}
      </div>

      {/* Synthesis */}
      <div style={{ padding: "20px 24px", background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.18)", borderTop: "2px solid #ff9500", borderRadius: "0 0 8px 8px" }}>
        <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>VEREDITO DA BALANÇA</div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.78)", lineHeight: 1.65 }}>
          O mercado cobra pelo procedimento. O cliente quer pagar pelo <span style={{ color: "#ff9500" }}>resultado com segurança</span>. Quem fechar esse gap primeiro domina o preço sem competir.
        </p>
      </div>
    </div>
  );
}

function TiersTab() {
  return (
    <div style={{ padding: "24px 24px 48px", animation: "sweep-in 0.3s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace" }}>ARQUITETURA DE PREÇOS</span>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginLeft: 12 }}>3 TIERS — ESTRATÉGIA DE PERCEPÇÃO DE VALOR</span>
      </div>

      {/* Tier cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {TIERS.map((tier, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.018)",
            border: `1px solid rgba(255,149,0,${0.15 + i * 0.08})`,
            borderTop: `3px solid ${tier.dimColor}`,
            borderRadius: "0 0 10px 10px",
            padding: "20px 18px 22px",
            animation: `tier-rise 0.4s ease ${i * 0.1}s both`,
          }}>
            {/* Tier number + name */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>TIER {tier.number}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.88)" }}>{tier.name}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `rgba(255,149,0,${0.1 + i * 0.05})`,
                border: `1.5px solid ${tier.dimColor}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 900, color: tier.dimColor,
                fontFamily: "JetBrains Mono, monospace",
              }}>{tier.number}</div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: tier.color, fontFamily: "JetBrains Mono, monospace", letterSpacing: -0.5 }}>{tier.range}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>{tier.anchor}</div>
            </div>

            {/* Revenue share bar */}
            <div style={{ margin: "14px 0", padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>MIX DE RECEITA</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: tier.dimColor, fontFamily: "JetBrains Mono, monospace" }}>{tier.share}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${tier.share}%`,
                  background: tier.dimColor,
                  borderRadius: 2,
                  animation: `bar-grow 0.6s ease ${0.3 + i * 0.1}s both`,
                  transformOrigin: "left",
                }} />
              </div>
            </div>

            {/* Inclusions */}
            <div style={{ marginBottom: 14 }}>
              {tier.items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                  <span style={{ color: tier.dimColor, fontSize: 10, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>+</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <div style={{ padding: "10px 12px", background: `rgba(255,149,0,${0.04 + i * 0.02})`, border: `1px solid rgba(255,149,0,${0.12 + i * 0.04})`, borderRadius: 5 }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontStyle: "italic" }}>{tier.tagline}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue mix visual */}
      <div style={{ marginBottom: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "18px 20px" }}>
        <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>MIX DE RECEITA PROJETADO</div>
        <div style={{ height: 24, borderRadius: 6, overflow: "hidden", display: "flex" }}>
          {TIERS.map((tier, i) => (
            <div key={i} style={{
              flex: tier.share,
              background: `rgba(255,149,0,${0.3 + i * 0.2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: `bar-grow 0.7s ease ${i * 0.08}s both`,
              transformOrigin: "left",
            }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.9)", fontFamily: "JetBrains Mono, monospace" }}>{tier.share}%</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {TIERS.map((tier, i) => (
            <span key={i} style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>Tier {i+1}: {tier.name}</span>
          ))}
        </div>
      </div>

      {/* Logic */}
      <div style={{ padding: "20px 24px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(255,255,255,0.08)", borderRadius: "0 0 8px 8px" }}>
        <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>LÓGICA DA ARQUITETURA</div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 700 }}>
          Três tiers não são três produtos — são uma <span style={{ color: "#ff9500" }}>estratégia de percepção</span>. O Tier 3 existe para fazer o Tier 2 parecer razoável por comparação. O Tier 1 existe para dar a primeira experiência sem risco. A receita acontece no meio.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Balanca() {
  const [activeTab, setActiveTab] = useState<Tab>("mapa");

  const TABS: { key: Tab; label: string; badge?: string }[] = [
    { key: "mapa",    label: "Mapa de Posicionamento" },
    { key: "precos",  label: "Inteligência de Preços"  },
    { key: "balanca", label: "A Balança",   badge: "3 CRÍTICOS" },
    { key: "tiers",   label: "Arquitetura de Preços"   },
  ];

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>PRECIFICAÇÃO — A BALANÇA</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "PLAYERS",      value: "5",       color: "rgba(255,255,255,0.55)" },
              { label: "ZONA VAZIA",   value: "1",       color: "#ff9500"                },
              { label: "GAPS CRÍTICOS",value: "3",       color: "#ef4444"                },
              { label: "TIERS ALVO",   value: "3",       color: "#ff9500"                },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB NAV ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "11px 22px",
              fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              color: activeTab === t.key ? "#ff9500" : "rgba(255,255,255,0.28)",
              background: activeTab === t.key ? "rgba(255,149,0,0.04)" : "transparent",
              border: "none",
              borderBottom: `2px solid ${activeTab === t.key ? "#ff9500" : "transparent"}`,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {t.label}
            {t.badge && (
              <span style={{
                fontSize: 7, fontWeight: 900, padding: "2px 6px",
                background: "rgba(239,68,68,0.15)", color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.3)", borderRadius: 3,
                fontFamily: "JetBrains Mono, monospace",
              }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────────────────────── */}
      {activeTab === "mapa"    && <MapaTab    key="mapa"    />}
      {activeTab === "precos"  && <PrecosTab  key="precos"  />}
      {activeTab === "balanca" && <BalancaTab key="balanca" />}
      {activeTab === "tiers"   && <TiersTab   key="tiers"   />}
    </>
  );
}
