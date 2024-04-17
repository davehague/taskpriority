"use client";

import { useEffect, useState } from "react";
import {
  supabase,
  updateSupabasePreference,
  getTasks,
  getVersusPreferences,
} from "../supabaseClient";
import TaskMatrix from "@/components/TaskMatrix/TaskMatrix";
import { Task, PreferenceType } from "@/types/interfaces";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<Map<string, PreferenceType>>(
    new Map()
  );

  useEffect(() => {
    async function loadData() {
      console.log("Loading tasks and preferences...");
      const loadedTasks = await getTasks();
      const loadedPreferences = await getVersusPreferences();

      setTasks(loadedTasks);
      setPreferences(loadedPreferences as Map<string, PreferenceType>);
    }

    loadData();
  }, []);

  const [updatedPreferenceKey, setUpdatedPreferenceKey] = useState<
    string | null
  >(null);
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
      const [taskId1, taskId2] = (updatedPreferenceKey as string)
        .split("-")
        .map(Number);
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
