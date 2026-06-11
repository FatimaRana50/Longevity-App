import { Question } from '../types/index';

export const nutritionQuestions: Question[] = [
  {
    id: 'nutrition_1',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 1,
    question: 'Would you rather follow a strict caloric restriction diet that could extend lifespan or eat intuitively with no restrictions but potentially live a shorter life?',
    optionA: {
      text: 'Follow a strict caloric restriction diet proven to extend lifespan',
      insight: {
        text: "You're disciplined and willing to sacrifice comfort for optimal outcomes.",
        archetype: 'optimizer',
        scienceSays: 'Caloric restriction has shown lifespan extension in animal studies, though human evidence is still emerging. The trade-off is reduced quality of life and potential nutritional deficiencies.'
      }
    },
    optionB: {
      text: 'Eat intuitively and enjoy food without restrictions',
      insight: {
        text: 'You prioritize present well-being and social connection over theoretical longevity gains.',
        archetype: 'relationship-centered',
        scienceSays: 'Intuitive eating promotes psychological well-being and sustainable habits. However, without awareness, it can lead to overconsumption of processed foods and health decline.'
      }
    },
    difficulty: 'hard'
  },
  {
    id: 'nutrition_2',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 2,
    question: 'Would you rather commit to a plant-based diet for longevity or include high-quality animal proteins for muscle maintenance?',
    optionA: {
      text: 'Commit to a plant-based diet for longevity',
      insight: {
        text: 'You align with environmental values and believe in whole-system health.',
        archetype: 'naturalist',
        scienceSays: 'Plant-based diets reduce cardiovascular disease risk and support longevity. Blue Zone populations live longest on primarily plant-based diets. Risk: ensure adequate B12, iron, and complete proteins.'
      }
    },
    optionB: {
      text: 'Include high-quality animal proteins for muscle maintenance',
      insight: {
        text: 'You understand that functional health requires strategic protein intake, especially with age.',
        archetype: 'optimizer',
        scienceSays: 'Animal proteins provide complete amino acids and support muscle preservation critical for longevity. High-quality sources reduce inflammation risks. Balance matters: quality and quantity over source alone.'
      }
    },
    difficulty: 'medium'
  },
  {
    id: 'nutrition_3',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 3,
    question: 'Would you rather practice intermittent fasting daily for metabolic benefits or eat small, frequent meals for stable energy?',
    optionA: {
      text: 'Practice intermittent fasting daily for metabolic benefits',
      insight: {
        text: 'You embrace metabolic optimization and can tolerate short-term discomfort for physiological adaptation.',
        archetype: 'optimizer',
        scienceSays: 'Intermittent fasting activates autophagy and improves metabolic flexibility. Benefits include improved insulin sensitivity and cognitive clarity. Trade-off: may reduce muscle synthesis if protein intake is inadequate.'
      }
    },
    optionB: {
      text: 'Eat small, frequent meals for stable energy',
      insight: {
        text: 'You value steady energy and functional capacity throughout the day over theoretical metabolic benefits.',
        archetype: 'balanced-integrator',
        scienceSays: 'Frequent meals maintain stable blood sugar and support sustained energy for active individuals. Less research support for longevity compared to fasting, but better for athletic performance.'
      }
    },
    difficulty: 'medium'
  },
  {
    id: 'nutrition_4',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 4,
    question: 'Would you rather personalize your diet and supplement strategy based on advanced genetic/nutritional testing or focus on whole foods and general guidelines, accepting you might miss subtle needs?',
    optionA: {
      text: 'Personalize based on advanced genetic/nutritional testing',
      insight: {
        text: 'You embrace cutting-edge science and data-driven decisions for precise optimization.',
        archetype: 'optimizer',
        scienceSays: 'Genetic testing (MTHFR, APOE, etc.) can guide personalization. However, most recommendations can be achieved through general healthy practices. Personalization adds marginal gains beyond 80/20 basics.'
      }
    },
    optionB: {
      text: 'Focus on whole foods and general guidelines',
      insight: {
        text: 'You trust time-tested wisdom and understand that 80% adherence to basics beats perfect personalization.',
        archetype: 'naturalist',
        scienceSays: 'Population-level studies show whole foods, adequate vegetables, and moderate protein work for most people. Individual genetic variation is real but less impactful than lifestyle consistency.'
      }
    },
    difficulty: 'hard'
  },
  {
    id: 'nutrition_5',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 5,
    question: 'Would you rather eliminate all processed foods and spend 3+ hours daily on meal prep or include some convenience foods to save time for other health activities?',
    optionA: {
      text: 'Eliminate all processed foods and spend 3+ hours daily on meal prep',
      insight: {
        text: 'You believe nutrition is the foundation and worth your most valuable resource: time.',
        archetype: 'prevention-focused',
        scienceSays: 'Whole foods reduce ultra-processed food intake, which is linked to obesity, inflammation, and chronic disease. However, stress from time pressure can negate benefits. Sustainability matters.'
      }
    },
    optionB: {
      text: 'Include convenience foods to save time for other health activities',
      insight: {
        text: 'You understand that perfect nutrition at the cost of exercise, sleep, or relationships is suboptimal.',
        archetype: 'balanced-integrator',
        scienceSays: 'Time poverty is real. Strategic use of quality convenience foods (frozen vegetables, pre-cooked proteins) enables consistency across multiple health pillars. Whole diet approach matters most.'
      }
    },
    difficulty: 'medium'
  },
  {
    id: 'nutrition_6',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 6,
    question: 'Would you rather follow a ketogenic diet for brain health or a Mediterranean diet for heart health?',
    optionA: {
      text: 'Follow a ketogenic diet for brain health',
      insight: {
        text: 'You prioritize cognitive performance and neurological protection over traditional cardiovascular metrics.',
        archetype: 'optimizer',
        scienceSays: 'Ketogenic diets show promise for cognitive function, neuroprotection, and seizure management. Trade-off: long-term cardiovascular impact less studied; LDL can increase in some individuals.'
      }
    },
    optionB: {
      text: 'Follow a Mediterranean diet for heart health',
      insight: {
        text: 'You trust decades of population-level evidence and choose proven strategies over novel approaches.',
        archetype: 'prevention-focused',
        scienceSays: 'Mediterranean diet has the strongest longevity evidence globally. Reduces cardiovascular disease, supports cognitive health, and is sustainable long-term. Blue Zones thrive on variations of this pattern.'
      }
    },
    difficulty: 'hard'
  },
  {
    id: 'nutrition_7',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 7,
    question: 'Would you rather have the consistency of meal prepping the same optimized meals each week, or embrace nutritional variety but less consistency in quality?',
    optionA: {
      text: 'Have consistency of meal prepping the same optimized meals each week',
      insight: {
        text: 'You value discipline and understand that optimization comes from repetition and control.',
        archetype: 'optimizer',
        scienceSays: 'Meal prep consistency ensures nutrient targets are hit consistently. Reduces decision fatigue and supports compliance. Trade-off: monotony can reduce adherence over years.'
      }
    },
    optionB: {
      text: 'Embrace nutritional variety but less consistency in quality',
      insight: {
        text: 'You believe that nutritional diversity and eating enjoyment are crucial for sustainable health.',
        archetype: 'naturalist',
        scienceSays: 'Dietary variety ensures exposure to diverse phytonutrients and supports gut microbiome diversity. Pleasure and sustainability often trump perfection in long-term health outcomes.'
      }
    },
    difficulty: 'easy'
  },
  {
    id: 'nutrition_8',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 8,
    question: 'Would you rather eat organic foods despite the cost or choose conventional foods for variety and savings?',
    optionA: {
      text: 'Eat organic foods despite the cost',
      insight: {
        text: 'You prioritize minimizing pesticide exposure and environmental impact of your food choices.',
        archetype: 'prevention-focused',
        scienceSays: 'Organic foods reduce pesticide exposure, which is scientifically valid for long-term health. However, the nutritional difference is minimal. Cost is high; focus pesticide-heavy items (berries, leafy greens).'
      }
    },
    optionB: {
      text: 'Choose conventional foods for variety and savings',
      insight: {
        text: 'You understand that dietary diversity and adherence matter more than organic certification.',
        archetype: 'balanced-integrator',
        scienceSays: 'Conventional produce with pesticide residues is still far healthier than no produce. FDA oversight minimizes excessive contamination. Eating more conventional vegetables beats less organic ones.'
      }
    },
    difficulty: 'medium'
  },
  {
    id: 'nutrition_9',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 9,
    question: 'Would you rather track every macro and micronutrient strictly or eat mindfully without tracking?',
    optionA: {
      text: 'Track every macro and micronutrient strictly',
      insight: {
        text: 'You believe that what gets measured gets managed, and precision drives results.',
        archetype: 'optimizer',
        scienceSays: 'Nutrient tracking enables awareness and ensures targets are met. Research supports this for reaching specific health goals. Risk: can promote obsessive behaviors or orthorexia if taken to extremes.'
      }
    },
    optionB: {
      text: 'Eat mindfully without tracking',
      insight: {
        text: "You trust your body's signals and believe that mindfulness and intuition are superior to data.",
        archetype: 'naturalist',
        scienceSays: 'Mindful eating supports sustainable habits and emotional regulation around food. Without awareness, however, caloric overconsumption and nutrient gaps can occur silently.'
      }
    },
    difficulty: 'medium'
  },
  {
    id: 'nutrition_10',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 10,
    question: "Would you rather discover you're allergic to your favorite longevity foods or find you're genetically predisposed to metabolic issues?",
    optionA: {
      text: "Discover you're allergic to your favorite longevity foods",
      insight: {
        text: 'You can adapt your approach and find alternative paths to health.',
        archetype: 'balanced-integrator',
        scienceSays: 'Food allergies can be managed with substitution. Allergen avoidance improves health markers immediately. Alternative nutrient sources exist for most allergenic foods.'
      }
    },
    optionB: {
      text: "Find you're genetically predisposed to metabolic issues",
      insight: {
        text: "You understand that genetics inform strategy but don't determine destiny.",
        archetype: 'optimizer',
        scienceSays: 'Genetic predisposition to metabolic issues (insulin resistance, obesity) is real but modifiable through lifestyle. Diet, exercise, and stress management override genetic risk significantly.'
      }
    },
    difficulty: 'hard'
  },
  {
    id: 'nutrition_11',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 11,
    question: 'Would you rather meal prep the same optimized meals every week or have variety but inconsistent nutrition quality?',
    optionA: {
      text: 'Meal prep the same optimized meals every week',
      insight: {
        text: 'You understand that consistency and predictability are the engines of sustained health.',
        archetype: 'optimizer',
        scienceSays: 'Consistent nutrient intake ensures steady health markers and supports compliance. Repetition reduces decision fatigue. Boredom can reduce long-term adherence.'
      }
    },
    optionB: {
      text: 'Have variety but inconsistent nutrition quality',
      insight: {
        text: 'You value experimentation, adventure, and the psychological benefits of food diversity.',
        archetype: 'naturalist',
        scienceSays: 'Variety supports microbiome diversity and prevents nutritional gaps. Inconsistency can lead to missing targets. Mindful variety with tracking can balance both benefits.'
      }
    },
    difficulty: 'easy'
  },
  {
    id: 'nutrition_12',
    category: 'nutrition',
    categoryOrder: 1,
    questionNumber: 12,
    question: 'Would you rather abstain from alcohol for optimal liver health or allow moderate consumption for social and mental well-being?',
    optionA: {
      text: 'Abstain from alcohol for optimal liver health',
      insight: {
        text: 'You prioritize physiological optimization and accept social trade-offs for biological perfection.',
        archetype: 'prevention-focused',
        scienceSays: 'Zero alcohol minimizes liver stress, cancer risk, and inflammation. However, moderate consumption (for some) shows cardiovascular benefits. Individual genetics (ALDH2) affect this significantly.'
      }
    },
    optionB: {
      text: 'Allow moderate consumption for social and mental well-being',
      insight: {
        text: 'You believe that social connection and joy are essential health factors, not just obstacles to optimization.',
        archetype: 'relationship-centered',
        scienceSays: 'Moderate alcohol (1 drink/day for women, 2 for men) in some populations shows cardiovascular benefits. Stress reduction from social bonding provides real health gains. Balance matters.'
      }
    },
    difficulty: 'hard'
  }
];
