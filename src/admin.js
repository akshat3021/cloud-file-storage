import { supabase } from './supabaseClient';

export const getAllUserProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
  return data;
};            