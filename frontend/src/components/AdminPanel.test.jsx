import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminPanel from './AdminPanel';

describe('AdminPanel Component', () => {
  const mockOnPublish = vi.fn();

  it('renders the form with initial empty state', () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    expect(screen.getByText(/Issue New Notice/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notice Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Content/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /Publish Notice/i })).toBeInTheDocument();
  });

  it('updates input values on user input', () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Content/i);

    fireEvent.change(titleInput, { target: { value: 'New Notice Title' } });
    fireEvent.change(contentInput, { target: { value: 'This is the notice content' } });

    expect(titleInput).toHaveValue('New Notice Title');
    expect(contentInput).toHaveValue('This is the notice content');
  });

  it('calls onPublish with form data and clears form on submit', async () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    const submitButton = screen.getByRole('button', { name: /Publish Notice/i });

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    fireEvent.click(submitButton);

    expect(mockOnPublish).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content',
    });

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(contentInput).toHaveValue('');
    });
  });

  it('disables inputs and button when loading is true', () => {
    render(<AdminPanel onPublish={mockOnPublish} loading={true} />);

    expect(screen.getByLabelText(/Notice Title/i)).toBeDisabled();
    expect(screen.getByLabelText(/Content/i)).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/Publishing to Blockchain.../i)).toBeInTheDocument();
  });
});
