import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PomodoroManager from './components/PomodoroManager';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (usr) => {
    setUser(usr);
  };

const handleLogout = () => {
  localStorage.removeItem('user');
  setUser(null);
};

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin}/> : <Navigate to="/"/>} />
        <Route path="/register" element={<Register />} />
        {user && <>
          <Route path="/" element={<PomodoroManager onLogout={handleLogout}/>} />
        </>}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;