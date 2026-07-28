import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kdmtmfxuzgfccqvzwjut.supabase.co";
const supabaseAnonKey = "sb_publisable_0pG3gIGg3aVUc7HlpesuNA_Rf51te7DcoU6zZ27H29o";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las credenciales de Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
