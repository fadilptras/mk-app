import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://rsaeygzjqpuvuqeyjpnr.supabase.co";
const supabaseKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_y7gJJIZxEDYZhpH4SNOCRg_gN4c4RUU";

export const supabase = createClient(supabaseUrl, supabaseKey);
