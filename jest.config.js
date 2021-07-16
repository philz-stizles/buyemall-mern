module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/test/setupAfterEnv.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    // 'src/(.*)': '<rootDir>/src/$1',
    'src/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  setupFiles: ['dotenv/config'],
  // transform: {
  //   'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  // },
  // transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
};
