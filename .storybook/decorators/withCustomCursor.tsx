import React from 'react';
import Cursor from '../../src/components/ui/common/Cursor';

export const withCustomCursor = (Story: any) => {
  return (
    <>
      <Story />
      <Cursor />
    </>
  );
};
