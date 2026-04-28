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
