import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Zap, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, Brain } from "lucide-react";

type ModuleStatus = "done" | "active" | "pending";

interface TimelineModule {
  label: string;
  status: ModuleStatus;
  preview?: string;
  alertCount?: number;
}

interface TimelineSection {
  title: string;
  modules: TimelineModule[];
}

const sections: TimelineSection[] = [
  {
    title: "PESQUISA",
    modules: [
      { label: "Dores", status: "done", preview: "Gap de confiança real" },
      { label: "Concorrentes", status: "done", preview: "5 players, NPS baixo" },
      { label: "Tendências", status: "done", preview: "Busca +340% 6 meses" },
      { label: "Audiência", status: "pending" },
      { label: "Sentimento", status: "pending" },
      { label: "Canais", status: "pending" },
      { label: "Precificação", status: "pending" },
      { label: "Social Intelligence", status: "pending", alertCount: 2 },
      { label: "DNA da Marca", status: "pending" },
    ],
  },
  {
    title: "SÍNTESE",
    modules: [
      { label: "Inovação", status: "pending" },
      { label: "Compliance", status: "pending" },
      { label: "Investimento", status: "pending" },
      { label: "Business Plan", status: "pending" },
      { label: "Veredito", status: "active", preview: "Score 87 · Entrar agora" },
    ],
  },
];

const moduleHrefs: Record<string, string> = {
  Veredito: "/",
  "Social Intelligence": "/social-intelligence",
  Concorrentes: "/concorrentes",
  "Audiência": "/audiencia",
  Investimento: "/investimento",
  "Business Plan": "/business-plan",
};