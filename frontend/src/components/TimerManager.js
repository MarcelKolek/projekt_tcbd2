import React, { useState, useEffect } from 'react';
import TagsManager from './TagsManager';
import TimerList from './TimerList';
import Session from './Session';
import SessionStats from './SessionStats';
import TasksManager from './TasksManager';
import { taskApi, timerApi } from '../services/api';
import authHeader from '../services/authHeader';


function TimerManager() {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [tags, setTags] = useState([]);
  const [timers, setTimers] = useState([]);
  const [statsKey, setStatsKey] = useState(0); // key for forcing stats refresh

  const fetchData = async () => {
    const [tagRes, timerRes] = await Promise.all([
      taskApi.get('/tags', { headers: authHeader() }),
      timerApi.get('/timers', { headers: authHeader() })
    ]);
    setTags(tagRes.data);
    setTimers(timerRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshStats = () => {
    setStatsKey(prev => prev + 1);
  };

  return (
    <div>
      <h1>Pomodoro Dashboard</h1>
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
      <TasksManager />
    </div>
  );
}

export default TimerManager;