import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import { Task, TaskStatus } from '../../types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskDetailsDrawer } from './TaskDetailsDrawer';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { CreateTaskModal } from './CreateTaskModal';

interface KanbanBoardProps {
  tasks: Task[];
  projectId?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, projectId }) => {
  const { moveTask, deleteTask } = useWorkspaceStore();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>('todo');

  const columns: { status: TaskStatus; title: string }[] = [
    { status: 'backlog', title: 'Backlog' },
    { status: 'todo', title: 'To Do' },
    { status: 'in_progress', title: 'In Progress' },
    { status: 'review', title: 'Review' },
    { status: 'done', title: 'Done' },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;

    // Trigger celebratory confetti if moved to done
    if (newStatus === 'done' && source.droppableId !== 'done') {
      try {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe fallback
      }
    }

    moveTask(draggableId, newStatus);
  };

  const handleAddTask = (status: TaskStatus) => {
    setCreateTaskStatus(status);
    setIsCreateModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 px-1 flex-1">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.status);

            return (
              <KanbanColumn
                key={col.status}
                status={col.status}
                title={col.title}
                tasks={columnTasks}
                onOpenDetails={(id) => setActiveTaskId(id)}
                onDeleteTask={(id) => setDeletingTaskId(id)}
                onAddTask={handleAddTask}
              />
            );
          })}
        </div>
      </DragDropContext>

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        taskId={activeTaskId}
        isOpen={!!activeTaskId}
        onClose={() => setActiveTaskId(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultProjectId={projectId}
        defaultStatus={createTaskStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task from the board?"
        confirmLabel="Delete Task"
        danger
      />
    </div>
  );
};
