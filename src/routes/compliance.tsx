import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { MapaRisco } from "@/components/mios/compliance/MapaRisco";

export const Route = createFileRoute("/compliance")({
  component: CompliancePage,
  head: () => ({
    meta: [
      { title: "Compliance — MIOS" },
      {
        name: "description",
        content:
          "O Mapa de Risco: matriz de probabilidade × impacto, saúde por domínio regulatório e prazos críticos — compliance como vantagem competitiva.",
      },
      { property: "og:title", content: "Compliance — MIOS" },
      {
        property: "og:description",
        content:
          "10 riscos mapeados em 6 domínios. Matriz interativa de probabilidade × impacto com ações e prazos regulatórios.",
      },
    ],
  }),
});

function CompliancePage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Compliance" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <MapaRisco />
          </div>
        </main>
      </div>
    </div>
  );
}
