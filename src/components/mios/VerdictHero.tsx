import { useEffect, useState } from "react";

export function VerdictHero() {
  const target = 87;
  const [score, setScore] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1600;
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

  // Ring geometry
  const size = 168;
  const stroke = 8;
  const r = (size - stroke) / 2 - 6;
  const c = 2 * Math.PI * r;
  const progress = (score / 100) * c;

  return (
    <section
      className="verdict-hero mios-float fade-in-up"
      style={{ padding: "20px 24px" }}
      aria-label="Veredito de mercado"
    >
      <div className="grid grid-cols-[180px_1fr] gap-7 items-center relative z-10">
        {/* Score Ring */}
        <div
          className="relative mx-auto"
          style={{ width: size, height: size + 22 }}
          aria-label={`Score ${target} de 100`}
        >
          {/* outer soft glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-8px -8px 30px -8px",
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,149,0,0.22), transparent 62%)",
              filter: "blur(10px)",
            }}
          />
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="relative -rotate-90 block"
          >
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffc06a" />
                <stop offset="50%" stopColor="#ff9500" />
                <stop offset="100%" stopColor="#ff6a00" />
              </linearGradient>
              <filter id="scoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={stroke}
            />
            {/* tick marks — sutis, mais curtos */}
            {Array.from({ length: 48 }).map((_, i) => {
              const angle = (i / 48) * 360;
              const inner = r - stroke - 4;
              const outer = r - stroke - 8;
              const x1 = size / 2 + inner * Math.cos((angle * Math.PI) / 180);
              const y1 = size / 2 + inner * Math.sin((angle * Math.PI) / 180);
              const x2 = size / 2 + outer * Math.cos((angle * Math.PI) / 180);
              const y2 = size / 2 + outer * Math.sin((angle * Math.PI) / 180);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
              );
            })}
            {/* progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - progress}
              filter="url(#scoreGlow)"
              style={{ transition: "stroke-dashoffset 80ms linear" }}
            />
          </svg>

          {/* center content */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{ inset: `0 0 22px 0` }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "3.5px",
                color: "rgba(255,149,0,0.55)",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Score
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: "-3px",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "var(--font-mono)",
                textShadow: "0 0 28px rgba(255,149,0,0.4)",
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 500,
                color: "rgba(255,255,255,0.32)",
                letterSpacing: "1.5px",
                marginTop: 4,
                fontFamily: "var(--font-mono)",
              }}
            >
              / 100
            </div>
          </div>

          {/* tier badge */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: 0,
              padding: "5px 14px",
              borderRadius: 999,
              background:
                "linear-gradient(180deg, rgba(20,14,4,0.95), rgba(8,6,2,0.95))",
              border: "1px solid rgba(255,149,0,0.30)",
              fontSize: 8.5,
              fontWeight: 800,
              letterSpacing: "2.8px",
              color: "var(--accent)",
              textTransform: "uppercase",
              boxShadow:
                "0 6px 20px rgba(255,149,0,0.18), 0 0 0 1px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
              whiteSpace: "nowrap",
            }}
          >
            ★ Excepcional
          </div>
        </div>

        {/* Right: copy */}
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
