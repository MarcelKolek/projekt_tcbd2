import React, { useState, useEffect } from 'react';
import TagsManager from './TagsManager';
import TimerList from './TimerList';
import Session from './Session';
import SessionStats from './SessionStats';
import TasksManager from './TasksManager';
import { taskApi, timerApi } from '../services/api';
import authHeader from '../services/authHeader';
import AdminUserList from './AdminUserList';
import AdminSessionStats from './AdminSessionStats';

function PomodoroManager({ onLogout }) {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [tags, setTags] = useState([]);
  const [timers, setTimers] = useState([]);
  const [statsKey, setStatsKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    const [tagRes, timerRes] = await Promise.all([
      taskApi.get('/tags', { headers: authHeader() }),
      timerApi.get('/timers', { headers: authHeader() })
    ]);
    setTags(tagRes.data);
    setTimers(timerRes.data);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'admin') {
      setIsAdmin(true);
    } else {
      fetchData();
    }
  }, []);

  const refreshStats = () => {
    setStatsKey(prev => prev + 1);
  };

  return (
    <div className="container">
      <h1>Pomodoro Dashboard</h1>
      <button onClick={onLogout} className="btn">Logout</button>

      {isAdmin ? (
        <>
          <AdminUserList />
          <AdminSessionStats />
        </>
      ) : (
        <>
          <TimerList
            onSelect={setSelectedTimer}
            timers={timers}
            onDataChanged={fetchData}
          />
          {selectedTimer && (
            <Session
              timer={selectedTimer}
              onCancel={() => setSelectedTimer(null)}
              onStatsUpdate={refreshStats} 
            />
          )}
          <SessionStats key={statsKey} />
          <TagsManager tags={tags} onTagsChange={fetchData} />
          <TasksManager
            timers={timers}
            tags={tags}
            onDataChanged={fetchData}
            onSelectTimer={setSelectedTimer}
          />
        </>
      )}
    </div>
  );
}

export default PomodoroManager;
