'use strict';
module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest for tsx
  // using babel-jest for js es modules
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // For 3rd party modules published as untranspiled.
  // Since all files inside node_modules are not transformed by default,
  // Jest will not understand the code in these modules, resulting in syntax errors.
  transformIgnorePatterns: ['/node_modules/.+(js|jsx)$'],
  // Coverage settings
  collectCoverageFrom: ['**/*.{ts, tsx}', '!**/node_modules/**', '!**/*/*.d.ts'],
  coverageDirectory: './src/__tests__/coverage',
  coveragePathIgnorePatterns: ['/node_modules/', './src/index.ts'],
  // Alias for @src
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '\\.(css|scss|png)$': 'identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/src/__tests__/unit/__mocks__/svg-mock.ts',
  },
  modulePathIgnorePatterns: ['__mocks__', '__fixtures__'],
  coverageThreshold: {
    // Configure if need
    global: {
      branches: 10,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
