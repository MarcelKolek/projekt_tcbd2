import React, { useState, useEffect } from 'react';
import TagsManager from './TagsManager';
import TimerList from './TimerList';
import Session from './Session';
import { taskApi, timerApi } from '../services/api';
import authHeader from '../services/authHeader';

function TimerManager() {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [tags, setTags] = useState([]);
  const [timersWithTags, setTimersWithTags] = useState([]);

  const fetchData = async () => {
    const [tagRes, timerRes] = await Promise.all([
      taskApi.get('/tags', { headers: authHeader() }),
      timerApi.get('/timers', { headers: authHeader() })
    ]);

    const tags = tagRes.data;
    const timers = timerRes.data;

    const merged = timers.map(timer => ({
      ...timer,
      tags: tags.filter(tag => tag.timerIds.includes(timer.id))
    }));

    setTags(tags);
    setTimersWithTags(merged);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Pomodoro Dashboard</h1>

      <TagsManager tags={tags} onTagsChange={fetchData} />

      <TimerList
        onSelect={setSelectedTimer}
        allTags={tags}
        timers={timersWithTags}
        onDataChanged={fetchData}
      />

      {selectedTimer && <Session timer={selectedTimer} />}
    </div>
  );
}

export default TimerManager;