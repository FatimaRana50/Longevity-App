-- Add risk_tolerance column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN risk_tolerance TEXT;

-- Add comment
COMMENT ON COLUMN user_profiles.risk_tolerance IS 'User risk tolerance preference (low, medium, high)';
