module.exports = {
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
