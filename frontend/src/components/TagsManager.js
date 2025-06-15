import React, { useState } from 'react';
import { taskApi } from '../services/api';
import authHeader from '../services/authHeader';

const TagsManager = ({ tags, onTagsChange }) => {
  const [name, setName] = useState('');

  const addTag = async () => {
    await taskApi.post('/tags', { name }, { headers: authHeader() });
    setName('');
    onTagsChange();
  };

  return (
    <div>
      <h2>Tags</h2>
      <input placeholder="New tag" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={addTag}>Add</button>
      <ul>
        {tags.map(tag => (
          <li key={tag._id}>
            {tag.name}
            <button onClick={async () => {
              const newName = prompt("Edit tag name:", tag.name);
              if (newName) {
                await taskApi.put(`/tags/${tag._id}`, { name: newName }, { headers: authHeader() });
                onTagsChange();
              }
            }}>Edit</button>
            <button onClick={async () => {
              await taskApi.delete(`/tags/${tag._id}`, { headers: authHeader() });
              onTagsChange();
            }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsManager;