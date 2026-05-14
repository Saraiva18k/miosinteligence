import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { AudienciaDashboard } from "@/components/mios/audiencia/AudienciaDashboard";

export const Route = createFileRoute("/audiencia-hub")({
  component: AudienciaHubPage,
  head: () => ({
    meta: [
      { title: "Audiência — MIOS" },
      { name: "description", content: "Personas, dores, canais e inteligência comportamental da sua audiência." },
    ],
  }),
});

function AudienciaHubPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Audiência" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <AudienciaDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
