const createNextIntlPlugin = require('next-intl/plugin');
const { withContentlayer } = require('next-contentlayer');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': [
        'node_modules/@bigfive-org/questions/data/**/*',
        'node_modules/@bigfive-org/results/lib/data/**/*'
      ]
    }
  }
};

module.exports = withContentlayer(withNextIntl(nextConfig));
