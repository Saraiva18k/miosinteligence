import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { Portrait } from "@/components/mios/audiencia/Portrait";

export const Route = createFileRoute("/audiencia")({
  component: AudienciaPage,
  head: () => ({
    meta: [
      { title: "Audiencia — MIOS" },
      {
        name: "description",
        content:
          "O Retrato: personas detalhadas com comportamentos, jornada de compra e gatilhos de decisao.",
      },
      { property: "og:title", content: "Audiencia — MIOS" },
      {
        property: "og:description",
        content: "Conheca profundamente quem e o seu cliente real.",
      },
    ],
  }),
});

function AudienciaPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Audiência" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <Portrait />
          </div>
        </main>
      </div>
    </div>
  );
}
