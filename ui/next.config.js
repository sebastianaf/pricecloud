const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  //reactStrictMode: true,
  //swcMinify: true,
  images: {
    domains: [`pricecloud.org`, `dev.pricecloud.org`]
  },
  webpack: (config, options) => {
    config.resolve.alias[`@helper`] = path.join(__dirname, `src/helper`);
    config.resolve.alias[`@components`] = path.join(
      __dirname,
      `src/components`
    );
    if (options.isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }
    return config;
  }
};

module.exports = nextConfig;