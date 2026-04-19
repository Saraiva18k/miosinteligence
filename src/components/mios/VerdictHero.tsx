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
  const size = 148;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = (score / 100) * c;

  return (
    <section
      className="verdict-hero fade-in-up"
      style={{ padding: "20px 24px" }}
      aria-label="Veredito de mercado"
    >
      <div className="grid grid-cols-[160px_1fr] gap-7 items-center relative z-10">
        {/* Score Ring */}
        <div
          className="relative"
          style={{ width: size, height: size }}
          aria-label={`Score ${target} de 100`}
        >
          {/* outer soft glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,149,0,0.18), transparent 65%)",
              filter: "blur(8px)",
            }}
          />
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="relative -rotate-90"
          >
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffab2e" />
                <stop offset="55%" stopColor="#ff9500" />
                <stop offset="100%" stopColor="#ff6a00" />
              </linearGradient>
              <filter id="scoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
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
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={stroke}
            />
            {/* tick marks */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 360;
              const x1 = size / 2 + (r - stroke - 2) * Math.cos((angle * Math.PI) / 180);
              const y1 = size / 2 + (r - stroke - 2) * Math.sin((angle * Math.PI) / 180);
              const x2 = size / 2 + (r - stroke - 6) * Math.cos((angle * Math.PI) / 180);
              const y2 = size / 2 + (r - stroke - 6) * Math.sin((angle * Math.PI) / 180);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.04)"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "3px",
                color: "rgba(255,149,0,0.45)",
                textTransform: "uppercase",
                marginBottom: -2,
              }}
            >
              Score
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: "-3px",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "var(--font-mono)",
                textShadow: "0 0 24px rgba(255,149,0,0.35)",
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "1px",
                marginTop: 2,
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
              bottom: -10,
              padding: "3px 10px",
              borderRadius: 999,
              background: "rgba(4,6,15,0.95)",
              border: "1px solid rgba(255,149,0,0.35)",
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "2.5px",
              color: "var(--accent)",
              textTransform: "uppercase",
              boxShadow: "0 4px 16px rgba(255,149,0,0.25)",
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
