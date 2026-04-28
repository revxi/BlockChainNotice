import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminPanel from './AdminPanel';

describe('AdminPanel Component', () => {
  const mockOnPublish = vi.fn();

  it('renders the admin panel with correct elements', () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    expect(screen.getByText(/Issue New Notice/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notice Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Exam Schedule Spring 2024/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the full details of the notice.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Notice/i })).toBeInTheDocument();
  });

  it('updates form state when typing in input fields', () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentTextarea = screen.getByLabelText(/Content/i);

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentTextarea, { target: { value: 'Test Content' } });

    expect(titleInput.value).toBe('Test Title');
    expect(contentTextarea.value).toBe('Test Content');
  });

  it('calls onPublish with correct data and clears form on submission', async () => {
    mockOnPublish.mockResolvedValueOnce();
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentTextarea = screen.getByLabelText(/Content/i);
    const submitButton = screen.getByRole('button', { name: /Publish Notice/i });

    fireEvent.change(titleInput, { target: { value: 'New Notice Title' } });
    fireEvent.change(contentTextarea, { target: { value: 'Detailed notice content.' } });
    fireEvent.click(submitButton);

    expect(mockOnPublish).toHaveBeenCalledWith({
      title: 'New Notice Title',
      content: 'Detailed notice content.',
    });

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(contentTextarea.value).toBe('');
    });
  });

  it('shows loading state and disables inputs when loading prop is true', () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={true} />);

    expect(screen.getByText(/Publishing to Blockchain.../i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notice Title/i)).toBeDisabled();
    expect(screen.getByLabelText(/Content/i)).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
