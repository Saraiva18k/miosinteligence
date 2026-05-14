import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { ContextTabs } from "@/components/mios/ContextTabs";
import { BenchmarkingHero } from "@/components/mios/mercado/BenchmarkingHero";

export const Route = createFileRoute("/benchmarking")({
  component: BenchmarkingPage,
  head: () => ({
    meta: [{ title: "Benchmarking Setorial — MIOS" }],
  }),
});

function BenchmarkingPage() {
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Benchmarking" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5">
            <ContextTabs />
            <BenchmarkingHero />
          </div>
        </main>
      </div>
    </div>
  );
}
