import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

const KF = `
@keyframes bm-bar { from { width: 0 } to { width: var(--w) } }
`;

const BENCHMARKS = [
  { metric: "CAC médio",         yours: null,  sector: "R$ 340",   unit: "",     delta: null  },
  { metric: "LTV / CAC",         yours: null,  sector: "3.2×",     unit: "",     delta: null  },
  { metric: "Churn mensal",      yours: null,  sector: "4.1%",     unit: "",     delta: null  },
  { metric: "NPS médio",         yours: null,  sector: "32",       unit: "",     delta: null  },
  { metric: "Ticket médio",      yours: null,  sector: "R$ 890",   unit: "",     delta: null  },
  { metric: "Margem bruta",      yours: null,  sector: "58%",      unit: "",     delta: null  },
];

const SECTORS = ["SaaS B2B", "Marketplace", "Consultoria", "E-commerce", "Fintech"];

export function BenchmarkingHero() {
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
              <BarChart3 size={22} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>MÓDULO · MERCADO</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.92)" }}>Benchmarking Setorial</div>
            </div>
            <div style={{ marginLeft: "auto", padding: "5px 10px", borderRadius: 8, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.18)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,149,0,0.75)", letterSpacing: 1 }}>EM BREVE</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.65, maxWidth: 620 }}>
            Compare suas métricas-chave com os benchmarks reais do seu setor. Saiba exatamente onde você
            está — se está no top 20%, na média ou abaixo — e onde focar para escalar.
          </p>
        </div>
      </div>

      {/* Sector selector (preview) */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.28)", marginBottom: 12 }}>SELECIONE SEU SETOR</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SECTORS.map((s, i) => (
            <div key={s} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: i === 0 ? "rgba(255,149,0,0.10)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${i === 0 ? "rgba(255,149,0,0.30)" : "rgba(255,255,255,0.07)"}`,
              color: i === 0 ? "rgba(255,149,0,0.85)" : "rgba(255,255,255,0.38)",
            }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark table preview */}
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px 90px", padding: "10px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["MÉTRICA", "SEU NÚMERO", "SETOR (MED.)", "POSIÇÃO"].map(h => (
            <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.25)" }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {BENCHMARKS.map((b, i) => (
          <div key={b.metric} style={{
            display: "grid", gridTemplateColumns: "1fr 140px 140px 90px",
            padding: "13px 20px",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            borderBottom: i < BENCHMARKS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{b.metric}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", fontStyle: "italic", fontFamily: "JetBrains Mono, monospace" }}>— aguardando</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace" }}>{b.sector}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>—</div>
          </div>
        ))}
      </div>

      {/* Percentile preview */}
      <div style={{ borderRadius: 14, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.28)", marginBottom: 12 }}>DISTRIBUIÇÃO DO SETOR (PREVIEW)</div>
        {[
          { label: "Top 20%",   pct: 20, color: "rgba(16,185,129,0.7)"  },
          { label: "Mediana",   pct: 60, color: "rgba(255,149,0,0.7)"   },
          { label: "Abaixo",    pct: 20, color: "rgba(239,68,68,0.6)"   },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", width: 60, flexShrink: 0 }}>{label}</div>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color, width: 34, textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{pct}%</div>
          </div>
        ))}
      </div>
    </>
  );
}
