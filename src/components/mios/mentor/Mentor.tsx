import { useEffect, useRef, useState } from "react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mios-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes ring-cw {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes ring-ccw {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes core-breathe {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.06); }
}
@keyframes dot-orbit {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.4); }
}
@keyframes msg-appear {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes thinking-dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
  40%           { transform: scale(1);   opacity: 1; }
}
@keyframes skill-hover {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id:     string;
  role:   "mentor" | "user";
  text:   string;
  refs?:  string[];  // module references
}

interface Skill {
  icon:   string;
  name:   string;
  desc:   string;
  price:  string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULES_TRAINED = [
  "Dores", "Concorrentes", "Tendências", "Audiência",
  "Sentimento", "Canais", "Precificação", "Social Intelligence",
  "DNA da Marca", "Inovação", "Compliance", "Investimento",
  "Business Plan", "Veredito",
];

const OPENING_MESSAGE: Message = {
  id: "m0",
  role: "mentor",
  text: `Analisei os 14 módulos da sua inteligência de mercado. Score: **87/100 — Excepcional**. A janela de entrada está ativa.

Três frentes pedem atenção imediata:

**1. Compliance** — 3 riscos críticos (LGPD, Alvará sanitário, Claims de publicidade). Todos resolvíveis em 30 dias e de baixo custo. Não operar antes de fechar isso.

**2. Precificação** — Você está mapeado para a zona OCULTO: alto valor percebido, preço médio-alto. Nenhum concorrente local ocupa esse quadrante. A posição é sua, mas precisa ser comunicada.

**3. Canal de entrada** — Com CAC mais baixo do mercado, SEO e Parcerias Estratégicas são as apostas certas para os primeiros 90 dias. Meta Ads satura mais rápido e custa 62% mais do que há 12 meses nesse nicho.

Por onde quer começar?`,
  refs: ["Compliance", "Precificação", "Canais"],
};

const SUGGESTED: { q: string; icon: string }[] = [
  { q: "Como estruturo os primeiros 90 dias?",             icon: "→" },
  { q: "Qual canal priorizar com orçamento limitado?",     icon: "→" },
  { q: "Como resolver o compliance LGPD rapidamente?",     icon: "→" },
  { q: "Como usar o DNA de marca na prática agora?",       icon: "→" },
  { q: "Qual a estratégia de precificação para lançar?",   icon: "→" },
];

const QA: Record<string, Message> = {
  "Como estruturo os primeiros 90 dias?": {
    id: "r1", role: "mentor",
    text: `**Dias 1–30 — Fundação legal e operacional**
Fecha compliance LGPD (política de privacidade + opt-in WhatsApp), atualiza alvará sanitário, formaliza contratos com prestadores. Cria o protocolo fotográfico padrão. Nenhum cliente novo ainda — o produto precisa estar pronto para ser vendido com garantia.

**Dias 31–60 — Primeiros clientes via ativação**
Consulta diagnóstica grátis como porta de entrada. Meta: 30 consultas, conversão esperada de 67% em procedimento pago. Ativa o follow-up D+3, D+7 e D+30. Cada cliente é um experimento documentado.

**Dias 61–90 — Prova de conceito e primeiro conteúdo**
Com resultados documentados, inicia produção de conteúdo: 3 posts de prova de resultado, 2 de educação técnica. SEO começa a indexar. Primeiras indicações estruturadas. Ao final dos 90 dias, você tem dados reais — não suposições.`,
    refs: ["Compliance", "Inovação", "Canais", "DNA da Marca"],
  },
  "Qual canal priorizar com orçamento limitado?": {
    id: "r2", role: "mentor",
    text: `Com orçamento limitado, a ordem de prioridade é clara.

**1. Indicação estruturada** (CAC: R$0 variável)
Seu EXP-07 ainda está em hipótese — hora de ativar. Cada cliente que converte recebe um processo claro de indicação: o que diz, para quem, com qual benefício mútuo. Uma única cliente bem atendida pode trazer 3 novas.

**2. SEO local** (CAC: R$80–120, curva de 60 dias)
"Procedimento estético [bairro]" e "tratamento facial [cidade]" têm volume e CAC baixo. Criação de página otimizada com protocolo, antes/depois e depoimento é o investimento de menor risco.

**3. Parcerias estratégicas** (CAC: R$60–90)
Clínicas de saúde, academias e nutricionistas que atendem o mesmo público. Uma parceria de indicação mútua dobra o alcance sem custo de mídia.

Meta Ads fica para o quarto mês, quando você já tem prova de resultado para usar como criativo. Entrar no paid media sem prova de conceito queima orçamento.`,
    refs: ["Canais", "Inovação"],
  },
  "Como resolver o compliance LGPD rapidamente?": {
    id: "r3", role: "mentor",
    text: `LGPD para uma clínica estética tem 3 ações de impacto que podem ser resolvidas em uma semana, sem custo de advogado na fase inicial.

**1. Política de privacidade (2 horas)**
Cria um documento simples que explica: quais dados você coleta (nome, contato, histórico de procedimentos), para que usa (atendimento, follow-up), quanto tempo guarda (5 anos) e como o cliente pode pedir exclusão. Publica no site e imprime para deixar na recepção.

**2. Opt-in WhatsApp (1 hora)**
Na primeira mensagem para qualquer contato novo: "Posso enviar informações sobre nossos protocolos e resultados por aqui?" Simples. Guarda a resposta. Resolve R04 imediatamente.

**3. Formulário de consentimento na consulta (30 min)**
Adiciona ao seu formulário de anamnese: "Autorizo o uso de imagens para fins de documentação de resultado e divulgação (com ou sem identificação)." Com checkbox e assinatura.

Esses três passos resolvem os dois riscos críticos de LGPD sem custo jurídico. Revisão por advogado especializado é recomendada no terceiro mês, quando a operação estiver rodando.`,
    refs: ["Compliance"],
  },
  "Como usar o DNA de marca na prática agora?": {
    id: "r4", role: "mentor",
    text: `O DNA da Marca mapeou seu arquétipo primário como **O Sábio** (62%) — especialista que educa antes de vender. Três aplicações imediatas:

**1. Comunicação**
Toda legenda, mensagem e conversa começa com contexto técnico antes da oferta. Não "Resultados incríveis!" mas "Criolipólise reduz até 27% da gordura localizada em protocolo único — veja nosso resultado documentado." Você vende autoridade, não promessa.

**2. Palavras que você usa**
Da lista de identidade verbal: Resultado, Protocolo, Garantia, Documentado. Essas palavras aparecem em todo ponto de contato — Instagram, WhatsApp, recepção, follow-up. Consistência cria posicionamento.

**3. O que você não é**
Elimina hoje: "promoção", "preço acessível", "rápido". Essas palavras contradizem o posicionamento OCULTO (alto valor percebido). Cada vez que você usa "promoção", você empurra sua percepção para a zona commodity.

O Espectro mostrou um gap de 40 pontos em Especialização — é o maior gap do DNA. Resolver isso com conteúdo educativo de qualidade é seu maior alavancador de percepção de valor.`,
    refs: ["DNA da Marca", "Precificação"],
  },
  "Qual a estratégia de precificação para lançar?": {
    id: "r5", role: "mentor",
    text: `A Balança identificou a zona OCULTO como sua posição alvo — e ela está vazia no mercado local. Aqui está como ocupá-la no lançamento:

**Não lance com os três tiers de uma vez**
Comece com Tier 2 (Completo, R$560–640) como oferta principal. É o carro-chefe. Justifica o preço com entrega premium: garantia documentada + follow-up + protocolo padronizado. Os concorrentes cobram similar mas entregam menos.

**Tier 1 como porta de entrada estratégica**
Consulta diagnóstica grátis → conversão para Procedimento Base (R$260–320). Não como promoção — como posicionamento: "investimento menor, resultado documentado, sem risco."

**Tier 3 no segundo mês**
Quando você tiver 10–15 clientes com resultado documentado, apresenta o Premium (R$1.100–1.300). Ele existe para fazer o Tier 2 parecer razoável por comparação. Não precisa vender muitos — precisa existir.

**O que não fazer:** não concorra em preço com a Mega Rede (R$180) nem com o Centro Beauty (R$680 com entrega fraca). Você não é nem um nem outro.`,
    refs: ["Precificação", "Concorrentes"],
  },
};

const SKILLS: Skill[] = [
  { icon: "🌐", name: "Criação de Site",            desc: "Site publicado baseado no DNA da Marca identificado", price: "R$297/mês" },
  { icon: "📣", name: "Gestão Meta Ads",            desc: "Campanha montada com base nos canais e audiência mapeados", price: "R$397/mês" },
  { icon: "📊", name: "Relatório Mensal",           desc: "Atualização automática dos módulos mais voláteis", price: "R$197/mês" },
  { icon: "💬", name: "Automação WhatsApp",         desc: "Fluxos de follow-up baseados nas dores reais mapeadas", price: "R$247/mês" },
  { icon: "👁", name: "Monitor de Concorrentes",   desc: "Alertas semanais de movimentos detectados no mercado", price: "R$197/mês" },
  { icon: "✍️", name: "Conteúdo Editorial",         desc: "Posts mensais baseados no que o Social Intelligence detectou", price: "R$297/mês" },
];

// ─── Mentor Signal SVG ────────────────────────────────────────────────────────

function MentorSignal({ thinking }: { thinking: boolean }) {
  const CX = 90, CY = 90, R1 = 30, R2 = 52, R3 = 72;
  const N = MODULES_TRAINED.length; // 14

  const dot = (r: number, i: number, total: number) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  return (
    <svg viewBox="0 0 180 180" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ff9500" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6000" stopOpacity="0.4" />
        </radialGradient>
        <filter id="mentorGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle cx={CX} cy={CY} r={R3 + 14} fill="#ff9500" opacity={thinking ? 0.06 : 0.03} filter="url(#softGlow)" />

      {/* Outer ring — slow CW */}
      <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "ring-cw 28s linear infinite" }}>
        <circle cx={CX} cy={CY} r={R3} fill="none" stroke="rgba(255,149,0,0.12)" strokeWidth="0.6" strokeDasharray="2,4" />
        {MODULES_TRAINED.map((_, i) => {
          const p = dot(R3, i, N);
          return (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#ff9500"
              opacity="0.75"
              style={{ animation: `dot-orbit 2s ease ${(i / N) * 2}s infinite` }}
            />
          );
        })}
      </g>

      {/* Middle ring — CCW */}
      <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "ring-ccw 18s linear infinite" }}>
        <circle cx={CX} cy={CY} r={R2} fill="none" stroke="rgba(255,149,0,0.18)" strokeWidth="0.5" strokeDasharray="3,6" />
        {[0,1,2,3,4,5,6].map(i => {
          const p = dot(R2, i, 7);
          return <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="rgba(255,149,0,0.55)" />;
        })}
      </g>

      {/* Inner ring — CW faster */}
      <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "ring-cw 10s linear infinite" }}>
        <circle cx={CX} cy={CY} r={R1} fill="none" stroke="rgba(255,149,0,0.25)" strokeWidth="0.6" strokeDasharray="4,4" />
      </g>

      {/* Core */}
      <circle cx={CX} cy={CY} r={18} fill="url(#coreGrad)" opacity={0.15} filter="url(#softGlow)" />
      <circle cx={CX} cy={CY} r={13} fill="rgba(255,149,0,0.08)" stroke="rgba(255,149,0,0.35)" strokeWidth="1"
        style={{ animation: thinking ? "core-breathe 0.8s ease infinite" : "core-breathe 3s ease infinite" }} />

      {/* M letter */}
      <text x={CX} y={CY + 4.5} textAnchor="middle" fontSize="12" fontWeight="900"
        fill="#ff9500" fontFamily="JetBrains Mono" opacity="0.9"
        filter="url(#mentorGlow)">M</text>

      {/* Thinking indicator */}
      {thinking && (
        <g>
          {[0,1,2].map(i => (
            <circle key={i} cx={CX - 8 + i * 8} cy={CY + 30} r="2.5"
              fill="#ff9500"
              style={{ animation: `thinking-dot 1.2s ease ${i * 0.15}s infinite` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

// ─── Typing cursor ────────────────────────────────────────────────────────────

function TypingCursor() {
  return <span style={{ display: "inline-block", width: 2, height: "1em", background: "#ff9500", marginLeft: 2, verticalAlign: "text-bottom", animation: "cursor-blink 0.8s step-end infinite" }} />;
}

// ─── Message render ───────────────────────────────────────────────────────────

function MentorMessage({ msg, isTyping }: { msg: Message; isTyping?: boolean }) {
  const isMentor = msg.role === "mentor";

  const renderText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <div key={i} style={{ marginBottom: i < lines.length - 1 && line === "" ? 8 : line.startsWith("**") || parts.length > 1 ? 6 : 3 }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <span key={j} style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{part}</span>
              : <span key={j}>{part}</span>
          )}
        </div>
      );
    });
  };

  if (!isMentor) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", animation: "msg-appear 0.2s ease" }}>
        <div style={{
          maxWidth: "72%", padding: "10px 14px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px 12px 2px 12px",
          fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.65,
        }}>{msg.text}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, animation: "msg-appear 0.3s ease" }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace",
      }}>M</div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1 }}>MENTOR</span>
          {msg.refs?.map(r => (
            <span key={r} style={{
              fontSize: 7, padding: "1px 6px",
              background: "rgba(255,149,0,0.08)", color: "rgba(255,149,0,0.6)",
              border: "1px solid rgba(255,149,0,0.18)", borderRadius: 3,
              fontFamily: "JetBrains Mono, monospace",
            }}>{r}</span>
          ))}
        </div>

        <div style={{
          padding: "12px 16px",
          background: "rgba(255,149,0,0.03)",
          border: "1px solid rgba(255,149,0,0.12)",
          borderLeft: "2px solid rgba(255,149,0,0.5)",
          borderRadius: "0 10px 10px 10px",
          fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.75,
        }}>
          {renderText(msg.text)}
          {isTyping && <TypingCursor />}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Mentor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [typingMsg, setTypingMsg] = useState<Message | null>(null);
  const [input, setInput] = useState("");
  const [openingDone, setOpeningDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simulate opening message on mount
  useEffect(() => {
    const t1 = setTimeout(() => setThinking(true), 600);
    const t2 = setTimeout(() => {
      setThinking(false);
      setTypingMsg(OPENING_MESSAGE);
      // After a delay proportional to message length, show fully
      const chars = OPENING_MESSAGE.text.length;
      const duration = Math.min(chars * 8, 2000);
      setTimeout(() => {
        setTypingMsg(null);
        setMessages([OPENING_MESSAGE]);
        setOpeningDone(true);
      }, duration);
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, typingMsg]);

  const handleQuestion = (q: string) => {
    if (thinking || typingMsg) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);
    setTimeout(() => {
      const response = QA[q];
      if (response) {
        setThinking(false);
        const r = { ...response, id: `r${Date.now()}` };
        setTypingMsg(r);
        setTimeout(() => {
          setTypingMsg(null);
          setMessages(prev => [...prev, r]);
        }, Math.min(r.text.length * 6, 2200));
      } else {
        setThinking(false);
        setMessages(prev => [...prev, {
          id: `r${Date.now()}`, role: "mentor",
          text: "Essa dimensão está sendo processada. Para uma análise aprofundada, ative o Mentor completo com conexão à API.",
        }]);
      }
    }, 1400);
  };

  const handleSend = () => {
    if (!input.trim() || thinking || typingMsg) return;
    const q = input.trim();
    setInput("");
    handleQuestion(q);
  };

  const shownMessages = typingMsg ? [...messages, typingMsg] : messages;

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "14px 24px 13px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.7)", fontFamily: "JetBrains Mono, monospace", animation: "mios-pulse 2s infinite" }}>● ONLINE</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.28)", fontFamily: "JetBrains Mono, monospace" }}>MENTOR IA — O SÓCIO</span>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {[
              { label: "MÓDULOS TREINADOS", value: "14",      color: "#ff9500"                },
              { label: "SCORE DO NEGÓCIO",  value: "87/100",  color: "#ff9500"                },
              { label: "JANELA",            value: "ATIVA",   color: "rgba(16,185,129,0.85)" },
              { label: "SKILLS DISPONÍVEIS",value: "6",       color: "rgba(255,255,255,0.4)" },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 7, letterSpacing: 1.2, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ───────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "256px 1fr 288px", height: "calc(100vh - 120px)", minHeight: 0 }}>

        {/* ── LEFT: Mentor Identity ──────────────────────────────────────── */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Signal */}
          <div style={{ padding: "20px 20px 8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 160, height: 160 }}>
              <MentorSignal thinking={thinking} />
            </div>
            <div style={{ textAlign: "center", marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.88)", letterSpacing: 1 }}>MENTOR IA</div>
              <div style={{ fontSize: 8, color: "rgba(255,149,0,0.6)", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1.5, marginTop: 2 }}>
                {thinking ? "PROCESSANDO..." : "● ONLINE"}
              </div>
            </div>
          </div>

          {/* Training stats */}
          <div style={{ margin: "10px 14px 0", padding: "10px 14px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.12)", borderRadius: 6 }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>TREINAMENTO</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>14</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>módulos</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace" }}>847</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>dados</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "rgba(16,185,129,0.85)", fontFamily: "JetBrains Mono, monospace" }}>100%</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>sincronizado</div>
              </div>
            </div>
          </div>

          {/* Modules list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", marginTop: 6 }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>MÓDULOS INTEGRADOS</div>
            {MODULES_TRAINED.map((mod, i) => (
              <div key={mod} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, animation: `msg-appear 0.2s ease ${i * 0.03}s both` }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(16,185,129,0.75)", flexShrink: 0,
                  boxShadow: "0 0 5px rgba(16,185,129,0.4)" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}>{mod}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: Conversation ───────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
            {shownMessages.length === 0 && !thinking && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono, monospace" }}>Iniciando sessão...</span>
              </div>
            )}

            {thinking && shownMessages.length === 0 && (
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", flexShrink: 0 }}>M</div>
                <div style={{ padding: "14px 18px", background: "rgba(255,149,0,0.03)", border: "1px solid rgba(255,149,0,0.12)", borderLeft: "2px solid rgba(255,149,0,0.5)", borderRadius: "0 10px 10px 10px", display: "flex", gap: 6, alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9500", animation: `thinking-dot 1.2s ease ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {shownMessages.map((msg, i) => (
              <MentorMessage
                key={msg.id}
                msg={msg}
                isTyping={typingMsg?.id === msg.id}
              />
            ))}

            {thinking && shownMessages.length > 0 && (
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#ff9500", fontFamily: "JetBrains Mono, monospace", flexShrink: 0 }}>M</div>
                <div style={{ padding: "14px 18px", background: "rgba(255,149,0,0.03)", border: "1px solid rgba(255,149,0,0.12)", borderLeft: "2px solid rgba(255,149,0,0.5)", borderRadius: "0 10px 10px 10px", display: "flex", gap: 6, alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9500", animation: `thinking-dot 1.2s ease ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {openingDone && !thinking && !typingMsg && (
            <div style={{ padding: "0 28px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SUGGESTED.filter(s => !messages.find(m => m.text === s.q)).slice(0, 4).map(s => (
                <button key={s.q} onClick={() => handleQuestion(s.q)} style={{
                  padding: "6px 13px", fontSize: 10, fontWeight: 600,
                  background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
                  cursor: "pointer", transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                  onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "rgba(255,149,0,0.07)"; (e.target as HTMLButtonElement).style.color = "rgba(255,149,0,0.8)"; (e.target as HTMLButtonElement).style.borderColor = "rgba(255,149,0,0.2)"; }}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"; (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {s.q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 28px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Pergunte ao Mentor sobre o seu negócio..."
                disabled={!!thinking || !!typingMsg}
                style={{
                  flex: 1, padding: "11px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.8)", fontSize: 12,
                  outline: "none",
                  transition: "border-color 0.15s",
                  fontFamily: "inherit",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,149,0,0.35)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              <button onClick={handleSend} disabled={!input.trim() || !!thinking || !!typingMsg} style={{
                padding: "11px 18px",
                background: input.trim() ? "rgba(255,149,0,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${input.trim() ? "rgba(255,149,0,0.35)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 8, cursor: input.trim() ? "pointer" : "default",
                color: input.trim() ? "#ff9500" : "rgba(255,255,255,0.2)",
                fontSize: 12, fontWeight: 700, transition: "all 0.15s",
              }}>Enviar</button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Skills ─────────────────────────────────────────────── */}
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", overflowY: "auto", padding: "20px 16px 40px" }}>

          <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 2, color: "rgba(255,149,0,0.5)", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>SKILLS DO MENTOR</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.5, marginBottom: 16 }}>
            Ative skills mensalmente conforme a necessidade do seu negócio.
          </div>

          {SKILLS.map((skill, i) => (
            <div key={i} style={{
              marginBottom: 8, padding: "13px 14px",
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, position: "relative",
              overflow: "hidden",
              animation: `skill-hover 0.3s ease ${i * 0.06}s both`,
            }}>
              {/* Lock overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(4,6,15,0.45)",
                backdropFilter: "blur(2px)",
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                padding: "0 12px",
                pointerEvents: "none",
              }}>
                <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 3 }}>EM BREVE</span>
              </div>

              <div style={{ fontSize: 14, marginBottom: 4 }}>{skill.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>{skill.name}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", lineHeight: 1.5, marginBottom: 8 }}>{skill.desc}</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,149,0,0.45)", fontFamily: "JetBrains Mono, monospace" }}>{skill.price}</div>
            </div>
          ))}

          {/* Base plan note */}
          <div style={{ marginTop: 12, padding: "14px 14px", background: "rgba(255,149,0,0.04)", border: "1px solid rgba(255,149,0,0.15)", borderRadius: 8 }}>
            <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, color: "rgba(255,149,0,0.55)", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>COMO FUNCIONA</div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
              O Mentor base inclui todo o contexto dos 14 módulos e está disponível 24/7. Skills são capacidades de execução ativáveis mensalmente — você decide quando precisa e por quanto tempo.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
