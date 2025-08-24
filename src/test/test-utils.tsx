import React from 'react';
import { render, RenderOptions, act, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';

// Default translations for common UI elements
export const defaultTranslations: Record<string, string> = {
  // Header translations (new modular keys)
  'navigation.header.actions.getStarted': 'Get Started',
  'navigation.header.menu.open': 'Open menu',
  'navigation.header.menu.close': 'Close menu',
  'navigation.header.navigation.home': 'Home',
  'navigation.header.navigation.about': 'About',
  'navigation.header.navigation.offerings': 'Offerings',
  'navigation.header.navigation.approach': 'Approach',
  'navigation.header.navigation.impact': 'Impact',
  'navigation.header.navigation.news': 'News',

  // Homepage translations (new modular keys)
  'homepage.hero.title': 'Creating the next-generation organic farms',
  'homepage.quote.text':
    'At Todd, we combine our deep experiance in sustainable agriculture, managing farms and engaging consumers.',
  'homepage.quote.button': 'About',
  'homepage.newsHighlights.title': 'News Highlights',
  'homepage.newsHighlights.viewAll': 'View All',
  'homepage.newsHighlights.placeholder':
    'Carousel component will be implemented here',

  // Common translations
  'common.actions.close': 'Close',
  'common.actions.menu': 'Menu',
  'common.buttons.about': 'About',
  'common.buttons.viewAll': 'View All',

  // Navigation translations
  'navigation.footer.copyright':
    '© {year} Todd Agriscience. All rights reserved.',
};

export type Translations = Partial<Record<string, string>>;

// Mock LocaleContext with dynamic translations
const mockLocaleContext = (
  translations: Translations = {},
  isLoading: boolean = false
) => {
  const mergedTranslations: Record<string, string> = { ...defaultTranslations };

  // Only merge defined translations
  Object.entries(translations).forEach(([key, value]) => {
    if (value !== undefined) {
      mergedTranslations[key] = value;
    }
  });

  return {
    locale: 'en',
    setLocale: jest.fn(),
    messages: mergedTranslations,
    t: (key: string) => mergedTranslations[key] || key,
    isLoading,
    loadModule: jest.fn().mockResolvedValue({}),
    loadModules: jest.fn().mockResolvedValue({}),
    preloadCritical: jest.fn().mockResolvedValue(undefined),
  };
};

// Mock framer-motion
jest.mock('framer-motion', () => {
  const MockMotionComponent = ({
    children,
    ...props
  }: React.HTMLProps<HTMLDivElement>) => {
    const { ...rest } = props;
    return <div {...rest}>{children}</div>;
  };

  return {
    ...jest.requireActual('framer-motion'),
    useScroll: jest.fn(() => ({ scrollYProgress: 0 })),
    useMotionValueEvent: jest.fn(),
    motion: {
      div: MockMotionComponent,
      button: MockMotionComponent,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element: React.ReactNode) => element,
}));

// Create a mock LocaleContext
const LocaleContext = React.createContext<
  ReturnType<typeof mockLocaleContext> | undefined
>(undefined);

// Create a mock LocaleProvider that uses our translations
const MockLocaleProvider: React.FC<{
  children: React.ReactNode;
  translations?: Translations;
  isLoading?: boolean;
}> = ({ children, translations = {}, isLoading = false }) => {
  const context = mockLocaleContext(translations, isLoading);
  return (
    <LocaleContext.Provider value={context}>{children}</LocaleContext.Provider>
  );
};

// Mock the useLocale hook
jest.mock('@/context/LocaleContext', () => ({
  ...jest.requireActual('@/context/LocaleContext'),
  useLocale: () => {
    const context = React.useContext(LocaleContext);
    if (!context) {
      throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
  },
}));

interface AllTheProvidersProps {
  children: React.ReactNode;
  translations?: Translations;
  isLoading?: boolean;
}

/**
 * Wraps components with all necessary providers for testing
 */
const AllTheProviders = ({
  children,
  translations = {},
  isLoading = false,
}: AllTheProvidersProps) => {
  return (
    <ThemeProvider>
      <MockLocaleProvider translations={translations} isLoading={isLoading}>
        {children}
      </MockLocaleProvider>
    </ThemeProvider>
  );
};

/**
 * Custom render function that wraps components with all necessary providers
 */
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    translations?: Translations;
    isLoading?: boolean;
  }
) => {
  const { translations, isLoading, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders
        {...props}
        translations={translations}
        isLoading={isLoading}
      />
    ),
    ...renderOptions,
  });
};

/**
 * Helper function to wrap async renders in act()
 */
const renderWithAct = async (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    translations?: Record<string, string>;
    isLoading?: boolean;
  }
) => {
  let result: ReturnType<typeof customRender>;
  await act(async () => {
    result = customRender(ui, options);
  });
  return result!;
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, renderWithAct, AllTheProviders };

// Make fireEvent async for consistency
const asyncFireEvent = {
  ...fireEvent,
  click: async (element: Element) => {
    await act(async () => {
      fireEvent.click(element);
    });
  },
  keyDown: async (element: Element, options: KeyboardEventInit) => {
    await act(async () => {
      fireEvent.keyDown(element, options);
    });
  },
};

export { asyncFireEvent as fireEvent };
