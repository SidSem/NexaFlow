# NexaFlow

> **"Plan clearly. Build beautifully."**  
> *A modern frontend productivity workspace for projects, tasks, teams, and analytics.*

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://nexaflow.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%206.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand%20Local--First-orange)](https://github.com/pmndrs/zustand)
[![WCAG AAA](https://img.shields.io/badge/Accessibility-WCAG%20AAA-emerald)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🚀 Live Demo & Purpose

**Live Demo URL**: [https://nexaflow.vercel.app/](https://nexaflow.vercel.app/)

NexaFlow is a **100% frontend engineering showcase**. It is architected to demonstrate advanced React and modern client-side capabilities through a dense, high-performance SaaS productivity application.

**Key Technical Highlights**:
- **Zero Backend / Serverless Dependency**: Runs entirely in the browser with local persistence.
- **Client-Side Persistence & Portability**: State managed via Zustand with automatic `localStorage` synchronization and JSON workspace export/import (`nexaflow-workspace.json`).
- **Original Visual Identity**: Inspired by modern productivity suites like Linear, Raycast, Notion, and Stripe Dashboard with custom dark/light/system theme engines.
- **Strict TypeScript**: 100% strict type safety with zero `any` declarations.
- **Production Code-Splitting**: Route-level dynamic imports with React `Suspense` and bundle optimization.

---

## ✨ Feature Tour

### 1. 📊 Workspace Dashboard (`/dashboard`)
- Dynamic greeting with real-time local date formatting.
- 4 reactive KPI cards (**Total Projects**, **Active Tasks**, **Completed Tasks**, **Overdue Tasks**) calculated directly from Zustand state.
- **Weekly Productivity Area Chart** powered by Recharts with dynamic dark/light theme integration.
- Active Projects grid with milestone progress bars and assigned team avatars.
- Recent Tasks checklist allowing immediate completion toggles and toast notifications.
- Instant Quick Action shortcuts.

### 2. 📁 Projects Explorer & Workspace (`/projects` & `/projects/:projectId`)
- Faceted filtering across Status (`All`, `Active`, `Completed`, `Archived`, `On Hold`) and Priority (`Low`, `Medium`, `High`, `Urgent`).
- Debounced search filter with custom `useDebounce` hook.
- Grid and List view modes.
- Project duplication, archiving, and deletion with confirmation dialogs.
- Project Detail Workspace tabs:
  - **Kanban Board**: 5 columns (`Backlog`, `To Do`, `In Progress`, `Review`, `Done`) with fluid drag-and-drop powered by `@hello-pangea/dnd`.
  - **Task List**: Tabular view of project tasks with bulk selections.
  - **Overview**: Scope description, date milestones, and team allocation cards.

### 3. 📝 Task Details Drawer & Deep Interactivity
- Desktop slide-in right drawer and mobile full-screen sheet.
- Inline title and description auto-saving.
- Dynamic Subtask checklist with live percentage progress bar.
- Frontend-only Attachments UI with file uploads, progress bar simulation, and image preview.
- Commenting stream with author metadata, avatars, and timestamps.
- Activity audit timeline tracking real-time local mutations (status changes, reassignments, completions).

### 4. 📋 Advanced Tasks Data Table (`/tasks`)
- Multi-column sorting (Task name, Status, Priority, Due date).
- Multi-criteria filtering synchronized bidirectionally with URL query parameters (e.g. `/tasks?status=in-progress&priority=high`).
- Custom pagination with configurable rows-per-page (10, 20, 50).
- Row selection with bulk actions bar:
  - Bulk Mark Completed
  - Bulk Delete
  - Clear Selection
- Responsive transformation: switches from high-density table to mobile cards on narrow viewports.

### 5. 📅 Interactive Calendar (`/calendar`)
- **Month**, **Week**, and **Agenda** views.
- Tasks plotted onto specific due dates with priority indicators.
- Click empty dates to create pre-filled tasks.
- Previous / Today / Next date navigation and date presets.

### 6. 📈 Telemetry & Analytics Dashboard (`/analytics`)
- 6 dynamic Recharts visualizations:
  1. *Task Velocity Over Time* (Area chart)
  2. *Tasks by Status Breakdown* (Donut/Pie chart)
  3. *Tasks by Priority Distribution* (Bar chart)
  4. *Project Milestone Progress* (Horizontal Bar chart)
  5. *Team Workload & Throughput* (Composed Bar chart)
  6. *Task Distribution by Project* (Bar chart)
- Dynamic date range filters: `Today`, `7 Days`, `30 Days`, `90 Days`.

### 7. 👥 Team Management (`/team`)
- Teammate cards with avatars, roles, assigned deliverables, and workload progress.
- Workload and capacity bar chart.
- Member search and department filtering (`Engineering`, `Design`, `Product`, `Quality`).
- Teammate Profile Drawer with personal contribution statistics.
- "Invite Member" modal with strict client-side form validation.

### 8. 🎨 UI Component Showcase (`/components`)
- An interactive design system catalog demonstrating 25+ reusable primitives in all visual states:
  - `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `MultiSelect`, `Checkbox`, `Radio`, `Switch`
  - `Badge`, `Avatar`, `Card`, `Tooltip`, `Popover`, `Dropdown`, `Modal`, `Drawer`
  - `Tabs`, `Accordion`, `Toast`, `Alert`, `Progress`, `Skeleton`, `Pagination`, `DatePicker`

### 9. ⚙️ Settings & Data Portability (`/settings`)
- Theme mode selector: `Dark`, `Light`, `System`.
- Layout density toggle: `Comfortable` vs `Compact`.
- Accessibility toggles: `Reduce Motion`, `High Contrast`, `Larger Text`.
- **Export Data**: Instant download of `nexaflow-workspace.json`.
- **Import Data**: Client JSON validation with schema verification and error recovery.
- **Reset Demo Data**: Restore the default 30+ tasks, 6 projects, and 5 team members.

---

## ⌨️ Keyboard Shortcuts

NexaFlow features a global keyboard listener that respects input and form focus:

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> | Open Global Command Palette |
| <kbd>/</kbd> | Search / Command Palette (when not typing in an input) |
| <kbd>N</kbd> | Open New Task modal |
| <kbd>P</kbd> | Open New Project modal |
| <kbd>?</kbd> | Open Keyboard Shortcuts Cheat Sheet |
| <kbd>Esc</kbd> | Dismiss modals, drawers, dropdowns, and overlays |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate Command Palette search results |
| <kbd>Enter</kbd> | Select command or submit dialog |

---

## 🏗️ Architecture & Project Structure

```
d:\comeBack\NexaFlow
├── src/
│   ├── components/
│   │   ├── command/          # Global Command Palette (Ctrl+K)
│   │   ├── common/           # BrandLogo, EmptyState, ConfirmDialog, ShortcutsModal
│   │   ├── layout/           # AppLayout, Navbar, Sidebar, MobileNavDrawer, NotificationCenter
│   │   ├── projects/         # CreateProjectModal
│   │   ├── tasks/            # KanbanBoard, KanbanColumn, KanbanCard, TaskDetailsDrawer, Subtasks, etc.
│   │   └── ui/               # 25+ Reusable Design System Primitives
│   ├── data/                 # Rich initial seed data (30+ tasks, 6 projects, 5 members)
│   ├── hooks/                # useDebounce, useLocalStorage, useMediaQuery, useKeyboardShortcut, etc.
│   ├── pages/                # LandingPage, DashboardPage, ProjectsPage, TasksPage, Calendar, Analytics, etc.
│   ├── store/                # Zustand workspaceStore.ts & toastStore.ts
│   ├── styles/               # index.css with Tailwind tokens, scrollbars, and a11y classes
│   ├── types/                # Strict TypeScript models (Project, Task, Subtask, Comment, Member, etc.)
│   ├── App.tsx               # Route-level code-splitting with React.lazy & Suspense
│   └── main.tsx              # Application bootstrap with React 19 StrictMode
├── public/
│   └── favicon.svg           # Geometric SVG favicon
├── tailwind.config.js        # Theme tokens, font families, custom animations
├── vercel.json               # SPA routing rewrite for Vercel deployment
└── package.json
```

---

## 🛠️ Getting Started Locally

NexaFlow works out-of-the-box with zero environment variables and zero external server requirements.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yourusername/nexaflow.git
cd nexaflow
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates optimized, code-split production bundles in `dist/`.

---

## 🌐 Vercel Deployment

The application is configured with `vercel.json` for seamless client-side single page app (SPA) routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Deploy instantly to Vercel:
```bash
npx vercel
```
Direct URLs such as `/dashboard`, `/projects`, `/tasks`, `/calendar`, `/analytics`, `/team`, and `/components` work automatically without server errors or 404s.

---

## 📄 License

MIT © 2026 NexaFlow. Built for frontend engineering excellence.
