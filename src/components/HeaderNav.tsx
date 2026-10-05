import React from 'react';
import { Clock, LayoutGrid, Milestone, Eye, FileText, BookOpen, RotateCcw, Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

export type ActiveTab = 'quadrant' | 'chevron' | 'focus' | 'outline' | 'rubric';

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetTimer: () => void;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onResetTimer,
  totalElapsedSeconds,
  totalDurationSeconds,
  isRunning,
  theme,
  onToggleTheme,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const remaining = Math.max(0, totalDurationSeconds - totalElapsedSeconds);
  const isOvertime = totalElapsedSeconds > totalDurationSeconds;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm dark:shadow-slate-950/50 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        
        {/* Zone 1: Pinned App Title and Wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-sm shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display text-sm sm:text-base lg:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                IB Literature Oral Timer
              </span>
              <span className="hidden xl:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                10-Min IO
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate hidden sm:block">
              Language A: Literature
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation views with dynamic responsive labels */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 p-1 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('quadrant')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'quadrant'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60 font-medium'
            }`}
            title="4-Quadrant Balanced Visual Layout (Thumbnail Mode)"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Quadrant View</span>
            <span className="lg:hidden">Quadrant</span>
          </button>

          <button
            onClick={() => setActiveTab('chevron')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'chevron'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60 font-medium'
            }`}
            title="Philpot Education Outline Method 1 (Chevron Flow)"
          >
            <Milestone className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Chevron Flow</span>
            <span className="lg:hidden">Chevron</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'focus'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60 font-medium'
            }`}
            title="Full Screen Practice & Recording Stage"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Focus Rehearsal</span>
            <span className="lg:hidden">Focus</span>
          </button>

          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'outline'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60 font-medium'
            }`}
            title="IB 10-Bullet Master Plan & Form (CSV Import/Export & Timer Source)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">10-Bullet Plan & Form</span>
            <span className="xl:hidden">10-Bullet</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60 font-medium'
            }`}
            title="IB Scoring Criteria A, B, C, D"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Criteria Guide</span>
            <span className="lg:hidden">Rubric</span>
          </button>
        </nav>

        {/* Zone 3: Header Controls (Time readout, Theme Toggle, Reset) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Live Mini Time Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Total:</span>
            <span className={`font-mono-nums font-bold ${isOvertime ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-slate-100'}`}>
              {formatTime(totalElapsedSeconds)} / {formatTime(totalDurationSeconds)}
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className={`text-[11px] font-semibold ${remaining <= 60 && isRunning ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {remaining > 0 ? `${formatTime(remaining)} left` : '10m Cutoff'}
            </span>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Reset Timer */}
          <button
            onClick={onResetTimer}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors shadow-sm"
            title="Reset timer to beginning (Shortcut: R)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('quadrant')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeTab === 'quadrant' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          Quadrant
        </button>
        <button
          onClick={() => setActiveTab('chevron')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeTab === 'chevron' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          Chevron Flow
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeTab === 'focus' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => setActiveTab('outline')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeTab === 'outline' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          10-Bullet
        </button>
        <button
          onClick={() => setActiveTab('rubric')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeTab === 'rubric' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          Rubric
        </button>
      </div>
    </header>
  );
};
