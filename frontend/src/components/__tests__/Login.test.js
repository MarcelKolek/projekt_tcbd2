import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter } from 'react-router-dom';
import { authApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  authApi: { post: jest.fn() }
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

test('renders login form and submits successfully', async () => {
  const fakeUser = { id: '123', username: 'test', role: 'user' };
  authApi.post.mockResolvedValueOnce({ data: fakeUser });
  const onLogin = jest.fn();

  renderWithRouter(<Login onLogin={onLogin} />);

  const userInput = screen.getByPlaceholderText(/Username/i);
  const passInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByRole('button', { name: /Log In/i });

  fireEvent.change(userInput, { target: { value: 'testuser' } });
  fireEvent.change(passInput, { target: { value: 'testpass' } });
  fireEvent.click(loginButton);

  await waitFor(() => expect(onLogin).toHaveBeenCalledWith(fakeUser));
});

test('shows error message on login failure', async () => {
  authApi.post.mockRejectedValueOnce({ response: { data: { message: 'Login failed' } } });

  renderWithRouter(<Login onLogin={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
  expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
});
