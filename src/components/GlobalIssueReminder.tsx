import React from 'react';
import { Globe, AlertCircle, CheckCircle2, BellRing, Sparkles } from 'lucide-react';

interface GlobalIssueReminderProps {
  globalIssue: string;
  globalIssueField: string;
  isCheckinAlertActive: boolean;
  onDismissCheckinAlert: () => void;
  secondsUntilNextCheckin: number;
  currentSegmentTitle: string;
}

export const GlobalIssueReminder: React.FC<GlobalIssueReminderProps> = ({
  globalIssue,
  globalIssueField,
  isCheckinAlertActive,
  onDismissCheckinAlert,
  secondsUntilNextCheckin,
  currentSegmentTitle,
}) => {
  return (
    <div className="w-full">
      {/* Active Check-In Popup Alert Banner */}
      {isCheckinAlertActive && (
        <div className="mb-4 rounded-xl border border-amber-400 dark:border-amber-500/50 bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/20 dark:via-orange-500/15 dark:to-amber-500/20 p-4 shadow-lg backdrop-blur-md animate-pulse-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md">
                <BellRing className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-amber-950 dark:text-amber-200 text-sm tracking-wide">
                    GLOBAL ISSUE CHECK-IN!
                  </span>
                  <span className="text-[11px] text-amber-800 dark:text-amber-300/80 font-medium">· Current: {currentSegmentTitle}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                  Are you connecting your current point directly to your Global Issue: <strong className="text-amber-900 dark:text-amber-300">"{globalIssue}"</strong>?
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-800 dark:text-amber-200/70 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>IB Rule: Keep texts independent—do NOT compare extracts directly!</span>
                </div>
              </div>
            </div>

            <button
              onClick={onDismissCheckinAlert}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-all whitespace-nowrap self-start sm:self-center"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Connected to GI ✓</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Global Issue Anchor Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-3.5 backdrop-blur-sm shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-start md:items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
              <Globe className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Target Global Issue</span>
                <span aria-hidden="true">·</span>
                <span className="truncate font-medium">{globalIssueField}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-2xl" title={globalIssue}>
                {globalIssue || 'Enter your Global Issue in 10-Bullet Plan & Form...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 self-end md:self-center">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-950/70 px-2.5 py-1 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
              <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span>Next check-in in <span className="font-mono-nums font-bold text-amber-700 dark:text-amber-300">{secondsUntilNextCheckin}s</span></span>
            </div>
            <div className="hidden xl:flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-400/90 font-medium">
              <span>⚖️ No text comparison</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
