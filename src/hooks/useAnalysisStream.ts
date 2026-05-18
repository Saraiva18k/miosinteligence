import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModuleStatus = "pending" | "running" | "done" | "error";

export interface ModuleState {
  id: string;
  name: string;
  group: string;
  groupColor: string;
  status: ModuleStatus;
  score?: number;
}

export type StreamPhase = "idle" | "connecting" | "queued" | "running" | "done" | "error";

export interface TerminalLine {
  text: string;
  type: "header" | "divider" | "arrow" | "score" | "normal" | "dim";
}

export interface StreamState {
  phase: StreamPhase;
  queuePosition?: number;
  queueEta?: number;         // seconds
  modules: ModuleState[];
  activeModuleId?: string;
  lines: TerminalLine[];     // structured terminal log
  completedCount: number;
  totalCount: number;
  totalScore?: number;
  errorMessage?: string;
  elapsedSeconds: number;
}

// ─── Module registry ──────────────────────────────────────────────────────────

export const ANALYSIS_MODULES: Omit<ModuleState, "status">[] = [
  { id: "pulso",        name: "Pulso do Mercado", group: "Mercado",    groupColor: "#3b82f6" },
  { id: "concorrentes", name: "Concorrentes",      group: "Mercado",    groupColor: "#3b82f6" },
  { id: "benchmarking", name: "Benchmarking",      group: "Mercado",    groupColor: "#3b82f6" },
  { id: "tendencias",   name: "Tendências",        group: "Mercado",    groupColor: "#3b82f6" },
  { id: "sentimento",   name: "Sentimento",        group: "Mercado",    groupColor: "#3b82f6" },
  { id: "audiencia",    name: "Audiência",         group: "Audiência",  groupColor: "#ec4899" },
  { id: "dores",        name: "Dores",             group: "Audiência",  groupColor: "#ec4899" },
  { id: "canais",       name: "Canais",            group: "Audiência",  groupColor: "#ec4899" },
  { id: "dna",          name: "DNA da Marca",      group: "Marca",      groupColor: "#8b5cf6" },
  { id: "precificacao", name: "Precificação",      group: "Marca",      groupColor: "#8b5cf6" },
  { id: "stakeholders", name: "Stakeholders",      group: "Estratégia", groupColor: "#10b981" },
  { id: "cenarios",     name: "Cenários",          group: "Estratégia", groupColor: "#10b981" },
  { id: "okr",          name: "OKR",               group: "Estratégia", groupColor: "#10b981" },
  { id: "comparativo",  name: "Comparativo",       group: "Veredito",   groupColor: "#ff9500" },
];

// ─── Mock scripts ─────────────────────────────────────────────────────────────

const MOCK: Record<string, Array<{ text: string; slow?: boolean }>> = {
  pulso: [
    { text: "Conectando aos feeds de dados do mercado...\n" },
    { text: "Analisando volume de busca e variações de demanda setorial...\n" },
    { text: "→ Google Trends: alta de 23% em queries relacionadas ao setor\n", slow: true },
    { text: "→ Índices setoriais: estabilidade com leve pressão de custo\n", slow: true },
    { text: "→ Publicações especializadas: 3 sinais de ciclo de expansão\n", slow: true },
    { text: "Processando momentum e identificando janelas de oportunidade...\n" },
    { text: "Score calculado: 65 / 100  ✓\n", slow: true },
  ],
  concorrentes: [
    { text: "Iniciando mapeamento do landscape competitivo...\n" },
    { text: "→ LinkedIn: movimentos de hiring e expansão de equipe\n", slow: true },
    { text: "→ Crunchbase: captações e valuations recentes\n", slow: true },
    { text: "→ G2 / Capterra: avaliações e percepção de mercado\n", slow: true },
    { text: "Identificados 7 concorrentes diretos, 4 indiretos\n" },
    { text: "Player A: baixo preço, ausência de IA aplicada\n", slow: true },
    { text: "Player B: captou $12M — expansão para LATAM provável\n", slow: true },
    { text: "Calculando gap competitivo e vantagens relativas...\n" },
    { text: "Score calculado: 71 / 100  ✓\n", slow: true },
  ],
  benchmarking: [
    { text: "Coletando benchmarks setoriais de referência...\n" },
    { text: "→ 340 empresas do setor analisadas (fontes públicas)\n", slow: true },
    { text: "→ Média setorial identificada: 68 pts\n", slow: true },
    { text: "Posicionando empresa no quadrante competitivo...\n" },
    { text: "Score calculado: 74 / 100  ✓\n", slow: true },
  ],
  tendencias: [
    { text: "Monitorando sinais fracos e fortes de tendência...\n" },
    { text: "→ Análise de publicações especializadas (últimos 90 dias)\n", slow: true },
    { text: "→ 3 tendências críticas e 2 oportunidades emergentes\n", slow: true },
    { text: "Avaliando velocidade de adoção e janela de entrada...\n" },
    { text: "Score calculado: 68 / 100  ✓\n", slow: true },
  ],
  sentimento: [
    { text: "Processando sinais de sentimento de mercado...\n" },
    { text: "→ Social listening: 1.200+ menções analisadas\n", slow: true },
    { text: "→ NPS setorial estimado: 42 (benchmark: 38)\n", slow: true },
    { text: "Identificando drivers de percepção positiva e negativa...\n" },
    { text: "Score calculado: 60 / 100  ✓\n", slow: true },
  ],
  audiencia: [
    { text: "Mapeando perfil e comportamento da audiência-alvo...\n" },
    { text: "→ Segmentação demográfica e comportamental concluída\n", slow: true },
    { text: "→ Padrões de consumo e canais preferidos identificados\n", slow: true },
    { text: "Analisando fit entre proposta de valor e perfil...\n" },
    { text: "Score calculado: 70 / 100  ✓\n", slow: true },
  ],
  dores: [
    { text: "Identificando dores e fricções da audiência...\n" },
    { text: "→ 28 dores mapeadas — ranqueando por frequência e impacto\n", slow: true },
    { text: "→ Top dor: velocidade de decisão estratégica\n", slow: true },
    { text: "→ Segunda dor: ROI não mensurável de ações de marketing\n", slow: true },
    { text: "Cruzando dores com capacidade de resolução atual...\n" },
    { text: "Score calculado: 80 / 100  ✓\n", slow: true },
  ],
  canais: [
    { text: "Avaliando eficiência de canais de aquisição e distribuição...\n" },
    { text: "→ Canal orgânico: 34% do tráfego qualificado\n", slow: true },
    { text: "→ Canal pago: CPC 18% acima da referência setorial\n", slow: true },
    { text: "Identificando gaps de cobertura e mix ideal...\n" },
    { text: "Score calculado: 72 / 100  ✓\n", slow: true },
  ],
  dna: [
    { text: "Analisando identidade e consistência de marca...\n" },
    { text: "→ Avaliação de coerência entre mensagem, visual e tom\n", slow: true },
    { text: "→ Recall espontâneo: baixo-moderado no segmento-alvo\n", slow: true },
    { text: "Verificando aderência ao posicionamento declarado...\n" },
    { text: "Score calculado: 68 / 100  ✓\n", slow: true },
  ],
  precificacao: [
    { text: "Analisando estratégia e elasticidade de preço...\n" },
    { text: "→ Posição relativa: 8% abaixo da mediana setorial\n", slow: true },
    { text: "→ Percepção de valor pelo cliente: sub-aproveitada\n", slow: true },
    { text: "Mapeando headroom de precificação sem erosão de volume...\n" },
    { text: "Score calculado: 58 / 100  ✓\n", slow: true },
  ],
  stakeholders: [
    { text: "Mapeando rede de influência e stakeholders-chave...\n" },
    { text: "→ 12 stakeholders internos identificados\n", slow: true },
    { text: "→ Externos críticos: regulatórios, parceiros, investidores\n", slow: true },
    { text: "Analisando alinhamento e riscos de divergência...\n" },
    { text: "Score calculado: 76 / 100  ✓\n", slow: true },
  ],
  cenarios: [
    { text: "Construindo árvore de cenários estratégicos...\n" },
    { text: "→ Cenário base: 67% de probabilidade\n", slow: true },
    { text: "→ Cenário otimista: alavancas identificadas, 22%\n", slow: true },
    { text: "→ Cenário de risco: gatilhos mapeados, 11%\n", slow: true },
    { text: "Avaliando robustez da estratégia atual por cenário...\n" },
    { text: "Score calculado: 72 / 100  ✓\n", slow: true },
  ],
  okr: [
    { text: "Analisando estrutura e qualidade dos OKRs...\n" },
    { text: "→ 4 Objectives — verificando especificidade e ambição\n", slow: true },
    { text: "→ 12 Key Results — avaliando mensurabilidade e prazo\n", slow: true },
    { text: "Calculando alinhamento com contexto estratégico...\n" },
    { text: "Score calculado: 78 / 100  ✓\n", slow: true },
  ],
  comparativo: [
    { text: "Consolidando inteligência de todos os módulos...\n" },
    { text: "→ Cruzando scores com benchmark setorial por dimensão\n", slow: true },
    { text: "→ Mapeando padrões de força e vulnerabilidade sistêmica\n", slow: true },
    { text: "→ Gerando mapa de prioridade de intervenção\n", slow: true },
    { text: "Calculando Score MIOS Global...\n" },
    { text: "Score Global: 68 / 100\n", slow: true },
    { text: "Análise completa.  ✓\n" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("Aborted")); });
  });
}

function classifyLine(text: string): TerminalLine["type"] {
  const t = text.trim();
  if (t.startsWith("◉") || t.startsWith("●")) return "header";
  if (t.startsWith("─") || t === "") return "divider";
  if (t.startsWith("→")) return "arrow";
  if (t.includes("Score") && (t.includes("✓") || t.includes("/"))) return "score";
  return "normal";
}

function textToLines(text: string): TerminalLine[] {
  return text.split("\n").map(t => ({
    text: t,
    type: classifyLine(t + "\n"),
  }));
}

// ─── Mock simulation ──────────────────────────────────────────────────────────

async function runMock(
  emit: (e: Record<string, unknown>) => void,
  signal: AbortSignal
) {
  emit({ type: "queue_position", position: 3, estimated_seconds: 45 });
  await delay(1600, signal);
  emit({ type: "analysis_start" });

  for (const mod of ANALYSIS_MODULES) {
    if (signal.aborted) return;
    emit({ type: "agent_start", module_id: mod.id });
    await delay(280, signal);

    const chunks = MOCK[mod.id] ?? [{ text: `Processando ${mod.name}...\n` }, { text: "Score calculado  ✓\n" }];
    for (const chunk of chunks) {
      if (signal.aborted) return;
      if (chunk.slow) {
        for (const char of chunk.text) {
          emit({ type: "agent_chunk", module_id: mod.id, text: char });
          await delay(22, signal);
        }
      } else {
        emit({ type: "agent_chunk", module_id: mod.id, text: chunk.text });
        await delay(180, signal);
      }
    }

    const scoreMatch = (MOCK[mod.id] ?? []).map(c => c.text).join("").match(/Score\s+(?:calculado|Global):\s+(\d+)/);
    emit({ type: "agent_complete", module_id: mod.id, score: scoreMatch ? parseInt(scoreMatch[1]) : 70 });
    await delay(350, signal);
  }

  await delay(500, signal);
  emit({ type: "analysis_done", total_score: 68 });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const INITIAL: StreamState = {
  phase: "idle",
  modules: ANALYSIS_MODULES.map(m => ({ ...m, status: "pending" })),
  lines: [],
  completedCount: 0,
  totalCount: ANALYSIS_MODULES.length,
  elapsedSeconds: 0,
};

export interface UseAnalysisStreamOptions {
  mockMode?: boolean;
  onComplete?: (score: number) => void;
}

export function useAnalysisStream(
  jobId: string | null,
  options: UseAnalysisStreamOptions = {}
) {
  const { mockMode = false, onComplete } = options;
  const [state, setState] = useState<StreamState>(INITIAL);

  const esRef    = useRef<EventSource | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t0Ref    = useRef(0);

  // Elapsed clock
  const startClock = useCallback(() => {
    if (timerRef.current) return;
    t0Ref.current = Date.now();
    timerRef.current = setInterval(() => {
      setState(s => ({ ...s, elapsedSeconds: Math.floor((Date.now() - t0Ref.current) / 1000) }));
    }, 1000);
  }, []);

  const stopClock = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Event dispatcher
  const dispatch = useCallback((ev: Record<string, unknown>) => {
    setState(prev => {
      switch (ev.type) {
        case "queue_position":
          return { ...prev, phase: "queued", queuePosition: ev.position as number, queueEta: ev.estimated_seconds as number };

        case "analysis_start":
          return { ...prev, phase: "running" };

        case "agent_start": {
          const mod = ANALYSIS_MODULES.find(m => m.id === ev.module_id)!;
          const sep: TerminalLine[] = prev.activeModuleId
            ? [{ text: "", type: "divider" }, { text: "─".repeat(54), type: "divider" }, { text: "", type: "divider" }]
            : [];
          const header: TerminalLine = { text: `◉  AGENTE · ${mod.name.toUpperCase()}`, type: "header" };
          const rule: TerminalLine   = { text: "─".repeat(54), type: "divider" };
          return {
            ...prev,
            activeModuleId: ev.module_id as string,
            lines: [...prev.lines, ...sep, header, rule, { text: "", type: "normal" }],
            modules: prev.modules.map(m =>
              m.id === ev.module_id ? { ...m, status: "running" } : m
            ),
          };
        }

        case "agent_chunk": {
          if (!prev.lines.length) return prev;
          const last = prev.lines[prev.lines.length - 1];
          // If last line has no newline yet, append to it; otherwise start new line
          if (!last.text.endsWith("\n")) {
            const updated = [...prev.lines];
            updated[updated.length - 1] = {
              text: last.text + (ev.text as string),
              type: classifyLine(last.text + (ev.text as string)),
            };
            return { ...prev, lines: updated };
          }
          // New chunk on new lines
          const newLines = textToLines(ev.text as string);
          return { ...prev, lines: [...prev.lines, ...newLines] };
        }

        case "agent_complete":
          return {
            ...prev,
            completedCount: prev.completedCount + 1,
            modules: prev.modules.map(m =>
              m.id === ev.module_id ? { ...m, status: "done", score: ev.score as number } : m
            ),
          };

        case "analysis_done":
          return { ...prev, phase: "done", totalScore: ev.total_score as number };

        case "error":
          return { ...prev, phase: "error", errorMessage: ev.message as string };

        default:
          return prev;
      }
    });

    // Side-effects
    if (ev.type === "analysis_start") startClock();
    if (ev.type === "analysis_done") { stopClock(); onComplete?.(ev.total_score as number); esRef.current?.close(); }
    if (ev.type === "error") stopClock();
  }, [startClock, stopClock, onComplete]);

  useEffect(() => {
    if (!jobId) return;

    // Reset
    setState({
      ...INITIAL,
      phase: "connecting",
      modules: ANALYSIS_MODULES.map(m => ({ ...m, status: "pending" })),
    });

    abortRef.current?.abort();

    if (mockMode) {
      const ac = new AbortController();
      abortRef.current = ac;
      runMock(dispatch, ac.signal).catch(() => {});
      return () => { ac.abort(); stopClock(); };
    }

    // Real SSE
    const es = new EventSource(`/api/stream/${jobId}`);
    esRef.current = es;
    es.onmessage = ev => { try { dispatch(JSON.parse(ev.data)); } catch {} };
    es.onerror   = ()  => dispatch({ type: "error", message: "Conexão interrompida. Reconectando automaticamente..." });

    return () => { es.close(); stopClock(); };
  }, [jobId, mockMode, dispatch, stopClock]);

  return state;
}
