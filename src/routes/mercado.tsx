import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { MercadoDashboard } from "@/components/mios/mercado/MercadoDashboard";

export const Route = createFileRoute("/mercado")({
  component: MercadoPage,
  head: () => ({
    meta: [
      { title: "Mercado — MIOS" },
      { name: "description", content: "Inteligência de mercado, concorrência e tendências." },
    ],
  }),
});

function MercadoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Mercado" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <MercadoDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
