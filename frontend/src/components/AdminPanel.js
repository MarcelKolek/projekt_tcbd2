import React, { useState, useEffect } from 'react';
import { authApi, timerApi } from '../services/api';
import authHeader from '../services/authHeader';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchSessions();
    fetchTimers();
  }, []);

  const fetchUsers = async () => {
    const res = await authApi.get('/users', { headers: authHeader() });
    setUsers(res.data);
  };
  const fetchSessions = async () => {
    const res = await timerApi.get('/sessions', { headers: authHeader() });
    setSessions(res.data);
  };
  const fetchTimers = async () => {
    const res = await timerApi.get('/timers', { headers: authHeader() });
    setTimers(res.data);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username} ({u.role})</li>
        ))}
      </ul>
      <h3>All Sessions</h3>
      <ul>
        {sessions.map(s => (
          <li key={s.id}>Session {s.id}: status {s.status}</li>
        ))}
      </ul>
      <h3>All Timers</h3>
      <ul>
        {timers.map(t => (
          <li key={t.id}>Timer {t.id}: {t.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
