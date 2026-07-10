// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useState, useEffect } from 'react';

/**
 * Helper hook for getting the width of the window. This hook is throttled to only be able to update `width` once every 100ms.
 *
 * @returns {number} - The width of the window*/
export default function useWindowWidth() {
  const [width, setWidth] = useState<number>();
  useEffect(() => {
    const handleResize = () =>
      setTimeout(() => setWidth(window.innerWidth), 100);
    window.addEventListener('resize', handleResize);

    const helper = async () => {
      setWidth(window.innerWidth);
    };
    helper();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  return width;
}
