import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { Espectro } from "@/components/mios/dna/Espectro";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/dna")({
  component: DnaPage,
  head: () => ({
    meta: [
      { title: "DNA da Marca — MIOS" },
      {
        name: "description",
        content:
          "O Espectro: perfil arquetípico, dimensões de marca, identidade verbal e pilares de conteúdo — o DNA que diferencia ou que confunde.",
      },
      { property: "og:title", content: "DNA da Marca — MIOS" },
      {
        property: "og:description",
        content:
          "Radar arquetípico, espectro de dimensões atual vs. ideal, identidade verbal e mix editorial recomendado.",
      },
    ],
  }),
});

function DnaPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="DNA da Marca" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <Espectro />
          </div>
        </main>
      </div>
    </div>
  );
}
