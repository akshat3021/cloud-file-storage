import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czrvnoqsntfwbovasosk.supabase.co'
;

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnZub3FzbnRmd2JvdmFzb3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjQ3ODgsImV4cCI6MjA3NTcwMDc4OH0.ujb3KR4uB1kY6xOyBm9AvGnutX_-6462l0RqzgdcC6A';

export const supabase = createClient(supabaseUrl, supabaseKey);