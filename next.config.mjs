let userConfig = undefined;

try {
  // Try to import ESM config
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    // Fallback to CJS-compatible config
    userConfig = await import('./v0-user-next.config');
  } catch (innerError) {
    // Silently ignore if both imports fail
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enables optimized Docker deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Not recommended for production, but useful for CI/testing
  },
  images: {
    unoptimized: true, // Disables Image Optimization (uses <img> instead of <Image>)
    domains: ['dev-essen.xyzap.site'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-essen.xyzap.site',
        port: '3002',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  unstable_excludeFiles: ['**/node_modules/**'], // Prevents unwanted files from being bundled
};

// Merge userConfig if available
if (userConfig) {
  const config = userConfig.default || userConfig;

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key]) &&
      config[key] !== null
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
