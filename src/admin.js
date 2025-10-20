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

export const updateUserRole = async (userId, newRole) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select('id, role')
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating user role:', error.message);
    throw error;
  }
};

export const deleteUserProfile = async (userIdToDelete) => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userIdToDelete);

    if (profileError) throw profileError;

    console.log(`Profile for user ${userIdToDelete} deleted.`);
    return true;

  } catch (error) {
    console.error('Error deleting user profile:', error.message);
    throw error;
  }
};