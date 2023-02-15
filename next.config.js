const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/configuration',
        permanent: true,
      },
    ];
  }
};

module.exports = withImages(redirects);
