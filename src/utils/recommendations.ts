import { UserChoice } from '../types/index';
import { categoryMeta } from '../data/all-questions';

export interface Recommendation {
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
  reason: string;
  progressPercent: number;
}

// Get next recommended category based on progress and archetypes
export const getRecommendations = (choices: UserChoice[]): Recommendation[] => {
  const categoryProgress = new Map<string, { answered: number; total: number }>();

  // Initialize all categories
  categoryMeta.forEach(cat => {
    categoryProgress.set(cat.id, { answered: 0, total: cat.questionCount });
  });

  // Count answered questions per category
  choices.forEach(choice => {
    const current = categoryProgress.get(choice.category);
    if (current) {
      categoryProgress.set(choice.category, {
        ...current,
        answered: current.answered + 1,
      });
    }
  });

  // Score categories for recommendation
  const scored = categoryMeta.map(cat => {
    const progress = categoryProgress.get(cat.id)!;
    const percent = (progress.answered / progress.total) * 100;
    let reason = '';
    let score = 0;

    // Least explored categories get higher priority
    if (percent === 0) {
      reason = 'You haven\'t explored this yet';
      score = 100 - (categoryMeta.indexOf(cat) * 5); // Prioritize earlier categories
    } else if (percent < 50) {
      reason = 'Keep going on this journey';
      score = 50 - percent;
    } else if (percent < 100) {
      reason = 'Almost complete';
      score = 25;
    } else {
      reason = 'You\'ve mastered this';
      score = 0;
    }

    return {
      categoryId: cat.id,
      categoryLabel: cat.label,
      categoryIcon: cat.icon,
      reason,
      progressPercent: percent,
      score,
    };
  });

  // Return top 3 recommendations
  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...rec }) => rec);
};

// Get the single best next recommendation
export const getTopRecommendation = (choices: UserChoice[]): Recommendation | null => {
  const recommendations = getRecommendations(choices);
  return recommendations.length > 0 ? recommendations[0] : null;
};

// Personalized recommendation message based on user archetype
export const getRecommendationMessage = (archetype: string | undefined, categoryLabel: string): string => {
  const messages: Record<string, Record<string, string>> = {
    'optimizer': {
      'Nutrition': 'As an Optimizer, dive into Nutrition to maximize your metabolic efficiency.',
      'Exercise': 'Perfect for optimizers: explore Exercise science and data-driven fitness.',
      'Sleep': 'Optimize your sleep cycle with evidence-based insights.',
      'default': `Continue optimizing your health with ${categoryLabel}.`,
    },
    'naturalist': {
      'Nutrition': 'Explore whole foods and ancestral wisdom in Nutrition.',
      'Environmental': 'As a Naturalist, Environmental health aligns with your philosophy.',
      'Social Connections': 'Nurture your community with these Social Connection insights.',
      'default': `Honor your natural approach with ${categoryLabel}.`,
    },
    'balanced-integrator': {
      'Stress': 'Find balance and manage stress with practical strategies.',
      'Work-Life Integration': 'Perfect for integrators: balance work and wellness.',
      'default': `Maintain your holistic balance with ${categoryLabel}.`,
    },
    'relationship-centered': {
      'Social Connections': 'As a People-Focused type, Social Connections awaits you.',
      'Aging Gracefully': 'Explore meaning and connection in your longevity journey.',
      'Legacy & Purpose': 'Share your wisdom and purpose with this category.',
      'default': `Deepen your connections through ${categoryLabel}.`,
    },
    'prevention-focused': {
      'Preventive Medicine': 'Explore screening and prevention strategies.',
      'Medical Interventions': 'As prevention-focused, learn about medical options.',
      'default': `Stay ahead of health risks with ${categoryLabel}.`,
    },
  };

  const archetypeMessages = archetype ? messages[archetype] : null;
  const message = archetypeMessages?.[categoryLabel] || archetypeMessages?.['default'] || `Explore ${categoryLabel} to deepen your longevity knowledge.`;

  return message;
};
