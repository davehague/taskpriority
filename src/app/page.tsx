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
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-blue-600 mt-5 mb-3">Tasks</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800">{task.task_name}</h2>
            <div className={`badge ${task.is_active === true ? 'bg-green-200' : 'bg-red-200'} px-2 py-1 rounded`}>
              {task.is_active === true ? 'Active' : 'Inactive'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}