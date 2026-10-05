import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, MessageSquare, Bell, RotateCcw, AlertTriangle } from 'lucide-react';
import { Segment } from '../types';

interface TimerControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onPrevSegment: () => void;
  onNextSegment: () => void;
  onReset: () => void;
  currentSegment: Segment;
  segmentIndex: number;
  totalSegments: number;
  segmentElapsedSeconds: number;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceSpeechEnabled: boolean;
  onToggleVoice: () => void;
  onManualGIPing: () => void;
  includeDiscussion: boolean;
  onToggleDiscussion: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onTogglePlay,
  onPrevSegment,
  onNextSegment,
  onReset,
  currentSegment,
  segmentIndex,
  totalSegments,
  segmentElapsedSeconds,
  totalElapsedSeconds,
  totalDurationSeconds,
  soundEnabled,
  onToggleSound,
  voiceSpeechEnabled,
  onToggleVoice,
  onManualGIPing,
  includeDiscussion,
  onToggleDiscussion,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const segmentRemaining = Math.max(0, currentSegment.durationSeconds - segmentElapsedSeconds);
  const segmentProgressPercent = Math.min(100, Math.round((segmentElapsedSeconds / currentSegment.durationSeconds) * 100));

  const totalRemaining = Math.max(0, totalDurationSeconds - totalElapsedSeconds);
  const totalProgressPercent = Math.min(100, Math.round((totalElapsedSeconds / totalDurationSeconds) * 100));

  // Strict 10-minute indicator
  const isOvertime = totalElapsedSeconds > 600 && !includeDiscussion;
  const isCloseToTenMin = totalElapsedSeconds >= 540 && totalElapsedSeconds <= 600; // 9:00 - 10:00

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl backdrop-blur-md transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* Left block: Current Segment Info & Time */}
        <div className="flex items-center gap-4 min-w-[280px]">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {/* Circular progress ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-200 dark:text-slate-800"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 - (163.3 * segmentProgressPercent) / 100}
                className={segmentRemaining <= 30 && isRunning ? 'text-rose-500 transition-all duration-300' : 'text-amber-500 transition-all duration-300'}
                fill="none"
              />
            </svg>
            <span className="font-mono-nums text-sm font-bold text-slate-900 dark:text-white z-10">
              {currentSegment.orderNumber}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Segment {segmentIndex + 1} of {totalSegments}
              </span>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono-nums font-semibold">
                Target: {formatTime(currentSegment.durationSeconds)}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {currentSegment.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Remaining in segment:</span>
              <span className={`font-mono-nums font-bold text-sm ${segmentRemaining <= 30 && isRunning ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-slate-100'}`}>
                {formatTime(segmentRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Center block: Main Playback Controls */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevSegment}
              disabled={segmentIndex === 0}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-300 dark:border-slate-700 shadow-sm"
              title="Previous segment (Left Arrow)"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 ${
                isRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
              title="Play/Pause timer (Spacebar)"
            >
              {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </button>

            <button
              onClick={onNextSegment}
              disabled={segmentIndex >= totalSegments - 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-300 dark:border-slate-700 shadow-sm"
              title="Next segment (Right Arrow)"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <button
              onClick={onReset}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-300 dark:border-slate-800"
              title="Reset Timer (R)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] border border-slate-300 dark:border-slate-700">Space</kbd> to {isRunning ? 'Pause' : 'Start'}</span>
            <span className="mx-1.5">·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] border border-slate-300 dark:border-slate-700">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] border border-slate-300 dark:border-slate-700">→</kbd> to Switch</span>
          </div>
        </div>

        {/* Right block: Total Oral Timer & Auxiliary Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end justify-between gap-3">
          <div>
            <div className="flex items-center justify-end gap-2 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Total Oral Timer:</span>
              <span className={`font-mono-nums font-bold text-lg ${
                isOvertime 
                  ? 'text-rose-600 animate-pulse' 
                  : isCloseToTenMin 
                    ? 'text-amber-700 dark:text-amber-400' 
                    : 'text-slate-900 dark:text-white'
              }`}>
                {formatTime(totalElapsedSeconds)}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono-nums font-medium">/ {formatTime(totalDurationSeconds)}</span>
            </div>

            {/* Total progress bar */}
            <div className="w-48 h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOvertime ? 'bg-rose-500' : isCloseToTenMin ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${totalProgressPercent}%` }}
              />
            </div>

            {isOvertime && (
              <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Exceeded 10-Minute IB Oral Limit!</span>
              </div>
            )}
          </div>

          {/* Audio & feature toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={onManualGIPing}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
              title="Trigger Global Issue Check-in Sound/Alert"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>GI Check-in</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg border transition-colors ${
                soundEnabled
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-500 border-slate-300 dark:border-slate-800'
              }`}
              title={soundEnabled ? 'Chimes enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={onToggleVoice}
              className={`p-1.5 rounded-lg border transition-colors ${
                voiceSpeechEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-500 border-slate-300 dark:border-slate-800'
              }`}
              title={voiceSpeechEnabled ? 'Spoken speech prompts enabled' : 'Speech cues off'}
            >
              <MessageSquare className="h-4 w-4" />
            </button>

            <button
              onClick={onToggleDiscussion}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                includeDiscussion
                  ? 'bg-purple-50 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 font-bold'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
              title="Add 5-minute teacher Q&A discussion period after 10m"
            >
              <span>+5m Q&A</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
