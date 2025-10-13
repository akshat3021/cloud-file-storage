import { supabase } from './supabaseClient';

export const getUserProfile = async (user) => {
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('username, role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }
  return data;
};
