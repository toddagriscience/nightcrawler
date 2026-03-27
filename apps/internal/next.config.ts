// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nightcrawler/db'],
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
