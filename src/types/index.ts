export type QuadrantPosition = 
  | 'center-top' 
  | 'top-left' 
  | 'bottom-left' 
  | 'top-right' 
  | 'bottom-right' 
  | 'center-bottom'
  | 'extra';

export type SegmentType =
  | 'intro'
  | 'textA_work'
  | 'textA_extract'
  | 'textB_work'
  | 'textB_extract'
  | 'textA_combined'
  | 'textB_combined'
  | 'conclusion'
  | 'discussion';

export interface Segment {
  id: string;
  orderNumber: number;
  type: SegmentType;
  title: string;
  subtitle: string;
  quadrant: QuadrantPosition;
  durationSeconds: number; // in seconds
  colorKey: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'teal' | 'orange' | 'slate';
  keyPrompts: string[];
  guidancePoints: string[];
  giCheckinReminder: string;
  studentNotes?: string;
}

export type TemplateId = 'quadrant_balanced' | 'philpot_method1' | 'extract_first' | 'custom';

export interface TemplatePreset {
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
  targetDescription: string;
  segments: Segment[];
}

export interface WorkMetadata {
  title: string;
  creator: string; // author or playwright / poet
  medium: string; // e.g. Novel, Play / Drama, Poetry, Novella, Short Story Collection
  extractDetails: string; // e.g. "Part I, Chapter 1 (Lines 24-65)" or "Act III, Scene 2"
  isTranslation: boolean; // Text A: original language studied, Text B: work in translation
  originalLanguage?: string; // e.g. German, Russian, French, Spanish, Ancient Greek
  translator?: string; // optional translator name
  isOnPRL: boolean; // Prescribed Reading List (PRL) compliance flag
}

export interface StudentIOData {
  studentName: string;
  candidateNumber?: string;
  schoolName: string;
  examDate?: string;
  globalIssue: string;
  globalIssueField: string;
  thesisStatement: string;
  textA: WorkMetadata; // Literary Work in Original Language
  textB: WorkMetadata; // Literary Work in Translation
  bullets: string[]; // up to 10 bullet points allowed by IB
  bulletSegmentMapping?: Record<number, string>; // Maps bullet index 0..9 to segment ID
  activeTemplateId: TemplateId;
  customSegments: Segment[];
  soundEnabled: boolean;
  voiceSpeechEnabled: boolean;
  giCheckinFrequency: 'high' | 'normal' | 'low'; // high = 45s, normal = 90s, low = halfway
  includeDiscussion: boolean; // 5 min discussion
  analysisOrder?: 'original_first' | 'translation_first'; // Order of analysis: Work in Original Language first or Work in Translation first
}
