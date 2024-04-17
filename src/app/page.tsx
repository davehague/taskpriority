"use client";

import { useEffect, useState } from "react";
import { supabase, updateSupabasePreference } from "../supabaseClient";
import TaskMatrix from "@/components/TaskMatrix/TaskMatrix";
import { PreferenceType } from "@/types/interfaces";

interface Task {
  id: number;
  owner_id: string;
  task_name: string;
  is_active: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<Map<string, PreferenceType>>(
    new Map()
  );

  useEffect(() => {
    async function loadTasks() {
      console.log("Loading tasks...");
      let { data, error } = await supabase.from("tasks").select("*");

      if (error) console.log("error", error);
      else setTasks(data as Task[]);
    }

    loadTasks();
  }, []);

  const [updatedPreferenceKey, setUpdatedPreferenceKey] = useState<string | null>(null);
  const togglePreference = (taskId1: number, taskId2: number) => {
    const key = `${taskId1}-${taskId2}`;
    setPreferences((prevPreferences) => {
      const newPreferences = new Map(prevPreferences);
      const currentPreference = newPreferences.get(key);

      const newPreference =
        currentPreference === PreferenceType.Task1
          ? PreferenceType.Task2
          : currentPreference === PreferenceType.Task2
          ? PreferenceType.None
          : PreferenceType.Task1;

      newPreferences.set(key, newPreference);

      return newPreferences;
    });

    setUpdatedPreferenceKey(key);
  };

  useEffect(() => {
    if (updatedPreferenceKey) {
      const [taskId1, taskId2] = (updatedPreferenceKey as string).split("-").map(Number);
      const preference =
        preferences.get(updatedPreferenceKey) || PreferenceType.None;
      updateSupabasePreference(taskId1, taskId2, preference);
    }
  }, [updatedPreferenceKey, preferences]);

  return (
    <div>
      <h2>Tasks</h2>
      <TaskMatrix
        tasks={tasks}
        togglePreference={togglePreference}
        preferences={preferences}
      />
    </div>
  );
}
