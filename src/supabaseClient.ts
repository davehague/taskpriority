import { createClient } from "@supabase/supabase-js";
import { Task, PreferenceType } from "@/types/interfaces";

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

export const getTasks = async () => {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) {
    console.error("Error getting tasks: ", error);
    return [];
  }

  return data as Task[];
}

export const getVersusPreferences = async () => {
  const { data, error } = await supabase.from("versus").select("*");

  if (error) {
    console.error("Error getting versus preferences: ", error);
    return [];
  }

  const preferences = new Map<string, PreferenceType>();
  data.forEach((preference: any) => {
    preferences.set(`${preference.task_id_1}-${preference.task_id_2}`, preference.preference);
  });

  return preferences as Map<string, PreferenceType>;
}

export const addTask = async (taskName: string) => {
  const { data, error } = await supabase.from("tasks").insert({
    task_name: taskName,
    is_active: true,
  });

  if (error) {
    console.error("Error adding task: ", error);
  }
};

export const setTaskActive = async (taskId: number, isActive: boolean) => {
  const { data, error } = await supabase.from("tasks").update({
    is_active: isActive,
  }).match({ id: taskId });

  if (error) {
    console.error("Error setting task active: ", error);
  }
};

export const deleteTask = async (taskId: number) => {
  const { error } = await supabase.from("tasks").delete().match({ id: taskId });

  if (error) {
    console.error("Error deleting task: ", error);
  }
};
