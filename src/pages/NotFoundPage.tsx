import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20 shadow-lg shadow-brand-500/10">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
        Error 404
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Looks like this page wandered off.
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        The route you are looking for does not exist or has been moved to another location in the workspace.
      </p>

      <Button
        variant="primary"
        size="md"
        leftIcon={<Home className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};
