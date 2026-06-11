# Longevity Challenge - Quick Start

## What's Ready Now ✅

1. **Complete React Native + Expo project** with TypeScript
2. **Full Question/Option UI component** matching your prototype exactly
3. **12 Nutrition questions** from the book with insights & science explanations
4. **Supabase database schema** ready to deploy
5. **User profile & choice tracking** system
6. **Bottom tab navigation** (Today, Library, Journal, Profile)

## What You Need to Do Next

### Step 1: Create Supabase Project (5 min)
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to Settings → API and copy:
   - Project URL
   - Anon Public Key

### Step 2: Deploy Database Schema (2 min)
1. In Supabase dashboard, go to SQL Editor
2. Create new query, paste contents of `supabase_schema.sql`
3. Click "Run"

### Step 3: Configure Environment (1 min)
```bash
cd longevity-challenge
cp .env.example .env.local
```

Edit `.env.local` and paste your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Insert Nutrition Questions (2 min)
Option A: Copy-paste data via Supabase UI
- Go to Table Editor → questions
- Click "Insert" and manually add 12 nutrition questions

Option B: Use the Python script (attached)
```bash
python insert_questions.py
```

### Step 5: Run the App (1 min)
```bash
npm install
npx expo start
```

Then:
- Press `i` for iOS
- Press `a` for Android
- Scan QR code with Expo app

## The App Right Now

When you launch, you'll see:
1. **Bottom navigation** with 4 tabs: Today, Library, Journal, Profile
2. **Today tab** shows a question card with:
   - Question text
   - Two options (A & B)
   - Click to select an option
   - Shows insight & science explanation
   - Optional reflection text box
   - Continue button saves your choice

## What's Next

After confirming the UI works, you need to send:

### 1. Remaining Questions (14 categories × 8-12 questions each)

For each question in each category:
```
Category: [Exercise, Sleep, Stress, etc.]
Question #: [1-12]
Question: "Would you rather [option A text] or [option B text]?"
Option A:
  - Text: "..."
  - Insight: "..." (what this reveals about the person)
  - Science Says: "..." (2-3 sentence explanation)
Option B:
  - Text: "..."
  - Insight: "..."
  - Science Says: "..."
```

Format: Send as Google Doc, Excel spreadsheet, or PDF from the book

### 2. Confirm Archetypes

Current 5 archetypes (confirm or change):
- **Optimizer**: Data-driven, cutting-edge, optimization-focused
- **Naturalist**: Whole-foods, traditional, environmental
- **Balanced Integrator**: Practical trade-offs, sustainability
- **Relationship-Centered**: Social, pleasure, happiness
- **Prevention-Focused**: Disease prevention, conservative

Should these stay the same, or use different names/definitions from the book?

### 3. Feature Priority (for next sprints)

Which are most important?
- [ ] Daily question selection algorithm (avoid repeats, rotate categories)
- [ ] Archetype scoring & display (show user their primary archetype)
- [ ] Library screen (browse all questions by category)
- [ ] Journal screen (view all past choices & patterns)
- [ ] Weekly insights (AI-generated or templated reports)
- [ ] Social comparison (show what % chose A vs B)
- [ ] User authentication (login/signup)
- [ ] Mobile app icon & splash screen design

## File Structure Quick Reference

```
longevity-challenge/
├── src/
│   ├── components/QuestionCard.tsx    ← Main question UI (matches prototype)
│   ├── screens/QuestionScreen.tsx     ← Question logic & routing
│   ├── data/nutrition-questions.ts    ← 12 questions (ready to add more)
│   ├── App.tsx                        ← Navigation setup
│   └── ...
├── supabase_schema.sql                ← Database schema (deploy this)
├── SETUP.md                           ← Detailed setup guide
├── IMPLEMENTATION_CHECKLIST.md        ← Full project status
└── package.json
```

## Troubleshooting

**"Can't connect to Supabase"**
- Check your .env.local has correct credentials
- Verify Supabase project is active
- Run `npx expo start --clear` to reset

**"Questions not showing"**
- Verify questions were inserted into Supabase
- Check `questions` table has data

**"App crashes on startup"**
- Check console for error messages
- Make sure all dependencies installed: `npm install`

## File Locations for Incoming Questions

When you send the remaining 14 categories, I'll add them to:
```
src/data/
├── exercise-questions.ts
├── sleep-questions.ts
├── stress-questions.ts
├── preventive-questions.ts
├── biohacking-questions.ts
├── social-questions.ts
├── environmental-questions.ts
├── cognitive-questions.ts
├── medical-questions.ts
├── worklife-questions.ts
├── financial-questions.ts
├── supplements-questions.ts
├── aging-questions.ts
└── legacy-questions.ts
```

Then they'll be automatically available in the app.

## Current Models

The app already has these components ready:

### QuestionCard Component
- Displays "Would You Rather" question
- Two selectable options
- Shows insight when selected
- Shows science explanation
- Optional reflection input
- Matches your prototype exactly

### Question Data Structure
```typescript
{
  id: string;
  category: string;
  question: string;
  optionA: {
    text: string;
    insight: {
      text: string;
      archetype: 'optimizer' | 'naturalist' | ...;
      scienceSays: string;
    }
  };
  optionB: { /* same */ };
}
```

## Next Meeting Agenda

1. ✅ Review the running app (verify UI matches designs)
2. 📋 Discuss remaining features (which are critical?)
3. 📚 Collect questions for remaining 14 categories
4. 🎨 Finalize app icon & branding
5. 📱 Decide on iOS vs Android first, or both?
6. 📅 Set timeline for MVP launch

## Questions?

- How to run the app?
- How to add more questions?
- How to customize the UI?
- How to deploy to App Store?
- Need different archetype system?

Let me know and I'll help!

---

**Status**: Ready to test → Waiting for remaining questions → Ready for Phase 2

**Current Estimate to MVP**: 2-3 weeks (depending on question data arrival)
