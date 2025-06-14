import React, { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import authHeader from '../services/authHeader';

function TagsManager() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const res = await taskApi.get('/tags', { headers: authHeader() });
    setTags(res.data);
  };

  const addTag = async () => {
    await taskApi.post('/tags', { name }, { headers: authHeader() });
    setName('');
    fetchTags();
  };

  return (
    <div>
      <h2>Tags</h2>
      <input placeholder="New tag" value={name}
        onChange={e => setName(e.target.value)} />
      <button onClick={addTag}>Add</button>
      <ul>
        {tags.map(t => <li key={t._id}>{t.name}</li>)}
      </ul>
    </div>
  );
}

export default TagsManager;
