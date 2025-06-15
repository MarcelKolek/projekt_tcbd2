import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagsManager from '../TagsManager';
import { taskApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  taskApi: {
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    get: jest.fn().mockResolvedValue({ data: [] })
  }
}));

test('adds a new tag', async () => {
  const onTagsChange = jest.fn();
  taskApi.post.mockResolvedValueOnce({ data: { id: 'tag1', name: 'Urgent' } });

  render(<TagsManager tags={[]} onTagsChange={onTagsChange} />);
  
  fireEvent.change(screen.getByPlaceholderText(/New tag/i), { target: { value: 'Urgent' } });
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));

  await waitFor(() => {
    expect(taskApi.post).toHaveBeenCalledWith('/tags', { name: 'Urgent' }, expect.any(Object));
    expect(onTagsChange).toHaveBeenCalled();
  });
});
