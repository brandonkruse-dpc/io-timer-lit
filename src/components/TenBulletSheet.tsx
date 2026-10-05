import React, { useState, useRef } from 'react';
import { StudentIOData, TemplateId } from '../types';
import { TEMPLATE_PRESETS, GLOBAL_ISSUE_FIELDS, saveStudentData, DEFAULT_STUDENT_DATA, getBulletMappingDescription, getBulletPhaseLabel, swapAnalysisOrder, getPresetSegmentsWithOrder } from '../utils/templates';
import { exportPlanToCSV, importPlanFromCSV } from '../utils/csv';
import {
  FileText,
  Printer,
  Download,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sliders,
  BookCheck,
  Languages,
} from 'lucide-react';

interface TenBulletSheetProps {
  studentData: StudentIOData;
  onUpdateStudentData: (newData: StudentIOData) => void;
  onResetTimer?: () => void;
}

export const TenBulletSheet: React.FC<TenBulletSheetProps> = ({
  studentData,
  onUpdateStudentData,
  onResetTimer,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showTimingCustomizer, setShowTimingCustomizer] = useState(true);

  const bullets = studentData.bullets || [];

  // Calculate total seconds
  const totalSeconds = (studentData.customSegments || []).reduce((sum, s) => sum + s.durationSeconds, 0);
  const isExactTenMinutes = totalSeconds === 600;
  const deltaMinutes = (totalSeconds - 600);

  // Check PRL requirement: at least one work must be from the PRL
  const hasPRL = studentData.textA?.isOnPRL || studentData.textB?.isOnPRL;

  // Auto-dismiss feedback after 4 seconds
  const triggerFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    try {
      const csvString = exportPlanToCSV(studentData);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (studentData.studentName || 'candidate').toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.setAttribute('href', url);
      link.setAttribute('download', `ib_literature_io_plan_${safeName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerFeedback('success', 'Literature IO Plan downloaded as CSV! Keep this file to reload your work anytime.');
    } catch (e) {
      console.error(e);
      triggerFeedback('error', 'Failed to generate CSV file.');
    }
  };

  // CSV Import handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File is empty');
        const importedData = importPlanFromCSV(text, studentData);
        onUpdateStudentData(importedData);
        saveStudentData(importedData);
        if (onResetTimer) onResetTimer();
        triggerFeedback('success', `Literature IO plan loaded successfully from "${file.name}"! Timers & bullets synced.`);
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : 'Invalid CSV structure';
        triggerFeedback('error', `Failed to import CSV: ${msg}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset this entire plan and timers back to default Orwell & Kafka example?')) {
      onUpdateStudentData(DEFAULT_STUDENT_DATA);
      saveStudentData(DEFAULT_STUDENT_DATA);
      if (onResetTimer) onResetTimer();
      triggerFeedback('success', 'Reset to default sample plan (1984 & The Metamorphosis).');
    }
  };

  // Bullet manipulation
  const handleUpdateBullet = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    const newData = { ...studentData, bullets: updated };
    onUpdateStudentData(newData);
    saveStudentData(newData);
  };

  const handleAddBullet = () => {
    if (bullets.length >= 10) return;
    const updated = [...bullets, ''];
    const newData = { ...studentData, bullets: updated };
    onUpdateStudentData(newData);
    saveStudentData(newData);
  };

  const handleRemoveBullet = (index: number) => {
    const updated = bullets.filter((_, i) => i !== index);
    const newData = { ...studentData, bullets: updated };
    onUpdateStudentData(newData);
    saveStudentData(newData);
  };

  // Preset template changer
  const handleApplyPreset = (presetId: TemplateId) => {
    const segments = getPresetSegmentsWithOrder(presetId, studentData.analysisOrder || 'original_first');
    const updated: StudentIOData = {
      ...studentData,
      activeTemplateId: presetId,
      customSegments: segments,
    };
    onUpdateStudentData(updated);
    saveStudentData(updated);
    if (onResetTimer) onResetTimer();
  };

  // Move segment earlier or later
  const handleMoveSegment = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= (studentData.customSegments || []).length) return;

    const items = [...studentData.customSegments];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);

    const reordered = items.map((seg, i) => ({ ...seg, orderNumber: i + 1 }));
    const updated = {
      ...studentData,
      activeTemplateId: 'custom' as TemplateId,
      customSegments: reordered,
    };
    onUpdateStudentData(updated);
    saveStudentData(updated);
  };

  // Adjust duration of a segment
  const handleDurationChange = (index: number, newSeconds: number) => {
    if (newSeconds < 15) return;
    const items = [...studentData.customSegments];
    items[index] = { ...items[index], durationSeconds: newSeconds };

    const updated = {
      ...studentData,
      activeTemplateId: 'custom' as TemplateId,
      customSegments: items,
    };
    onUpdateStudentData(updated);
    saveStudentData(updated);
  };

  // Swap Analysis Order between Original first and Translation first
  const handleSwapAnalysisOrder = () => {
    const updated = swapAnalysisOrder(studentData);
    onUpdateStudentData(updated);
    saveStudentData(updated);
    if (onResetTimer) onResetTimer();
    const isNowTransFirst = updated.analysisOrder === 'translation_first';
    triggerFeedback(
      'success',
      `Swapped Analysis Order: Now analyzing ${isNowTransFirst ? 'Work in Translation first' : 'Original Literary Work first'}. Text details preserved!`
    );
  };

  const isTranslationFirst = studentData.analysisOrder === 'translation_first';

  return (
    <div className="w-full space-y-6">
      
      {/* Hidden File Input for CSV Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,text/csv"
        className="hidden"
      />

      {/* Floating or Top Feedback Notification */}
      {feedbackMessage && (
        <div className={`no-print rounded-2xl border p-4 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-black/30 hover:bg-slate-300 dark:hover:bg-black/50 text-slate-700 dark:text-slate-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Prescribed Reading List (PRL) Mandatory Rule Banner */}
      <div className={`no-print rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors shadow-sm ${
        hasPRL
          ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
          : 'bg-amber-50/95 dark:bg-amber-950/50 border-amber-300 dark:border-amber-500/50 text-amber-950 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <BookCheck className={`h-5 w-5 shrink-0 ${hasPRL ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
          <div>
            <span className="font-bold text-sm block sm:inline">
              IB Literature Requirement: Prescribed Reading List (PRL)
            </span>
            <span className="text-slate-700 dark:text-slate-300 ml-0 sm:ml-2 font-medium">
              {hasPRL
                ? '✓ Requirement satisfied: At least one of your chosen literary works is designated on the PRL.'
                : '⚠️ Action Required: At least ONE of the two works MUST be from the IB Prescribed Reading List (PRL). Please check the PRL box on Text A or Text B below.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
            hasPRL
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700'
              : 'bg-amber-200 text-amber-950 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
          }`}>
            {hasPRL ? 'PRL Verified' : 'Check PRL Status'}
          </span>
        </div>
      </div>

      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-5 backdrop-blur-md shadow-xl dark:shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>IB Literature 10-Bullet Master Plan & Form</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Timer Source
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Two literary works (1 original language + 1 in translation; min. 1 on PRL). Synchronizes with all timers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: CSV Export, CSV Import, PDF Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Upload CSV */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors"
            title="Upload previously exported CSV plan"
          >
            <Upload className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Upload CSV</span>
          </button>

          {/* Download CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors"
            title="Download this plan as CSV for editing or future sessions"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Download CSV</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold shadow-md transition-colors"
            title="Print official clean IB Form"
          >
            <Printer className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Print Form (PDF)</span>
          </button>

          {/* Reset to Default */}
          <button
            onClick={handleResetToDefault}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Reset to default Orwell & Kafka example"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 10-Minute Total Calculator Banner */}
      <div className={`no-print rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
        isExactTenMinutes
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-300'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          {isExactTenMinutes ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <div>
            <span className="font-bold text-sm">
              Planned Total Oral Duration: {Math.floor(totalSeconds / 60)}m {(totalSeconds % 60).toString().padStart(2, '0')}s
            </span>
            <span className="text-slate-700 dark:text-slate-400 ml-2 font-medium">
              {isExactTenMinutes
                ? '· Exactly matches the strict 10-minute IB requirement (600 seconds)!'
                : deltaMinutes > 0
                  ? `· Warning: Exceeds 10m target by ${Math.abs(deltaMinutes)} seconds. Adjust segment seconds below.`
                  : `· Warning: Under 10m target by ${Math.abs(deltaMinutes)} seconds. Adjust segment seconds below.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-200/90 dark:bg-black/40 px-3 py-1 font-mono-nums font-bold text-slate-900 dark:text-slate-200">
            {bullets.length} / 10 Bullets Used
          </div>
          <button
            onClick={() => setShowTimingCustomizer(!showTimingCustomizer)}
            className="flex items-center gap-1 text-[11px] underline underline-offset-2 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
          >
            <Sliders className="h-3 w-3" />
            <span>{showTimingCustomizer ? 'Collapse Timer Breakdown' : 'Expand Timer Breakdown'}</span>
          </button>
        </div>
      </div>

      {/* TIMING & STRUCTURE SECTION */}
      {showTimingCustomizer && (
        <div className="no-print rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 space-y-5 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Timer Structure & Preset Selection</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose an IB structural outline or adjust seconds per segment. All changes reflect live on Quadrant and Chevron views.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start sm:self-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Order: <span className="text-amber-700 dark:text-amber-400 font-bold">{isTranslationFirst ? 'Work in Translation First' : 'Original Literary Work First'}</span>
              </span>
              <button
                type="button"
                onClick={handleSwapAnalysisOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 text-xs font-bold transition-colors shadow-xs"
                title="Swap which work is analyzed first in the presentation"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Swap Analysis Order (Analyze {isTranslationFirst ? 'Original First' : 'Translation First'})</span>
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TEMPLATE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all ${
                  studentData.activeTemplateId === preset.id
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white shadow-md ring-1 ring-amber-400/40'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{preset.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-mono font-semibold">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>

          {/* Segment Duration Adjuster */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sequence Segments & Planned Seconds
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(studentData.customSegments || []).map((seg, idx) => (
                <div
                  key={seg.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                        {seg.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {seg.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                      <input
                        type="number"
                        step={15}
                        min={15}
                        max={360}
                        value={seg.durationSeconds}
                        onChange={(e) => handleDurationChange(idx, parseInt(e.target.value) || 60)}
                        className="w-10 bg-transparent text-right font-mono-nums text-xs font-bold text-amber-600 dark:text-amber-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">s</span>
                    </div>

                    <button
                      onClick={() => handleMoveSegment(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-20"
                      title="Move segment earlier"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleMoveSegment(idx, 'down')}
                      disabled={idx === (studentData.customSegments || []).length - 1}
                      className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-20"
                      title="Move segment later"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MASTER 10-BULLET FORM & CANDIDATE RECORD CARD (Printable + Screen) */}
      <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-10 shadow-xl dark:shadow-2xl print:border-none print:shadow-none print:p-0 print:bg-white print:text-black transition-colors">
        
        {/* IB Official Header */}
        <div className="border-b-2 border-slate-200 dark:border-slate-700 print:border-black pb-5 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 print:text-black">
                International Baccalaureate · Diploma Programme
              </span>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white print:text-black mt-1">
                Individual Oral Outline Form (10-Minute Assessment)
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-gray-700 font-medium">
                Language A: Literature · Criteria A, B, C, D
              </p>
            </div>
            
            <div className="text-right text-xs space-y-1">
              <div className="font-mono text-slate-800 dark:text-slate-300 print:text-black font-bold">
                Form: LIT-IO-10
              </div>
              <div className="text-amber-700 dark:text-amber-400 print:text-gray-600 text-[11px] font-bold">
                Max 10 Bullet Points
              </div>
            </div>
          </div>

          {/* Student metadata fields (Editable) */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 print:bg-gray-100 p-3.5 rounded-xl print:rounded-none border border-slate-200 dark:border-slate-800 print:border-gray-300 transition-colors">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 print:text-gray-600 block">Candidate Name</span>
              <input
                type="text"
                value={studentData.studentName || ''}
                onChange={(e) => onUpdateStudentData({ ...studentData, studentName: e.target.value })}
                placeholder="Candidate Full Name"
                className="w-full bg-transparent font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 print:text-gray-600 block">Candidate Session Number</span>
              <input
                type="text"
                value={studentData.candidateNumber || ''}
                onChange={(e) => onUpdateStudentData({ ...studentData, candidateNumber: e.target.value })}
                placeholder="e.g. 001234-0042"
                className="w-full bg-transparent font-mono font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 print:text-gray-600 block">School Name</span>
              <input
                type="text"
                value={studentData.schoolName || ''}
                onChange={(e) => onUpdateStudentData({ ...studentData, schoolName: e.target.value })}
                placeholder="School Name"
                className="w-full bg-transparent font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 print:text-gray-600 block">Date of Oral</span>
              <input
                type="date"
                value={studentData.examDate || ''}
                onChange={(e) => onUpdateStudentData({ ...studentData, examDate: e.target.value })}
                className="w-full bg-transparent font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Global Issue & Works Declaration (Editable) */}
          <div className="mt-4 space-y-3 text-xs">
            
            {/* Global Issue & Field of Inquiry */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800 print:border-gray-300 space-y-2 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 print:text-black">
                  Global Issue Statement
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold">Field of Inquiry:</span>
                  <select
                    value={studentData.globalIssueField || GLOBAL_ISSUE_FIELDS[0]}
                    onChange={(e) => onUpdateStudentData({ ...studentData, globalIssueField: e.target.value })}
                    className="rounded bg-white dark:bg-slate-950 print:bg-white text-slate-800 dark:text-slate-200 print:text-black border border-slate-300 dark:border-slate-700 print:border-gray-300 text-xs px-2 py-0.5 focus:outline-none font-medium"
                  >
                    {GLOBAL_ISSUE_FIELDS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                rows={2}
                value={studentData.globalIssue || ''}
                onChange={(e) => onUpdateStudentData({ ...studentData, globalIssue: e.target.value })}
                placeholder="State your precise Global Issue connecting both literary works..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 print:text-black focus:outline-none resize-none leading-relaxed placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            {/* Working Thesis Statement */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 print:bg-gray-50 border border-slate-200 dark:border-slate-800 print:border-gray-200 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 print:text-gray-600 block mb-1">
                Working Thesis Statement (How each literary work explores the GI)
              </label>
              <textarea
                rows={2}
                value={studentData.thesisStatement || ''}
                onChange={(e) => onUpdateStudentData({ ...studentData, thesisStatement: e.target.value })}
                placeholder="Answer: How does each literary work uniquely explore meaning regarding the Global Issue?"
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 print:text-gray-800 focus:outline-none resize-none leading-relaxed placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            {/* Two Literary Works Details Side by Side */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>Two Literary Works Examined (1 Original Language + 1 in Translation)</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">*At least 1 on PRL</span>
                </span>
                <button
                  type="button"
                  onClick={handleSwapAnalysisOrder}
                  className="no-print self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 text-xs font-bold transition-colors shadow-xs"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Analysis Order: {isTranslationFirst ? 'Translation First ⇄' : 'Original First ⇄'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Text A (Literary - Original Language) */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-500/10 print:bg-gray-50 border border-blue-200 dark:border-blue-500/30 print:border-gray-300 space-y-2 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 print:text-black">
                      Text A: Literary Work (Original Language)
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                      {isTranslationFirst ? 'Analyzed 2nd (Mins 5–9)' : 'Analyzed 1st (Mins 1–5)'}
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold block">Work Title & Author</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={studentData.textA?.title || ''}
                        onChange={(e) => onUpdateStudentData({
                          ...studentData,
                          textA: { ...studentData.textA, title: e.target.value }
                        })}
                        placeholder="Title (e.g. 1984)"
                        className="w-1/2 bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                      />
                      <input
                        type="text"
                        value={studentData.textA?.creator || ''}
                        onChange={(e) => onUpdateStudentData({
                          ...studentData,
                          textA: { ...studentData.textA, creator: e.target.value }
                        })}
                        placeholder="Author (e.g. George Orwell)"
                        className="w-1/2 bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold block">Literary Form / Medium</label>
                      <input
                        type="text"
                        value={studentData.textA?.medium || ''}
                        onChange={(e) => onUpdateStudentData({
                          ...studentData,
                          textA: { ...studentData.textA, medium: e.target.value }
                        })}
                        placeholder="e.g. Novel, Play, Poetry"
                        className="w-full bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 text-xs text-slate-900 dark:text-white print:text-black focus:outline-none"
                      />
                    </div>
                    <div className="w-1/2 flex items-end pb-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!studentData.textA?.isOnPRL}
                          onChange={(e) => onUpdateStudentData({
                            ...studentData,
                            textA: { ...studentData.textA, isOnPRL: e.target.checked }
                          })}
                          className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                        />
                        <span className="flex items-center gap-1">
                          <BookCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          <span>On PRL List</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold block">Extract Reference (Max 40 lines / scene / poem)</label>
                    <input
                      type="text"
                      value={studentData.textA?.extractDetails || ''}
                      onChange={(e) => onUpdateStudentData({
                        ...studentData,
                        textA: { ...studentData.textA, extractDetails: e.target.value }
                      })}
                      placeholder="e.g. Part I, Chapter 1 (Lines 24–65)"
                      className="w-full bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 text-xs text-slate-800 dark:text-slate-200 print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                    />
                  </div>
                </div>

                {/* Text B (Literary - In Translation) */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 print:bg-gray-50 border border-emerald-200 dark:border-emerald-500/30 print:border-gray-300 space-y-2 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 print:text-black flex items-center gap-1">
                      <Languages className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Text B: Work in Translation</span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50">
                      {isTranslationFirst ? 'Analyzed 1st (Mins 1–5)' : 'Analyzed 2nd (Mins 5–9)'}
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold block">Work Title & Author</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={studentData.textB?.title || ''}
                        onChange={(e) => onUpdateStudentData({
                          ...studentData,
                          textB: { ...studentData.textB, title: e.target.value }
                        })}
                        placeholder="Title (e.g. The Metamorphosis)"
                        className="w-1/2 bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                      />
                      <input
                        type="text"
                        value={studentData.textB?.creator || ''}
                        onChange={(e) => onUpdateStudentData({
                          ...studentData,
                          textB: { ...studentData.textB, creator: e.target.value }
                        })}
                        placeholder="Author (e.g. Franz Kafka)"
                        className="w-1/2 bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 font-semibold text-slate-900 dark:text-white print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold block">Original Language / Translator</label>
                      <input
                        type="text"
                        value={studentData.textB?.originalLanguage || ''}
                        onChange={(e) => onUpdateStudentData({
                          ...studentData,
                          textB: { ...studentData.textB, originalLanguage: e.target.value }
                        })}
                        placeholder="e.g. German (trans. Corngold)"
                        className="w-full bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 text-xs text-slate-900 dark:text-white print:text-black focus:outline-none"
                      />
                    </div>
                    <div className="w-1/2 flex items-end pb-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!studentData.textB?.isOnPRL}
                          onChange={(e) => onUpdateStudentData({
                            ...studentData,
                            textB: { ...studentData.textB, isOnPRL: e.target.checked }
                          })}
                          className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                        />
                        <span className="flex items-center gap-1">
                          <BookCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          <span>On PRL List</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-600 font-semibold block">Extract Reference (Max 40 lines / scene / poem)</label>
                    <input
                      type="text"
                      value={studentData.textB?.extractDetails || ''}
                      onChange={(e) => onUpdateStudentData({
                        ...studentData,
                        textB: { ...studentData.textB, extractDetails: e.target.value }
                      })}
                      placeholder="e.g. Section 1 (Lines 1–45)"
                      className="w-full bg-white dark:bg-slate-950/60 print:bg-white p-1.5 rounded border border-slate-300 dark:border-slate-800 print:border-gray-300 text-xs text-slate-800 dark:text-slate-200 print:text-black focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 10 BULLETS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 print:text-gray-600 pb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Candidate Speaking Points (Maximum 10 Allowed by IB)
            </span>
            <span className="text-[11px] no-print text-amber-700 dark:text-amber-400 font-semibold">
              Live two-way sync with Quadrant, Chevron, and Rehearsal views
            </span>
          </div>

          {bullets.map((bullet, idx) => {
            const wordCount = bullet.trim() ? bullet.trim().split(/\s+/).length : 0;
            const isTooLong = wordCount > 25;
            const mapping = getBulletMappingDescription(idx, studentData.analysisOrder || 'original_first');
            const phaseHint = getBulletPhaseLabel(idx, studentData.analysisOrder || 'original_first');

            return (
              <div
                key={idx}
                className="group relative flex items-start gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 print:border-gray-300 bg-slate-50/70 dark:bg-slate-900/50 print:bg-white transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Bullet number badge */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 dark:bg-amber-500/10 print:bg-gray-200 text-amber-700 dark:text-amber-300 print:text-black font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="no-print text-[9px] uppercase font-bold text-slate-500 mt-1 text-center max-w-[64px] leading-tight">
                    {phaseHint}
                  </span>
                </div>

                {/* Textarea for bullet */}
                <div className="flex-1 min-w-0">
                  <div className="no-print flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
                    <span className="truncate">
                      📍 Quadrant: <strong className="text-slate-700 dark:text-slate-300">{mapping.quadrant}</strong> · Chevron: <strong className="text-slate-700 dark:text-slate-300">{mapping.chevron}</strong>
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                    placeholder={`Bullet Point #${idx + 1} memory cue...`}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 print:text-black placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                  />
                  
                  {/* Word count & suggestion */}
                  <div className="no-print flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1">
                    <span>
                      {wordCount} words {isTooLong && <span className="text-rose-600 dark:text-rose-400 font-bold">(Warning: too long for IB memory prompt)</span>}
                    </span>
                    <button
                      onClick={() => handleRemoveBullet(idx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-opacity flex items-center gap-1 font-semibold"
                      title="Delete bullet"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Bullet Button (If under 10) */}
          {bullets.length < 10 && (
            <button
              onClick={handleAddBullet}
              className="no-print w-full py-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-500/5 text-slate-700 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Bullet Point ({bullets.length + 1} of 10)</span>
            </button>
          )}
        </div>

        {/* Declaration signature box for official print */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 print:border-gray-400 text-xs text-slate-600 dark:text-slate-400 print:text-gray-700">
          <div className="grid grid-cols-2 gap-8 print:grid">
            <div className="space-y-6">
              <p className="text-[11px] leading-relaxed">
                Candidate Declaration: I confirm that this outline sheet consists of 10 or fewer bullet points, that both works are literary works (with at least one from the Prescribed Reading List and one studied in translation), and that I will adhere to the strict 10-minute presentation guidelines for IB DP Literature without continuous prose.
              </p>
              <div className="border-b border-slate-300 dark:border-slate-700 print:border-black pt-4">
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-500 print:text-gray-500">Candidate Signature</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] leading-relaxed">
                Teacher Verification: I confirm that the candidate has prepared 10 bullet points and unannotated extracts from two literary works in compliance with IB DP Language A: Literature regulations.
              </p>
              <div className="border-b border-slate-300 dark:border-slate-700 print:border-black pt-4">
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-500 print:text-gray-500">Teacher / Invigilator Signature</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
