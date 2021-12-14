/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  bail: true,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/tmp/jest_rs",

  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/services/**/*.ts"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "__tests__/coverage",

  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "json",
    "lcov",
  ],

  testMatch: [
    "<rootDir>/__tests__/**/*.spec.ts",
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.ts": "ts-jest"
  },
};
