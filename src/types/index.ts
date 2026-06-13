export type ArchetypeType = 'optimizer' | 'naturalist' | 'balanced-integrator' | 'relationship-centered' | 'prevention-focused';

export interface OptionInsight {
  text: string;
  archetype: ArchetypeType;
  scienceSays: string;
}

export interface Question {
  id: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'preventive' | 'biohacking' | 'social' | 'environmental' | 'cognitive' | 'medical' | 'work-life' | 'financial' | 'supplements' | 'aging' | 'legacy';
  categoryOrder: number;
  questionNumber: number;
  question: string;
  optionA: {
    text: string;
    insight: OptionInsight;
  };
  optionB: {
    text: string;
    insight: OptionInsight;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt?: Date;
}

export interface UserChoice {
  id: string;
  userId: string;
  questionId: string;
  category: string;
  choice: 'A' | 'B';
  reflection?: string;
  timestamp: Date;
  selectedArchetype?: ArchetypeType;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  onboardingCompleted: boolean;
  primaryArchetype?: ArchetypeType;
  riskTolerance?: 'low' | 'medium' | 'high';
  archetypeScores?: Record<ArchetypeType, number>;
  totalChoicesMade: number;
  longevityScore?: number;
}

export interface WeeklyInsight {
  id: string;
  userId: string;
  weekStart: Date;
  choicesSummary: {
    total: number;
    byCategory: Record<string, number>;
  };
  dominantArchetype: ArchetypeType;
  healthPhilosophy: string;
  recommendations: string[];
}
