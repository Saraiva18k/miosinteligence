import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { Manuscript } from "@/components/mios/businessplan/Manuscript";

export const Route = createFileRoute("/business-plan")({
  component: BusinessPlanPage,
  head: () => ({
    meta: [
      { title: "Business Plan — MIOS" },
      {
        name: "description",
        content:
          "O Manuscrito: plano de negocios executivo completo com 8 secoes, TOC interativo e dados cruzados dos modulos.",
      },
      { property: "og:title", content: "Business Plan — MIOS" },
      {
        property: "og:description",
        content: "Documento executivo gerado por inteligencia estrategica.",
      },
    ],
  }),
});

function BusinessPlanPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Business Plan" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="flex-1 overflow-hidden px-6 py-5">
            <Manuscript />
          </div>
        </main>
      </div>
    </div>
  );
}
