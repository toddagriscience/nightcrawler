//Copyright Todd LLC, All rights reserved.

import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import '@testing-library/jest-dom';

// Mock component to access theme context values
const ThemeDisplay = () => {
  const { isDark, toggleDark, setIsDark, setIsDarkSmooth } = useTheme();
  return (
    <div>
      <div data-testid="theme-display">{isDark ? 'dark' : 'light'}</div>
      <button data-testid="toggle-btn" onClick={toggleDark}>
        Toggle
      </button>
      <button data-testid="set-dark-btn" onClick={() => setIsDark(true)}>
        Set Dark
      </button>
      <button
        data-testid="set-smooth-btn"
        onClick={() => setIsDarkSmooth(true)}
      >
        Set Smooth
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  const mockDocumentElement = {
    setAttribute: jest.fn(),
    style: {
      setProperty: jest.fn(),
    },
  };

  beforeEach(() => {
    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true,
    });

    // Reset timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    mockDocumentElement.setAttribute.mockReset();
    mockDocumentElement.style.setProperty.mockReset();
  });

  it('should initialize with light theme', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );
    });

    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'light'
    );
  });

  it('should toggle theme', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );
    });

    // Initial state
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');

    // Toggle to dark
    await act(async () => {
      screen.getByTestId('toggle-btn').click();
    });

    expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'dark'
    );
  });

  it('should handle smooth theme transition', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );
    });

    // Initial state
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');

    // Start smooth transition
    await act(async () => {
      screen.getByTestId('set-smooth-btn').click();
    });

    // Theme should not change immediately
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');

    // Fast-forward timer
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Theme should be dark after transition
    expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'dark'
    );
  });

  it('should prevent multiple smooth transitions at once', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );
    });

    // Initial state
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');

    // Trigger multiple transitions
    await act(async () => {
      screen.getByTestId('set-smooth-btn').click();
      screen.getByTestId('set-smooth-btn').click();
      screen.getByTestId('set-smooth-btn').click();
    });

    // Fast-forward timer
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Theme should only have changed once
    expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledTimes(2); // Initial + one change
  });
});
