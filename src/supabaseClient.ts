import { createClient } from "@supabase/supabase-js";
import { PreferenceType } from "@/types/interfaces";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  db: { schema: "taskpriority" },
});

export const updateSupabasePreference = async (
  task1Id: number,
  task2Id: number,
  preference: PreferenceType
) => {
  const { data, error } = await supabase.from("versus").upsert({
    task_id_1: task1Id,
    task_id_2: task2Id,
    preference: preference,
  });

  if (error) {
    console.error("Error updating preference: ", error);
  }
};
