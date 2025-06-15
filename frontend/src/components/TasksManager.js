import React, { useState, useEffect } from 'react';
import { taskApi, timerApi } from '../services/api';
import authHeader from '../services/authHeader';

function TasksManager({ timers, tags, onDataChanged, onSelectTimer }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTimers, setSelectedTimers] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await taskApi.get('/tasks', { headers: authHeader() });
    setTasks(res.data);
  };


  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      timerIds: selectedTimers,
      tagIds: selectedTags
    };

    if (editingTaskId) {
      await taskApi.put(`/tasks/${editingTaskId}`, payload, { headers: authHeader() });
    } else {
      await taskApi.post('/tasks', payload, { headers: authHeader() });
    }

    resetForm();
    fetchData();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setSelectedTimers(task.timerIds || []);
    setSelectedTags((task.tags || []).map(tag => tag._id));
    setEditingTaskId(task._id);
  };

  const handleDelete = async (id) => {
    await taskApi.delete(`/tasks/${id}`, { headers: authHeader() });
    fetchData();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedTimers([]);
    setSelectedTags([]);
    setEditingTaskId(null);
  };

  const toggleTimer = (id) => {
    setSelectedTimers(prev =>
      prev.includes(id)
        ? prev.filter(tid => tid !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
  };

  const toggleTag = (id) => {
    setSelectedTags(prev =>
      prev.includes(id)
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <h2>{editingTaskId ? "Edit Task" : "Add Task"}</h2>
      <input placeholder="Title" value={title}
        onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={description}
        onChange={e => setDescription(e.target.value)} />

      <div>
        <p>Select up to 3 Timers:</p>
        {timers.map(t => (
          <label key={t.id} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={selectedTimers.includes(t.id)}
              onChange={() => toggleTimer(t.id)}
              disabled={!selectedTimers.includes(t.id) && selectedTimers.length >= 3}
            />
            {t.description} ({t.workTime}m / {t.breakTime}m, {t.cycles}x)
          </label>
        ))}
      </div>

      <div>
        <p>Assign Tags:</p>
        {tags.map(tag => (
          <label key={tag._id} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={selectedTags.includes(tag._id)}
              onChange={() => toggleTag(tag._id)}
            />
            {tag.name}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit}>
        {editingTaskId ? "Update Task" : "Add Task"}
      </button>
      {editingTaskId && <button onClick={resetForm}>Cancel</button>}

      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <b>{t.title}</b>: {t.description}
            <br />
            Timers:&nbsp;
            {t.timerIds?.length ? (
              t.timerIds.map(id => {
                const timer = timers.find(tm => tm.id === id);
                return timer ? (
                  <button
                    key={id}
                    onClick={() => onSelectTimer(timer)}
                    style={{ marginRight: '8px' }}
                  >
                    {timer.description} ({timer.workTime}m / {timer.breakTime}m, {timer.cycles}x)
                  </button>
                ) : (
                  <span key={id}>{id}</span>
                );
              })
            ) : (
              'None'
            )}
            <br />
            Tags: {t.tags?.map(tag => tag.name).join(', ') || 'None'}
            <br />
            <button onClick={() => handleEdit(t)}>Edit</button>
            <button onClick={() => handleDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksManager;
