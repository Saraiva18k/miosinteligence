import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  FileText,
  TrendingUp,
  Users,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Calendar,
  BarChart3,
  Lightbulb,
  Flag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  numeral: string;
  title: string;
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC: TocItem[] = [
  { id: "sumario",    numeral: "I",    title: "Sumario Executivo"       },
  { id: "mercado",    numeral: "II",   title: "Analise de Mercado"      },
  { id: "proposta",   numeral: "III",  title: "Proposta de Valor"       },
  { id: "modelo",     numeral: "IV",   title: "Modelo de Negocio"       },
  { id: "marketing",  numeral: "V",    title: "Go-to-Market"            },
  { id: "financeiro", numeral: "VI",   title: "Projecoes Financeiras"   },
  { id: "roadmap",    numeral: "VII",  title: "Roadmap de Execucao"     },
  { id: "riscos",     numeral: "VIII", title: "Analise de Riscos"       },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionHeader({ numeral, title, subtitle }: { numeral: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <span style={{
          fontSize: 12, fontWeight: 800, color: "rgba(255,149,0,0.5)",
          fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5,
          userSelect: "none",
        }}>
          {numeral}
        </span>
        <h2 style={{
          fontSize: 15, fontWeight: 800,
          color: "rgba(255,255,255,0.88)", letterSpacing: -0.3,
        }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", paddingLeft: 28 }}>
          {subtitle}
        </p>
      )}
      <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255,149,0,0.3), transparent)", marginTop: 10 }} />
    </div>
  );
}

function PullQuote({ text, author }: { text: string; author?: string }) {
  return (
    <div style={{
      borderLeft: "3px solid rgba(255,149,0,0.5)",
      padding: "12px 18px",
      margin: "20px 0",
      background: "rgba(255,149,0,0.04)",
      borderRadius: "0 8px 8px 0",
    }}>
      <p style={{
        fontSize: 13, fontStyle: "italic", fontWeight: 500,
        color: "rgba(255,255,255,0.75)", lineHeight: 1.65,
      }}>
        "{text}"
      </p>
      {author && (
        <p style={{ fontSize: 12, color: "rgba(255,149,0,0.6)", marginTop: 6, fontWeight: 600 }}>
          — {author}
        </p>
      )}
    </div>
  );
}

function DataCallout({ label, value, sub, color = "var(--accent)" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}25`,
      borderTop: `2px solid ${color}`,
      borderRadius: "0 0 8px 8px",
      padding: "10px 14px",
      minWidth: 120,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginBottom: 4 }}>
        {label}
      </span>
      <span style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{sub}</span>}
    </div>
  );
}

function DataRow({ items }: { items: Array<{ label: string; value: string; sub?: string; color?: string }> }) {
  return (
    <div className="flex gap-3 flex-wrap my-5">
      {items.map(item => <DataCallout key={item.label} {...item} />)}
    </div>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, marginBottom: 14 }}>
      {children}
    </p>
  );
}

function BulletList({ items, color = "var(--accent)" }: { items: string[]; color?: string }) {
  return (
    <div className="space-y-2 mb-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <ChevronRight size={11} style={{ color, marginTop: 3, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function RiskRow({ risk, prob, impact, mitigation }: {
  risk: string; prob: "alta" | "media" | "baixa"; impact: "alto" | "medio" | "baixo"; mitigation: string;
}) {
  const PROB_COLOR: Record<string, string> = { alta: "#ef4444", media: "#f59e0b", baixa: "#10b981" };
  const IMP_COLOR: Record<string, string>  = { alto: "#ef4444", medio: "#f59e0b", baixo: "#10b981" };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 80px 80px 1fr",
      gap: 12, padding: "10px 14px", alignItems: "start",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{risk}</span>
      <span style={{
        fontSize: 11, fontWeight: 700, textAlign: "center",
        color: PROB_COLOR[prob], background: `${PROB_COLOR[prob]}15`,
        borderRadius: 5, padding: "3px 0",
      }}>
        {prob.toUpperCase()}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 700, textAlign: "center",
        color: IMP_COLOR[impact], background: `${IMP_COLOR[impact]}15`,
        borderRadius: 5, padding: "3px 0",
      }}>
        {impact.toUpperCase()}
      </span>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.4, fontStyle: "italic" }}>
        {mitigation}
      </span>
    </div>
  );
}

function MilestoneRow({ phase, period, items, done }: {
  phase: string; period: string; items: string[]; done?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: done ? "rgba(16,185,129,0.15)" : "rgba(255,149,0,0.1)",
          border: `1.5px solid ${done ? "#10b981" : "rgba(255,149,0,0.4)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {done
            ? <CheckCircle size={13} style={{ color: "#10b981" }} />
            : <Flag size={11} style={{ color: "var(--accent)" }} />
          }
        </div>
        <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.06)", marginTop: 4 }} />
      </div>
      <div style={{ paddingBottom: 20, flex: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{phase}</span>
          <span style={{
            fontSize: 11, color: done ? "#10b981" : "rgba(255,149,0,0.7)",
            background: done ? "rgba(16,185,129,0.08)" : "rgba(255,149,0,0.07)",
            border: `1px solid ${done ? "rgba(16,185,129,0.2)" : "rgba(255,149,0,0.2)"}`,
            borderRadius: 4, padding: "1px 6px", fontWeight: 600,
          }}>
            {period}
          </span>
        </div>
        <div className="space-y-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section content components ───────────────────────────────────────────────

function SumarioExecutivo() {
  return (
    <div>
      <Paragraph>
        O presente plano de negocios descreve a estrutura, o posicionamento e a estrategia de crescimento de um studio de estetica avancada direcionado ao segmento premium de Sao Paulo. O negocio opera em um mercado de R$47 bilhoes anuais no Brasil, com crescimento consistente de 8-12% ao ano mesmo em periodos de contracao economica — reflexo da consolidacao da estetica como categoria de necessidade percebida, nao de luxo.
      </Paragraph>
      <Paragraph>
        A proposta central se diferencia em tres eixos: especializacao tecnica profunda (nao atendimento generalista), experiencia de cliente radicalmente superior (tempo de espera zero, agendamento digital instantaneo, comunicacao proativa) e construcao de autoridade via conteudo — gerando demanda organica de medio prazo a custo marginal decrescente.
      </Paragraph>
      <PullQuote
        text="O mercado nao precisa de mais um studio de estetica. Precisa de um studio que resolva o que os outros nao resolvem: confianca, resultado e tempo."
        author="Tese estrategica do negocio"
      />
      <DataRow items={[
        { label: "MERCADO TOTAL SP",  value: "R$8.2bi", sub: "estetica avancada", color: "var(--accent)" },
        { label: "CRESCIMENTO ANUAL", value: "+11%",    sub: "ultimos 3 anos",    color: "#10b981" },
        { label: "TICKET MEDIO META", value: "R$310",   sub: "cenario realista",  color: "var(--accent)" },
        { label: "BREAKEVEN",         value: "Mes 5",   sub: "cenario realista",  color: "#f59e0b" },
      ]} />
      <Paragraph>
        O plano de 12 meses projeta receita acumulada de R$148k no cenario realista, com margem liquida de 34% apos o terceiro mes operacional. O investimento inicial de R$28k e recuperado integralmente no quinto mes, com ROI de 67% ao final do primeiro ano.
      </Paragraph>
    </div>
  );
}

function AnaliseMercado() {
  return (
    <div>
      <Paragraph>
        A analise de mercado conduzida pelo MIOS identificou quatro concorrentes diretos em raio de 5km, com niveis de ameaca distribuidos entre critico e baixo. O principal concorrente (Beleza Premium SP) detém presenca de marketing superior — 42k seguidores no Instagram, anuncios ativos no Google — porem apresenta falha critica no atendimento: tempo medio de espera de 45 minutos e avaliacao de 3.8/5 no Google.
      </Paragraph>
      <DataRow items={[
        { label: "CONCORRENTES MAPEADOS", value: "4",    sub: "raio 5km",          color: "var(--accent)" },
        { label: "AMEACA CRITICA",        value: "1",    sub: "Beleza Premium SP",  color: "#ef4444" },
        { label: "GAP DE ATENDIMENTO",    value: "45min",sub: "espera media deles", color: "#f59e0b" },
        { label: "AVALIACAO MEDIA",       value: "3.8★", sub: "principal rival",    color: "#f59e0b" },
      ]} />
      <Paragraph>
        As duas personas primarias identificadas — Mariana (34 anos, gerente, R$8-14k/mes) e Claudia (48 anos, empresaria, R$18-35k/mes) — apresentam comportamentos de compra distintos que exigem abordagens de marketing separadas. Mariana converte predominantemente entre 22h-23h30 via Instagram e WhatsApp; Claudia decide por indicacao direta e fecha pacotes completos apos contato telefonico qualificado.
      </Paragraph>
      <PullQuote text="A janela de conversao noturna de Mariana (22h-23h30) e ignorada por 100% dos concorrentes mapeados — nenhum responde WhatsApp nesse horario." />
      <BulletList items={[
        "Tendencia de alta em procedimentos minimamente invasivos (+340% em buscas nos ultimos 6 meses)",
        "Crescimento de 28% em buscas por 'estetica com agendamento online' no periodo analisado",
        "TikTok como canal de descoberta em ascensao — Studio Renata (2o rival) ausente totalmente",
        "Demanda reprimida por atendimento premium com agendamento digital — nenhum rival oferece",
      ]} />
    </div>
  );
}

function PropostaValor() {
  return (
    <div>
      <Paragraph>
        A proposta de valor e construida sobre tres pilares interdependentes que, em conjunto, criam uma oferta que os concorrentes nao conseguem replicar rapidamente por questao de cultura organizacional — nao apenas de recursos.
      </Paragraph>

      {[
        {
          icon: <Zap size={14} />,
          color: "var(--accent)",
          title: "Resultado Garantido e Mensuravel",
          body: "Cada procedimento tem fotografia de antes/depois padronizada, protocolo documentado e acompanhamento estruturado. O cliente sabe exatamente o que vai acontecer, quando e como sera avaliado o resultado.",
        },
        {
          icon: <Users size={14} />,
          color: "#6366f1",
          title: "Experiencia de Atendimento Sem Friccao",
          body: "Agendamento em menos de 2 minutos pelo WhatsApp, confirmacao automatica, lembrete 24h antes, sem fila de espera. Resposta garantida em menos de 5 minutos entre 7h e 23h — incluindo a janela noturna ignorada pelos rivais.",
        },
        {
          icon: <Lightbulb size={14} />,
          color: "#10b981",
          title: "Autoridade Construida via Conteudo",
          body: "Producao semanal de conteudo educativo sobre os procedimentos oferecidos — gerando busca organica, reduzindo CAC no medio prazo e posicionando a profissional como referencia tecnica antes mesmo de o cliente agendar.",
        },
      ].map(pillar => (
        <div key={pillar.title} style={{
          display: "flex", gap: 14, padding: "14px 16px", marginBottom: 10,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
          borderLeft: `3px solid ${pillar.color}`, borderRadius: "0 8px 8px 0",
        }}>
          <div style={{ color: pillar.color, marginTop: 2, flexShrink: 0 }}>{pillar.icon}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
              {pillar.title}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{pillar.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ModeloNegocio() {
  return (
    <div>
      <Paragraph>
        O modelo de receita e hibrido: sessoes avulsas como porta de entrada (menor barreira) e pacotes trimestrais como ancora de retencao (maior LTV e previsibilidade). A meta e migrar 60% da base para o modelo de pacote nos primeiros 6 meses.
      </Paragraph>

      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Produto", "Ticket", "Frequencia", "LTV 6M", "Margem"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.25)", letterSpacing: 0.7 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { produto: "Sessao Avulsa",      ticket: "R$280", freq: "1.2x/mes", ltv: "R$2.016", margem: "31%", accent: false },
              { produto: "Pacote Trimestral",  ticket: "R$720", freq: "1x/trim",  ltv: "R$2.880", margem: "42%", accent: true  },
              { produto: "Plano Mensal VIP",   ticket: "R$490", freq: "1x/mes",   ltv: "R$2.940", margem: "46%", accent: false },
            ].map(row => (
              <tr key={row.produto} style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: row.accent ? "rgba(255,149,0,0.04)" : "transparent",
              }}>
                <td style={{ padding: "9px 12px", fontSize: 13, fontWeight: row.accent ? 700 : 400,
                  color: row.accent ? "var(--accent)" : "rgba(255,255,255,0.65)" }}>{row.produto}</td>
                <td style={{ padding: "9px 12px", fontSize: 13, fontFamily: "JetBrains Mono, monospace",
                  color: "rgba(255,255,255,0.7)" }}>{row.ticket}</td>
                <td style={{ padding: "9px 12px", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{row.freq}</td>
                <td style={{ padding: "9px 12px", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                  color: "#10b981" }}>{row.ltv}</td>
                <td style={{ padding: "9px 12px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{row.margem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paragraph>
        A estrutura de custos e composta por 65% custos fixos (aluguel, salario, subscricoes) e 35% custos variaveis (insumos, percentual de receita). A alavanca principal de margem e o aumento de ticket via pacotes — cada 10% de migracao de avulso para pacote melhora a margem liquida em ~2.5 pontos percentuais.
      </Paragraph>
    </div>
  );
}

function GoToMarket() {
  return (
    <div>
      <Paragraph>
        A estrategia de go-to-market e faseada em tres horizons: aquisicao rapida via prova social nos primeiros 90 dias, construcao de autoridade organica nos meses 4-8, e expansao via indicacao estruturada a partir do mes 9.
      </Paragraph>

      {[
        {
          phase: "Horizonte 1 — Lancamento (Dias 1-90)",
          color: "var(--accent)",
          channels: [
            "Instagram: 3 posts/semana de antes/depois com depoimento em video",
            "WhatsApp: broadcast semanal para lista inicial de contatos (minimo 200 numeros)",
            "Google Meu Negocio: otimizacao completa + campanha de avaliacao ativa",
            "Oferta de lancamento: 20% off primeira sessao para as primeiras 30 clientes",
          ],
        },
        {
          phase: "Horizonte 2 — Autoridade (Meses 4-8)",
          color: "#6366f1",
          channels: [
            "TikTok: 2x/semana — conteudo educativo sobre procedimentos (canal sem concorrencia direta)",
            "Blog/SEO: 1 artigo mensal com busca organica qualificada",
            "Programa de indicacao: desconto progressivo por indicacao confirmada",
            "Parcerias: 2-3 negocios complementares (academias, clinicas medicas, saloes)",
          ],
        },
        {
          phase: "Horizonte 3 — Escala (Mes 9+)",
          color: "#10b981",
          channels: [
            "Google Ads: campanha com base em palavras-chave de alta intencao de compra",
            "Embaixadoras: programa formal com top 10% das clientes mais ativas",
            "Retargeting: automacao de recuperacao de clientes inativos via WhatsApp",
            "Expansion: avaliacao de segunda cadeira ou segundo profissional",
          ],
        },
      ].map(h => (
        <div key={h.phase} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: h.color, marginBottom: 8,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: h.color }} />
            {h.phase}
          </div>
          <BulletList items={h.channels} color={h.color} />
        </div>
      ))}
    </div>
  );
}

function ProjecoesFinanceiras() {
  return (
    <div>
      <Paragraph>
        As projecoes financeiras completas estao disponiveis no modulo Investimento com simulacao interativa de cenarios. O resumo executivo consolida os tres cenarios no horizonte de 12 meses com os parametros do cenario realista como referencia central.
      </Paragraph>
      <DataRow items={[
        { label: "INVESTIMENTO INICIAL", value: "R$28k",  sub: "capex total",        color: "#f59e0b" },
        { label: "CUSTO FIXO MENSAL",    value: "R$4.8k", sub: "estrutura operacional",color: "#ef4444"},
        { label: "RECEITA ANO 1",        value: "R$148k", sub: "cenario realista",    color: "#10b981" },
        { label: "LUCRO ANO 1",          value: "R$50k",  sub: "margem 34%",          color: "#10b981" },
        { label: "ROI 12 MESES",         value: "+67%",   sub: "retorno sobre capital",color: "var(--accent)" },
      ]} />
      <PullQuote text="O negocio atinge autossustentabilidade no mes 5 e gera caixa positivo suficiente para financiar o proprio crescimento sem necessidade de aporte externo a partir do mes 8." />
      <Paragraph>
        Os tres cenarios modelados — pessimista (ticket 71% do base, crescimento 3%/mes), realista (base) e otimista (ticket 135%, crescimento 12%/mes) — demonstram que mesmo no cenario pessimista o negocio e viavel, com breakeven no mes 9 e ROI positivo de 18% ao final do primeiro ano.
      </Paragraph>
    </div>
  );
}

function RoadmapExecucao() {
  return (
    <div>
      <Paragraph>
        O roadmap e estruturado em quatro marcos executivos com entregaveis claros e criterios de sucesso mensuraveis. A sequencia foi desenhada para minimizar risco de caixa e maximizar velocidade de aprendizado.
      </Paragraph>
      <div style={{ marginTop: 8 }}>
        <MilestoneRow
          phase="Pre-operacional"
          period="Semanas 1-4"
          done
          items={[
            "Reforma e adaptacao do espaco finalizada",
            "Equipamentos instalados e testados",
            "Site e agendamento online no ar",
            "Perfil Instagram otimizado com 12 posts de aquecimento",
          ]}
        />
        <MilestoneRow
          phase="Lancamento e Validacao"
          period="Meses 1-2"
          items={[
            "Meta: 28 clientes no mes 1, 30 no mes 2",
            "Coletar minimo 20 avaliacoes no Google",
            "Taxa de retorno de 40% das clientes do mes 1",
            "Primeiro pacote trimestral fechado",
          ]}
        />
        <MilestoneRow
          phase="Crescimento e Retencao"
          period="Meses 3-6"
          items={[
            "Atingir breakeven (mes 5) — lucro > R$0",
            "30% da base em modelo de pacote",
            "Lancar no TikTok com primeiro video com +1k views",
            "Programa de indicacao ativo com pelo menos 5 embaixadoras",
          ]}
        />
        <MilestoneRow
          phase="Escala e Consolidacao"
          period="Meses 7-12"
          items={[
            "Meta de 60 clientes ativos/mes",
            "Avaliacao Google acima de 4.8 estrelas",
            "Receita recorrente (pacotes) acima de 50% do faturamento",
            "Decisao informada sobre expansao de capacidade",
          ]}
        />
      </div>
    </div>
  );
}

function AnaliseRiscos() {
  return (
    <div>
      <Paragraph>
        A matriz de riscos consolida os principais vetores de ameaca ao negocio com probabilidade estimada, impacto financeiro e estrategia de mitigacao correspondente. Riscos com probabilidade alta e impacto alto exigem plano de contingencia ativo — nao apenas monitoramento.
      </Paragraph>

      <div style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden", marginBottom: 16,
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 80px 80px 1fr",
          gap: 12, padding: "8px 14px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {["Risco", "Prob.", "Impacto", "Mitigacao"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 0.7 }}>
              {h}
            </span>
          ))}
        </div>
        <RiskRow
          risk="Rotatividade de clientes acima do projetado (churn > 40%)"
          prob="media" impact="alto"
          mitigation="Programa de fidelizacao ativo desde o mes 1; follow-up automatizado pos-sessao"
        />
        <RiskRow
          risk="Equipamento principal com defeito fora da garantia"
          prob="baixa" impact="alto"
          mitigation="Contrato de manutencao preventiva; fundo de reserva tecnica de R$2k"
        />
        <RiskRow
          risk="Entrada de concorrente premium com preco de penetracao"
          prob="baixa" impact="medio"
          mitigation="Diferenciacao por relacionamento e autoridade — dificil de replicar rapidamente"
        />
        <RiskRow
          risk="Sazonalidade negativa (jan-fev, periodos de ferias)"
          prob="alta" impact="medio"
          mitigation="Pacotes anuais pre-pagos; promocoes de retencao em periodos de baixa previstos"
        />
        <RiskRow
          risk="Dificuldade de crescimento organico alem do mes 3"
          prob="media" impact="medio"
          mitigation="Google Ads ativado como alavanca paga no mes 4 se meta organica nao atingida"
        />
      </div>

      <div style={{
        background: "rgba(16,185,129,0.05)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: 8, padding: "12px 16px",
      }}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={12} style={{ color: "#10b981" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>VANTAGEM DEFENSIVA</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          O maior ativo defensivo do negocio e a relacao de confianca construida cliente a cliente. Concorrentes podem copiar procedimentos, equipamentos e ate precos — mas nao conseguem replicar o historico de resultados e a credibilidade acumulada com cada cliente atendida.
        </p>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "sumario",    numeral: "I",    title: "Sumario Executivo",     subtitle: "Visao geral estrategica e financeira do negocio",              Component: SumarioExecutivo   },
  { id: "mercado",    numeral: "II",   title: "Analise de Mercado",    subtitle: "Concorrentes, personas e oportunidades identificadas",          Component: AnaliseMercado     },
  { id: "proposta",   numeral: "III",  title: "Proposta de Valor",     subtitle: "Os tres pilares que diferenciam o negocio",                    Component: PropostaValor      },
  { id: "modelo",     numeral: "IV",   title: "Modelo de Negocio",     subtitle: "Receitas, custos e estrutura de produtos",                     Component: ModeloNegocio      },
  { id: "marketing",  numeral: "V",    title: "Go-to-Market",          subtitle: "Estrategia de lancamento e crescimento em 3 horizontes",       Component: GoToMarket         },
  { id: "financeiro", numeral: "VI",   title: "Projecoes Financeiras", subtitle: "Resumo executivo dos 3 cenarios — ver modulo Investimento",    Component: ProjecoesFinanceiras},
  { id: "roadmap",    numeral: "VII",  title: "Roadmap de Execucao",   subtitle: "Marcos e entregaveis para os primeiros 12 meses",              Component: RoadmapExecucao    },
  { id: "riscos",     numeral: "VIII", title: "Analise de Riscos",     subtitle: "Matriz de riscos, probabilidades e planos de mitigacao",       Component: AnaliseRiscos      },
];

export function Manuscript() {
  const [activeSection, setActiveSection] = useState("sumario");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track active section on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const containerTop = container.scrollTop;
      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = sectionRefs.current[section.id];
        if (el && el.offsetTop - 80 <= containerTop) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    const container = scrollRef.current;
    if (el && container) {
      container.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-6" style={{ minHeight: 0 }}>

      {/* ── Sticky TOC ─────────────────────────────────────────────── */}
      <div style={{ width: 188, flexShrink: 0 }}>
        <div style={{
          position: "sticky", top: 0,
          background: "var(--card)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12, padding: "16px 0", overflow: "hidden",
        }}>
          <div style={{ padding: "0 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2">
              <FileText size={11} style={{ color: "var(--accent)", opacity: 0.7 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 0.8 }}>
                INDICE
              </span>
            </div>
          </div>
          <nav style={{ padding: "8px 0" }}>
            {TOC.map(item => {
              const isActive = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  style={{
                    width: "100%", textAlign: "left", padding: "7px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                    background: isActive ? "rgba(255,149,0,0.07)" : "transparent",
                    borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                    border: "none", borderRight: "none", borderTop: "none", borderBottom: "none",
                    borderLeftWidth: 2,
                    borderLeftStyle: "solid",
                    borderLeftColor: isActive ? "var(--accent)" : "transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <span style={{
                    fontSize: 10, fontWeight: 800,
                    color: isActive ? "var(--accent)" : "rgba(255,255,255,0.2)",
                    fontFamily: "JetBrains Mono, monospace",
                    width: 22, flexShrink: 0,
                  }}>
                    {item.numeral}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: isActive ? 700 : 400,
                    color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>
          {/* Completion */}
          <div style={{ padding: "12px 16px 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>COMPLETUDE</div>
            <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 4 }}>
              <div style={{ height: "100%", width: "78%", borderRadius: 2, background: "var(--accent)" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
              78%
            </div>
          </div>
        </div>
      </div>

      {/* ── Document body ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 min-w-0 overflow-y-auto mios-scroll"
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        {/* Document cover strip */}
        <div style={{
          background: "var(--card)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12, padding: "20px 28px", marginBottom: 20,
        }}>
          <div className="flex items-start justify-between">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,149,0,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
                BUSINESS PLAN · DOCUMENTO EXECUTIVO
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.92)", letterSpacing: -0.5, marginBottom: 4 }}>
                O Manuscrito
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                Studio Estetica Premium · Itaim Bibi, SP · Versao 1.0
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>GERADO EM</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)",
                  fontFamily: "JetBrains Mono, monospace" }}>
                  Mai 2026
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                borderRadius: 7, padding: "6px 12px",
              }}>
                <BarChart3 size={11} style={{ color: "#10b981" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Pronto para investidor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8" style={{ paddingBottom: 48 }}>
          {SECTIONS.map(section => (
            <div
              key={section.id}
              ref={el => { sectionRefs.current[section.id] = el; }}
              style={{
                background: "var(--card)",
                border: "1px solid rgba(255,255,255,0.055)",
                borderRadius: 12, padding: "24px 28px",
              }}
            >
              <SectionHeader
                numeral={section.numeral}
                title={section.title}
                subtitle={section.subtitle}
              />
              <section.Component />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
