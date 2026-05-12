import { Instagram, Music2, Linkedin, Youtube } from "lucide-react";

const platforms = [
  { name: "INSTAGRAM", icon: Instagram, color: "225,48,108" },
  { name: "TIKTOK", icon: Music2, color: "255,255,255" },
  { name: "LINKEDIN", icon: Linkedin, color: "10,102,194" },
  { name: "YOUTUBE", icon: Youtube, color: "255,0,0" },
];

export function SocialHero() {
  return (
    <div
      className="verdict-hero mios-float relative"
      style={{
        background: "rgba(255,149,0,0.05)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,149,0,0.15)",
        padding: "20px 24px",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "3px",
              color: "rgba(255,149,0,0.5)",
            }}
          >
            SOCIAL INTELLIGENCE
          </div>
          <h1
            className="mt-2"
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.8px",
              lineHeight: 1.15,
            }}
          >
            Espionagem de mercado em tempo real.
          </h1>
          <div
            className="mt-2 flex items-center gap-2"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}
          >
            <span>4 plataformas</span>
            <span>·</span>
            <span>23 perfis analisados</span>
            <span>·</span>
            <span>1.240 posts</span>
          </div>
        </div>
        <span
          className="shrink-0 inline-flex items-center"
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "2px",
            padding: "4px 8px",
            borderRadius: 6,
            background: "rgba(16,185,129,0.10)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(16,185,129,0.30)",
            color: "rgba(16,185,129,0.85)",
          }}
        >
          CONCLUÍDO
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {platforms.map((p) => {
          const Icon = p.icon;
          return (
            <span
              key={p.name}
              className="inline-flex items-center gap-1.5"
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid rgba(${p.color},0.4)`,
                background: `rgba(${p.color},0.08)`,
                color: `rgba(${p.color},0.9)`,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
              }}
            >
              <Icon size={10} strokeWidth={2.4} />
              {p.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}