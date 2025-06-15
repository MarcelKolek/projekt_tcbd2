import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Session from '../Session';
import { timerApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  timerApi: { post: jest.fn(), patch: jest.fn() }
}));

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

test('displays initial time and starts session', async () => {
  const timer = { id: 't1', description: 'Test', workTime: 0.05, breakTime: 0.01, cycles: 1 };
  timerApi.post.mockResolvedValueOnce({ data: { id: 's1' } });

  render(<Session timer={timer} onCancel={jest.fn()} onStatsUpdate={jest.fn()} />);

  expect(screen.getByText(/Phase: Work/i)).toBeInTheDocument();
  expect(screen.getByText(/Time Left: 00:03/i)).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
  });

  expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(3000);
  });

  expect(screen.getByText(/Phase: Break/i)).toBeInTheDocument();
});
