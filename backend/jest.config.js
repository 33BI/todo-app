module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel', 
  collectCoverageFrom: ['server.js'],
};
