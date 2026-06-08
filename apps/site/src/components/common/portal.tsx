// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    divRef.current = div;
    setMounted(true);

    return () => {
      div.remove();
    };
  }, []);

  if (!mounted) return null;

  return createPortal(children, divRef.current);
}
