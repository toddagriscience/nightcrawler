import { render, screen, fireEvent, act } from '@testing-library/react';
import LocaleSwitcher from './locale-switcher';
import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from '@/context/ThemeContext';
import '@testing-library/jest-dom';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LocaleProvider>{children}</LocaleProvider>
  </ThemeProvider>
);

describe('LocaleSwitcher', () => {
  it('renders with default locale', async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <LocaleSwitcher />
        </TestWrapper>
      );
    });

    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <LocaleSwitcher />
        </TestWrapper>
      );
    });

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('changes locale when option is selected', async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <LocaleSwitcher />
        </TestWrapper>
      );
    });

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    const spanishOption = screen.getByText('Español');
    await act(async () => {
      fireEvent.click(spanishOption);
    });

    expect(screen.getByText('es')).toBeInTheDocument();
  });
});
