import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: true,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: '__tests__/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '__tests__/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
  component: {
    specPattern: '__tests__/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '__tests__/support/component.ts',
    indexHtmlFile: '__tests__/support/component-index.html',
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        module: {
          rules: [
            {
              test: /\.(ts|tsx)$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                  },
                },
              ],
            },
          ],
        },
      },
    },
  },
});
