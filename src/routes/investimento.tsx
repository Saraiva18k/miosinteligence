import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { LiveSheet } from "@/components/mios/investimento/LiveSheet";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/investimento")({
  component: InvestimentoPage,
  head: () => ({
    meta: [
      { title: "Investimento — MIOS" },
      {
        name: "description",
        content:
          "A Planilha Viva: projecoes financeiras dinamicas com 3 cenarios, plano de investimento e analise de ROI.",
      },
      { property: "og:title", content: "Investimento — MIOS" },
      {
        property: "og:description",
        content: "Modelagem financeira inteligente para decisoes de investimento.",
      },
    ],
  }),
});

function InvestimentoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Investimento" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <LiveSheet />
          </div>
        </main>
      </div>
    </div>
  );
}
