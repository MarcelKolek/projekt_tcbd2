import React, { useState } from 'react';
import { register, login } from './services/auth.service';
import { getTimers, createTimer } from './services/timer.service';
import { getTasks } from './services/task.service';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  
  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      setToken(res.data.accessToken);
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  
  const handleGetTimers = async () => {
    const res = await getTimers(token, {});
    console.log("Timers:", res.data);
  };
  
  const handleGetTasks = async () => {
    const res = await getTasks(token);
    console.log("Tasks:", res.data);
  };
  
  return (
    <div>
      <h1>Pomodoro App</h1>
      {!token ? (
        <div>
          <h2>Login</h2>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Dashboard</h2>
          <button onClick={handleGetTimers}>Pobierz Timery</button>
          <button onClick={handleGetTasks}>Pobierz Zadania</button>
        </div>
      )}
    </div>
  );
}
export default App;
