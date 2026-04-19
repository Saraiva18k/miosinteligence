import { useEffect, useState } from "react";

export function VerdictHero() {
  const target = 87;
  const [score, setScore] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className="verdict-hero fade-in-up"
      style={{ padding: "20px 24px" }}
      aria-label="Veredito de mercado"
    >
      <div className="grid grid-cols-[140px_1fr] gap-6 items-start relative z-10">
        <div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "var(--accent)",
              letterSpacing: "-5px",
              lineHeight: 0.85,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: "rgba(255,149,0,0.25)",
              letterSpacing: "-0.5px",
              marginTop: 4,
            }}
          >
            /100
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: "3px",
              color: "rgba(255,149,0,0.45)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Veredito de Mercado
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            Você encontrou
            <br />
            <span style={{ color: "var(--accent)" }}>uma veia de ouro.</span>
          </h1>
          <p
            className="mt-3"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.8,
              maxWidth: 420,
            }}
          >
            Mercado fragmentado com dores críticas sem solução premium.
            Concorrentes com NPS baixo. CAC comportável. Timing favorável de 4 a
            7 meses antes da consolidação.
          </p>

          <div
            className="inline-flex items-center gap-1.5 mt-3"
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.20)",
            }}
          >
            <span
              className="pulse-dot inline-block rounded-full"
              style={{
                width: 5,
                height: 5,
                background: "var(--success)",
                color: "rgba(16,185,129,0.5)",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "rgba(16,185,129,0.75)",
                textTransform: "uppercase",
              }}
            >
              Janela de entrada ativa
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
