-- Supabase SQL Schema for Longevity Challenge App

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  primary_archetype TEXT,
  archetype_scores JSONB DEFAULT '{}'::jsonb,
  total_choices_made INTEGER DEFAULT 0,
  longevity_score FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions Table (stores all 180+ scenarios)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  category_order INTEGER NOT NULL,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  option_a_text TEXT NOT NULL,
  option_a_insight JSONB NOT NULL,
  option_b_text TEXT NOT NULL,
  option_b_insight JSONB NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, question_number)
);

-- User Choices Table (tracks every choice a user makes)
CREATE TABLE IF NOT EXISTS user_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id),
  choice TEXT NOT NULL CHECK (choice IN ('A', 'B')),
  reflection TEXT,
  selected_archetype TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Insights Table
CREATE TABLE IF NOT EXISTS weekly_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  choices_summary JSONB,
  dominant_archetype TEXT,
  health_philosophy TEXT,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Category Scores (tracks performance across 15 categories)
CREATE TABLE IF NOT EXISTS category_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  choices_made INTEGER DEFAULT 0,
  score FLOAT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Indexes for performance
CREATE INDEX idx_user_choices_user_id ON user_choices(user_id);
CREATE INDEX idx_user_choices_question_id ON user_choices(question_id);
CREATE INDEX idx_user_choices_timestamp ON user_choices(timestamp);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_weekly_insights_user_id ON weekly_insights(user_id);
CREATE INDEX idx_category_scores_user_id ON category_scores(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can only see their own choices
CREATE POLICY "Users can view own choices" ON user_choices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own choices" ON user_choices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Questions are public (everyone can read)
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Insert all 12 nutrition questions (you'll run this after creating the questions)
-- The app will insert questions via API on first load if they don't exist
