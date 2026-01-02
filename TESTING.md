# JavaScript Testing

## Overview

This project includes automated JavaScript linting tests using ESLint to ensure code quality and catch common errors.

## Running Tests

```bash
# Install dependencies (first time only)
npm install

# Run all tests (currently just linting)
npm test

# Run linting with auto-fix
npm run lint:fix
```

## Test Results

The linting test checks for:
- **Syntax errors** (fatal)
- **Undefined variables** (fatal)
- **Code quality issues** (warnings)

### Expected Output

When tests pass, you'll see output like:
```
✖ 57 problems (0 errors, 57 warnings)
```

**Note:** The warnings are expected and do not indicate failures. Most warnings are for functions that appear "unused" to ESLint but are actually called from HTML event handlers (onclick, onchange, etc.).

### Expected Warnings

Common expected warnings include:
- **"function is defined but never used"** - Functions called from HTML via onclick/onchange
- **"variable is assigned but never used"** - State variables referenced in HTML or used for side effects

These are **not test failures** - they're informational warnings about the architecture of the web application.

## ESLint Configuration

The project uses `.eslintrc.json` which is configured for:
- **Browser environment** (access to window, document, etc.)
- **ES2021** syntax
- **Global libraries** (JSZip, McAddon, RecipeParser)
- **Recommended rules** from ESLint

## Auto-Fixing Issues

Many linting issues can be automatically fixed:

```bash
npm run lint:fix
```

This will:
- Add missing curly braces
- Fix semicolon consistency
- Remove extra semicolons
- Fix other auto-fixable style issues

## Continuous Integration

To run tests in CI/CD pipelines:

```bash
npm install
npm test
```

The test will exit with code 0 (success) if there are no **errors**, even if there are warnings.

## Adding New Tests

To add additional test types in the future:

1. Install test dependencies: `npm install --save-dev <test-framework>`
2. Add test script to `package.json`
3. Update this documentation

Example test frameworks to consider:
- **Jest** - Unit testing
- **Mocha** - Unit testing
- **Puppeteer** - Browser automation testing
- **jsdom** - DOM testing without a browser
