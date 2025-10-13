import { supabase } from './supabaseClient';

export const signUpUser = async (email, password, adminCode) => {
  const SECRET_ADMIN_CODE = "GRAPHIC_ERA_HILL_UNIVERSITY_00_22";
  
  let userRole = 'user';

  if (adminCode === SECRET_ADMIN_CODE) {
    userRole = 'admin';
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (authError) {
    console.error('Error signing up in auth:', authError.message);
    return { error: authError };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ 
      id: authData.user.id,
      role: userRole
    });
  
  if (profileError) {
    console.error('Error creating profile:', profileError.message);
    return { error: profileError };
  }

  return { data: authData, error: null };
};

export const sendPasswordResetEmail = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/update-password', // The page to redirect to after clicking the link
  });

  if (error) {
    console.error('Error sending password reset email:', error.message);
  }

  return { data, error };
};

export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Error signing in:', error.message);
  }

  return { data, error };
};

export const updateUserPassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error('Error updating password:', error.message);
  }

  return { data, error };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
  }
};