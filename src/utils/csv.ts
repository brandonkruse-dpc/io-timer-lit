import { StudentIOData, TemplateId } from '../types';
import { TEMPLATE_PRESETS } from './templates';

/**
 * Escapes a cell for RFC 4180 standard CSV.
 */
function escapeCSVCell(value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Robust CSV parser compliant with RFC 4180 (handles multiline cells, escaped quotes).
 */
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  let i = 0;

  // Clean BOM if present
  let text = csvText;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i += 2;
        continue;
      } else if (char === '"') {
        inQuotes = false;
        i++;
        continue;
      } else {
        currentCell += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
        i++;
        continue;
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        i += 2;
        continue;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        i++;
        continue;
      } else {
        currentCell += char;
        i++;
        continue;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows.filter((r) => r.length > 0 && r.some((c) => c.length > 0));
}

/**
 * Serializes the student's complete 10-bullet plan and timer settings to CSV.
 */
export function exportPlanToCSV(data: StudentIOData): string {
  const lines: string[] = [];

  // Header row
  lines.push(['Section', 'Field', 'Value'].map(escapeCSVCell).join(','));

  // Section 1: Candidate Metadata
  lines.push(['Candidate Info', 'Course', 'Language A: Literature'].map(escapeCSVCell).join(','));
  lines.push(['Candidate Info', 'Candidate Name', data.studentName || ''].map(escapeCSVCell).join(','));
  lines.push(['Candidate Info', 'Candidate Session Number', data.candidateNumber || ''].map(escapeCSVCell).join(','));
  lines.push(['Candidate Info', 'School Name', data.schoolName || ''].map(escapeCSVCell).join(','));
  lines.push(['Candidate Info', 'Oral Assessment Date', data.examDate || ''].map(escapeCSVCell).join(','));

  // Section 2: Global Issue
  lines.push(['Global Issue', 'Global Issue Statement', data.globalIssue || ''].map(escapeCSVCell).join(','));
  lines.push(['Global Issue', 'Field of Inquiry', data.globalIssueField || ''].map(escapeCSVCell).join(','));
  lines.push(['Global Issue', 'Working Thesis', data.thesisStatement || ''].map(escapeCSVCell).join(','));

  // Section 3: Text A (Literary - Original Language)
  lines.push(['Text A (Original Language)', 'Title', data.textA?.title || ''].map(escapeCSVCell).join(','));
  lines.push(['Text A (Original Language)', 'Author', data.textA?.creator || ''].map(escapeCSVCell).join(','));
  lines.push(['Text A (Original Language)', 'Form / Medium', data.textA?.medium || ''].map(escapeCSVCell).join(','));
  lines.push(['Text A (Original Language)', 'Extract Details', data.textA?.extractDetails || ''].map(escapeCSVCell).join(','));
  lines.push(['Text A (Original Language)', 'On Prescribed Reading List (PRL)', String(!!data.textA?.isOnPRL)].map(escapeCSVCell).join(','));

  // Section 4: Text B (Literary - Work in Translation)
  lines.push(['Text B (Work in Translation)', 'Title', data.textB?.title || ''].map(escapeCSVCell).join(','));
  lines.push(['Text B (Work in Translation)', 'Author', data.textB?.creator || ''].map(escapeCSVCell).join(','));
  lines.push(['Text B (Work in Translation)', 'Form / Medium', data.textB?.medium || ''].map(escapeCSVCell).join(','));
  lines.push(['Text B (Work in Translation)', 'Original Language', data.textB?.originalLanguage || ''].map(escapeCSVCell).join(','));
  lines.push(['Text B (Work in Translation)', 'Translator', data.textB?.translator || ''].map(escapeCSVCell).join(','));
  lines.push(['Text B (Work in Translation)', 'Extract Details', data.textB?.extractDetails || ''].map(escapeCSVCell).join(','));
  lines.push(['Text B (Work in Translation)', 'On Prescribed Reading List (PRL)', String(!!data.textB?.isOnPRL)].map(escapeCSVCell).join(','));

  // Section 5: Timer & Structure Configuration
  lines.push(['Timer Configuration', 'Analysis Order', data.analysisOrder || 'original_first'].map(escapeCSVCell).join(','));
  lines.push(['Timer Configuration', 'Template Preset ID', data.activeTemplateId || 'quadrant_balanced'].map(escapeCSVCell).join(','));
  lines.push(['Timer Configuration', 'Include 5-Min Q&A Discussion', String(!!data.includeDiscussion)].map(escapeCSVCell).join(','));
  lines.push(['Timer Configuration', 'Audio Chimes Enabled', String(!!data.soundEnabled)].map(escapeCSVCell).join(','));
  lines.push(['Timer Configuration', 'Voice Prompts Enabled', String(!!data.voiceSpeechEnabled)].map(escapeCSVCell).join(','));
  lines.push(['Timer Configuration', 'GI Check-in Frequency', data.giCheckinFrequency || 'normal'].map(escapeCSVCell).join(','));

  // Section 6: Planned Segment Durations
  if (data.customSegments && data.customSegments.length > 0) {
    data.customSegments.forEach((seg, idx) => {
      lines.push([
        'Planned Segment Durations',
        `Segment ${idx + 1}: ${seg.title}`,
        `${seg.durationSeconds}`,
      ].map(escapeCSVCell).join(','));
    });
  }

  // Section 7: The 10 Official IB Bullet Points
  const bullets = data.bullets || [];
  for (let b = 0; b < 10; b++) {
    const bulletText = bullets[b] || '';
    lines.push([
      'IB 10-Bullet Outline',
      `Bullet Point ${b + 1}`,
      bulletText,
    ].map(escapeCSVCell).join(','));
  }

  return lines.join('\r\n');
}

/**
 * Parses an uploaded CSV back into StudentIOData.
 */
export function importPlanFromCSV(csvText: string, currentData: StudentIOData): StudentIOData {
  const rows = parseCSV(csvText);
  if (rows.length === 0) {
    throw new Error('CSV file appears to be empty.');
  }

  const updated: StudentIOData = JSON.parse(JSON.stringify(currentData));
  const importedBullets: { index: number; text: string }[] = [];
  const importedDurations: { order: number; seconds: number; titleHint?: string }[] = [];

  // Iterate over rows
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < 2) continue;

    // Support both 3-column (Section, Field, Value) and 2-column (Field, Value)
    let field = '';
    let val = '';

    if (row.length >= 3) {
      field = (row[1] || '').toLowerCase().trim();
      val = (row[2] || '').trim();
    } else {
      field = (row[0] || '').toLowerCase().trim();
      val = (row[1] || '').trim();
    }

    if (!val && !field.includes('bullet')) continue;

    // Match Fields
    if (field.includes('candidate name')) {
      updated.studentName = val;
    } else if (field.includes('candidate session') || field.includes('session number')) {
      updated.candidateNumber = val;
    } else if (field.includes('school name')) {
      updated.schoolName = val;
    } else if (field.includes('date')) {
      updated.examDate = val;
    } else if (field === 'global issue' || field.includes('global issue statement') || field.includes('global issue:')) {
      updated.globalIssue = val;
    } else if (field.includes('field of inquiry')) {
      updated.globalIssueField = val;
    } else if (field.includes('thesis')) {
      updated.thesisStatement = val;
    } else if (field.includes('text a') && field.includes('title')) {
      updated.textA.title = val;
    } else if (field.includes('text a') && (field.includes('author') || field.includes('creator'))) {
      updated.textA.creator = val;
    } else if (field.includes('text a') && (field.includes('medium') || field.includes('form'))) {
      updated.textA.medium = val;
    } else if (field.includes('text a') && (field.includes('extract') || field.includes('lines'))) {
      updated.textA.extractDetails = val;
    } else if (field.includes('text a') && field.includes('prl')) {
      updated.textA.isOnPRL = val.toLowerCase() === 'true';
    } else if (field.includes('text b') && field.includes('title')) {
      updated.textB.title = val;
    } else if (field.includes('text b') && (field.includes('author') || field.includes('creator') || field.includes('artist'))) {
      updated.textB.creator = val;
    } else if (field.includes('text b') && (field.includes('medium') || field.includes('form'))) {
      updated.textB.medium = val;
    } else if (field.includes('text b') && (field.includes('extract') || field.includes('details'))) {
      updated.textB.extractDetails = val;
    } else if (field.includes('text b') && field.includes('original language')) {
      updated.textB.originalLanguage = val;
    } else if (field.includes('text b') && field.includes('translator')) {
      updated.textB.translator = val;
    } else if (field.includes('text b') && field.includes('prl')) {
      updated.textB.isOnPRL = val.toLowerCase() === 'true';
    } else if (field.includes('analysis order')) {
      if (val === 'original_first' || val === 'translation_first') {
        updated.analysisOrder = val;
      } else if (val === 'literary_first') {
        updated.analysisOrder = 'original_first';
      } else if (val === 'non_literary_first') {
        updated.analysisOrder = 'translation_first';
      }
    } else if (field.includes('template preset') || field.includes('template id')) {
      if (val === 'quadrant_balanced' || val === 'philpot_method1' || val === 'extract_first' || val === 'custom') {
        updated.activeTemplateId = val as TemplateId;
        const preset = TEMPLATE_PRESETS.find((p) => p.id === val);
        if (preset) {
          updated.customSegments = JSON.parse(JSON.stringify(preset.segments));
        }
      }
    } else if (field.includes('include 5-min') || field.includes('discussion')) {
      updated.includeDiscussion = val.toLowerCase() === 'true';
    } else if (field.includes('sound enabled') || field.includes('audio chimes')) {
      updated.soundEnabled = val.toLowerCase() === 'true';
    } else if (field.includes('voice prompts') || field.includes('speech')) {
      updated.voiceSpeechEnabled = val.toLowerCase() === 'true';
    } else if (field.includes('frequency')) {
      if (val === 'high' || val === 'normal' || val === 'low') {
        updated.giCheckinFrequency = val;
      }
    } else if (field.includes('segment') && (field.includes('duration') || field.includes(':'))) {
      const match = field.match(/segment\s*(\d+)/i);
      if (match) {
        const segNum = parseInt(match[1], 10);
        const secs = parseInt(val, 10);
        if (!isNaN(secs) && secs > 0) {
          importedDurations.push({ order: segNum, seconds: secs });
        }
      }
    } else if (field.includes('bullet') || field.match(/point\s*\d+/i)) {
      const match = field.match(/(?:bullet|point)\s*(\d+)/i);
      const bIdx = match ? parseInt(match[1], 10) - 1 : importedBullets.length;
      if (bIdx >= 0 && bIdx < 10) {
        importedBullets.push({ index: bIdx, text: val });
      }
    }
  }

  // Populate imported bullets
  if (importedBullets.length > 0) {
    const newBullets = [...(updated.bullets || [])];
    importedBullets.forEach(({ index, text }) => {
      newBullets[index] = text;
    });
    updated.bullets = newBullets.slice(0, 10);
  }

  // Populate imported durations if available
  if (importedDurations.length > 0 && updated.customSegments) {
    importedDurations.forEach(({ order, seconds }) => {
      const targetIdx = order - 1;
      if (updated.customSegments[targetIdx]) {
        updated.customSegments[targetIdx].durationSeconds = seconds;
      }
    });
  }

  return updated;
}
