import { useEffect, useRef } from "react";
import { CheckCircle2, Clock, AlertTriangle, Cpu } from "lucide-react";
import {
  useAnalysisStream,
  ANALYSIS_MODULES,
  type ModuleState,
  type StreamState,
  type TerminalLine,
  type UseAnalysisStreamOptions,
} from "@/hooks/useAnalysisStream";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
@keyframes ao-fade    { from{opacity:0}                        to{opacity:1} }
@keyframes ao-slide   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes ao-pulse   { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(255,149,0,0.55)} 50%{opacity:.85;box-shadow:0 0 0 7px rgba(255,149,0,0)} }
@keyframes ao-cursor  { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes ao-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes ao-pop     { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.25);opacity:1} 100%{transform:scale(1)} }
@keyframes ao-bar     { from{width:0} to{width:var(--w)} }
@keyframes ao-scanline{ 0%{top:-4px} 100%{top:100%} }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ModuleState["status"] }) {
  if (status === "done") return (
    <CheckCircle2
      size={11}
      color="#22c55e"
      style={{ flexShrink: 0, animation: "ao-pop 0.35s ease" }}
    />
  );
  if (status === "running") return (
    <span style={{
      width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
      background: "#ff9500",
      animation: "ao-pulse 1.5s ease-in-out infinite",
      display: "inline-block",
    }} />
  );
  return (
    <span style={{
      width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
      background: "rgba(255,255,255,0.08)", display: "inline-block",
    }} />
  );
}

// ─── Module panel (left) ──────────────────────────────────────────────────────

function ModulePanel({ modules }: { modules: ModuleState[] }) {
  const groups = Array.from(new Set(ANALYSIS_MODULES.map(m => m.group)));

  return (
    <div style={{
      width: 228, flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.06)",
      overflowY: "auto", padding: "20px 0",
      background: "rgba(255,255,255,0.015)",
    }}>
      {groups.map(group => {
        const color    = ANALYSIS_MODULES.find(m => m.group === group)!.groupColor;
        const mods     = modules.filter(m => m.group === group);
        const done     = mods.filter(m => m.status === "done").length;
        const running  = mods.some(m => m.status === "running");

        return (
          <div key={group} style={{ marginBottom: 26, padding: "0 18px" }}>
            {/* Group label */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 9,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{
                  width: 3, height: 11, borderRadius: 2,
                  background: running ? color : done === mods.length ? "#22c55e" : "rgba(255,255,255,0.12)",
                  display: "block", transition: "background 0.4s",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.15em",
                  color: running ? color : "rgba(255,255,255,0.28)",
                  transition: "color 0.4s",
                }}>
                  {group.toUpperCase()}
                </span>
              </div>
              <span style={{
                fontSize: 9, fontFamily: "JetBrains Mono, monospace",
                color: "rgba(255,255,255,0.18)",
              }}>
                {done}/{mods.length}
              </span>
            </div>

            {/* Module rows */}
            {mods.map(mod => (
              <div key={mod.id} style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "4.5px 0",
                opacity: mod.status === "pending" ? 0.38 : 1,
                transition: "opacity 0.35s",
              }}>
                <StatusDot status={mod.status} />
                <span style={{
                  fontSize: 12, lineHeight: 1.3, flex: 1,
                  color: mod.status === "running"
                    ? "#ff9500"
                    : mod.status === "done"
                    ? "rgba(255,255,255,0.78)"
                    : "rgba(255,255,255,0.38)",
                  fontWeight: mod.status === "running" ? 700 : 400,
                  transition: "color 0.3s",
                }}>
                  {mod.name}
                </span>
                {mod.status === "done" && mod.score !== undefined && (
                  <span style={{
                    fontSize: 10, fontFamily: "JetBrains Mono, monospace",
                    color: "#22c55e", fontWeight: 700,
                    animation: "ao-slide 0.3s ease",
                  }}>
                    {mod.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Terminal line renderer ───────────────────────────────────────────────────

function TLine({ line, isLast, phase }: { line: TerminalLine; isLast: boolean; phase: StreamState["phase"] }) {
  const style: React.CSSProperties = {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 12.5,
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  let color = "rgba(255,255,255,0.68)";
  if (line.type === "header")  color = "#ff9500";
  if (line.type === "divider") color = "rgba(255,149,0,0.18)";
  if (line.type === "arrow")   color = "rgba(255,200,80,0.85)";
  if (line.type === "score")   color = "#22c55e";
  if (line.type === "dim")     color = "rgba(255,255,255,0.3)";

  return (
    <div style={{ ...style, color }}>
      {line.text}
      {isLast && phase === "running" && (
        <span style={{
          display: "inline-block", width: 7, height: "1em",
          background: "#ff9500", marginLeft: 1,
          verticalAlign: "text-bottom",
          animation: "ao-cursor 1s step-end infinite",
        }} />
      )}
    </div>
  );
}

// ─── Terminal panel (right) ───────────────────────────────────────────────────

function TerminalPanel({ lines, phase }: { lines: TerminalLine[]; phase: StreamState["phase"] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Mac-style title bar */}
      <div style={{
        height: 36, borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", padding: "0 16px", gap: 7,
        flexShrink: 0, background: "rgba(0,0,0,0.15)",
      }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "block", opacity: 0.7 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "block", opacity: 0.7 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "block", opacity: 0.7 }} />
        <span style={{
          fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: 10,
          fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em",
        }}>
          mios · intelligence · agent stream
        </span>
      </div>

      {/* Scrollable terminal body */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "18px 24px 24px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,149,0,0.15) transparent",
      }}>
        {lines.length === 0 && phase === "connecting" && (
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: 12,
            color: "rgba(255,255,255,0.2)", animation: "ao-fade 0.5s ease",
          }}>
            Conectando ao servidor de inteligência...
          </div>
        )}

        {lines.map((line, i) => (
          <TLine
            key={i}
            line={line}
            isLast={i === lines.length - 1}
            phase={phase}
          />
        ))}

        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}

// ─── Queue screen ─────────────────────────────────────────────────────────────

function QueueScreen({ position, eta }: { position?: number; eta?: number }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 28, animation: "ao-fade 0.4s ease",
    }}>
      {/* Spinner */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid rgba(255,149,0,0.12)",
          borderTop: "2px solid #ff9500",
          animation: "ao-spin 1.1s linear infinite",
        }} />
        <Cpu size={26} color="#ff9500" style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
        }} />
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.18em", fontWeight: 700,
          color: "rgba(255,255,255,0.3)", marginBottom: 16,
        }}>
          AGUARDANDO NA FILA
        </div>
        {position !== undefined && (
          <div style={{
            fontSize: 72, fontWeight: 900, color: "#ff9500",
            fontFamily: "JetBrains Mono, monospace", lineHeight: 1,
            animation: "ao-pop 0.4s ease",
          }}>
            #{position}
          </div>
        )}
        {eta !== undefined && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>
            tempo estimado: ~{Math.ceil(eta / 60)} min
          </div>
        )}
        <div style={{
          marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.18)",
          maxWidth: 320, lineHeight: 1.6,
        }}>
          Seus agentes de inteligência estão sendo alocados. Você será notificado assim que a análise iniciar.
        </div>
      </div>
    </div>
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ score, elapsed, onClose }: { score?: number; elapsed: number; onClose: () => void }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 36, animation: "ao-slide 0.5s ease",
    }}>
      <img src="/mios-brain.png" alt="MIOS" style={{ width: 88, opacity: 0.95 }} />

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.22em", fontWeight: 700,
          color: "rgba(255,149,0,0.55)", marginBottom: 16,
        }}>
          ANÁLISE CONCLUÍDA
        </div>

        {score !== undefined && (
          <div style={{
            fontSize: 96, fontWeight: 900, lineHeight: 1,
            fontFamily: "JetBrains Mono, monospace",
            color: "#ff9500", animation: "ao-pop 0.5s ease",
          }}>
            {score}
            <span style={{ fontSize: 28, opacity: 0.35, fontWeight: 400 }}>/100</span>
          </div>
        )}

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
          Score MIOS Global · {fmt(elapsed)} de processamento
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          padding: "13px 44px",
          background: "#ff9500",
          border: "none", borderRadius: 6,
          color: "#000", fontWeight: 900,
          fontSize: 13, cursor: "pointer",
          letterSpacing: "0.1em",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        VER RESULTADOS
      </button>
    </div>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export interface AnalysisOverlayProps {
  jobId: string;
  mockMode?: boolean;
  onComplete?: UseAnalysisStreamOptions["onComplete"];
  onClose: () => void;
}

export function AnalysisOverlay({ jobId, mockMode = false, onComplete, onClose }: AnalysisOverlayProps) {
  const state = useAnalysisStream(jobId, { mockMode, onComplete });
  const {
    phase, modules, lines, completedCount, totalCount,
    elapsedSeconds, queuePosition, queueEta, totalScore, errorMessage,
  } = state;

  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const showPanels = phase === "running" || phase === "connecting";

  return (
    <>
      <style>{KF}</style>

      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#04060f",
        display: "flex", flexDirection: "column",
        animation: "ao-fade 0.35s ease",
        fontFamily: "'Inter', sans-serif",
      }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{
          height: 54, borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 18, padding: "0 24px",
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <img src="/mios-brain.png" alt="MIOS" style={{ height: 26 }} />
            <span style={{
              fontSize: 13, fontWeight: 900, letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.92)",
            }}>
              MIOS
            </span>
          </div>

          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

          {/* Phase label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {phase === "running" && (
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#ff9500", display: "inline-block",
                animation: "ao-pulse 1.5s ease infinite",
              }} />
            )}
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.35)",
            }}>
              {phase === "connecting" && "CONECTANDO"}
              {phase === "queued"     && "AGUARDANDO NA FILA"}
              {phase === "running"    && "ANÁLISE EM PROGRESSO"}
              {phase === "done"       && "ANÁLISE CONCLUÍDA"}
              {phase === "error"      && "ERRO DE PROCESSAMENTO"}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right stats */}
          {(phase === "running" || phase === "done") && (
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={12} color="rgba(255,255,255,0.2)" />
                <span style={{
                  fontSize: 12, fontFamily: "JetBrains Mono, monospace",
                  color: "rgba(255,255,255,0.45)",
                }}>
                  {completedCount}
                  <span style={{ opacity: 0.4 }}>/{totalCount}</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={12} color="rgba(255,255,255,0.2)" />
                <span style={{
                  fontSize: 12, fontFamily: "JetBrains Mono, monospace",
                  color: "rgba(255,255,255,0.45)",
                }}>
                  {fmt(elapsedSeconds)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Progress bar ──────────────────────────────────────── */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
          <div style={{
            height: "100%",
            width: phase === "done" ? "100%" : `${progress}%`,
            background: "linear-gradient(90deg, rgba(255,149,0,0.5) 0%, #ff9500 100%)",
            boxShadow: "0 0 10px rgba(255,149,0,0.45)",
            transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Two-panel: module list + terminal */}
          {showPanels && (
            <>
              <ModulePanel modules={modules} />
              <TerminalPanel lines={lines} phase={phase} />
            </>
          )}

          {/* Queue */}
          {phase === "queued" && (
            <QueueScreen position={queuePosition} eta={queueEta} />
          )}

          {/* Done */}
          {phase === "done" && (
            <DoneScreen score={totalScore} elapsed={elapsedSeconds} onClose={onClose} />
          )}

          {/* Error */}
          {phase === "error" && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 18,
              animation: "ao-fade 0.4s ease",
            }}>
              <AlertTriangle size={36} color="#ef4444" />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center", maxWidth: 360 }}>
                {errorMessage ?? "Erro desconhecido"}
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: "9px 28px", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6, background: "transparent",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12,
                }}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
