'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';


export default function Home() {
  interface Task {
    id: number;
    owner_id: string;
    task_name: string;
    is_active: boolean;
  }

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
      console.log('Loading tasks...');
      let { data, error } = await supabase
        .from('tasks')
        .select('*');

      if (error) console.log('error', error);
      else setTasks(data as Task[]);
    }

    loadTasks();
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      <div>
        {tasks.map((task) => (
          <div key={task.id}>
            <h2>{task.task_name}</h2>
            <div>
              {task.is_active === true ? 'Active' : 'Inactive'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}