//Copyright Todd LLC, All rights reserved.

import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './button';

describe('Button', () => {
  it('renders with required props', () => {
    render(<Button href="/contact" text="Get In Touch" />);

    const button = screen.getByTestId('button-component');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/contact');
    expect(button).toHaveTextContent('Get In Touch');
  });

  it('renders with custom text and href', () => {
    render(<Button text="Click Me" href="/custom-link" />);

    const button = screen.getByTestId('button-component');
    expect(button).toHaveAttribute('href', '/custom-link');
    expect(button).toHaveTextContent('Click Me');
  });

  it('renders without arrow when showArrow is false', () => {
    render(<Button href="/test" text="Test" showArrow={false} />);

    const button = screen.getByTestId('button-component');
    expect(button.querySelector('svg')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button href="/test" text="Test" className="custom-class" />);

    const button = screen.getByTestId('button-component');
    expect(button).toHaveClass('custom-class');
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(
      <Button href="/test" text="Test" variant="outline" />
    );
    let button = screen.getByTestId('button-component');
    expect(button).toHaveClass('border', 'border-[#2A2727]');

    rerender(<Button href="/test" text="Test" variant="default" />);
    button = screen.getByTestId('button-component');
    expect(button).toHaveClass('bg-[#2A2727]', 'text-[#FDFDFB]');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button href="/test" text="Test" size="sm" />);
    let button = screen.getByTestId('button-component');
    expect(button).toHaveClass('text-sm', 'md:text-base', 'px-3', 'py-1');

    rerender(<Button href="/test" text="Test" size="md" />);
    button = screen.getByTestId('button-component');
    expect(button).toHaveClass('text-base', 'md:text-lg', 'px-4', 'py-2');

    rerender(<Button href="/test" text="Test" size="lg" />);
    button = screen.getByTestId('button-component');
    expect(button).toHaveClass(
      'text-lg',
      'md:text-xl',
      'lg:text-2xl',
      'px-5',
      'py-2'
    );
  });
});
