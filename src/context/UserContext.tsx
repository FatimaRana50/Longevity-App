import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/index';
import { db } from '../services/supabase';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
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
      const profile = await db.getUserProfile(TEST_USER_ID);
      if (profile) {
        setUser(profile);
      } else {
        const newProfile: UserProfile = {
          id: TEST_USER_ID,
          email: '',
          name: '',
          createdAt: new Date(),
          onboardingCompleted: false,
          totalChoicesMade: 0,
        };
        try {
          await db.createUserProfile(newProfile);
        } catch (err) {
          console.warn('Could not save profile to Supabase:', err);
        }
        setUser(newProfile);
      }
    } catch (err) {
      console.warn('Could not load profile, using local state:', err);
      setUser({
        id: TEST_USER_ID,
        email: '',
        name: '',
        createdAt: new Date(),
        onboardingCompleted: false,
        totalChoicesMade: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    // Optimistic update — apply locally first
    setUser({ ...user, ...updates });
    try {
      await db.updateUserProfile(user.id, updates);
    } catch (err) {
      console.warn('Could not sync profile to Supabase:', err);
    }
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
