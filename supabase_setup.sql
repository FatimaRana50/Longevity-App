-- ============================================================
-- The Longevity Game — Full Database Setup
-- Based on docs/backend-schema.md
-- Run AFTER supabase_reset.sql
-- ============================================================

-- ── Helper: auto-update updated_at ───────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


-- ── profiles ─────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id                      uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   text        NOT NULL UNIQUE,
  name                    text        NOT NULL DEFAULT '',
  age_range               text,
  gender                  text,
  country                 text,
  interests               text[]      NOT NULL DEFAULT '{}',
  goals                   text[]      NOT NULL DEFAULT '{}',
  archetype               text,
  dimension_scores        jsonb       NOT NULL DEFAULT '{}',
  onboarding_completed    boolean     NOT NULL DEFAULT false,
  subscription_status     text        NOT NULL DEFAULT 'free',
  subscription_expires_at timestamptz,
  stripe_customer_id      text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── questions ────────────────────────────────────────────────
CREATE TABLE public.questions (
  id                         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category                   text        NOT NULL,
  question_text              text        NOT NULL,
  option_a_text              text        NOT NULL,
  option_b_text              text        NOT NULL,
  option_a_insight           text,
  option_b_insight           text,
  option_a_archetype         text,
  option_b_archetype         text,
  option_a_dimension_weights jsonb       NOT NULL DEFAULT '{}',
  option_b_dimension_weights jsonb       NOT NULL DEFAULT '{}',
  difficulty                 text        NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  tags                       text[]      NOT NULL DEFAULT '{}',
  is_active                  boolean     NOT NULL DEFAULT true,
  is_premium                 boolean     NOT NULL DEFAULT false,
  created_at                 timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_read_authenticated"
  ON public.questions FOR SELECT TO authenticated USING (is_active = true);

CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_active   ON public.questions(is_active, is_premium);

GRANT ALL ON public.questions TO service_role, postgres;


-- ── user_choices ─────────────────────────────────────────────
CREATE TABLE public.user_choices (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id        uuid        NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option    text        NOT NULL CHECK (selected_option IN ('A','B')),
  selected_archetype text,
  category           text,
  skipped            boolean     NOT NULL DEFAULT false,
  reflection         text,
  mood               text        CHECK (mood IN ('great','good','neutral','reflective','uncertain')),
  tags               text[]      NOT NULL DEFAULT '{}',
  answered_at        timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE public.user_choices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "choices_all_own" ON public.user_choices FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_user_choices_user_id  ON public.user_choices(user_id);
CREATE INDEX idx_user_choices_answered ON public.user_choices(user_id, answered_at DESC);

CREATE TRIGGER choices_updated_at
  BEFORE UPDATE ON public.user_choices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── daily_challenges ─────────────────────────────────────────
CREATE TABLE public.daily_challenges (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date         date        NOT NULL,
  question_ids uuid[]      NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_challenges_all_own" ON public.daily_challenges FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_daily_challenges_user ON public.daily_challenges(user_id, date);


-- ── journal_entries ──────────────────────────────────────────
CREATE TABLE public.journal_entries (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title               text,
  body                text        NOT NULL,
  mood                text        CHECK (mood IN ('great','good','neutral','reflective','uncertain')),
  tags                text[]      NOT NULL DEFAULT '{}',
  related_question_id uuid        REFERENCES public.questions(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journal_all_own" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_journal_user ON public.journal_entries(user_id, created_at DESC);

CREATE TRIGGER journal_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── streaks ──────────────────────────────────────────────────
CREATE TABLE public.streaks (
  user_id                  uuid        PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak           integer     NOT NULL DEFAULT 0,
  longest_streak           integer     NOT NULL DEFAULT 0,
  last_activity_date       date,
  total_questions_answered integer     NOT NULL DEFAULT 0,
  updated_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks_select_own" ON public.streaks FOR SELECT USING (auth.uid() = user_id);

CREATE TRIGGER streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── badges ───────────────────────────────────────────────────
CREATE TABLE public.badges (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_slug  text        NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_slug)
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select_own" ON public.badges FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_badges_user ON public.badges(user_id);


-- ── couples ──────────────────────────────────────────────────
CREATE TABLE public.couples (
  id                  uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id        uuid         NOT NULL REFERENCES public.profiles(id),
  partner_id          uuid         REFERENCES public.profiles(id),
  invite_code         text         NOT NULL UNIQUE,
  status              text         NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','disconnected')),
  compatibility_score numeric(5,2),
  created_at          timestamptz  NOT NULL DEFAULT now(),
  updated_at          timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "couples_select_own" ON public.couples FOR SELECT
  USING (auth.uid() = initiator_id OR auth.uid() = partner_id);

CREATE TRIGGER couples_updated_at
  BEFORE UPDATE ON public.couples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── friends ──────────────────────────────────────────────────
CREATE TABLE public.friends (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id),
  friend_id  uuid        NOT NULL REFERENCES public.profiles(id),
  status     text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friends_select_own" ON public.friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);


-- ── ai_insights ──────────────────────────────────────────────
CREATE TABLE public.ai_insights (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  insight_type             text        NOT NULL,
  content                  text        NOT NULL,
  generated_at             timestamptz NOT NULL DEFAULT now(),
  questions_snapshot_count integer
);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insights_select_own" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_ai_insights_user ON public.ai_insights(user_id);


-- ── share_cards ──────────────────────────────────────────────
CREATE TABLE public.share_cards (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_type  text        NOT NULL CHECK (card_type IN ('archetype','score','category-highlight')),
  image_url  text,
  shared_to  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.share_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "share_cards_all_own" ON public.share_cards FOR ALL USING (auth.uid() = user_id);


-- ── subscriptions ────────────────────────────────────────────
CREATE TABLE public.subscriptions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id  text        NOT NULL UNIQUE,
  stripe_price_id         text        NOT NULL,
  plan                    text        NOT NULL CHECK (plan IN ('monthly','annual')),
  status                  text        NOT NULL CHECK (status IN ('active','cancelled','past_due','trialing')),
  current_period_start    timestamptz NOT NULL,
  current_period_end      timestamptz NOT NULL,
  cancel_at_period_end    boolean     NOT NULL DEFAULT false,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
