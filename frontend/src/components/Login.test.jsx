import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { useAccount, useConnect, useReadContract } from 'wagmi';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useReadContract: vi.fn(),
}));

vi.mock('wagmi/connectors', () => ({
  injected: vi.fn(),
}));

const mockAdminAddress = '0x1234567890123456789012345678901234567890';
const mockUserAddress = '0x9876543210987654321098765432109876543210';

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useReadContract.mockReturnValue({ data: mockAdminAddress });
  });

  it('calls onLogin with "user" when user login button is clicked', () => {
    useAccount.mockReturnValue({ address: null });
    useConnect.mockReturnValue({ connectors: [], connect: vi.fn(), isPending: false });

    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    const loginButton = screen.getByRole('button', { name: /Enter Dashboard/i });
    fireEvent.click(loginButton);

    expect(mockOnLogin).toHaveBeenCalledWith('user');
  });

  it('calls onLogin with "admin" when admin wallet is connected and matches admin address', async () => {
    useAccount.mockReturnValue({ address: mockAdminAddress });
    useConnect.mockReturnValue({ connectors: [], connect: vi.fn(), isPending: false });

    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    // Switch to Admin Portal tab
    const adminTab = screen.getByRole('button', { name: /Admin Portal/i });
    fireEvent.click(adminTab);

    const verifyButton = screen.getByRole('button', { name: /Verify & Enter/i });
    fireEvent.click(verifyButton);

    expect(mockOnLogin).toHaveBeenCalledWith('admin');
  });

  it('shows error and does not call onLogin when connected wallet is NOT admin', async () => {
    useAccount.mockReturnValue({ address: mockUserAddress });
    useConnect.mockReturnValue({ connectors: [], connect: vi.fn(), isPending: false });

    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    // Switch to Admin Portal tab
    const adminTab = screen.getByRole('button', { name: /Admin Portal/i });
    fireEvent.click(adminTab);

    const verifyButton = screen.getByRole('button', { name: /Verify & Enter/i });
    fireEvent.click(verifyButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/Unauthorized: Connected wallet is not the admin/i)).toBeInTheDocument();
  });

  it('auto-logs in admin if already connected on tab switch', async () => {
    useAccount.mockReturnValue({ address: mockAdminAddress });
    useConnect.mockReturnValue({ connectors: [], connect: vi.fn(), isPending: false });

    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    // Switch to Admin Portal tab
    const adminTab = screen.getByRole('button', { name: /Admin Portal/i });
    fireEvent.click(adminTab);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('admin');
    });
  });
});
