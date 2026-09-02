const baseUrl = process.env.LHCI_BASE_URL || 'http://localhost:4173';

module.exports = {
  ci: {
    collect: {
      staticDistDir: './.output/public',
      url: [`${baseUrl}/`, `${baseUrl}/work/`, `${baseUrl}/academic/`, `${baseUrl}/personal/`],
      numberOfRuns: 3,
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
      // LHCI writes the representative run last, leaving one stable report per route.
      reportFilenamePattern: '%%HOSTNAME%%-%%PATHNAME%%.report.%%EXTENSION%%',
    },
  },
};
