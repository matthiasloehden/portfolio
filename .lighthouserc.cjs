const baseUrl = process.env.LHCI_BASE_URL || 'http://localhost:4173';

module.exports = {
  ci: {
    collect: {
      staticDistDir: './.output/public',
      url: [
        `${baseUrl}/`,
        `${baseUrl}/work/`,
        `${baseUrl}/academic/`,
        `${baseUrl}/personal/`,
      ],
      numberOfRuns: 1,
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
