import { useState, useEffect, useRef } from "react";

// ─── Animations ───────────────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes mios-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.8)} }
  @keyframes mios-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes mios-sweep { 0%{opacity:0.3} 60%{opacity:0.9} 100%{opacity:0.3} }
  .mios-pulse-dot { animation: mios-pulse 2.4s ease-in-out infinite; }
  .mios-blink     { animation: mios-blink 1.1s step-end infinite; }
  .mios-sweep     { animation: mios-sweep 3s ease-in-out infinite; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Signal {
  id:        string;
  name:      string;
  count:     number;
  trendPct:  number;
  trendUp:   boolean;
  strength:  number;
  resolved:  boolean;
  sources:   Array<{ label: string; pct: number; color: string }>;
}

interface BehavioralTerm {
  term:     string;
  volume:   number;
  demand:   "alta" | "media";
  supply:   "zero" | "escassa" | "baixa";
  anomaly?: string;
  key:      boolean;
}

interface DeepVerbatim {
  srcType:  string;
  srcName:  string;
  srcSize:  string;
  quote:    string;
  date:     string;
  theme:    string;
  color:    string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SIGNALS: Signal[] = [
  {
    id: "SIG-001", name: "Abandono pós-pagamento", count: 847,
    trendPct: 34, trendUp: true, strength: 81, resolved: false,
    sources: [
      { label: "Google",   pct: 44, color: "#ef4444" },
      { label: "Facebook", pct: 31, color: "#f97316" },
      { label: "RA",       pct: 25, color: "#f59e0b" },
    ],
  },
  {
    id: "SIG-002", name: "Resultado prometido não entregue", count: 312,
    trendPct: 18, trendUp: true, strength: 61, resolved: false,
    sources: [
      { label: "Reclame Aqui", pct: 58, color: "#ef4444" },
      { label: "Google",       pct: 28, color: "#f97316" },
      { label: "Reddit",       pct: 14, color: "#6366f1" },
    ],
  },
  {
    id: "SIG-003", name: "Precificação opaca — custos ocultos", count: 289,
    trendPct: 22, trendUp: true, strength: 54, resolved: false,
    sources: [
      { label: "Facebook",  pct: 51, color: "#f97316" },
      { label: "WhatsApp",  pct: 30, color: "#10b981" },
      { label: "Google",    pct: 19, color: "#ef4444" },
    ],
  },
  {
    id: "SIG-004", name: "Tempo de espera e agenda impossível", count: 189,
    trendPct: 3, trendUp: false, strength: 41, resolved: true,
    sources: [
      { label: "Google",    pct: 67, color: "#ef4444" },
      { label: "Instagram", pct: 33, color: "#6366f1" },
    ],
  },
  {
    id: "SIG-005", name: "Sem acompanhamento pós-procedimento", count: 76,
    trendPct: 67, trendUp: true, strength: 28, resolved: false,
    sources: [
      { label: "Reddit",    pct: 48, color: "#6366f1" },
      { label: "WhatsApp",  pct: 34, color: "#10b981" },
      { label: "Facebook",  pct: 18, color: "#f97316" },
    ],
  },
];

const BEHAVIORAL: BehavioralTerm[] = [
  { term: "clínica estética sp preço tabela",          volume: 2400, demand: "alta",  supply: "zero",    anomaly: "OPORTUNIDADE CRÍTICA",   key: true  },
  { term: "resultado garantido procedimento estético",  volume: 1800, demand: "alta",  supply: "zero",    anomaly: "LACUNA CONFIRMADA",       key: true  },
  { term: "esteticista responde whatsapp à noite",      volume: 890,  demand: "media", supply: "zero",    anomaly: "JANELA IMEDIATA",         key: true  },
  { term: "quanto tempo dura resultado botox facial",   volume: 3200, demand: "alta",  supply: "escassa",                                     key: false },
  { term: "como reclamar procedimento estético sp",     volume: 1100, demand: "alta",  supply: "baixa",                                       key: false },
  { term: "studio estetica sem fila de espera sp",      volume: 640,  demand: "media", supply: "zero",    anomaly: "SUBEXPLORADO",            key: false },
];

const VERBATIMS: DeepVerbatim[] = [
  {
    srcType: "GRUPO PRIVADO",
    srcName: "Mulheres Empreendedoras SP",
    srcSize: "43.200 membros",
    quote:   "me senti enganada. simples assim. nunca mais.",
    date:    "08/04/2026",
    theme:   "Traição de confiança",
    color:   "#ef4444",
  },
  {
    srcType: "REDDIT BR",
    srcName: "r/saopaulo · thread: experiências ruins",
    srcSize: "847 upvotes · 312 comentários",
    quote:   "o problema não é o preço. é não saber o preço ANTES de decidir.",
    date:    "12/03/2026",
    theme:   "Controle vs. surpresa",
    color:   "#f59e0b",
  },
  {
    srcType: "COMENTÁRIO ABERTO",
    srcName: "post de criador de conteúdo · 2.100 curtidas",
    srcSize: "341 comentários analisados",
    quote:   "todo mundo que conheço teve problema. virou padrão do setor.",
    date:    "29/04/2026",
    theme:   "Normalização da falha",
    color:   "#6366f1",
  },
];

const EMERGENT_POINTS = [11, 18, 23, 41, 67, 112, 189, 298, 412];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Bar({ strength, color = "#ff9500" }: { strength: number; color?: string }) {
  const f = Math.round(strength / 10);
  return (
    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: -0.5 }}>
      <span style={{ color }}>{Array(f).fill("█").join("")}</span>
      <span style={{ color: "rgba(255,255,255,0.08)" }}>{Array(10 - f).fill("█").join("")}</span>
    </span>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const W = 260; const H = 56;
  const max = Math.max(...data); const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i): [number, number] => [
    (i / (data.length - 1)) * W,
    H - ((d - min) / range) * (H - 4),
  ]);
  const line  = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area  = `${line} L ${W},${H} L 0,${H} Z`;
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg width={W} height={H} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff9500" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-grad)" opacity="0.15" />
      <path d={line}  fill="none" stroke="url(#spark-grad)" strokeWidth={2} strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={4} fill="#ff9500" />
      <circle cx={lx} cy={ly} r={8} fill="none" stroke="rgba(255,149,0,0.35)" strokeWidth={1.5} />
    </svg>
  );
}

const LAYER_META = [
  { id: "01", label: "SURFACE",    sub: "O declarado"    },
  { id: "02", label: "BEHAVIORAL", sub: "O buscado"      },
  { id: "03", label: "DEEP SCAN",  sub: "Os bastidores"  },
  { id: "04", label: "CORE",       sub: "O diagnóstico"  },
  { id: "05", label: "EMERGENT",   sub: "O sinal"        },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function Interrogatorio() {
  const [activeLayer, setActiveLayer] = useState("01");
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const scrollEl = document.querySelector(".mios-scroll");
    if (!scrollEl) return;
    const onScroll = () => {
      const ids = ["01", "02", "03", "04", "05"];
      for (const id of [...ids].reverse()) {
        const el = layerRefs.current[id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveLayer(id);
            return;
          }
        }
      }
      setActiveLayer("01");
    };
    scrollEl.addEventListener("scroll", onScroll);
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── SCAN HEADER ─────────────────────────────────────── */}
      <div style={{
        padding: "14px 18px",
        background: "rgba(255,255,255,0.016)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: "3px solid #10b981",
        borderRadius: 6,
        marginBottom: 28,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
            <span className="mios-pulse-dot" style={{
              display: "inline-block", width: 7, height: 7, borderRadius: "50%",
              background: "#10b981", flexShrink: 0,
            }} />
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 2,
              color: "#10b981", fontFamily: "JetBrains Mono, monospace",
            }}>
              SCAN CONCLUÍDO
            </span>
          </div>
          <div style={{
            fontSize: 11, fontFamily: "JetBrains Mono, monospace",
            color: "rgba(255,255,255,0.55)", lineHeight: 1.6,
          }}>
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>MERCADO:</span>{" "}
            Estética Avançada · São Paulo · Modo Local
            <br />
            3.046 fontes processadas · 5 camadas de profundidade ·{" "}
            <span style={{ color: "#ff9500", fontWeight: 700 }}>Confiança: 94.7%</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 9, fontFamily: "JetBrains Mono, monospace",
            color: "rgba(255,255,255,0.22)", marginBottom: 3,
          }}>
            ÚLTIMA VARREDURA
          </div>
          <div style={{
            fontSize: 12, fontFamily: "JetBrains Mono, monospace",
            color: "rgba(255,255,255,0.6)", fontWeight: 600,
          }}>
            08/05/2026 · 14:32:07
          </div>
          <div style={{
            marginTop: 6, display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap",
          }}>
            {[
              { label: "SINAIS",     value: "5"      },
              { label: "VERBATIMS",  value: "3.046"  },
              { label: "FONTES",     value: "9"      },
            ].map(s => (
              <span key={s.label} style={{
                fontSize: 8, fontFamily: "JetBrains Mono, monospace",
                color: "rgba(255,255,255,0.3)", letterSpacing: 0.5,
              }}>
                {s.label}: <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>{s.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY: depth gauge + layers ──────────────────────── */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Depth gauge — sticky */}
        <div style={{
          position: "sticky", top: 0,
          width: 118, flexShrink: 0,
          paddingTop: 4,
        }}>
          <div style={{
            fontSize: 7, fontWeight: 800, letterSpacing: 2,
            color: "rgba(255,255,255,0.18)", marginBottom: 14,
            fontFamily: "JetBrains Mono, monospace",
          }}>
            PROFUNDIDADE
          </div>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute", left: 5, top: 6, bottom: 6,
              width: 1, background: "rgba(255,255,255,0.07)",
            }} />
            {LAYER_META.map((lm) => {
              const active = activeLayer === lm.id;
              return (
                <div key={lm.id} style={{ marginBottom: 18, position: "relative" }}>
                  {/* Dot */}
                  <div style={{
                    position: "absolute", left: -18, top: 3,
                    width: 7, height: 7, borderRadius: "50%",
                    background: active ? "#ff9500" : "transparent",
                    border: `1.5px solid ${active ? "#ff9500" : "rgba(255,255,255,0.15)"}`,
                    transition: "all 0.3s ease",
                    boxShadow: active ? "0 0 6px rgba(255,149,0,0.5)" : "none",
                  }} />
                  <div style={{
                    fontSize: 8, fontWeight: 800, letterSpacing: 1.5,
                    color: active ? "#ff9500" : "rgba(255,255,255,0.2)",
                    fontFamily: "JetBrains Mono, monospace",
                    transition: "color 0.3s ease",
                  }}>
                    {lm.id} {lm.label}
                  </div>
                  <div style={{
                    fontSize: 9, color: active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)",
                    transition: "color 0.3s ease", marginTop: 1,
                  }}>
                    {lm.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Layers content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ═══════════════════════════════════════════════════
              LAYER 01 — SURFACE SCAN
          ═══════════════════════════════════════════════════ */}
          <div ref={el => { layerRefs.current["01"] = el; }}>
            <div style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
                  color: "rgba(255,149,0,0.8)", fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(255,149,0,0.25)", borderRadius: 3, padding: "2px 7px",
                }}>
                  NÍVEL 01
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.35)" }}>
                  SURFACE SCAN · O QUE O MERCADO DECLARA
                </span>
              </div>
              <p style={{
                fontSize: 11, color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace",
                letterSpacing: 0.3,
              }}>
                SIGNAL DETECTED: 5 padrões críticos recorrentes · 0 resolvidos por qualquer player mapeado
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {SIGNALS.map((sig, idx) => {
                const barColor = idx === 0 ? "#ef4444" : idx === 1 ? "#f97316" : idx === 2 ? "#f59e0b" : "rgba(255,255,255,0.3)";
                return (
                  <div key={sig.id} style={{
                    padding: "13px 16px",
                    background: idx === 0
                      ? "rgba(239,68,68,0.06)"
                      : "rgba(255,255,255,0.018)",
                    border: `1px solid ${idx === 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 6,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 9, flexWrap: "wrap" }}>
                      {/* Signal ID */}
                      <span style={{
                        fontSize: 8, fontWeight: 700, letterSpacing: 0.5,
                        color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace",
                        flexShrink: 0, paddingTop: 1,
                      }}>
                        {sig.id}
                      </span>
                      {/* Name */}
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: idx < 2 ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.60)",
                        flex: 1, minWidth: 180,
                      }}>
                        {sig.name}
                      </span>
                      {/* Count + trend */}
                      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                        <span style={{
                          fontSize: 13, fontWeight: 800,
                          color: barColor, fontFamily: "JetBrains Mono, monospace",
                        }}>
                          {sig.count.toLocaleString("pt-BR")}
                        </span>
                        <span style={{
                          fontSize: 9, fontWeight: 800,
                          color: sig.trendUp ? "#ef4444" : "#10b981",
                          fontFamily: "JetBrains Mono, monospace",
                        }}>
                          {sig.trendUp ? "↑" : "→"} +{sig.trendPct}% D-30
                        </span>
                        <span style={{
                          fontSize: 8, fontWeight: 800, letterSpacing: 0.8,
                          color: sig.resolved ? "#10b981" : "#ef4444",
                          background: sig.resolved ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          borderRadius: 3, padding: "2px 6px",
                        }}>
                          {sig.resolved ? "PARCIAL" : "NÃO RESOLVIDO"}
                        </span>
                      </div>
                    </div>

                    {/* Signal bar + source breakdown */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                      <Bar strength={sig.strength} color={barColor} />
                      <span style={{
                        fontSize: 9, color: "rgba(255,255,255,0.25)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {sig.strength}%
                      </span>
                      <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.08)" }} />
                      {sig.sources.map(src => (
                        <span key={src.label} style={{
                          fontSize: 8, fontWeight: 600, letterSpacing: 0.3,
                          color: src.color, fontFamily: "JetBrains Mono, monospace",
                        }}>
                          {src.label} {src.pct}%
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              LAYER 02 — BEHAVIORAL INTELLIGENCE
          ═══════════════════════════════════════════════════ */}
          <div
            ref={el => { layerRefs.current["02"] = el; }}
            style={{
              marginTop: 40, padding: "24px 20px",
              background: "rgba(99,102,241,0.04)",
              border: "1px solid rgba(99,102,241,0.12)",
              borderRadius: 8,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
                  color: "rgba(99,102,241,0.9)", fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(99,102,241,0.3)", borderRadius: 3, padding: "2px 7px",
                }}>
                  NÍVEL 02
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.35)" }}>
                  BEHAVIORAL INTELLIGENCE · O QUE O MERCADO BUSCA MAS NÃO ENCONTRA
                </span>
              </div>
              <p style={{
                fontSize: 11, color: "rgba(99,102,241,0.6)",
                fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.3,
              }}>
                ⚠ Dados de comportamento de busca — invisíveis para concorrentes sem ferramentas de inteligência
              </p>
            </div>

            {/* Header row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 80px 90px 1fr",
              gap: 8, paddingBottom: 10,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              marginBottom: 6,
            }}>
              {["INTENÇÃO DE BUSCA", "VOL/MÊS", "DEMANDA", "OFERTA", "STATUS"].map(h => (
                <span key={h} style={{
                  fontSize: 7, fontWeight: 800, letterSpacing: 1.5,
                  color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace",
                }}>
                  {h}
                </span>
              ))}
            </div>

            {BEHAVIORAL.map((bt, idx) => {
              const supplyColor = bt.supply === "zero" ? "#ef4444" : bt.supply === "escassa" ? "#f59e0b" : "#10b981";
              return (
                <div key={idx} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 80px 90px 1fr",
                  gap: 8, padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  background: bt.key ? "rgba(99,102,241,0.05)" : "transparent",
                  borderRadius: 4, paddingLeft: bt.key ? 8 : 0,
                  marginLeft: bt.key ? -8 : 0,
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: bt.key ? 700 : 400,
                    color: bt.key ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.42)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    "{bt.term}"
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: bt.key ? "#6366f1" : "rgba(255,255,255,0.35)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {bt.volume.toLocaleString("pt-BR")}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 700,
                    color: bt.demand === "alta" ? "#ef4444" : "#f59e0b",
                    fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.5,
                  }}>
                    {bt.demand.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 800,
                    color: supplyColor,
                    fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.5,
                  }}>
                    {bt.supply.toUpperCase()}
                  </span>
                  {bt.anomaly ? (
                    <span style={{
                      fontSize: 7, fontWeight: 900, letterSpacing: 0.8,
                      color: "#ff9500",
                      background: "rgba(255,149,0,0.08)",
                      border: "1px solid rgba(255,149,0,0.2)",
                      borderRadius: 3, padding: "2px 6px",
                      alignSelf: "center", display: "inline-block",
                    }}>
                      {bt.anomaly}
                    </span>
                  ) : (
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace" }}>
                      —
                    </span>
                  )}
                </div>
              );
            })}

            {/* Behavioral callout */}
            <div style={{
              marginTop: 16, padding: "10px 14px",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 6,
            }}>
              <span style={{
                fontSize: 10, color: "rgba(99,102,241,0.9)",
                fontFamily: "JetBrains Mono, monospace", lineHeight: 1.6,
              }}>
                ★ 3 intenções de alta demanda com oferta ZERO no mercado — nenhum concorrente mapeado cobre qualquer uma delas.
                Volume combinado: <span style={{ color: "#ff9500", fontWeight: 800 }}>5.090 buscas/mês</span> sem resposta satisfatória.
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              LAYER 03 — DEEP CHANNEL SCAN
          ═══════════════════════════════════════════════════ */}
          <div
            ref={el => { layerRefs.current["03"] = el; }}
            style={{
              marginTop: 40, padding: "24px 20px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 8,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
                  color: "rgba(245,158,11,0.9)", fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(245,158,11,0.25)", borderRadius: 3, padding: "2px 7px",
                }}>
                  NÍVEL 03
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.35)" }}>
                  DEEP CHANNEL SCAN · CANAIS NÃO MONITORADOS
                </span>
              </div>
              <p style={{
                fontSize: 11, color: "rgba(245,158,11,0.5)",
                fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.3,
              }}>
                Linguagem não filtrada pelo medo de parecer mal — onde o mercado fala o que realmente sente
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {VERBATIMS.map((vb, idx) => (
                <div key={idx} style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `3px solid ${vb.color}`,
                  borderRadius: "0 6px 6px 0",
                  overflow: "hidden",
                }}>
                  {/* Source header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "7px 12px",
                    background: "rgba(255,255,255,0.025)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    flexWrap: "wrap", gap: 8,
                  }}>
                    <div className="flex items-center gap-2">
                      <span style={{
                        fontSize: 7, fontWeight: 900, letterSpacing: 1.2,
                        color: vb.color, fontFamily: "JetBrains Mono, monospace",
                        background: `${vb.color}15`, borderRadius: 2, padding: "1px 5px",
                      }}>
                        {vb.srcType}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 600,
                        color: "rgba(255,255,255,0.45)", fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {vb.srcName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{
                        fontSize: 8, color: "rgba(255,255,255,0.22)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {vb.srcSize}
                      </span>
                      <span style={{
                        fontSize: 8, fontWeight: 600,
                        color: vb.color, background: `${vb.color}12`,
                        borderRadius: 3, padding: "1px 6px",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {vb.theme}
                      </span>
                    </div>
                  </div>
                  {/* Quote */}
                  <div style={{ padding: "14px 16px 12px" }}>
                    <p style={{
                      fontSize: 14, fontWeight: 600, fontStyle: "italic",
                      color: "rgba(255,255,255,0.72)", lineHeight: 1.5, marginBottom: 8,
                    }}>
                      "{vb.quote}"
                    </p>
                    <span style={{
                      fontSize: 8, color: "rgba(255,255,255,0.2)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}>
                      {vb.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 14, padding: "9px 12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 5,
            }}>
              <span style={{
                fontSize: 9, color: "rgba(255,255,255,0.28)",
                fontFamily: "JetBrains Mono, monospace", lineHeight: 1.6,
              }}>
                NOTA: Linguagem privada revela dores mais profundas que reviews públicos.
                O padrão "me senti enganada" não aparece em review nenhum — aparece onde as pessoas falam livremente.
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              LAYER 04 — CORE DIAGNOSIS
          ═══════════════════════════════════════════════════ */}
          <div
            ref={el => { layerRefs.current["04"] = el; }}
            style={{
              marginTop: 40,
              padding: "28px 28px",
              background: "rgba(255,149,0,0.04)",
              border: "1px solid rgba(255,149,0,0.2)",
              borderTop: "2px solid rgba(255,149,0,0.5)",
              borderRadius: "0 0 8px 8px",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
                  color: "#ff9500", fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(255,149,0,0.35)", borderRadius: 3, padding: "2px 7px",
                }}>
                  NÍVEL 04
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.35)" }}>
                  CORE DIAGNOSIS · A NECESSIDADE REAL
                </span>
              </div>
            </div>

            {/* The diagnosis — big typography, no card */}
            <div style={{ marginBottom: 24 }}>
              <p style={{
                fontSize: 15, fontWeight: 700,
                color: "rgba(255,255,255,0.85)", lineHeight: 1.75,
                marginBottom: 12,
              }}>
                A dor declarada é <span style={{ color: "#ef4444" }}>preço</span>.
                A necessidade real é <span style={{ color: "#ff9500" }}>controle</span>.
              </p>
              <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.8,
                marginBottom: 12,
              }}>
                O consumidor deste mercado não se importa de pagar mais — ele se importa de ser pego
                de surpresa. A raiva expressa em 847 reclamações não é sobre o valor do procedimento.
                É sobre ter a sensação de que alguém tomou uma decisão por ele, sem sua permissão.
              </p>
              <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.8,
              }}>
                Nenhum dos 4 concorrentes mapeados aborda isso diretamente. Todos resolvem o sintoma
                (melhoram o produto, fazem marketing), mas nenhum resolve a causa (devolvem o controle
                ao cliente antes, durante e depois do atendimento).
              </p>
            </div>

            {/* Diagnosis metrics */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
              paddingTop: 20, borderTop: "1px solid rgba(255,149,0,0.12)",
            }}>
              {[
                { label: "CONFIANÇA DO DIAGNÓSTICO", value: "94.7%",         color: "#ff9500" },
                { label: "PONTOS DE DADO ANALISADOS", value: "3.046",         color: "#ff9500" },
                { label: "PLAYERS QUE RESOLVEM ISSO",  value: "0 de 4",      color: "#ef4444" },
              ].map(m => (
                <div key={m.label}>
                  <div style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: 1.5,
                    color: "rgba(255,255,255,0.22)", marginBottom: 4,
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 800,
                    color: m.color, fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: -0.5,
                  }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              LAYER 05 — EMERGENT SIGNAL
          ═══════════════════════════════════════════════════ */}
          <div
            ref={el => { layerRefs.current["05"] = el; }}
            style={{
              marginTop: 40, marginBottom: 48,
              padding: "22px 20px",
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
                  color: "rgba(239,68,68,0.9)", fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(239,68,68,0.25)", borderRadius: 3, padding: "2px 7px",
                }}>
                  NÍVEL 05
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.35)" }}>
                  EMERGENT SIGNAL · O QUE ESTÁ CRESCENDO AGORA
                </span>
                <span className="mios-pulse-dot" style={{
                  display: "inline-block", width: 5, height: 5, borderRadius: "50%",
                  background: "#ef4444", flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 8, color: "#ef4444",
                  fontFamily: "JetBrains Mono, monospace",
                }}>
                  DETECTADO HÁ 47 DIAS · ACELERANDO
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
              {/* Left: signal info */}
              <div style={{ flex: "1 1 280px", minWidth: 240 }}>
                <p style={{
                  fontSize: 14, fontWeight: 700,
                  color: "rgba(255,255,255,0.78)", marginBottom: 10,
                }}>
                  Exigência de resultado documentado
                </p>
                <p style={{
                  fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, marginBottom: 16,
                }}>
                  Consumidores passaram a exigir foto antes/depois padronizada e garantia por escrito
                  antes de fechar. Mudança de expectativa detectada antes de virar reclamação massiva.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "CRESCIMENTO",        value: "+340%",        color: "#ef4444" },
                    { label: "PERÍODO",             value: "90 dias",      color: "rgba(255,255,255,0.5)" },
                    { label: "JANELA ESTIMADA",     value: "3–5 meses",    color: "#ff9500" },
                    { label: "STATUS CONCORRENTES", value: "0 de 4 agem",  color: "#ef4444" },
                  ].map(m => (
                    <div key={m.label} className="flex items-center gap-3">
                      <span style={{
                        fontSize: 7, fontWeight: 700, letterSpacing: 1.5,
                        color: "rgba(255,255,255,0.2)", width: 140, flexShrink: 0,
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {m.label}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        color: m.color, fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: sparkline */}
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  fontSize: 7, fontWeight: 700, letterSpacing: 1.5,
                  color: "rgba(255,255,255,0.2)", marginBottom: 10,
                  fontFamily: "JetBrains Mono, monospace",
                }}>
                  VOLUME DE SINAL · ÚLTIMOS 90 DIAS
                </div>
                <Sparkline data={EMERGENT_POINTS} />
                <div style={{
                  display: "flex", justifyContent: "space-between", marginTop: 6,
                  fontSize: 7, color: "rgba(255,255,255,0.18)",
                  fontFamily: "JetBrains Mono, monospace",
                }}>
                  <span>Jan 26</span>
                  <span>Fev 26</span>
                  <span>Mar 26</span>
                  <span>Abr 26</span>
                  <span style={{ color: "#ff9500" }}>Mai 26 ←</span>
                </div>
              </div>
            </div>

            {/* Final punch */}
            <div style={{
              marginTop: 22, padding: "12px 16px",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 6,
            }}>
              <p style={{
                fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.65,
                fontFamily: "JetBrains Mono, monospace",
              }}>
                <span style={{ color: "#ef4444", fontWeight: 800 }}>⚠ JANELA ABERTA:</span>{" "}
                O primeiro negócio a implementar protocolo de resultado documentado captura os clientes
                que estão migrando agora — antes que a demanda vire padrão e perca o diferencial.
                Estimativa: <span style={{ color: "#ff9500", fontWeight: 700 }}>3–5 meses</span> de exclusividade.
              </p>
            </div>
          </div>

        </div>{/* end layers */}
      </div>{/* end body */}
    </>
  );
}
