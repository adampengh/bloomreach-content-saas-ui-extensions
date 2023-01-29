const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [];
  }
};

module.exports = withImages(redirects);
