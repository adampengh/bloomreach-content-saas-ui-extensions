const withImages = require('next-images');
const { version } = require('./package.json');

module.exports = {
  publicRuntimeConfig: {
    version,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/configuration',
        permanent: true,
      },
    ];
  },
};
