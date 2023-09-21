const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  //reactStrictMode: true,
  //swcMinify: true,
  images: {
    domains: [`pricecloud.org`, `dev.pricecloud.org`]
  },
  webpack: (config) => {
    config.resolve.alias[`@helper`] = path.join(__dirname, `src/helper`);
    config.resolve.alias[`@components`] = path.join(
      __dirname,
      `src/components`
    );
    return config;
  }
};

module.exports = nextConfig;
