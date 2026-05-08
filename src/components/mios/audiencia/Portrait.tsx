import { useState, type ReactNode } from "react";
import {
  Instagram,
  Search,
  MessageCircle,
  Youtube,
  Clock,
  Heart,
  ShieldAlert,
  Zap,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonaChannel {
  name: string;
  icon: ReactNode;
  reach: number; // 0-100
  behavior: string;
}

interface JourneyStage {
  id: string;
  label: string;
  sub: string;
  active?: boolean;
}

interface DayMoment {
  time: string;
  action: string;
  touchpoint?: string;
}

interface Persona {
  id: string;
  name: string;
  age: number;
  role: string;
  city: string;
  income: string;
  quote: string;
  avatarGradient: string;
  avatarInitials: string;
  tags: Array<{ label: string; type: "interest" | "value" | "pain" | "habit" }>;
  channels: PersonaChannel[];
  journey: JourneyStage[];
  dayInLife: DayMoment[];
  triggers: string[];
  objections: string[];
  buyingWindow: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const personas: Persona[] = [
  {
    id: "p1",
    name: "Mariana Ferreira",
    age: 34,
    role: "Gerente de Marketing",
    city: "Itaim Bibi, SP",
    income: "R$8.000–R$14.000/mes",
    quote:
      "Eu nao tenho tempo pra nada que nao funcione de primeira. Me vende resultado, nao processo.",
    avatarGradient: "linear-gradient(135deg, #ff9500 0%, #ff6b35 50%, #c44b00 100%)",
    avatarInitials: "MF",
    tags: [
      { label: "Autoestima como prioridade", type: "value" },
      { label: "Sem tempo a perder", type: "habit" },
      { label: "Resultado visivel rapido", type: "pain" },
      { label: "Paga por conveniencia", type: "habit" },
      { label: "Confia em indicacao", type: "value" },
      { label: "Pesquisa no Instagram", type: "habit" },
      { label: "Quer se sentir especial", type: "interest" },
      { label: "Critica com experiencias ruins", type: "pain" },
      { label: "Compra por impulso noturno", type: "habit" },
    ],
    channels: [
      { name: "Instagram", icon: <Instagram size={12} />, reach: 94, behavior: "Descobre via Reels e Stories de antes/depois" },
      { name: "Google", icon: <Search size={12} />, reach: 81, behavior: "Pesquisa reviews e avaliacoes antes de agendar" },
      { name: "WhatsApp", icon: <MessageCircle size={12} />, reach: 76, behavior: "Prefere agendar por mensagem, nao por telefone" },
      { name: "YouTube", icon: <Youtube size={12} />, reach: 42, behavior: "Assiste tutoriais de skincare antes de dormir" },
    ],
    journey: [
      { id: "consciencia", label: "Consciencia", sub: "Ve resultado de alguem no Instagram" },
      { id: "interesse", label: "Interesse", sub: "Pesquisa o perfil, vê depoimentos", active: true },
      { id: "consideracao", label: "Consideracao", sub: "Compara 2-3 opcoes, le Google Reviews" },
      { id: "decisao", label: "Decisao", sub: "Agenda pelo WhatsApp no mesmo dia" },
      { id: "fidelizacao", label: "Fidelizacao", sub: "Volta se o resultado superou a espera" },
    ],
    dayInLife: [
      { time: "7h", action: "Rola o Instagram no cafe da manha", touchpoint: "Instagram" },
      { time: "12h", action: "Pesquisa tratamentos no Google no almoco", touchpoint: "Google" },
      { time: "18h", action: "Chega em casa, ve Stories de resultados", touchpoint: "Instagram" },
      { time: "22h", action: "Agenda servico pelo WhatsApp — janela de maior conversao", touchpoint: "WhatsApp" },
    ],
    triggers: [
      "Foto de resultado real de alguem parecido com ela",
      "Promocao com urgencia real ('ultimas vagas')",
      "Depoimento com nome e foto — nao anonimo",
      "Resposta rapida no WhatsApp (menos de 5 min)",
    ],
    objections: [
      "E se nao funcionar no meu tipo de pele?",
      "Esse preco inclui quantas sessoes?",
      "A profissional tem certificacao?",
      "Vou perder meu horario se precisar cancelar?",
    ],
    buyingWindow: "22h–23h30 — decisao de compra majoritariamente noturna",
  },
  {
    id: "p2",
    name: "Claudia Mendes",
    age: 48,
    role: "Empresaria / Autonoma",
    city: "Moema, SP",
    income: "R$18.000–R$35.000/mes",
    quote:
      "Nao me interessa preco. Me interessa confianca. Se voce e boa, eu pago e indico todas as minhas amigas.",
    avatarGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
    avatarInitials: "CM",
    tags: [
      { label: "Status e exclusividade", type: "value" },
      { label: "Fidelidade a marcas confiadas", type: "habit" },
      { label: "Indica ativamente", type: "interest" },
      { label: "Exige atendimento premium", type: "value" },
      { label: "Pesquisa no LinkedIn e Google", type: "habit" },
      { label: "Medo de envelhecimento", type: "pain" },
      { label: "Paga parcelado sem problema", type: "habit" },
      { label: "Quer tratamento preventivo", type: "interest" },
    ],
    channels: [
      { name: "Google", icon: <Search size={12} />, reach: 88, behavior: "Busca certificacoes e premios do estabelecimento" },
      { name: "WhatsApp", icon: <MessageCircle size={12} />, reach: 82, behavior: "Comunicacao preferencial — quer atendimento personalizado" },
      { name: "Instagram", icon: <Instagram size={12} />, reach: 61, behavior: "Segue perfis aspiracionais e de referencia" },
      { name: "YouTube", icon: <Youtube size={12} />, reach: 28, behavior: "Raramente usa para pesquisa de servicos" },
    ],
    journey: [
      { id: "consciencia", label: "Consciencia", sub: "Indicacao direta de amiga de confianca" },
      { id: "interesse", label: "Interesse", sub: "Pesquisa credentials e diferenciais" },
      { id: "consideracao", label: "Consideracao", sub: "Liga ou manda mensagem para tirar duvidas", active: true },
      { id: "decisao", label: "Decisao", sub: "Fecha pacote completo, nao sessao avulsa" },
      { id: "fidelizacao", label: "Fidelizacao", sub: "Torna-se embaixadora e indica ativamente" },
    ],
    dayInLife: [
      { time: "8h", action: "Checa WhatsApp de clientes e fornecedores", touchpoint: "WhatsApp" },
      { time: "13h", action: "Almoco com amigas — troca indicacoes de servicos" },
      { time: "15h", action: "Pesquisa no Google por 'melhor estetica [bairro]'", touchpoint: "Google" },
      { time: "17h", action: "Manda mensagem para 2-3 estabelecimentos", touchpoint: "WhatsApp" },
    ],
    triggers: [
      "Indicacao pessoal de alguem do mesmo circulo social",
      "Certificacoes e premios visiveis no Google",
      "Primeiro contato extremamente profissional",
      "Possibilidade de fechar pacote completo",
    ],
    objections: [
      "Ja tenho uma profissional de confianca — por que mudar?",
      "Qual a sua formacao e experiencia comprovada?",
      "Voces atendem fora do horario comercial?",
    ],
    buyingWindow: "13h–17h — decide durante a tarde, frequentemente apos almoco social",
  },
];

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  interest: { bg: "rgba(99,102,241,0.1)", color: "rgba(129,140,248,0.9)" },
  value:    { bg: "rgba(255,149,0,0.1)",  color: "rgba(255,149,0,0.9)"   },
  pain:     { bg: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.8)"   },
  habit:    { bg: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.8)"  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PersonaAvatar({ persona, size = 120 }: { persona: Persona; size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.22,
      background: persona.avatarGradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.28, fontWeight: 800,
      color: "rgba(255,255,255,0.92)",
      fontFamily: "JetBrains Mono, monospace",
      letterSpacing: -1,
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grain texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
        borderRadius: "inherit",
      }} />
      <span style={{ position: "relative" }}>{persona.avatarInitials}</span>
    </div>
  );
}

function ChannelBar({ channel }: { channel: PersonaChannel }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--accent)", opacity: 0.7 }}>{channel.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            {channel.name}
          </span>
        </div>
        <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "var(--accent)" }}>
          {channel.reach}%
        </span>
      </div>
      <div style={{
        height: 4, borderRadius: 2,
        background: "rgba(255,255,255,0.06)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${channel.reach}%`,
          background: "linear-gradient(90deg, var(--accent), rgba(255,149,0,0.5))",
          borderRadius: 2,
          boxShadow: "0 0 8px rgba(255,149,0,0.4)",
        }} />
      </div>
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
        {channel.behavior}
      </p>
    </div>
  );
}

function JourneyMap({ stages }: { stages: JourneyStage[] }) {
  return (
    <div className="flex items-start gap-0">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-start flex-1 min-w-0">
          <div className="flex flex-col items-center flex-1 min-w-0">
            {/* Node + connector */}
            <div className="flex items-center w-full">
              <div style={{
                width: i === 0 ? 0 : "100%", height: 1,
                background: i > 0 && stages[i-1].active || stage.active
                  ? "rgba(255,149,0,0.4)"
                  : "rgba(255,255,255,0.07)",
              }} />
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: stage.active ? "var(--accent)" : "rgba(255,255,255,0.08)",
                border: stage.active
                  ? "none"
                  : "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: stage.active ? "0 0 12px rgba(255,149,0,0.6)" : "none",
              }} />
              <div style={{
                flex: 1, height: 1,
                background: i === stages.length - 1 ? "transparent" : "rgba(255,255,255,0.07)",
              }} />
            </div>
            {/* Labels */}
            <div className="mt-2 px-1 text-center" style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 9, fontWeight: 700,
                color: stage.active ? "var(--accent)" : "rgba(255,255,255,0.35)",
                letterSpacing: 0.3, marginBottom: 3,
                whiteSpace: "nowrap",
              }}>
                {stage.label}
              </div>
              <div style={{
                fontSize: 8, color: "rgba(255,255,255,0.25)",
                lineHeight: 1.4,
              }}>
                {stage.sub}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Portrait() {
  const [activePersona, setActivePersona] = useState(0);
  const p = personas[activePersona];

  return (
    <div className="space-y-5">
      {/* Module header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--accent)", boxShadow: "0 0 8px var(--accent)",
            }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,149,0,0.8)", letterSpacing: 1.2 }}>
              {personas.length} PERSONAS IDENTIFICADAS
            </span>
          </div>
          <h1 style={{
            fontSize: 20, fontWeight: 800,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: -0.5, marginBottom: 4,
          }}>
            O Retrato
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            Quem e o seu cliente real — comportamentos, jornada e gatilhos de compra
          </p>
        </div>
        {/* Persona switcher */}
        <div className="flex items-center gap-2">
          {personas.map((persona, i) => (
            <button
              key={persona.id}
              onClick={() => setActivePersona(i)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px 6px 6px",
                borderRadius: 8, cursor: "pointer", border: "none",
                background: i === activePersona
                  ? "rgba(255,149,0,0.12)"
                  : "rgba(255,255,255,0.03)",
                outline: i === activePersona
                  ? "1px solid rgba(255,149,0,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s",
              }}
            >
              <PersonaAvatar persona={persona} size={26} />
              <div style={{ textAlign: "left" }}>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: i === activePersona ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.5)",
                }}>
                  {persona.name.split(" ")[0]}
                </div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>
                  {persona.age} anos
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editorial hero */}
      <div style={{
        background: "var(--card)",
        border: "1px solid rgba(255,255,255,0.055)",
        borderRadius: 14, overflow: "hidden",
      }}>
        <div className="flex" style={{ minHeight: 200 }}>
          {/* Left: avatar panel */}
          <div style={{
            width: 220, flexShrink: 0,
            background: "rgba(255,255,255,0.015)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 28, gap: 16,
          }}>
            <PersonaAvatar persona={p} size={104} />
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 14, fontWeight: 800,
                color: "rgba(255,255,255,0.92)", marginBottom: 2,
              }}>
                {p.name}
              </div>
              <div style={{
                fontSize: 10, color: "rgba(255,255,255,0.4)",
                fontWeight: 500, marginBottom: 10,
              }}>
                {p.age} anos
              </div>
              {[
                { icon: <Briefcase size={9} />, text: p.role },
                { icon: <MapPin size={9} />, text: p.city },
                { icon: <DollarSign size={9} />, text: p.income },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center justify-center gap-1.5 mb-1">
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>{icon}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: identity content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            {/* Big quote */}
            <div style={{
              background: "rgba(255,149,0,0.04)",
              border: "1px solid rgba(255,149,0,0.1)",
              borderLeft: "3px solid rgba(255,149,0,0.5)",
              borderRadius: "0 10px 10px 0",
              padding: "14px 18px", marginBottom: 20,
            }}>
              <p style={{
                fontSize: 14, fontWeight: 500,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.6,
              }}>
                "{p.quote}"
              </p>
            </div>

            {/* Behavior tags */}
            <div>
              <div style={{
                fontSize: 9, fontWeight: 700,
                color: "rgba(255,255,255,0.25)", letterSpacing: 1,
                marginBottom: 10,
              }}>
                DNA COMPORTAMENTAL
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(tag => {
                  const s = TAG_STYLE[tag.type];
                  return (
                    <span
                      key={tag.label}
                      style={{
                        fontSize: 10, fontWeight: 500,
                        padding: "3px 9px", borderRadius: 5,
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.color}25`,
                      }}
                    >
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Journey map — full width */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "16px 24px 20px",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700,
            color: "rgba(255,255,255,0.25)", letterSpacing: 1, marginBottom: 14,
          }}>
            JORNADA DE COMPRA
          </div>
          <JourneyMap stages={p.journey} />
        </div>
      </div>

      {/* Bottom row: 3 cards */}
      <div className="grid grid-cols-3 gap-4">

        {/* Day in life */}
        <div style={{
          background: "var(--card)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12, padding: "18px 18px",
        }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={12} style={{ color: "var(--accent)", opacity: 0.7 }} />
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: "rgba(255,255,255,0.4)", letterSpacing: 1,
            }}>
              UM DIA NA VIDA
            </span>
          </div>
          <div className="space-y-3">
            {p.dayInLife.map((moment, i) => (
              <div key={i} className="flex gap-3">
                <div style={{
                  fontSize: 9, fontWeight: 700,
                  color: "var(--accent)", fontFamily: "JetBrains Mono, monospace",
                  width: 28, flexShrink: 0, paddingTop: 1,
                }}>
                  {moment.time}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 10, color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.45,
                  }}>
                    {moment.action}
                  </p>
                  {moment.touchpoint && (
                    <span style={{
                      fontSize: 8, fontWeight: 600,
                      color: "rgba(255,149,0,0.6)",
                      background: "rgba(255,149,0,0.06)",
                      borderRadius: 4, padding: "1px 5px",
                      marginTop: 3, display: "inline-block",
                    }}>
                      via {moment.touchpoint}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Buying window callout */}
          <div style={{
            marginTop: 14,
            background: "rgba(255,149,0,0.06)",
            border: "1px solid rgba(255,149,0,0.15)",
            borderRadius: 8, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--accent)", marginBottom: 2 }}>
              JANELA DE COMPRA
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
              {p.buyingWindow}
            </p>
          </div>
        </div>

        {/* Channels */}
        <div style={{
          background: "var(--card)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12, padding: "18px 18px",
        }}>
          <div className="flex items-center gap-2 mb-4">
            <Instagram size={12} style={{ color: "var(--accent)", opacity: 0.7 }} />
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: "rgba(255,255,255,0.4)", letterSpacing: 1,
            }}>
              ONDE ESTA ONLINE
            </span>
          </div>
          <div className="space-y-4">
            {p.channels.map(ch => (
              <ChannelBar key={ch.name} channel={ch} />
            ))}
          </div>
        </div>

        {/* Triggers & objections */}
        <div style={{
          background: "var(--card)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12, padding: "18px 18px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          {/* Triggers */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={12} style={{ color: "#10b981", opacity: 0.8 }} />
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: "rgba(255,255,255,0.4)", letterSpacing: 1,
              }}>
                GATILHOS DE COMPRA
              </span>
            </div>
            <div className="space-y-2">
              {p.triggers.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight size={9} style={{ color: "#10b981", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.45 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Objections */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={12} style={{ color: "#ef4444", opacity: 0.8 }} />
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: "rgba(255,255,255,0.4)", letterSpacing: 1,
              }}>
                OBJECOES E MEDOS
              </span>
            </div>
            <div className="space-y-2">
              {p.objections.map((o, i) => (
                <div key={i} style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.12)",
                  borderRadius: 6, padding: "5px 8px",
                }}>
                  <span style={{ fontSize: 10, color: "rgba(239,100,100,0.8)", lineHeight: 1.4 }}>
                    "{o}"
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
