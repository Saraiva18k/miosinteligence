import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { WarRoom } from "@/components/mios/concorrentes/WarRoom";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/concorrentes")({
  component: ConcorrentesPage,
  head: () => ({
    meta: [
      { title: "Concorrentes — MIOS" },
      {
        name: "description",
        content:
          "Sala de guerra competitiva: inteligencia em tempo real sobre os concorrentes do seu mercado.",
      },
      { property: "og:title", content: "Concorrentes — MIOS" },
      {
        property: "og:description",
        content: "Mapeie, analise e antecipe os movimentos da concorrencia.",
      },
    ],
  }),
});

function ConcorrentesPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Concorrentes" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <WarRoom />
          </div>
        </main>
      </div>
    </div>
  );
}
