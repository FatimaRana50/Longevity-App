# Longevity Challenge - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                         │
│                    (Expo + TypeScript)                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            App.tsx (Root Navigation)                  │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Bottom Tab Navigator                           │ │ │
│  │  │  ┌─────────────┬─────────┬─────────┬─────────┐  │ │ │
│  │  │  │   Today     │ Library │ Journal │ Profile │  │ │ │
│  │  │  │   Screen    │ Screen  │ Screen  │ Screen  │  │ │ │
│  │  │  └─────────────┴─────────┴─────────┴─────────┘  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐  ┌──────▼──────────┐
            │   Components   │  │    Context      │
            │                │  │                 │
            │ QuestionCard   │  │ UserContext     │
            │ (Main UI)      │  │ (Global State)  │
            │                │  │                 │
            └────────────────┘  └──────┬──────────┘
                   ▲                    │
                   │                    ▼
            ┌──────┴──────────┐  ┌───────────────┐
            │   Screens       │  │    Services   │
            │                 │  │               │
            │ QuestionScreen  │  │ supabase.ts   │
            │ (Logic)         │  │ (API Client)  │
            │                 │  │               │
            └────────┬────────┘  └───────┬───────┘
                     │                   │
            ┌────────┴───────────────────┴─────────┐
            │                                       │
       ┌────▼──────┐                        ┌──────▼────┐
       │   Data    │                        │ AsyncStore│
       │           │                        │ (Cache)   │
       │ Nutrition │                        │           │
       │ Questions │                        │ User Data │
       │ (12 Q's)  │                        │ Choices   │
       └───────────┘                        └──────┬────┘
            │                                       │
            └───────────────┬───────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Supabase     │
                    │   PostgreSQL   │
                    │                │
                    │  ┌──────────┐  │
                    │  │Questions │  │
                    │  │ (180+ Q) │  │
                    │  └──────────┘  │
                    │  ┌──────────┐  │
                    │  │User Data │  │
                    │  └──────────┘  │
                    │  ┌──────────┐  │
                    │  │Choices   │  │
                    │  │ (Answers)│  │
                    │  └──────────┘  │
                    │  ┌──────────┐  │
                    │  │Insights  │  │
                    │  │(Weekly)  │  │
                    │  └──────────┘  │
                    │                │
                    └────────────────┘
```

## 📊 Data Flow

### User Answers a Question

```
┌─────────────┐
│ User Opens  │
│ QuestionCard│ ← Shows Question + 2 Options
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ User Selects     │
│ Option (A or B)  │ ← Choice triggers insight display
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Component Shows:     │
│ - Insight text      │
│ - Science explain   │
│ - Reflection input  │ ← User can write optional notes
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ User Clicks      │
│ Continue         │ ← Saves choice
└──────┬───────────┘
       │
       ▼
┌────────────────────────────┐
│ QuestionScreen saves:      │
│ 1. Local state (instant)   │
│ 2. AsyncStorage (backup)   │
│ 3. Supabase (cloud sync)   │
└──────┬─────────────────────┘
       │
       ▼
┌──────────────────┐
│ Move to Next     │
│ Question         │
└──────────────────┘
```

### Syncing to Supabase

```
┌─────────────────────┐
│ User Choice Made    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ db.saveChoice() called:         │
│ - userId                        │
│ - questionId                    │
│ - choice ('A' or 'B')           │
│ - reflection (optional)         │
│ - timestamp                     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ INSERT into user_choices table  │
│                                 │
│ user_id      │ question_id │... │
│ user-123     │ nutrition_1 │... │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Trigger (Auto-calculated):      │
│ - Add to category_scores        │
│ - Update user's archetype       │
│ - Increment total_choices_made  │
└─────────────────────────────────┘
```

## 🔄 Component Hierarchy

```
App.tsx (Root)
│
├── UserProvider (Context)
│   └── NavigationContainer
│       └── RootNavigator (Stack)
│           └── MainTabNavigator (Bottom Tabs)
│               │
│               ├── TodayStack
│               │   └── QuestionScreen
│               │       └── QuestionCard
│               │           ├── OptionButton (x2)
│               │           ├── InsightBox
│               │           ├── ScienceBox
│               │           ├── ReflectionInput
│               │           └── ContinueButton
│               │
│               ├── LibraryStack
│               │   └── LibraryScreen (TODO)
│               │
│               ├── JournalStack
│               │   └── JournalScreen (TODO)
│               │
│               └── ProfileStack
│                   └── ProfileScreen (TODO)
```

## 🗄️ Database Schema

### Tables & Relationships

```
┌──────────────────────┐
│   user_profiles      │
├──────────────────────┤
│ id (PK, UUID)        │
│ email (Unique)       │
│ name                 │
│ created_at           │
│ onboarding_completed │
│ primary_archetype    │
│ archetype_scores     │
│ total_choices_made   │
│ longevity_score      │
└──────┬───────────────┘
       │ (1)
       │
       │ (N)
       └────────────────────────────────┐
                                        │
                    ┌───────────────────┴──────────────┐
                    │                                  │
         ┌──────────▼──────────┐         ┌────────────▼────────┐
         │  user_choices       │         │ category_scores     │
         ├─────────────────────┤         ├─────────────────────┤
         │ id (PK, UUID)       │         │ id (PK, UUID)       │
         │ user_id (FK)        │         │ user_id (FK)        │
         │ question_id (FK)    │────┬──→ │ category            │
         │ choice ('A'/'B')    │    │    │ choices_made        │
         │ reflection          │    │    │ score               │
         │ selected_archetype  │    │    └─────────────────────┘
         │ timestamp           │    │
         └─────────────────────┘    │
                                    │
                    ┌───────────────┘
                    │
         ┌──────────▼──────────┐
         │   questions         │
         ├─────────────────────┤
         │ id (PK, Text)       │
         │ category            │
         │ category_order      │
         │ question_number     │
         │ question (Text)     │
         │ option_a_text       │
         │ option_a_insight    │
         │ option_b_text       │
         │ option_b_insight    │
         │ difficulty          │
         │ created_at          │
         └─────────────────────┘

┌──────────────────────┐
│  weekly_insights     │
├──────────────────────┤
│ id (PK, UUID)        │
│ user_id (FK)         │
│ week_start (Date)    │
│ choices_summary      │
│ dominant_archetype   │
│ health_philosophy    │
│ recommendations      │
└──────────────────────┘
```

## 🔐 Row Level Security (RLS)

```
Table: user_profiles
├── SELECT: auth.uid() = id  (User can see own profile)
├── UPDATE: auth.uid() = id  (User can edit own profile)
└── DELETE: Blocked

Table: user_choices
├── SELECT: auth.uid() = user_id  (User can see own choices)
├── INSERT: auth.uid() = user_id  (User can create own choices)
└── UPDATE/DELETE: Blocked

Table: questions
├── SELECT: Public (anyone can read)
└── INSERT/UPDATE/DELETE: Admin only

Table: weekly_insights
├── SELECT: auth.uid() = user_id  (User can see own insights)
└── INSERT/UPDATE: Auto-generated

Table: category_scores
├── SELECT: auth.uid() = user_id  (User can see own scores)
└── INSERT/UPDATE: Auto-calculated
```

## 🎯 State Management Flow

```
User Context (Global)
│
├── user: UserProfile {
│   ├── id
│   ├── name
│   ├── email
│   ├── primaryArchetype
│   ├── archetypeScores
│   └── longevityScore
│}
│
├── isLoading: boolean
│
└── Methods:
    ├── setUser(user)
    ├── updateProfile(updates)
    └── logout()

QuestionScreen (Local)
│
├── questions: Question[]
├── currentQuestionIndex: number
├── userChoices: Record<string, UserChoice>
├── loading: boolean
│
└── Methods:
    ├── loadQuestions()
    └── handleQuestionAnswer(choice, reflection)

AsyncStorage (Persistence)
│
├── user:profile → UserProfile
├── user:choices → UserChoice[]
└── user:metadata → {streak, lastAnswered, etc.}

Supabase (Cloud Sync)
│
├── Poll for changes
├── Sync offline changes
└── Update remote state
```

## 🔄 Question Selection Algorithm (TODO)

```
Daily Challenge Selection Process:

1. Load today's date
   └─ Get week start (Monday)

2. Get user's answered questions this week
   └─ Query user_choices WHERE timestamp >= weekStart

3. Get all questions
   └─ Filter by user's interests/categories

4. Apply selection rules:
   ├─ Rule 1: No repeats (exclude answered this week)
   ├─ Rule 2: Balance categories
   │  ├─ If nutrition=2, pick from other categories
   │  └─ Rotate through 15 categories
   ├─ Rule 3: Vary difficulty
   │  ├─ 40% easy, 40% medium, 20% hard
   └─ Rule 4: Match user interests

5. Select 3-5 questions
   └─ Return shuffled results

6. Display as "Today's Challenge"
   └─ User answers each question
```

## 🧠 Archetype Scoring Algorithm (TODO)

```
Archetype Mapping:

Each Question has:
├─ Option A → archetype_a: 'optimizer' | 'naturalist' | ...
└─ Option B → archetype_b: 'optimizer' | 'naturalist' | ...

Scoring Logic:
1. Start with empty scores: {optimizer: 0, naturalist: 0, ...}

2. For each user choice:
   ├─ If chose Option A → score[optionA.archetype] += 1
   └─ If chose Option B → score[optionB.archetype] += 1

3. Calculate percentages:
   ├─ optimizer: (3/12) * 100 = 25%
   ├─ naturalist: (4/12) * 100 = 33%
   ├─ balanced-integrator: (2/12) * 100 = 17%
   └─ etc.

4. Determine primary archetype:
   └─ Max score archetype wins

5. Update user profile:
   ├─ Set primaryArchetype
   ├─ Update archetypeScores
   └─ Trigger archetype-specific content

Example User Pattern:
├─ Choice 1 (Nutrition): Selected "caloric restriction" → optimizer
├─ Choice 2 (Exercise): Selected "data-driven training" → optimizer
├─ Choice 3 (Sleep): Selected "track biomarkers" → optimizer
├─ Choice 4 (Nutrition): Selected "plant-based" → naturalist
└─ Result: Primary = "Optimizer" (3/4 = 75%)
```

## 📈 Weekly Insights Generation (TODO)

```
Trigger: Every Sunday at 8am OR user opens app on Sunday

Process:
1. Get week start date (Monday of current week)

2. Query user choices for that week:
   └─ SELECT * FROM user_choices WHERE timestamp >= week_start

3. Generate summary:
   ├─ Count total choices made
   ├─ Break down by category
   │  └─ nutrition: 2, exercise: 1, sleep: 2, ...
   ├─ Find dominant archetype
   │  └─ Most frequent archetype across choices
   └─ Calculate trend
      └─ Compare to previous weeks

4. Generate "Health Philosophy Report":
   ├─ "This week, you made 7 health decisions..."
   ├─ "Your choices suggest a [ARCHETYPE] approach..."
   ├─ "You focused on: [TOP 3 CATEGORIES]..."
   └─ "Next week, explore: [RECOMMENDED CATEGORIES]..."

5. Generate recommendations:
   ├─ If skipped category → "Consider exploring..."
   ├─ If inconsistent archetype → "Notice you're balancing..."
   ├─ If high stress choices → "Remember to prioritize..."
   └─ If low exercise → "Health requires movement..."

6. Store in weekly_insights table:
   └─ INSERT with week_start, summary, recommendations

7. Notify user (optional):
   └─ Push notification: "Your weekly insight is ready!"
```

## 🔗 Integration Points

### Frontend ↔ Supabase
- REST API via `@supabase/supabase-js`
- Real-time subscriptions (optional)
- OAuth with Supabase Auth
- File storage for images (future)

### App ↔ AsyncStorage
- Caching questions locally
- Offline queue for choices
- User preferences
- Session token storage

### App ↔ External APIs (Future)
- Claude API for AI insights
- Health data APIs (HealthKit, Google Fit)
- Analytics services
- Crash reporting (Sentry)

---

## 🚀 Deployment Architecture (Future)

```
┌──────────────┐
│  App Store   │ iOS
│ Play Store   │ Android
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Expo Cloud Build    │
│  (EAS Build)         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Longevity Challenge App    │
│   (Running on User Devices)  │
└──────┬───────────────────────┘
       │
       ├──→ Supabase.co
       │    └─→ PostgreSQL Database
       │    └─→ Realtime APIs
       │    └─→ Auth Service
       │
       ├──→ Analytics (Mixpanel/Amplitude)
       │
       └──→ Error Reporting (Sentry)
```

---

## 📝 Development Workflow

```
1. Local Development
   ├─ Clone repo
   ├─ npm install
   ├─ Configure .env.local
   ├─ npx expo start
   └─ Test on simulator/device

2. Feature Development
   ├─ Create feature branch
   ├─ Implement feature
   ├─ Test functionality
   ├─ Run TypeScript check
   └─ Commit with message

3. Code Review (optional)
   ├─ Create pull request
   ├─ Request review
   ├─ Address feedback
   └─ Merge to main

4. Testing
   ├─ Manual testing
   ├─ Test on iOS & Android
   ├─ Check database sync
   └─ Verify archetype calculations

5. Deployment
   ├─ Build with EAS
   ├─ Submit to app stores
   ├─ Monitor crash reports
   └─ Deploy hotfixes if needed
```

---

**Architecture Last Updated**: June 2026  
**Status**: Phase 1 Complete, Ready for Phase 2  
**Next**: Implement archetype scoring & weekly insights
