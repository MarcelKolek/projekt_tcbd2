import React, { useState, useEffect } from 'react';
import api from '../services/api';
import authHeader from '../services/authHeader';

function TimerList() {
  const [timers, setTimers] = useState([]);
  const [newTimer, setNewTimer] = useState({ workTime:'', breakTime:'', cycles:'', description:'' });

  useEffect(() => {
    fetchTimers();
  }, []);

  const fetchTimers = async () => {
    const res = await api.get('/api/timers', { headers: authHeader() });
    setTimers(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/timers/${id}`, { headers: authHeader() });
    fetchTimers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/timers', newTimer, { headers: authHeader() });
    setNewTimer({ workTime:'', breakTime:'', cycles:'', description:'' });
    fetchTimers();
  };

  return (
    <div>
      <h2>Timers</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Work Time (min)" value={newTimer.workTime}
          onChange={e => setNewTimer({...newTimer, workTime: e.target.value})} />
        <input placeholder="Break Time (min)" value={newTimer.breakTime}
          onChange={e => setNewTimer({...newTimer, breakTime: e.target.value})} />
        <input placeholder="Cycles" value={newTimer.cycles}
          onChange={e => setNewTimer({...newTimer, cycles: e.target.value})} />
        <input placeholder="Description" value={newTimer.description}
          onChange={e => setNewTimer({...newTimer, description: e.target.value})} />
        <button type="submit">Create Timer</button>
      </form>
      <ul>
        {timers.map(t => (
          <li key={t.id}>
            {t.description} - {t.workTime}min work / {t.breakTime}min break - {t.cycles} cycles - {t.status}
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimerList;
