import { useState } from "react";
import {
  Instagram,
  Music2,
  Linkedin,
  Youtube,
  Pin,
  MessageSquareWarning,
  TrendingDown,
  Clock,
  Triangle,
  Film,
  TrendingUp,
  Briefcase,
  Users,
  Megaphone,
  Play,
  Search,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

type HealthStatus = "healthy" | "suspicious" | "fake" | "expansion" | "free";

interface CardSection {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  body: React.ReactNode;
  cta?: string;
}

interface PlatformCard {
  platform: string;
  icon: LucideIcon;
  color: string;
  handle: string;
  metrics: string;
  health: HealthStatus;
  healthLabel: string;
  sections: CardSection[];
}

function S({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "rgba(255,149,0,0.75)", fontWeight: 600 }}>{children}</span>
  );
}

const cards: PlatformCard[] = [
  {
    platform: "INSTAGRAM",
    icon: Instagram,
    color: "225,48,108",
    handle: "@clinicabella_sp",
    metrics: "4.2% engaj · 48.3k seguid.",
    health: "healthy",
    healthLabel: "CONTA SAUDÁVEL",
    sections: [
      {
        icon: Pin,
        iconColor: "rgba(255,255,255,0.35)",
        label: "POST MAIS ENGAJADO",
        body: (
          <>
            Antes/depois criolipólise — <S>28.4k</S> curtidas. Quarta, <S>19h</S>. Foto única com texto sobreposto.
          </>
        ),
      },
      {
        icon: MessageSquareWarning,
        iconColor: "rgba(239,68,68,0.7)",
        label: "COMENTÁRIOS NEGATIVOS (23 detectados)",
        body: (
          <>
            "Resultado durou 2 semanas" — <S>8x</S>
            <br />
            "Agendei e cancelaram no mesmo dia" — <S>6x</S>
            <br />
            "Cobrou diferente do que falaram" — <S>5x</S>
          </>
        ),
        cta: "Ver todos 23",
      },
      {
        icon: TrendingDown,
        iconColor: "rgba(245,158,11,0.7)",
        label: "TEMAS ABANDONADOS",
        body: (
          <>
            Postava sobre "skincare diário" — parou há <S>4 meses</S>.
            <br />
            Postava sobre "promoções" — parou há <S>7 meses</S>.
            <br />
            Sinal: essas linhas provavelmente não convertiam.
          </>
        ),
      },
      {
        icon: Clock,
        iconColor: "rgba(16,185,129,0.7)",
        label: "MELHOR HORÁRIO DETECTADO",
        body: (
          <>
            Quarta e quinta · <S>18h–20h</S>
            <br />
            Posts nesse slot têm <S>3.1x</S> mais engajamento que média.
          </>
        ),
      },
      {
        icon: Triangle,
        iconColor: "rgba(255,149,0,0.75)",
        label: "GAP DEIXADO EXPOSTO",
        body: (
          <>
            Zero resposta a comentários negativos. Tempo médio: <S>nunca</S>.
            <br />
            Oportunidade: atendimento pós-post como diferencial.
          </>
        ),
      },
    ],
  },
  {
    platform: "TIKTOK",
    icon: Music2,
    color: "255,255,255",
    handle: "@esteticasp_oficial",
    metrics: "8.7% engaj · 12.1k seguid.",
    health: "suspicious",
    healthLabel: "CRESCIMENTO IRREGULAR",
    sections: [
      {
        icon: Film,
        iconColor: "rgba(255,255,255,0.35)",
        label: "VÍDEO MAIS SALVO (não mais curtido)",
        body: (
          <>
            "Quanto custa harmonização?" — <S>4.2k</S> salvamentos.
            <br />
            Salvamento indica intenção de compra real.
          </>
        ),
      },
      {
        icon: MessageSquareWarning,
        iconColor: "rgba(239,68,68,0.7)",
        label: "COMENTÁRIOS NEGATIVOS (11 detectados)",
        body: (
          <>
            "Qual endereço? Nunca respondem" — <S>4x</S>
            <br />
            "Sumiu depois que paguei a consulta" — <S>3x</S>
          </>
        ),
      },
      {
        icon: TrendingUp,
        iconColor: "rgba(245,158,11,0.7)",
        label: "CURVA DE CRESCIMENTO",
        body: (
          <>
            Jan–Mar: <S>+2.1k</S>/mês (compra detectada)
            <br />
            Abr: <S>−800</S> (ban de seguidores falsos)
            <br />
            Mai–atual: <S>+340</S> orgânicos/mês
          </>
        ),
      },
      {
        icon: Clock,
        iconColor: "rgba(16,185,129,0.7)",
        label: "VÁCUO DETECTADO",
        body: (
          <>
            Nenhum post de <S>terça</S> ou <S>quinta</S>. Audiência disponível sem competição.
          </>
        ),
      },
      {
        icon: Triangle,
        iconColor: "rgba(255,149,0,0.75)",
        label: "GAP DEIXADO EXPOSTO",
        body: (
          <>
            Nunca divulgam endereço nem cidade. "Que clínica é essa?" aparece <S>89x</S>.
          </>
        ),
      },
    ],
  },
  {
    platform: "LINKEDIN",
    icon: Linkedin,
    color: "10,102,194",
    handle: "Clínica Bella Forma",
    metrics: "23 funcionários · +12/mês",
    health: "expansion",
    healthLabel: "EXPANSÃO ATIVA",
    sections: [
      {
        icon: Briefcase,
        iconColor: "rgba(255,255,255,0.35)",
        label: "SINAIS DE MOVIMENTO ESTRATÉGICO",
        body: (
          <>
            <S>2</S> vagas esteticistas + <S>1</S> gestor comercial.
            <br />
            <S>1</S> vaga "social media" aberta há 3 semanas.
            <br />
            Sinal: vão aumentar produção de conteúdo.
          </>
        ),
      },
      {
        icon: Users,
        iconColor: "rgba(59,130,246,0.7)",
        label: "ANÁLISE DE EQUIPE",
        body: (
          <>
            <S>23</S> funcionários declarados. Crescimento: <S>+12</S> nos últimos 6 meses.
            <br />
            Nenhum especialista em marketing na equipe pública.
          </>
        ),
      },
      {
        icon: Megaphone,
        iconColor: "rgba(245,158,11,0.7)",
        label: "PUBLICAÇÕES RECENTES",
        body: (
          <>
            Laser fracionado italiano — diferenciação técnica.
            <br />
            Nenhum depoimento publicado nos últimos <S>90 dias</S>.
          </>
        ),
      },
      {
        icon: Triangle,
        iconColor: "rgba(255,149,0,0.75)",
        label: "GAP DEIXADO EXPOSTO",
        body: (
          <>
            Cultura e equipe: território completamente livre.
            <br />
            Employer branding = <S>0</S> investimento detectado.
          </>
        ),
      },
    ],
  },
  {
    platform: "YOUTUBE",
    icon: Youtube,
    color: "255,0,0",
    handle: "Nicho SP estética",
    metrics: "2.1M views mapeados · 0 canais ativos",
    health: "free",
    healthLabel: "TERRITÓRIO LIVRE",
    sections: [
      {
        icon: Play,
        iconColor: "rgba(255,255,255,0.35)",
        label: "VÍDEO MAIS ASSISTIDO DO NICHO",
        body: (
          <>
            "Minha experiência na clínica X" — <S>847k</S> views.
            <br />
            Produzido por: cliente insatisfeita. <S>78%</S> dos comentários negativos sobre preço.
          </>
        ),
      },
      {
        icon: Search,
        iconColor: "rgba(239,68,68,0.7)",
        label: "BUSCAS SEM RESULTADO",
        body: (
          <>
            "clínica estética são paulo preço"
            <br />
            "harmonização facial sp quanto custa"
            <br />
            "criolipólise sp antes depois real"
            <br />
            <S>Nenhum</S> canal local responde.
          </>
        ),
      },
      {
        icon: BarChart3,
        iconColor: "rgba(16,185,129,0.7)",
        label: "OPORTUNIDADE QUANTIFICADA",
        body: (
          <>
            Volume mensal: <S>14.200</S> buscas
            <br />
            Concorrentes ativos: <S>0</S>
            <br />
            Custo para criar canal: <S>zero</S>
          </>
        ),
      },
      {
        icon: Triangle,
        iconColor: "rgba(255,149,0,0.75)",
        label: "GAP DEIXADO EXPOSTO",
        body: (
          <>
            Formato "tour clínica + preços + procedimentos" tem <S>0</S> concorrentes locais e <S>14k</S> buscas/mês.
          </>
        ),
      },
    ],
  },
];

function HealthBadge({ status, label }: { status: HealthStatus; label: string }) {
  const config: Record<HealthStatus, { color: string; icon: LucideIcon }> = {
    healthy: { color: "16,185,129", icon: CheckCircle2 },
    suspicious: { color: "245,158,11", icon: AlertTriangle },
    fake: { color: "239,68,68", icon: XCircle },
    expansion: { color: "16,185,129", icon: CheckCircle2 },
    free: { color: "16,185,129", icon: CheckCircle2 },
  };
  const { color, icon: Icon } = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 shrink-0"
      style={{
        padding: "3px 7px",
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "1px",
        background: `rgba(${color},0.10)`,
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        border: `1px solid rgba(${color},0.30)`,
        color: `rgba(${color},0.90)`,
      }}
    >
      <Icon size={9} strokeWidth={2.6} />
      {label}
    </span>
  );
}

export function PlatformGrid() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.platform}
            className="mios-float overflow-hidden relative"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={() => setHovered(card.platform)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between gap-3"
              style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `rgba(${card.color},0.12)`,
                    backdropFilter: "blur(12px) saturate(160%)",
                    WebkitBackdropFilter: "blur(12px) saturate(160%)",
                    border: `1px solid rgba(${card.color},0.30)`,
                    color: `rgba(${card.color},0.95)`,
                  }}
                >
                  <Icon size={14} strokeWidth={2.4} />
                </span>
                <div className="min-w-0">
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      color: "rgba(255,255,255,0.30)",
                    }}
                  >
                    {card.platform}
                  </div>
                  <div
                    className="truncate"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.72)",
                    }}
                  >
                    {card.handle}
                  </div>
                  <div
                    className="mt-0.5 truncate"
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}
                  >
                    {card.metrics}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <HealthBadge status={card.health} label={card.healthLabel} />
                <button
                  onClick={() => toast.success("Dossiê gerado com sucesso.")}
                  className="inline-flex items-center gap-1 transition-opacity"
                  style={{
                    opacity: hovered === card.platform ? 1 : 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,149,0,0.7)",
                    padding: "3px 7px",
                    borderRadius: 5,
                    background: "rgba(255,149,0,0.06)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    border: "1px solid rgba(255,149,0,0.18)",
                  }}
                >
                  <ExternalLink size={9} strokeWidth={2.4} />
                  Exportar dossiê
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "12px 14px" }}>
              {card.sections.map((section, idx) => {
                const SIcon = section.icon;
                return (
                  <div key={idx}>
                    {idx > 0 && (
                      <div
                        style={{
                          height: 1,
                          background: "rgba(255,255,255,0.04)",
                          margin: "10px 0",
                        }}
                      />
                    )}
                    <div className="flex items-center gap-1.5">
                      <SIcon size={10} strokeWidth={2.4} style={{ color: section.iconColor }} />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: section.iconColor,
                        }}
                      >
                        {section.label}
                      </span>
                    </div>
                    <div
                      className="mt-1.5"
                      style={{
                        fontSize: 10.5,
                        lineHeight: 1.65,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {section.body}
                    </div>
                    {section.cta && (
                      <button
                        className="mt-1.5"
                        style={{
                          fontSize: 11,
                          color: "rgba(255,149,0,0.55)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {section.cta} →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}