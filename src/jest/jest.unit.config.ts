import type { Config } from 'jest';

const jestConfig: Config = {
  setupFilesAfterEnv: [
    '<rootDir>/src/global/utils/log.ts',
    '<rootDir>/src/global/utils/env.config.ts',
  ],
  testMatch: [
    '<rootDir>/src/jest/__tests__/*.test.ts',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/global/*',
  ],
  testEnvironment: 'node',
  clearMocks: true,
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.tsx$': 'ts-jest',
  },
  rootDir: '../../',
};

export default jestConfig;
