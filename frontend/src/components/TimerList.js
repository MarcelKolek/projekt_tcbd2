import React, { useState, useEffect } from 'react';
import { timerApi, taskApi } from '../services/api';
import authHeader from '../services/authHeader';

function TimerList({ onSelect, allTags, timers, onDataChanged }) {
  const [selectedTagFilter, setSelectedTagFilter] = useState(null);
  const [newTimer, setNewTimer] = useState({ workTime: '', breakTime: '', cycles: '', description: '' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workTime = parseInt(newTimer.workTime);
    const breakTime = parseInt(newTimer.breakTime);
    const cycles = parseInt(newTimer.cycles);

    if (isNaN(workTime) || isNaN(breakTime) || isNaN(cycles)) {
      alert("Work time, break time, and cycles must be numbers.");
      return;
    }

    const timerPayload = {
      workTime,
      breakTime,
      cycles,
      description: newTimer.description,
      tagIds: selectedTags
    };

    if (editingId) {
      await timerApi.put(`/timers/${editingId}`, timerPayload, { headers: authHeader() });
      setEditingId(null);
    } else {
      await timerApi.post('/timers', timerPayload, { headers: authHeader() });
    }

    setNewTimer({ workTime: '', breakTime: '', cycles: '', description: '' });
    setSelectedTags([]);
    onDataChanged(); // refetch timers + tags
  };

  const handleEdit = (timer) => {
    setNewTimer({
      workTime: timer.workTime,
      breakTime: timer.breakTime,
      cycles: timer.cycles,
      description: timer.description
    });
    setSelectedTags(timer.tags?.map(tag => tag._id) || []);
    setEditingId(timer.id);
  };

  const handleDelete = async (id) => {
    await timerApi.delete(`/timers/${id}`, { headers: authHeader() });
    onDataChanged(); // refetch
  };

  const filteredTimers = selectedTagFilter
    ? timers.filter(t => t.tags.some(tag => tag._id === selectedTagFilter))
    : timers;

  return (
    <div>
      <h2>{editingId ? "Edit Timer" : "Create Timer"}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Work Time (min)" value={newTimer.workTime}
          onChange={e => setNewTimer({ ...newTimer, workTime: e.target.value })} />
        <input placeholder="Break Time (min)" value={newTimer.breakTime}
          onChange={e => setNewTimer({ ...newTimer, breakTime: e.target.value })} />
        <input placeholder="Cycles" value={newTimer.cycles}
          onChange={e => setNewTimer({ ...newTimer, cycles: e.target.value })} />
        <input placeholder="Description" value={newTimer.description}
          onChange={e => setNewTimer({ ...newTimer, description: e.target.value })} />

        <div>
          <label>Tags:</label>
          {allTags.map(tag => (
            <label key={tag._id} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() =>
                  setSelectedTags(prev =>
                    prev.includes(tag._id) ? prev.filter(id => id !== tag._id) : [...prev, tag._id]
                  )
                }
              />
              {tag.name}
            </label>
          ))}
        </div>

        <button type="submit">{editingId ? "Update Timer" : "Create Timer"}</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>Filter by Tag</h3>
        {allTags.map(tag => (
          <button
            key={tag._id}
            onClick={() => setSelectedTagFilter(tag._id)}
            style={{ marginRight: '10px', fontWeight: tag._id === selectedTagFilter ? 'bold' : 'normal' }}
          >
            {tag.name}
          </button>
        ))}
        <button onClick={() => setSelectedTagFilter(null)}>Clear Filter</button>
      </div>

      <ul>
        {filteredTimers.map(t => (
          <li key={t.id}>
            <span onClick={() => onSelect(t)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              {t.description} - {t.workTime}min / {t.breakTime}min - {t.cycles} cycles
            </span>
            <div>Tags: {t.tags?.map(tag => tag.name).join(', ') || 'None'}</div>
            <button onClick={() => handleEdit(t)}>Edit</button>
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimerList;
