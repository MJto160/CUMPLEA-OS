import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kdmtmfxuzgfccqvzwjut.supabase.co";
const supabaseAnonKey = "sb_publishable_0pGJgIGg3aVUc7HlpesuNA_Rf51tes6";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las credenciales de Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
