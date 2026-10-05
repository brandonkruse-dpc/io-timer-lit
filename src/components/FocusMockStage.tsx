import React, { useState } from 'react';
import { Segment, StudentIOData } from '../types';
import { Play, Pause, SkipForward, SkipBack, Globe, BellRing, Edit3, Check } from 'lucide-react';
import { getBulletIndicesForSegment, getBulletPhaseLabel } from '../utils/templates';

interface FocusMockStageProps {
  currentSegment: Segment;
  segmentIndex: number;
  totalSegments: number;
  segmentElapsedSeconds: number;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onNextSegment: () => void;
  onPrevSegment: () => void;
  studentData: StudentIOData;
  isCheckinAlertActive: boolean;
  onDismissCheckinAlert: () => void;
  onUpdateBullet?: (index: number, text: string) => void;
  onUpdateStudentData?: (newData: StudentIOData) => void;
  onSwapAnalysisOrder?: () => void;
}

export const FocusMockStage: React.FC<FocusMockStageProps> = ({
  currentSegment,
  segmentIndex,
  totalSegments,
  segmentElapsedSeconds,
  totalElapsedSeconds,
  totalDurationSeconds,
  isRunning,
  onTogglePlay,
  onNextSegment,
  onPrevSegment,
  studentData,
  isCheckinAlertActive,
  onDismissCheckinAlert,
  onUpdateBullet,
  onUpdateStudentData,
  onSwapAnalysisOrder,
}) => {
  const [isEditingGI, setIsEditingGI] = useState(false);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const segmentRemaining = Math.max(0, currentSegment.durationSeconds - segmentElapsedSeconds);
  const totalRemaining = Math.max(0, totalDurationSeconds - totalElapsedSeconds);
  const isOvertime = totalElapsedSeconds > 600;
  const isSegmentWarning = segmentRemaining <= 30 && isRunning;

  const handleBulletChange = (idx: number, text: string) => {
    if (onUpdateBullet) {
      onUpdateBullet(idx, text);
    } else if (onUpdateStudentData) {
      const newBullets = [...studentData.bullets];
      while (newBullets.length <= idx) {
        newBullets.push('');
      }
      newBullets[idx] = text;
      onUpdateStudentData({ ...studentData, bullets: newBullets });
    }
  };

  const getWordCount = (str?: string) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  };

  // Get mapped bullet indices for the active rehearsal segment
  const activeBulletIndices = getBulletIndicesForSegment(currentSegment, studentData.analysisOrder);

  return (
    <div className="relative min-h-[620px] w-full flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
      
      {/* Background ambient lighting */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isSegmentWarning ? 'bg-rose-500/15' : isRunning ? 'bg-amber-500/10' : 'bg-slate-300/20 dark:bg-slate-800/10'
      }`} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Top bar: Global Issue Prompter */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
            <Globe className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Target Global Issue
              </span>
              <button
                type="button"
                onClick={() => setIsEditingGI(!isEditingGI)}
                className="text-[10px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-semibold"
              >
                <Edit3 className="h-2.5 w-2.5" />
                <span>{isEditingGI ? 'Done' : 'Edit GI'}</span>
              </button>
            </div>

            {isEditingGI ? (
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={studentData.globalIssue}
                  onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                    ...studentData,
                    globalIssue: e.target.value,
                  })}
                  className="w-full text-xs sm:text-sm p-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => setIsEditingGI(false)}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-bold"
                >
                  <Check className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {studentData.globalIssue}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-600/20 animate-pulse'
            }`}
            title={isRunning ? 'Pause oral timer (Space)' : 'Play / Start oral timer (Space)'}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Play'}</span>
          </button>

          <div className="text-right">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Oral</span>
            <div className={`font-mono-nums font-bold text-lg leading-tight ${isOvertime ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-slate-200'}`}>
              {formatTime(totalElapsedSeconds)} <span className="text-slate-500 dark:text-slate-500 text-sm">/ {formatTime(totalDurationSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active GI Check-in Toast if fired */}
      {isCheckinAlertActive && (
        <div className="relative z-20 my-3 rounded-2xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-500/20 p-4 shadow-xl backdrop-blur-md animate-bounce">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BellRing className="h-6 w-6 text-amber-700 dark:text-amber-300 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-950 dark:text-white text-base">Check-in with Global Issue!</h4>
                <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                  Are you explaining the effects of this technique on the understanding of "{studentData.globalIssue}"?
                </p>
              </div>
            </div>
            <button
              onClick={onDismissCheckinAlert}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors whitespace-nowrap shadow-sm shrink-0"
            >
              Checked In ✓
            </button>
          </div>
        </div>
      )}

      {/* Main Focus Stage: Big Countdown Clock & Synchronized Bullet Editor */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 text-center">
        
        {/* Stage / Segment Phase Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <span>Part {segmentIndex + 1} of {totalSegments}</span>
          <span className="text-slate-400">·</span>
          <span className="font-bold text-slate-900 dark:text-white">{currentSegment.title}</span>
        </div>

        {/* Large Stage Segment Countdown Clock with Play/Pause button */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 my-1">
          <div className={`font-mono-nums font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight transition-colors duration-300 ${
            isSegmentWarning
              ? 'text-rose-600 dark:text-rose-500 animate-pulse'
              : isRunning
                ? 'text-slate-950 dark:text-white'
                : 'text-slate-700 dark:text-slate-400'
          }`}>
            {formatTime(segmentRemaining)}
          </div>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-600/20 animate-pulse'
            }`}
            title={isRunning ? 'Pause rehearsal timer (Space)' : 'Start rehearsal timer (Space)'}
          >
            {isRunning ? (
              <Pause className="h-6 w-6 sm:h-7 sm:w-7 fill-current" />
            ) : (
              <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Segment Subtitle & Target Time */}
        <p className="mt-1 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 max-w-lg">
          {currentSegment.subtitle}
        </p>

        {/* Progress bar */}
        <div className="mt-4 w-full max-w-md h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isSegmentWarning ? 'bg-rose-500' : 'bg-amber-500'
            }`}
            style={{
              width: `${Math.min(100, Math.round((segmentElapsedSeconds / currentSegment.durationSeconds) * 100))}%`,
            }}
          />
        </div>

        {/* Live Speaking Cues from 10-Bullet Plan - INTERACTIVE & EDITABLE */}
        <div className="mt-5 w-full max-w-2xl rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/20 p-4 text-left shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200 dark:border-amber-500/20">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
              Speaking Cues for this Section (Live Editable):
            </span>
            <span className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
              Syncs with 10-Bullet Form
            </span>
          </div>

          {activeBulletIndices.length > 0 ? (
            <div className="space-y-2.5">
              {activeBulletIndices.map((bIdx) => {
                const bulletVal = studentData.bullets[bIdx] || '';
                const wordCount = getWordCount(bulletVal);
                const phaseLabel = getBulletPhaseLabel(bIdx, studentData.analysisOrder);

                return (
                  <div
                    key={bIdx}
                    className="rounded-xl border border-amber-200/80 dark:border-amber-500/30 bg-white dark:bg-slate-900/80 p-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                        • Bullet #{bIdx + 1}: <span className="font-medium text-slate-700 dark:text-slate-300">{phaseLabel}</span>
                      </span>
                      <span className="text-[11px] font-mono-nums text-slate-500 dark:text-slate-400 font-semibold">
                        {wordCount} words {wordCount > 25 && <span className="text-rose-600 font-bold ml-1">(too long)</span>}
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={bulletVal}
                      onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                      placeholder={`Enter speaking cue for Bullet #${bIdx + 1}...`}
                      className="w-full bg-slate-50/60 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-medium leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-400 italic py-1">
              No formal candidate bullets are designated for this follow-up section. Refer back to your extracts and global issue notes during teacher Q&A.
            </p>
          )}
        </div>

      </div>

      {/* Bottom bar: Controls & Rehearsal Bullets */}
      <div className="relative z-10 w-full pt-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Next segment preview */}
        <div className="text-left text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">Coming Up Next:</span>
          <p className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-xs">
            {segmentIndex < totalSegments - 1 ? studentData.customSegments[segmentIndex + 1]?.title : 'Finish & Discussion'}
          </p>
        </div>

        {/* Center transport controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevSegment}
            disabled={segmentIndex === 0}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
            title="Previous (Left Arrow)"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl font-bold shadow-xl transition-all transform active:scale-95 ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isRunning ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </button>

          <button
            onClick={onNextSegment}
            disabled={segmentIndex >= totalSegments - 1}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
            title="Next (Right Arrow)"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="text-right text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium">Oral Countdown:</span>
          <div className="font-mono-nums font-bold text-amber-800 dark:text-amber-300 text-sm">
            {formatTime(totalRemaining)} remaining
          </div>
        </div>

      </div>

    </div>
  );
};
