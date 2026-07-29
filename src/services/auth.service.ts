import { supabase } from '../config/supabase';
import type { UserProfile } from '../types';

/**
 * Sign in using Google OAuth via Supabase.
 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error('Google sign-in error:', error.message);
    throw error;
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign-out error:', error.message);
    throw error;
  }
}

/**
 * Fetch the user profile joined with the role name.
 * Returns null if no profile row exists (user not registered by admin).
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      phone,
      role_id,
      district_id,
      is_active,
      created_at,
      updated_at,
      roles ( name )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // no row found
    console.error('Fetch user profile error:', error.message);
    throw error;
  }

  if (!data) return null;

  // Map the joined role name into a flat field
  const roleData = data.roles as unknown as { name: string } | null;

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    phone: data.phone,
    role_id: data.role_id,
    role_name: (roleData?.name ?? 'supplier') as UserProfile['role_name'],
    district_id: data.district_id,
    is_active: data.is_active,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Fetch all permission names for a given role.
 */
export async function fetchRolePermissions(roleId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select(`
      permissions ( name )
    `)
    .eq('role_id', roleId);

  if (error) {
    console.error('Fetch role permissions error:', error.message);
    return [];
  }

  if (!data) return [];

  return data.map((rp: Record<string, unknown>) => {
    const perm = rp.permissions as unknown as { name: string } | null;
    return perm?.name ?? '';
  }).filter(Boolean);
}
