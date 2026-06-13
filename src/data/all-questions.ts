import { Question } from '../types/index';
import { nutritionQuestions } from './nutrition-questions';
import { exerciseQuestions } from './exercise-questions';
import { sleepQuestions } from './sleep-questions';
import { stressQuestions } from './stress-questions';
import { preventiveQuestions } from './preventive-questions';
import { biohackingQuestions } from './biohacking-questions';
import { socialQuestions } from './social-questions';
import { environmentalQuestions } from './environmental-questions';
import { cognitiveQuestions } from './cognitive-questions';
import { medicalQuestions } from './medical-questions';
import { worklifeQuestions } from './worklife-questions';
import { financialQuestions } from './financial-questions';
import { supplementsQuestions } from './supplements-questions';
import { agingQuestions } from './aging-questions';
import { legacyQuestions } from './legacy-questions';

export const allQuestions: Question[] = [
  ...nutritionQuestions,
  ...exerciseQuestions,
  ...sleepQuestions,
  ...stressQuestions,
  ...preventiveQuestions,
  ...biohackingQuestions,
  ...socialQuestions,
  ...environmentalQuestions,
  ...cognitiveQuestions,
  ...medicalQuestions,
  ...worklifeQuestions,
  ...financialQuestions,
  ...supplementsQuestions,
  ...agingQuestions,
  ...legacyQuestions,
];

export interface CategoryMeta {
  id: string;
  label: string;
  icon: string;
  order: number;
  questionCount: number;
}

export const categoryMeta: CategoryMeta[] = [
  { id: 'nutrition', label: 'Nutrition', icon: '🥗', order: 1, questionCount: nutritionQuestions.length },
  { id: 'exercise', label: 'Exercise', icon: '🏃', order: 2, questionCount: exerciseQuestions.length },
  { id: 'sleep', label: 'Sleep', icon: '🌙', order: 3, questionCount: sleepQuestions.length },
  { id: 'stress', label: 'Stress', icon: '🧘', order: 4, questionCount: stressQuestions.length },
  { id: 'preventive', label: 'Preventive Care', icon: '🛡️', order: 5, questionCount: preventiveQuestions.length },
  { id: 'biohacking', label: 'Biohacking', icon: '🔬', order: 6, questionCount: biohackingQuestions.length },
  { id: 'social', label: 'Social', icon: '❤️', order: 7, questionCount: socialQuestions.length },
  { id: 'environmental', label: 'Environmental', icon: '🌿', order: 8, questionCount: environmentalQuestions.length },
  { id: 'cognitive', label: 'Cognitive', icon: '🧠', order: 9, questionCount: cognitiveQuestions.length },
  { id: 'medical', label: 'Medical', icon: '⚕️', order: 10, questionCount: medicalQuestions.length },
  { id: 'work-life', label: 'Work & Life', icon: '⚖️', order: 11, questionCount: worklifeQuestions.length },
  { id: 'financial', label: 'Financial', icon: '💰', order: 12, questionCount: financialQuestions.length },
  { id: 'supplements', label: 'Supplements', icon: '💊', order: 13, questionCount: supplementsQuestions.length },
  { id: 'aging', label: 'Aging', icon: '⏳', order: 14, questionCount: agingQuestions.length },
  { id: 'legacy', label: 'Legacy', icon: '🌟', order: 15, questionCount: legacyQuestions.length },
];

export function getQuestionsByCategory(category: string): Question[] {
  return allQuestions.filter(q => q.category === category);
}
