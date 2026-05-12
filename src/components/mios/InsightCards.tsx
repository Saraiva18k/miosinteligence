import { Zap } from "lucide-react";

type InsightType = "force" | "warn" | "risk" | "info";

interface Insight {
  type: InsightType;
  tag: string;
  title: string;
  body: string;
}

const insights: Insight[] = [
  {
    type: "force",
    tag: "Força",
    title: "Demanda reprimida por solução premium",
    body: "78% das clientes pesquisadas pagariam +R$150/sessão por atendimento boutique com protocolos validados — mercado atual entrega processo industrializado.",
  },
  {
    type: "force",
    tag: "Força",
    title: "Concorrentes com NPS médio de 31",
    body: "Análise de 4.200 reviews públicos revela frustração consistente com pós-venda e personalização. Brecha clara para posicionamento de cuidado premium.",
  },
  {
    type: "warn",
    tag: "Atenção",
    title: "Custo de aquisição em escala",
    body: "Meta Ads para o nicho está saturado em SP capital — CPL subiu 62% em 12 meses. Estratégia inicial deve priorizar parcerias e indicação.",
  },
  {
    type: "risk",
    tag: "Risco",
    title: "Compliance ANVISA em equipamentos",
    body: "Dois protocolos populares (criolipólise e radiofrequência fracionada) exigem registro técnico e responsável habilitado. Investimento inicial obrigatório.",
  },
];

const typeStyles: Record<
  InsightType,
  { border: string; tagColor: string }
> = {
  force: {
    border: "rgba(16,185,129,0.40)",
    tagColor: "rgba(16,185,129,0.65)",
  },
  warn: {
    border: "rgba(245,158,11,0.40)",
    tagColor: "rgba(245,158,11,0.65)",
  },
  risk: {
    border: "rgba(239,68,68,0.40)",
    tagColor: "rgba(239,68,68,0.60)",
  },
  info: {
    border: "rgba(59,130,246,0.40)",
    tagColor: "rgba(59,130,246,0.60)",
  },
};

export function InsightCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {insights.map((ins, i) => {
        const s = typeStyles[ins.type];
        return (
          <article
            key={i}
            className="group relative fade-in-up mios-float transition-transform"
            style={{
              borderRadius: 10,
              padding: "14px 16px",
              borderLeft: `2px solid ${s.border}`,
              animationDelay: `${0.2 + i * 0.08}s`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "2px",
                color: s.tagColor,
                textTransform: "uppercase",
              }}
            >
              {ins.tag}
            </div>
            <h3
              className="mt-2"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.35,
                paddingRight: 60,
              }}
            >
              {ins.title}
            </h3>
            <p
              className="mt-1.5"
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.65,
              }}
            >
              {ins.body}
            </p>

            <button
              className="absolute flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                top: 10,
                right: 10,
                padding: "4px 9px",
                borderRadius: 6,
                background: "rgba(255,149,0,0.12)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                border: "1px solid rgba(255,149,0,0.20)",
                color: "rgba(255,149,0,0.80)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              <Zap size={8} strokeWidth={3} fill="currentColor" />
              Aprofundar
            </button>
          </article>
        );
      })}
    </div>
  );
}
