// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Preview } from '@storybook/react-vite';
import { withFonts } from './decorators/withFonts';
import { withNextNavigation } from './decorators/withNextNavigation';
import { withStorybookProvider } from './decorators/withStorybookProvider';
import '../src/app/globals.css';

const preview: Preview = {
  // withNextNavigation renders above the story, so the next/navigation mock
  // holds this story's route by the time a component reads it.
  decorators: [withNextNavigation, withStorybookProvider, withFonts],
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: '🇺🇸 English' },
          { value: 'es', title: '🇪🇸 Español' },
        ],
      },
    },
  },
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f8f5ee',
        },
        {
          name: 'dark',
          value: '#2A2727',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
