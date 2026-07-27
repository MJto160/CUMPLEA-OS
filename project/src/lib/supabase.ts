import { createClient } from '@supabase/supabase-client';

const supabaseUrl = "https://supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInN1YiI6ImdjYnhpcHRoam13cnZza21vdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwODg2ODEsImV4cCI6MjAzNzY2NDY4MX0.2zaZlydnyT1a_z-r0b5zFAnO59T-1w_Z7R9bZ5X_4_M";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las credenciales de Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
