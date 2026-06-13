import { Question } from '../types/index';

export const sleepQuestions: Question[] = [
  {
    id: 'sleep_1', category: 'sleep', categoryOrder: 3, questionNumber: 1,
    question: 'Would you rather get 7 hours of high quality sleep or 9 hours of average quality sleep per night?',
    optionA: { text: '7 hours of optimized, high-quality sleep', insight: { text: 'Sleep architecture matters more than raw hours — you think in systems.', archetype: 'optimizer', scienceSays: 'Sleep quality metrics (slow-wave percentage, REM cycles) more strongly predict cognitive performance and longevity than total hours. 7 hours of optimized sleep outperforms 9 fragmented hours in most outcome studies.' } },
    optionB: { text: '9 hours of natural, average-quality sleep', insight: { text: 'You accept natural rest without obsessing over optimization.', archetype: 'balanced-integrator', scienceSays: 'Adults sleeping 9 hours show lower all-cause mortality in some population studies. Total sleep duration remains important alongside quality for hormonal regulation and tissue repair.' } },
    difficulty: 'medium'
  },
  {
    id: 'sleep_2', category: 'sleep', categoryOrder: 3, questionNumber: 2,
    question: 'Would you rather maintain a strict sleep schedule, even on weekends, or allow flexibility for social or personal reasons?',
    optionA: { text: 'Strict sleep schedule every day including weekends', insight: { text: 'Circadian consistency is the master regulator of your entire metabolic system.', archetype: 'optimizer', scienceSays: 'Social jetlag — misalignment between biological and social clocks — increases obesity risk by 33% and worsens cardiovascular outcomes. Consistent sleep timing strengthens circadian rhythm entrainment.' } },
    optionB: { text: 'Flexible schedule for social connection', insight: { text: 'Human connection and experience have biological value that offsets some circadian disruption.', archetype: 'relationship-centered', scienceSays: 'Social isolation is as harmful as smoking 15 cigarettes daily. The longevity benefits of meaningful social engagement can offset occasional circadian disruption from schedule flexibility.' } },
    difficulty: 'medium'
  },
  {
    id: 'sleep_3', category: 'sleep', categoryOrder: 3, questionNumber: 3,
    question: 'Would you rather use sleep tracking technology and interventions or trust your body\'s natural cues and basic hygiene practices?',
    optionA: { text: 'Sleep tracking technology and wearables', insight: { text: 'Data illuminates the invisible mechanics of sleep quality.', archetype: 'optimizer', scienceSays: 'Sleep trackers identify actionable patterns: alcohol\'s REM impact, exercise timing effects, temperature optimization. However, "orthosomnia" (tracking anxiety) paradoxically worsens sleep in 15-20% of users.' } },
    optionB: { text: 'Body\'s natural cues and basic hygiene', insight: { text: 'Millions of years of biological evolution produced reliable self-regulation systems.', archetype: 'naturalist', scienceSays: 'Natural sleep cues are highly reliable when aligned with consistent light exposure. Excessive tracking creates anxiety that itself disrupts natural sleep regulation through hyperarousal.' } },
    difficulty: 'medium'
  },
  {
    id: 'sleep_4', category: 'sleep', categoryOrder: 3, questionNumber: 4,
    question: 'Would you rather take natural sleep aids with mild effectiveness or prescription options with more side effects?',
    optionA: { text: 'Natural sleep aids (magnesium, melatonin, herbs)', insight: { text: 'You work with your biology rather than forcing override mechanisms.', archetype: 'naturalist', scienceSays: 'Melatonin, magnesium glycinate, and L-theanine show evidence for sleep quality improvement with minimal side-effect profiles. Natural aids address root causes most effectively when combined with good sleep hygiene.' } },
    optionB: { text: 'Prescription sleep medication for reliable results', insight: { text: 'Serious sleep deprivation is too costly to leave unaddressed.', archetype: 'prevention-focused', scienceSays: 'Chronic poor sleep increases Alzheimer\'s risk by 68% and cardiovascular disease by 48%. When natural methods fail, pharmaceutical intervention may be the appropriate clinical response.' } },
    difficulty: 'hard'
  },
  {
    id: 'sleep_5', category: 'sleep', categoryOrder: 3, questionNumber: 5,
    question: 'Would you rather eliminate all screens before bed or use blue light blocking technology instead?',
    optionA: { text: 'No screens at all before bed', insight: { text: 'Complete elimination removes all uncertainty about sleep-disrupting stimulation.', archetype: 'prevention-focused', scienceSays: 'Blue light suppresses melatonin by up to 85% for hours after exposure. Screen content also elevates cortisol through engagement. Physical elimination is 3-4x more effective than blue light blocking alone.' } },
    optionB: { text: 'Blue light blocking glasses and apps', insight: { text: 'You optimize for both sleep quality and access to information through technological solutions.', archetype: 'optimizer', scienceSays: 'Blue light blocking glasses reduce melatonin suppression by ~58%. However, cognitive stimulation from content remains. Most effective when combined with a shift to calming content after 9pm.' } },
    difficulty: 'easy'
  },
  {
    id: 'sleep_6', category: 'sleep', categoryOrder: 3, questionNumber: 6,
    question: 'Would you rather invest in expensive sleep optimization technology or focus on basic sleep hygiene?',
    optionA: { text: 'Invest in premium sleep technology', insight: { text: 'Marginal gains in sleep quality compound into significant longevity advantages.', archetype: 'optimizer', scienceSays: 'Temperature regulation (65-68°F), complete darkness, and white noise together improve sleep efficiency by 15-25%. Premium sleep technology can provide measurable gains for specific sleep challenges.' } },
    optionB: { text: 'Master the free basics of sleep hygiene', insight: { text: 'The most powerful sleep interventions are free and millennia-tested.', archetype: 'naturalist', scienceSays: 'Consistent timing, morning sunlight, evening darkness, cool temperatures, and avoiding stimulants account for 80% of sleep quality improvement. Basic hygiene has stronger evidence than most sleep technology.' } },
    difficulty: 'easy'
  },
  {
    id: 'sleep_7', category: 'sleep', categoryOrder: 3, questionNumber: 7,
    question: 'Would you rather nap daily to boost performance or avoid naps to protect nighttime sleep?',
    optionA: { text: 'Daily naps for performance and recovery', insight: { text: 'Strategic daytime rest is a performance tool used by the world\'s top performers.', archetype: 'balanced-integrator', scienceSays: '20-minute naps improve alertness by 34% and performance by 54% (NASA). Regular nappers show lower cardiovascular disease risk. Optimal timing is 1-3pm to align with the natural circadian afternoon dip.' } },
    optionB: { text: 'No naps to protect nighttime sleep quality', insight: { text: 'Sleep consolidation is the foundation of sleep architecture optimization.', archetype: 'optimizer', scienceSays: 'Naps longer than 30 minutes can reduce nighttime sleep pressure by 20-30%. For those with insomnia or delayed sleep phase, nap avoidance is often the most effective behavioral intervention.' } },
    difficulty: 'medium'
  },
  {
    id: 'sleep_8', category: 'sleep', categoryOrder: 3, questionNumber: 8,
    question: 'Would you rather discover you have sleep apnea requiring a CPAP machine or chronic insomnia requiring lifestyle overhaul?',
    optionA: { text: 'Sleep apnea — treatable with CPAP', insight: { text: 'A clear diagnosis with a clear solution gives you direct control.', archetype: 'prevention-focused', scienceSays: 'Untreated sleep apnea triples cardiovascular disease risk and increases stroke risk 4x. CPAP therapy normalizes most outcomes and improves quality of life significantly within weeks.' } },
    optionB: { text: 'Chronic insomnia — behaviorally addressable', insight: { text: 'Behavioral root causes require sustainable solutions, not devices.', archetype: 'balanced-integrator', scienceSays: 'CBT-I (Cognitive Behavioral Therapy for Insomnia) achieves 80% remission rates and outperforms sleep medication in long-term outcomes by addressing the cognitive and behavioral drivers of insomnia.' } },
    difficulty: 'hard'
  },
  {
    id: 'sleep_9', category: 'sleep', categoryOrder: 3, questionNumber: 9,
    question: 'Would you rather sleep in a perfectly controlled environment or develop resilience to various sleep conditions?',
    optionA: { text: 'Perfectly controlled sleep environment', insight: { text: 'Every environmental variable optimized compounds into significantly better sleep quality.', archetype: 'optimizer', scienceSays: 'Optimal sleep environment (65-68°F, complete darkness, white noise, 40-60% humidity) together improves sleep efficiency by 15-25% in research settings.' } },
    optionB: { text: 'Build resilience to varied sleep conditions', insight: { text: 'Sleep resilience is a practical superpower for the demands of real life.', archetype: 'balanced-integrator', scienceSays: 'Sleep homeostatic pressure can compensate for some environmental variation. Research shows sleep anxiety about imperfect conditions ("sleep effort") worsens outcomes more than the conditions themselves.' } },
    difficulty: 'medium'
  },
  {
    id: 'sleep_10', category: 'sleep', categoryOrder: 3, questionNumber: 10,
    question: 'Would you rather wake up naturally or use an alarm to adhere to a schedule?',
    optionA: { text: 'Wake naturally without an alarm', insight: { text: 'Completing sleep cycles naturally ensures waking in light sleep for optimal morning function.', archetype: 'naturalist', scienceSays: 'Natural waking aligns with sleep cycle completion (90-110 min cycles). Cortisol awakening response is larger with natural wake-ups, producing better morning energy and lower sleep inertia.' } },
    optionB: { text: 'Fixed alarm for circadian consistency', insight: { text: 'Consistent wake time is the single most important circadian clock regulator.', archetype: 'optimizer', scienceSays: 'Fixed wake time is the cornerstone of CBT-I and circadian optimization. Schedule consistency outweighs the immediate quality difference of natural waking for most long-term sleep outcomes.' } },
    difficulty: 'easy'
  },
  {
    id: 'sleep_11', category: 'sleep', categoryOrder: 3, questionNumber: 11,
    question: 'Would you rather address sleep issues with comprehensive clinic testing or through trial-and-error lifestyle changes?',
    optionA: { text: 'Comprehensive sleep clinic testing', insight: { text: 'Sleep disorders often require objective measurement — subjective experience is unreliable.', archetype: 'prevention-focused', scienceSays: 'Polysomnography detects sleep apnea, RLS, PLMD, and sleep stage abnormalities that self-report cannot. 50-70 million Americans have undiagnosed sleep disorders requiring clinical identification.' } },
    optionB: { text: 'Trial-and-error lifestyle changes first', insight: { text: 'Most sleep issues resolve with behavioral changes requiring no clinical intervention.', archetype: 'naturalist', scienceSays: '70% of insomnia cases are behavioral in origin and respond to sleep hygiene. Starting with lifestyle modifications is cost-effective and often sufficient before expensive clinical testing.' } },
    difficulty: 'medium'
  },
  {
    id: 'sleep_12', category: 'sleep', categoryOrder: 3, questionNumber: 12,
    question: 'Would you rather prioritize deep sleep for physical recovery or REM sleep for cognitive restoration?',
    optionA: { text: 'Deep sleep for physical recovery and repair', insight: { text: 'Physical restoration — muscle repair, immune function, hormone secretion — all happen in deep sleep.', archetype: 'optimizer', scienceSays: 'Slow-wave sleep drives 70% of growth hormone secretion, facilitates muscle protein synthesis, and consolidates immune memory. Athletes show increased deep sleep on training days.' } },
    optionB: { text: 'REM sleep for cognitive and emotional restoration', insight: { text: 'Emotional processing, memory consolidation, and creative insight emerge from REM.', archetype: 'balanced-integrator', scienceSays: 'REM sleep processes emotional experiences, consolidates declarative memory, and clears beta-amyloid linked to Alzheimer\'s. Both stages cycle naturally — the goal is protecting total sleep duration.' } },
    difficulty: 'hard'
  },
];
