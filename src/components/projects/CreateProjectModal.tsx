import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { MultiSelect } from '../ui/MultiSelect';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Priority, ProjectStatus } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, members } = useWorkspaceStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['Frontend']);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([members[0]?.id || 'mem-1']);
  const [color, setColor] = useState('#6366f1');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const availableLabels = [
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Performance', label: 'Performance' },
    { value: 'SEO', label: 'SEO' },
    { value: 'Engineering', label: 'Engineering' },
  ];

  const memberOptions = members.map((m) => ({
    value: m.id,
    label: `${m.name} (${m.role})`,
  }));

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters.';
    }

    if (dueDate && startDate && dueDate < startDate) {
      newErrors.dueDate = 'Due date cannot be earlier than the start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      createProject({
        name: name.trim(),
        description: description.trim(),
        status,
        priority,
        startDate: startDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        color,
        icon: 'FolderKanban',
        memberIds: selectedMembers,
        labels: selectedLabels,
      });

      setIsLoading(false);
      // Reset form
      setName('');
      setDescription('');
      setStatus('active');
      setPriority('medium');
      setDueDate('');
      setErrors({});
      onClose();
    }, 300);
  };

  const colors = [
    '#6366f1', // indigo
    '#3b82f6', // blue
    '#0ea5e9', // sky
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ec4899', // pink
    '#8b5cf6', // purple
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Create New Project"
      description="Start a new workspace project with defined milestones and team assignees."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Project Name"
          required
          placeholder="e.g. NextGen Web App"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
        />

        <Textarea
          label="Description"
          placeholder="Briefly describe the purpose, goals, and scope of this project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'completed', label: 'Completed' },
            ]}
          />

          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />

          <DatePicker
            label="Target Due Date"
            value={dueDate}
            onChange={(d) => {
              setDueDate(d);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
            }}
            error={errors.dueDate}
          />
        </div>

        <MultiSelect
          label="Team Members"
          options={memberOptions}
          value={selectedMembers}
          onChange={setSelectedMembers}
          placeholder="Assign team members..."
        />

        <MultiSelect
          label="Labels & Tags"
          options={availableLabels}
          value={selectedLabels}
          onChange={setSelectedLabels}
          placeholder="Add tags..."
        />

        {/* Color picker */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Project Color Accent
          </label>
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-slate-700 scale-110' : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
