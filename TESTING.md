# Testing Guide for Garage Sale Finder

This document provides instructions on how to run the different types of tests implemented in the Garage Sale Finder application.

## Types of Tests

We have implemented two main types of tests:

1. **Integration Tests**: These tests verify that multiple components work together correctly. They test the interaction between components and services.

2. **End-to-End (E2E) Tests**: These tests simulate user behavior in a real browser environment, testing the entire application flow from start to finish.

## Running Integration Tests

Integration tests are implemented using Jest and React Testing Library. They test the interaction between components and services without rendering the full application in a browser.

To run all integration tests:

```bash
npm run test:integration
```

This will run all tests in the `src/__tests__/integration` directory.

### What's Being Tested

- **SearchFlow.test.tsx**: Tests the search functionality, including form validation and result display.
- **ServiceIntegration.test.ts**: Tests the integration between different service modules.

## Running End-to-End Tests

End-to-end tests are implemented using Cypress. They simulate real user interactions in a browser environment.

### Running Cypress Tests in Headless Mode

To run all E2E tests in headless mode (without opening a browser window):

```bash
npm run test:e2e
```

### Running Cypress Tests in Interactive Mode

To open the Cypress Test Runner for interactive testing:

```bash
npm run cypress:open
```

This will open the Cypress Test Runner, where you can select which tests to run and watch them execute in a browser window.

### What's Being Tested

- **search.cy.ts**: Tests the full search flow, including form submission and results display.
- **components.cy.tsx**: Tests individual components in isolation using Cypress Component Testing.

## Prerequisites for Running Tests

Before running the tests, make sure you have:

1. Installed all dependencies:
   ```bash
   npm install
   ```

2. For E2E tests, the application should be running:
   ```bash
   npm start
   ```

## Writing New Tests

### Integration Tests

Add new integration tests in the `src/__tests__/integration` directory. Follow the existing test patterns for consistency.

### E2E Tests

Add new E2E tests in the `src/__tests__/e2e` directory. Use the Cypress API to interact with the application as a user would.

## Test Coverage

To generate a test coverage report:

```bash
npm test -- --coverage
```

This will create a coverage report in the `coverage` directory.
