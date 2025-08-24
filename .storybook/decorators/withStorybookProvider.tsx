import React from 'react';
import { Decorator } from '@storybook/react';
import { StorybookProvider } from '../utils/StorybookProvider';

export const withStorybookProvider: Decorator = (Story, context) => {
  const { args, parameters } = context;
  
  // Use args from controls, fallback to parameters, then defaults
  const locale = args?.locale || parameters?.storybook?.locale || 'en';
  const isDark = args?.isDark ?? parameters?.storybook?.isDark ?? false;
  const showLanguageSwitcher = args?.showLanguageSwitcher ?? parameters?.storybook?.showLanguageSwitcher ?? true;
  const showThemeSwitcher = args?.showThemeSwitcher ?? parameters?.storybook?.showThemeSwitcher ?? true;

  return (
    <StorybookProvider
      locale={locale}
      isDark={isDark}
      showLanguageSwitcher={showLanguageSwitcher}
      showThemeSwitcher={showThemeSwitcher}
    >
      <Story />
    </StorybookProvider>
  );
};