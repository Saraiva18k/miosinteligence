import { useState } from "react";
import { FileText, Layers, BarChart2, Code2, Clock, CheckCircle2, Calendar, Users, Download, Zap, RefreshCw, Send } from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes ex-appear  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes ex-flow-in { from{stroke-dashoffset:90} to{stroke-dashoffset:0} }
@keyframes ex-flow-out{ from{stroke-dashoffset:110} to{stroke-dashoffset:0} }
@keyframes ex-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes ex-glow    { 0%,100%{box-shadow:0 0 12px rgba(255,149,0,0.15)} 50%{box-shadow:0 0 28px rgba(255,149,0,0.35)} }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Format { id: string; label: string; ext: string; desc: string; color: string; Icon: React.ElementType; size: string }
const FORMATS: Format[] = [
  { id: "pdf",  label: "PDF",        ext: ".pdf",  desc: "Relatório executivo para impressão e apresentação",  color: "#ef4444", Icon: FileText,  size: "~2.4 MB" },
  { id: "pptx", label: "PowerPoint", ext: ".pptx", desc: "Slides prontos para board e stakeholders",           color: "#ff9500", Icon: Layers,    size: "~5.1 MB" },
  { id: "xlsx", label: "Excel",      ext: ".xlsx", desc: "Dados estruturados para análise aprofundada",        color: "#10b981", Icon: BarChart2, size: "~890 KB" },
  { id: "json", label: "JSON",       ext: ".json", desc: "Integração via API, webhooks e sistemas externos",   color: "#6366f1", Icon: Code2,     size: "~340 KB" },
];

interface Module { name: string; group: string; color: string }
const ALL_MODULES: Module[] = [
  { name: "Pulso do Mercado",  group: "Mercado",    color: "#3b82f6" },
  { name: "Concorrentes",      group: "Mercado",    color: "#3b82f6" },
  { name: "Benchmarking",      group: "Mercado",    color: "#3b82f6" },
  { name: "Tendências",        group: "Mercado",    color: "#3b82f6" },
  { name: "Sentimento",        group: "Mercado",    color: "#3b82f6" },
  { name: "Audiência",         group: "Audiência",  color: "#ec4899" },
  { name: "Dores",             group: "Audiência",  color: "#ec4899" },
  { name: "Canais",            group: "Audiência",  color: "#ec4899" },
  { name: "DNA da Marca",      group: "Marca",      color: "#8b5cf6" },
  { name: "Precificação",      group: "Marca",      color: "#8b5cf6" },
  { name: "Business Plan",     group: "Estratégia", color: "#10b981" },
  { name: "OKR",               group: "Estratégia", color: "#10b981" },
  { name: "Cenários",          group: "Estratégia", color: "#10b981" },
  { name: "Compliance",        group: "Estratégia", color: "#10b981" },
];

const GROUPS_PIPE = [
  { label: "Mercado",    short: "MER", color: "#3b82f6", y: 34  },
  { label: "Audiência",  short: "AUD", color: "#ec4899", y: 80  },
  { label: "Marca",      short: "MRC", color: "#8b5cf6", y: 126 },
  { label: "Estratégia", short: "EST", color: "#10b981", y: 172 },
  { label: "Veredito",   short: "VER", color: "#ff9500", y: 218 },
];

const FORMATS_PIPE = [
  { id: "pdf",  label: "PDF",  color: "#ef4444", y: 56  },
  { id: "pptx", label: "PPTX", color: "#ff9500", y: 102 },
  { id: "xlsx", label: "XLSX", color: "#10b981", y: 148 },
  { id: "json", label: "JSON", color: "#6366f1", y: 194 },
];

interface HistoryItem { date: string; title: string; format: string; recipient: string; modules: number; status: string }
const HISTORY: HistoryItem[] = [
  { date: "14 Mai 2026", title: "Diagnóstico Completo Q2",  format: "pdf",  recipient: "pedro@mios.ai",        modules: 14, status: "sent" },
  { date: "10 Mai 2026", title: "Relatório para Board",     format: "pptx", recipient: "board@empresa.com",    modules: 6,  status: "sent" },
  { date: "05 Mai 2026", title: "Análise de Audiência",     format: "xlsx", recipient: "analista@empresa.com", modules: 3,  status: "sent" },
  { date: "01 Mai 2026", title: "Export API Mensal",        format: "json", recipient: "webhook · sistema",    modules: 14, status: "sent" },
  { date: "15 Abr 2026", title: "Diagnóstico Inicial Q1",  format: "pdf",  recipient: "ceo@empresa.com",      modules: 14, status: "sent" },
];

const SCHEDULED = [
  { title: "Relatório Mensal Completo", format: "pdf",  freq: "1ª segunda-feira do mês", next: "01 Jun 2026", recipients: 3 },
  { title: "Dados Operacionais",        format: "xlsx", freq: "Todo domingo às 08h00",   next: "17 Mai 2026", recipients: 1 },
];

// ─── Pipeline SVG ─────────────────────────────────────────────────────────────

function PipelineSVG({ formatId }: { formatId: string }) {
  const CX = 148, CY = 126;

  return (
    <svg width={296} height={252} viewBox="0 0 296 252" style={{ display: "block" }}>
      <defs>
        {GROUPS_PIPE.map((g, i) => (
          <path key={i} id={`gp${i}`}
            d={`M 40,${g.y} C 94,${g.y} 94,${CY} ${CX},${CY}`}
          />
        ))}
        {FORMATS_PIPE.map((f, i) => (
          <path key={i} id={`fp${i}`}
            d={`M ${CX},${CY} C 202,${CY} 202,${f.y} 256,${f.y}`}
          />
        ))}
      </defs>

      {/* ── Group → Center paths ── */}
      {GROUPS_PIPE.map((g, i) => (
        <g key={i}>
          {/* Base track */}
          <use href={`#gp${i}`} fill="none" stroke={g.color} strokeWidth={1} opacity={0.12} />
          {/* Animated flow */}
          <use href={`#gp${i}`} fill="none" stroke={g.color} strokeWidth={1.6} opacity={0.55}
            strokeDasharray="90" style={{ animation: `ex-flow-in ${1.6 + i * 0.18}s linear ${i * 0.22}s infinite` }} />
          {/* Moving dot */}
          <circle r={2.8} fill={g.color} opacity={0.85}>
            <animateMotion dur={`${1.6 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.22}s`}>
              <mpath href={`#gp${i}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* ── Center → Format paths ── */}
      {FORMATS_PIPE.map((f, i) => {
        const active = f.id === formatId;
        return (
          <g key={i}>
            <use href={`#fp${i}`} fill="none" stroke={f.color} strokeWidth={active ? 1.5 : 0.7}
              opacity={active ? 0.35 : 0.08} />
            {active && (
              <>
                <use href={`#fp${i}`} fill="none" stroke={f.color} strokeWidth={2.2} opacity={0.8}
                  strokeDasharray="110" style={{ animation: `ex-flow-out 1.2s linear 0s infinite` }} />
                <circle r={3.5} fill={f.color} opacity={0.95}>
                  <animateMotion dur="1.2s" repeatCount="indefinite">
                    <mpath href={`#fp${i}`} />
                  </animateMotion>
                </circle>
              </>
            )}
          </g>
        );
      })}

      {/* ── Group nodes (left) ── */}
      {GROUPS_PIPE.map((g, i) => (
        <g key={i} style={{ animation: `ex-appear 0.3s ease ${i * 0.06}s both` }}>
          <circle cx={40} cy={g.y} r={13} fill={`${g.color}12`} stroke={g.color} strokeWidth={1} opacity={0.75} />
          <text x={40} y={g.y} textAnchor="middle" dominantBaseline="middle"
            fill={g.color} fontSize={5.5} fontWeight={800} letterSpacing={0.3}>{g.short}</text>
        </g>
      ))}

      {/* ── Center node (processing engine) ── */}
      {/* Outer pulse rings */}
      <circle cx={CX} cy={CY} r={32} fill="none" stroke="rgba(255,149,0,0.18)" strokeWidth={1}>
        <animate attributeName="r" values="32;40;32" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0;0.18" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={CX} cy={CY} r={26} fill="none" stroke="rgba(255,149,0,0.12)" strokeWidth={1}>
        <animate attributeName="r" values="26;34;26" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      {/* Inner fill */}
      <circle cx={CX} cy={CY} r={20} fill="rgba(255,149,0,0.06)" stroke="rgba(255,149,0,0.22)" strokeWidth={1.2} />
      <circle cx={CX} cy={CY} r={14} fill="rgba(255,149,0,0.10)" stroke="rgba(255,149,0,0.5)" strokeWidth={1.5} />
      {/* Label */}
      <text x={CX} y={CY - 3} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,149,0,0.9)" fontSize={6.5} fontWeight={900} letterSpacing={0.8}>MIOS</text>
      <text x={CX} y={CY + 7} textAnchor="middle"
        fill="rgba(255,255,255,0.2)" fontSize={4.5} fontWeight={600} letterSpacing={0.5}>ENGINE</text>

      {/* ── Format nodes (right) ── */}
      {FORMATS_PIPE.map((f, i) => {
        const active = f.id === formatId;
        return (
          <g key={i} style={{ animation: `ex-appear 0.3s ease ${i * 0.07 + 0.3}s both` }}>
            <circle cx={256} cy={f.y} r={14} fill={active ? `${f.color}22` : `${f.color}06`}
              stroke={f.color} strokeWidth={active ? 1.8 : 0.8} opacity={active ? 1 : 0.35} />
            <text x={256} y={f.y} textAnchor="middle" dominantBaseline="middle"
              fill={active ? f.color : `${f.color}60`} fontSize={5.5} fontWeight={900} letterSpacing={0.3}>{f.label}</text>
            {active && (
              <circle cx={256} cy={f.y} r={20} fill="none" stroke={f.color} strokeWidth={0.8} opacity={0.3}>
                <animate attributeName="r" values="14;22;14" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const fmtColor: Record<string, string> = { pdf: "#ef4444", pptx: "#ff9500", xlsx: "#10b981", json: "#6366f1" };
const fmtLabel: Record<string, string> = { pdf: "PDF", pptx: "PPTX", xlsx: "XLSX", json: "JSON" };

export function ExportacaoHero() {
  const [formatId, setFormatId]         = useState("pdf");
  const [selected, setSelected]         = useState<Set<string>>(new Set(ALL_MODULES.map(m => m.name)));

  const activeFormat = FORMATS.find(f => f.id === formatId)!;
  const activeColor  = activeFormat.color;

  function toggleModule(name: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function toggleAll() {
    setSelected(prev =>
      prev.size === ALL_MODULES.length ? new Set() : new Set(ALL_MODULES.map(m => m.name))
    );
  }

  return (
    <>
      <style>{KF}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 48 }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: "22px 28px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px -20px rgba(255,149,0,0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: 60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div>
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.26)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={20} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>EXPORTAÇÃO · GRUPO VEREDITO</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.93)", letterSpacing: "-0.4px" }}>Central de Distribuição</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", maxWidth: 380, lineHeight: 1.6 }}>
              Compile e envie diagnósticos estratégicos em múltiplos formatos — para equipes, board e sistemas integrados.
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {[
              { value: "5",  label: "Exports este mês", Icon: Download,   color: "#ff9500" },
              { value: "2",  label: "Agendamentos ativos", Icon: Calendar, color: "#10b981" },
              { value: "14", label: "Módulos disponíveis", Icon: Zap,     color: "#6366f1" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "12px 16px", borderRadius: 12,
                background: `${s.color}08`, border: `1px solid ${s.color}1a`,
                display: "flex", flexDirection: "column", gap: 4, minWidth: 90,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <s.Icon size={11} style={{ color: s.color }} strokeWidth={2} />
                  <span style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{s.value}</span>
                </div>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Export Builder ─────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 316px 1fr", gap: 14 }}>

          {/* Left: Format selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.2)", marginBottom: 2 }}>FORMATO DE SAÍDA</div>
            {FORMATS.map((f, i) => {
              const active = f.id === formatId;
              return (
                <div key={f.id}
                  onClick={() => setFormatId(f.id)}
                  style={{
                    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    background: active ? `${f.color}0d` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${active ? `${f.color}35` : "rgba(255,255,255,0.06)"}`,
                    display: "flex", alignItems: "flex-start", gap: 12,
                    transition: "all 0.18s ease",
                    animation: `ex-appear 0.3s ease ${i * 0.07}s both`,
                    boxShadow: active ? `0 0 20px -8px ${f.color}30` : "none",
                  }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: active ? `${f.color}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? `${f.color}40` : "rgba(255,255,255,0.07)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <f.Icon size={16} style={{ color: active ? f.color : "rgba(255,255,255,0.25)" }} strokeWidth={1.7} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: active ? f.color : "rgba(255,255,255,0.55)" }}>{f.label}</span>
                      <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.2)" }}>{f.ext}</span>
                      <span style={{ marginLeft: "auto", fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.2)" }}>{f.size}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                  {active && (
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: f.color, flexShrink: 0, marginTop: 3 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Center: Pipeline SVG */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.18)" }}>PIPELINE DE TRANSMISSÃO</div>
            <div style={{
              borderRadius: 14, padding: "8px 6px",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              animation: "ex-glow 3s ease-in-out infinite",
            }}>
              <PipelineSVG formatId={formatId} />
            </div>
            {/* Export action */}
            <div style={{
              width: "100%", padding: "13px 16px", borderRadius: 11, cursor: "pointer",
              background: `${activeColor}12`, border: `1px solid ${activeColor}30`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              boxShadow: `0 0 24px -8px ${activeColor}40`,
            }}>
              <Download size={14} style={{ color: activeColor }} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 800, color: activeColor }}>
                Gerar {activeFormat.label} · {selected.size} módulos
              </span>
            </div>
          </div>

          {/* Right: Module selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.2)" }}>CONTEÚDO DO EXPORT</div>
              <div
                onClick={toggleAll}
                style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: "2px 8px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                {selected.size === ALL_MODULES.length ? "Desmarcar tudo" : "Selecionar tudo"}
              </div>
            </div>
            {/* Modules by group */}
            {(["Mercado", "Audiência", "Marca", "Estratégia"] as const).map(grp => {
              const groupColor = ALL_MODULES.find(m => m.group === grp)!.color;
              const mods       = ALL_MODULES.filter(m => m.group === grp);
              return (
                <div key={grp} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ padding: "7px 12px", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: groupColor }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.8 }}>{grp.toUpperCase()}</span>
                    <span style={{ marginLeft: "auto", fontSize: 8, color: "rgba(255,255,255,0.2)" }}>
                      {mods.filter(m => selected.has(m.name)).length}/{mods.length}
                    </span>
                  </div>
                  <div style={{ padding: "6px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
                    {mods.map(m => {
                      const on = selected.has(m.name);
                      return (
                        <div key={m.name}
                          onClick={() => toggleModule(m.name)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "5px 6px",
                            borderRadius: 6, cursor: "pointer",
                            background: on ? `${m.color}0a` : "transparent",
                          }}>
                          <div style={{
                            width: 13, height: 13, borderRadius: 3, flexShrink: 0,
                            background: on ? m.color : "transparent",
                            border: `1.5px solid ${on ? m.color : "rgba(255,255,255,0.15)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {on && <span style={{ fontSize: 8, color: "#000", fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 10.5, color: on ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.28)" }}>{m.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Agendamentos ──────────────────────────────────────────────────── */}
        <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "10px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
            <RefreshCw size={11} style={{ color: "#10b981" }} strokeWidth={2} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.3)" }}>AGENDAMENTOS ATIVOS</span>
            <div style={{ marginLeft: "auto", padding: "2px 10px", borderRadius: 5, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", fontSize: 9, fontWeight: 700, color: "#10b981" }}>
              {SCHEDULED.length} ativos
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {SCHEDULED.map((s, i) => {
              const c = fmtColor[s.format];
              return (
                <div key={i} style={{
                  padding: "14px 20px", borderRight: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  animation: `ex-appear 0.3s ease ${i * 0.1}s both`,
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c}10`, border: `1px solid ${c}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <RefreshCw size={14} style={{ color: c }} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.72)", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: `${c}12`, border: `1px solid ${c}22`, fontSize: 9, fontWeight: 700, color: c }}>{fmtLabel[s.format]}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                        <Clock size={8} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} strokeWidth={2} />
                        {s.freq}
                      </span>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                        <Users size={8} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} strokeWidth={2} />
                        {s.recipients} destinatário{s.recipients > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
                      Próximo envio: <span style={{ color: "#10b981", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{s.next}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Histórico de Exports ───────────────────────────────────────────── */}
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "100px 1fr 80px 1fr 70px 90px",
            gap: 8, padding: "10px 20px",
            background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)",
            alignItems: "center",
          }}>
            {["DATA", "TÍTULO", "FORMATO", "DESTINATÁRIO", "MÓDULOS", "STATUS"].map(h => (
              <span key={h} style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)" }}>{h}</span>
            ))}
          </div>

          {HISTORY.map((h, i) => {
            const c = fmtColor[h.format];
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "100px 1fr 80px 1fr 70px 90px",
                gap: 8, padding: "13px 20px", alignItems: "center",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: i < HISTORY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                animation: `ex-appear 0.3s ease ${i * 0.05}s both`,
              }}>
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>{h.date}</span>

                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{h.title}</span>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ padding: "2px 9px", borderRadius: 5, background: `${c}12`, border: `1px solid ${c}25`, fontSize: 9.5, fontWeight: 800, color: c }}>
                    {fmtLabel[h.format]}
                  </div>
                </div>

                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.recipient}</span>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono, monospace" }}>{h.modules}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>mód.</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle2 size={11} style={{ color: "#10b981" }} strokeWidth={2} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#10b981" }}>Enviado</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
