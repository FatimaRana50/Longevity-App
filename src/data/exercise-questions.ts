import { Question } from '../types/index';

export const exerciseQuestions: Question[] = [
  {
    id: 'exercise_1', category: 'exercise', categoryOrder: 2, questionNumber: 1,
    question: 'Would you rather focus on high-intensity interval training for efficiency or moderate steady-state exercise for sustainability?',
    optionA: { text: 'HIIT for maximum efficiency', insight: { text: 'You value peak results per minute and thrive on metabolic challenge.', archetype: 'optimizer', scienceSays: 'HIIT produces 19% greater VO2max improvement per training hour. However, injury rates are 2-3x higher and recovery demands can reduce training frequency.' } },
    optionB: { text: 'Moderate steady-state for long-term sustainability', insight: { text: 'You understand that the best exercise is one you maintain for decades.', archetype: 'balanced-integrator', scienceSays: 'Zone 2 cardio builds mitochondrial density and fat oxidation. Blue Zone populations show moderate daily activity — not intense exercise — as the longevity pattern.' } },
    difficulty: 'medium'
  },
  {
    id: 'exercise_2', category: 'exercise', categoryOrder: 2, questionNumber: 2,
    question: 'Would you rather prioritize strength training for muscle preservation or cardiovascular exercise for heart health?',
    optionA: { text: 'Strength training for muscle preservation', insight: { text: 'You prioritize the critical longevity asset that declines 3-5% per decade after 30.', archetype: 'optimizer', scienceSays: 'Muscle mass is among the strongest predictors of longevity beyond 60. Resistance training preserves bone density, metabolic rate, and independence. WHO recommends strength training 2x/week.' } },
    optionB: { text: 'Cardiovascular exercise for heart health', insight: { text: 'You address the leading cause of death worldwide with the most direct intervention.', archetype: 'prevention-focused', scienceSays: '150 min/week of moderate cardio reduces all-cause mortality by 31%. VO2max is one of the strongest individual predictors of lifespan and cardio is the most effective way to improve it.' } },
    difficulty: 'hard'
  },
  {
    id: 'exercise_3', category: 'exercise', categoryOrder: 2, questionNumber: 3,
    question: 'Would you rather commit to longer exercise sessions with perfect form, or shorter sessions with good-enough technique?',
    optionA: { text: 'Longer sessions with perfect form', insight: { text: 'Precision and depth matter more to you than frequency.', archetype: 'optimizer', scienceSays: 'Perfect form maximizes muscle activation and minimizes injury. However, overtraining accounts for half of gym injuries — recovery matters as much as volume.' } },
    optionB: { text: 'Shorter sessions with good-enough technique', insight: { text: 'You prioritize consistency and frequency — the compounding effect that matters most.', archetype: 'balanced-integrator', scienceSays: 'Even 10-minute exercise bouts provide meaningful cardiovascular and metabolic benefits. Movement frequency is more predictive of longevity outcomes than session perfection.' } },
    difficulty: 'easy'
  },
  {
    id: 'exercise_4', category: 'exercise', categoryOrder: 2, questionNumber: 4,
    question: 'Would you rather focus on functional movement patterns or aesthetic muscle building as your fitness goal?',
    optionA: { text: 'Functional movement for everyday capability', insight: { text: 'You train for life, not the mirror — strength that serves every daily movement.', archetype: 'balanced-integrator', scienceSays: 'Functional fitness predicts independence, fall prevention, and quality of life in aging more reliably than aesthetic muscle. It correlates more strongly with longevity markers.' } },
    optionB: { text: 'Aesthetic muscle building for motivation', insight: { text: 'A body you are proud of drives the consistency that produces long-term health.', archetype: 'optimizer', scienceSays: 'Body composition improvements from aesthetic training improve metabolic health markers. Visible muscle often motivates adherence, though higher injury risk exists when form is compromised.' } },
    difficulty: 'medium'
  },
  {
    id: 'exercise_5', category: 'exercise', categoryOrder: 2, questionNumber: 5,
    question: 'Would you rather work out at home with basic equipment or at a gym with professional guidance and a fitness community?',
    optionA: { text: 'Home workouts with basic equipment', insight: { text: 'Removing friction from your exercise habit is the single greatest adherence strategy.', archetype: 'balanced-integrator', scienceSays: 'Home exercisers maintain 40% higher long-term adherence than gym members. Barrier reduction directly correlates with consistency — proximity is the strongest predictor of habit formation.' } },
    optionB: { text: 'Gym with professional guidance and community', insight: { text: 'You thrive with accountability, expert coaching, and the energy of community.', archetype: 'relationship-centered', scienceSays: 'Group exercise participants show 26% higher adherence rates. Professional guidance reduces injury risk by 35% and significantly accelerates skill acquisition.' } },
    difficulty: 'easy'
  },
  {
    id: 'exercise_6', category: 'exercise', categoryOrder: 2, questionNumber: 6,
    question: 'Would you rather participate in competitive sports with injury risk or choose safe, solo activities that may lack motivation?',
    optionA: { text: 'Competitive sports despite injury risk', insight: { text: 'Social competition drives you in ways no solo activity can replicate.', archetype: 'relationship-centered', scienceSays: 'Competitive athletes show lower all-cause mortality despite injury risk. Social connection and purpose-driven motivation may outweigh physical risks in long-term health outcomes.' } },
    optionB: { text: 'Safe solo activities for joint protection', insight: { text: 'You invest in the physical infrastructure that enables all future activity.', archetype: 'prevention-focused', scienceSays: 'Joint replacement surgeries increased 85% from 2000-2015. Preventive joint care through low-impact activities can delay or avoid surgical intervention and maintain mobility decades longer.' } },
    difficulty: 'medium'
  },
  {
    id: 'exercise_7', category: 'exercise', categoryOrder: 2, questionNumber: 7,
    question: 'Would you rather maintain perfect exercise consistency at lower intensity or sporadic high-intensity sessions when inspired?',
    optionA: { text: 'Consistent lower-intensity exercise daily', insight: { text: 'Regularity is the foundation of all fitness adaptation and health compounding.', archetype: 'prevention-focused', scienceSays: 'Consistent moderate exercise reduces cardiovascular disease risk by 39%. The metabolic benefits of consistency outperform gains from intense but infrequent training over years.' } },
    optionB: { text: 'Sporadic high-intensity sessions when motivated', insight: { text: 'Peak intensity sessions produce unique physiological adaptations that consistency alone cannot.', archetype: 'optimizer', scienceSays: 'High-intensity sessions trigger growth hormone and testosterone spikes. However, inconsistent training creates repeated deconditioning cycles that may reduce net benefit over time.' } },
    difficulty: 'medium'
  },
  {
    id: 'exercise_8', category: 'exercise', categoryOrder: 2, questionNumber: 8,
    question: 'Would you rather spend your exercise time on yoga for flexibility and mindfulness or strength and cardio for fitness?',
    optionA: { text: 'Yoga for flexibility, balance, and mindfulness', insight: { text: 'You see the mind-body connection as the deepest form of physical practice.', archetype: 'naturalist', scienceSays: 'Regular yoga reduces cortisol, improves vascular flexibility markers, and shows measurable reductions in inflammatory markers. Mind-body integration supports holistic healthspan.' } },
    optionB: { text: 'Strength and cardio for measurable fitness', insight: { text: 'You optimize for quantifiable improvements and the strongest evidence-based longevity outcomes.', archetype: 'optimizer', scienceSays: 'VO2max and muscle mass are among the best individual predictors of long-term health. Cardio and resistance training have the strongest evidence base for extending healthspan.' } },
    difficulty: 'hard'
  },
  {
    id: 'exercise_9', category: 'exercise', categoryOrder: 2, questionNumber: 9,
    question: 'Would you rather walk 10,000+ steps daily through lifestyle changes or get steps through dedicated treadmill time?',
    optionA: { text: 'Lifestyle-integrated steps through natural movement', insight: { text: 'Natural movement woven into your day reflects the Blue Zone pattern of effortless activity.', archetype: 'naturalist', scienceSays: 'NEAT (Non-Exercise Activity Thermogenesis) accounts for up to 50% of daily caloric expenditure and independently reduces cardiovascular risk. Blue Zone populations move constantly rather than "exercise."' } },
    optionB: { text: 'Dedicated treadmill sessions for step goals', insight: { text: 'You ensure your activity targets are systematically met regardless of circumstances.', archetype: 'optimizer', scienceSays: 'Structured walking achieves equivalent cardiovascular benefits to lifestyle steps with precise tracking. Essential for those with sedentary jobs where natural movement opportunities are limited.' } },
    difficulty: 'easy'
  },
  {
    id: 'exercise_10', category: 'exercise', categoryOrder: 2, questionNumber: 10,
    question: 'Would you rather continue high-impact activities you love despite joint concerns or switch to low-impact alternatives for joint health?',
    optionA: { text: 'Continue high-impact activities you love', insight: { text: 'The joy and identity from beloved activities is itself a powerful biological driver of health.', archetype: 'relationship-centered', scienceSays: 'Psychological well-being from meaningful activities reduces cortisol and inflammation. However, cumulative cartilage damage can cause arthritis significantly impacting mobility at 60+.' } },
    optionB: { text: 'Switch to low-impact alternatives for joint preservation', insight: { text: 'You invest in the physical infrastructure for all future decades of movement.', archetype: 'prevention-focused', scienceSays: 'Preventive joint care through low-impact alternatives can delay or avoid surgical intervention. Swimming, cycling, and elliptical provide full cardiovascular benefits without joint loading.' } },
    difficulty: 'hard'
  },
  {
    id: 'exercise_11', category: 'exercise', categoryOrder: 2, questionNumber: 11,
    question: 'Would you rather exercise early morning for consistency or evening for stress relief and better performance?',
    optionA: { text: 'Morning exercise for non-negotiable consistency', insight: { text: 'Morning exercise removes all scheduling uncertainty — nothing can displace it.', archetype: 'optimizer', scienceSays: 'Morning exercisers show 45% higher long-term adherence. Metabolic benefits include improved insulin sensitivity throughout the day and better nighttime sleep quality.' } },
    optionB: { text: 'Evening exercise for stress relief and performance', insight: { text: 'You use exercise as a ritual to process the day and transition into recovery.', archetype: 'balanced-integrator', scienceSays: 'Evening exercise reduces accumulated cortisol from work stress. Core body temperature peaks in afternoon/evening, enhancing performance. Recent research shows evening strength training may optimize muscle protein synthesis.' } },
    difficulty: 'easy'
  },
  {
    id: 'exercise_12', category: 'exercise', categoryOrder: 2, questionNumber: 12,
    question: 'Would you rather focus on improving your weakest physical attributes or maximizing your natural strengths?',
    optionA: { text: 'Improve weakest attributes for balanced development', insight: { text: 'Balanced development prevents compensatory injuries and builds complete functional resilience.', archetype: 'optimizer', scienceSays: 'Muscular imbalances are the leading cause of chronic injury. Addressing weaknesses raises the overall performance ceiling more than specializing in existing strengths.' } },
    optionB: { text: 'Maximize natural strengths for mastery', insight: { text: 'Working with your genetics creates sustainable enjoyment and life-long engagement with movement.', archetype: 'naturalist', scienceSays: 'Playing to genetic strengths produces more sustainable enjoyment and long-term adherence. Research suggests aligning training with natural aptitude reduces dropout rates significantly.' } },
    difficulty: 'medium'
  },
];
