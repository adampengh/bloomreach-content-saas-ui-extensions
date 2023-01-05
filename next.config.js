const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/configuration',
        permanent: false
      }
    ];
  }
};

module.exports = withImages(redirects);
