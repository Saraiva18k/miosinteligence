import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { VerdictHero } from "@/components/mios/VerdictHero";

export const Route = createFileRoute("/score-final")({
  component: ScoreFinalPage,
  head: () => ({
    meta: [
      { title: "Score Final — MIOS" },
      {
        name: "description",
        content:
          "Score Final: análise detalhada do veredito estratégico, sinais de mercado e janela de entrada.",
      },
      { property: "og:title", content: "Score Final — MIOS" },
    ],
  }),
});

function ScoreFinalPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Score Final" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <VerdictHero />
          </div>
        </main>
      </div>
    </div>
  );
}
