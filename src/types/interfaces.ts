export enum PreferenceType {
  Task1 = "task1",
  Task2 = "task2",
  None = "none",
}

export interface Task {
  id: number;
  owner_id: string;
  task_name: string;
  is_active: boolean;
}
