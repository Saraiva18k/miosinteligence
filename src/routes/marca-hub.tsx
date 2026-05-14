import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { MarcaDashboard } from "@/components/mios/marca/MarcaDashboard";

export const Route = createFileRoute("/marca-hub")({
  component: MarcaHubPage,
  head: () => ({
    meta: [
      { title: "Marca & Produto — MIOS" },
      { name: "description", content: "Identidade, posicionamento, percepção de valor e inovação do seu produto." },
    ],
  }),
});

function MarcaHubPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Marca & Produto" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <MarcaDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
