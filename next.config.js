// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**@type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_DOMAIN: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://eshop-api.geef.cc',
    DOMAIN: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://eshop.geef.cc'
  },
  webpack: (config) => {
    config.resolve.modules.push(path.resolve('./'));
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  }
};
module.exports = nextConfig;
