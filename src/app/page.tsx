"use client";

import { useEffect, useState } from "react";
import {
  updateSupabasePreference,
  getTasks,
  getVersusPreferences,
  addTask,
  deleteTask,
  setTaskActive,
} from "../supabaseClient";
import TaskMatrix from "@/components/TaskMatrix/TaskMatrix";
import { Task, PreferenceType } from "@/types/interfaces";

export default function Home() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [inactiveTasks, setInactiveTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<Map<string, PreferenceType>>(
    new Map()
  );

  useEffect(() => {
    async function loadData() {
      console.log("Loading tasks and preferences...");
      const loadedTasks = await getTasks();
      const loadedPreferences = await getVersusPreferences();

      setActiveTasks(loadedTasks.filter((task) => task.is_active));
      setInactiveTasks(loadedTasks.filter((task) => !task.is_active));
      setPreferences(loadedPreferences as Map<string, PreferenceType>);
    }

    loadData();
  }, []);

  const [newTaskName, setNewTaskName] = useState("");
  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newTaskName.trim() !== "") {
      await addTask(newTaskName.trim());
      setNewTaskName("");
      const tasks = await getTasks();
      setActiveTasks(tasks.filter((task) => task.is_active));
      setInactiveTasks(tasks.filter((task) => !task.is_active));
    }
  };

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
        const task = activeTasks.find((t) => t.id === taskId);
        return {
          taskId,
          taskName: task?.task_name,
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  };

  const taskVotes = countVotes();
  const [hoveredTaskName, setHoveredTaskName] = useState<string | undefined>(
    undefined
  );

  const deprioritizeTask = async (taskId: number) => {
    await setTaskActive(taskId, false);
    const taskToDeprioritize = activeTasks.find((task) => task.id === taskId);
    if (taskToDeprioritize) {
      setActiveTasks(activeTasks.filter((task) => task.id !== taskId));
      setInactiveTasks([...inactiveTasks, taskToDeprioritize]);
    }
  };

  const restoreTask = async (taskId: number) => {
    await setTaskActive(taskId, true);
    const taskToRestore = inactiveTasks.find((task) => task.id === taskId);
    if (taskToRestore) {
      setInactiveTasks(inactiveTasks.filter((task) => task.id !== taskId));
      setActiveTasks([...activeTasks, taskToRestore]);
    }
  };

  const permanentlyDeleteTask = async (taskId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    await deleteTask(taskId);
    setInactiveTasks(inactiveTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div>
      <h2>Task Prioritization Matrix</h2>
      <div className="taskInputContainer">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="taskInput"
        />
        <button onClick={handleAddTask} className="addButton">
          Add Task
        </button>
      </div>

      <TaskMatrix
        tasks={activeTasks.sort((a, b) => a.id - b.id)}
        togglePreference={togglePreference}
        deprioritizeTask={deprioritizeTask}
        preferences={preferences}
        hoveredTaskName={hoveredTaskName}
      />

      <div className="listContainer">
        <div className="results">
          <h3>Results</h3>
          <ul>
            {taskVotes.map(({ taskName, count, taskId }) => (
              <li
                key={taskId}
                onMouseEnter={() => setHoveredTaskName(taskName)}
                onMouseLeave={() => setHoveredTaskName(undefined)}
              >
                {`${taskName}: ${count} votes`}
              </li>
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

      <div>
        <h3>Deprioritized Tasks:</h3>
        <ul className="inactiveTasksList">
          {inactiveTasks.map((task) => (
            <li key={task.id}>
              <span className="taskName">{task.task_name}</span>
              <span className="buttonGroup">
                <button onClick={() => restoreTask(task.id)}>↑</button>
                <button onClick={() => permanentlyDeleteTask(task.id)}>
                  X
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
