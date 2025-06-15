import React, { useEffect, useState } from 'react';
import { authApi } from '../services/api';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formState, setFormState] = useState({ username: '', role: '', password: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'admin') {
      setError('Access denied. Admins only.');
      return;
    }
    setCurrentUser(storedUser);

    authApi.get('/users', {
      headers: { Authorization: `Bearer ${storedUser.accessToken}` }
    })
      .then(res => setUsers(res.data))
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch users');
      });
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormState({ username: user.username, role: user.role, password: '' });
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const { id } = editingUser;
      const updatePayload = {
        username: formState.username,
        role: formState.role,
      };
      if (formState.password.trim()) {
        updatePayload.password = formState.password;
      }

      const res = await authApi.put(`/users/${id}`, updatePayload, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` }
      });

      setUsers(users.map(u => u.id === id ? { ...u, ...res.data } : u));
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Admin: User Management</h2>

      {editingUser ? (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
          <h3>Edit User</h3>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formState.username}
              onChange={handleChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <br /><br />
          <label>
            New Password:
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              style={{ marginLeft: '10px' }}
            />
          </label>
          <br /><br />
          <label>
            Role:
            <select name="role" value={formState.role} onChange={handleChange} style={{ marginLeft: '10px' }}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <br /><br />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditingUser(null)} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} - {user.role}
              <button onClick={() => handleEditClick(user)} style={{ marginLeft: '1rem' }}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminUserList;