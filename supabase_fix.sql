-- Run this in your Supabase SQL editor
-- It fixes two issues:
--   1. The FK on user_choices.question_id blocks every save (questions table is empty)
--   2. Missing category column means Journal/Profile can't group by category
--   3. Row-level security blocks the app because this build uses a local test user, not Supabase Auth

-- Step 1: Drop the broken foreign key constraint
ALTER TABLE user_choices DROP CONSTRAINT IF EXISTS user_choices_question_id_fkey;

-- Step 2: Add category column so saves include it
ALTER TABLE user_choices ADD COLUMN IF NOT EXISTS category TEXT;

-- Step 3: Allow the Expo app to read/write without Supabase Auth while developing
ALTER TABLE user_choices DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS user_choices_user_question_idx
	ON public.user_choices (user_id, question_id);

GRANT SELECT, INSERT, UPDATE ON public.user_choices TO anon;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO anon;

-- Add risk_tolerance column to user_profiles for onboarding storage
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS risk_tolerance TEXT;
