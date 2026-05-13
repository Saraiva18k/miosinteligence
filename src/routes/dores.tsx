import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { Interrogatorio } from "@/components/mios/dores/Interrogatorio";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/dores")({
  component: DoresPage,
  head: () => ({
    meta: [
      { title: "Dores — MIOS" },
      {
        name: "description",
        content:
          "O Interrogatorio: as 5 dores mais criticas do mercado mapeadas com fontes reais, padroes por canal e oportunidades de posicionamento.",
      },
      { property: "og:title", content: "Dores — MIOS" },
      {
        property: "og:description",
        content: "Mapeamento de dores do consumidor com verbatims reais e oportunidades de posicionamento.",
      },
    ],
  }),
});

function DoresPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Dores" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <Interrogatorio />
          </div>
        </main>
      </div>
    </div>
  );
}
