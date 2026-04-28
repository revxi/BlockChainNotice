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
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AdminPanel from "./AdminPanel";

describe("AdminPanel Component", () => {
  it("renders the form elements correctly", () => {
    render(<AdminPanel onPublish={vi.fn()} loading={false} />);

    expect(screen.getByText("Issue New Notice")).toBeInTheDocument();
    expect(screen.getByLabelText(/Notice Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Publish Notice/i })).toBeInTheDocument();
  });

  it("has required attributes on inputs", () => {
    render(<AdminPanel onPublish={vi.fn()} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Content/i);

    expect(titleInput).toBeRequired();
    expect(contentInput).toBeRequired();
  });

  it("calls onPublish with form data and clears fields on submit", async () => {
    const user = userEvent.setup();
    const mockOnPublish = vi.fn().mockResolvedValue();
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    const submitButton = screen.getByRole("button", { name: /Publish Notice/i });

    await user.type(titleInput, "Test Title");
    await user.type(contentInput, "Test Content");

    await user.click(submitButton);

    expect(mockOnPublish).toHaveBeenCalledWith({
      title: "Test Title",
      content: "Test Content",
    });

    // Form should be cleared after the async submission
    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(contentInput.value).toBe("");
    });
  });

  it("validates fields before submission", async () => {
    const user = userEvent.setup();
    const mockOnPublish = vi.fn();
    render(<AdminPanel onPublish={mockOnPublish} loading={false} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    const submitButton = screen.getByRole("button", { name: /Publish Notice/i });

    // Check individual field validity
    expect(titleInput.validity.valid).toBe(false);
    expect(contentInput.validity.valid).toBe(false);

    // Try to click without filling anything
    await user.click(submitButton);
    expect(mockOnPublish).not.toHaveBeenCalled();

    // Fill only title
    await user.type(titleInput, "Test Title");
    expect(titleInput.validity.valid).toBe(true);
    expect(contentInput.validity.valid).toBe(false);

    await user.click(submitButton);
    expect(mockOnPublish).not.toHaveBeenCalled();
  });

  it("disables fields and shows loading state when loading is true", () => {
    render(<AdminPanel onPublish={vi.fn()} loading={true} />);

    expect(screen.getByLabelText(/Notice Title/i)).toBeDisabled();
    expect(screen.getByLabelText(/Content/i)).toBeDisabled();
    const submitButton = screen.getByRole("button", { name: /Publishing to Blockchain.../i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Publishing to Blockchain.../i);
  });
});
