import React, { useEffect, useState, useRef } from 'react';

function Session({ timer }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timer.workTime * 60);
  const [cyclesLeft, setCyclesLeft] = useState(timer.cycles);
  const intervalRef = useRef(null);

  useEffect(() => {
    resetSession();
  }, [timer]);

  const startTimer = () => {
    if (isRunning || cyclesLeft <= 0) return;
    setIsRunning(true);
    startInterval();
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetSession = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorkPhase(true);
    setTimeLeft(timer.workTime * 60);
    setCyclesLeft(timer.cycles);
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

  const handlePhaseSwitch = () => {
    if (isWorkPhase) {
      setIsWorkPhase(false);
      setTimeLeft(timer.breakTime * 60);
      startInterval(); // ✅ Start break timer
    } else {
      const newCycles = cyclesLeft - 1;
      setCyclesLeft(newCycles);
      if (newCycles > 0) {
        setIsWorkPhase(true);
        setTimeLeft(timer.workTime * 60);
        startInterval(); // ✅ Start next work timer
      } else {
        setIsRunning(false);
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      <h2>Pomodoro Session</h2>
      <p><strong>Timer:</strong> {timer.description}</p>
      <p>Phase: {isWorkPhase ? 'Work' : 'Break'}</p>
      <p>Time Left: {formatTime(timeLeft)}</p>
      <p>Cycles Remaining: {cyclesLeft}</p>

      {!isRunning ? (
        <button onClick={startTimer}>Start</button>
      ) : (
        <button onClick={pauseTimer}>Pause</button>
      )}
      <button onClick={resetSession}>Reset</button>
    </div>
  );
}

export default Session;