/**
 * Jest Configuration for E2E Tests
 */

module.exports = {
  displayName: 'e2e',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
  },
  collectCoverageFrom: [
    '../src/**/*.{ts,tsx}',
    '!../src/**/*.d.ts',
    '!../src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 30000,
  verbose: true,
};
