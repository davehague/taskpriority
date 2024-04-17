import React from "react";
import styles from "./TaskMatrix.module.css";
import { PreferenceType } from "@/types/interfaces";

interface Task {
  id: number;
  owner_id: string;
  task_name: string;
  is_active: boolean;
}

interface TaskMatrixProps {
  tasks: Task[];
  togglePreference: (taskId1: number, taskId2: number) => void;
  preferences: Map<string, PreferenceType>;
}

const TaskMatrix: React.FC<TaskMatrixProps> = ({
  tasks,
  togglePreference,
  preferences,
}) => {
  const getPreferenceDisplay = (rowTask: Task, colTask: Task): string => {
    const key = `${rowTask.id}-${colTask.id}`;
    const preference = preferences.get(key);

    if (preference === PreferenceType.Task1) {
      return rowTask.task_name;
    } else if (preference === PreferenceType.Task2) {
      return colTask.task_name;
    } else {
      return "No Preference";
    }
  };

  return (
    <div className={styles.matrixContainer}>
      <div className={styles.matrixRow}>
        <div className={`${styles.matrixCell} ${styles.header}`}>Task</div>
        {tasks.map((task) => (
          <div
            className={`${styles.matrixCell} ${styles.header}`}
            key={`header-${task.id}`}
          >
            {task.task_name}
          </div>
        ))}
        <div className={`${styles.matrixCell} ${styles.header}`}>Deprioritize</div>
      </div>
      {tasks.map((rowTask) => (
        <div className={styles.matrixRow} key={`row-${rowTask.id}`}>
          <div className={styles.matrixCell}>{rowTask.task_name}</div>
          {tasks.map((colTask) => (
            <div
              className={styles.matrixCell}
              key={`cell-${rowTask.id}-${colTask.id}`}
              onClick={(event) => {
                event.stopPropagation();
                if (rowTask.id > colTask.id) {
                  togglePreference(rowTask.id, colTask.id);
                }
              }}
              style={
                rowTask.id <= colTask.id ? { backgroundColor: "#f2f2f2" } : {}
              }
            >
              {rowTask.id <= colTask.id ? (
                <div></div>
              ) : (
                getPreferenceDisplay(rowTask, colTask)
              )}
            </div>
          ))}
          <div className={styles.matrixCell}>
            <button type="button"
              onClick={() => console.log("Deprioritize", rowTask.task_name)}
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskMatrix;
