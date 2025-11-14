// Copyright Todd Agriscience, Inc. All rights reserved.

import { renderWithAct, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import NewsCard from './news-card';
import NewsCardProps from './types/news-card';

describe('NewsCard', () => {
  const mockProps: NewsCardProps = {
    image: { url: '/test-image.jpg', alt: 'Test Headline' },
    source: 'Test Source',
    date: 'Jan 1, 2025',
    title: 'Test Headline',
    excerpt: 'A tidbit of information',
    link: 'https://google.com',
  };

  it('renders without crashing', async () => {
    await renderWithAct(<NewsCard {...mockProps} />);

    expect(screen.getByText(/Test Source/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 1, 2025/)).toBeInTheDocument();
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
  });

  it('renders image with correct alt text', async () => {
    await renderWithAct(<NewsCard {...mockProps} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Headline');
  });

  it('applies custom className', async () => {
    const { container } = await renderWithAct(
      <NewsCard {...mockProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
