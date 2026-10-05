import { Segment, StudentIOData, TemplatePreset } from '../types';

export const GLOBAL_ISSUE_FIELDS = [
  'Culture, identity and community',
  'Beliefs, values and education',
  'Politics, power and justice',
  'Art, creativity and the imagination',
  'Science, technology and the environment',
];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'quadrant_balanced',
    name: '4-Quadrant Balance Model',
    badge: 'Standard 50/50 Balance',
    description: 'Separates Extract vs Overall Work into 2-minute balanced quarters. Ensures equal balance between both literary works and between each extract and broader work.',
    targetDescription: 'Intro (1m) → Text A Work (2m) → Text A Extract (2m) → Text B Work in Translation (2m) → Text B Extract (2m) → Conclusion (1m)',
    segments: [
      {
        id: 'qb_1',
        orderNumber: 1,
        type: 'intro',
        title: 'Intro: Global Issue & Literary Works',
        subtitle: 'GI definition, thesis & presentation roadmap (Check: At least 1 work on PRL)',
        quadrant: 'center-top',
        durationSeconds: 60,
        colorKey: 'amber',
        keyPrompts: [
          'Define Global Issue clearly (broad significance, transnational, local impact)',
          'Identify Literary Work in original language (author, title) & Work in Translation (author, translator, title)',
          'Confirm that at least one of the two works is from the Prescribed Reading List (PRL)',
          'Deliver clear thesis: How does each literary work uniquely explore this Global Issue?',
          'Outline roadmap of presentation (strict: no direct comparison between texts!)',
        ],
        guidancePoints: [
          'Keep introduction strictly under 1 minute',
          'Make your Global Issue specific and grounded in the prompt',
          'Clarify the selected extracts (maximum 40 lines each)',
          'PRL Rule: At least one work MUST be chosen from the Prescribed Reading List',
        ],
        giCheckinReminder: 'Have you clearly stated your Global Issue and why it matters globally and locally?',
      },
      {
        id: 'qb_2',
        orderNumber: 2,
        type: 'textA_work',
        title: 'TEXT A: Overall Literary Work',
        subtitle: 'Original Language Work: Macro techniques, structural craft & overarching themes',
        quadrant: 'top-left',
        durationSeconds: 120,
        colorKey: 'blue',
        keyPrompts: [
          'Examine macro authorial choices across the entire literary work',
          'Structural patterns, recurring motifs, character development across the whole text',
          'Socio-historical or cultural context shaping the Global Issue representation',
          'Directly connect macro findings to the Global Issue',
        ],
        guidancePoints: [
          'Reference at least 2 broader moments/themes from the full literary work',
          'Demonstrate deep knowledge of the author’s literary craft and structure',
          'Check-in: Relate every observation to the Global Issue',
        ],
        giCheckinReminder: 'Check-in: How does this broader motif in the entire literary work reveal the Global Issue?',
      },
      {
        id: 'qb_3',
        orderNumber: 3,
        type: 'textA_extract',
        title: 'TEXT A: Extract (Micro Analysis)',
        subtitle: 'Literary Extract: 1–2 specific authorial choices in passage (max 40 lines)',
        quadrant: 'bottom-left',
        durationSeconds: 120,
        colorKey: 'purple',
        keyPrompts: [
          'Close micro-analysis of 1–2 specific authorial choices in the 40-line extract',
          'Quote exact diction, syntax, figurative language, tone, meter, or structural shifts',
          'Explain the nuanced effect on the reader/audience',
          'Ground every literary device directly into your Global Issue',
        ],
        guidancePoints: [
          'Anchor claims with short, embedded textual quotations',
          'Avoid mere plot summary—focus strictly on technique, style, and effect',
          'Equal 2-minute balance with the broader work',
        ],
        giCheckinReminder: 'Check-in: Does this specific literary device highlight the central conflict of the Global Issue?',
      },
      {
        id: 'qb_4',
        orderNumber: 4,
        type: 'textB_work',
        title: 'TEXT B: Overall Work in Translation',
        subtitle: 'Work in Translation: Broader narrative arc, structural choices & thematic scope',
        quadrant: 'top-right',
        durationSeconds: 120,
        colorKey: 'emerald',
        keyPrompts: [
          'Analyze the author’s broader literary work studied in translation',
          'Identify overarching literary strategies, thematic motifs, and structural choices',
          'Discuss socio-cultural context and authorial purpose in addressing the Global Issue',
          'Explicit link to the Global Issue (no direct comparison to Text A!)',
        ],
        guidancePoints: [
          'Show deep familiarity with the full work studied in translation',
          'Analyze literary features across the broader text',
          'Maintain independent focus on the Global Issue',
        ],
        giCheckinReminder: 'Check-in: How does the author’s broader work in translation reflect the reality of the Global Issue?',
      },
      {
        id: 'qb_5',
        orderNumber: 5,
        type: 'textB_extract',
        title: 'TEXT B: Extract in Translation (Micro Analysis)',
        subtitle: 'Translation Extract: 1–2 specific literary choices in passage (max 40 lines)',
        quadrant: 'bottom-right',
        durationSeconds: 120,
        colorKey: 'rose',
        keyPrompts: [
          'Detailed micro-analysis of 1–2 authorial choices in the selected extract in translation',
          'Close reading of figurative language, dialogue, narrative perspective, tone, or pacing',
          'Explain the immediate literary impact on reader perception',
          'Synthesize back directly to the Global Issue',
        ],
        guidancePoints: [
          'Point to specific lines and embedded phrases in the extract',
          'Discuss how literary form and craft construct meaning',
          'Wrap up smoothly before the final minute for the conclusion',
        ],
        giCheckinReminder: 'Check-in: How does this specific literary choice convey the human experience of the Global Issue?',
      },
      {
        id: 'qb_6',
        orderNumber: 6,
        type: 'conclusion',
        title: 'Conclusion: Evaluation of Both Works',
        subtitle: 'Value of each literary work’s representation of the Global Issue',
        quadrant: 'center-bottom',
        durationSeconds: 60,
        colorKey: 'teal',
        keyPrompts: [
          'Synthesize the distinct literary value of each work’s representation of the Global Issue',
          'Evaluate the effectiveness of each author’s craft in achieving their purpose',
          'Provide a final resonant takeaway on the significance of the Global Issue',
          'Strong closing statement (leave 5–10 seconds buffer before the strict 10:00 cutoff)',
        ],
        guidancePoints: [
          'Do not introduce brand new quotes or plot points',
          'Focus on how both literary works illuminate different facets of the Global Issue',
          'Finish cleanly right at or just before 10 minutes',
        ],
        giCheckinReminder: 'Check-in: What lasting perspective on the Global Issue do both literary works offer the reader?',
      },
    ],
  },
  {
    id: 'philpot_method1',
    name: 'Philpot Education Outline Method 1',
    badge: 'Sequential Flow (1-4-4-1)',
    description: 'Sequenced flow with 1 min Intro, 4 min dedicated Original Literary Work analysis, 4 min dedicated Work in Translation analysis, and 1 min Conclusion.',
    targetDescription: 'Intro (1m) → Literary Work in Original Language & Passage (4m) → Work in Translation & Passage (4m) → Conclusion (1m)',
    segments: [
      {
        id: 'pm_1',
        orderNumber: 1,
        type: 'intro',
        title: 'Introduce Global Issue & Literary Works',
        subtitle: 'GI definition, significance, thesis statement & works (PRL check)',
        quadrant: 'center-top',
        durationSeconds: 60,
        colorKey: 'orange',
        keyPrompts: [
          'What is the Global Issue (GI)? Why does it matter across time, space, and cultures?',
          'How is your GI presented in your original literary work and work in translation? (Answer = Thesis)',
          'Introduce texts clearly (Author, Original Literary Work, Author/Translator, Work in Translation)',
          'Confirm at least one work is from the Prescribed Reading List (PRL)',
          'Clear organizational roadmap without reading a scripted monologue',
        ],
        guidancePoints: [
          'Adhere strictly to 1 minute to preserve analytical time',
          'State thesis with conviction',
          'Remind yourself: At least one work must be on the PRL',
        ],
        giCheckinReminder: 'Check-in: Is your Global Issue clear, transnational, and significant?',
      },
      {
        id: 'pm_2',
        orderNumber: 2,
        type: 'textA_combined',
        title: 'Literary Work in Original Language & Passage (Features 1, 2, 3)',
        subtitle: '4 minutes: Passage examples → Entire work context → Relevance to GI',
        quadrant: 'top-left',
        durationSeconds: 240,
        colorKey: 'rose',
        keyPrompts: [
          'Feature 1: Example from passage → Effects → Examples from entire work → Effects → Relevance to GI',
          'Feature 2: Example from passage → Effects → Examples from entire work → Effects → Relevance to GI',
          'Feature 3: Example from passage → Effects → Examples from entire work → Effects → Relevance to GI',
          'Maintain 50/50 balance between the extract and the broader literary work',
        ],
        guidancePoints: [
          'Aim for ~1m15s to 1m20s per feature checkpoint',
          'Explicitly transition from extract micro-quotes to whole-work macro motifs',
          'Every feature must close with explicit relevance to the Global Issue',
        ],
        giCheckinReminder: 'Check-in: Have you connected Feature 2 back to the Global Issue?',
      },
      {
        id: 'pm_3',
        orderNumber: 3,
        type: 'textB_combined',
        title: 'Work in Translation & Passage (Features 4, 5, 6)',
        subtitle: '4 minutes: Passage examples → Entire work in translation examples → Relevance to GI',
        quadrant: 'top-right',
        durationSeconds: 240,
        colorKey: 'rose',
        keyPrompts: [
          'Feature 4: Example from passage → Effects → Examples from whole work in translation → Effects → Relevance to GI',
          'Feature 5: Example from passage → Effects → Examples from whole work in translation → Effects → Relevance to GI',
          'Feature 6: Example from passage → Effects → Examples from whole work in translation → Effects → Relevance to GI',
          'Balance specific authorial choices in the extract with the broader narrative/poetic scope',
        ],
        guidancePoints: [
          'Address literary devices, figurative language, characterization, and authorial intention',
          'Do NOT compare with Text A—analyze independently through the lens of the GI',
          'Watch the 8-minute mark closely to prepare for the conclusion',
        ],
        giCheckinReminder: 'Check-in: Have you linked this translated work feature directly to the Global Issue?',
      },
      {
        id: 'pm_4',
        orderNumber: 4,
        type: 'conclusion',
        title: 'Conclusion: Synthesis & Evaluation',
        subtitle: 'How both literary works present the GI differently/similarly; authorial efficacy',
        quadrant: 'center-bottom',
        durationSeconds: 60,
        colorKey: 'orange',
        keyPrompts: [
          'How do both literary works present the GI in terms of perspective, form, and craft?',
          'How effective are the writers in achieving their aims regarding the Global Issue?',
          'Final authoritative statement on the enduring human significance of the GI',
          'Finish cleanly within the 10-minute limit',
        ],
        guidancePoints: [
          'Synthesize insights concisely without introducing unanalyzed quotes',
          'End precisely at 9:55–10:00 to avoid examiner penalties',
        ],
        giCheckinReminder: 'Check-in: Final synthesis of how both literary works independently illuminate the Global Issue!',
      },
    ],
  },
  {
    id: 'extract_first',
    name: 'Extract-First Balanced Model',
    badge: 'Micro-to-Macro',
    description: 'Begins with intense micro-analysis of the extract before zooming out to the broader work for both literary texts.',
    targetDescription: 'Intro (1m) → Text A Extract (2m) → Text A Work (2m) → Text B Extract (2m) → Text B Work (2m) → Conclusion (1m)',
    segments: [
      {
        id: 'ef_1',
        orderNumber: 1,
        type: 'intro',
        title: 'Intro: Global Issue & Literary Works',
        subtitle: 'Definition of GI, literary works introduced (PRL check), thesis stated',
        quadrant: 'center-top',
        durationSeconds: 60,
        colorKey: 'amber',
        keyPrompts: [
          'Define Global Issue clearly (broad significance, transnational, local impact)',
          'Identify Literary Work in Original Language & Literary Work in Translation',
          'Confirm that at least one work is from the Prescribed Reading List (PRL)',
          'Deliver clear thesis and roadmap',
        ],
        guidancePoints: ['Keep intro under 1 minute', 'PRL check: at least 1 work from the list'],
        giCheckinReminder: 'Check-in: Global Issue defined and justified?',
      },
      {
        id: 'ef_2',
        orderNumber: 2,
        type: 'textA_extract',
        title: 'TEXT A: Extract (Micro Analysis First)',
        subtitle: 'Original Language Extract: 1–2 specific authorial choices & technique',
        quadrant: 'bottom-left',
        durationSeconds: 120,
        colorKey: 'purple',
        keyPrompts: [
          'Detailed close reading of specific lines in the literary extract (max 40 lines)',
          'Analyze diction, metaphor, syntax, rhythm, imagery, and immediate tone',
          'Connect specific literary technique directly to Global Issue',
        ],
        guidancePoints: ['Analyze 1-2 powerful micro choices in depth with embedded quotes'],
        giCheckinReminder: 'Check-in: Does this literary device reveal the Global Issue?',
      },
      {
        id: 'ef_3',
        orderNumber: 3,
        type: 'textA_work',
        title: 'TEXT A: Overall Literary Work (Macro Scope)',
        subtitle: 'Original Language Work: Broader character arc, motifs, structure, context',
        quadrant: 'top-left',
        durationSeconds: 120,
        colorKey: 'blue',
        keyPrompts: [
          'Zoom out to 1–2 key moments or structural motifs across the entire literary work',
          'Show how the author develops the Global Issue across the full text',
          'Demonstrate equal balance between extract and whole work',
        ],
        guidancePoints: ['Connect extract findings to the full text arc'],
        giCheckinReminder: 'Check-in: How does the whole literary work contextualize the Global Issue?',
      },
      {
        id: 'ef_4',
        orderNumber: 4,
        type: 'textB_extract',
        title: 'TEXT B: Extract in Translation (Micro Analysis First)',
        subtitle: 'Translation Extract: 1–2 specific literary choices in passage',
        quadrant: 'bottom-right',
        durationSeconds: 120,
        colorKey: 'rose',
        keyPrompts: [
          'Detailed analysis of 1–2 choices in the extract studied in translation',
          'Close reading of figurative language, narrative perspective, tone, and pacing',
          'Connect choice to effect and the Global Issue',
        ],
        guidancePoints: ['Specific literary analysis of chosen extract'],
        giCheckinReminder: 'Check-in: How does this literary choice communicate the Global Issue?',
      },
      {
        id: 'ef_5',
        orderNumber: 5,
        type: 'textB_work',
        title: 'TEXT B: Overall Work in Translation',
        subtitle: 'Work in Translation: Wider narrative arc, structural choices, context',
        quadrant: 'top-right',
        durationSeconds: 120,
        colorKey: 'emerald',
        keyPrompts: [
          'Expand to author’s broader literary work studied in translation',
          'Show recurring motifs, structural design, and character development',
          'Tie whole work to the Global Issue without comparing to Text A',
        ],
        guidancePoints: ['Show breadth of knowledge across the whole work in translation'],
        giCheckinReminder: 'Check-in: How does the overall work in translation sustain the Global Issue?',
      },
      {
        id: 'ef_6',
        orderNumber: 6,
        type: 'conclusion',
        title: 'Conclusion: Evaluation & Takeaway',
        subtitle: 'Value of both literary works in presenting the Global Issue',
        quadrant: 'center-bottom',
        durationSeconds: 60,
        colorKey: 'teal',
        keyPrompts: [
          'Synthesize value of both literary works’ representation of the Global Issue',
          'Evaluate authorial efficacy and literary craftsmanship',
          'Final conclusion on the enduring relevance of the Global Issue',
        ],
        guidancePoints: ['Wrap up cleanly before 10:00 cutoff'],
        giCheckinReminder: 'Check-in: Final synthesis of Global Issue understanding.',
      },
    ],
  },
];

export const DISCUSSION_SEGMENT: Segment = {
  id: 'discussion_period',
  orderNumber: 7,
  type: 'discussion',
  title: 'Teacher Discussion & Follow-up Q&A',
  subtitle: '5 minutes: Teacher questions, elaboration, and deeper inquiry',
  quadrant: 'extra',
  durationSeconds: 300,
  colorKey: 'slate',
  keyPrompts: [
    '“You mentioned... could you elaborate further on how the author uses...?”',
    '“How does the historical context of the work amplify this aspect of the GI?”',
    '“What other subtleties or ambiguities did you notice in the extract?”',
    'Demonstrate authentic, conversational mastery of both literary works without scripted recitations',
  ],
  guidancePoints: [
    'Teacher guides questions to help you hit higher criteria bands',
    'Listen carefully, breathe, and refer back to your extracts or broader literary texts',
    'Keep answers focused on authorial choices, literary craft, and the Global Issue',
  ],
  giCheckinReminder: 'Check-in: Ground your responses in specific literary evidence and the Global Issue!',
};

export const DEFAULT_STUDENT_DATA: StudentIOData = {
  studentName: 'Alex Mercer',
  candidateNumber: '001234-0042',
  schoolName: 'International School',
  examDate: '2026-09-23',
  globalIssue: 'The psychological alienation and erosion of individual autonomy in oppressive socio-political systems',
  globalIssueField: 'Politics, power and justice',
  thesisStatement: 'Both George Orwell’s dystopian novel 1984 and Franz Kafka’s novella The Metamorphosis illustrate how dehumanizing institutional pressures strip individuals of agency, using systemic surveillance and existential alienation to dismantle human dignity.',
  textA: {
    title: '1984',
    creator: 'George Orwell',
    medium: 'Dystopian Novel (Original English)',
    extractDetails: 'Part I, Chapter 1 (Lines 24–65: Winston encountering the telescreen and Big Brother poster)',
    isTranslation: false,
    isOnPRL: true,
  },
  textB: {
    title: 'The Metamorphosis',
    creator: 'Franz Kafka',
    medium: 'Novella (Work in Translation)',
    extractDetails: 'Section 1 (Lines 1–45: Gregor’s awakening as an insect and acute anxiety over labor expectations)',
    isTranslation: true,
    originalLanguage: 'German',
    translator: 'Stanley Corngold',
    isOnPRL: true,
  },
  bullets: [
    'Global Issue: Systemic oppression destroying individual psychological autonomy & human dignity.',
    'Works: Orwell’s 1984 (Text A, PRL) & Kafka’s The Metamorphosis (Text B in Translation, PRL). Focus on institutional dehumanization.',
    'Text A Whole Work: Telescreen ubiquity, Thought Police, doublethink eroding Winston’s cognitive reality and psychological independence.',
    'Text A Extract: Personification of the telescreen, claustrophobic sensory imagery, and the menacing gaze of Big Brother.',
    'Text A Extract: Oxymoronic party slogans (“War is Peace”) showing semantic manipulation to suppress independent consciousness.',
    'Text B Whole Work: Samsa’s transformation reflecting existential estrangement, capitalist alienation, and emotional abandonment by family.',
    'Text B Extract: Banal matter-of-fact tone juxtaposed against grotesque physical transformation, highlighting psychological detachment.',
    'Text B Extract: Motifs of the ticking alarm clock and suffocating room symbolizing mechanized labor servitude over human selfhood.',
    'GI Synthesis: Orwell portrays political totalitarianism crushing autonomy, while Kafka portrays socioeconomic alienation causing existential estrangement.',
    'Conclusion: Enduring literary testimony that preserving individual autonomy requires active resistance against dehumanizing systems.',
  ],
  activeTemplateId: 'quadrant_balanced',
  customSegments: TEMPLATE_PRESETS[0].segments,
  soundEnabled: true,
  voiceSpeechEnabled: false,
  giCheckinFrequency: 'normal',
  includeDiscussion: false,
  analysisOrder: 'original_first',
};

export const STORAGE_KEY = 'ib_literature_io_timer_data_v2';

export function getBulletIndicesForSegment(
  segment: Segment,
  analysisOrder: 'original_first' | 'translation_first' = 'original_first'
): number[] {
  const isTranslationFirst = analysisOrder === 'translation_first';

  switch (segment.type) {
    case 'intro':
      return [0, 1];
    case 'textA_work':
      return isTranslationFirst ? [5] : [2];
    case 'textA_extract':
      return isTranslationFirst ? [6, 7] : [3, 4];
    case 'textA_combined':
      return isTranslationFirst ? [5, 6, 7] : [2, 3, 4];
    case 'textB_work':
      return isTranslationFirst ? [2] : [5];
    case 'textB_extract':
      return isTranslationFirst ? [3, 4] : [6, 7];
    case 'textB_combined':
      return isTranslationFirst ? [2, 3, 4] : [5, 6, 7];
    case 'conclusion':
      return [8, 9];
    case 'discussion':
    default:
      return [];
  }
}

export function getBulletPhaseLabel(
  bulletIndex: number,
  analysisOrder: 'original_first' | 'translation_first' = 'original_first'
): string {
  const isTranslationFirst = analysisOrder === 'translation_first';

  switch (bulletIndex) {
    case 0:
      return 'Intro: Global Issue Definition';
    case 1:
      return 'Intro: Literary Works, PRL & Thesis';
    case 2:
      return isTranslationFirst ? 'Text B: Overall Work in Translation' : 'Text A: Overall Literary Work';
    case 3:
      return isTranslationFirst ? 'Text B: Translation Extract (Choice 1)' : 'Text A: Extract Micro-Analysis (Choice 1)';
    case 4:
      return isTranslationFirst ? 'Text B: Translation Extract (Choice 2)' : 'Text A: Extract Micro-Analysis (Choice 2)';
    case 5:
      return isTranslationFirst ? 'Text A: Overall Literary Work' : 'Text B: Overall Work in Translation';
    case 6:
      return isTranslationFirst ? 'Text A: Extract Micro-Analysis (Choice 1)' : 'Text B: Translation Extract (Choice 1)';
    case 7:
      return isTranslationFirst ? 'Text A: Extract Micro-Analysis (Choice 2)' : 'Text B: Translation Extract (Choice 2)';
    case 8:
      return 'Synthesis: Global Issue Exploration';
    case 9:
      return 'Conclusion: Final Evaluation & Takeaway';
    default:
      return `Speaking Point #${bulletIndex + 1}`;
  }
}

export function getBulletMappingDescription(
  bulletIndex: number,
  analysisOrder: 'original_first' | 'translation_first' = 'original_first'
): { quadrant: string; chevron: string } {
  const isTranslationFirst = analysisOrder === 'translation_first';

  if (!isTranslationFirst) {
    switch (bulletIndex) {
      case 0:
        return { quadrant: 'Center-Top (Intro - Block 1)', chevron: 'Intro (1 min)' };
      case 1:
        return { quadrant: 'Center-Top (Intro - Block 1)', chevron: 'Intro (1 min)' };
      case 2:
        return { quadrant: 'Top-Left (Text A Overall Work - Block 2)', chevron: 'Original Literary Work (Feature 1)' };
      case 3:
        return { quadrant: 'Bottom-Left (Text A Extract - Block 3)', chevron: 'Original Literary Work (Feature 2)' };
      case 4:
        return { quadrant: 'Bottom-Left (Text A Extract - Block 3)', chevron: 'Original Literary Work (Feature 3)' };
      case 5:
        return { quadrant: 'Top-Right (Text B Overall Work in Translation - Block 4)', chevron: 'Work in Translation (Feature 4)' };
      case 6:
        return { quadrant: 'Bottom-Right (Text B Extract - Block 5)', chevron: 'Work in Translation (Feature 5)' };
      case 7:
        return { quadrant: 'Bottom-Right (Text B Extract - Block 5)', chevron: 'Work in Translation (Feature 6)' };
      case 8:
        return { quadrant: 'Center-Bottom (Conclusion - Block 6)', chevron: 'Conclusion (Synthesis)' };
      case 9:
        return { quadrant: 'Center-Bottom (Conclusion - Block 6)', chevron: 'Conclusion (Evaluation)' };
      default:
        return { quadrant: 'General', chevron: 'General' };
    }
  } else {
    // Work in Translation analyzed first
    switch (bulletIndex) {
      case 0:
        return { quadrant: 'Center-Top (Intro - Block 1)', chevron: 'Intro (1 min)' };
      case 1:
        return { quadrant: 'Center-Top (Intro - Block 1)', chevron: 'Intro (1 min)' };
      case 2:
        return { quadrant: 'Top-Right (Text B Overall Work in Translation - Block 2)', chevron: 'Work in Translation (Feature 1)' };
      case 3:
        return { quadrant: 'Bottom-Right (Text B Extract - Block 3)', chevron: 'Work in Translation (Feature 2)' };
      case 4:
        return { quadrant: 'Bottom-Right (Text B Extract - Block 3)', chevron: 'Work in Translation (Feature 3)' };
      case 5:
        return { quadrant: 'Top-Left (Text A Overall Work - Block 4)', chevron: 'Original Literary Work (Feature 4)' };
      case 6:
        return { quadrant: 'Bottom-Left (Text A Extract - Block 5)', chevron: 'Original Literary Work (Feature 5)' };
      case 7:
        return { quadrant: 'Bottom-Left (Text A Extract - Block 5)', chevron: 'Original Literary Work (Feature 6)' };
      case 8:
        return { quadrant: 'Center-Bottom (Conclusion - Block 6)', chevron: 'Conclusion (Synthesis)' };
      case 9:
        return { quadrant: 'Center-Bottom (Conclusion - Block 6)', chevron: 'Conclusion (Evaluation)' };
      default:
        return { quadrant: 'General', chevron: 'General' };
    }
  }
}

export function swapAnalysisOrder(data: StudentIOData): StudentIOData {
  const currentOrder = data.analysisOrder || 'original_first';
  const newOrder: 'original_first' | 'translation_first' =
    currentOrder === 'original_first' ? 'translation_first' : 'original_first';

  // IMPORTANT: The categorization of textA and textB does NOT swap.
  // textA remains Original Language Literary Work; textB remains Work in Translation.
  
  // Reorder customSegments sequence between intro and conclusion
  const segments = [...(data.customSegments || [])];
  const introSeg = segments.find((s) => s.type === 'intro');
  const conclusionSeg = segments.find((s) => s.type === 'conclusion');
  const discussionSeg = segments.find((s) => s.type === 'discussion');

  const textASegments = segments.filter((s) => s.type.startsWith('textA'));
  const textBSegments = segments.filter((s) => s.type.startsWith('textB'));

  const middleSegments = newOrder === 'translation_first'
    ? [...textBSegments, ...textASegments]
    : [...textASegments, ...textBSegments];

  const newSegments: Segment[] = [];
  if (introSeg) newSegments.push(introSeg);
  newSegments.push(...middleSegments);
  if (conclusionSeg) newSegments.push(conclusionSeg);
  if (discussionSeg) newSegments.push(discussionSeg);

  // Update order numbers sequentially
  newSegments.forEach((seg, i) => {
    seg.orderNumber = i + 1;
  });

  // Reorder the candidate speaking bullets for the two works
  // Bullets 2, 3, 4 are the 1st analyzed work; Bullets 5, 6, 7 are the 2nd analyzed work
  const newBullets = [...(data.bullets || [])];
  while (newBullets.length < 10) newBullets.push('');

  const firstWorkBullets = [newBullets[2], newBullets[3], newBullets[4]];
  const secondWorkBullets = [newBullets[5], newBullets[6], newBullets[7]];

  newBullets[2] = secondWorkBullets[0];
  newBullets[3] = secondWorkBullets[1];
  newBullets[4] = secondWorkBullets[2];

  newBullets[5] = firstWorkBullets[0];
  newBullets[6] = firstWorkBullets[1];
  newBullets[7] = firstWorkBullets[2];

  return {
    ...data,
    analysisOrder: newOrder,
    customSegments: newSegments,
    bullets: newBullets,
  };
}

export function getPresetSegmentsWithOrder(
  presetId: string,
  order: 'original_first' | 'translation_first' = 'original_first'
): Segment[] {
  const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId) || TEMPLATE_PRESETS[0];
  const baseSegments: Segment[] = JSON.parse(JSON.stringify(preset.segments));

  if (order === 'original_first') {
    return baseSegments;
  }

  // Translation first:
  const introSeg = baseSegments.find((s) => s.type === 'intro');
  const conclusionSeg = baseSegments.find((s) => s.type === 'conclusion');
  const discussionSeg = baseSegments.find((s) => s.type === 'discussion');
  const textASegments = baseSegments.filter((s) => s.type.startsWith('textA'));
  const textBSegments = baseSegments.filter((s) => s.type.startsWith('textB'));

  const reordered: Segment[] = [];
  if (introSeg) reordered.push(introSeg);
  reordered.push(...textBSegments, ...textASegments);
  if (conclusionSeg) reordered.push(conclusionSeg);
  if (discussionSeg) reordered.push(discussionSeg);

  reordered.forEach((seg, i) => {
    seg.orderNumber = i + 1;
  });

  return reordered;
}

export function loadStudentData(): StudentIOData {
  if (typeof window === 'undefined') return DEFAULT_STUDENT_DATA;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old non-lit analysis order if present
      if (parsed.analysisOrder === 'literary_first') {
        parsed.analysisOrder = 'original_first';
      } else if (parsed.analysisOrder === 'non_literary_first') {
        parsed.analysisOrder = 'translation_first';
      }
      return { ...DEFAULT_STUDENT_DATA, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load student data from localStorage', e);
  }
  return DEFAULT_STUDENT_DATA;
}

export function saveStudentData(data: StudentIOData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save student data to localStorage', e);
  }
}
