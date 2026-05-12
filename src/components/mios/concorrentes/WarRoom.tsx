import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Bell,
  Shield,
  DollarSign,
  Megaphone,
  Zap,
  MapPin,
  Calendar,
  TrendingDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ThreatLevel = "critical" | "high" | "medium" | "low";
type PricingPosition = "budget" | "mid" | "premium" | "luxury";

interface CompetitorData {
  id: string;
  name: string;
  initials: string;
  isHero?: boolean;
  threatLevel: ThreatLevel;
  score: number;
  location: string;
  established: string;
  product: { name: string; description: string; differential: string };
  pricing: { range: string; position: PricingPosition; strategy: string };
  marketing: {
    channels: Array<{ name: string; value: string }>;
    frequency: string;
    topMessage: string;
  };
  weaknesses: string[];
  opportunity: string;
  recentAlert?: { message: string; daysAgo: number };
  dimensions: {
    produto: number;
    preco: number;
    marketing: number;
    atendimento: number;
    online: number;
  };
}

// ─── Static mock data ─────────────────────────────────────────────────────────

const mockCompetitors: CompetitorData[] = [
  {
    id: "c1",
    name: "Beleza Premium SP",
    initials: "BP",
    isHero: true,
    threatLevel: "critical",
    score: 84,
    location: "Itaim Bibi, SP",
    established: "2018",
    product: {
      name: "Studio Completo",
      description:
        "Atendimento full-service em ambiente de alto padrao. Cabine privativa, cha e aromaterapia incluso.",
      differential: "Cabine privativa + experiencia sensorial",
    },
    pricing: {
      range: "R$280-R$580/sessao",
      position: "premium",
      strategy: "Preco ancora alto com promocoes sazonais",
    },
    marketing: {
      channels: [
        { name: "Instagram", value: "42k" },
        { name: "TikTok", value: "18k" },
        { name: "Google Ads", value: "ativo" },
      ],
      frequency: "4-5x/semana",
      topMessage: "Voce merece o melhor",
    },
    weaknesses: [
      "Avaliacoes 3.8/5 - fila de espera longa",
      "Sem agendamento online proprio",
      "Alta rotatividade de profissionais",
    ],
    opportunity: "Espera media 45 min - oferea agendamento instantaneo",
    recentAlert: { message: "Lancou pacote fidelidade em marco", daysAgo: 12 },
    dimensions: { produto: 4, preco: 3, marketing: 5, atendimento: 2, online: 4 },
  },
  {
    id: "c2",
    name: "Studio Renata",
    initials: "SR",
    threatLevel: "high",
    score: 67,
    location: "Moema, SP",
    established: "2020",
    product: {
      name: "Estetica Especializada",
      description:
        "Foco em tratamentos faciais e corporal avancado com equipamentos de ultima geracao.",
      differential: "HIFU + RF Multipolar propria",
    },
    pricing: {
      range: "R$200-R$420/sessao",
      position: "premium",
      strategy: "Pacotes mensais com fidelizacao",
    },
    marketing: {
      channels: [
        { name: "Instagram", value: "28k" },
        { name: "WhatsApp", value: "broadcast" },
      ],
      frequency: "3x/semana",
      topMessage: "Tecnologia que transforma",
    },
    weaknesses: [
      "Presenca no TikTok inexistente",
      "Site desatualizado desde 2022",
      "Sem programa de indicacao estruturado",
    ],
    opportunity: "Ausencia total no TikTok - canal de aquisicao aberto",
    recentAlert: { message: "Contratou nova esteticista senior", daysAgo: 7 },
    dimensions: { produto: 4, preco: 3, marketing: 3, atendimento: 4, online: 2 },
  },
  {
    id: "c3",
    name: "Wellness Center",
    initials: "WC",
    threatLevel: "medium",
    score: 51,
    location: "Vila Olimpia, SP",
    established: "2015",
    product: {
      name: "Bem-estar Integrado",
      description:
        "Mix de estetica + bem-estar. Pilates, nutricao e estetica em um unico local.",
      differential: "Modelo integrado saude + beleza",
    },
    pricing: {
      range: "R$150-R$350/sessao",
      position: "mid",
      strategy: "Mensalidade all-in R$890",
    },
    marketing: {
      channels: [
        { name: "Instagram", value: "15k" },
        { name: "Email Mkt", value: "2.1k" },
        { name: "Parcerias", value: "3 academias" },
      ],
      frequency: "2x/semana",
      topMessage: "Saude e estilo de vida",
    },
    weaknesses: [
      "Posicionamento confuso - nao e so estetica",
      "Agenda lotada sem lista de espera digital",
      "Avaliacoes inconsistentes por setor",
    ],
    opportunity: "Confusao de nicho - seja a especialista inequivoca",
    dimensions: { produto: 3, preco: 4, marketing: 2, atendimento: 3, online: 3 },
  },
  {
    id: "c4",
    name: "Espaco Natural",
    initials: "EN",
    threatLevel: "low",
    score: 33,
    location: "Brooklin, SP",
    established: "2012",
    product: {
      name: "Estetica Natural",
      description:
        "Produtos 100% naturais e veganos. Slow beauty e atendimento humanizado.",
      differential: "Certificacao vegan + slow beauty",
    },
    pricing: {
      range: "R$120-R$280/sessao",
      position: "mid",
      strategy: "Preco consciente + valores sustentaveis",
    },
    marketing: {
      channels: [
        { name: "Instagram", value: "8.4k" },
        { name: "Blog organico", value: "ativo" },
      ],
      frequency: "1-2x/semana",
      topMessage: "Beleza consciente",
    },
    weaknesses: [
      "Crescimento lento de seguidores",
      "Sem anuncios pagos",
      "Preco nao reflete custo do produto natural",
    ],
    opportunity: "Nicho sustentavel disposto a pagar premium - subvalorizado",
    dimensions: { produto: 3, preco: 3, marketing: 1, atendimento: 4, online: 2 },
  },
];

const ourDimensions = { produto: 3, preco: 4, marketing: 2, atendimento: 5, online: 2 };

// ─── Config maps ─────────────────────────────────────────────────────────────

const THREAT: Record<ThreatLevel, { label: string; color: string; bg: string }> = {
  critical: { label: "CRITICA",  color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  high:     { label: "ALTA",     color: "#f97316", bg: "rgba(249,115,22,0.08)" },
  medium:   { label: "MEDIA",    color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  low:      { label: "BAIXA",    color: "#10b981", bg: "rgba(16,185,129,0.08)" },
};

const PRICING_LABEL: Record<PricingPosition, string> = {
  budget: "Economico", mid: "Intermediario", premium: "Premium", luxury: "Luxo",
};

const DIM_LABELS: Array<{ key: keyof typeof ourDimensions; label: string }> = [
  { key: "produto",     label: "Produto" },
  { key: "preco",       label: "Preco" },
  { key: "marketing",   label: "Marketing" },
  { key: "atendimento", label: "Atendimento" },
  { key: "online",      label: "Online" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DimDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 2,
            background: i < value ? "var(--accent)" : "rgba(255,255,255,0.07)",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle
        cx={28} cy={28} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={4}
      />
      <circle
        cx={28} cy={28} r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
      <text
        x={28} y={33}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="rgba(255,255,255,0.92)"
        fontFamily="JetBrains Mono, monospace"
      >
        {score}
      </text>
    </svg>
  );
}

type SectionKey = "product" | "pricing" | "marketing" | "weaknesses";

interface SectionProps {
  id: SectionKey;
  icon: ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function ColSection({ icon, label, open, onToggle, children }: SectionProps) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
        style={{ background: "none", cursor: "pointer", border: "none" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--accent)", opacity: 0.8 }}>{icon}</span>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 0.8, textTransform: "uppercase" as const,
          }}>
            {label}
          </span>
        </div>
        {open
          ? <ChevronUp size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
          : <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
        }
      </button>
      {open && (
        <div className="px-3 pb-3" style={{ animation: "fadeIn 0.15s ease" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function CompetitorColumn({ c }: { c: CompetitorData }) {
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    product: true, pricing: false, marketing: false, weaknesses: false,
  });
  const t = THREAT[c.threatLevel];
  const toggle = (k: SectionKey) => setOpen(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <div
      style={{
        minWidth: c.isHero ? 300 : 252,
        maxWidth: c.isHero ? 300 : 252,
        background: "var(--card)",
        border: c.isHero
          ? `1px solid ${t.color}30`
          : "1px solid rgba(255,255,255,0.055)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Hero glow strip top border */}
      {c.isHero && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`,
        }} />
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg, ${t.color}25, ${t.color}08)`,
            border: `1px solid ${t.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: t.color,
            fontFamily: "JetBrains Mono, monospace",
          }}>
            {c.initials}
          </div>
          <ScoreRing score={c.score} color={t.color} />
        </div>

        <h3 style={{
          fontSize: 13, fontWeight: 700,
          color: "rgba(255,255,255,0.92)", marginBottom: 4,
        }}>
          {c.name}
        </h3>

        <div
          className="inline-flex items-center gap-1.5 mb-3"
          style={{
            background: t.bg,
            border: `1px solid ${t.color}25`,
            borderRadius: 6, padding: "3px 8px",
          }}
        >
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: t.color, boxShadow: `0 0 6px ${t.color}`,
          }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: t.color, letterSpacing: 1,
          }}>
            AMEACA {t.label}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <MapPin size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{c.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              No mercado desde {c.established}
            </span>
          </div>
        </div>

        {c.recentAlert && (
          <div
            className="mt-3 flex items-start gap-2 rounded-lg p-2"
            style={{
              background: "rgba(255,149,0,0.06)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)",
              border: "1px solid rgba(255,149,0,0.15)",
            }}
          >
            <Bell size={10} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
            <div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: 0.6,
              }}>
                MOVIMENTO — {c.recentAlert.daysAgo}d atras
              </span>
              <p style={{
                fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 1, lineHeight: 1.4,
              }}>
                {c.recentAlert.message}
              </p>
            </div>
          </div>
        )}
      </div>

      <ColSection
        id="product" icon={<Shield size={11} />} label="Produto"
        open={open.product} onToggle={() => toggle("product")}
      >
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.6)",
          lineHeight: 1.55, marginBottom: 8,
        }}>
          {c.product.description}
        </p>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 8px" }}>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: "rgba(255,255,255,0.3)", letterSpacing: 0.6,
          }}>
            DIFERENCIAL
          </span>
          <p style={{ fontSize: 13, color: "rgba(255,149,0,0.85)", marginTop: 2 }}>
            {c.product.differential}
          </p>
        </div>
      </ColSection>

      <ColSection
        id="pricing" icon={<DollarSign size={11} />} label="Preco"
        open={open.pricing} onToggle={() => toggle("pricing")}
      >
        <div className="flex items-center justify-between mb-2">
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "JetBrains Mono, monospace",
          }}>
            {c.pricing.range}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 4, padding: "2px 6px",
          }}>
            {PRICING_LABEL[c.pricing.position]}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
          {c.pricing.strategy}
        </p>
      </ColSection>

      <ColSection
        id="marketing" icon={<Megaphone size={11} />} label="Marketing"
        open={open.marketing} onToggle={() => toggle("marketing")}
      >
        <div className="flex flex-wrap gap-1.5 mb-3">
          {c.marketing.channels.map(ch => (
            <div
              key={ch.name}
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 5, padding: "3px 7px",
              }}
            >
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{ch.name} </span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {ch.value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>FREQUENCIA</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
            {c.marketing.frequency}
          </span>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 8px",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>MENSAGEM PRINCIPAL</span>
          <p style={{
            fontSize: 13, fontStyle: "italic",
            color: "rgba(255,255,255,0.6)", marginTop: 2,
          }}>
            {c.marketing.topMessage}
          </p>
        </div>
      </ColSection>

      <ColSection
        id="weaknesses" icon={<TrendingDown size={11} />} label="Fraquezas"
        open={open.weaknesses} onToggle={() => toggle("weaknesses")}
      >
        <div className="space-y-1.5 mb-3">
          {c.weaknesses.map((w, i) => (
            <div key={i} className="flex items-start gap-2">
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "#ef4444", marginTop: 4, flexShrink: 0,
              }} />
              <span style={{
                fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.45,
              }}>
                {w}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          background: "rgba(16,185,129,0.07)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          border: "1px solid rgba(16,185,129,0.18)",
          borderRadius: 7, padding: "8px 10px",
        }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={9} style={{ color: "#10b981" }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: 0.6,
            }}>
              SUA OPORTUNIDADE
            </span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
            {c.opportunity}
          </p>
        </div>
      </ColSection>

      {/* Dimension dots footer */}
      <div
        className="px-4 py-3 mt-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="space-y-2">
          {DIM_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.3)", width: 64, flexShrink: 0,
              }}>
                {label}
              </span>
              <DimDots value={c.dimensions[key]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Battle Map ───────────────────────────────────────────────────────────────

function BattleMap() {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid rgba(255,255,255,0.055)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)", boxShadow: "0 0 8px var(--accent)",
          }} />
          <h2 style={{
            fontSize: 13, fontWeight: 700,
            color: "rgba(255,255,255,0.7)", letterSpacing: 1,
          }}>
            MAPA DE BATALHA
          </h2>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginLeft: 4 }}>
            — comparativo de forcas por dimensao
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th style={{
                width: 120, padding: "10px 20px", textAlign: "left",
                fontSize: 11, fontWeight: 600,
                color: "rgba(255,255,255,0.25)", letterSpacing: 0.8,
              }}>
                DIMENSAO
              </th>
              <th style={{ padding: "10px 16px", textAlign: "center" }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: "var(--accent)", letterSpacing: 0.6,
                }}>
                  NOS
                </div>
              </th>
              {mockCompetitors.map(c => (
                <th key={c.id} style={{ padding: "10px 16px", textAlign: "center" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: "rgba(255,255,255,0.35)", letterSpacing: 0.5,
                  }}>
                    {c.initials}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIM_LABELS.map(({ key, label }, rowIdx) => (
              <tr
                key={key}
                style={{
                  borderBottom:
                    rowIdx < DIM_LABELS.length - 1
                      ? "1px solid rgba(255,255,255,0.03)"
                      : "none",
                  background:
                    rowIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                }}
              >
                <td style={{
                  padding: "10px 20px", fontSize: 12, fontWeight: 500,
                  color: "rgba(255,255,255,0.45)",
                }}>
                  {label}
                </td>
                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                  <div className="flex justify-center">
                    <DimDots value={ourDimensions[key]} />
                  </div>
                </td>
                {mockCompetitors.map(c => {
                  const val = c.dimensions[key];
                  const ours = ourDimensions[key];
                  const isWinning = ours > val;
                  const isTied = ours === val;
                  return (
                    <td key={c.id} style={{ padding: "10px 16px", textAlign: "center" }}>
                      <div className="flex flex-col items-center gap-1">
                        <DimDots value={val} />
                        <span style={{
                          fontSize: 10, letterSpacing: 0.4, fontWeight: 600,
                          color: isWinning
                            ? "#10b981"
                            : isTied
                            ? "rgba(255,255,255,0.2)"
                            : "#ef4444",
                        }}>
                          {isWinning ? "vantagem" : isTied ? "empate" : "perigo"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function WarRoom() {
  return (
    <div className="space-y-5">
      {/* Module header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#ef4444", boxShadow: "0 0 8px #ef4444",
              animation: "pulse 2s infinite",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#ef4444", letterSpacing: 1.2,
            }}>
              4 CONCORRENTES MONITORADOS
            </span>
          </div>
          <h1 style={{
            fontSize: 20, fontWeight: 800,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: -0.5, marginBottom: 4,
          }}>
            A Sala de Guerra
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Inteligencia competitiva em tempo real · Itaim Bibi, SP · raio 5km
          </p>
        </div>

        {/* Threat summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["critical", "high", "medium", "low"] as ThreatLevel[]).map(level => {
            const count = mockCompetitors.filter(c => c.threatLevel === level).length;
            if (!count) return null;
            const t = THREAT[level];
            return (
              <div
                key={level}
                className="flex items-center gap-1.5"
                style={{
                  background: t.bg,
                  border: `1px solid ${t.color}25`,
                  borderRadius: 6, padding: "4px 10px",
                }}
              >
                <div style={{
                  width: 5, height: 5, borderRadius: "50%", background: t.color,
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: t.color }}>
                  {count} {t.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Competitor columns — horizontal scroll */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {mockCompetitors.map(c => (
            <CompetitorColumn key={c.id} c={c} />
          ))}
        </div>
      </div>

      {/* Battle map */}
      <BattleMap />
    </div>
  );
}
