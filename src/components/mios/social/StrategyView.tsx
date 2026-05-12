import { useState } from "react";
import { Check, ArrowUp, X, Instagram, Music2, Linkedin, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ───────────── BLOCO 1 ───────────── */
function Diagnostico() {
  return (
    <div
      className="verdict-hero mios-float relative"
      style={{
        background: "rgba(255,149,0,0.05)",
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        border: "1px solid rgba(255,149,0,0.15)",
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2.5px",
          color: "rgba(255,149,0,0.55)",
        }}
      >
        DIAGNÓSTICO SOCIAL
      </div>
      <h2
        className="mt-2"
        style={{
          fontSize: 20,
          fontWeight: 900,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: "-0.8px",
          lineHeight: 1.2,
        }}
      >
        Seus concorrentes têm presença. Não têm estratégia.
      </h2>
      <p
        className="mt-2"
        style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: 720 }}
      >
        O mercado de estética SP nas redes sociais é um território de alta frequência e baixa
        inteligência. Todo mundo posta. Ninguém converte com intenção. Essa é a sua vantagem.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ fontSize: 13 }}>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>
          <strong style={{ color: "#ff9500", fontWeight: 700 }}>0</strong> canais YouTube ativos
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>
          <strong style={{ color: "#ff9500", fontWeight: 700 }}>89x</strong> "que clínica é essa?"
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>
          <strong style={{ color: "#ff9500", fontWeight: 700 }}>23</strong> comentários negativos ignorados pelo líder
        </span>
      </div>
    </div>
  );
}

/* ───────────── BLOCO 2 ───────────── */
const worksCards = [
  {
    works: "Antes/depois com foto única gera alto engajamento.",
    surpass:
      "Mesmo formato + preço visível no post. Eles nunca mostram preço. Você mostra. Quebra o padrão e converte mais.",
  },
  {
    works: "Bastidores do dia a dia geram 3x mais salvamentos.",
    surpass:
      "Mostrar bastidores COM preços e processo explicado. Eles fazem mistério. Você faz transparência total.",
  },
  {
    works: "Stories de depoimento oral (sem corte) têm alta retenção.",
    surpass:
      'Depoimento + resultado quantificado ("perdeu 8cm em 3 sessões"). Eles não medem. Você mede.',
  },
  {
    works: "Reels com música trending alcançam mais não-seguidores.",
    surpass:
      "Mesmo formato mas com CTA direto para preço no primeiro comentário fixado. Eles não têm CTA claro.",
  },
];

function WhatWorks() {
  return (
    <section>
      <div
        className="mb-3"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        O QUE FUNCIONA — E COMO FAZER MELHOR
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {worksCards.map((c, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.025)",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div className="flex items-center gap-1.5">
              <Check size={10} strokeWidth={2.6} style={{ color: "rgba(16,185,129,0.7)" }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  color: "rgba(16,185,129,0.6)",
                }}
              >
                O QUE FUNCIONA PARA ELES
              </span>
            </div>
            <div className="mt-1.5" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
              {c.works}
            </div>
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,149,0,0.03)",
                marginLeft: -16,
                marginRight: -16,
                marginBottom: -16,
                padding: "10px 16px 14px",
                borderRadius: "0 0 10px 10px",
              }}
            >
              <div className="flex items-center gap-1.5">
                <ArrowUp size={10} strokeWidth={2.6} style={{ color: "rgba(255,149,0,0.7)" }} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    color: "rgba(255,149,0,0.7)",
                  }}
                >
                  COMO SUPERAR
                </span>
              </div>
              <div
                className="mt-1.5"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}
              >
                {c.surpass}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── BLOCO 3 ───────────── */
const traps = [
  {
    title: "NÃO IGNORE COMENTÁRIOS NEGATIVOS",
    text: (
      <>
        <strong style={{ color: "rgba(255,149,0,0.7)", fontWeight: 600 }}>@clinicabella_sp</strong> tem{" "}
        <strong style={{ color: "rgba(255,149,0,0.7)", fontWeight: 600 }}>23</strong> comentários negativos sem
        resposta. Cada um é cliente perdido e prova pública de descaso. Regra: responder em menos de 2h vira
        diferencial.
      </>
    ),
  },
  {
    title: "NÃO POSTE SEM ENDEREÇO/CIDADE",
    text: (
      <>
        "que clínica é essa?" aparece <strong style={{ color: "rgba(255,149,0,0.7)", fontWeight: 600 }}>89x</strong>{" "}
        no TikTok do concorrente. Clientes com intenção sendo perdidos por falta de info básica.
      </>
    ),
  },
  {
    title: "NÃO COMPRE SEGUIDORES",
    text: (
      <>
        <strong style={{ color: "rgba(255,149,0,0.7)", fontWeight: 600 }}>@esteticasp_oficial</strong> perdeu{" "}
        <strong style={{ color: "rgba(255,149,0,0.7)", fontWeight: 600 }}>800</strong> seguidores em abril — ban da
        plataforma. Inútil e destrói credibilidade quando detectado.
      </>
    ),
  },
  {
    title: "NÃO ABANDONE TEMAS SEM TESTAR MELHOR",
    text: (
      <>
        Concorrente parou "skincare diário" após baixo engajamento. Provável erro: formato errado, não tema errado.
        Vale retomar com vídeo.
      </>
    ),
  },
  {
    title: "NÃO POSTE APENAS RESULTADO FINAL",
    text: (
      <>
        Posts de "antes/depois" têm alta curtida mas baixo salvamento. Salvamento = intenção real. Processo gera mais
        salvamento que resultado.
      </>
    ),
  },
];

function Armadilhas() {
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.04)",
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        border: "1px solid rgba(239,68,68,0.12)",
        borderRadius: 10,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(239,68,68,0.55)",
        }}
      >
        ARMADILHAS DETECTADAS — NÃO REPITA OS ERROS DELES
      </div>
      <div className="mt-2">
        {traps.map((t, i) => (
          <div
            key={i}
            className="flex gap-2.5"
            style={{
              padding: "12px 0",
              borderBottom: i < traps.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <X
              size={11}
              strokeWidth={3}
              style={{ color: "rgba(239,68,68,0.7)", marginTop: 2, flexShrink: 0 }}
            />
            <div className="min-w-0">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.3px",
                }}
              >
                {t.title}
              </div>
              <div
                className="mt-1"
                style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}
              >
                {t.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── BLOCO 4 — Plano de ação por plataforma ───────────── */
type PlatformId = "instagram" | "tiktok" | "linkedin" | "youtube";

interface PlatformPlan {
  id: PlatformId;
  label: string;
  icon: LucideIcon;
  frequency: string;
  frequencyDetail: string;
  schedule: { ok: boolean; time: string; reason: string }[];
  themes: string[];
  firstPost: { format: string; theme: string; how: string; why: string };
  metrics: { value: string; label: string }[];
}

const plans: PlatformPlan[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    frequency: "4 posts/semana · Reels: 3 · Carrossel: 1",
    frequencyDetail: "Baseado nos concorrentes que mais crescem (3–5 posts/semana).",
    schedule: [
      { ok: true, time: "Quarta-feira · 18h30–19h30", reason: "nenhum concorrente posta nesse slot" },
      { ok: true, time: "Quinta-feira · 19h–20h", reason: "vácuo de conteúdo detectado" },
      { ok: false, time: "Segunda-feira manhã", reason: "alta competição, baixo engajamento" },
    ],
    themes: [
      "Preço transparente dos procedimentos — tema nº1 não respondido",
      "Pós-procedimento: o que fazer, resultado por semana",
      "Tour pela clínica com apresentação da equipe",
      "Processo completo de um procedimento (não só resultado)",
      "Resposta pública a perguntas frequentes dos comentários",
    ],
    firstPost: {
      format: "Reels 30–45s",
      theme: '"quanto custa [procedimento mais buscado] aqui?"',
      how: "Mostrar preço na tela, sem suspense.",
      why: "preenche o gap nº1 de todos os concorrentes simultaneamente.",
    },
    metrics: [
      { value: "200–400", label: "seguidores orgânicos / 30d" },
      { value: ">50", label: "salvamentos por Reels" },
      { value: "📍", label: "comentários com cidade/bairro" },
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: Music2,
    frequency: "5–7 vídeos/semana · 15–45s",
    frequencyDetail: "Algoritmo recompensa frequência alta nos primeiros 90 dias.",
    schedule: [
      { ok: true, time: "Terça · 20h–21h", reason: "concorrente ausente, audiência ativa" },
      { ok: true, time: "Quinta · 19h–20h", reason: "vácuo total no nicho" },
      { ok: false, time: "Sábado tarde", reason: "engajamento histórico baixo" },
    ],
    themes: [
      'Responder em vídeo "quanto custa?" — a pergunta nº1',
      "Mostrar localização da clínica em todo vídeo (gap detectado)",
      "Bastidores autênticos com música trending",
      "Tutoriais curtos de cuidados pós-procedimento",
      "Comparativo de procedimentos com preços reais",
    ],
    firstPost: {
      format: "Vídeo 30s vertical",
      theme: '"3 coisas que ninguém te conta sobre harmonização"',
      how: "Localização fixada na bio + comentário fixado com endereço.",
      why: "resolve o gap de 89 perguntas sobre localização não respondidas.",
    },
    metrics: [
      { value: "10k+", label: "views por vídeo / 30d" },
      { value: ">500", label: "salvamentos por vídeo" },
      { value: "+1.2k", label: "seguidores orgânicos / 30d" },
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    frequency: "2–3 posts/semana · 1 artigo/mês",
    frequencyDetail: "Plataforma de autoridade, qualidade > quantidade.",
    schedule: [
      { ok: true, time: "Terça · 8h–9h", reason: "horário de leitura profissional" },
      { ok: true, time: "Quinta · 12h–13h", reason: "almoço executivo" },
      { ok: false, time: "Final de semana", reason: "engajamento baixo" },
    ],
    themes: [
      "Cultura interna e equipe (território completamente livre)",
      "Bastidores técnicos: equipamentos e protocolos",
      "Cases de cliente com métricas (B2B-style)",
      "Tendências do setor de estética SP",
      "Vagas e employer branding",
    ],
    firstPost: {
      format: "Post longo + carrossel",
      theme: '"Por que contratamos esteticista que sabe de marketing"',
      how: "Foto da equipe + filosofia de atendimento.",
      why: "ninguém no nicho usa LinkedIn para employer branding.",
    },
    metrics: [
      { value: "2k+", label: "impressões por post" },
      { value: ">10", label: "candidatos qualificados / mês" },
      { value: "+50", label: "conexões relevantes / 30d" },
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    frequency: "2 vídeos longos/mês · 4 Shorts/semana",
    frequencyDetail: "Território livre — frequência mínima já te coloca no topo.",
    schedule: [
      { ok: true, time: "Sábado manhã (longos)", reason: "horário de pesquisa profunda" },
      { ok: true, time: "Diário 18h (Shorts)", reason: "zero competição local" },
      { ok: false, time: "Madrugada", reason: "público alvo offline" },
    ],
    themes: [
      "Tour pela clínica + preços reais (busca nº1 sem resposta)",
      "Procedimentos explicados do início ao fim",
      "Comparativo: clínica boa vs. ruim",
      "Antes/depois com depoimento longo",
      "Responder dúvidas dos comentários do Instagram",
    ],
    firstPost: {
      format: "Vídeo 8–12min",
      theme: '"Tour completo + preços de todos os procedimentos"',
      how: "Mostrar valores na tela, sem corte, com explicação.",
      why: "responde 14.200 buscas/mês sem nenhum concorrente local.",
    },
    metrics: [
      { value: "5k+", label: "views por vídeo / 30d" },
      { value: ">100", label: "inscritos / mês" },
      { value: "1º", label: "lugar no Google local" },
    ],
  },
];

function PlanoAcao() {
  const [active, setActive] = useState<PlatformId>("instagram");
  const plan = plans.find((p) => p.id === active)!;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <div
        className="mb-3"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        SEU PLANO DE AÇÃO — BASEADO NOS DADOS COLETADOS
      </div>

      {/* Platform pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {plans.map((p) => {
          const Icon = p.icon;
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className="inline-flex items-center gap-1.5 transition-colors"
              style={{
                padding: "5px 12px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 600,
                background: isActive ? "rgba(255,149,0,0.1)" : "transparent",
                border: `1px solid ${isActive ? "rgba(255,149,0,0.25)" : "rgba(255,255,255,0.06)"}`,
                color: isActive ? "rgba(255,149,0,0.85)" : "rgba(255,255,255,0.4)",
              }}
            >
              <Icon size={11} strokeWidth={2.4} />
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <PlanSection label="FREQUÊNCIA RECOMENDADA">
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
            {plan.frequency}
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            {plan.frequencyDetail}
          </div>
        </PlanSection>

        <PlanSection label="MELHORES HORÁRIOS (BASEADO NOS DADOS)">
          <div className="space-y-1.5 mt-1">
            {plan.schedule.map((s, i) => (
              <div key={i} className="flex items-baseline gap-2" style={{ fontSize: 13 }}>
                {s.ok ? (
                  <Check size={11} strokeWidth={3} style={{ color: "rgba(16,185,129,0.8)" }} />
                ) : (
                  <X size={11} strokeWidth={3} style={{ color: "rgba(239,68,68,0.7)" }} />
                )}
                <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{s.time}</span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>← {s.reason}</span>
              </div>
            ))}
          </div>
        </PlanSection>

        <PlanSection label="TEMAS PRIORITÁRIOS (POR POTENCIAL DE CONVERSÃO)">
          <ol className="space-y-2 mt-1.5">
            {plan.themes.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: "rgba(255,149,0,0.1)",
                    backdropFilter: "blur(12px) saturate(150%)",
                    WebkitBackdropFilter: "blur(12px) saturate(150%)",
                    border: "1px solid rgba(255,149,0,0.25)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(255,149,0,0.85)",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                  {t}
                </span>
              </li>
            ))}
          </ol>
        </PlanSection>

        <div
          style={{
            background: "rgba(255,149,0,0.04)",
            backdropFilter: "blur(12px) saturate(150%)",
            WebkitBackdropFilter: "blur(12px) saturate(150%)",
            border: "1px solid rgba(255,149,0,0.1)",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "rgba(255,149,0,0.65)",
            }}
          >
            PRIMEIRO POST RECOMENDADO
          </div>
          <div className="mt-2 space-y-1" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            <div>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>Formato:</span>{" "}
              <span style={{ fontWeight: 600 }}>{plan.firstPost.format}</span>
            </div>
            <div>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>Tema:</span>{" "}
              <span style={{ fontWeight: 600 }}>{plan.firstPost.theme}</span>
            </div>
            <div>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>Como:</span> {plan.firstPost.how}
            </div>
            <div>
              <span style={{ color: "rgba(255,149,0,0.65)" }}>Por quê:</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{plan.firstPost.why}</span>
            </div>
          </div>
        </div>

        <PlanSection label="MÉTRICA DE SUCESSO (30 DIAS)">
          <div className="grid grid-cols-3 gap-3 mt-2">
            {plan.metrics.map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>{m.value}</div>
                <div
                  className="mt-0.5"
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </PlanSection>
      </div>
    </div>
  );
}

function PlanSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

/* ───────────── BLOCO 5 — Radar ───────────── */
const radar = [
  {
    urgency: "critical" as const,
    icon: "●",
    label: "CRÍTICO — agir nos próximos 30 dias",
    color: "239,68,68",
    title: "Canal YouTube SP sem concorrentes",
    data: [
      "14.200 buscas/mês · 0 canais locais ativos",
      "Estimativa: concorrente com funding vai criar canal em 2–3 meses",
    ],
    effort: "baixo",
    impact: "alto",
    window: "60–90 dias",
  },
  {
    urgency: "important" as const,
    icon: "◐",
    label: "IMPORTANTE — agir nos próximos 60 dias",
    color: "245,158,11",
    title: "Terças e quintas 18–20h: vácuo de conteúdo",
    data: [
      "Nenhum concorrente posta nesses slots",
      "Audiência disponível sem competição direta",
    ],
    effort: "baixo",
    impact: "médio",
    window: "até alguém descobrir",
  },
  {
    urgency: "relevant" as const,
    icon: "○",
    label: "RELEVANTE — agir nos próximos 90 dias",
    color: "255,255,255",
    title: "23 comentários negativos do líder de mercado sem resposta",
    data: [
      "Clientes insatisfeitos com @clinicabella_sp publicamente",
      "Oportunidade de captação direta (com cuidado ético)",
    ],
    effort: "médio",
    impact: "alto",
    window: null,
  },
];

function Radar() {
  return (
    <div>
      <div
        className="mb-3"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        RADAR — JANELAS DE OPORTUNIDADE ABERTAS AGORA
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {radar.map((r, i) => (
          <div
            key={i}
            style={{
              padding: "14px 18px",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: 13,
                    color: r.urgency === "relevant" ? "rgba(255,255,255,0.25)" : `rgba(${r.color},1)`,
                  }}
                >
                  {r.icon}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    color: r.urgency === "relevant" ? "rgba(255,255,255,0.45)" : `rgba(${r.color},0.85)`,
                  }}
                >
                  {r.label}
                </span>
              </div>
              {r.window && (
                <span
                  className="shrink-0"
                  style={{
                    padding: "2px 7px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "1px",
                    background: "rgba(255,149,0,0.08)",
                    backdropFilter: "blur(12px) saturate(150%)",
                    WebkitBackdropFilter: "blur(12px) saturate(150%)",
                    border: "1px solid rgba(255,149,0,0.2)",
                    color: "rgba(255,149,0,0.85)",
                  }}
                >
                  JANELA: {r.window.toUpperCase()}
                </span>
              )}
            </div>
            <div
              className="mt-2"
              style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.78)" }}
            >
              {r.title}
            </div>
            <div className="mt-1" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>
              {r.data.map((d, di) => (
                <div key={di}>{d}</div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2" style={{ fontSize: 11 }}>
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "rgba(16,185,129,0.08)",
                  backdropFilter: "blur(12px) saturate(150%)",
                  WebkitBackdropFilter: "blur(12px) saturate(150%)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  color: "rgba(16,185,129,0.8)",
                  fontWeight: 600,
                }}
              >
                Esforço: {r.effort}
              </span>
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "rgba(255,149,0,0.08)",
                  backdropFilter: "blur(12px) saturate(150%)",
                  WebkitBackdropFilter: "blur(12px) saturate(150%)",
                  border: "1px solid rgba(255,149,0,0.2)",
                  color: "rgba(255,149,0,0.85)",
                  fontWeight: 600,
                }}
              >
                Impacto: {r.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── BLOCO 6 — Score ───────────── */
interface ScoreRow {
  handle: string;
  score: number | null;
  description: string;
  isUser?: boolean;
}

const scores: ScoreRow[] = [
  { handle: "Sua marca", score: null, description: "Complete sua análise para comparar", isUser: true },
  { handle: "@clinicabella_sp", score: 78, description: "Forte mas sem estratégia" },
  { handle: "@studio_renata", score: 51, description: "Presença fraca, base comprada" },
  { handle: "@esteticasp_oficial", score: 68, description: "Crescimento irregular" },
];

function scoreColor(s: number) {
  if (s > 70) return "16,185,129";
  if (s >= 40) return "245,158,11";
  return "239,68,68";
}

function Score() {
  return (
    <div>
      <div
        className="mb-3"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        SCORE DE PRESENÇA DIGITAL — VOCÊ VS. CONCORRENTES
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          padding: "8px 18px",
        }}
      >
        {scores.map((s, i) => {
          const color = s.score !== null ? scoreColor(s.score) : "255,149,0";
          const fillPct = s.score ?? 0;
          return (
            <div
              key={s.handle}
              className="flex items-center gap-3"
              style={{
                padding: "12px 0",
                borderBottom: i < scores.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <div style={{ width: 160, flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: s.isUser ? "rgba(255,149,0,0.75)" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {s.handle}
                </div>
              </div>
              <div className="flex-1">
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: s.isUser ? "1px dashed rgba(255,149,0,0.3)" : "none",
                  }}
                >
                  {s.score !== null && (
                    <div
                      style={{
                        width: `${fillPct}%`,
                        height: "100%",
                        background: `rgb(${color})`,
                        boxShadow: `0 0 8px rgba(${color},0.5)`,
                      }}
                    />
                  )}
                </div>
              </div>
              <div
                style={{
                  width: 60,
                  textAlign: "right",
                  fontSize: 13,
                  fontWeight: 700,
                  color: s.score !== null ? `rgba(${color},1)` : "rgba(255,149,0,0.5)",
                }}
              >
                {s.score !== null ? `${s.score}/100` : "— · —"}
              </div>
              <div
                style={{
                  width: 220,
                  fontSize: 11,
                  color: s.isUser ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.25)",
                  fontStyle: s.isUser ? "italic" : "normal",
                }}
              >
                {s.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── EXPORT ───────────── */
export function StrategyView() {
  return (
    <div className="space-y-5" style={{ animation: "fadeIn 0.2s ease" }}>
      <Diagnostico />
      <WhatWorks />
      <Armadilhas />
      <PlanoAcao />
      <Radar />
      <Score />
    </div>
  );
}