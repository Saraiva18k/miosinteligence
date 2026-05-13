import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { SocialHero } from "@/components/mios/social/SocialHero";
import { PlatformGrid } from "@/components/mios/social/PlatformGrid";
import { CrossInsights } from "@/components/mios/social/CrossInsights";
import { SubTabs } from "@/components/mios/social/SubTabs";
import { CompetitorSelector } from "@/components/mios/social/CompetitorSelector";
import { StrategyView } from "@/components/mios/social/StrategyView";
import { ContextTabs } from "@/components/mios/ContextTabs";

export const Route = createFileRoute("/social-intelligence")({
  component: SocialIntelligence,
  head: () => ({
    meta: [
      { title: "Social Intelligence — MIOS" },
      {
        name: "description",
        content:
          "Espionagem de mercado em tempo real: 4 plataformas, perfis, posts e gaps detectáveis.",
      },
      { property: "og:title", content: "Social Intelligence — MIOS" },
      {
        property: "og:description",
        content: "Inteligência social cruzada: Instagram, TikTok, LinkedIn e YouTube.",
      },
    ],
  }),
});

function SocialIntelligence() {
  const [tab, setTab] = useState<"concorrentes" | "estrategia">(() => {
    if (typeof window === "undefined") return "concorrentes";
    return (window.localStorage.getItem("mios.social.subtab") as
      | "concorrentes"
      | "estrategia") || "concorrentes";
  });
  const [competitor, setCompetitor] = useState("Todos os concorrentes");
  const [compareMode, setCompareMode] = useState(false);

  const handleTabChange = (next: "concorrentes" | "estrategia") => {
    setTab(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mios.social.subtab", next);
    }
  };

  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Social Intelligence" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <ContextTabs />
            <SocialHero />
            <SubTabs active={tab} onChange={handleTabChange} />
            {tab === "concorrentes" ? (
              <div className="space-y-4" style={{ animation: "fadeIn 0.2s ease" }}>
                <CompetitorSelector
                  competitors={[
                    "Todos os concorrentes",
                    "@clinicabella_sp",
                    "@studio_renata",
                    "@esteticasp_oficial",
                  ]}
                  selected={competitor}
                  onSelect={setCompetitor}
                  compareMode={compareMode}
                  onToggleCompare={() => setCompareMode((v) => !v)}
                />
                <PlatformGrid />
                <CrossInsights />
              </div>
            ) : (
              <StrategyView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}