import { Instagram, Music2, Linkedin, Youtube, Pin, MessageCircle, AlertTriangle, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SectionType = "post" | "comment" | "gap" | "trend";

interface CardSection {
  type: SectionType;
  title: string;
  text: React.ReactNode;
}

interface PlatformCard {
  platform: string;
  icon: LucideIcon;
  color: string;
  handle: string;
  metric: { value: string; label: string };
  metricSecondary: { value: string; label: string };
  sections: CardSection[];
}

const cards: PlatformCard[] = [
  {
    platform: "INSTAGRAM",
    icon: Instagram,
    color: "225,48,108",
    handle: "@clinicabella_sp",
    metric: { value: "4.2%", label: "ENGAJ." },
    metricSecondary: { value: "48.3k", label: "SEGUID." },
    sections: [
      {
        type: "post",
        title: "Post mais engajado",
        text: (
          <>
            Antes/depois criolipólise — <Strong>28.4k</Strong> curtidas. Formato que performa.
          </>
        ),
      },
      {
        type: "comment",
        title: "Comentário mais recorrente",
        text: (
          <>
            <Strong>"quanto custa?"</Strong> aparece <Strong>312x</Strong>. Oportunidade de conteúdo de preço transparente.
          </>
        ),
      },
      {
        type: "gap",
        title: "Gap detectado",
        text: <>Zero conteúdo de pós-procedimento publicado — audiência pede, ninguém entrega.</>,
      },
    ],
  },
  {
    platform: "TIKTOK",
    icon: Music2,
    color: "255,255,255",
    handle: "@esteticasp_oficial",
    metric: { value: "8.7%", label: "ENGAJ." },
    metricSecondary: { value: "12.1k", label: "SEGUID." },
    sections: [
      {
        type: "post",
        title: "Vídeo viral",
        text: (
          <>
            "Dia na clínica de estética" — <Strong>1.2M</Strong> views. Bastidores autênticos performam <Strong>3x</Strong> mais que resultado.
          </>
        ),
      },
      {
        type: "comment",
        title: "Comentário mais recorrente",
        text: (
          <>
            <Strong>"que clínica é essa?"</Strong> — <Strong>89x</Strong>. Não estão divulgando nome/cidade.
          </>
        ),
      },
      {
        type: "trend",
        title: "Tendência detectada",
        text: (
          <>
            Skincare + procedimento combo crescendo <Strong>340%</Strong> em buscas nos últimos 3 meses.
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
    metric: { value: "+12", label: "/MÊS" },
    metricSecondary: { value: "23", label: "FUNCION." },
    sections: [
      {
        type: "trend",
        title: "Sinal de expansão",
        text: (
          <>
            <Strong>2</Strong> vagas para esteticistas + <Strong>1</Strong> gestor comercial. Contratando aceleradamente.
          </>
        ),
      },
      {
        type: "post",
        title: "Publicação recente",
        text: <>Laser fracionado italiano — diferenciação por equipamento importado.</>,
      },
      {
        type: "gap",
        title: "Oportunidade",
        text: <>Nenhum concorrente publica sobre cultura e equipe — território de employer branding livre.</>,
      },
    ],
  },
  {
    platform: "YOUTUBE",
    icon: Youtube,
    color: "255,0,0",
    handle: "Top vídeos SP estética",
    metric: { value: "2.1M", label: "VIEWS" },
    metricSecondary: { value: "0", label: "CANAIS ATIV." },
    sections: [
      {
        type: "post",
        title: "Vídeo mais assistido",
        text: (
          <>
            "Minha experiência na clínica X" — <Strong>847k</Strong> views. Dor: não saber preço antes.
          </>
        ),
      },
      {
        type: "gap",
        title: "Gap crítico",
        text: <><Strong>Nenhuma clínica de estética em SP tem canal ativo.</Strong> Território completamente livre.</>,
      },
      {
        type: "trend",
        title: "Oportunidade imediata",
        text: (
          <>
            Formato "tour pela clínica + explicação dos procedimentos" tem <Strong>0</Strong> concorrentes locais.
          </>
        ),
      },
    ],
  },
];

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "rgba(255,149,0,0.85)", fontWeight: 600 }}>{children}</span>
  );
}

const sectionMeta: Record<SectionType, { icon: LucideIcon; labelColor: string }> = {
  post: { icon: Pin, labelColor: "rgba(255,255,255,0.30)" },
  comment: { icon: MessageCircle, labelColor: "rgba(59,130,246,0.7)" },
  gap: { icon: AlertTriangle, labelColor: "rgba(255,149,0,0.7)" },
  trend: { icon: TrendingUp, labelColor: "rgba(168,85,247,0.7)" },
};

export function PlatformGrid() {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.platform}
            className="mios-float overflow-hidden"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: `rgba(${card.color},0.12)`,
                    border: `1px solid rgba(${card.color},0.30)`,
                    color: `rgba(${card.color},0.95)`,
                  }}
                >
                  <Icon size={13} strokeWidth={2.4} />
                </span>
                <div className="min-w-0">
                  <div
                    style={{
                      fontSize: 8,
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
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {card.handle}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-baseline justify-end gap-1">
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>
                    {card.metric.value}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: "1px",
                      color: "rgba(255,255,255,0.20)",
                    }}
                  >
                    {card.metric.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-end gap-1 mt-0.5">
                  <span
                    style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.40)" }}
                  >
                    {card.metricSecondary.value}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: "1px",
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    {card.metricSecondary.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "12px 14px" }}>
              {card.sections.map((section, idx) => {
                const meta = sectionMeta[section.type];
                const SIcon = meta.icon;
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
                      <SIcon size={9} strokeWidth={2.4} style={{ color: meta.labelColor }} />
                      <span
                        style={{
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "1.2px",
                          textTransform: "uppercase",
                          color: meta.labelColor,
                        }}
                      >
                        {section.title}
                      </span>
                    </div>
                    <div
                      className="mt-1.5"
                      style={{
                        fontSize: 11,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {section.text}
                    </div>
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