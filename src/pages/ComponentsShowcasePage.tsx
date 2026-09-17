import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Trash2,
  Settings,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { MultiSelect } from '../components/ui/MultiSelect';
import { Checkbox } from '../components/ui/Checkbox';
import { Radio } from '../components/ui/Radio';
import { Switch } from '../components/ui/Switch';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Tooltip } from '../components/ui/Tooltip';
import { Popover } from '../components/ui/Popover';
import { Dropdown } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Tabs } from '../components/ui/Tabs';
import { Accordion } from '../components/ui/Accordion';
import { Alert } from '../components/ui/Alert';
import { Progress } from '../components/ui/Progress';
import { Skeleton } from '../components/ui/Skeleton';
import { Pagination } from '../components/ui/Pagination';
import { DatePicker } from '../components/ui/DatePicker';
import { useToast } from '../hooks/useToast';

export const ComponentsShowcasePage: React.FC = () => {
  const toast = useToast();

  // Interactive state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'right' | 'left' | 'bottom'>('right');
  const [activeTab, setActiveTab] = useState('tab1');
  const [activePillTab, setActivePillTab] = useState('overview');
  const [selectedRadio, setSelectedRadio] = useState('opt1');
  const [checkedCheckbox, setCheckedCheckbox] = useState(true);
  const [switchState, setSwitchState] = useState(true);
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['react', 'typescript']);
  const [demoDate, setDemoDate] = useState('2026-10-15');
  const [demoPage, setDemoPage] = useState(1);
  const [progressVal, setProgressVal] = useState(65);

  const accordionItems = [
    {
      id: 'acc-1',
      title: 'Accessible Keyboard Interactions',
      content:
        'All primitives implement ARIA standards with full Tab/Shift+Tab trapping, Enter selection, and Escape key dismissal.',
    },
    {
      id: 'acc-2',
      title: 'Framer Motion Animation Architecture',
      content:
        'Overlays and indicators leverage hardware-accelerated transforms while strictly obeying system prefers-reduced-motion.',
    },
    {
      id: 'acc-3',
      title: 'Design Token System',
      content:
        'Tailwind custom CSS variables dynamically swap between light, dark, and high-contrast modes with zero page flicker.',
    },
  ];

  return (
    <div className="space-y-10 text-left pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Component System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          NexaFlow UI Design System
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          A collection of production-quality, accessible, and strictly-typed React components designed specifically for high-density SaaS workflows.
        </p>
      </div>

      {/* 1. BUTTONS */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          1. Buttons & IconButtons
        </h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Variants</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link Style</Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">States (Loading, Disabled)</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading>Saving Changes</Button>
              <Button variant="secondary" disabled>Disabled State</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Sizes & Icon Buttons (with automatic tooltips)</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small (sm)</Button>
              <Button size="md">Medium (md)</Button>
              <Button size="lg">Large (lg)</Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
              <IconButton icon={<Bell className="w-4 h-4" />} aria-label="Notifications" tooltip="View Notifications" />
              <IconButton icon={<Settings className="w-4 h-4" />} aria-label="Settings" tooltip="Configure Settings" variant="secondary" />
              <IconButton icon={<Trash2 className="w-4 h-4" />} aria-label="Delete" tooltip="Delete item" variant="danger" />
            </div>
          </div>
        </Card>
      </section>

      {/* 2. FORM CONTROLS */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          2. Form Primitives & Validation
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Standard Input"
              placeholder="e.g. alex.morgan@nexaflow.dev"
              helperText="Helper text provides inline guidance"
            />
            <Input
              label="Input with Left Icon"
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search workspaces..."
            />
            <Input
              label="Input with Error State"
              value="invalid email address"
              onChange={() => {}}
              error="Please enter a valid work email."
              required
            />
            <Select
              label="Select Menu"
              options={[
                { value: 'opt1', label: 'Production Environment' },
                { value: 'opt2', label: 'Staging Environment' },
                { value: 'opt3', label: 'Local Development' },
              ]}
            />
            <DatePicker
              label="DatePicker Preset Picker"
              value={demoDate}
              onChange={setDemoDate}
            />
            <MultiSelect
              label="MultiSelect with Tag Pills"
              options={[
                { value: 'react', label: 'React 19' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'tailwind', label: 'Tailwind CSS' },
                { value: 'zustand', label: 'Zustand' },
              ]}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Rich Textarea"
                placeholder="Write release notes, technical specs, or sprint documentation..."
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                Checkboxes
              </span>
              <div className="space-y-2">
                <Checkbox
                  label="Checked state"
                  checked={checkedCheckbox}
                  onChange={(e) => setCheckedCheckbox(e.target.checked)}
                />
                <Checkbox label="Indeterminate" indeterminate />
                <Checkbox label="Disabled option" disabled />
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                Radio Buttons
              </span>
              <div className="space-y-2">
                <Radio
                  name="demo-radio"
                  label="Option A (Selected)"
                  checked={selectedRadio === 'opt1'}
                  onChange={() => setSelectedRadio('opt1')}
                />
                <Radio
                  name="demo-radio"
                  label="Option B"
                  checked={selectedRadio === 'opt2'}
                  onChange={() => setSelectedRadio('opt2')}
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                Toggle Switches
              </span>
              <div className="space-y-3">
                <Switch
                  label="Active toggle"
                  checked={switchState}
                  onChange={(e) => setSwitchState(e.target.checked)}
                />
                <Switch label="Disabled switch" disabled />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. BADGES & AVATARS */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          3. Badges, Indicators & Avatars
        </h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Semantic Badges</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="brand" dot>Brand Feature</Badge>
              <Badge variant="success" dot>Completed</Badge>
              <Badge variant="warning" dot>Review Required</Badge>
              <Badge variant="danger" dot>Urgent Priority</Badge>
              <Badge variant="info">In Progress</Badge>
              <Badge variant="neutral">Archived</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Avatar Sizes & Status Badges</span>
            <div className="flex items-center gap-4">
              <Avatar size="xs" name="Alex Morgan" status="online" />
              <Avatar size="sm" name="Sarah Chen" status="busy" />
              <Avatar size="md" name="Rahul Sharma" status="away" />
              <Avatar size="lg" name="Emily Davis" status="offline" />
              <Avatar size="xl" name="Daniel Wilson" status="online" />
            </div>
          </div>
        </Card>
      </section>

      {/* 4. OVERLAYS: MODAL, DRAWER, POPOVER, DROPDOWN */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          4. Overlays & Dialogs (Animated)
        </h2>
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={() => setDemoModalOpen(true)}
            >
              Open Modal Dialog
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setDrawerPosition('right');
                setDemoDrawerOpen(true);
              }}
            >
              Open Right Drawer
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setDrawerPosition('bottom');
                setDemoDrawerOpen(true);
              }}
            >
              Open Bottom Sheet
            </Button>

            <Popover
              trigger={<Button variant="outline">Open Popover</Button>}
              content={
                <div className="p-2 space-y-2 max-w-xs text-xs">
                  <p className="font-semibold">Quick Popover Info</p>
                  <p className="text-slate-500 leading-relaxed">
                    This popover is rendered with click-outside dismissal and animated entrance.
                  </p>
                </div>
              }
            />

            <Dropdown
              trigger={<Button variant="outline">Open Dropdown Menu</Button>}
              items={[
                { key: 'act1', label: 'Edit Properties' },
                { key: 'act2', label: 'Duplicate Item' },
                { key: 'act3', label: 'Delete Item', danger: true, dividerBefore: true },
              ]}
            />

            <Tooltip content="Custom floating tooltip with micro-animation">
              <Button variant="ghost">Hover for Tooltip</Button>
            </Tooltip>
          </div>
        </Card>
      </section>

      {/* 5. TOASTS & ALERTS */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          5. Toasts & Feedback Alerts
        </h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Trigger Toast Notifications</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.success('Task marked as completed successfully.')}
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.error('Failed to connect to local store.')}
              >
                Trigger Error Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.warning('Task is due in less than 24 hours.')}
              >
                Trigger Warning Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.info('New team member joined your workspace.')}
              >
                Trigger Info Toast
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-medium text-slate-400">Inline Alerts</span>
            <Alert type="info" title="Zero Backend Architecture">
              NexaFlow runs entirely inside the browser using Zustand state synchronization and localStorage persistence.
            </Alert>
            <Alert type="success" title="Changes Saved">
              All project modifications and task movements are saved immediately.
            </Alert>
            <Alert type="warning" title="Approaching Milestone Due Date">
              Website Redesign project is scheduled for completion within 7 days.
            </Alert>
          </div>
        </Card>
      </section>

      {/* 6. TABS & ACCORDION */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          6. Tabs & Accordion
        </h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-medium text-slate-400">Underline Tabs Variant</span>
            <Tabs
              tabs={[
                { id: 'tab1', label: 'Board View', count: 12 },
                { id: 'tab2', label: 'List View', count: 8 },
                { id: 'tab3', label: 'Activity Logs' },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-medium text-slate-400">Pills Tabs Variant (Smooth Spring Animation)</span>
            <Tabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'telemetry', label: 'Telemetry' },
                { id: 'security', label: 'Security' },
              ]}
              activeTab={activePillTab}
              onChange={setActivePillTab}
              variant="pills"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-400">Smooth Animated Accordion</span>
            <Accordion items={accordionItems} allowMultiple />
          </div>
        </Card>
      </section>

      {/* 7. PROGRESS, SKELETONS & PAGINATION */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-brand-600 dark:text-brand-400">
          7. Progress, Skeletons & Pagination
        </h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Interactive Progress Bar ({progressVal}%)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setProgressVal((p) => Math.max(0, p - 15))}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs"
                >
                  -15%
                </button>
                <button
                  type="button"
                  onClick={() => setProgressVal((p) => Math.min(100, p + 15))}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs"
                >
                  +15%
                </button>
              </div>
            </div>
            <Progress value={progressVal} showLabel size="md" />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-400">Pulse Shimmer Skeletons (Loading States)</span>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-1.5 flex-1">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
              <Skeleton variant="rounded" height={60} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-400 block mb-2">Pagination Controls</span>
            <Pagination
              currentPage={demoPage}
              totalPages={5}
              totalItems={48}
              pageSize={10}
              onPageChange={setDemoPage}
            />
          </div>
        </Card>
      </section>

      {/* Demo Modal */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="Interactive Modal Component"
        description="Features animated entrance, focus trapping, Escape key handling, and background blur."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setDemoModalOpen(false)}>
              Save & Close
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          This modal demonstrates high-fidelity backdrop blur, click-outside dismissal, and accessible keyboard escape handling.
        </p>
      </Modal>

      {/* Demo Drawer */}
      <Drawer
        isOpen={demoDrawerOpen}
        onClose={() => setDemoDrawerOpen(false)}
        position={drawerPosition}
        size="md"
        title="Slide-Out Drawer Component"
        description={`Rendered on the ${drawerPosition} side of the viewport.`}
      >
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
          <p>
            Supports right, left, and bottom positions with full-screen mobile responsiveness.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setDemoDrawerOpen(false)}>
            Close Drawer
          </Button>
        </div>
      </Drawer>
    </div>
  );
};
