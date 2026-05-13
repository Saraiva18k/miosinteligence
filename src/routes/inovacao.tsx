import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { Laboratorio } from "@/components/mios/inovacao/Laboratorio";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/inovacao")({
  component: InovacaoPage,
  head: () => ({
    meta: [
      { title: "Inovação — MIOS" },
      {
        name: "description",
        content:
          "O Laboratório: pipeline de experimentos, matriz de oportunidade e quick wins identificados — inovação estruturada com hipótese, método e resultado.",
      },
      { property: "og:title", content: "Inovação — MIOS" },
      {
        property: "og:description",
        content:
          "8 experimentos mapeados da hipótese à validação. Kanban de inovação com matriz de impacto × esforço.",
      },
    ],
  }),
});

function InovacaoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Inovação" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <Laboratorio />
          </div>
        </main>
      </div>
    </div>
  );
}
