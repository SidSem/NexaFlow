import React, { useRef } from 'react';
import {
  Moon,
  Sun,
  Laptop,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useTheme } from '../hooks/useTheme';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Badge } from '../components/ui/Badge';
import { WorkspaceData } from '../types';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const {
    projects,
    tasks,
    members,
    notifications,
    preferences,
    updatePreferences,
    resetDemoData,
    importWorkspaceData,
    clearLocalData,
  } = useWorkspaceStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export JSON handler
  const handleExportJSON = () => {
    const exportData: WorkspaceData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      projects,
      tasks,
      members,
      notifications,
      preferences,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'nexaflow-workspace.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importWorkspaceData(parsed);
      } catch (err: any) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl space-y-6 text-left pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your appearance, accessibility controls, layout density, and local workspace data.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Appearance & Theme</CardTitle>
            <CardDescription>
              Choose your theme color mode and interface layout density
            </CardDescription>
          </div>
          <Badge variant="brand" size="sm">
            Active: {theme.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2.5">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs transition-all ${
                  theme === 'dark'
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-semibold ring-1 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs transition-all ${
                  theme === 'light'
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-semibold ring-1 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs transition-all ${
                  theme === 'system'
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-semibold ring-1 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Density & Sidebar Preferences */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Interface Density
                </p>
                <p className="text-[11px] text-slate-500">
                  Switch between comfortable spacing and high-density compact tables
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => updatePreferences({ density: 'comfortable' })}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    preferences.density === 'comfortable'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => updatePreferences({ density: 'compact' })}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    preferences.density === 'compact'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            <div className="py-3">
              <Switch
                label="Collapse Sidebar by Default"
                description="Keep desktop navigation icon-only to maximize screen real estate"
                checked={preferences.sidebarCollapsed}
                onChange={(e) => updatePreferences({ sidebarCollapsed: e.target.checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Accessibility Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Accessibility & Motion</CardTitle>
            <CardDescription>
              Fine-tune contrast, typography scaling, and interface animation settings
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-3">
            <Switch
              label="Reduce Motion"
              description="Disable decorative animations and slide transitions across all views"
              checked={preferences.reduceMotion}
              onChange={(e) => updatePreferences({ reduceMotion: e.target.checked })}
            />
          </div>

          <div className="py-3">
            <Switch
              label="High Contrast Borders"
              description="Elevate border sharpness and contrast ratios for maximum legibility"
              checked={preferences.highContrast}
              onChange={(e) => updatePreferences({ highContrast: e.target.checked })}
            />
          </div>

          <div className="py-3">
            <Switch
              label="Larger Base Typography"
              description="Increase default base font size to 17px for enhanced readability"
              checked={preferences.largerText}
              onChange={(e) => updatePreferences({ largerText: e.target.checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Workspace Data Management (JSON Export & Import) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Client-Side Data Management</CardTitle>
            <CardDescription>
              Export, import, or reset local state. NexaFlow stores 100% of data in your browser.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Local-First Storage Statistics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-500 mt-2 font-mono text-[11px]">
              <div>Projects: <strong className="text-slate-900 dark:text-white">{projects.length}</strong></div>
              <div>Tasks: <strong className="text-slate-900 dark:text-white">{tasks.length}</strong></div>
              <div>Members: <strong className="text-slate-900 dark:text-white">{members.length}</strong></div>
              <div>Notifications: <strong className="text-slate-900 dark:text-white">{notifications.length}</strong></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportJSON}
            >
              Export nexaflow-workspace.json
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Import JSON Workspace
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />

            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={resetDemoData}
            >
              Reset Demo Data
            </Button>

            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={clearLocalData}
            >
              Clear Workspace Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
