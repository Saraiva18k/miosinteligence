import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { VerdictHero } from "@/components/mios/VerdictHero";
import { SignalBars } from "@/components/mios/SignalBars";
import { InsightCards } from "@/components/mios/InsightCards";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "MIOS — Market Intelligence Organization System" },
      {
        name: "description",
        content:
          "Inteligência estratégica de mercado com IA. Análise, mapeamento de concorrentes e veredito executivo.",
      },
    ],
  }),
});

function Dashboard() {
  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", background: "var(--bg-base)" }}
    >
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <VerdictHero />
            <SignalBars />
            <InsightCards />
          </div>
        </main>
      </div>
    </div>
  );
}
