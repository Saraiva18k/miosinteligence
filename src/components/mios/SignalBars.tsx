interface Signal {
  label: string;
  value: number;
}

const signals: Signal[] = [
  { label: "Atratividade", value: 82 },
  { label: "Competição", value: 54 },
  { label: "Timing", value: 91 },
  { label: "Risco Legal", value: 22 },
];

function colorFor(v: number) {
  if (v >= 75) return "var(--success)";
  if (v >= 40) return "var(--warn)";
  return "rgba(255,255,255,0.20)";
}

export function SignalBars() {
  return (
    <div
      className="grid grid-cols-4 fade-in-up"
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--bg-base)",
        animationDelay: "0.1s",
      }}
    >
      {signals.map((s, i) => {
        const c = colorFor(s.value);
        return (
          <div
            key={s.label}
            className="px-4 py-4"
            style={{
              borderLeft: i === 0 ? undefined : "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "rgba(255,255,255,0.30)",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
            <div
              className="mt-2 mb-2.5"
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: c,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </div>
            <div
              className="relative w-full"
              style={{
                height: 2,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 1,
              }}
            >
              <div
                style={{
                  width: `${s.value}%`,
                  height: "100%",
                  background: c,
                  borderRadius: 1,
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
