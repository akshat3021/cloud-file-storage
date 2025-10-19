import { supabase } from './supabaseClient';

export const getAllUserProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      
      .select('id, username, role'); 

    if (error) throw error;
    
    return data || []; 
  } catch (error) {
    console.error('Error fetching all user profiles:', error.message);
    return []; 
  }
};