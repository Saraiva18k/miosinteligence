import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { Pulso } from "@/components/mios/sentimento/Pulso";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/sentimento")({
  component: SentimentoPage,
  head: () => ({
    meta: [
      { title: "Sentimento — MIOS" },
      {
        name: "description",
        content:
          "O Pulso: mapeamento emocional do mercado em 6 canais — score de sentimento, verbatims reais e frequência emocional.",
      },
      { property: "og:title", content: "Sentimento — MIOS" },
      {
        property: "og:description",
        content:
          "O que o mercado sente — frustração, desconfiança, esperança. Escuta direta de 12.000+ menções/mês em canais públicos e privados.",
      },
    ],
  }),
});

function SentimentoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Sentimento" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <Pulso />
          </div>
        </main>
      </div>
    </div>
  );
}
