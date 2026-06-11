# Longevity Challenge App - Setup Guide

## Overview
This is a React Native + Expo app that delivers health & wellness dilemmas from "Would You Rather: The Longevity Challenge" by Valentina Teekapa. Users answer "Would You Rather" scenarios across 15 health categories, track their patterns, and discover their longevity philosophy.

## Tech Stack
- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: React Navigation (Bottom Tabs)
- **State Management**: React Context API + AsyncStorage

## Project Structure

```
longevity-challenge/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── QuestionCard.tsx # Main question/option display
│   ├── screens/             # Full screen components
│   │   └── QuestionScreen.tsx
│   ├── context/             # React Context providers
│   │   └── UserContext.tsx
│   ├── services/            # API & external services
│   │   └── supabase.ts      # Supabase client & queries
│   ├── data/                # Static question data
│   │   └── nutrition-questions.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── App.tsx              # Root app component
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
├── .env.example             # Environment variables template
└── supabase_schema.sql      # Database schema
```

## Setup Instructions

### 1. Clone & Install Dependencies
```bash
cd longevity-challenge
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings → API to find:
   - Project URL (SUPABASE_URL)
   - Anon Public Key (SUPABASE_ANON_KEY)

#### Run Database Schema
1. In Supabase dashboard, go to SQL Editor
2. Create a new query and paste contents of `supabase_schema.sql`
3. Run the query to create all tables

#### Enable Authentication (Optional for MVP)
1. Go to Authentication → Providers
2. Enable Email provider
3. Configure redirect URLs if deploying

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Insert Nutrition Questions into Database

#### Option A: Via Supabase UI
1. Go to Table Editor
2. Click `questions` table
3. Click "Insert" and add questions from `src/data/nutrition-questions.ts`

#### Option B: Via SQL (Recommended)
Create a new SQL query in Supabase SQL Editor:

```sql
INSERT INTO questions (id, category, category_order, question_number, question, option_a_text, option_a_insight, option_b_text, option_b_insight, difficulty) VALUES
('nutrition_1', 'nutrition', 1, 1, 
  'Would you rather follow a strict caloric restriction diet that could extend lifespan or eat intuitively with no restrictions but potentially live a shorter life?',
  'Follow a strict caloric restriction diet proven to extend lifespan',
  '{"text":"You''re disciplined and willing to sacrifice comfort for optimal outcomes.","archetype":"optimizer","scienceSays":"Caloric restriction has shown lifespan extension in animal studies, though human evidence is still emerging. The trade-off is reduced quality of life and potential nutritional deficiencies."}',
  'Eat intuitively and enjoy food without restrictions',
  '{"text":"You prioritize present well-being and social connection over theoretical longevity gains.","archetype":"relationship-centered","scienceSays":"Intuitive eating promotes psychological well-being and sustainable habits. However, without awareness, it can lead to overconsumption of processed foods and health decline."}',
  'hard'
);
-- Repeat for remaining 11 nutrition questions...
```

### 5. Run the App

#### Using Expo CLI
```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo app on physical device

#### Using npm scripts
```bash
npm run ios    # iOS simulator
npm run android # Android emulator
npm run web    # Web browser
```

## Feature Implementation Status

### ✅ Completed
- Project structure & TypeScript setup
- Supabase client & database schema
- 12 Nutrition questions with insights
- Question display component (QuestionCard)
- Question screen with answer tracking
- User context & profile management
- Bottom tab navigation skeleton

### 🔄 In Progress
- User authentication with Supabase Auth
- Sync choices to Supabase
- Category filtering

### ⏳ TODO
- Remaining 14 category question sets (Exercise, Sleep, Stress, etc.)
- Archetype scoring & calculation
- Weekly insights generation
- Library screen (browse all questions)
- Journal screen (view history & insights)
- Profile screen (view archetype, stats)
- Social comparison feature
- Search & filter
- Reflection journal
- Analytics dashboard

## Key Data Structures

### Question
```typescript
{
  id: string;
  category: string;
  questionNumber: number;
  question: string;
  optionA: { text: string; insight: { text, archetype, scienceSays } };
  optionB: { text: string; insight: { text, archetype, scienceSays } };
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### UserChoice
```typescript
{
  id: string;
  userId: string;
  questionId: string;
  choice: 'A' | 'B';
  reflection?: string;
  selectedArchetype: string;
  timestamp: Date;
}
```

## Archetype System

The app maps user choices to 5 archetypes based on patterns:
- **Optimizer**: Data-driven, cutting-edge, optimization-focused
- **Naturalist**: Whole-foods, traditional wisdom, environmental values
- **Balanced Integrator**: Practical trade-offs, sustainability focus
- **Relationship-Centered**: Social connection, pleasure, happiness-focused
- **Prevention-Focused**: Disease prevention, conservative, evidence-based

## API Endpoints (Supabase Tables)

### `questions`
- Stores all 180+ scenarios
- Public read access
- Categories: nutrition, exercise, sleep, stress, preventive, biohacking, social, environmental, cognitive, medical, work-life, financial, supplements, aging, legacy

### `user_choices`
- Stores each user's answer to every question
- RLS: User can only see own choices
- Tracks: choice (A/B), reflection, archetype, timestamp

### `user_profiles`
- Stores user metadata
- RLS: User can only see own profile
- Tracks: name, email, archetype scores, longevity score, onboarding status

### `weekly_insights`
- Weekly summaries of user's choices & patterns
- Auto-generated via edge function (TODO)

## Development Workflow

### Adding New Questions
1. Add to appropriate category file in `src/data/`
2. Upload to Supabase via SQL or UI
3. Test in QuestionScreen

### Adding New Screen
1. Create screen component in `src/screens/`
2. Create stack navigator in `App.tsx`
3. Add to bottom tab navigator

### Testing Choices
The app currently uses `test-user` as default. To test with multiple users:
```typescript
// In UserContext.tsx
const testUserId = 'test-user-2'; // Change this
```

## Deployment

### iOS
```bash
npx eas build --platform ios
npx eas submit --platform ios
```

### Android
```bash
npx eas build --platform android
npx eas submit --platform android
```

### Web (Optional)
```bash
npm run build:web
```

## Troubleshooting

### Supabase Connection Error
- Verify EXPO_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check Supabase project is active
- Verify RLS policies are not blocking reads/writes

### Questions Not Loading
- Verify questions table has data
- Check browser console for SQL errors
- Try hard-resetting Expo cache: `npx expo start --clear`

### Auth Issues
- Users must be created in Supabase Auth first
- Email verification may be required
- Check RLS policies on user_profiles table

## Next Steps

1. **Add remaining 14 category questions** (send the data from the book)
2. **Implement authentication** (Supabase Auth signup/login)
3. **Build archetype scoring engine** (calculate primary archetype from choices)
4. **Create insights generation** (weekly reports based on choice patterns)
5. **Build Library & Journal screens** (browse & reflect on past choices)
6. **Add analytics dashboard** (visualize patterns across 15 categories)

## Contact & Support
For issues or feature requests, contact the development team.
