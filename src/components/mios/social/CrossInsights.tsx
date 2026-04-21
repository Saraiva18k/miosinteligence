const insights = [
  {
    label: "OPORTUNIDADE",
    color: "16,185,129",
    text: "Canal YouTube é território livre. Nenhum player local tem presença ativa em SP.",
  },
  {
    label: "PADRÃO",
    color: "255,149,0",
    text: 'Pergunta "quanto custa?" aparece em todas as plataformas. Preço é o tema nº 1.',
  },
  {
    label: "FORMATO QUE PERFORMA",
    color: "59,130,246",
    text: "Bastidores autênticos geram 3x mais engajamento que fotos de resultado em todas as plataformas.",
  },
];

export function CrossInsights() {
  return (
    <div
      className="mios-float"
      style={{
        borderRadius: 10,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.30)",
        }}
      >
        INTELIGÊNCIA CRUZADA — 4 PLATAFORMAS
      </div>

      <div
        className="mt-3 grid gap-2.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {insights.map((i) => (
          <div
            key={i.label}
            style={{
              background: "rgba(255,255,255,0.025)",
              borderLeft: `2px solid rgba(${i.color},0.6)`,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "1.8px",
                color: `rgba(${i.color},0.85)`,
              }}
            >
              {i.label}
            </div>
            <div
              className="mt-1.5"
              style={{ fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.6)" }}
            >
              {i.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}