import { supabase } from './supabaseClient';

export const getUserProfile = async (user) => {
  if (!user) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, role, avatar_url')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }
};

export const uploadAvatar = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      throw new Error('Could not get public URL for avatar.');
    }
    const avatarUrl = data.publicUrl + `?t=${new Date().getTime()}`; // Add cache buster

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return avatarUrl;

  } catch (error) {
    console.error('Error uploading avatar:', error.message);
    throw error;
  }
};