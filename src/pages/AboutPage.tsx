import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Zap,
  ArrowRight,
  Cpu,
  Monitor,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Accordion } from '../components/ui/Accordion';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does client-side persistence work?',
      content:
        'All workspace entities (projects, tasks, subtasks, members, activity logs, and preferences) are stored in your browser’s localStorage using a normalized Zustand store. Mutations take effect optimistically in memory, then serialize cleanly to local storage without page reloads.',
    },
    {
      id: 'faq-2',
      title: 'Can I export or backup my workspace data?',
      content:
        'Yes! In the Settings page, click "Export nexaflow-workspace.json" to download your entire workspace state as a validated JSON document. You can restore this file on any machine or browser.',
    },
    {
      id: 'faq-3',
      title: 'How is accessibility (a11y) ensured across components?',
      content:
        'Every component is developed following WAI-ARIA authoring practices. Modals implement focus restoration and scroll locking; icon buttons feature accessible tooltips; contrast tokens adhere to WCAG AAA standards; and animations respect the prefers-reduced-motion media query.',
    },
    {
      id: 'faq-4',
      title: 'What makes NexaFlow different from a standard CRUD demo?',
      content:
        'NexaFlow was built as a premier frontend engineering showcase. Rather than basic mock API calls, it features custom hook abstractions, advanced typed tables with column filtering and sorting, real-time Recharts visualizations, drag-and-drop Kanban reordering, and a global command palette.',
    },
  ];

  return (
    <div className="max-w-4xl space-y-10 text-left pb-16 mx-auto">
      {/* Hero Header */}
      <div>
        <Badge variant="brand" size="md" className="mb-3">
          Frontend Engineering Showcase
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About NexaFlow
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          "Plan clearly. Build beautifully." — A modern, 100% frontend productivity workspace demonstrating advanced React patterns, client state architecture, and accessible UI design.
        </p>
      </div>

      {/* 1. What is NexaFlow? */}
      <Card className="p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>What is NexaFlow?</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          NexaFlow is a production-grade frontend workspace inspired by best-in-class tools like Linear, Raycast, and Notion. It demonstrates how rich, desktop-class interactivity can be achieved entirely in the browser with zero backend servers, zero databases, and zero external API dependencies.
        </p>
      </Card>

      {/* 2. Core Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Local-First Architecture
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Optimistic UI updates powered by Zustand, guaranteed offline execution, and client-side JSON export/import for seamless data portability.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Accessible & Strict Type Safety
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            100% TypeScript with zero `any` declarations, full keyboard navigation support (Ctrl+K, shortcuts), ARIA attributes, and high contrast options.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Custom UI Design System
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            25+ modular UI components including data tables with column management, drawers, date pickers, modals, toast stacks, and tabs.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-1">
            <Monitor className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Responsive & Dark Mode First
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Meticulously tested across all viewports from 320px mobile screens to 4K displays with dedicated touch-friendly drawers and card transformations.
          </p>
        </Card>
      </div>

      {/* 3. Tech Stack Deep Dive */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-500" />
          <span>Technical Stack & Libraries</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">FRAMEWORK</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">React 19 & Vite</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">LANGUAGE</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Strict TypeScript</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">STATE STORE</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Zustand + LocalStorage</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">STYLING</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Tailwind CSS + Tokens</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">ANIMATION</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Framer Motion</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">VISUALIZATION</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Recharts Telemetry</span>
          </div>
        </div>
      </Card>

      {/* 4. FAQ Accordion */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <Accordion items={faqItems} allowMultiple />
      </Card>

      {/* Bottom CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-900/60 via-indigo-950 to-slate-900 border border-brand-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Explore the live workspace</h3>
          <p className="text-xs text-slate-300">
            Jump into the dashboard, test the Kanban boards, or explore the design system.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
        >
          Open Dashboard
        </Button>
      </div>
    </div>
  );
};
