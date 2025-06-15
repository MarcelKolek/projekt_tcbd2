import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SessionStats from '../SessionStats';
import { timerApi } from '../../services/api';

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (msg.includes('ReactDOMTestUtils.act') || msg.includes('revokeObjectURL')) return;
    console.error(msg);
  });
});

jest.mock('../../services/api', () => ({
  timerApi: { get: jest.fn() }
}));

test('renders statistics and history download', async () => {
  const stats = { totalTime: 3661, completedSessions: 3 };
  const sessions = [
    {
      id: '1',
      timerId: 't1',
      startTime: new Date(0).toISOString(),
      endTime: new Date(1800000).toISOString()
    }
  ];

  timerApi.get
    .mockResolvedValueOnce({ data: stats })
    .mockResolvedValueOnce({ data: sessions });

  render(<SessionStats />);

  expect(await screen.findByText((_, el) =>
    el?.textContent === 'Total time spent working: 1h 1m 1s'
  )).toBeInTheDocument();

  expect(screen.getByText((_, el) =>
    el?.textContent === 'Completed sessions: 3'
  )).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Download statistics/i }));
  fireEvent.click(screen.getByRole('button', { name: /Download session history/i }));
});
