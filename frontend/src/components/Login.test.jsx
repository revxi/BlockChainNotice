import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({ address: null }),
  useConnect: () => ({ connect: vi.fn() }),
}));

vi.mock('wagmi/connectors', () => ({
  injected: vi.fn(),
}));

describe('Login Component', () => {
  it('calls onLogin with "user" when user login button is clicked', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    // Ensure "User Access" tab is active (default)
    // Find the button "Enter Dashboard"
    const loginButton = screen.getByRole('button', { name: /Enter Dashboard/i });

    fireEvent.click(loginButton);

    expect(mockOnLogin).toHaveBeenCalledWith('user');
  });
});
