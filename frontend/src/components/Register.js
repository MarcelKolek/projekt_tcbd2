import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.post('/register', { username, password });
      setMessage('Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link to="/login">
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default Register;