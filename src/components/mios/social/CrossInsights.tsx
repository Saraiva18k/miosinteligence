const insights = [
  {
    label: "TERRITÓRIO LIVRE",
    color: "16,185,129",
    text: (
      <>
        YouTube SP: <strong style={{ color: "rgba(255,149,0,0.75)" }}>0</strong> concorrentes com canal ativo.
        <strong style={{ color: "rgba(255,149,0,0.75)" }}> 14.2k</strong> buscas/mês sem resposta.
      </>
    ),
  },
  {
    label: "PADRÃO UNIVERSAL",
    color: "245,158,11",
    text: (
      <>
        "quanto custa?" em todas as plataformas. Preço é o tema <strong style={{ color: "rgba(255,149,0,0.75)" }}>nº1</strong> não respondido.
      </>
    ),
  },
  {
    label: "RISCO DETECTADO",
    color: "239,68,68",
    text: (
      <>
        <strong style={{ color: "rgba(255,149,0,0.75)" }}>2</strong> concorrentes em expansão acelerada. Janela de entrada: <strong style={{ color: "rgba(255,149,0,0.75)" }}>4–6 meses</strong> antes da consolidação.
      </>
    ),
  },
  {
    label: "FORMATO QUE PERFORMA",
    color: "59,130,246",
    text: (
      <>
        Bastidores autênticos geram <strong style={{ color: "rgba(255,149,0,0.75)" }}>3x</strong> mais engajamento que fotos de resultado. Em todas as plataformas.
      </>
    ),
  },
  {
    label: "TIMING DE OPORTUNIDADE",
    color: "168,85,247",
    text: (
      <>
        Terças e quintas <strong style={{ color: "rgba(255,149,0,0.75)" }}>18–20h</strong>: nenhum concorrente posta. Audiência disponível com zero competição.
      </>
    ),
  },
];

export function CrossInsights() {
  return (
    <div
      className="mios-float"
      style={{ borderRadius: 10, padding: "16px 20px" }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.30)",
        }}
      >
        INTELIGÊNCIA CRUZADA — PADRÕES DETECTADOS EM TODAS AS PLATAFORMAS
      </div>

      <div
        className="mt-3 grid gap-2.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
      >
        {insights.map((i) => (
          <div
            key={i.label}
            style={{
              background: "rgba(255,255,255,0.025)",
              borderLeft: `2px solid rgba(${i.color},0.65)`,
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              borderRadius: 8,
              padding: "11px 13px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1.8px",
                color: `rgba(${i.color},0.85)`,
              }}
            >
              {i.label}
            </div>
            <div
              className="mt-1.5"
              style={{ fontSize: 10.5, lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}
            >
              {i.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}