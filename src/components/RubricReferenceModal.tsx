import React from 'react';
import { Award, Clock, ShieldCheck, AlertCircle, BookCheck, Languages } from 'lucide-react';

interface RubricReferenceModalProps {
  onClose?: () => void;
}

export const RubricReferenceModal: React.FC<RubricReferenceModalProps> = () => {
  const criteria = [
    {
      code: 'Criterion A',
      title: 'Knowledge, Understanding & Interpretation',
      marks: '10 Marks',
      badgeClass: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800',
      cardClass: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-slate-900/90',
      keyQuestions: [
        'How well does the candidate demonstrate knowledge and understanding of both literary works and the global issue?',
        'How well does the candidate demonstrate understanding of the works in relation to the chosen global issue?',
        'How well are ideas supported by precise references to both extracts and to the broader literary works?',
      ],
      highBandTip: 'Level 9–10: The oral demonstrates insightful, convincing knowledge and understanding of both the literary works and the global issue. The interpretation of their relationship is perceptive and persuasive. Ideas are thoroughly substantiated by well-chosen, persuasive references to the extracts and whole works.',
    },
    {
      code: 'Criterion B',
      title: 'Analysis & Evaluation',
      marks: '10 Marks',
      badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800',
      cardClass: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-slate-900/90',
      keyQuestions: [
        'How effectively does the candidate analyze and evaluate authorial choices and literary craft?',
        'Do they discuss both micro techniques in the extract AND macro choices across the broader literary work?',
        'How effectively do they demonstrate understanding of how literary devices, structure, style, and form present the global issue?',
      ],
      highBandTip: 'Level 9–10: Analysis and evaluation of authorial choices are insightful, nuanced, and perceptive. There is a convincing, thorough exploration of how literary features, techniques, and authorial craft construct meaning in relation to the global issue.',
    },
    {
      code: 'Criterion C',
      title: 'Focus & Organisation',
      marks: '10 Marks',
      badgeClass: 'text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800',
      cardClass: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-slate-900/90',
      keyQuestions: [
        'How well-balanced is the oral between the original literary work and the work in translation (approx. 4–5 minutes each)?',
        'How well-balanced is each work between the extract and the broader work (approx. 2m extract + 2m whole work)?',
        'Does the candidate adhere strictly to the 10-minute presentation limit?',
        'Is the structure coherent, sustained, and cohesive with smooth transitions without comparing texts directly?',
      ],
      highBandTip: 'Level 9–10: The oral maintains a clear, sustained, and focused approach to the task. Ideas are organized in a coherent, balanced, and purposeful structure, with seamless development and smooth transitions between parts.',
    },
    {
      code: 'Criterion D',
      title: 'Language',
      marks: '10 Marks',
      badgeClass: 'text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
      cardClass: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-slate-900/90',
      keyQuestions: [
        'Is the language clear, varied, accurate, and appropriate for an academic literary oral?',
        'Does the candidate use accurate literary terminology and precise critical vocabulary?',
        'Is the oral delivery fluent, engaging, and natural rather than read off a memorized script?',
      ],
      highBandTip: 'Level 9–10: Language is clear, varied, precise, and sophisticated. Register and style are consistently effective and appropriate to the academic oral. Literary terminology is used accurately and effectively. Oral delivery is fluent and engaging.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                IB DP Language A: Literature — Individual Oral Criteria
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
              Assessed out of <strong className="text-slate-900 dark:text-slate-200">40 marks</strong> across 4 official criteria. Total weight: <strong className="text-slate-900 dark:text-slate-200">30% for SL</strong> and <strong className="text-slate-900 dark:text-slate-200">20% for HL</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-mono-nums font-bold text-amber-800 dark:text-amber-300">
              Total: 40 Marks (10m strict + 5m Q&A)
            </span>
          </div>
        </div>

        {/* Essential Rules Check-in */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs border-t border-slate-200 dark:border-slate-800/80 pt-4">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <BookCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block font-semibold">PRL Requirement</strong>
              <span className="text-slate-600 dark:text-slate-400">At least ONE of the two works MUST be from the IB Prescribed Reading List (PRL).</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block font-semibold">Work in Translation</strong>
              <span className="text-slate-600 dark:text-slate-400">One work originally in English / language studied, and one work studied in translation.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block font-semibold">50/50 Balance Rule</strong>
              <span className="text-slate-600 dark:text-slate-400">Equal balance between extract & whole work (~2m + ~2m), and between both literary works.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <Clock className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block font-semibold">Strict 10-Minute Limit</strong>
              <span className="text-slate-600 dark:text-slate-400">Examiners must stop timing at 10:00. Followed by 5 minutes of teacher discussion.</span>
            </div>
          </div>
        </div>

        {/* Comparison Alert */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Crucial Literature Rule:</strong> Do NOT compare the two literary works during your analysis. Analyze each work independently through the lens of your chosen Global Issue!
          </span>
        </div>
      </div>

      {/* 4 Criteria Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {criteria.map((c) => (
          <div
            key={c.code}
            className={`rounded-2xl border p-5 shadow-sm dark:shadow-lg flex flex-col justify-between transition-colors ${c.cardClass}`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${c.badgeClass}`}>
                  {c.code}
                </span>
                <span className="font-mono-nums text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm">
                  {c.marks}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                {c.title}
              </h3>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Examiner Guiding Questions:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {c.keyQuestions.map((q, qIdx) => (
                    <li key={qIdx} className="flex items-start gap-2">
                      <span className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5 font-bold">•</span>
                      <span className="font-medium">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] rounded-xl bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 p-3 shadow-xs">
              <strong className="text-amber-800 dark:text-amber-300 block mb-0.5 font-bold">Top Markband (Level 9–10) Standard:</strong>
              <span className="text-slate-700 dark:text-slate-300 italic">{c.highBandTip}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
