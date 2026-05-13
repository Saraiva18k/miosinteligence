import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { Balanca } from "@/components/mios/precificacao/Balanca";

export const Route = createFileRoute("/precificacao")({
  component: PrecificacaoPage,
  head: () => ({
    meta: [
      { title: "Precificação — MIOS" },
      {
        name: "description",
        content:
          "A Balança: posicionamento de preço, inteligência competitiva e arquitetura de tiers — onde você está, onde deveria estar e quanto cobrar por isso.",
      },
      { property: "og:title", content: "Precificação — MIOS" },
      {
        property: "og:description",
        content:
          "Matriz de posicionamento, tabela de preços competitivos, análise de entrega vs expectativa e arquitetura de tiers de preço.",
      },
    ],
  }),
});

function PrecificacaoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Precificação" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <Balanca />
          </div>
        </main>
      </div>
    </div>
  );
}
