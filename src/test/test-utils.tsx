import React from 'react';
import { render, RenderOptions, act, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';

// Default translations for common UI elements
export const defaultTranslations: Record<string, string> = {
  // Header translations
  'Header.getStarted': 'Get Started',
  'Header.menu.open': 'Open menu',
  'Header.menu.close': 'Close menu',

  // HomePage translations
  'HomePage.quote.text':
    'At Todd, we combine our deep experiance in sustainable agriculture, managing farms and engaging consumers.',
  'HomePage.quote.button': 'About',
  'HomePage.newsHighlights.title': 'News Highlights',
  'HomePage.newsHighlights.viewAll': 'View All',
  'HomePage.newsHighlights.placeholder':
    'Carousel component will be implemented here',
};

export type Translations = Partial<Record<string, string>>;

// Mock LocaleContext with dynamic translations
const mockLocaleContext = (translations: Translations = {}) => {
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
    t: (key: string) => mergedTranslations[key] || key,
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
}> = ({ children, translations = {} }) => {
  const context = mockLocaleContext(translations);
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
}

/**
 * Wraps components with all necessary providers for testing
 */
const AllTheProviders = ({
  children,
  translations = {},
}: AllTheProvidersProps) => {
  return (
    <ThemeProvider>
      <MockLocaleProvider translations={translations}>
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
  options?: Omit<RenderOptions, 'wrapper'> & { translations?: Translations }
) => {
  const { translations, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders {...props} translations={translations} />
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
