import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/mios/Header";
import { Sidebar } from "@/components/mios/Sidebar";
import { TopBar } from "@/components/mios/TopBar";
import { SocialHero } from "@/components/mios/social/SocialHero";
import { PlatformGrid } from "@/components/mios/social/PlatformGrid";
import { CrossInsights } from "@/components/mios/social/CrossInsights";

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
  return (
    <div className="mios-ambient flex flex-col" style={{ height: "100vh" }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule="Social Intelligence" />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="mios-scroll flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <SocialHero />
            <PlatformGrid />
            <CrossInsights />
          </div>
        </main>
      </div>
    </div>
  );
}