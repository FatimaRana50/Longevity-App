import { ArchetypeType } from '../types/index';

export type RiskLevel = 'low' | 'medium' | 'high';

export const archetypeQuestions = [
  'You prefer health choices that are:',
  'To stay healthy you rely mostly on:',
  'When choosing daily habits you value:',
] as const;

export const archetypeOptions = [
  ['A) data-driven, measured, and optimized', 'B) natural, traditional, and whole‑food based'],
  ['A) screenings, tests, and prevention', 'B) relationships, purpose, and social routines'],
  ['A) efficiency and measurable gains', 'B) sustainability and long-term balance'],
] as const;

export const riskQuestions = [
  'If a new supplement promises big benefits with limited evidence, you:',
  'For a fitness program with higher injury risk but faster gains, you:',
  'When a preventive test is invasive but could catch early disease, you:',
] as const;

export const riskOptions = [
  ['A) try it cautiously', 'B) wait for robust evidence'],
  ['A) accept higher risk for faster improvement', 'B) prefer slower, safer progress'],
  ['A) accept it', 'B) avoid unless clear benefit proven'],
] as const;

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
  archetypeOptions,
  riskQuestions,
  riskOptions,
  scoreArchetype,
  computeRiskLevel,
};
