import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { EstrategiaDashboard } from "@/components/mios/estrategia/EstrategiaDashboard";

export const Route = createFileRoute("/estrategia-hub")({
  component: EstrategiaHubPage,
  head: () => ({
    meta: [
      { title: "Estratégia — MIOS" },
      { name: "description", content: "Plano de negócio, investimento, conformidade e cenários para decisões de alta confiança." },
    ],
  }),
});

function EstrategiaHubPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Estratégia" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <EstrategiaDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
