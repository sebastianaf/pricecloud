const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/tasks',
        permanent: true
      }
    ];
  }
};

module.exports = withImages(redirects);
