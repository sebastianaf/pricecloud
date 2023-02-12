const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard',
        permanent: true
      }
    ];
  }
};

module.exports = withImages(redirects);
