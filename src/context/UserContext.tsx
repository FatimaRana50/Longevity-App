import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/index';
import { db } from '../services/supabase';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
const STORAGE_KEY = '@longevity_user_profile';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      // Load from AsyncStorage first (instant, works offline)
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setUser({ ...parsed, createdAt: new Date(parsed.createdAt) });
          setIsLoading(false);
          // Sync from Supabase in background
          syncFromSupabase().catch(err => console.warn('Background sync error:', err));
        } catch (parseErr) {
          console.warn('Cache parse error:', parseErr);
          setIsLoading(false);
          const fallback: UserProfile = {
            id: TEST_USER_ID, email: '', name: '',
            createdAt: new Date(), onboardingCompleted: false, totalChoicesMade: 0,
          };
          setUser(fallback);
        }
        return;
      }

      // No cache — try Supabase with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase connection timeout')), 5000)
      );

      await Promise.race([syncFromSupabase(), timeoutPromise]).catch(err => {
        console.warn('Supabase init error, using offline mode:', err);
        const fallback: UserProfile = {
          id: TEST_USER_ID, email: '', name: '',
          createdAt: new Date(), onboardingCompleted: false, totalChoicesMade: 0,
        };
        setUser(fallback);
      });
    } catch (err) {
      console.warn('Init error, using defaults:', err);
      const fallback: UserProfile = {
        id: TEST_USER_ID, email: '', name: '',
        createdAt: new Date(), onboardingCompleted: false, totalChoicesMade: 0,
      };
      setUser(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const syncFromSupabase = async () => {
    try {
      const profile = await db.getUserProfile(TEST_USER_ID);
      if (profile) {
        setUser(profile);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } else {
        const newProfile: UserProfile = {
          id: TEST_USER_ID, email: '', name: '',
          createdAt: new Date(), onboardingCompleted: false, totalChoicesMade: 0,
        };
        await db.createUserProfile(newProfile).catch(() => {});
        setUser(newProfile);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      }
    } catch (err) {
      console.warn('Supabase sync failed:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    // Optimistic update — local first
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Background sync to Supabase
    db.updateUserProfile(user.id, { ...updates, email: user.email }).catch(err =>
      console.warn('Supabase profile update failed:', err)
    );
  };

  const resetOnboarding = async () => {
    if (!user) return;

    const resetProfile: UserProfile = {
      ...user,
      name: '',
      onboardingCompleted: false,
      primaryArchetype: undefined,
      riskTolerance: undefined,
    };

    setUser(resetProfile);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetProfile));

    db.resetUserOnboarding(user.id).catch(err =>
      console.warn('Supabase onboarding reset failed:', err)
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, updateProfile, resetOnboarding, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
