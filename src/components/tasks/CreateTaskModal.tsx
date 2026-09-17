import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { MultiSelect } from '../ui/MultiSelect';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Priority, TaskStatus } from '../../types';

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
  defaultDueDate?: string;
}

interface CreateTaskFormProps {
  onClose: () => void;
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
  defaultDueDate?: string;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onClose,
  defaultProjectId,
  defaultStatus = 'todo',
  defaultDueDate = '',
}) => {
  const { projects, members, createTask } = useWorkspaceStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState(members[0]?.id || '');
  const [dueDate, setDueDate] = useState(() => {
    if (defaultDueDate) return defaultDueDate;
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [labels, setLabels] = useState<string[]>(['Frontend']);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableLabels = [
    { value: 'Frontend', label: 'Frontend' },
    { value: 'UI', label: 'UI' },
    { value: 'UX', label: 'UX' },
    { value: 'Design', label: 'Design' },
    { value: 'Accessibility', label: 'Accessibility' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Backend', label: 'Backend' },
    { value: 'QA', label: 'QA' },
  ];

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({
      value: m.id,
      label: m.name,
    })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      createTask({
        title: title.trim(),
        description: description.trim(),
        projectId: projectId || projects[0]?.id || 'proj-1',
        status,
        priority,
        assigneeId,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        labels,
      });

      setIsLoading(false);
      onClose();
    }, 250);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <Input
        label="Task Title"
        required
        placeholder="e.g. Implement accessible color tokens"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError('');
        }}
        error={error}
      />

      <Textarea
        label="Description"
        placeholder="Details, acceptance criteria, or context..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Project"
          required
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={projectOptions}
        />

        <Select
          label="Workflow Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={[
            { value: 'backlog', label: 'Backlog' },
            { value: 'todo', label: 'To Do' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'review', label: 'Review' },
            { value: 'done', label: 'Done' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]}
        />

        <Select
          label="Assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          options={memberOptions}
        />
      </div>

      <DatePicker
        label="Due Date"
        value={dueDate}
        onChange={setDueDate}
      />

      <MultiSelect
        label="Labels & Tags"
        options={availableLabels}
        value={labels}
        onChange={setLabels}
        placeholder="Select labels..."
      />

      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
          Create Task
        </Button>
      </div>
    </form>
  );
};

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
  defaultStatus = 'todo',
  defaultDueDate = '',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Create New Task"
      description="Add a new task to your project workflow with assignees and milestones."
    >
      {isOpen && (
        <CreateTaskForm
          key={`${defaultProjectId || 'default'}-${defaultStatus}-${defaultDueDate}`}
          onClose={onClose}
          defaultProjectId={defaultProjectId}
          defaultStatus={defaultStatus}
          defaultDueDate={defaultDueDate}
        />
      )}
    </Modal>
  );
};

