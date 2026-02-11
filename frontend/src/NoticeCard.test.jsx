import { render, screen } from '@testing-library/react';
import NoticeCard from './NoticeCard';
import { describe, it, expect } from 'vitest';

describe('NoticeCard', () => {
  const mockProps = {
    id: '123',
    title: 'Test Notice Title',
    hash: 'QmTestHash1234567890',
    date: '2023-10-27',
  };

  it('renders notice details correctly', () => {
    render(<NoticeCard {...mockProps} />);

    // Check ID
    expect(screen.getByText(`ID: #${mockProps.id}`)).toBeInTheDocument();

    // Check Title
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();

    // Check Date
    expect(screen.getByText(mockProps.date)).toBeInTheDocument();

    // Check Hash
    expect(screen.getByText(mockProps.hash)).toBeInTheDocument();
  });

  it('renders the "View on IPFS" button with correct aria-label', () => {
    render(<NoticeCard {...mockProps} />);
    const button = screen.getByRole('button', { name: `View notice ${mockProps.id} on IPFS` });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('View on IPFS');
  });

  it('renders the Verified badge', () => {
    render(<NoticeCard {...mockProps} />);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });
});
