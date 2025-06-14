import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TimerList from './components/TimerList';
import Session from './components/Session';
import Stats from './components/Stats';
import TagsManager from './components/TagsManager';
import TasksManager from './components/TasksManager';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (usr) => {
    setUser(usr);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin}/> : <Navigate to="/"/>} />
        <Route path="/register" element={<Register />} />
        {user && <>
          <Route path="/" element={<TimerList />} />
          <Route path="/session" element={<Session />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/tags" element={<TagsManager />} />
          <Route path="/tasks" element={<TasksManager />} />
          <Route path="/settings" element={<Settings />} />
          {user.role === 'admin' && <Route path="/admin" element={<AdminPanel />} />}
        </>}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;