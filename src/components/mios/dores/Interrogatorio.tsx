import { type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "critica" | "alta" | "media";
type Impact   = "alto"    | "medio";

interface PainItem {
  num:         string;
  title:       string;
  verbatim:    string;
  source:      string;
  occurrences: string;
  opportunity: string;
  tags:        string[];
  severity:    Severity;
}

interface ChannelStat {
  channel:    string;
  percentage: number;
  count:      string;
  color:      string;
}

interface OpportunityItem {
  title:       string;
  linkedPains: string[];
  impact:      Impact;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAINS: PainItem[] = [
  {
    num:         "01",
    title:       "Atendimento que desaparece após o pagamento",
    verbatim:    "Paguei o pacote completo e depois disso nunca mais consegui agendar nada. Simplesmente sumiu.",
    source:      "Google Reviews",
    occurrences: "847 menções · últimos 6 meses",
    opportunity: "Protocolo de acompanhamento pós-venda com check-in automático em D+7",
    tags:        ["Pós-venda", "Abandono", "Confiança"],
    severity:    "critica",
  },
  {
    num:         "02",
    title:       "Resultado prometido não entregue",
    verbatim:    "Me venderam o sonho, fizeram o procedimento errado e ainda negaram qualquer ressarcimento.",
    source:      "Reclame Aqui",
    occurrences: "312 reclamações · 43% sem resolução",
    opportunity: "Protocolo documentado com foto antes/depois e resultado garantido por escrito",
    tags:        ["Resultado", "Promessa", "Credibilidade"],
    severity:    "critica",
  },
  {
    num:         "03",
    title:       "Precificação opaca e custos ocultos",
    verbatim:    "O preço que vi no Instagram era só a avaliação. O procedimento custou quatro vezes mais.",
    source:      "Grupos Facebook",
    occurrences: "Recorrente em 28 grupos · SP e RJ",
    opportunity: "Preço final publicado com todas as taxas — transparência como diferencial de venda",
    tags:        ["Preço", "Transparência", "Confiança"],
    severity:    "alta",
  },
  {
    num:         "04",
    title:       "Tempo de espera absurdo e agenda impossível",
    verbatim:    "Esperei uma hora e quarenta minutos. Quando reclamei, a atendente disse que era normal.",
    source:      "Google Reviews",
    occurrences: "189 menções · nota média 2.1★",
    opportunity: "Agendamento digital com confirmação instantânea e tolerância zero a atraso",
    tags:        ["Tempo", "Experiência", "Respeito"],
    severity:    "alta",
  },
  {
    num:         "05",
    title:       "Nenhum acompanhamento após o procedimento",
    verbatim:    "Tive reação alérgica três dias depois e tive que me virar completamente sozinha.",
    source:      "Reddit BR + grupos WhatsApp",
    occurrences: "76 relatos mapeados · últimos 6 meses",
    opportunity: "Follow-up estruturado D+3, D+7 e D+30 com protocolo de intercorrências",
    tags:        ["Segurança", "Pós-venda", "Fidelização"],
    severity:    "media",
  },
];

const CHANNELS: ChannelStat[] = [
  { channel: "Google Reviews",   percentage: 41, count: "1.247 menções", color: "#ef4444" },
  { channel: "Grupos Facebook",  percentage: 28, count: "847 posts",     color: "#f97316" },
  { channel: "Reclame Aqui",     percentage: 19, count: "312 registros", color: "#f59e0b" },
  { channel: "Reddit BR",        percentage:  7, count: "214 threads",   color: "#6366f1" },
  { channel: "WhatsApp Groups",  percentage:  5, count: "~140 relatos",  color: "#10b981" },
];

const OPPORTUNITIES: OpportunityItem[] = [
  {
    title:       "Sistema de Garantia de Resultado",
    linkedPains: ["01", "02"],
    impact:      "alto",
    description: "Nenhum player oferece garantia formal. Protocolo documentado com foto antes/depois elimina a dor mais recorrente do mercado — e vira o principal argumento de vendas.",
  },
  {
    title:       "Janela Noturna de Atendimento",
    linkedPains: ["01", "04"],
    impact:      "alto",
    description: "100% das clínicas mapeadas param de responder após 19h. A janela 21h–23h30 concentra 34% das buscas por agendamento — completamente ignorada pelos concorrentes.",
  },
  {
    title:       "Precificação Radical Transparente",
    linkedPains: ["03"],
    impact:      "medio",
    description: "Publicar o preço final com todas as taxas inclusas converte 2.3× mais leads qualificados que o modelo 'a partir de'.",
  },
];

// ─── Visual config per pain index ─────────────────────────────────────────────

const VERBATIM_CFG = [
  { fontSize: 21, color: "rgba(255,149,0,0.90)",   counterOpacity: 0.08, quoteOpacity: 0.28 },
  { fontSize: 18, color: "rgba(255,255,255,0.78)", counterOpacity: 0.055, quoteOpacity: 0.18 },
  { fontSize: 16, color: "rgba(255,255,255,0.63)", counterOpacity: 0.042, quoteOpacity: 0.13 },
  { fontSize: 14, color: "rgba(255,255,255,0.50)", counterOpacity: 0.032, quoteOpacity: 0.09 },
  { fontSize: 13, color: "rgba(255,255,255,0.38)", counterOpacity: 0.025, quoteOpacity: 0.07 },
];

const SEV_CFG: Record<Severity, { label: string; color: string; bg: string }> = {
  critica: { label: "CRÍTICA", color: "#ef4444", bg: "rgba(239,68,68,0.12)"  },
  alta:    { label: "ALTA",    color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  media:   { label: "MÉDIA",   color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Interrogatorio() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>

      {/* ── Module header ─────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 3, height: 20, background: "#ef4444", borderRadius: 2, flexShrink: 0 }} />
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 3,
            color: "#ef4444", fontFamily: "JetBrains Mono, monospace",
          }}>
            MÓDULO 01 · O INTERROGATÓRIO
          </span>
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 900, letterSpacing: -0.7,
          color: "rgba(255,255,255,0.92)", lineHeight: 1.15, marginBottom: 14,
        }}>
          O que o mercado confessa
          <br />
          <span style={{ color: "#ef4444" }}>quando ninguém está olhando.</span>
        </h1>

        {/* Stats strip */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "DORES MAPEADAS",    value: "5 críticas"           },
            { label: "FONTES ANALISADAS", value: "3.046"                },
            { label: "MERCADO",           value: "Estética Avançada SP" },
            { label: "PERÍODO",           value: "últimos 6 meses"      },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", flexDirection: "column",
              padding: "6px 12px",
              background: "rgba(255,255,255,0.022)",
              border: "1px solid rgba(255,255,255,0.055)",
              borderRadius: 6,
            }}>
              <span style={{
                fontSize: 7, fontWeight: 700, letterSpacing: 1.5,
                color: "rgba(255,255,255,0.22)", marginBottom: 2,
              }}>
                {s.label}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pain items ────────────────────────────────────── */}
      <div>
        {PAINS.map((pain, idx) => {
          const cfg = VERBATIM_CFG[idx];
          const sev = SEV_CFG[pain.severity];

          return (
            <div key={pain.num}>
              {/* Pain row */}
              <div style={{ display: "flex", gap: 0, paddingBottom: 4 }}>

                {/* Counter — large, monospace, very faint */}
                <div style={{ width: 68, flexShrink: 0, paddingTop: 6 }}>
                  <span style={{
                    fontSize: 60, fontWeight: 900, lineHeight: 1,
                    fontFamily: "JetBrains Mono, monospace",
                    color: `rgba(255,255,255,${cfg.counterOpacity})`,
                    letterSpacing: -4, userSelect: "none", display: "block",
                  }}>
                    {pain.num}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>

                  {/* Opening typographic quote */}
                  <div style={{
                    fontSize: 72, lineHeight: 0.55,
                    color: `rgba(255,149,0,${cfg.quoteOpacity})`,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    userSelect: "none", marginBottom: 4,
                  }}>
                    &#8220;
                  </div>

                  {/* Verbatim text */}
                  <p style={{
                    fontSize: cfg.fontSize,
                    fontWeight: idx < 2 ? 700 : 600,
                    color: cfg.color,
                    lineHeight: 1.5,
                    letterSpacing: idx === 0 ? -0.3 : 0,
                    marginBottom: 10,
                  }}>
                    {pain.verbatim}
                    <span style={{
                      fontSize: cfg.fontSize * 1.1, lineHeight: 0,
                      color: `rgba(255,149,0,${cfg.quoteOpacity})`,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      verticalAlign: "baseline", marginLeft: 3,
                    }}>
                      &#8221;
                    </span>
                  </p>

                  {/* Source line */}
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 12 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: 0.4,
                      color: "rgba(255,255,255,0.22)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}>
                      {pain.source} · {pain.occurrences}
                    </span>
                    <span style={{
                      fontSize: 8, fontWeight: 800, letterSpacing: 1,
                      color: sev.color, background: sev.bg,
                      borderRadius: 3, padding: "2px 7px",
                    }}>
                      {sev.label}
                    </span>
                  </div>

                  {/* Detail box — pain title + tags + gap opportunity */}
                  <div style={{
                    padding: "11px 14px",
                    background: "rgba(255,255,255,0.016)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 6,
                    marginBottom: 4,
                  }}>
                    {/* Title + tags */}
                    <div className="flex items-start justify-between gap-3 flex-wrap" style={{ marginBottom: 8 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: "rgba(255,255,255,0.58)",
                      }}>
                        {pain.title}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {pain.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: 8, fontWeight: 700, letterSpacing: 0.4,
                            color: "rgba(255,255,255,0.25)",
                            background: "rgba(255,255,255,0.035)",
                            borderRadius: 3, padding: "2px 6px",
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Gap opportunity */}
                    <div className="flex items-start gap-2">
                      <span style={{
                        fontSize: 8, fontWeight: 800, letterSpacing: 0.8,
                        color: "rgba(255,149,0,0.55)", flexShrink: 0, paddingTop: 1,
                      }}>
                        GAP →
                      </span>
                      <span style={{
                        fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.55,
                      }}>
                        {pain.opportunity}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Separator — whitespace + centered amber dot */}
              {idx < PAINS.length - 1 && (
                <div style={{ textAlign: "center", padding: "22px 0", userSelect: "none" }}>
                  <span style={{
                    display: "inline-block",
                    width: 5, height: 5, borderRadius: "50%",
                    background: `rgba(255,149,0,${0.38 - idx * 0.07})`,
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Channel patterns ──────────────────────────────── */}
      <div style={{
        marginTop: 52, paddingTop: 28,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          <div style={{ width: 3, height: 14, background: "#ef4444", borderRadius: 2 }} />
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 2.5,
            color: "rgba(255,255,255,0.28)",
          }}>
            ONDE AS DORES APARECEM COM MAIS FREQUÊNCIA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {CHANNELS.map(ch => (
            <div key={ch.channel} className="flex items-center gap-3">
              <span style={{
                width: 140, fontSize: 10, fontWeight: 600, textAlign: "right",
                color: "rgba(255,255,255,0.4)", flexShrink: 0,
              }}>
                {ch.channel}
              </span>
              <div style={{
                flex: 1, height: 5,
                background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${ch.percentage}%`,
                  background: `linear-gradient(90deg, ${ch.color}95, ${ch.color}45)`,
                  borderRadius: 3,
                }} />
              </div>
              <span style={{
                width: 30, fontSize: 10, fontWeight: 700, textAlign: "right",
                color: ch.color, flexShrink: 0,
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {ch.percentage}%
              </span>
              <span style={{
                width: 95, fontSize: 9, color: "rgba(255,255,255,0.18)", flexShrink: 0,
              }}>
                {ch.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Opportunities in the pain ─────────────────────── */}
      <div style={{
        marginTop: 44, paddingTop: 28,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        marginBottom: 48,
      }}>
        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 3, height: 14, background: "var(--accent)", borderRadius: 2 }} />
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 2.5,
              color: "rgba(255,255,255,0.28)",
            }}>
              OPORTUNIDADES NAS DORES
            </span>
          </div>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: 0.8,
            color: "rgba(255,149,0,0.65)",
            background: "rgba(255,149,0,0.07)",
            border: "1px solid rgba(255,149,0,0.15)",
            borderRadius: 3, padding: "2px 8px",
          }}>
            NENHUM PLAYER RESOLVE AINDA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OPPORTUNITIES.map((opp) => (
            <div key={opp.title} style={{
              display: "flex", gap: 16, padding: "14px 16px",
              background: "rgba(255,149,0,0.025)",
              border: "1px solid rgba(255,149,0,0.09)",
              borderRadius: 8,
            }}>

              {/* Left: impact + linked pains */}
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, flexShrink: 0, paddingTop: 2,
              }}>
                <span style={{
                  fontSize: 7, fontWeight: 800, letterSpacing: 0.8, whiteSpace: "nowrap",
                  color: opp.impact === "alto" ? "#ef4444" : "#f59e0b",
                  background: opp.impact === "alto"
                    ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                  borderRadius: 3, padding: "3px 7px",
                }}>
                  IMPACTO {opp.impact.toUpperCase()}
                </span>
                <div style={{ display: "flex", gap: 3 }}>
                  {opp.linkedPains.map(p => (
                    <span key={p} style={{
                      fontSize: 7, fontWeight: 700,
                      color: "rgba(255,149,0,0.5)",
                      background: "rgba(255,149,0,0.07)",
                      borderRadius: 2, padding: "1px 5px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: title + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.78)", marginBottom: 5,
                }}>
                  {opp.title}
                </div>
                <p style={{
                  fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.6,
                }}>
                  {opp.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
