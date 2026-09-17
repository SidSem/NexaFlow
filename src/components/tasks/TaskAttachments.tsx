import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, File, Trash2 } from 'lucide-react';
import { Attachment } from '../../types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { IconButton } from '../ui/IconButton';

interface TaskAttachmentsProps {
  taskId: string;
  attachments: Attachment[];
}

export const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ taskId, attachments }) => {
  const { updateTask } = useWorkspaceStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(null);

      // Create preview object URL if image
      const isImage = file.type.startsWith('image/');
      const objectUrl = isImage ? URL.createObjectURL(file) : undefined;

      const newAttachment: Attachment = {
        id: 'att-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: objectUrl,
        uploadedAt: new Date().toISOString(),
      };

      updateTask(taskId, {
        attachments: [newAttachment, ...attachments],
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 600);
  };

  const handleRemove = (attId: string) => {
    updateTask(taskId, {
      attachments: attachments.filter((a) => a.id !== attId),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-brand-500" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-rose-500" />;
    return <File className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Attachments</span>
          <span className="text-[11px] font-mono text-slate-400">
            ({attachments.length})
          </span>
        </h4>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Simulated Uploading Bar */}
      {uploadProgress !== null && (
        <div className="p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium text-brand-700 dark:text-brand-300">
            <span>Simulating local file upload...</span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-brand-200 dark:bg-brand-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Attachments list */}
      <div className="space-y-2">
        {attachments.length === 0 && uploadProgress === null ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors"
          >
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Drag files here or click to browse
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              PNG, JPG, PDF, TXT supported (frontend demo storage)
            </p>
          </div>
        ) : (
          attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Thumbnail if image */}
                {att.url && att.type.startsWith('image/') ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100">
                    <img
                      src={att.url}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(att.type)}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate leading-tight">
                    {att.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatFileSize(att.size)} • {att.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </p>
                </div>
              </div>

              <IconButton
                icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />}
                aria-label="Remove attachment"
                size="xs"
                variant="ghost"
                onClick={() => handleRemove(att.id)}
              />
            </div>
          ))
        )}
      </div>

      <p className="text-[10px] text-slate-400 italic">
        * Files are stored locally for this demo.
      </p>
    </div>
  );
};
