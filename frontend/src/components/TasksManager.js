import React, { useState, useEffect } from 'react';
import api from '../services/api';
import authHeader from '../services/authHeader';

function TasksManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get('/api/tasks', { headers: authHeader() });
    setTasks(res.data);
  };

  const addTask = async () => {
    await api.post('/api/tasks', { title, description }, { headers: authHeader() });
    setTitle(''); setDescription('');
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input placeholder="Title" value={title}
        onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={description}
        onChange={e => setDescription(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <b>{t.title}</b>: {t.description} [{t.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksManager;
