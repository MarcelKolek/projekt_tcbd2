import React, { useState } from 'react';
import { timerApi } from '../services/api';
import authHeader from '../services/authHeader';

function TimerList({ onSelect, timers, onDataChanged }) {
  const [newTimer, setNewTimer] = useState({ workTime: '', breakTime: '', cycles: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

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
      description: newTimer.description
    };

    if (editingId) {
      await timerApi.put(`/timers/${editingId}`, timerPayload, { headers: authHeader() });
      setEditingId(null);
    } else {
      await timerApi.post('/timers', timerPayload, { headers: authHeader() });
    }

    setNewTimer({ workTime: '', breakTime: '', cycles: '', description: '' });
    onDataChanged();
  };

  const handleEdit = (timer) => {
    setNewTimer({
      workTime: timer.workTime,
      breakTime: timer.breakTime,
      cycles: timer.cycles,
      description: timer.description
    });
    setEditingId(timer.id);
  };

  const handleDelete = async (id) => {
    await timerApi.delete(`/timers/${id}`, { headers: authHeader() });
    onDataChanged();
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredTimers = timers
    .filter(t => {
      if (filterDate) {
        const timerDate = new Date(t.createdAt).toISOString().slice(0, 10);
        if (timerDate !== filterDate) return false;
      }
      if (descriptionQuery.trim()) {
        if (!t.description?.toLowerCase().includes(descriptionQuery.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

  return (
    <div className="container">
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

        <button type="submit" className="btn">{editingId ? "Update Timer" : "Create Timer"}</button>
        {editingId && <button type="button" className="btn" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>Filters</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Date: </label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <button className="btn" onClick={() => setFilterDate('')}>Clear</button>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description Contains: </label>
          <input
            type="text"
            placeholder="Search..."
            value={descriptionQuery}
            onChange={e => setDescriptionQuery(e.target.value)}
          />
        </div>
        <div>
          <button onClick={toggleSortOrder} className="btn">
            Sort by Date: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
          </button>
        </div>
      </div>

      <ul style={{ marginTop: '20px' }}>
        {filteredTimers.map(t => (
          <li key={t.id}>
            <span onClick={() => onSelect(t)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              {t.description} - {t.workTime}min / {t.breakTime}min - {t.cycles} cycles
            </span>
            <div style={{ fontSize: '0.9em' }}>Created: {new Date(t.createdAt).toLocaleDateString()}</div>
            <button className="btn" onClick={() => handleEdit(t)}>Edit</button>
            <button className="btn" onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimerList;