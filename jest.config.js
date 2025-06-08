module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: [
        '@babel/preset-env', 
        ['@babel/preset-react', { runtime: 'automatic' }], 
        '@babel/preset-typescript'
      ] 
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-router|react-router-dom|@testing-library|@babel/runtime)/)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      babelConfig: true,
      isolatedModules: true,
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  moduleDirectories: ['node_modules', 'src'],
};
