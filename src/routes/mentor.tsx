import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { Mentor } from "@/components/mios/mentor/Mentor";

export const Route = createFileRoute("/mentor")({
  component: MentorPage,
  head: () => ({
    meta: [
      { title: "Mentor IA — MIOS" },
      {
        name: "description",
        content:
          "O Sócio: IA treinada nos 14 módulos da sua inteligência de mercado. Análise, estratégia e execução com contexto completo do negócio.",
      },
      { property: "og:title", content: "Mentor IA — MIOS" },
      {
        property: "og:description",
        content:
          "Score 87/100. 14 módulos integrados. Janela de entrada ativa. Seu sócio estratégico disponível 24/7.",
      },
    ],
  }),
});

function MentorPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Mentor IA" />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <div className="flex-1 min-h-0 overflow-hidden">
            <Mentor />
          </div>
        </main>
      </div>
    </div>
  );
}
