import React from 'react';
import { neueHaasUnica, utahWGLCondensed } from '../../src/lib/fonts';

export const withFonts = (Story: any) => {
  return (
    <div className={`${neueHaasUnica.variable} ${utahWGLCondensed.variable} antialiased font-thin`} style={{ fontFamily: 'var(--font-haas)' }}>
      <Story />
    </div>
  );
};
