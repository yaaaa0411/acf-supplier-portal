import { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import {
  signInWithGoogle as googleSignIn,
  signOut as authSignOut,
  fetchUserProfile,
  fetchRolePermissions,
} from '../services/auth.service';
import type { AuthContextType, UserProfile } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load the user profile and their role's permissions.
   */
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const userProfile = await fetchUserProfile(userId);
      setProfile(userProfile);

      if (userProfile) {
        const perms = await fetchRolePermissions(userProfile.role_id);
        setPermissions(perms);
      } else {
        setPermissions([]);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setProfile(null);
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    // 1. Get the initial session on mount
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadProfile(currentSession.user.id);
      }

      setLoading(false);
    });

    // 2. Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setPermissions([]);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    await googleSignIn();
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPermissions([]);
  }, []);

  const hasPermission = useCallback(
    (permissionName: string): boolean => {
      return permissions.includes(permissionName);
    },
    [permissions]
  );

  const value: AuthContextType = {
    user,
    session,
    profile,
    permissions,
    loading,
    signInWithGoogle,
    signOut,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
