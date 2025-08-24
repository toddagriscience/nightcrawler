import { locales, type Locale } from '../../src/lib/i18n/config';

export const storybookControls = {
  locale: {
    control: { type: 'select' },
    options: locales,
    description: 'Select the locale/language for the story',
    defaultValue: 'en' as Locale,
  },
  isDark: {
    control: { type: 'boolean' },
    description: 'Use dark theme colors',
    defaultValue: false,
  }
};

export const storybookArgs = {
  locale: 'en' as Locale,
  isDark: false,
};