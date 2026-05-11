import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { Ticker } from "@/components/mios/tendencias/Ticker";

export const Route = createFileRoute("/tendencias")({
  component: TendenciasPage,
  head: () => ({
    meta: [
      { title: "Tendências — MIOS" },
      {
        name: "description",
        content:
          "O Ticker: rastreamento de sinais de mercado em tempo real — trajetórias, convergências e janelas de oportunidade estratégica.",
      },
      { property: "og:title", content: "Tendências — MIOS" },
      {
        property: "og:description",
        content:
          "6 tendências mapeadas com momentum, evidência e implicação estratégica. Onde os sinais convergem — e o que fazer antes que a janela feche.",
      },
    ],
  }),
});

function TendenciasPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Tendências" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto">
            <Ticker />
          </div>
        </main>
      </div>
    </div>
  );
}
