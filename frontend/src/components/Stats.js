import React, { useState, useEffect } from 'react';
import api from '../services/api';
import authHeader from '../services/authHeader';

function Stats() {
  const [stats, setStats] = useState({ totalTime: 0, completedSessions: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/api/sessions/stats', { headers: authHeader() });
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Time (s): {stats.totalTime}</p>
      <p>Completed Sessions: {stats.completedSessions}</p>
    </div>
  );
}

export default Stats;
