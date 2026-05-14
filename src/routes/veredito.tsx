import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { VeredidoDashboard } from "@/components/mios/veredito/VeredidoDashboard";

export const Route = createFileRoute("/veredito")({
  component: VereditorPage,
  head: () => ({
    meta: [
      { title: "Veredito — MIOS" },
      {
        name: "description",
        content:
          "Veredito executivo: síntese estratégica completa com conviction gauge, recomendações priorizadas e risk register.",
      },
      { property: "og:title", content: "Veredito — MIOS" },
    ],
  }),
});

function VereditorPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Veredito" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <VeredidoDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
