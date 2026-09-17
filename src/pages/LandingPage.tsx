import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Calendar,
  Users,
  Layers,
  Sparkles,
  Zap,
  Terminal,
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FolderKanban className="w-5 h-5 text-indigo-500" />,
      title: 'Project Management',
      description:
        'Structure initiatives with clear milestones, assignees, priorities, and calculated real-time progress indicators.',
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-sky-500" />,
      title: 'Kanban Workflow',
      description:
        'Smooth drag-and-drop task boards with cross-column reordering, subtask progress, and comprehensive activity tracking.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
      title: 'Advanced Analytics',
      description:
        'Dynamic velocity and workload charts powered by Recharts, responding instantly to client-side workspace updates.',
    },
    {
      icon: <Calendar className="w-5 h-5 text-amber-500" />,
      title: 'Calendar Planning',
      description:
        'Interactive Month, Week, Day, and Agenda views with one-click task scheduling and due date timeline tracking.',
    },
    {
      icon: <Users className="w-5 h-5 text-pink-500" />,
      title: 'Team Workspace',
      description:
        'Manage members, monitor workloads, track individual task contributions, and invite collaborators seamlessly.',
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-500" />,
      title: 'Reusable UI System',
      description:
        '25+ accessible design system primitives with full keyboard navigation, dark mode support, and interactive showcase.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-400">
      {/* Public Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo size="md" />

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Workflow
            </a>
            <Link to="/components" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Design System
            </Link>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Architecture
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/components')}
              className="hidden sm:inline-flex"
            >
              Component Demo
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/dashboard')}
            >
              Open Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle background ambient radial gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 border border-brand-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern 100% Frontend SaaS Architecture</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6"
          >
            Plan clearly.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-teal-400">
              Build beautifully.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal"
          >
            One focused workspace for managing projects, tasks, deadlines, and team progress.
            Zero backend setup required — lightning-fast client state with persistent local storage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto shadow-lg shadow-brand-500/25"
            >
              Open Interactive Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto"
            >
              Explore Features
            </Button>
          </motion.div>
        </div>

        {/* Animated Interactive Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-6xl mx-auto mt-14 sm:mt-18 relative"
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-2 sm:p-3 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
            {/* Fake App Shell Preview */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
              {/* Window Bar */}
              <div className="h-8 px-4 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">nexaflow.dev/dashboard</span>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">Live Preview</span>
              </div>

              {/* Window Content */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 text-left">
                {/* Mini Stat Cards */}
                <div className="lg:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Total Projects</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">6 Active</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Active Tasks</p>
                    <p className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1">21 Tasks</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Completed</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">11 Done</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Completion Rate</p>
                    <p className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">68.5%</p>
                  </div>
                </div>

                {/* Left: Mini Kanban Preview */}
                <div className="lg:col-span-7 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">Active Sprints</span>
                    <span className="text-brand-600 font-medium">Kanban Flow</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-sky-500">IN PROGRESS</span>
                        <span className="font-mono text-slate-400">3</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                          Design analytics dashboard
                        </p>
                        <span className="text-[10px] text-rose-500 font-medium mt-1 inline-block">Urgent</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                          Add keyboard shortcuts
                        </p>
                        <span className="text-[10px] text-amber-500 font-medium mt-1 inline-block">High</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-500">DONE</span>
                        <span className="font-mono text-slate-400">2</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 line-through text-slate-400">
                          Implement responsive navbar
                        </p>
                        <span className="text-[10px] text-emerald-500 font-medium mt-1 inline-block">Completed</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 line-through text-slate-400">
                          Add dark mode
                        </p>
                        <span className="text-[10px] text-emerald-500 font-medium mt-1 inline-block">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Mini Analytics Velocity Preview */}
                <div className="lg:col-span-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs mb-3">
                      <span className="font-semibold text-slate-900 dark:text-white">Weekly Productivity</span>
                      <span className="text-[11px] text-slate-400">Last 7 Days</span>
                    </div>

                    {/* Simulated bars */}
                    <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                      {[40, 65, 30, 85, 90, 70, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-indigo-400 transition-all duration-500"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[9px] text-slate-400 font-mono">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-3"
                  >
                    View Interactive Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Technology Strip */}
      <section className="py-10 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            ENGINEERED WITH MODERN INDUSTRY-STANDARD FRONTEND TECH
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> React 19 + TypeScript
            </span>
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-500" /> Zustand Local-first State
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" /> Tailwind CSS + Dark Mode
            </span>
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" /> Recharts Telemetry
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" /> Framer Motion
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="brand" size="md" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Everything your team needs to execute cleanly.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered to demonstrate enterprise-grade frontend patterns: custom hooks, modal traps,
            faceted filtering, optimistic client mutations, and complete accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="neutral" size="md" className="mb-3">
              Workflow Mechanics
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Designed for speed. Engineered for reliability.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Zero Configuration Start
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Clone, run <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">npm run dev</code>, and you're live. No database credentials, no external APIs, no server dependencies.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Keyboard-First Navigation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">Ctrl+K</kbd> anywhere for the global command palette, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">N</kbd> for new task, and <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">P</kbd> for project.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Client Persistence & JSON Export
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                All changes persist automatically to localStorage. Export your entire workspace into <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">nexaflow-workspace.json</code> and restore anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 border border-brand-800/40 p-8 sm:p-14 text-center text-white relative shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Experience NexaFlow right now.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Explore the dashboard, interact with the Kanban board, inspect the design system, and test keyboard shortcuts in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Open Workspace Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/components')}
              className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
            >
              View Component Showcase
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-12 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" />
            <span className="text-slate-400">• Plan clearly. Build beautifully.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/projects" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Projects
            </Link>
            <Link to="/tasks" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Tasks
            </Link>
            <Link to="/components" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Components
            </Link>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              About
            </Link>
          </div>

          <p>© 2026 NexaFlow. 100% Frontend Engineering Showcase.</p>
        </div>
      </footer>
    </div>
  );
};
