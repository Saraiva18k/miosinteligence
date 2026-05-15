import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { ComparativoHero } from "@/components/mios/veredito/ComparativoHero";

export const Route = createFileRoute("/comparativo")({
  component: ComparativoPage,
  head: () => ({
    meta: [{ title: "Comparativo — MIOS" }],
  }),
});

function ComparativoPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Comparativo" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <ComparativoHero />
          </div>
        </main>
      </div>
    </div>
  );
}
