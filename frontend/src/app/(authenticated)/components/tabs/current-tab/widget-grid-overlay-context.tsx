// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { createContext, useContext } from 'react';

type WidgetGridOverlayContextValue = {
  showDotGrid: boolean;
  setShowDotGrid: (value: boolean) => void;
};

const WidgetGridOverlayContext =
  createContext<WidgetGridOverlayContextValue | null>(null);

export function WidgetGridOverlayProvider({
  value,
  children,
}: {
  value: WidgetGridOverlayContextValue;
  children: React.ReactNode;
}) {
  return (
    <WidgetGridOverlayContext.Provider value={value}>
      {children}
    </WidgetGridOverlayContext.Provider>
  );
}

export function useWidgetGridOverlay() {
  const context = useContext(WidgetGridOverlayContext);

  if (!context) {
    return {
      showDotGrid: false,
      setShowDotGrid: () => {},
    };
  }

  return context;
}
