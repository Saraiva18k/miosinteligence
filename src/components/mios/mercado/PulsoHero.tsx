import { Activity, Radio, Zap, TrendingUp, AlertCircle, Clock } from "lucide-react";

const KF = `
@keyframes pulse-live { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes pulse-bar  { 0%{height:4px} 50%{height:24px} 100%{height:8px} }
@keyframes pulse-dot  { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(2.2);opacity:0} }
`;

const FEED_ITEMS = [
  { time: "agora",   type: "alert",    text: "Concorrente principal reduz preço em 12% — monitorar reação do mercado" },
  { time: "3 min",   type: "trend",    text: "Volume de busca por 'gestão de times remotos' +28% nas últimas 2h"     },
  { time: "11 min",  type: "signal",   text: "Menção positiva em fórum setorial com 4.2k membros ativos"             },
  { time: "34 min",  type: "trend",    text: "Novo artigo de referência publicado pela principal autoridade do setor" },
  { time: "1h",      type: "neutral",  text: "Regulação em consulta pública — prazo de comentários: 18 dias"         },
];

export function PulsoHero() {
  return (
    <>
      <style>{KF}</style>

      {/* Hero */}
      <div style={{
        borderRadius: 16, marginBottom: 24, padding: "28px 28px 24px", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, rgba(255,149,0,0.08) 0%, rgba(4,6,15,0) 100%)",
        border: "1px solid rgba(255,149,0,0.16)",
      }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,149,0,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,149,0,0.10)", border: "1px solid rgba(255,149,0,0.24)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={22} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.85)" }} />
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,149,0,0.5)", marginBottom: 3 }}>MÓDULO · MERCADO</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.92)" }}>Pulso do Mercado</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.18)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9500", animation: "pulse-live 1.5s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,149,0,0.75)", letterSpacing: 1 }}>EM CONFIGURAÇÃO</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.65, maxWidth: 620 }}>
            Monitoramento contínuo e em tempo real de sinais de mercado, movimentos da concorrência,
            variações de sentimento e alertas estratégicos — filtrados pela lente do seu negócio específico.
          </p>
        </div>
      </div>

      {/* Live equalizer — visual preview */}
      <div style={{
        borderRadius: 14, padding: "20px 24px", marginBottom: 20,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Radio size={13} style={{ color: "rgba(255,149,0,0.6)" }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.35)" }}>PREVIEW — FEED EM TEMPO REAL</span>
        </div>

        {/* Equalizer bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40, marginBottom: 20 }}>
          {Array.from({ length: 32 }).map((_, i) => {
            const h = 4 + Math.random() * 30;
            return (
              <div
                key={i}
                style={{
                  flex: 1, borderRadius: 2,
                  background: `rgba(255,149,0,${0.2 + Math.random() * 0.5})`,
                  height: `${h}px`,
                  animation: `pulse-bar ${0.8 + Math.random() * 1.4}s ease ${Math.random() * 0.8}s infinite`,
                }}
              />
            );
          })}
        </div>

        {/* Feed items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FEED_ITEMS.map((item, i) => {
            const color =
              item.type === "alert"   ? "rgba(239,68,68,0.8)"  :
              item.type === "trend"   ? "rgba(255,149,0,0.8)"  :
              item.type === "signal"  ? "rgba(16,185,129,0.8)" :
                                        "rgba(255,255,255,0.3)";
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 12px", borderRadius: 9, background: i === 0 ? "rgba(255,255,255,0.03)" : "transparent", border: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginTop: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: i === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.36)", lineHeight: 1.5, flex: 1 }}>{item.text}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", flexShrink: 0, marginTop: 1 }}>{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Config CTA */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { icon: Zap,        label: "Definir alertas",       sub: "Configure os sinais que importam" },
          { icon: TrendingUp, label: "Conectar fontes",        sub: "Integre seus canais de dados"     },
          { icon: Clock,      label: "Frequência de análise",  sub: "Tempo real, diário ou semanal"    },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
            <Icon size={16} strokeWidth={1.8} style={{ color: "rgba(255,149,0,0.55)", marginBottom: 8 }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>{sub}</div>
          </div>
        ))}
      </div>
    </>
  );
}
