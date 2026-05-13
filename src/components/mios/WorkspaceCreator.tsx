import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X, ChevronRight, ChevronLeft, Upload, FileText,
  BarChart3, Palette, Search, Target, Check,
  Brain, Building2, TrendingUp, Sparkles, Plus,
  Zap, Hash, Users,
} from "lucide-react";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes wc-backdrop { from { opacity:0 } to { opacity:1 } }
@keyframes wc-modal-in { from { opacity:0; transform:translate(-50%,-50%) scale(0.93) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
@keyframes wc-step-right { from { opacity:0; transform:translateX(28px) } to { opacity:1; transform:translateX(0) } }
@keyframes wc-step-left  { from { opacity:0; transform:translateX(-28px) } to { opacity:1; transform:translateX(0) } }
@keyframes wc-ring-pulse { 0%,100% { filter:drop-shadow(0 0 4px rgba(255,149,0,0.3)) } 50% { filter:drop-shadow(0 0 14px rgba(255,149,0,0.7)) } }
@keyframes wc-float-pt   { 0% { opacity:1; transform:translateY(0) } 100% { opacity:0; transform:translateY(-22px) } }
@keyframes wc-mentor-in  { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
@keyframes wc-check-pop  { 0% { transform:scale(0) } 60% { transform:scale(1.2) } 100% { transform:scale(1) } }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewWorkspace {
  id: string;
  name: string;
  location: string;
  initial: string;
  segment: string;
  stage: string;
}

interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  category: string;
}

interface FormData {
  name: string; segment: string; stage: string; city: string;
  description: string; audience: string; ticket: string;
  revenueModel: string; channels: string[];
  revenueRange: string; teamSize: string; challenge: string;
  goal: string; competitors: string[];
  documents: UploadedDoc[];
}

const EMPTY: FormData = {
  name: "", segment: "", stage: "", city: "",
  description: "", audience: "", ticket: "", revenueModel: "", channels: [],
  revenueRange: "", teamSize: "", challenge: "", goal: "", competitors: [],
  documents: [],
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Identidade",           Icon: Building2  },
  { id: 2, label: "Produto & Mercado",    Icon: Target     },
  { id: 3, label: "Contexto Estratégico", Icon: TrendingUp },
  { id: 4, label: "Documentos",           Icon: FileText   },
  { id: 5, label: "Revisão",              Icon: Sparkles   },
];

const SEGMENTS = [
  "Estética & Beleza", "Saúde & Bem-estar", "Alimentação & Gastronomia",
  "Moda & Vestuário", "Educação & Treinamento", "Tecnologia & Software",
  "Consultoria & Serviços", "E-commerce & Varejo", "Imóveis & Construção",
  "Fitness & Academia", "Entretenimento & Lazer", "Outro",
];

const STAGES = [
  { id: "ideia",     emoji: "🌱", label: "Ideia",     desc: "Ainda não existe formalmente" },
  { id: "validando", emoji: "🔬", label: "Validando", desc: "Testando no mercado"          },
  { id: "ativo",     emoji: "✅", label: "Ativo",     desc: "Operando e com receita"       },
  { id: "escalando", emoji: "🚀", label: "Escalando", desc: "Crescendo rapidamente"        },
];

const CHANNELS = [
  "Instagram", "WhatsApp", "Loja Física", "Site / E-commerce",
  "TikTok", "Indicação", "Google Ads", "YouTube", "Outros",
];

const REVENUE_MODELS = [
  { id: "recorrente", icon: "🔄", label: "Recorrente", desc: "Assinatura ou mensalidade" },
  { id: "avulso",     icon: "💳", label: "Avulso",     desc: "Venda única ou por projeto" },
  { id: "misto",      icon: "🔀", label: "Misto",      desc: "Combinação dos dois"       },
];

const REVENUE_RANGES = [
  "Ainda não tenho receita", "Até R$5k/mês",
  "R$5k – R$20k/mês", "R$20k – R$100k/mês", "Acima de R$100k/mês",
];

const TEAM_SIZES = ["Só eu", "2 a 5 pessoas", "6 a 20 pessoas", "Mais de 20"];

const DOC_CATEGORIES = [
  { id: "plano",      Icon: FileText,  label: "Plano de Negócios",  impact: "Business Plan · Investimento" },
  { id: "financeiro", Icon: BarChart3, label: "Planilha Financeira", impact: "Precificação · Investimento"  },
  { id: "marca",      Icon: Palette,   label: "Briefing de Marca",  impact: "DNA da Marca"                 },
  { id: "pesquisa",   Icon: Search,    label: "Pesquisa de Mercado",impact: "Concorrentes · Audiência"     },
  { id: "pitch",      Icon: Target,    label: "Pitch Deck",          impact: "Sumário Executivo"            },
  { id: "outro",      Icon: Hash,      label: "Outro",               impact: "Contexto geral"               },
];

const MENTOR_MSGS = [
  { min: 0,  text: "Olá! Vamos construir juntos a inteligência do seu negócio. Cada campo que você preenche aumenta a precisão da minha análise." },
  { min: 15, text: "Bom começo. Já sei o segmento e o estágio. Continue — cada detalhe afina a leitura estratégica." },
  { min: 32, text: "Estou formando o perfil do negócio. O que você vende e para quem é o próximo passo crucial." },
  { min: 52, text: "Excelente! Com esse contexto já consigo traçar insights sobre posicionamento, precificação e mercado." },
  { min: 72, text: "Análise rica. Minha leitura estratégica vai ser muito mais cirúrgica com esse nível de detalhe." },
  { min: 90, text: "Contexto completo. Estou pronto para gerar inteligência estratégica profunda para o seu negócio." },
];

const SCORE_LABELS = [
  { min: 0,  label: "Contexto Mínimo",   color: "rgba(255,255,255,0.3)"  },
  { min: 20, label: "Contexto Básico",   color: "#f59e0b"                },
  { min: 45, label: "Contexto Rico",     color: "#ff9500"                },
  { min: 72, label: "Análise Precisa",   color: "#ff9500"                },
  { min: 90, label: "Contexto Completo", color: "#10b981"                },
];

// ─── Score engine ─────────────────────────────────────────────────────────────

function score(d: FormData): number {
  const pts =
    (d.name.trim()                     ? 10 : 0) +
    (d.segment                         ?  8 : 0) +
    (d.stage                           ? 10 : 0) +
    (d.city.trim()                     ?  6 : 0) +
    (d.description.trim().length > 30  ? 12 : d.description.trim().length > 0 ? 4 : 0) +
    (d.audience.trim().length > 20     ? 10 : d.audience.trim().length > 0 ? 3 : 0) +
    (d.ticket                          ?  6 : 0) +
    (d.revenueModel                    ?  4 : 0) +
    (d.channels.length > 0             ?  4 : 0) +
    (d.revenueRange                    ?  8 : 0) +
    (d.teamSize                        ?  3 : 0) +
    (d.challenge.trim().length > 30    ? 12 : d.challenge.trim().length > 0 ? 4 : 0) +
    (d.goal.trim().length > 20         ? 10 : d.goal.trim().length > 0 ? 3 : 0) +
    (d.competitors.length > 0          ?  5 : 0) +
    Math.min(d.documents.length * 5, 20);
  return Math.min(Math.round((pts / 128) * 100), 100);
}

// ─── ContextRing ──────────────────────────────────────────────────────────────

function ContextRing({ value }: { value: number }) {
  const R = 38; const C = 2 * Math.PI * R;
  const offset = C - (value / 100) * C;
  const scoreInfo = [...SCORE_LABELS].reverse().find(s => value >= s.min) ?? SCORE_LABELS[0];
  const ringColor = scoreInfo.color;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 96, height: 96 }}>
        <svg width="96" height="96" style={{ animation: value > 0 ? "wc-ring-pulse 3s ease infinite" : undefined }}>
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringColor} stopOpacity="1" />
              <stop offset="100%" stopColor={value >= 90 ? "#10b981" : "#ff6a00"} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          {/* Fill */}
          <circle
            cx="48" cy="48" r={R} fill="none"
            stroke={value > 0 ? "url(#ring-grad)" : "rgba(255,255,255,0.06)"}
            strokeWidth="5" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset}
            transform="rotate(-90 48 48)"
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease" }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: 20, fontWeight: 900, color: value > 0 ? ringColor : "rgba(255,255,255,0.2)",
            fontFamily: "JetBrains Mono, monospace", lineHeight: 1,
            transition: "color 0.5s ease",
          }}>
            {value}
          </span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600, marginTop: 1 }}>/ 100</span>
        </div>
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
        color: scoreInfo.color, transition: "color 0.5s ease",
      }}>
        {scoreInfo.label}
      </div>
    </div>
  );
}

// ─── MentorBubble ─────────────────────────────────────────────────────────────

function MentorBubble({ value }: { value: number }) {
  const msg = [...MENTOR_MSGS].reverse().find(m => value >= m.min) ?? MENTOR_MSGS[0];
  const [displayed, setDisplayed] = useState(msg.text);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setDisplayed(msg.text);
    setKey(k => k + 1);
  }, [msg.text]);

  return (
    <div
      key={key}
      style={{
        padding: "10px 12px", borderRadius: 10, marginTop: 4,
        background: "rgba(255,149,0,0.07)",
        border: "1px solid rgba(255,149,0,0.18)",
        animation: "wc-mentor-in 0.35s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
        <div style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981" }} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,149,0,0.7)", letterSpacing: 1 }}>MENTOR IA</span>
      </div>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: 0 }}>
        {displayed}
      </p>
    </div>
  );
}

// ─── StepNav ──────────────────────────────────────────────────────────────────

function StepNav({ current, onGo }: { current: number; onGo: (n: number) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 16 }}>
      {STEPS.map((s, i) => {
        const done    = s.id < current;
        const active  = s.id === current;
        const locked  = s.id > current;
        return (
          <button
            key={s.id}
            onClick={() => done && onGo(s.id)}
            disabled={locked}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 8px", borderRadius: 7, textAlign: "left",
              background: active ? "rgba(255,149,0,0.08)" : "transparent",
              border: `1px solid ${active ? "rgba(255,149,0,0.2)" : "transparent"}`,
              cursor: done ? "pointer" : "default",
              transition: "all 0.15s",
            }}
          >
            <span style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: done ? "#10b981" : active ? "rgba(255,149,0,0.2)" : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${done ? "#10b981" : active ? "rgba(255,149,0,0.6)" : "rgba(255,255,255,0.1)"}`,
              fontSize: 9, fontWeight: 800, color: done ? "#fff" : active ? "#ff9500" : "rgba(255,255,255,0.25)",
              animation: done ? "wc-check-pop 0.3s ease" : undefined,
            }}>
              {done ? <Check size={10} strokeWidth={3} /> : i + 1}
            </span>
            <span style={{
              fontSize: 11, fontWeight: active ? 600 : 400,
              color: done ? "rgba(255,255,255,0.6)" : active ? "rgba(255,149,0,0.95)" : "rgba(255,255,255,0.25)",
            }}>
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Field primitives ─────────────────────────────────────────────────────────

function FieldLabel({ children, optional }: { children: string; optional?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: 0.4 }}>{children}</span>
      {optional && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>OPCIONAL</span>}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, large }: { placeholder: string; value: string; onChange: (v: string) => void; large?: boolean }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: large ? "12px 14px" : "9px 12px",
        fontSize: large ? 15 : 13,
        fontWeight: large ? 600 : 400,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8, color: "rgba(255,255,255,0.85)",
        outline: "none", transition: "border-color 0.15s",
      }}
      onFocus={e => { e.target.style.borderColor = "rgba(255,149,0,0.45)"; e.target.style.background = "rgba(255,149,0,0.04)"; }}
      onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
    />
  );
}

function TextArea({ placeholder, value, onChange, rows = 3 }: { placeholder: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      style={{
        width: "100%", boxSizing: "border-box", resize: "none",
        padding: "10px 12px", fontSize: 13,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8, color: "rgba(255,255,255,0.85)",
        outline: "none", lineHeight: 1.6, transition: "border-color 0.15s",
        fontFamily: "inherit",
      }}
      onFocus={e => { e.target.style.borderColor = "rgba(255,149,0,0.45)"; e.target.style.background = "rgba(255,149,0,0.04)"; }}
      onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
    />
  );
}

// ─── Step 1: Identidade ───────────────────────────────────────────────────────

function Step1({ d, set }: { d: FormData; set: (k: keyof FormData, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div>
        <FieldLabel>Nome do negócio</FieldLabel>
        <TextInput large placeholder="Ex: Studio Estética Premium" value={d.name} onChange={v => set("name", v)} />
      </div>

      <div>
        <FieldLabel>Segmento</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SEGMENTS.map(seg => {
            const active = d.segment === seg;
            return (
              <button key={seg} onClick={() => set("segment", active ? "" : seg)} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                background: active ? "rgba(255,149,0,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: active ? "#ff9500" : "rgba(255,255,255,0.5)",
                transition: "all 0.15s",
              }}>
                {seg}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel>Estágio atual</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {STAGES.map(s => {
            const active = d.stage === s.id;
            return (
              <button key={s.id} onClick={() => set("stage", active ? "" : s.id)} style={{
                padding: "12px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                background: active ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.07)"}`,
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#ff9500" : "rgba(255,255,255,0.7)", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.3 }}>{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel>Cidade & Estado</FieldLabel>
        <TextInput placeholder="Ex: São Paulo, SP" value={d.city} onChange={v => set("city", v)} />
      </div>

    </div>
  );
}

// ─── Step 2: Produto & Mercado ────────────────────────────────────────────────

function Step2({ d, set }: { d: FormData; set: (k: keyof FormData, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div>
        <FieldLabel>Descreva o negócio em 2–3 frases</FieldLabel>
        <TextArea placeholder="O que você oferece, como funciona e qual o diferencial central..." value={d.description} onChange={v => set("description", v)} rows={3} />
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>{d.description.length} / 300 caracteres</div>
      </div>

      <div>
        <FieldLabel>Quem é seu cliente ideal?</FieldLabel>
        <TextArea placeholder="Perfil, faixa de renda, comportamento, dores principais..." value={d.audience} onChange={v => set("audience", v)} rows={2} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <FieldLabel>Ticket médio</FieldLabel>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>R$</span>
            <input
              type="number" placeholder="0,00" value={d.ticket} onChange={e => set("ticket", e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 34px", fontSize: 13,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, color: "rgba(255,255,255,0.85)", outline: "none",
                fontFamily: "JetBrains Mono, monospace",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(255,149,0,0.45)"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Modelo de receita</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {REVENUE_MODELS.map(m => {
              const active = d.revenueModel === m.id;
              return (
                <button key={m.id} onClick={() => set("revenueModel", active ? "" : m.id)} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, cursor: "pointer",
                  background: active ? "rgba(255,149,0,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? "rgba(255,149,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 13 }}>{m.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: active ? "#ff9500" : "rgba(255,255,255,0.65)" }}>{m.label}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <FieldLabel optional>Canais atuais</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CHANNELS.map(ch => {
            const active = d.channels.includes(ch);
            return (
              <button key={ch} onClick={() => set("channels", active ? d.channels.filter(c => c !== ch) : [...d.channels, ch])} style={{
                padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
                background: active ? "rgba(255,149,0,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(255,149,0,0.45)" : "rgba(255,255,255,0.08)"}`,
                color: active ? "#ff9500" : "rgba(255,255,255,0.45)",
                transition: "all 0.15s",
              }}>
                {ch}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── Step 3: Contexto Estratégico ─────────────────────────────────────────────

function Step3({ d, set }: { d: FormData; set: (k: keyof FormData, v: any) => void }) {
  const [competitorInput, setCompetitorInput] = useState("");

  const addCompetitor = () => {
    const v = competitorInput.trim();
    if (v && !d.competitors.includes(v)) {
      set("competitors", [...d.competitors, v]);
      setCompetitorInput("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div>
        <FieldLabel>Receita mensal atual</FieldLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {REVENUE_RANGES.map(r => {
            const active = d.revenueRange === r;
            return (
              <button key={r} onClick={() => set("revenueRange", active ? "" : r)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                background: active ? "rgba(255,149,0,0.09)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(255,149,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                  background: active ? "#ff9500" : "transparent",
                  border: `1.5px solid ${active ? "#ff9500" : "rgba(255,255,255,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "rgba(255,149,0,0.95)" : "rgba(255,255,255,0.55)" }}>{r}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <FieldLabel optional>Tamanho da equipe</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {TEAM_SIZES.map(t => {
              const active = d.teamSize === t;
              return (
                <button key={t} onClick={() => set("teamSize", active ? "" : t)} style={{
                  padding: "6px 10px", borderRadius: 7, cursor: "pointer", textAlign: "left", fontSize: 11,
                  background: active ? "rgba(255,149,0,0.09)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? "rgba(255,149,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: active ? "#ff9500" : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 600 : 400, transition: "all 0.15s",
                }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <FieldLabel>Maior desafio hoje</FieldLabel>
            <TextArea placeholder="O que está travando o crescimento?" value={d.challenge} onChange={v => set("challenge", v)} rows={3} />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Meta para os próximos 12 meses</FieldLabel>
        <TextArea placeholder="Onde você quer estar daqui a 1 ano? Seja específico — números ajudam." value={d.goal} onChange={v => set("goal", v)} rows={2} />
      </div>

      <div>
        <FieldLabel optional>Concorrentes que você já conhece</FieldLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input
            placeholder="Digite um nome e pressione Enter"
            value={competitorInput}
            onChange={e => setCompetitorInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addCompetitor()}
            style={{
              flex: 1, padding: "8px 11px", fontSize: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 7, color: "rgba(255,255,255,0.8)", outline: "none", fontFamily: "inherit",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(255,149,0,0.4)"; }}
            onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          <button onClick={addCompetitor} style={{
            padding: "8px 12px", borderRadius: 7, cursor: "pointer",
            background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)",
            color: "#ff9500", display: "flex", alignItems: "center",
          }}>
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {d.competitors.map(c => (
            <span key={c} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "3px 10px", borderRadius: 20, fontSize: 11,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}>
              {c}
              <button onClick={() => set("competitors", d.competitors.filter(x => x !== c))} style={{ color: "rgba(255,255,255,0.3)", lineHeight: 0, cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Step 4: Documentos ───────────────────────────────────────────────────────

function Step4({ d, set }: { d: FormData; set: (k: keyof FormData, v: any) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [selectedCat, setSelectedCat] = useState("outro");

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const added: UploadedDoc[] = Array.from(files).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      category: selectedCat,
    }));
    set("documents", [...d.documents, ...added]);
  }, [d.documents, selectedCat, set]);

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <div style={{
        padding: "6px 10px", borderRadius: 8,
        background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.15)",
        fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5,
      }}>
        <Zap size={10} style={{ color: "#ff9500", display: "inline", marginRight: 5 }} />
        Documentos amplificam significativamente a precisão de cada módulo. Cada arquivo processado afina a análise estratégica.
      </div>

      {/* Category selector */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>CATEGORIA DO DOCUMENTO</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {DOC_CATEGORIES.map(cat => {
            const active = selectedCat === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)} style={{
                padding: "8px 8px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                background: active ? "rgba(255,149,0,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(255,149,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s",
              }}>
                <cat.Icon size={12} style={{ color: active ? "#ff9500" : "rgba(255,255,255,0.3)", marginBottom: 4 }} />
                <div style={{ fontSize: 10, fontWeight: 600, color: active ? "#ff9500" : "rgba(255,255,255,0.55)", marginBottom: 2 }}>{cat.label}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{cat.impact}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          borderRadius: 10, padding: "28px 16px", textAlign: "center", cursor: "pointer",
          border: `2px dashed ${drag ? "rgba(255,149,0,0.7)" : "rgba(255,255,255,0.1)"}`,
          background: drag ? "rgba(255,149,0,0.06)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s",
        }}
      >
        <Upload size={22} style={{ color: drag ? "#ff9500" : "rgba(255,255,255,0.2)", marginBottom: 8 }} />
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
          Arraste arquivos ou clique para selecionar
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>PDF · DOCX · XLSX · PNG — até 10MB por arquivo</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.xlsx,.png,.jpg" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Uploaded list */}
      {d.documents.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {d.documents.map(doc => (
            <div key={doc.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
              background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
            }}>
              <FileText size={14} style={{ color: "#10b981", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{DOC_CATEGORIES.find(c => c.id === doc.category)?.label} · {formatSize(doc.size)}</div>
              </div>
              <button onClick={() => set("documents", d.documents.filter(x => x.id !== doc.id))} style={{ color: "rgba(255,255,255,0.2)", background: "none", border: "none", cursor: "pointer", lineHeight: 0 }}>
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ─── Step 5: Revisão ──────────────────────────────────────────────────────────

function Step5Review({ d, ctx }: { d: FormData; ctx: number }) {
  const sections = [
    {
      title: "Identidade",
      items: [
        d.name && { label: "Nome", value: d.name },
        d.segment && { label: "Segmento", value: d.segment },
        d.stage && { label: "Estágio", value: STAGES.find(s => s.id === d.stage)?.label },
        d.city && { label: "Localização", value: d.city },
      ].filter(Boolean) as { label: string; value: string }[],
    },
    {
      title: "Produto & Mercado",
      items: [
        d.description && { label: "Descrição", value: d.description.slice(0, 80) + (d.description.length > 80 ? "…" : "") },
        d.ticket && { label: "Ticket médio", value: `R$ ${Number(d.ticket).toLocaleString("pt-BR")}` },
        d.revenueModel && { label: "Modelo", value: REVENUE_MODELS.find(m => m.id === d.revenueModel)?.label },
        d.channels.length > 0 && { label: "Canais", value: d.channels.join(", ") },
      ].filter(Boolean) as { label: string; value: string }[],
    },
    {
      title: "Contexto Estratégico",
      items: [
        d.revenueRange && { label: "Receita atual", value: d.revenueRange },
        d.challenge && { label: "Desafio", value: d.challenge.slice(0, 70) + (d.challenge.length > 70 ? "…" : "") },
        d.goal && { label: "Meta 12 meses", value: d.goal.slice(0, 70) + (d.goal.length > 70 ? "…" : "") },
        d.competitors.length > 0 && { label: "Concorrentes", value: d.competitors.join(", ") },
      ].filter(Boolean) as { label: string; value: string }[],
    },
  ];

  const modulesActivated = [
    "Veredito", "Business Plan",
    d.ticket ? "Precificação" : null,
    d.ticket ? "Investimento" : null,
    d.competitors.length > 0 ? "Concorrentes" : null,
    d.channels.length > 0 ? "Canais" : null,
    d.audience ? "Audiência" : null,
    d.audience ? "Dores" : null,
    d.description ? "DNA da Marca" : null,
    d.documents.length > 0 ? "Social Intelligence" : null,
  ].filter(Boolean) as string[];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Context score banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
        background: ctx >= 70 ? "rgba(16,185,129,0.08)" : "rgba(255,149,0,0.08)",
        border: `1px solid ${ctx >= 70 ? "rgba(16,185,129,0.25)" : "rgba(255,149,0,0.25)"}`,
      }}>
        <Brain size={16} style={{ color: ctx >= 70 ? "#10b981" : "#ff9500", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: ctx >= 70 ? "#10b981" : "#ff9500", marginBottom: 2 }}>
            {ctx >= 70 ? "Contexto excelente — análise precisa garantida" : "Bom contexto — você pode enriquecer depois"}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
            Score {ctx}/100 · {d.documents.length} documento{d.documents.length !== 1 ? "s" : ""} anexado{d.documents.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sections.filter(s => s.items.length > 0).map(s => (
          <div key={s.title} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 1, marginBottom: 7 }}>{s.title.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {s.items.map(item => (
                <div key={item.label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0, width: 90 }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", flex: 1 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8 }}>MÓDULOS QUE SERÃO ATIVADOS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {modulesActivated.map(m => (
            <span key={m} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600,
              background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.2)", color: "rgba(255,149,0,0.8)",
            }}>
              <Zap size={8} /> {m}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface WorkspaceCreatorProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (ws: NewWorkspace) => void;
}

export function WorkspaceCreator({ open, onClose, onCreated }: WorkspaceCreatorProps) {
  const [step, setStep]       = useState(1);
  const [dir, setDir]         = useState<"fwd" | "bwd">("fwd");
  const [animKey, setAnimKey] = useState(0);
  const [data, setData]       = useState<FormData>(EMPTY);

  const set = useCallback((k: keyof FormData, v: any) => {
    setData(prev => ({ ...prev, [k]: v }));
  }, []);

  const ctx = score(data);

  const go = (n: number) => {
    setDir(n > step ? "fwd" : "bwd");
    setAnimKey(k => k + 1);
    setStep(n);
  };

  const handleCreate = () => {
    const ws: NewWorkspace = {
      id: Math.random().toString(36).slice(2),
      name: data.name || "Novo Workspace",
      location: data.city || "—",
      initial: (data.name[0] ?? "N").toUpperCase(),
      segment: data.segment,
      stage: data.stage,
    };
    onCreated?.(ws);
    onClose();
    // Reset for next use
    setTimeout(() => { setStep(1); setData(EMPTY); }, 300);
  };

  const canAdvance = () => {
    if (step === 1) return !!data.name.trim() && !!data.segment && !!data.stage && !!data.city.trim();
    if (step === 2) return !!data.description.trim() && !!data.audience.trim() && !!data.ticket && !!data.revenueModel;
    if (step === 3) return !!data.revenueRange && !!data.challenge.trim() && !!data.goal.trim();
    return true;
  };

  const STEP_CONTENT: Record<number, React.ReactNode> = {
    1: <Step1 d={data} set={set} />,
    2: <Step2 d={data} set={set} />,
    3: <Step3 d={data} set={set} />,
    4: <Step4 d={data} set={set} />,
    5: <Step5Review d={data} ctx={ctx} />,
  };

  const STEP_META: Record<number, { title: string; sub: string }> = {
    1: { title: "Identidade do Negócio",   sub: "Como se chama, o que é e onde está." },
    2: { title: "Produto & Mercado",        sub: "O que você vende e para quem." },
    3: { title: "Contexto Estratégico",     sub: "Onde está e onde quer chegar." },
    4: { title: "Documentos",               sub: "Enriqueça a análise com arquivos. Opcional, mas poderoso." },
    5: { title: "Revisão Final",            sub: "Confirme os dados antes de criar o workspace." },
  };

  if (!open) return null;

  return createPortal(
    <>
      <style>{KF}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(4,6,15,0.88)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          animation: "wc-backdrop 0.25s ease",
        }}
      />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed", zIndex: 9999,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(860px, 96vw)",
          maxHeight: "92vh",
          display: "flex", flexDirection: "column",
          borderRadius: 18,
          background: "rgba(8,11,22,0.82)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px -20px rgba(0,0,0,0.9), 0 8px 32px -8px rgba(255,149,0,0.08)",
          animation: "wc-modal-in 0.35s cubic-bezier(0.16,1,0.3,1)",
          overflow: "hidden",
        }}
      >

        {/* Top progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.04)", position: "relative", flexShrink: 0 }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
            background: "linear-gradient(90deg, #ff9500, #ff6a00)",
            borderRadius: "0 2px 2px 0",
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>

        {/* Header bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}>
          <div className="flex items-center gap-3">
            <img src="/mios-brain.png" alt="MIOS" style={{ height: 24, width: "auto", mixBlendMode: "screen" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>Novo Workspace</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Passo {step} de {STEPS.length}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)", cursor: "pointer",
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

          {/* Left panel */}
          <div style={{
            width: 220, flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            padding: "20px 14px",
            display: "flex", flexDirection: "column", gap: 0,
            overflowY: "auto",
          }}>
            <ContextRing value={ctx} />
            <MentorBubble value={ctx} />
            <StepNav current={step} onGo={go} />
          </div>

          {/* Right content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>

            {/* Step header */}
            <div style={{ padding: "20px 24px 14px", flexShrink: 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "rgba(255,255,255,0.9)", margin: 0, marginBottom: 3 }}>
                {STEP_META[step].title}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                {STEP_META[step].sub}
              </p>
            </div>

            {/* Step content */}
            <div
              key={animKey}
              className="mios-scroll"
              style={{
                flex: 1, overflowY: "auto",
                padding: "0 24px 20px",
                animation: `${dir === "fwd" ? "wc-step-right" : "wc-step-left"} 0.28s cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              {STEP_CONTENT[step]}
            </div>

            {/* Footer */}
            <div style={{
              padding: "12px 24px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <button
                onClick={() => step > 1 && go(step - 1)}
                disabled={step === 1}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: step > 1 ? "pointer" : "default",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  color: step > 1 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)",
                  transition: "all 0.15s",
                }}
              >
                <ChevronLeft size={14} /> Voltar
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {step < STEPS.length && step >= 4 && (
                  <button onClick={() => go(step + 1)} style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.35)",
                  }}>
                    Pular
                  </button>
                )}

                {step < STEPS.length ? (
                  <button
                    onClick={() => canAdvance() && go(step + 1)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: canAdvance() ? "pointer" : "default",
                      background: canAdvance()
                        ? "linear-gradient(135deg, rgba(255,149,0,0.9), rgba(255,100,0,0.8))"
                        : "rgba(255,255,255,0.06)",
                      border: canAdvance() ? "1px solid rgba(255,149,0,0.6)" : "1px solid rgba(255,255,255,0.06)",
                      color: canAdvance() ? "#fff" : "rgba(255,255,255,0.2)",
                      boxShadow: canAdvance() ? "0 4px 16px -4px rgba(255,149,0,0.4)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    Avançar <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
                      background: "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.8))",
                      border: "1px solid rgba(16,185,129,0.6)",
                      color: "#fff",
                      boxShadow: "0 4px 20px -4px rgba(16,185,129,0.45)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Sparkles size={14} />
                    Criar Workspace e Iniciar Análise
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
