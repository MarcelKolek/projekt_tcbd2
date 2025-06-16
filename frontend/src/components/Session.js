import React, { useEffect, useState, useRef } from 'react';
import { timerApi } from '../services/api';
import authHeader from '../services/authHeader';

function Session({ timer, onCancel, onStatsUpdate }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timer.workTime * 60);
  const [cyclesLeft, setCyclesLeft] = useState(timer.cycles);
  const [sessionId, setSessionId] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    resetSession();
  }, [timer]);

  const startTimer = async () => {
    if (isRunning || cyclesLeft <= 0) return;

    try {
      const res = await timerApi.post('/sessions', {
        timerId: timer.id
      }, { headers: authHeader() });
      setSessionId(res.data.id);
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Nie udało się rozpocząć sesji.");
      return;
    }

    setIsRunning(true);
    startInterval();
  };

  const pauseTimer = async () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);

    await stopSession();
  };

  const resetSession = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorkPhase(true);
    setTimeLeft(timer.workTime * 60);
    setCyclesLeft(timer.cycles);
    setSessionId(null);
  };

  const handleCancel = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);

    if (sessionId) {
      try {
        await timerApi.patch(`/sessions/${sessionId}`, {}, { headers: authHeader() });
      } catch (err) {
        console.error("Failed to stop session:", err);
      }
    }

    resetSession();

    if (onCancel) onCancel();
  };

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handlePhaseSwitch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePhaseSwitch = async () => {
    if (isWorkPhase) {
      setIsWorkPhase(false);
      setTimeLeft(timer.breakTime * 60);
      startInterval();
    } else {
      const newCycles = cyclesLeft - 1;
      setCyclesLeft(newCycles);
      if (newCycles > 0) {
        setIsWorkPhase(true);
        setTimeLeft(timer.workTime * 60);
        startInterval();
      } else {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        await stopSession(true);
      }
    }
  };

  const stopSession = async (completed = false) => {
    if (!sessionId) return;
    try {
        await timerApi.patch(`/sessions/${sessionId}`, {
        completed
        }, { headers: authHeader() });

        if (onStatsUpdate) onStatsUpdate();
        setSessionId(null);
    } catch (err) {
        console.error("Failed to stop session:", err);
    }
    };



  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="session-container">
      <h2>Pomodoro Session</h2>
      <p><strong>Timer:</strong> {timer.description}</p>
      <p>Phase: {isWorkPhase ? 'Work' : 'Break'}</p>
      <p>Time Left: {formatTime(timeLeft)}</p>
      <p>Cycles Remaining: {cyclesLeft}</p>

      {!isRunning ? (
        <button onClick={startTimer} className="btn rounded-button">Start</button>
      ) : (
        <button onClick={pauseTimer} className="btn rounded-button">Pause</button>
      )}
      <button onClick={resetSession} className="btn rounded-button">Reset</button>
      <button onClick={handleCancel} style={{ color: 'red', marginLeft: '10px' }} className="btn rounded-button">Cancel</button>
    </div>
  );
}

export default Session;

// Main session component styled with .session-container