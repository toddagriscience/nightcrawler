import { screen, render, act } from '@testing-library/react';
import { LocaleProvider, useLocale } from './LocaleContext';
import { defaultLocale } from '@/lib/i18n/config';
import '@testing-library/jest-dom';

// Mock component to access context values
const LocaleDisplay = () => {
  const { locale } = useLocale();
  return <div data-testid="locale-display">{locale}</div>;
};

describe('LocaleContext', () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();

    // Mock navigator with French language
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        language: 'fr-FR',
        languages: ['fr-FR', 'fr', 'en-US', 'en'],
      },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  it('should detect and set browser language if no saved preference exists', async () => {
    // Mock localStorage to return null (no saved preference)
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    await act(async () => {
      render(
        <LocaleProvider>
          <LocaleDisplay />
        </LocaleProvider>
      );
    });

    // Should detect French from browser settings
    expect(screen.getByTestId('locale-display')).toHaveTextContent('fr');
  });

  it('should prioritize saved preference over browser language', async () => {
    // Mock localStorage to return a saved preference
    (localStorage.getItem as jest.Mock).mockReturnValue('it'); // Italian saved preference

    await act(async () => {
      render(
        <LocaleProvider>
          <LocaleDisplay />
        </LocaleProvider>
      );
    });

    // Should use Italian from localStorage instead of French from browser
    expect(screen.getByTestId('locale-display')).toHaveTextContent('it');
  });

  it('should fallback to default locale for unsupported browser language', async () => {
    // Mock localStorage to return null (no saved preference)
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    // Mock navigator with Korean language (unsupported)
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        language: 'ko-KR',
        languages: ['ko-KR', 'ko'],
      },
      configurable: true,
    });

    await act(async () => {
      render(
        <LocaleProvider>
          <LocaleDisplay />
        </LocaleProvider>
      );
    });

    // Should fallback to default locale (en) since Korean is not supported
    expect(screen.getByTestId('locale-display')).toHaveTextContent(
      defaultLocale
    );
  });
});
