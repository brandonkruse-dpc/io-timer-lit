import React, { useState } from 'react';
import { Segment, StudentIOData, WorkMetadata } from '../types';
import { TEMPLATE_PRESETS } from '../utils/templates';
import { BookOpen, Sparkles, CheckCircle, ShieldAlert, Edit3, ChevronDown, ChevronUp, ArrowLeftRight, Play, Pause, Languages, BookCheck } from 'lucide-react';

interface QuadrantCanvasProps {
  segments: Segment[];
  activeSegmentIndex: number;
  onSelectSegment: (index: number) => void;
  segmentElapsedSeconds: number;
  isRunning: boolean;
  studentData: StudentIOData;
  onUpdateBullet?: (index: number, text: string) => void;
  onUpdateStudentData?: (newData: StudentIOData) => void;
  onSwapAnalysisOrder?: () => void;
  onTogglePlay?: () => void;
}

export const QuadrantCanvas: React.FC<QuadrantCanvasProps> = ({
  segments,
  activeSegmentIndex,
  onSelectSegment,
  segmentElapsedSeconds,
  isRunning,
  studentData,
  onUpdateBullet,
  onUpdateStudentData,
  onSwapAnalysisOrder,
  onTogglePlay,
}) => {
  const [expandedGuidance, setExpandedGuidance] = useState<Record<string, boolean>>({});
  const [editingMetadata, setEditingMetadata] = useState<Record<string, boolean>>({});

  const toggleGuidance = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGuidance((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEditMetadata = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMetadata((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const defaultSegments = TEMPLATE_PRESETS[0].segments;

  // Find segments by role with robust fallback to default template preset
  const introSegment =
    segments.find((s) => s.type === 'intro') ||
    defaultSegments[0];

  const textAWorkSegment =
    segments.find((s) => s.type === 'textA_work') ||
    segments.find((s) => s.type === 'textA_combined') ||
    defaultSegments[1];

  const textAExtractSegment =
    segments.find((s) => s.type === 'textA_extract') ||
    segments.find((s) => s.type === 'textA_combined') ||
    defaultSegments[2];

  const textBWorkSegment =
    segments.find((s) => s.type === 'textB_work') ||
    segments.find((s) => s.type === 'textB_combined') ||
    defaultSegments[3];

  const textBExtractSegment =
    segments.find((s) => s.type === 'textB_extract') ||
    segments.find((s) => s.type === 'textB_combined') ||
    defaultSegments[4];

  const conclusionSegment =
    segments.find((s) => s.type === 'conclusion') ||
    defaultSegments[5];

  const isTranslationFirst = studentData.analysisOrder === 'translation_first';
  const hasPRLWork = studentData.textA?.isOnPRL || studentData.textB?.isOnPRL;

  const renderQuadrantCard = (
    segmentInput: Segment | undefined,
    blockNum: number,
    labelHeader: string,
    subtitleLabel: string,
    workKey: 'textA' | 'textB',
    workMetadata: WorkMetadata,
    bulletIndices: number[],
    bulletLabels: string[],
    bulletPlaceholders: string[],
    positionClass: string,
    icon: React.ReactNode,
    analysisBadge?: string,
  ) => {
    const segment =
      segmentInput ||
      defaultSegments[blockNum === 5 ? 4 : blockNum === 4 ? 3 : blockNum === 3 ? 2 : 1];

    let segIdx = segments.findIndex((s) => s.id === segment.id);
    if (segIdx === -1) {
      segIdx = segments.findIndex((s) => s.type === segment.type);
    }
    if (segIdx === -1) {
      segIdx = segments.findIndex((s) => s.type.startsWith(workKey));
    }

    const isActive = segIdx >= 0 && activeSegmentIndex === segIdx;
    const isCompleted = segIdx >= 0 && activeSegmentIndex > segIdx;
    const remaining = Math.max(0, segment.durationSeconds - (isActive ? segmentElapsedSeconds : 0));
    const percent = isActive
      ? Math.min(100, Math.round((segmentElapsedSeconds / segment.durationSeconds) * 100))
      : isCompleted ? 100 : 0;
    const cardKey = `card_${blockNum}`;
    const showGuidance = !!expandedGuidance[cardKey];
    const isEditingMeta = !!editingMetadata[cardKey];

    return (
      <div
        onClick={() => segIdx >= 0 && onSelectSegment(segIdx)}
        className={`group relative flex flex-col justify-between p-5 transition-all duration-300 cursor-pointer overflow-hidden border shadow-sm ${positionClass} ${
          isActive
            ? 'bg-rose-50/95 dark:bg-rose-950/40 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.2)] ring-1 ring-rose-500/40'
            : isCompleted
              ? 'bg-slate-100/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-90 hover:opacity-100'
              : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
        }`}
      >
        {/* Top bar in card: Number badge and titles */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg font-bold shadow-sm transition-all ${
                  isActive
                    ? 'border-rose-500 bg-rose-500 text-white scale-105'
                    : isCompleted
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200'
                }`}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : blockNum}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    {labelHeader}
                  </span>
                  {analysisBadge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      isTranslationFirst
                        ? workKey === 'textB'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        : workKey === 'textA'
                          ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    }`}>
                      {analysisBadge}
                    </span>
                  )}
                  {workMetadata.isOnPRL && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 flex items-center gap-0.5">
                      <BookCheck className="h-2.5 w-2.5" />
                      PRL
                    </span>
                  )}
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-[11px] font-mono-nums font-semibold text-slate-600 dark:text-slate-400">
                    {Math.round(segment.durationSeconds / 60)} min
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {subtitleLabel}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isActive && onTogglePlay && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlay();
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-600/30 animate-pulse'
                  }`}
                  title={isRunning ? 'Pause oral timer (Space)' : 'Play oral timer (Space)'}
                >
                  {isRunning ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span>{isRunning ? 'Pause' : 'Play'}</span>
                </button>
              )}
              {icon}
            </div>
          </div>

          {/* Student Work details banner (with inline quick edit) */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white truncate">
                <span>{workMetadata.title}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">by {workMetadata.creator}</span>
                {workKey === 'textB' && workMetadata.originalLanguage && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    ({workMetadata.originalLanguage} trans.)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => toggleEditMetadata(cardKey, e)}
                className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-0.5 ml-2 shrink-0"
              >
                <Edit3 className="h-2.5 w-2.5" />
                <span>{isEditingMeta ? 'Done' : 'Edit Text Details'}</span>
              </button>
            </div>

            {isEditingMeta ? (
              <div onClick={(e) => e.stopPropagation()} className="mt-2 space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workMetadata.title}
                    onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                      ...studentData,
                      [workKey]: { ...workMetadata, title: e.target.value }
                    })}
                    placeholder="Work Title"
                    className="w-1/2 p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={workMetadata.creator}
                    onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                      ...studentData,
                      [workKey]: { ...workMetadata, creator: e.target.value }
                    })}
                    placeholder="Author"
                    className="w-1/2 p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workMetadata.extractDetails}
                    onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                      ...studentData,
                      [workKey]: { ...workMetadata, extractDetails: e.target.value }
                    })}
                    placeholder="Extract Details (e.g. Lines 24-65, max 40 lines)"
                    className="flex-1 p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!workMetadata.isOnPRL}
                      onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                        ...studentData,
                        [workKey]: { ...workMetadata, isOnPRL: e.target.checked }
                      })}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span>On PRL</span>
                  </label>
                </div>
              </div>
            ) : (
              workMetadata.extractDetails && (
                <p className="mt-1 text-[11px] text-amber-900 dark:text-amber-300 font-semibold truncate">
                  Extract: {workMetadata.extractDetails}
                </p>
              )
            )}
          </div>

          {/* Synchronized Candidate Bullets for this Quadrant */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Candidate Speaking Points (Editable):
            </span>

            {bulletIndices.map((bIdx, i) => {
              const bulletVal = studentData.bullets[bIdx] || '';
              const wordCount = getWordCount(bulletVal);

              return (
                <div
                  key={bIdx}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">
                      • {bulletLabels[i]}
                    </span>
                    <span className="text-[10px] font-mono-nums text-slate-500 font-semibold">
                      {wordCount} words {wordCount > 25 && <span className="text-rose-600 font-bold ml-1">(too long)</span>}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={bulletVal}
                    onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                    placeholder={bulletPlaceholders[i]}
                    className="w-full bg-slate-50/60 dark:bg-slate-900/40 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-medium leading-relaxed"
                  />
                </div>
              );
            })}
          </div>

          {/* Collapsible Rubric Guidance */}
          <div className="pt-1">
            <button
              type="button"
              onClick={(e) => toggleGuidance(cardKey, e)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
            >
              {showGuidance ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>{showGuidance ? 'Hide Examiner Advice' : 'View Examiner Advice'}</span>
            </button>

            {showGuidance && (
              <div className="mt-2 space-y-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {segment.keyPrompts.map((p, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Timer Card when Active */}
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60">
          {isActive ? (
            <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-950 p-3 shadow-xl text-slate-950 dark:text-white transition-all transform animate-pulse-glow">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Speaking Now · {segment.title}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>{formatMinSec(segmentElapsedSeconds)} elapsed</span>
                </div>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono-nums text-xl sm:text-2xl font-extrabold tracking-tight">
                    {formatMinSec(remaining)}
                  </span>
                  {onTogglePlay && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay();
                      }}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        isRunning
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                      title={isRunning ? 'Pause oral timer' : 'Start / resume timer'}
                    >
                      {isRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                      <span>{isRunning ? 'Pause' : 'Play'}</span>
                    </button>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Target: {Math.round(segment.durationSeconds / 60)} min
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{isCompleted ? 'Completed ✓' : 'Click to jump to quadrant'}</span>
              <span className="font-mono-nums">{formatMinSec(segment.durationSeconds)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCenterPill = (
    segmentInput: Segment | undefined,
    blockNum: number,
    labelHeader: string,
    subtitleLabel: string,
    bulletIndices: number[],
    bulletLabels: string[],
    bulletPlaceholders: string[],
    isTop: boolean,
  ) => {
    const segment = segmentInput || defaultSegments[blockNum === 1 ? 0 : 5];
    let segIdx = segments.findIndex((s) => s.id === segment.id);
    if (segIdx === -1) {
      segIdx = segments.findIndex((s) => s.type === (isTop ? 'intro' : 'conclusion'));
    }
    const isActive = segIdx >= 0 && activeSegmentIndex === segIdx;
    const isCompleted = segIdx >= 0 && activeSegmentIndex > segIdx;
    const remaining = Math.max(0, segment.durationSeconds - (isActive ? segmentElapsedSeconds : 0));
    const percent = isActive
      ? Math.min(100, Math.round((segmentElapsedSeconds / segment.durationSeconds) * 100))
      : isCompleted ? 100 : 0;

    return (
      <div
        onClick={() => segIdx >= 0 && onSelectSegment(segIdx)}
        className={`group relative flex flex-col justify-between p-4 transition-all duration-300 cursor-pointer overflow-hidden border shadow-sm rounded-2xl ${
          isActive
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-lg z-20 ring-1 ring-rose-500/40'
            : isCompleted
              ? 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
              : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-bold shadow-sm ${
                isActive
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200'
              }`}
            >
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : blockNum}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <span>{labelHeader}</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="font-mono-nums font-semibold text-slate-600 dark:text-slate-400">1 min</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{subtitleLabel}</h4>
            </div>

            {isActive && onTogglePlay && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlay();
                }}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-600/30 animate-pulse'
                }`}
                title={isRunning ? 'Pause oral timer' : 'Start oral timer'}
              >
                {isRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                <span>{isRunning ? 'Pause' : 'Play'}</span>
              </button>
            )}
          </div>

          {/* Editable bullets for Intro or Conclusion */}
          <div className="space-y-2">
            {bulletIndices.map((bIdx, i) => {
              const bulletVal = studentData.bullets[bIdx] || '';
              const wordCount = getWordCount(bulletVal);

              return (
                <div
                  key={bIdx}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-2 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                      • {bulletLabels[i]}
                    </span>
                    <span className="text-[9px] font-mono-nums text-slate-500 font-semibold">
                      {wordCount}w
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={bulletVal}
                    onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                    placeholder={bulletPlaceholders[i]}
                    className="w-full bg-slate-50/70 dark:bg-slate-900/40 p-1.5 rounded border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none font-medium leading-snug"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Active mini timer */}
        {isActive && (
          <div className="mt-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-950 dark:text-white shadow-md animate-pulse-glow">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">Active</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-nums font-extrabold text-sm">
                  {formatMinSec(remaining)}
                </span>
                {onTogglePlay && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlay();
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all shadow-xs ${
                      isRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                    }`}
                    title={isRunning ? 'Pause timer' : 'Start timer'}
                  >
                    {isRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                    <span>{isRunning ? 'Pause' : 'Play'}</span>
                  </button>
                )}
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 mt-1.5 overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* PRL Rule Reminder Warning Banner if neither text marked on PRL */}
      {!hasPRLWork && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 p-3.5 flex items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-200 shadow-sm">
          <div className="flex items-center gap-2">
            <BookCheck className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              <strong>IB Literature Rule Reminder:</strong> At least one of your two literary works <em>must</em> be from the IB Prescribed Reading List (PRL). Make sure to mark at least one work as on the PRL in your plan!
            </span>
          </div>
        </div>
      )}

      {/* Visual Canvas Container - 4 Quadrants + Center Pill */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 p-3 sm:p-5 backdrop-blur-md shadow-xl dark:shadow-2xl transition-colors">

        {/* 50/50 Balance Indicator Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-700 dark:text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 dark:text-slate-200">IB Balance Check:</span>
            {isTranslationFirst ? (
              <>
                <span className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-emerald-900 dark:text-emerald-300 font-mono-nums border border-emerald-200 dark:border-emerald-500/20 font-bold">
                  1st: Work in Translation (~4m)
                </span>
                <span className="text-slate-400 dark:text-slate-600">→</span>
                <span className="rounded-lg bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-blue-900 dark:text-blue-300 font-mono-nums border border-blue-200 dark:border-blue-500/20 font-bold">
                  2nd: Original Lit Work (~4m)
                </span>
              </>
            ) : (
              <>
                <span className="rounded-lg bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-blue-900 dark:text-blue-300 font-mono-nums border border-blue-200 dark:border-blue-500/20 font-bold">
                  1st: Original Lit Work (~4m)
                </span>
                <span className="text-slate-400 dark:text-slate-600">→</span>
                <span className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-emerald-900 dark:text-emerald-300 font-mono-nums border border-emerald-200 dark:border-emerald-500/20 font-bold">
                  2nd: Work in Translation (~4m)
                </span>
              </>
            )}
            <span className="text-slate-400 dark:text-slate-600">+</span>
            <span className="rounded-lg bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-amber-900 dark:text-amber-300 font-mono-nums border border-amber-200 dark:border-amber-500/20 font-bold">
              Intro & Concl: ~2m
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
              <span className="text-[11px] font-medium hidden sm:inline">Equal weight required</span>
            </div>
            {onSwapAnalysisOrder && (
              <button
                type="button"
                onClick={onSwapAnalysisOrder}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 text-xs font-bold transition-colors shadow-xs"
                title="Swap order of analysis: Analyze other category first"
              >
                <ArrowLeftRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span>Order: {isTranslationFirst ? 'Translation First ⇄' : 'Original First ⇄'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: 3 columns on large screens (Left Quadrants, Center Column, Right Quadrants) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px_1fr] gap-4 relative">

          {/* Left Column: TEXT A (Literary - Original Language) */}
          <div className="flex flex-col gap-4">
            {renderQuadrantCard(
              textAWorkSegment,
              2,
              'TEXT A: Overall Literary Work',
              'Macro Techniques, Structure & Themes',
              'textA',
              studentData.textA,
              isTranslationFirst ? [5] : [2],
              [isTranslationFirst ? 'Bullet #6 · Overall Literary Work' : 'Bullet #3 · Overall Literary Work'],
              ['Macro authorial choices, structural patterns, motifs, context, and connection to GI...'],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-blue-500" />,
              isTranslationFirst ? '2nd Analysis (Mins 5–7)' : '1st Analysis (Mins 1–3)',
            )}

            {renderQuadrantCard(
              textAExtractSegment,
              3,
              'TEXT A: Literary Extract (Micro)',
              '1–2 Specific Authorial Choices in Passage',
              'textA',
              studentData.textA,
              isTranslationFirst ? [6, 7] : [3, 4],
              isTranslationFirst
                ? ['Bullet #7 · Extract Choice 1', 'Bullet #8 · Extract Choice 2']
                : ['Bullet #4 · Extract Choice 1', 'Bullet #5 · Extract Choice 2'],
              [
                'Close analysis of 1st choice: diction, syntax, figurative language, tone, imagery...',
                'Close analysis of 2nd choice: structural shifts, characterization, effect on reader...',
              ],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-purple-500" />,
              isTranslationFirst ? '2nd Analysis (Mins 7–9)' : '1st Analysis (Mins 3–5)',
            )}
          </div>

          {/* Center Column: 1. Intro (Top) & 6. Conclusion (Bottom) */}
          <div className="flex flex-col justify-between gap-4">
            {renderCenterPill(
              introSegment,
              1,
              '1. Intro',
              'Global Issue & Literary Works',
              [0, 1],
              ['Bullet #1: Global Issue', 'Bullet #2: Works & Thesis'],
              [
                'Define GI and its transnational/local importance...',
                'Thesis: How both literary works explore the GI independently...',
              ],
              true,
            )}

            {/* Central Visual Hub / GI Target Shield */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 border-amber-300/80 dark:border-amber-500/40 bg-gradient-to-b from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-900/80 text-center my-auto shadow-sm">
              <div className="h-8 w-8 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-1.5 shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Independent Anchor
              </span>

              {/* Stated Global Issue in bold font */}
              <div className="my-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-amber-300/90 dark:border-amber-500/40 shadow-xs max-w-[260px] w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                  Global Issue
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-amber-100 leading-snug break-words">
                  “{studentData.globalIssue || 'Enter Global Issue'}”
                </p>
              </div>

              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug max-w-[220px]">
                Both literary works anchor independently to the Global Issue with equal balance.
              </p>
            </div>

            {renderCenterPill(
              conclusionSegment,
              6,
              '6. Conclusion',
              'Value of Each Literary Work’s Presentation',
              [8, 9],
              ['Bullet #9: GI Synthesis', 'Bullet #10: Final Takeaway'],
              [
                'Synthesis: Compare authorial approaches to the GI...',
                'Evaluation: Authorial craft efficacy and enduring human relevance...',
              ],
              false,
            )}
          </div>

          {/* Right Column: TEXT B (Literary - In Translation) */}
          <div className="flex flex-col gap-4">
            {renderQuadrantCard(
              textBWorkSegment,
              4,
              'TEXT B: Overall Work in Translation',
              'Macro Narrative/Poetic Craft across Full Work',
              'textB',
              studentData.textB,
              isTranslationFirst ? [2] : [5],
              [isTranslationFirst ? 'Bullet #3 · Overall Work in Translation' : 'Bullet #6 · Overall Work in Translation'],
              ['Author broader narrative arc, recurring motifs, context, and connection to GI...'],
              'rounded-2xl',
              <Languages className="h-5 w-5 text-emerald-500" />,
              isTranslationFirst ? '1st Analysis (Mins 1–3)' : '2nd Analysis (Mins 5–7)',
            )}

            {renderQuadrantCard(
              textBExtractSegment,
              5,
              'TEXT B: Extract in Translation (Micro)',
              '1–2 Specific Authorial Choices in Passage',
              'textB',
              studentData.textB,
              isTranslationFirst ? [3, 4] : [6, 7],
              isTranslationFirst
                ? ['Bullet #4 · Translation Extract Choice 1', 'Bullet #5 · Translation Extract Choice 2']
                : ['Bullet #7 · Translation Extract Choice 1', 'Bullet #8 · Translation Extract Choice 2'],
              [
                'Micro analysis of 1st choice: diction, figurative language, imagery, tone...',
                'Micro analysis of 2nd choice: narrative voice, structural shifts, effect on reader...',
              ],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-rose-500" />,
              isTranslationFirst ? '1st Analysis (Mins 3–5)' : '2nd Analysis (Mins 7–9)',
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
