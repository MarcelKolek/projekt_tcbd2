import React, { useEffect, useState } from 'react';
import { timerApi } from '../services/api';
import authHeader from '../services/authHeader';

const SessionStats = () => {
  const [stats, setStats] = useState({ totalTime: 0, completedSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchStatsAndHistory = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          timerApi.get('/sessions/stats', { headers: authHeader() }),
          timerApi.get('/sessions', { headers: authHeader() }),
        ]);
        setStats(statsRes.data);
        setSessions(historyRes.data);
      } catch (err) {
        console.error('Failed to load session data', err);
        alert('Failed to load session data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndHistory();
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
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadStats = () => {
    const content =
      `Work session statistics\n` +
      `Total time spent working: ${formatTime(stats.totalTime)}\n` +
      `Completed sessions: ${stats.completedSessions}\n`;
    downloadFile("session_statistics.txt", content);
  };

  const downloadHistory = () => {
    const rows = [
      'ID,Timer ID,Start Time,End Time,Duration (min)'
    ];
    sessions.forEach(sess => {
      const start = sess.startTime ? new Date(sess.startTime).toLocaleString() : '';
      const end = sess.endTime ? new Date(sess.endTime).toLocaleString() : '';
      const duration = sess.endTime && sess.startTime
        ? Math.round((new Date(sess.endTime) - new Date(sess.startTime)) / 60000)
        : '';
      rows.push(`${sess.id},${sess.timerId},${start},${end},${duration}`);
    });
    downloadFile("session_history.csv", rows.join('\n'));
  };

  if (loading) return <p>Loading statistics...</p>;

  return (
    <div style={{ marginTop: '20px' }} className="container">
      <h3>Work Session Statistics</h3>
      <p><strong>Total time spent working:</strong> {formatTime(stats.totalTime)}</p>
      <p><strong>Completed sessions:</strong> {stats.completedSessions}</p>

      <button onClick={downloadStats} style={{ marginRight: '10px' }} className="btn">
        Download statistics
      </button>
      <button onClick={downloadHistory} className="btn">
        Download session history
      </button>
    </div>
  );
};

export default SessionStats;