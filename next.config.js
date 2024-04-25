module.exports = {
  reactStrictMode: false,
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
