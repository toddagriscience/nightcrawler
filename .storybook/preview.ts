import type { Preview } from '@storybook/nextjs-vite';
import { withFonts } from './decorators/withFonts';
import { withStorybookProvider } from './decorators/withStorybookProvider';
import '../src/app/globals.css';

const preview: Preview = {
  decorators: [withStorybookProvider, withFonts],
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
        showName: true,
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
      test: 'todo'
    }
  },
};

export default preview;