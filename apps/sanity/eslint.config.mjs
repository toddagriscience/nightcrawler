// Copyright © Todd Agriscience, Inc. All rights reserved.

import studio from '@sanity/eslint-config-studio'

export default [
  ...studio,
  {
    // ESLint 10 removed the filename API used by React's automatic detection.
    settings: {react: {version: '19.2'}},
  },
]
