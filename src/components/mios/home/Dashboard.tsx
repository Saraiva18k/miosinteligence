import { Link } from "@tanstack/react-router";
import {
  Heart, Target, TrendingUp, Users, MessageCircle,
  Share2, DollarSign, Globe, Layers, Lightbulb,
  Shield, BarChart3, FileText, Sparkles, ArrowRight,
  Brain, Zap, Plus, MapPin, CheckCircle,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    section: "PESQUISA",
    items: [
      { label: "Dores",               href: "/dores",               Icon: Heart,         status: "done",   insight: "Gap de confiança real"       },
      { label: "Concorrentes",        href: "/concorrentes",        Icon: Target,        status: "done",   insight: "5 players, NPS baixo"        },
      { label: "Tendências",          href: "/tendencias",          Icon: TrendingUp,    status: "done",   insight: "Busca +340% em 6 meses"      },
      { label: "Audiência",           href: "/audiencia",           Icon: Users,         status: "done",   insight: "2 personas identificadas"    },
      { label: "Sentimento",          href: "/sentimento",          Icon: MessageCircle, status: "done",   insight: "NPS consolidado"             },
      { label: "Canais",              href: "/canais",              Icon: Share2,        status: "done",   insight: "Instagram + WhatsApp"        },
      { label: "Precificação",        href: "/precificacao",        Icon: DollarSign,    status: "done",   insight: "Ticket ideal R$310"          },
      { label: "Social Intelligence", href: "/social-intelligence", Icon: Globe,         status: "done",   insight: "2 alertas ativos"            },
      { label: "DNA da Marca",        href: "/dna",                 Icon: Layers,        status: "done",   insight: "Arquétipo definido"          },
    ],
  },
  {
    section: "SÍNTESE",
    items: [
      { label: "Inovação",      href: "/inovacao",      Icon: Lightbulb, status: "done",   insight: "3 oportunidades mapeadas" },
      { label: "Compliance",    href: "/compliance",    Icon: Shield,    status: "done",   insight: "Risco médio · R01 crítico" },
      { label: "Investimento",  href: "/investimento",  Icon: BarChart3, status: "done",   insight: "ROI 67% · Mês 5 breakeven" },
      { label: "Business Plan", href: "/business-plan", Icon: FileText,  status: "done",   insight: "78% completo · Revisão"  },
      { label: "Veredito",      href: "/veredito",      Icon: Sparkles,  status: "active", insight: "Score 87 · Pronto"       },
    ],
  },
];

const WORKSPACES = [
  { id: "1", initial: "E", name: "Estética Premium SP", location: "São Paulo",      stage: "ativo",     progress: 93, score: 87, active: true  },
  { id: "2", initial: "C", name: "Café Boutique RJ",    location: "Rio de Janeiro", stage: "validando", progress: 32, score: 41, active: false },
  { id: "3", initial: "S", name: "Studio Pilates BH",   location: "Belo Horizonte", stage: "ativo",     progress: 67, score: 62, active: false },
];

const MENTOR_INSIGHTS = [
  { text: "Janela 22h–23h ignorada por todos os concorrentes — oportunidade de aquisição imediata", type: "opportunity" },
  { text: "Score 87/100 acima do limiar de investimento. Viabilidade estratégica confirmada.", type: "score" },
  { text: "Breakeven projetado no mês 5. ROI de 67% ao final do primeiro ano.", type: "financial" },
];

const STAGE_LABEL: Record<string, string> = {
  ideia: "Ideia", validando: "Validando", ativo: "Ativo", escalando: "Escalando",
};

// ─── Mini score ring ──────────────────────────────────────────────────────────

function MiniRing({ value, size = 44 }: { value: number; size?: number }) {
  const R = size / 2 - 4;
  const C = 2 * Math.PI * R;
  const offset = C - (value / 100) * C;
  const color = value >= 75 ? "#10b981" : value >= 50 ? "#ff9500" : "#f59e0b";
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
      <circle
        cx={size / 2} cy={size / 2} r={R} fill="none"
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.7s ease" }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle"
        fill={color} fontSize={size * 0.28} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {value}
      </text>
    </svg>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────

function ModuleCard({ label, href, Icon, status, insight }: {
  label: string; href: string; Icon: any; status: string; insight: string;
}) {
  const done   = status === "done";
  const active = status === "active";
  const dotColor = done ? "#10b981" : active ? "#ff9500" : "rgba(255,255,255,0.15)";

  return (
    <Link
      to={href as any}
      style={{
        display: "flex", flexDirection: "column", gap: 8,
        padding: "12px 14px", borderRadius: 10, textDecoration: "none",
        background: active ? "rgba(255,149,0,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(255,149,0,0.25)" : done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)"}`,
        transition: "all 0.18s", cursor: "pointer",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = active ? "rgba(255,149,0,0.1)" : "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = active ? "rgba(255,149,0,0.35)" : "rgba(255,255,255,0.1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? "rgba(255,149,0,0.07)" : "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLElement).style.borderColor = active ? "rgba(255,149,0,0.25)" : done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0, boxShadow: active ? "0 0 8px rgba(255,149,0,0.7)" : done ? "0 0 6px rgba(16,185,129,0.4)" : "none" }} />
          <Icon size={12} style={{ color: active ? "#ff9500" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }} />
        </div>
        {done && <CheckCircle size={11} style={{ color: "rgba(16,185,129,0.6)" }} />}
        {active && <ArrowRight size={11} style={{ color: "rgba(255,149,0,0.7)" }} />}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: active ? 700 : 600, color: active ? "rgba(255,149,0,0.95)" : done ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.3)", marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: active ? "rgba(255,149,0,0.55)" : "rgba(255,255,255,0.25)", lineHeight: 1.3 }}>
          {insight}
        </div>
      </div>
    </Link>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function Dashboard() {
  const ws         = WORKSPACES.find(w => w.active)!;
  const allModules = MODULES.flatMap(s => s.items);
  const done       = allModules.filter(m => m.status === "done").length;
  const total      = allModules.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 48 }}>

      {/* ── Workspace Hero ──────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 16, padding: "24px 28px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 80px -20px rgba(255,149,0,0.08)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
          <div style={{ flex: 1 }}>
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: "rgba(255,149,0,0.55)" }}>WORKSPACE ATIVO</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.25)", color: "rgba(255,149,0,0.85)" }}>
                {STAGE_LABEL[ws.stage]}
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "rgba(255,255,255,0.92)", letterSpacing: -0.8, margin: "0 0 6px", lineHeight: 1.1 }}>
              {ws.name}
            </h1>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <MapPin size={11} style={{ color: "rgba(255,149,0,0.5)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{ws.location}</span>
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{done} de {total} módulos concluídos</span>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
              {[
                { label: "Score estratégico", value: `${ws.score}/100`,   color: "#ff9500" },
                { label: "Módulos concluídos", value: `${done}/${total}`, color: "rgba(255,255,255,0.7)" },
                { label: "Evolução",           value: `${ws.progress}%`,  color: "#10b981" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: stat.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${ws.progress}%`, borderRadius: 2, background: "linear-gradient(90deg, #ff9500, #10b981)", transition: "width 0.8s ease" }} />
            </div>
          </div>

          {/* Right: Ring + CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginLeft: 32 }}>
            <MiniRing value={ws.score} size={88} />
            <Link
              to="/veredito"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 9, textDecoration: "none",
                background: "linear-gradient(135deg, rgba(255,149,0,0.85), rgba(255,100,0,0.75))",
                border: "1px solid rgba(255,149,0,0.5)",
                boxShadow: "0 4px 18px -4px rgba(255,149,0,0.35)",
                fontSize: 12, fontWeight: 700, color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              <Sparkles size={12} /> Ver Veredito
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>

        {/* ── Module Pipeline ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MODULES.map(section => (
            <div key={section.section} style={{
              borderRadius: 14, padding: "18px 20px",
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.25)" }}>{section.section}</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
                  {section.items.filter(m => m.status === "done").length}/{section.items.length}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {section.items.map(m => <ModuleCard key={m.label} {...m} />)}
              </div>
            </div>
          ))}
        </div>

        {/* ── Right column ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Mentor IA panel */}
          <div style={{
            borderRadius: 14, padding: "18px 18px",
            background: "linear-gradient(145deg, rgba(255,149,0,0.09) 0%, rgba(255,80,0,0.04) 100%)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255,149,0,0.2)",
            boxShadow: "0 4px 24px -8px rgba(255,149,0,0.15)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ position: "relative", width: 8, height: 8 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(16,185,129,0.5)", animation: "online-ripple 2s ease-out infinite" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "#ff9500" }}>MENTOR IA</span>
              </div>
              <MiniRing value={ws.score} size={44} />
            </div>

            {/* Insights */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, position: "relative" }}>
              {MENTOR_INSIGHTS.map((ins, i) => (
                <div key={i} style={{
                  padding: "8px 10px", borderRadius: 8,
                  background: "rgba(255,149,0,0.06)",
                  border: "1px solid rgba(255,149,0,0.12)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <Zap size={10} style={{ color: "rgba(255,149,0,0.6)", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{ins.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/mentor"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "9px 14px", borderRadius: 9, textDecoration: "none", width: "100%",
                background: "rgba(255,149,0,0.14)", border: "1px solid rgba(255,149,0,0.3)",
                fontSize: 12, fontWeight: 700, color: "rgba(255,149,0,0.9)",
              }}
            >
              <Brain size={12} /> Conversar com o Mentor
            </Link>
          </div>

          {/* Workspaces panel */}
          <div style={{
            borderRadius: 14, padding: "16px 16px",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.25)" }}>WORKSPACES</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{WORKSPACES.length} projetos</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {WORKSPACES.map(w => (
                <div key={w.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
                  background: w.active ? "rgba(255,149,0,0.07)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${w.active ? "rgba(255,149,0,0.22)" : "rgba(255,255,255,0.05)"}`,
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: w.active ? "linear-gradient(135deg, rgba(255,149,0,0.9), rgba(255,106,0,0.9))" : "rgba(255,255,255,0.06)",
                    fontSize: 13, fontWeight: 800,
                    color: w.active ? "var(--bg-base)" : "rgba(255,255,255,0.4)",
                    boxShadow: w.active ? "0 0 12px rgba(255,149,0,0.3)" : "none",
                  }}>
                    {w.initial}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: w.active ? "rgba(255,149,0,0.9)" : "rgba(255,255,255,0.65)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                      {STAGE_LABEL[w.stage]} · {w.progress}%
                    </div>
                  </div>
                  <MiniRing value={w.score} size={34} />
                </div>
              ))}
            </div>

            <button style={{
              width: "100%", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 12px", borderRadius: 8,
              background: "transparent", border: "1px dashed rgba(255,149,0,0.25)",
              fontSize: 11, fontWeight: 600, color: "rgba(255,149,0,0.55)", cursor: "pointer",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,149,0,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,149,0,0.4)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,149,0,0.85)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,149,0,0.25)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,149,0,0.55)"; }}
            >
              <Plus size={12} /> Novo workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
