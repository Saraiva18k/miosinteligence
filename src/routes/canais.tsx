import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { Fluxo } from "@/components/mios/canais/Fluxo";

export const Route = createFileRoute("/canais")({
  component: CanaisPage,
  head: () => ({
    meta: [
      { title: "Canais — MIOS" },
      {
        name: "description",
        content:
          "O Mapa de Fluxo: onde o dinheiro e a atenção do mercado fluem — 8 canais mapeados com CAC, conversão, densidade competitiva e alocação recomendada.",
      },
      { property: "og:title", content: "Canais — MIOS" },
      {
        property: "og:description",
        content:
          "Quais canais convertem, quais drenam budget e onde ainda há espaço vazio. Decisão de alocação baseada em dados.",
      },
    ],
  }),
});

function CanaisPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Canais" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto">
            <Fluxo />
          </div>
        </main>
      </div>
    </div>
  );
}
