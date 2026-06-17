import { UserChoice } from '../types/index';

export interface Streak {
  current: number;
  best: number;
  lastAnswerDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

// Calculate daily streak
export const calculateStreak = (choices: UserChoice[]): Streak => {
  if (choices.length === 0) {
    return { current: 0, best: 0, lastAnswerDate: null };
  }

  // Sort by date (newest first)
  const sorted = [...choices].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Get unique dates where user answered
  const answerDates = new Set<string>();
  sorted.forEach(choice => {
    const date = new Date(choice.timestamp).toISOString().split('T')[0];
    answerDates.add(date);
  });

  const dates = Array.from(answerDates).sort().reverse();

  if (dates.length === 0) {
    return { current: 0, best: 0, lastAnswerDate: null };
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 1;

  // Check if last answer was today or yesterday
  const lastAnswerDate = dates[0];
  if (lastAnswerDate !== today && lastAnswerDate !== yesterday) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
  }

  // Calculate streaks
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  bestStreak = Math.max(bestStreak, tempStreak);

  if (currentStreak === 0) {
    currentStreak = tempStreak;
  }

  return { current: currentStreak, best: bestStreak, lastAnswerDate };
};

// Unlock badges based on user progress
export const calculateBadges = (choices: UserChoice[]): Badge[] => {
  const badges: Badge[] = [];
  const totalAnswers = choices.length;
  const categoryAnswers = new Map<string, number>();

  // Count answers per category
  choices.forEach(choice => {
    const count = categoryAnswers.get(choice.category) || 0;
    categoryAnswers.set(choice.category, count + 1);
  });

  // Badge: First Steps
  if (totalAnswers >= 1) {
    badges.push({
      id: 'first-steps',
      name: 'First Steps',
      description: 'Answer your first question',
      emoji: '👣',
      unlockedAt: choices[0]?.timestamp,
    });
  }

  // Badge: Curious Mind
  if (totalAnswers >= 10) {
    badges.push({
      id: 'curious-mind',
      name: 'Curious Mind',
      description: 'Answer 10 questions',
      emoji: '🧠',
      unlockedAt: choices[9]?.timestamp,
    });
  }

  // Badge: Wellness Explorer
  if (totalAnswers >= 25) {
    badges.push({
      id: 'wellness-explorer',
      name: 'Wellness Explorer',
      description: 'Answer 25 questions',
      emoji: '🗺️',
      unlockedAt: choices[24]?.timestamp,
    });
  }

  // Badge: Longevity Master
  if (totalAnswers >= 50) {
    badges.push({
      id: 'longevity-master',
      name: 'Longevity Master',
      description: 'Answer 50 questions',
      emoji: '👑',
      unlockedAt: choices[49]?.timestamp,
    });
  }

  // Category badges
  categoryAnswers.forEach((count, category) => {
    if (count >= 5) {
      const categoryLabel = category.replace('-', ' ');
      badges.push({
        id: `${category}-expert`,
        name: `${categoryLabel} Expert`,
        description: `Answer 5 questions in ${categoryLabel}`,
        emoji: '⭐',
        unlockedAt: choices.find(c => c.category === category)?.timestamp,
      });
    }
  });

  return badges;
};

// Get next badge suggestion
export const getNextBadge = (choices: UserChoice[]): Badge | null => {
  const totalAnswers = choices.length;
  const unlockedBadges = calculateBadges(choices);
  const unlockedIds = unlockedBadges.map(b => b.id);

  const allBadges = [
    { id: 'first-steps', threshold: 1, name: 'First Steps', emoji: '👣' },
    { id: 'curious-mind', threshold: 10, name: 'Curious Mind', emoji: '🧠' },
    { id: 'wellness-explorer', threshold: 25, name: 'Wellness Explorer', emoji: '🗺️' },
    { id: 'longevity-master', threshold: 50, name: 'Longevity Master', emoji: '👑' },
  ];

  for (const badge of allBadges) {
    if (!unlockedIds.includes(badge.id) && totalAnswers < badge.threshold) {
      return {
        id: badge.id,
        name: badge.name,
        description: `Answer ${badge.threshold} questions (${totalAnswers}/${badge.threshold})`,
        emoji: badge.emoji,
      };
    }
  }

  return null;
};
