import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

// Mock the ThemeContext
vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSelector Component', () => {
  const mockChangeTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the correct initial theme (system)', () => {
    useTheme.mockReturnValue({ theme: 'system', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    // Check if the system theme text is displayed on the main button
    expect(screen.getByText('system')).toBeInTheDocument();
  });

  it('renders with the correct initial theme (dark)', () => {
    useTheme.mockReturnValue({ theme: 'dark', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  it('renders with the correct initial theme (light)', () => {
    useTheme.mockReturnValue({ theme: 'light', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('displays all theme options in the dropdown', () => {
    useTheme.mockReturnValue({ theme: 'light', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls changeTheme with "dark" when Dark option is clicked', () => {
    useTheme.mockReturnValue({ theme: 'light', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);

    expect(mockChangeTheme).toHaveBeenCalledWith('dark');
  });

  it('calls changeTheme with "light" when Light option is clicked', () => {
    useTheme.mockReturnValue({ theme: 'dark', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    const lightOption = screen.getByText('Light');
    fireEvent.click(lightOption);

    expect(mockChangeTheme).toHaveBeenCalledWith('light');
  });

  it('calls changeTheme with "system" when System option is clicked', () => {
    useTheme.mockReturnValue({ theme: 'dark', changeTheme: mockChangeTheme });

    render(<ThemeSelector />);

    const systemOption = screen.getByText('System');
    fireEvent.click(systemOption);

    expect(mockChangeTheme).toHaveBeenCalledWith('system');
  });
});
