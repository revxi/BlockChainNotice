import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoticeFeed from "./NoticeFeed";

// Mock NoticeCard to isolate NoticeFeed testing
vi.mock("../NoticeCard", () => ({
  default: ({ title }) => <div data-testid="notice-card">{title}</div>,
}));

describe("NoticeFeed Component", () => {
  const mockNotices = [
    { id: 1, title: "First Notice", hash: "0x123", date: "2023-01-01" },
    { id: 2, title: "Second Notice", hash: "0x456", date: "2023-01-02" },
  ];

  it("renders a list of notices when filteredNotices has items", () => {
    render(<NoticeFeed filteredNotices={mockNotices} />);

    const noticeCards = screen.getAllByTestId("notice-card");
    expect(noticeCards).toHaveLength(2);
    expect(screen.getByText("First Notice")).toBeInTheDocument();
    expect(screen.getByText("Second Notice")).toBeInTheDocument();
  });

  it("renders 'No notices found' message when filteredNotices is empty", () => {
    render(<NoticeFeed filteredNotices={[]} />);

    expect(screen.getByText("No notices found")).toBeInTheDocument();
    expect(
      screen.getByText("There are currently no notices published on the blockchain ledger.")
    ).toBeInTheDocument();
  });

  it("renders specific message when filteredNotices is empty and searchQuery is provided", () => {
    const searchQuery = "non-existent";
    render(<NoticeFeed filteredNotices={[]} searchQuery={searchQuery} />);

    expect(screen.getByText("No notices found")).toBeInTheDocument();
    expect(
      screen.getByText(`We couldn't find any notices matching "${searchQuery}". Try a different keyword or ID.`)
    ).toBeInTheDocument();
  });

  it("renders correct message when filteredNotices is null or undefined", () => {
    render(<NoticeFeed filteredNotices={null} />);
    expect(screen.getByText("No notices found")).toBeInTheDocument();
  });
});
