# Longevity Challenge - React Native App

A mobile app bringing **"Would You Rather: The Longevity Challenge"** by Valentina Teekapa to life. Users answer health & wellness dilemmas across 15 categories, discover their longevity archetype, and track their decision patterns.

## 🎯 Overview

Users face "Would You Rather" scenarios on health topics ranging from nutrition to legacy & purpose. Each choice reveals:
- An **insight** about their philosophy and values
- **Science** explaining the trade-offs
- Patterns across their archetype alignment

The app tracks all choices, generates weekly insights, and helps users become intentional architects of their health destiny.

## ✨ Features

### Currently Implemented ✅
- **React Native + Expo** TypeScript foundation
- **12 Nutrition questions** from the book (ready to add 14 more categories)
- **Question card UI** matching prototype design exactly
- **Choice tracking** with reflection notes
- **Insight display** with science explanations
- **User profiles** with archetype tracking
- **Supabase integration** (PostgreSQL database)
- **Bottom tab navigation** (Today, Library, Journal, Profile)

### Ready to Build 🔄
- **Daily challenge** selection (rotation, category balancing)
- **Archetype scoring** system (5 archetypes, weighted calculation)
- **Weekly insights** generation (choice patterns, philosophy reports)
- **Library screen** (browse all 180+ questions, filter by category)
- **Journal screen** (view history, reflection notes, patterns)
- **Social comparison** (show what % of users chose each option)

### Planned 📋
- User authentication (Supabase Auth)
- Notifications & reminders
- Data export (PDF, CSV)
- Gamification (streaks, badges)
- Advanced analytics dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free at supabase.com)
- Expo CLI: `npm install -g expo-cli`

### Setup (5 minutes)

1. **Clone & install**
   ```bash
   cd longevity-challenge
   npm install
   ```

2. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy Project URL & Anon Key

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Deploy database schema**
   - Open Supabase SQL Editor
   - Paste contents of `supabase_schema.sql`
   - Run query

5. **Insert nutrition questions**
   ```bash
   python3 insert_questions.py
   ```

6. **Run app**
   ```bash
   npx expo start
   ```
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo app on phone

## 📁 Project Structure

```
longevity-challenge/
├── src/
│   ├── App.tsx                      # Root navigation & tabs
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── components/
│   │   └── QuestionCard.tsx         # Main question UI component
│   ├── screens/
│   │   └── QuestionScreen.tsx       # Question display logic
│   ├── context/
│   │   └── UserContext.tsx          # Global user state
│   ├── services/
│   │   └── supabase.ts              # Database client & queries
│   └── data/
│       └── nutrition-questions.ts   # Question data (add more categories here)
├── app.json                         # Expo configuration
├── index.js                         # Entry point
├── tsconfig.json                    # TypeScript config
├── package.json
├── .env.example                     # Environment template
├── supabase_schema.sql              # Database schema
├── SETUP.md                         # Detailed setup guide
├── QUICKSTART.md                    # Quick reference guide
├── IMPLEMENTATION_CHECKLIST.md      # Project status & roadmap
└── README.md                        # This file
```

## 🎮 How It Works

### User Flow
1. **Opens app** → See "Today" tab with a question
2. **Reads question** → "Would you rather... Option A or Option B?"
3. **Selects option** → Gets personalized insight + science explanation
4. **Reflects** (optional) → Writes thoughts about their choice
5. **Submits** → Choice saved to Supabase
6. **Next question** → Cycles to next question

### Data Structures

#### Question
```typescript
{
  id: "nutrition_1";
  category: "nutrition";
  question: "Would you rather...";
  optionA: {
    text: "Option text";
    insight: {
      text: "What this reveals";
      archetype: "optimizer" | "naturalist" | ...;
      scienceSays: "Scientific explanation";
    };
  };
  optionB: { /* same */ };
}
```

#### User Choice
```typescript
{
  userId: "user-123";
  questionId: "nutrition_1";
  choice: "A" | "B";
  reflection: "User's thoughts";
  selectedArchetype: "optimizer";
  timestamp: Date;
}
```

#### Archetype
5 types that emerge from choice patterns:
- **Optimizer**: Data-driven, cutting-edge, optimization-focused
- **Naturalist**: Whole-foods, traditional wisdom, environmental
- **Balanced Integrator**: Practical trade-offs, sustainability
- **Relationship-Centered**: Social connection, pleasure, happiness
- **Prevention-Focused**: Disease prevention, conservative, evidence-based

## 🗄️ Database

### Supabase Tables
- **questions**: All 180+ scenarios
- **user_profiles**: User metadata & archetype scores
- **user_choices**: Every answer & reflection
- **weekly_insights**: Auto-generated summaries
- **category_scores**: Performance per category

### Row Level Security
- Users can only see their own profile & choices
- Questions are public
- Insights are private to user

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-key
```

### Customize
- **Colors**: Edit `QuestionCard.tsx` StyleSheet
- **Fonts**: Configure in `QuestionCard.tsx` and `App.tsx`
- **Categories**: Add to `category` type in `types/index.ts`
- **Archetypes**: Update in types and scoring logic (TBD)

## 📊 UI Components

### QuestionCard
Main question display component
- Question text with "Would you rather..." format
- Two option buttons with radio selection
- Insight box (reveal on selection)
- Science Says box (explanation)
- Reflection text input
- Continue button

**Props**:
```typescript
<QuestionCard
  question={Question}
  onChoice={(choice: 'A' | 'B', reflection?: string) => void}
  answeredCount={number}
  totalQuestions={number}
  loading={boolean}
/>
```

### QuestionScreen
Full screen displaying questions from a category
- Shows current question with QuestionCard
- Tracks progress
- Manages local & cloud state
- Handles navigation between questions

## 🚢 Deployment

### Development
```bash
npx expo start           # Starts dev server
```

### Testing
```bash
npx expo start --ios     # Test on iOS simulator
npx expo start --android # Test on Android emulator
```

### Production
```bash
eas build --platform ios      # Build for App Store
eas build --platform android  # Build for Play Store
eas submit --platform ios
eas submit --platform android
```

## 📋 Adding More Questions

### Step 1: Create data file
Create `src/data/exercise-questions.ts` with same structure as `nutrition-questions.ts`

### Step 2: Add import
In `QuestionScreen.tsx`, import the new questions:
```typescript
import { exerciseQuestions } from '../data/exercise-questions';
```

### Step 3: Update selection logic
In `QuestionScreen.tsx`:
```typescript
const categoryQuestions = category === 'nutrition' 
  ? nutritionQuestions 
  : category === 'exercise'
  ? exerciseQuestions
  : [...];
```

### Step 4: Insert into Supabase
Run updated `insert_questions.py` or manually insert via Supabase UI

### Step 5: Update category filter
In `App.tsx`, add new category to tab options

## 🤝 Contributing

### Adding a Question Category
1. Gather 8-12 questions for the category (following same format)
2. Create `src/data/{category}-questions.ts`
3. Include insights for each option
4. Include science explanations
5. Update `types/index.ts` with category name
6. Submit via pull request or send to team

### Submitting Questions
Format: Google Doc, spreadsheet, or PDF with:
- Category name
- Question number
- Full question text
- Option A text, insight, science says
- Option B text, insight, science says
- Difficulty (easy/medium/hard)

## 🐛 Troubleshooting

### App won't start
```bash
npx expo start --clear  # Clear cache and rebuild
npm install             # Reinstall dependencies
```

### Supabase connection fails
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Check internet connection
- Try: `npx expo start --localhost`

### Questions not displaying
- Verify `questions` table has data
- Check `category` filter in QuestionScreen
- Look for SQL errors in browser console

### Styling looks wrong
- Check device screen size in simulator
- Try rotating device (portrait/landscape)
- Clear app cache: `npx expo start --clear`

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup & configuration
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference & next steps
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Full project roadmap

## 📞 Support

Issues or questions?
- Check troubleshooting above
- Review SETUP.md for detailed instructions
- Check IMPLEMENTATION_CHECKLIST.md for project status
- Contact development team: [contact info]

## 📈 Roadmap

### Phase 1: ✅ DONE
- React Native + Expo setup
- 12 Nutrition questions
- UI components & screens
- Supabase integration

### Phase 2: 🔄 IN PROGRESS
- Remaining 14 category questions
- Daily question selection logic
- Archetype scoring

### Phase 3: ⏳ NEXT
- Library, Journal, Profile screens
- Weekly insights generation
- Social comparison feature

### Phase 4: 📋 PLANNED
- User authentication
- Notifications
- Data export
- Advanced analytics

## 📄 License

This app implements "Would You Rather: The Longevity Challenge" by Valentina Teekapa.
All rights reserved. See original work for licensing details.

---

**Built with**: React Native, Expo, TypeScript, Supabase, React Navigation

**Last Updated**: 2026-06-11

**Status**: Phase 1 Complete → Ready for Phase 2 (Questions)
