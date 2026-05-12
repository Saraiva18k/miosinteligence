import { useState } from "react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes card-appear {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes detail-slide {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes dot-blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}
@keyframes node-appear {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
`;

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Stage = "hipotese" | "prototipagem" | "teste" | "validado";

interface Experiment {
  id:         string;
  title:      string;
  stage:      Stage;
  hypothesis: string;
  method:     string;
  metric:     string | null;   // key result so far
  result:     string | null;   // null if still running
  impact:     number;          // 1–10
  effort:     number;          // 1–10
  tags:       string[];
  weeks:      number;          // time in stage
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "EXP-01",
    title: "Garantia Documentada",
    stage: "validado",
    hypothesis: "Oferecer garantia por escrito antes do procedimento aumenta conversão e elimina objeção de risco.",
    method: "A/B: 60 clientes com garantia formal escrita vs. 60 sem. Acompanhamento 30 dias.",
    metric: "+34% conversão no grupo com garantia",
    result: "Confirmado. Garantia reduz fricção de decisão e aumenta ticket médio em 18%.",
    impact: 9, effort: 2, tags: ["conversão", "confiança", "ticket"],
    weeks: 8,
  },
  {
    id: "EXP-02",
    title: "Follow-up D+3 Estruturado",
    stage: "validado",
    hypothesis: "Contato ativo no 3º dia pós-procedimento aumenta retenção e gera indicações espontâneas.",
    method: "Sequência de 3 contatos (D+3, D+7, D+30) via WhatsApp com script padronizado.",
    metric: "+41% taxa de retorno em 60 dias",
    result: "Confirmado. D+3 é o momento crítico — cliente ainda sente o resultado e está propenso a indicar.",
    impact: 8, effort: 3, tags: ["retenção", "indicação", "NPS"],
    weeks: 12,
  },
  {
    id: "EXP-03",
    title: "Consulta Diagnóstica Grátis",
    stage: "teste",
    hypothesis: "Consulta inicial sem custo como porta de entrada reduz barreira de primeiro contato e aumenta conversão para procedimento.",
    method: "30 dias de teste: oferecer consulta de 20min sem cobrar. Medir taxa de conversão pós-consulta.",
    metric: "67% de conversão para procedimento pago (n=24)",
    result: null,
    impact: 7, effort: 4, tags: ["aquisição", "CAC", "experiência"],
    weeks: 3,
  },
  {
    id: "EXP-04",
    title: "Protocolo Fotográfico Padrão",
    stage: "teste",
    hypothesis: "Registro padronizado com iluminação controlada e ângulo fixo aumenta percepção de resultado e reduz contestação.",
    method: "Implementar setup fotográfico em todas as sessões. Comparar satisfação pré/pós com fotos padrão vs. sem padrão.",
    metric: "NPS 9.1 vs. 7.4 no grupo controle",
    result: null,
    impact: 6, effort: 3, tags: ["prova", "satisfação", "qualidade"],
    weeks: 5,
  },
  {
    id: "EXP-05",
    title: "Pacote Fidelidade Mensal",
    stage: "prototipagem",
    hypothesis: "Assinatura mensal com benefícios exclusivos aumenta LTV e previsibilidade de receita.",
    method: "Prototipar 3 tiers de assinatura. Testar com clientes recorrentes. Medir adesão e churn.",
    metric: null,
    result: null,
    impact: 8, effort: 6, tags: ["LTV", "recorrência", "assinatura"],
    weeks: 2,
  },
  {
    id: "EXP-06",
    title: "Educação Pré-Procedimento",
    stage: "prototipagem",
    hypothesis: "Conteúdo educativo enviado 48h antes do procedimento reduz ansiedade, aumenta satisfação e melhora resultado.",
    method: "Sequência de WhatsApp com vídeo curto + checklist de preparo enviada 48h antes. Medir NPS e satisfação.",
    metric: null,
    result: null,
    impact: 5, effort: 2, tags: ["experiência", "NPS", "ansiedade"],
    weeks: 1,
  },
  {
    id: "EXP-07",
    title: "Programa de Indicação Estruturado",
    stage: "hipotese",
    hypothesis: "Recompensar indicações de forma sistemática (não ad hoc) gera crescimento orgânico previsível e reduz CAC.",
    method: "A definir: benefício para quem indica (desconto ou crédito) e para quem é indicado (consulta diagnóstica grátis).",
    metric: null,
    result: null,
    impact: 7, effort: 5, tags: ["crescimento", "CAC", "orgânico"],
    weeks: 0,
  },
  {
    id: "EXP-08",
    title: "Sequência de Nutrição Pós-Alta",
    stage: "hipotese",
    hypothesis: "Clientes que completaram tratamento recebem sequência de conteúdo mensal para manutenção e prevenção — gerando reativação.",
    method: "A definir: calendário editorial pós-alta com 12 toques ao longo de 6 meses. Medir taxa de reativação.",
    metric: null,
    result: null,
    impact: 6, effort: 4, tags: ["reativação", "retenção", "conteúdo"],
    weeks: 0,
  },
];

const STAGES: { key: Stage; label: string; color: string; border: string }[] = [
  { key: "hipotese",     label: "HIPÓTESE",     color: "rgba(255,255,255,0.3)",  border: "rgba(255,255,255,0.15)"  },
  { key: "prototipagem", label: "PROTOTIPAGEM", color: "rgba(255,149,0,0.5)",    border: "rgba(255,149,0,0.25)"    },
  { key: "teste",        label: "TESTE ATIVO",  color: "#ff9500",                border: "rgba(255,149,0,0.4)"     },
  { key: "validado",     label: "VALIDADO ✓",   color: "rgba(16,185,129,0.85)",  border: "rgba(16,185,129,0.3)"   },
];

// ─── Opportunity Matrix ───────────────────────────────────────────────────────

function OpportunityMatrix({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const W = 260, H = 200, PAD = 28;

  const toSVG = (impact: number, effort: number) => ({
    x: PAD + ((effort - 1) / 9) * (W - PAD * 2),
    y: (H - PAD) - ((impact - 1) / 9) * (H - PAD * 2),
  });

  const stageColor = (s: Stage) => {
    const st = STAGES.find(x => x.key === s);
    return st?.color ?? "rgba(255,255,255,0.3)";
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Quadrant fills */}
      <rect x={PAD} y={PAD} width={(W-PAD*2)/2} height={(H-PAD*2)/2} fill="rgba(255,149,0,0.04)" rx="1" />
      <rect x={PAD+(W-PAD*2)/2} y={PAD} width={(W-PAD*2)/2} height={(H-PAD*2)/2} fill="rgba(16,185,129,0.05)" rx="1" />
      <rect x={PAD} y={PAD+(H-PAD*2)/2} width={(W-PAD*2)/2} height={(H-PAD*2)/2} fill="rgba(255,255,255,0.01)" rx="1" />
      <rect x={PAD+(W-PAD*2)/2} y={PAD+(H-PAD*2)/2} width={(W-PAD*2)/2} height={(H-PAD*2)/2} fill="rgba(239,68,68,0.03)" rx="1" />

      {/* Quadrant labels */}
      <text x={PAD+2} y={PAD+8} fontSize="5" fill="rgba(255,149,0,0.4)" fontFamily="JetBrains Mono">FÁCIL/ALTO</text>
      <text x={PAD+(W-PAD*2)/2+2} y={PAD+8} fontSize="5" fill="rgba(16,185,129,0.5)" fontFamily="JetBrains Mono">DIFÍCIL/ALTO</text>
      <text x={PAD+2} y={H-PAD-2} fontSize="5" fill="rgba(255,255,255,0.15)" fontFamily="JetBrains Mono">FÁCIL/BAIXO</text>
      <text x={PAD+(W-PAD*2)/2+2} y={H-PAD-2} fontSize="5" fill="rgba(239,68,68,0.3)" fontFamily="JetBrains Mono">DIFÍCIL/BAIXO</text>

      {/* Grid */}
      <line x1={PAD+(W-PAD*2)/2} y1={PAD} x2={PAD+(W-PAD*2)/2} y2={H-PAD} stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="1.5,1" />
      <line x1={PAD} y1={PAD+(H-PAD*2)/2} x2={W-PAD} y2={PAD+(H-PAD*2)/2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="1.5,1" />

      {/* Axes */}
      <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <text x={W/2} y={H-1} textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono">ESFORÇO →</text>
      <text x={2} y={H/2} textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono" transform={`rotate(-90,2,${H/2})`}>IMPACTO →</text>

      {/* Nodes */}
      {EXPERIMENTS.map((exp, i) => {
        const { x, y } = toSVG(exp.impact, exp.effort);
        const color = stageColor(exp.stage);
        const isSel = selected === exp.id;
        return (
          <g key={exp.id} onClick={() => onSelect(exp.id)} style={{ cursor: "pointer", animation: `node-appear 0.3s ease ${i*0.05}s both` }}>
            <circle cx={x} cy={y} r={isSel ? 6 : 4.5} fill={color} opacity={isSel ? 1 : 0.75}
              stroke={isSel ? "white" : "transparent"} strokeWidth="0.8" />
            <text x={x+5} y={y+2} fontSize="4.5" fill="rgba(255,255,255,0.45)" fontFamily="JetBrains Mono">{exp.id.split("-")[1]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Laboratorio() {
  const [selected, setSelected] = useState<string>("EXP-01");

  const activeExp = EXPERIMENTS.find(e => e.id === selected) ?? EXPERIMENTS[0];
  const activeStage = STAGES.find(s => s.key === activeExp.stage)!;

  const validated = EXPERIMENTS.filter(e => e.stage === "validado").length;
  const running   = EXPERIMENTS.filter(e => e.stage === "teste").length;

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>INOVAÇÃO — O LABORATÓRIO</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "EXPERIMENTOS",    value: String(EXPERIMENTS.length), color: "rgba(255,255,255,0.55)" },
              { label: "EM TESTE",         value: String(running),            color: "#ff9500"                },
              { label: "VALIDADOS",        value: String(validated),          color: "rgba(16,185,129,0.85)" },
              { label: "QUICK WINS",       value: "2",                        color: "#ff9500"                },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PIPELINE HEADER ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {STAGES.map((stage, i) => {
          const count = EXPERIMENTS.filter(e => e.stage === stage.key).length;
          return (
            <div key={stage.key} style={{
              padding: "10px 16px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
              background: stage.key === "teste" ? "rgba(255,149,0,0.025)" : "transparent",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color,
                  animation: stage.key === "teste" ? "dot-blink 2s infinite" : "none" }} />
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5, color: stage.color, fontFamily: "JetBrains Mono, monospace" }}>{stage.label}</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: stage.color, fontFamily: "JetBrains Mono, monospace", marginLeft: "auto", opacity: 0.9 }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* ── KANBAN + DETAIL ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) 320px", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.05)", minHeight: 400 }}>

        {/* Kanban columns */}
        {STAGES.map((stage, si) => {
          const exps = EXPERIMENTS.filter(e => e.stage === stage.key);
          return (
            <div key={stage.key} style={{
              borderRight: "1px solid rgba(255,255,255,0.04)",
              padding: "14px 12px",
              background: stage.key === "teste" ? "rgba(255,149,0,0.012)" : "transparent",
            }}>
              {exps.map((exp, ei) => {
                const isSel = selected === exp.id;
                return (
                  <button key={exp.id} onClick={() => setSelected(exp.id)} style={{
                    width: "100%", textAlign: "left",
                    padding: "12px 12px",
                    marginBottom: 8,
                    background: isSel ? "rgba(255,149,0,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSel ? "rgba(255,149,0,0.35)" : "rgba(255,255,255,0.06)"}`,
                    borderLeft: `3px solid ${stage.color}`,
                    borderRadius: "0 6px 6px 0",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    animation: `card-appear 0.25s ease ${(si * 2 + ei) * 0.05}s both`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: stage.color, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1 }}>{exp.id}</span>
                      {exp.weeks > 0 && (
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>{exp.weeks}w</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isSel ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.58)", lineHeight: 1.3, marginBottom: 6 }}>{exp.title}</div>
                    {exp.metric && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(16,185,129,0.8)", fontFamily: "JetBrains Mono, monospace" }}>{exp.metric.split(" ").slice(0,3).join(" ")}...</div>
                    )}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                      {exp.tags.slice(0,2).map(t => (
                        <span key={t} style={{ fontSize: 9, padding: "2px 6px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", borderRadius: 3, fontFamily: "JetBrains Mono, monospace" }}>{t}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Detail panel */}
        <div key={selected} style={{
          padding: "18px 18px",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
          display: "flex", flexDirection: "column", gap: 14,
          animation: "detail-slide 0.2s ease",
          overflowY: "auto",
        }}>
          {/* Stage badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5, color: activeStage.color, fontFamily: "JetBrains Mono, monospace" }}>
              {activeExp.id} · {activeStage.label}
            </span>
            {activeExp.weeks > 0 && (
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>{activeExp.weeks} semanas</span>
            )}
          </div>

          <div style={{ fontSize: 15, fontWeight: 900, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>{activeExp.title}</div>

          {/* Hypothesis */}
          <div style={{ padding: "12px 14px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.12)", borderLeft: "2px solid rgba(255,149,0,0.4)", borderRadius: "0 5px 5px 0" }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 5 }}>HIPÓTESE</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>{activeExp.hypothesis}</p>
          </div>

          {/* Method */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 5 }}>MÉTODO</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{activeExp.method}</p>
          </div>

          {/* Metric */}
          {activeExp.metric && (
            <div style={{ padding: "12px 14px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(16,185,129,0.6)", fontFamily: "JetBrains Mono, monospace", marginBottom: 5 }}>RESULTADO-CHAVE</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(16,185,129,0.9)" }}>{activeExp.metric}</div>
            </div>
          )}

          {/* Result / conclusion */}
          {activeExp.result && (
            <div style={{ padding: "12px 14px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(16,185,129,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 5 }}>CONCLUSÃO ✓</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{activeExp.result}</p>
            </div>
          )}

          {!activeExp.result && (
            <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 5 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
                {activeExp.stage === "hipotese" ? "⬜ Aguardando priorização" :
                 activeExp.stage === "prototipagem" ? "🔧 Em construção" : "⚗️ Teste em andamento"}
              </div>
            </div>
          )}

          {/* Impact/effort scores */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
            {[
              { label: "IMPACTO", value: activeExp.impact, color: "#ff9500"                },
              { label: "ESFORÇO", value: activeExp.effort, color: "rgba(255,255,255,0.45)" },
            ].map(m => (
              <div key={m.label} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 5 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{m.value}<span style={{ fontSize: 12 }}>/10</span></div>
                <div style={{ marginTop: 6, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.value * 10}%`, background: m.color, borderRadius: 2,
                    animation: "bar-grow 0.4s ease both", transformOrigin: "left" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {activeExp.tags.map(t => (
              <span key={t} style={{ fontSize: 10, padding: "3px 9px", background: "rgba(255,149,0,0.07)", color: "rgba(255,149,0,0.6)", border: "1px solid rgba(255,149,0,0.15)", borderRadius: 3, fontFamily: "JetBrains Mono, monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── OPPORTUNITY MATRIX + INSIGHTS ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 0 }}>

        {/* Matrix */}
        <div style={{ padding: "20px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>MATRIZ DE OPORTUNIDADE</div>
          <div style={{ aspectRatio: "260/200" }}>
            <OpportunityMatrix selected={selected} onSelect={setSelected} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            {STAGES.map(s => (
              <div key={s.key} className="flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights grid */}
        <div style={{ padding: "20px 24px 48px" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>LEITURAS DO LABORATÓRIO</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Quick Wins identificados",
                value: "2",
                desc: "EXP-01 e EXP-02 já validados com alto impacto e baixíssimo esforço. Implementação imediata recomendada em escala.",
                color: "rgba(16,185,129,0.85)",
                border: "rgba(16,185,129,0.2)",
              },
              {
                title: "Pipeline com 30 dias de dados",
                value: "4",
                desc: "EXP-03 e EXP-04 em teste ativo com sinais positivos. EXP-03 mostra 67% de conversão pós-consulta grátis.",
                color: "#ff9500",
                border: "rgba(255,149,0,0.2)",
              },
              {
                title: "Zona de alto impacto vazia",
                value: "EXP-05",
                desc: "Pacote fidelidade tem o maior potencial de LTV mas ainda em prototipagem. Prioridade para aceleração.",
                color: "#ff9500",
                border: "rgba(255,149,0,0.15)",
              },
              {
                title: "Custo de inovação estimado",
                value: "Zero",
                desc: "Todos os 8 experimentos têm custo operacional próximo de zero — o investimento é em tempo de implementação e acompanhamento.",
                color: "rgba(255,255,255,0.55)",
                border: "rgba(255,255,255,0.08)",
              },
            ].map((ins, i) => (
              <div key={i} style={{
                padding: "16px 18px",
                background: "rgba(255,255,255,0.015)",
                border: `1px solid ${ins.border}`,
                borderTop: `2px solid ${ins.color}`,
                borderRadius: "0 0 8px 8px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>{ins.title}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: ins.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{ins.value}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{ins.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
