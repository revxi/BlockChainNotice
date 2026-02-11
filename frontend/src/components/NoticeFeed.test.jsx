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
import { render, screen } from '@testing-library/react';
import NoticeFeed from './NoticeFeed';
import { describe, it, expect } from 'vitest';

describe('NoticeFeed Component', () => {
  it('renders NoticeCard components when filteredNotices is provided', () => {
    const mockNotices = [
      { id: 1, title: 'Notice 1', hash: '0x123', date: '2023-01-01' },
      { id: 2, title: 'Notice 2', hash: '0x456', date: '2023-01-02' },
    ];

    render(<NoticeFeed filteredNotices={mockNotices} searchQuery="" />);

    expect(screen.getByText('Notice 1')).toBeInTheDocument();
    expect(screen.getByText('Notice 2')).toBeInTheDocument();
  });

  it('renders default empty state message when filteredNotices is empty and no searchQuery', () => {
    render(<NoticeFeed filteredNotices={[]} searchQuery="" />);

    expect(
      screen.getByText('There are currently no notices published on the blockchain ledger.')
    ).toBeInTheDocument();
    expect(screen.queryByText(/We couldn't find any notices matching/)).not.toBeInTheDocument();
  });

  it('renders search-specific empty state message when filteredNotices is empty and searchQuery is provided', () => {
    const query = 'test query';
    render(<NoticeFeed filteredNotices={[]} searchQuery={query} />);

    expect(
      screen.getByText(`We couldn't find any notices matching "${query}". Try a different keyword or ID.`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText('There are currently no notices published on the blockchain ledger.')
    ).not.toBeInTheDocument();
  });
});
