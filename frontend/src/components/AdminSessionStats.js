import React, { useEffect, useState } from 'react';
import { timerApi } from '../services/api';
import authHeader from '../services/authHeader';

const AdminSessionStats = () => {
  const [stats, setStats] = useState({ totalTime: 0, completedSessions: 0 });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSessionData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          timerApi.get('/sessions/stats', { headers: authHeader() }),
          timerApi.get('/sessions', { headers: authHeader() }),
        ]);
        setStats(statsRes.data);
        setSessions(historyRes.data);
      } catch (err) {
        console.error('Failed to fetch admin session data:', err);
        alert('Failed to fetch session data for admin.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllSessionData();
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadStats = () => {
    const content =
      `Admin Work Session Stats (All Users)\n` +
      `Total Time Worked: ${formatTime(stats.totalTime)}\n` +
      `Total Completed Sessions: ${stats.completedSessions}\n`;
    downloadFile("admin_session_statistics.txt", content);
  };

  const downloadHistory = () => {
    const rows = [
      'Session ID,User ID,Timer ID,Task ID,Start Time,End Time,Duration (min),Completed'
    ];
    sessions.forEach(sess => {
      const start = sess.startTime ? new Date(sess.startTime).toLocaleString() : '';
      const end = sess.endTime ? new Date(sess.endTime).toLocaleString() : '';
      const duration = sess.startTime && sess.endTime
        ? Math.round((new Date(sess.endTime) - new Date(sess.startTime)) / 60000)
        : '';
      rows.push([
        sess.id,
        sess.userId,
        sess.timerId,
        sess.taskId || '',
        start,
        end,
        duration,
        sess.completed ? 'Yes' : 'No'
      ].join(','));
    });
    downloadFile("admin_session_history.csv", rows.join('\n'));
  };

  if (loading) return <p>Loading session data for all users...</p>;

  return (
    <div style={{ marginTop: '30px' }} className="container">
      <h3>Admin: All Users' Session Statistics</h3>
      <p><strong>Total time worked:</strong> {formatTime(stats.totalTime)}</p>
      <p><strong>Completed sessions:</strong> {stats.completedSessions}</p>

      <button onClick={downloadStats} style={{ marginRight: '10px' }} className="btn">
        Download Statistics
      </button>
      <button onClick={downloadHistory} className="btn">
        Download Session History
      </button>
    </div>
  );
};

export default AdminSessionStats;