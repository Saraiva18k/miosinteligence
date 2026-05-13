import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { Dashboard } from "@/components/mios/home/Dashboard";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "MIOS — Home" },
      {
        name: "description",
        content:
          "Inteligência estratégica de mercado com IA. Análise, mapeamento de concorrentes e veredito executivo.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Home" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs show={true} />
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}