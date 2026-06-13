import AsyncStorage from '@react-native-async-storage/async-storage';
import { allQuestions } from '../data/all-questions';
import { db } from './supabase';
import { normalizeUserChoice, getLatestUniqueChoices } from '../utils/longevity';
import { Question } from '../types/index';

const KEY_PREFIX = '@longevity:daily_selection';

export async function getDailySelection(userId: string, dateStr: string, N = 3): Promise<Question[]> {
  const key = `${KEY_PREFIX}:${userId}:${dateStr}`;
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const ids: string[] = JSON.parse(cached);
      return ids.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[];
    }

    const rows = await db.getUserChoices(userId).catch(() => []);
    const unique = getLatestUniqueChoices((rows ?? []).map(normalizeUserChoice));
    const answeredSet = new Set(unique.map(c => c.questionId));

    const unanswered = allQuestions.filter(q => !answeredSet.has(q.id));
    // simple category-balancing: prefer categories with fewest answered
    const answeredByCategory: Record<string, number> = {};
    unique.forEach(c => { answeredByCategory[c.category] = (answeredByCategory[c.category] || 0) + 1; });

    const categories = Array.from(new Set(allQuestions.map(q => q.category)));
    categories.sort((a, b) => (answeredByCategory[a] || 0) - (answeredByCategory[b] || 0));

    const selection: Question[] = [];
    for (const cat of categories) {
      if (selection.length >= N) break;
      const candidates = unanswered.filter(q => q.category === cat);
      if (candidates.length === 0) continue;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      selection.push(pick);
    }

    // fill from remaining unanswered if needed
    while (selection.length < N && unanswered.length > 0) {
      const pick = unanswered[Math.floor(Math.random() * unanswered.length)];
      if (!selection.find(s => s.id === pick.id)) selection.push(pick);
      if (selection.length >= N) break;
    }

    // fallback: if not enough unanswered, allow previously answered but randomized
    if (selection.length < N) {
      const all = [...allQuestions];
      while (selection.length < N && all.length > 0) {
        const idx = Math.floor(Math.random() * all.length);
        const pick = all.splice(idx, 1)[0];
        if (!selection.find(s => s.id === pick.id)) selection.push(pick);
      }
    }

    const ids = selection.map(s => s.id);
    await AsyncStorage.setItem(key, JSON.stringify(ids));
    return selection;
  } catch (err) {
    // on error fallback to first N questions
    return allQuestions.slice(0, N);
  }
}

export async function clearDailyCache(userId: string, dateStr: string) {
  const key = `${KEY_PREFIX}:${userId}:${dateStr}`;
  await AsyncStorage.removeItem(key);
}

export default { getDailySelection, clearDailyCache };
