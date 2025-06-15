import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../Register';
import { authApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  authApi: { post: jest.fn() }
}));

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

test('renders register form and shows success message', async () => {
  authApi.post.mockResolvedValueOnce({});
  renderWithRouter(<Register />);
  fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'newuser' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'newpass' } });
  fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  expect(await screen.findByText(/Registration successful/i)).toBeInTheDocument();
});

test('shows error message on registration failure', async () => {
  authApi.post.mockRejectedValueOnce({ response: { data: { message: 'Error' } } });
  renderWithRouter(<Register />);
  fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  expect(await screen.findByText(/Error/i)).toBeInTheDocument();
});
