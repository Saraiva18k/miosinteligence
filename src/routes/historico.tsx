import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { HistoricoHero } from "@/components/mios/veredito/HistoricoHero";

export const Route = createFileRoute("/historico")({
  component: HistoricoPage,
  head: () => ({
    meta: [{ title: "Histórico — MIOS" }],
  }),
});

function HistoricoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Histórico" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <HistoricoHero />
          </div>
        </main>
      </div>
    </div>
  );
}
