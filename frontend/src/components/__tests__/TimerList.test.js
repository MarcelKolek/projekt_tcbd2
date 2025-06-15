import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TimerList from '../TimerList';
import { timerApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  timerApi: {
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

test('creates a new timer on form submit', async () => {
  const onDataChanged = jest.fn();

  renderWithRouter(
    <TimerList timers={[]} onSelect={() => {}} onDataChanged={onDataChanged} />
  );

  fireEvent.change(screen.getByPlaceholderText(/Work Time/i), {
    target: { value: '25' }
  });
  fireEvent.change(screen.getByPlaceholderText(/Break Time/i), {
    target: { value: '5' }
  });
  fireEvent.change(screen.getByPlaceholderText(/Cycles/i), {
    target: { value: '4' }
  });
  fireEvent.change(screen.getByPlaceholderText(/Description/i), {
    target: { value: 'Test Timer' }
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Create Timer/i }));
  });

  expect(timerApi.post).toHaveBeenCalledWith(
    '/timers',
    { workTime: 25, breakTime: 5, cycles: 4, description: 'Test Timer' },
    expect.any(Object)
  );

  expect(onDataChanged).toHaveBeenCalled();
});
