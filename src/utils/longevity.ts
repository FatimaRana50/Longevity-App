import { allQuestions, categoryMeta } from '../data/all-questions';
import { ArchetypeType, UserChoice } from '../types/index';

const questionCategoryMap: Record<string, string> = Object.fromEntries(
  allQuestions.map(q => [q.id, q.category])
);

export const archetypeLabels: Record<ArchetypeType, { label: string; emoji: string }> = {
  optimizer: { label: 'Optimizer', emoji: '🔬' },
  naturalist: { label: 'Naturalist', emoji: '🌿' },
  'balanced-integrator': { label: 'Balanced Integrator', emoji: '⚖️' },
  'relationship-centered': { label: 'Relationship Centered', emoji: '❤️' },
  'prevention-focused': { label: 'Prevention Focused', emoji: '🛡️' },
};

export function normalizeUserChoice(row: any): UserChoice {
  const questionId = row.question_id ?? row.questionId ?? '';
  return {
    id: row.id ?? `${row.user_id}_${questionId}`,
    userId: row.user_id ?? row.userId ?? '',
    questionId,
    category: row.category ?? questionCategoryMap[questionId] ?? '',
    choice: row.choice,
    reflection: row.reflection ?? undefined,
    timestamp: new Date(row.timestamp ?? row.created_at ?? Date.now()),
    selectedArchetype: row.selected_archetype ?? row.selectedArchetype,
  };
}

export function getLatestUniqueChoices(choices: UserChoice[]) {
  const sorted = [...choices].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const byQuestionId = new Map<string, UserChoice>();

  sorted.forEach(choice => {
    if (!byQuestionId.has(choice.questionId)) {
      byQuestionId.set(choice.questionId, choice);
    }
  });

  return [...byQuestionId.values()];
}

export function getChoiceSummaries(choices: UserChoice[]) {
  const byCategory: Record<string, { answered: number; total: number; score: number }> = {};
  const uniqueChoices = getLatestUniqueChoices(choices);

  categoryMeta.forEach(category => {
    const answered = uniqueChoices.filter(choice => choice.category === category.id).length;
    byCategory[category.id] = {
      answered,
      total: category.questionCount,
      score: category.questionCount > 0 ? Math.round((answered / category.questionCount) * 100) : 0,
    };
  });

  return byCategory;
}

export function getArchetypeCounts(choices: UserChoice[]) {
  return getLatestUniqueChoices(choices).reduce<Record<ArchetypeType, number>>((counts, choice) => {
    const archetype = choice.selectedArchetype;
    if (archetype) {
      counts[archetype] = (counts[archetype] || 0) + 1;
    }
    return counts;
  }, {
    optimizer: 0,
    naturalist: 0,
    'balanced-integrator': 0,
    'relationship-centered': 0,
    'prevention-focused': 0,
  });
}

export function getPrimaryArchetype(choices: UserChoice[]): ArchetypeType | undefined {
  const counts = getArchetypeCounts(choices);
  const entries = Object.entries(counts) as [ArchetypeType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0];
}