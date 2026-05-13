import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { VerdictHero } from "@/components/mios/VerdictHero";

export const Route = createFileRoute("/veredito")({
  component: VereditorPage,
  head: () => ({
    meta: [
      { title: "Veredito — MIOS" },
      {
        name: "description",
        content:
          "Veredito executivo: síntese estratégica completa com score de viabilidade e recomendações do Mentor IA.",
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
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto">
            <VerdictHero />
          </div>
        </main>
      </div>
    </div>
  );
}
