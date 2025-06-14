import React, { useState } from 'react';
import { timerApi } from '../services/api';
import authHeader from '../services/authHeader';

function Session() {
  const [timerId, setTimerId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [sessionId, setSessionId] = useState(null);

  const startSession = async () => {
    const res = await timerApi.post('/sessions', { timerId, taskId }, { headers: authHeader() });
    setSessionId(res.data.id);
  };

  const stopSession = async () => {
    if (!sessionId) return;
    await timerApi.patch(`/sessions/${sessionId}`, { status: 'stopped' }, { headers: authHeader() });
    setSessionId(null);
  };

  return (
    <div>
      <h2>Session Control</h2>
      <input placeholder="Timer ID" value={timerId}
        onChange={e => setTimerId(e.target.value)} />
      <input placeholder="Task ID (optional)" value={taskId}
        onChange={e => setTaskId(e.target.value)} /><br/>
      <button onClick={startSession}>Start</button>
      <button onClick={stopSession}>Stop</button>
    </div>
  );
}

export default Session;
