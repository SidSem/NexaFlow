import React, { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';
import { Comment } from '../../types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments }) => {
  const { createComment, deleteComment, members } = useWorkspaceStore();
  const [text, setText] = useState('');
  const currentUser = members[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    createComment(taskId, text.trim());
    setText('');
  };

  const formatCommentDate = (iso: string) => {
    try {
      return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Comments</span>
          <span className="text-[11px] font-mono text-slate-400">
            ({comments.length})
          </span>
        </h4>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No comments yet. Start the conversation below.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs group"
            >
              <Avatar
                src={comment.authorAvatar}
                name={comment.authorName}
                size="sm"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {comment.authorName}
                    </span>
                    {comment.authorRole && (
                      <span className="text-[10px] text-slate-400 truncate">
                        • {comment.authorRole}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {formatCommentDate(comment.createdAt)}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>

              <IconButton
                icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />}
                aria-label="Delete comment"
                size="xs"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteComment(taskId, comment.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-2.5 pt-2">
        <Avatar
          src={currentUser?.avatar}
          name={currentUser?.name}
          size="sm"
        />
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
            placeholder="Write a comment... (Ctrl+Enter to send)"
            rows={2}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 pr-9 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="absolute right-2 bottom-3 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 transition-colors"
            title="Send comment"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
