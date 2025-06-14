import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.post('/login', { username, password });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Log In</button>
      </form>
      <p>
       Don’t have an account?{' '}
       <Link to="/register">
         Register here
       </Link>
      </p>
    </div>
  );
}

export default Login;
