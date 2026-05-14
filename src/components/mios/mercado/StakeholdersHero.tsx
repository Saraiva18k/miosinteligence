import { Network, Users, TrendingUp, Building2, Star, Link2 } from "lucide-react";

const KF = `
@keyframes sk-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes sk-pulse  { 0%,100%{opacity:0.4} 50%{opacity:1} }
@keyframes sk-ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
`;

const NODES = [
  { id: "you",   label: "Seu Negócio",        type: "center",   x: 50,  y: 50  },
  { id: "inv1",  label: "Investidor A",        type: "investor", x: 20,  y: 20  },
  { id: "inv2",  label: "Investidor B",        type: "investor", x: 80,  y: 18  },
  { id: "par1",  label: "Parceiro Estratégico",type: "partner",  x: 15,  y: 65  },
  { id: "par2",  label: "Distribuidor",        type: "partner",  x: 82,  y: 70  },
  { id: "inf1",  label: "Influenciador #1",    type: "influencer",x: 48, y: 14  },
  { id: "inf2",  label: "Influenciador #2",    type: "influencer",x: 30, y: 82  },
  { id: "inf3",  label: "Comunidade",          type: "influencer",x: 70, y: 85  },
];

const EDGES = [
  ["you","inv1"],["you","inv2"],["you","par1"],["you","par2"],
  ["you","inf1"],["you","inf2"],["you","inf3"],
  ["inv1","inf1"],["par2","inf3"],
];

const TYPE_COLOR: Record<string, string> = {
  center:     "#ff9500",
  investor:   "rgba(16,185,129,0.85)",
  partner:    "rgba(99,102,241,0.85)",
  influencer: "rgba(236,72,153,0.75)",
};

const CATEGORIES = [
  { Icon: TrendingUp,  label: "Investidores",    count: "12 mapeados", color: "rgba(16,185,129,0.7)"  },
  { Icon: Building2,   label: "Parceiros",        count: "8 potenciais", color: "rgba(99,102,241,0.7)"  },
  { Icon: Star,        label: "Influenciadores",  count: "23 relevantes",color: "rgba(236,72,153,0.65)" },
  { Icon: Users,       label: "Comunidades",      count: "5 ativas",    color: "rgba(255,149,0,0.7)"   },
];

export function StakeholdersHero() {
  return (
    <>
      <style>{KF}</style>

      {/* Hero */}
      <div style={{
        borderRadius: 16, marginBottom: 24, padding: "28px 28px 24px", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, rgba(255,149,0,0.08) 0%, rgba(4,6,15,0) 100%)",
        border: "1px solid rgba(255,149,0,0.16)",
      }}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.24)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Network size={22} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>MÓDULO · MERCADO</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.92)" }}>Mapa de Stakeholders</div>
            </div>
            <div style={{ marginLeft: "auto", padding: "5px 10px", borderRadius: 8, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.18)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,149,0,0.75)", letterSpacing: 1 }}>EM BREVE</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.65, maxWidth: 620 }}>
            Mapeie o ecossistema completo ao redor do seu negócio: investidores ativos no segmento,
            parceiros estratégicos, influenciadores e comunidades que moldam o mercado.
          </p>
        </div>
      </div>

      {/* Network visualization preview */}
      <div style={{ borderRadius: 14, padding: "24px", marginBottom: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.28)", marginBottom: 16 }}>PREVIEW — MAPA DE RELAÇÕES</div>

        {/* SVG network */}
        <div style={{ position: "relative", height: 260 }}>
          <svg width="100%" height="260" style={{ position: "absolute", inset: 0 }}>
            {/* Edges */}
            {EDGES.map(([a, b]) => {
              const na = NODES.find(n => n.id === a)!;
              const nb = NODES.find(n => n.id === b)!;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={`${na.x}%`} y1={`${na.y}%`}
                  x2={`${nb.x}%`} y2={`${nb.y}%`}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {NODES.map(node => {
            const color = TYPE_COLOR[node.type];
            const isCenter = node.type === "center";
            const size = isCenter ? 52 : 36;
            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${node.x}%`, top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                  animation: `sk-float ${2 + Math.random() * 2}s ease ${Math.random() * 1.5}s infinite`,
                  zIndex: isCenter ? 2 : 1,
                }}
              >
                {/* Ripple for center */}
                {isCenter && (
                  <div style={{
                    position: "absolute", inset: -8, borderRadius: "50%",
                    border: `1px solid ${color}`,
                    animation: "sk-ripple 2.5s ease-out infinite",
                    opacity: 0.4,
                  }} />
                )}
                <div style={{
                  width: size, height: size, borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${color.replace(')', ', 0.3)').replace('rgba', 'rgba').replace(', 0.3)', ', 0.2)')}, rgba(4,6,15,0.8))`,
                  border: `1.5px solid ${color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 16px -4px ${color}`,
                }}>
                  <Network size={isCenter ? 18 : 12} strokeWidth={1.8} style={{ color }} />
                </div>
                <div style={{
                  position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                  marginTop: 4, whiteSpace: "nowrap",
                  fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.4)",
                }}>
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 16, justifyContent: "center" }}>
          {Object.entries(TYPE_COLOR).filter(([k]) => k !== "center").map(([type, color]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "capitalize" }}>{type === "influencer" ? "Influenciador" : type === "investor" ? "Investidor" : type === "partner" ? "Parceiro" : type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {CATEGORIES.map(({ Icon, label, count, color }) => (
          <div key={label} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Icon size={18} strokeWidth={1.8} style={{ color, marginBottom: 10 }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{count}</div>
          </div>
        ))}
      </div>
    </>
  );
}
