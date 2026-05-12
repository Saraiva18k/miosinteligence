import { useState } from "react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes risk-appear {
  from { opacity: 0; transform: scale(0.3); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes detail-in {
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes deadline-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(239,68,68,0.3); }
  50%       { box-shadow: 0 0 12px rgba(239,68,68,0.5); }
}
@keyframes score-fill {
  from { stroke-dashoffset: 283; }
  to   { stroke-dashoffset: var(--target-offset); }
}
@keyframes domain-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Severity = "CRÍTICO" | "ALTO" | "MÉDIO" | "BAIXO";

interface RiskItem {
  id:          string;
  domain:      string;
  title:       string;
  description: string;
  prob:        number; // 1–5
  impact:      number; // 1–5
  severity:    Severity;
  action:      string;
  deadline:    string | null;
  law:         string;
}

interface Domain {
  key:    string;
  label:  string;
  score:  number; // 0–100 compliance %
  icon:   string;
  risks:  number;
  critical: number;
}

interface Deadline {
  title:   string;
  days:    number;
  domain:  string;
  urgent:  boolean;
}

const RISKS: RiskItem[] = [
  {
    id: "R01", domain: "LGPD",
    title: "Política de Privacidade ausente",
    description: "O estabelecimento coleta dados pessoais (nome, contato, histórico de procedimentos) sem política de privacidade publicada e acessível ao titular.",
    prob: 5, impact: 4, severity: "CRÍTICO",
    action: "Publicar política de privacidade no site e nos pontos de coleta. Documentar finalidade, prazo e base legal de cada dado coletado.",
    deadline: "Imediato", law: "LGPD art. 9º",
  },
  {
    id: "R02", domain: "Sanitária",
    title: "Alvará sanitário vencido ou ausente",
    description: "Licença de funcionamento junto à Vigilância Sanitária local não está atualizada para os procedimentos realizados. Risco de interdição e multa.",
    prob: 4, impact: 5, severity: "CRÍTICO",
    action: "Levantar situação atual do alvará. Protocolar renovação ou adequação junto à Vigilância Sanitária municipal com lista de procedimentos realizados.",
    deadline: "45 dias", law: "RDC ANVISA 50/2002",
  },
  {
    id: "R03", domain: "Publicidade",
    title: "Claims sem comprovação científica",
    description: "Publicações nas redes sociais prometem resultados específicos ('elimina definitivamente', 'garante resultado em X sessões') sem respaldo técnico-científico comprovado.",
    prob: 4, impact: 4, severity: "CRÍTICO",
    action: "Revisar todos os conteúdos publicados. Substituir promessas absolutas por resultados baseados em evidência. Adicionar disclaimers em antes/depois.",
    deadline: "30 dias", law: "CFM/CFO + CONAR",
  },
  {
    id: "R04", domain: "LGPD",
    title: "WhatsApp sem consentimento documentado",
    description: "Contatos via WhatsApp para marketing, follow-up e agendamento ocorrem sem registro de consentimento explícito do titular conforme exigido pela LGPD.",
    prob: 5, impact: 3, severity: "ALTO",
    action: "Implementar opt-in documentado no primeiro contato. Criar fluxo de confirmação de consentimento para a base atual de contatos.",
    deadline: "30 dias", law: "LGPD art. 7º e 8º",
  },
  {
    id: "R05", domain: "Trabalhista",
    title: "Prestadores sem contrato formal",
    description: "Profissionais que atuam no estabelecimento como 'autônomos' ou 'parceiros' sem contrato formal podem ser caracterizados como vínculo empregatício pela Justiça do Trabalho.",
    prob: 3, impact: 4, severity: "ALTO",
    action: "Formalizar relação com cada prestador: PJ com contrato de prestação de serviços ou CLT se houver habitualidade e subordinação.",
    deadline: "60 dias", law: "CLT art. 3º e 9º",
  },
  {
    id: "R06", domain: "CDC",
    title: "Política de cancelamento não comunicada",
    description: "Não há comunicação clara sobre política de cancelamento, reembolso ou no-show antes da contratação do serviço. Expõe a conflitos com Procon.",
    prob: 4, impact: 3, severity: "ALTO",
    action: "Criar e comunicar política de cancelamento antes do agendamento. Documentar aceite do cliente (digital ou assinado).",
    deadline: "30 dias", law: "CDC art. 6º e 54º",
  },
  {
    id: "R07", domain: "Tributária",
    title: "Emissão de NF inconsistente",
    description: "Nem todos os serviços prestados têm nota fiscal emitida. Pagamentos via PIX sem NF criam exposição fiscal e impedem crescimento sem risco tributário.",
    prob: 3, impact: 3, severity: "MÉDIO",
    action: "Padronizar emissão de NFS-e para 100% dos serviços. Orientar equipe e implementar controle automatizado por agendamento.",
    deadline: "Próximo trimestre", law: "LC 116/2003",
  },
  {
    id: "R08", domain: "Publicidade",
    title: "Antes/depois sem disclaimer",
    description: "Imagens de resultados publicadas sem disclaimer obrigatório de que resultados podem variar, exigido pelo CFM, CFO e CONAR para procedimentos estéticos.",
    prob: 3, impact: 3, severity: "MÉDIO",
    action: "Adicionar disclaimer padronizado em todo conteúdo de resultado. Revisar arquivo e republicar ou deletar posts não conformes.",
    deadline: "30 dias", law: "CONAR + Res. CFO",
  },
  {
    id: "R09", domain: "Sanitária",
    title: "Registro de insumos não documentado",
    description: "Produtos e insumos utilizados nos procedimentos não têm controle de lote, validade e registro ANVISA verificado sistematicamente.",
    prob: 2, impact: 4, severity: "MÉDIO",
    action: "Criar planilha ou sistema de controle de insumos com: nome, fabricante, registro ANVISA, lote e validade. Verificar antes de cada compra.",
    deadline: "60 dias", law: "RDC ANVISA 67/2007",
  },
  {
    id: "R10", domain: "Trabalhista",
    title: "EPI e biossegurança sem documentação",
    description: "Uso de equipamentos de proteção individual não está documentado formalmente. Em caso de acidente, ausência de documentação aumenta responsabilidade.",
    prob: 2, impact: 3, severity: "BAIXO",
    action: "Criar registro de fornecimento de EPIs e treinamento de biossegurança. Assinatura do profissional a cada entrega.",
    deadline: "90 dias", law: "NR-6 MTE",
  },
];

const DOMAINS: Domain[] = [
  { key: "LGPD",        label: "LGPD / Dados",         score: 28,  icon: "🔐", risks: 2, critical: 1 },
  { key: "Sanitária",   label: "Vigilância Sanitária",  score: 45,  icon: "⚕️", risks: 2, critical: 1 },
  { key: "Publicidade", label: "Publicidade",           score: 42,  icon: "📣", risks: 2, critical: 1 },
  { key: "Trabalhista", label: "Trabalhista",           score: 65,  icon: "👥", risks: 2, critical: 0 },
  { key: "CDC",         label: "Defesa do Consumidor",  score: 70,  icon: "🛡️", risks: 1, critical: 0 },
  { key: "Tributária",  label: "Tributária",            score: 55,  icon: "🧾", risks: 1, critical: 0 },
];

const DEADLINES: Deadline[] = [
  { title: "Declaração fiscal trimestral",    days: 18, domain: "Tributária",  urgent: true  },
  { title: "Publicar política de privacidade",days: 0,  domain: "LGPD",        urgent: true  },
  { title: "Revisar claims de publicidade",   days: 30, domain: "Publicidade", urgent: true  },
  { title: "Renovar alvará sanitário",        days: 45, domain: "Sanitária",   urgent: false },
  { title: "Formalizar contratos autônomos",  days: 60, domain: "Trabalhista", urgent: false },
];

const SEVERITY_STYLE: Record<Severity, { color: string; bg: string; border: string; glow: string }> = {
  "CRÍTICO": { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)", glow: "rgba(239,68,68,0.5)" },
  "ALTO":    { color: "#f97316", bg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.3)", glow: "rgba(249,115,22,0.4)" },
  "MÉDIO":   { color: "#ff9500", bg: "rgba(255,149,0,0.08)",  border: "rgba(255,149,0,0.25)", glow: "rgba(255,149,0,0.3)"  },
  "BAIXO":   { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", glow: "transparent" },
};

// ─── Risk Heat Map ────────────────────────────────────────────────────────────

function RiskMatrix({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const W = 300, H = 260;
  const PAD = { left: 32, right: 16, top: 16, bottom: 28 };
  const cols = 5, rows = 5;
  const cellW = (W - PAD.left - PAD.right) / cols;
  const cellH = (H - PAD.top - PAD.bottom) / rows;

  const cellColor = (col: number, row: number) => {
    const score = (col + 1) * (row + 1); // 1–25
    if (score >= 16) return "rgba(239,68,68,0.12)";
    if (score >= 9)  return "rgba(249,115,22,0.08)";
    if (score >= 4)  return "rgba(255,149,0,0.06)";
    return "rgba(255,255,255,0.02)";
  };

  const toXY = (prob: number, impact: number) => ({
    x: PAD.left + (impact - 0.5) * cellW,
    y: PAD.top + (rows - prob + 0.5) * cellH,
  });

  const nodeColor = (s: Severity) => SEVERITY_STYLE[s].color;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Cells */}
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <rect key={`${row}-${col}`}
            x={PAD.left + col * cellW} y={PAD.top + row * cellH}
            width={cellW - 1} height={cellH - 1}
            fill={cellColor(col, rows - 1 - row)} rx="2"
          />
        ))
      )}

      {/* Zone labels */}
      <text x={PAD.left + cellW * 0.5} y={PAD.top + cellH * 4.5 + 4} textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.15)" fontFamily="JetBrains Mono">BAIXO</text>
      <text x={PAD.left + cellW * 2.5} y={PAD.top + cellH * 2.5 + 4} textAnchor="middle" fontSize="5.5" fill="rgba(255,149,0,0.25)" fontFamily="JetBrains Mono">MÉDIO</text>
      <text x={PAD.left + cellW * 4.2} y={PAD.top + cellH * 0.6 + 4} textAnchor="middle" fontSize="5.5" fill="rgba(239,68,68,0.45)" fontFamily="JetBrains Mono">CRÍTICO</text>

      {/* Axes */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />

      {/* Y axis labels */}
      {[1,2,3,4,5].map(v => (
        <text key={v} x={PAD.left - 4} y={PAD.top + (rows - v + 0.5) * cellH + 2}
          textAnchor="end" fontSize="6" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono">{v}</text>
      ))}

      {/* X axis labels */}
      {[1,2,3,4,5].map(v => (
        <text key={v} x={PAD.left + (v - 0.5) * cellW} y={H - PAD.bottom + 9}
          textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.2)" fontFamily="JetBrains Mono">{v}</text>
      ))}

      {/* Axis titles */}
      <text x={W / 2 + PAD.left / 2} y={H - 1} textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono">IMPACTO →</text>
      <text x={6} y={H / 2} textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono" transform={`rotate(-90,6,${H/2})`}>PROB. →</text>

      {/* Risk nodes */}
      {RISKS.map((r, i) => {
        const { x, y } = toXY(r.prob, r.impact);
        const isSel = selected === r.id;
        const color = nodeColor(r.severity);
        return (
          <g key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: "pointer", animation: `risk-appear 0.3s ease ${i * 0.06}s both` }}>
            {isSel && <circle cx={x} cy={y} r="9" fill={color} opacity="0.15" />}
            <circle cx={x} cy={y} r={isSel ? 6 : 5}
              fill={color} opacity={isSel ? 1 : 0.8}
              stroke={isSel ? "white" : "transparent"} strokeWidth="0.8" />
            <text x={x} y={y + 2.5} textAnchor="middle" fontSize="5" fill="rgba(0,0,0,0.9)" fontFamily="JetBrains Mono" fontWeight="bold">
              {r.id.replace("R", "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score < 40 ? "#ef4444" : score < 60 ? "#f97316" : score < 75 ? "#ff9500" : "rgba(16,185,129,0.85)";
  return (
    <svg viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s ease", "--target-offset": offset } as React.CSSProperties} />
      <text x="50" y="47" textAnchor="middle" fontSize="18" fontWeight="900" fill={color} fontFamily="JetBrains Mono">{score}</text>
      <text x="50" y="58" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="JetBrains Mono">SCORE</text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MapaRisco() {
  const [selected, setSelected] = useState<string>("R01");

  const activeRisk = RISKS.find(r => r.id === selected) ?? RISKS[0];
  const ss = SEVERITY_STYLE[activeRisk.severity];
  const overallScore = Math.round(DOMAINS.reduce((a, d) => a + d.score, 0) / DOMAINS.length);
  const criticalCount = RISKS.filter(r => r.severity === "CRÍTICO").length;

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● LIVE</span>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>COMPLIANCE — O MAPA DE RISCO</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "SCORE GERAL",    value: `${overallScore}%`, color: "#f97316"                },
              { label: "CRÍTICOS",       value: String(criticalCount), color: "#ef4444"             },
              { label: "RISCOS MAPEADOS",value: String(RISKS.length),  color: "rgba(255,255,255,0.55)" },
              { label: "DOMÍNIOS",       value: String(DOMAINS.length), color: "rgba(255,255,255,0.55)" },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN: MATRIX + DETAIL ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Left: Score + Matrix */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>

          {/* Score ring + summary */}
          <div style={{ padding: "20px 20px 16px", display: "flex", gap: 20, alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <ScoreRing score={overallScore} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>PERFIL DE RISCO</div>
              {[
                { sev: "CRÍTICO" as Severity, count: RISKS.filter(r=>r.severity==="CRÍTICO").length },
                { sev: "ALTO"    as Severity, count: RISKS.filter(r=>r.severity==="ALTO").length    },
                { sev: "MÉDIO"   as Severity, count: RISKS.filter(r=>r.severity==="MÉDIO").length   },
                { sev: "BAIXO"   as Severity, count: RISKS.filter(r=>r.severity==="BAIXO").length   },
              ].map(({ sev, count }) => (
                <div key={sev} className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: SEVERITY_STYLE[sev].color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", flex: 1 }}>{sev}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: SEVERITY_STYLE[sev].color, fontFamily: "JetBrains Mono, monospace" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix */}
          <div style={{ padding: "16px 16px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 10 }}>MATRIZ PROBABILIDADE × IMPACTO</div>
            <div style={{ aspectRatio: "300/260" }}>
              <RiskMatrix selected={selected} onSelect={setSelected} />
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", marginTop: 6, textAlign: "center" }}>Clique em um nó para ver o detalhe</div>
          </div>
        </div>

        {/* Right: Detail panel */}
        <div key={selected} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16, animation: "detail-in 0.2s ease" }}>
          {/* Severity badge + ID */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{
              fontSize: 10, fontWeight: 900, letterSpacing: 2, padding: "4px 10px",
              background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
              borderRadius: 4, fontFamily: "JetBrains Mono, monospace",
            }}>{activeRisk.severity}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>{activeRisk.id} · {activeRisk.domain}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>{activeRisk.law}</span>
          </div>

          <div style={{ fontSize: 18, fontWeight: 900, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>{activeRisk.title}</div>

          {/* Risk description */}
          <div style={{ padding: "14px 16px", background: ss.bg, border: `1px solid ${ss.border}`, borderLeft: `3px solid ${ss.color}`, borderRadius: "0 6px 6px 0" }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: ss.color, fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>EXPOSIÇÃO</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{activeRisk.description}</p>
          </div>

          {/* Scores */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "PROBABILIDADE", value: activeRisk.prob,   max: 5, color: ss.color },
              { label: "IMPACTO",       value: activeRisk.impact, max: 5, color: ss.color },
              { label: "SCORE RISCO",   value: activeRisk.prob * activeRisk.impact, max: 25, color: ss.color },
            ].map(m => (
              <div key={m.label} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 5 }}>
                <div style={{ fontSize: 9, letterSpacing: 1, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                  {m.value}<span style={{ fontSize: 12, opacity: 0.5 }}>/{m.max}</span>
                </div>
                <div style={{ marginTop: 6, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(m.value / m.max) * 100}%`, background: m.color, borderRadius: 2, animation: "bar-grow 0.4s ease both", transformOrigin: "left" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div style={{ padding: "16px 18px", background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.18)", borderTop: "2px solid rgba(255,149,0,0.4)", borderRadius: "0 0 8px 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace" }}>AÇÃO RECOMENDADA</div>
              {activeRisk.deadline && (
                <span style={{ fontSize: 10, fontWeight: 700, color: activeRisk.deadline === "Imediato" ? "#ef4444" : "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>
                  ⏱ {activeRisk.deadline}
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}>{activeRisk.action}</p>
          </div>

          {/* Risk list quick-nav */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>TODOS OS RISCOS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {RISKS.map(r => (
                <button key={r.id} onClick={() => setSelected(r.id)} style={{
                  padding: "4px 8px", fontSize: 10, fontWeight: 700,
                  background: selected === r.id ? SEVERITY_STYLE[r.severity].bg : "rgba(255,255,255,0.02)",
                  color: selected === r.id ? SEVERITY_STYLE[r.severity].color : "rgba(255,255,255,0.25)",
                  border: `1px solid ${selected === r.id ? SEVERITY_STYLE[r.severity].border : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 4, cursor: "pointer", fontFamily: "JetBrains Mono, monospace",
                  transition: "all 0.12s ease",
                }}>{r.id}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DOMAINS + DEADLINES ───────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 0 }}>

        {/* Domains */}
        <div style={{ padding: "20px 24px 48px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>SAÚDE POR DOMÍNIO</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {DOMAINS.map((d, i) => {
              const scoreColor = d.score < 40 ? "#ef4444" : d.score < 60 ? "#f97316" : d.score < 75 ? "#ff9500" : "rgba(16,185,129,0.85)";
              return (
                <div key={d.key} style={{
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.018)",
                  backdropFilter: "blur(12px) saturate(150%)",
                  WebkitBackdropFilter: "blur(12px) saturate(150%)",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  borderTop: `2px solid ${scoreColor}`,
                  borderRadius: "0 0 8px 8px",
                  animation: `domain-rise 0.3s ease ${i * 0.07}s both`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14 }}>{d.icon}</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: scoreColor, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{d.score}%</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>{d.label}</div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${d.score}%`, background: scoreColor, borderRadius: 2, animation: `bar-grow 0.5s ease ${0.2 + i * 0.07}s both`, transformOrigin: "left" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{d.risks} riscos</span>
                    {d.critical > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", fontFamily: "JetBrains Mono, monospace" }}>· {d.critical} crítico</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadlines */}
        <div style={{ padding: "20px 20px 48px" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>PRAZOS REGULATÓRIOS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEADLINES.sort((a, b) => a.days - b.days).map((dl, i) => (
              <div key={i} style={{
                padding: "12px 14px",
                background: dl.urgent ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${dl.urgent ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderLeft: `3px solid ${dl.urgent ? "#ef4444" : "rgba(255,149,0,0.4)"}`,
                borderRadius: "0 6px 6px 0",
                animation: dl.urgent ? "deadline-pulse 2s infinite" : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: dl.urgent ? "#ef4444" : "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace" }}>
                    {dl.days === 0 ? "IMEDIATO" : `${dl.days} dias`}
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>{dl.domain}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: dl.urgent ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{dl.title}</div>
              </div>
            ))}
          </div>

          {/* Compliance CTA */}
          <div style={{ marginTop: 16, padding: "16px 16px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.15)", borderRadius: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>LEITURA DO MAPA</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
              Score geral de <span style={{ color: "#f97316", fontWeight: 700 }}>48%</span> indica exposição significativa. LGPD e Sanitária são as frentes mais urgentes — juntas concentram todos os riscos críticos. Resolução em 30 dias pode elevar o score para acima de 70%.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
