import React from 'react';

export const withCursor = (Story: any) => {
  return (
    <>
      <style>
        {`
          /* Override the global cursor: none for Storybook */
          .docs-story,
          .sb-show-main {
            cursor: auto !important;
          }
          .docs-story *,
          .docs-story a,
          .docs-story button,
          .docs-story [role="button"],
          .sb-show-main *,
          .sb-show-main a,
          .sb-show-main button,
          .sb-show-main [role="button"] {
            cursor: auto !important;
          }
          
          /* Restore proper cursor states */
          .docs-story .cursor-pointer,
          .sb-show-main .cursor-pointer,
          .docs-story button,
          .sb-show-main button,
          .docs-story a,
          .sb-show-main a,
          .docs-story [role="button"],
          .sb-show-main [role="button"] {
            cursor: pointer !important;
          }
          
          .docs-story .cursor-none,
          .sb-show-main .cursor-none {
            cursor: none !important;
          }
          
          /* Override nav-hover-cursor behavior in Storybook */
          .docs-story .nav-hover-cursor,
          .sb-show-main .nav-hover-cursor {
            cursor: pointer !important;
          }
          
          /* Fix any specific component cursor issues */
          .docs-story input,
          .sb-show-main input,
          .docs-story textarea,
          .sb-show-main textarea {
            cursor: text !important;
          }
        `}
      </style>
      <div style={{ cursor: 'auto' }}>
        <Story />
      </div>
    </>
  );
};
