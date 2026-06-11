// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal root must be set synchronously on mount
    setPortalRoot(div);

    return () => {
      div.remove();
    };
  }, []);

  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
}
