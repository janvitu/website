# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

**Runner:** None - no test framework is installed or configured.

No test runner (Jest, Vitest, Playwright, Cypress, etc.) is present in `package.json` devDependencies or dependencies. No test configuration files exist (`jest.config.*`, `vitest.config.*`). No test scripts exist in `package.json`.

**Assertion Library:** None

**Run Commands:**
```bash
# No test commands configured
```

## Test File Organization

**Location:** No test files exist in the project source. The only `*.test.*` and `*.spec.*` files found are inside `node_modules/`.

**Naming:** Not applicable.

**Structure:** Not applicable.

## Test Structure

No tests exist. No patterns to document.

## Mocking

**Framework:** None

No mocking patterns exist in the codebase.

## Fixtures and Factories

**Test Data:** None

The file `app/src/data/consent.ts` contains i18n copy data (not test fixtures). No factory functions or fixture files are present.

## Coverage

**Requirements:** None enforced - no coverage tooling configured.

**View Coverage:**
```bash
# Not available
```

## Test Types

**Unit Tests:** Not present

**Integration Tests:** Not present

**E2E Tests:** Not present - no Playwright, Cypress, or similar tooling installed

## What Exists Instead

Manual verification is the only current quality gate. The codebase relies on:

1. **TypeScript strict mode** (`"strict": true` in `tsconfig.json`) for type safety at compile time
2. **Prettier formatting** (`.prettierrc`) for code style consistency
3. **Hugo build** (`build:hugo` script) as an implicit integration check - a broken template will fail the build

## Adding Tests

If tests are added to this project, the recommended approach given the stack:

**For SolidJS components (`app/src/`):**
- Framework: Vitest + `@solidjs/testing-library`
- Config file: `vitest.config.ts` at project root
- Test location: co-located next to source files (`app/src/components/Switch/index.test.tsx`)
- Install: `pnpm add -D vitest @solidjs/testing-library @testing-library/jest-dom`

**For Hugo TypeScript utilities (`hugo/assets/ts/`):**
- Framework: Vitest (no DOM needed for pure utils like `selector.ts`, `utils.ts`)
- Test location: co-located (`hugo/assets/ts/utils.test.ts`)

**Script additions to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

*Testing analysis: 2026-03-28*
