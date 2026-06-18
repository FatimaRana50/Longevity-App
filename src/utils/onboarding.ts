import { ArchetypeType } from '../types/index';

export type RiskLevel = 'low' | 'medium' | 'high';

type Question = {
  question: string;
  optionA: string;
  optionB: string;
};

export const archetypeQuestions: Question[] = [
  {
    question: 'You prefer health choices that are:',
    optionA: 'Data-driven, measured, and optimized',
    optionB: 'Natural, traditional, and whole-food based',
  },
  {
    question: 'To stay healthy you rely mostly on:',
    optionA: 'Screenings, tests, and prevention',
    optionB: 'Relationships, purpose, and social routines',
  },
  {
    question: 'When choosing daily habits you value:',
    optionA: 'Efficiency and measurable gains',
    optionB: 'Sustainability and long-term balance',
  },
];

export const riskQuestions: Question[] = [
  {
    question: 'If a new supplement promises big benefits with limited evidence, you:',
    optionA: 'Try it cautiously',
    optionB: 'Wait for robust evidence',
  },
  {
    question: 'For a fitness program with higher injury risk but faster gains, you:',
    optionA: 'Accept higher risk for faster improvement',
    optionB: 'Prefer slower, safer progress',
  },
  {
    question: 'When a preventive test is invasive but could catch early disease, you:',
    optionA: 'Accept it',
    optionB: 'Avoid unless clear benefit proven',
  },
];

// Map archetype answers (index -> A/B) into weight vectors
export function scoreArchetype(answers: ('A' | 'B')[]): ArchetypeType {
  const scores: Record<ArchetypeType, number> = {
    optimizer: 0,
    naturalist: 0,
    'balanced-integrator': 0,
    'relationship-centered': 0,
    'prevention-focused': 0,
  };

  // Q1
  if (answers[0] === 'A') scores.optimizer += 2; else scores.naturalist += 2;
  // Q2
  if (answers[1] === 'A') scores['prevention-focused'] += 2; else scores['relationship-centered'] += 2;
  // Q3
  if (answers[2] === 'A') scores.optimizer += 1; else scores['balanced-integrator'] += 1;

  const entries = Object.entries(scores) as [ArchetypeType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function computeRiskLevel(answers: ('A' | 'B')[]): RiskLevel {
  // interpret 'A' as higher personal risk-tolerance in these prompts
  const aCount = answers.filter(a => a === 'A').length;
  if (aCount >= 2) return 'high';
  if (aCount === 1) return 'medium';
  return 'low';
}

export default {
  archetypeQuestions,
  riskQuestions,
  scoreArchetype,
  computeRiskLevel,
};
