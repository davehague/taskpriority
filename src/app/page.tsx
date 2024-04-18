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

  const countVotes = () => {
    const voteCounts = new Map();
    preferences.forEach((value, key) => {
      const [taskId1, taskId2] = key.split("-").map(Number);
      if (value === PreferenceType.Task1) {
        voteCounts.set(taskId1, (voteCounts.get(taskId1) || 0) + 1);
      } else if (value === PreferenceType.Task2) {
        voteCounts.set(taskId2, (voteCounts.get(taskId2) || 0) + 1);
      }
    });

    return Array.from(voteCounts.entries())
      .map(([taskId, count]) => {
        const task = tasks.find((t) => t.id === taskId);
        return { taskName: task?.task_name, count };
      })
      .sort((a, b) => b.count - a.count);
  };

  const taskVotes = countVotes();

  return (
    <div>
      <h2>Tasks</h2>
      <TaskMatrix
        tasks={tasks}
        togglePreference={togglePreference}
        preferences={preferences}
      />
      <div className="listContainer">
        <div className="results">
          <h3>Results</h3>
          <ul>
            {taskVotes.map(({ taskName, count }) => (
              <li key={taskName}>{`${taskName}: ${count} votes`}</li>
            ))}
          </ul>
        </div>
        <div className="guidance">
          <ul>
            <li>
              <strong>Skills and Development:</strong> Which project will help
              me develop new skills or improve existing ones?
            </li>
            <li>
              <strong>Personal Satisfaction:</strong> Which project will bring
              me the most personal satisfaction or sense of achievement upon
              completion?
            </li>
            <li>
              <strong>Impact and ROI:</strong> Evaluate the potential positive
              outcome and long-term benefits. Which project aligns more with
              your goals? Considering the effort, which project offers the best
              ROI or value in the long run?
            </li>
            <li>
              <strong>Priority:</strong> Assess the urgency and deadlines. Which
              project needs immediate attention due to time constraints or
              upcoming opportunities?
            </li>
            <li>
              <strong>Resources:</strong> Which project requires fewer resources
              (time, money, effort) to complete?
            </li>
            <li>
              <strong>Risk Assessment:</strong> Identify potential challenges
              and assess your readiness to tackle them. Which project presents
              risks that are manageable and worth taking?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
