# Playwright UI & API Test Automation Framework

An end-to-end QA Automation portfolio repository built with **Playwright**, **TypeScript**, **Page Object Model (POM)**, **Faker.js**, **Allure Reporting**, and **GitHub Actions CI/CD** targeting public demo applications.

> **Disclaimer:** All test suites run exclusively against open public QA practice sandboxes (`https://www.saucedemo.com` for UI and `https://dummyjson.com` for REST APIs). No proprietary or employer code is included.

---

## Architecture & Tech Stack

- **Automation Engine:** Playwright (`@playwright/test`)
- **Language:** TypeScript (strict mode enabled)
- **Design Pattern:** Page Object Model (`pages/`) + Custom Fixtures (`fixtures/`)
- **Authentication Strategy:** Pre-authenticated session caching via `storageState` (`tests/auth.setup.ts`)
- **API Testing:** Typed REST client wrapping Playwright `APIRequestContext` (`api/ApiClient.ts`)
- **Test Data Generation:** Dynamic checkout and API payloads via `@faker-js/faker`
- **Code Quality:** ESLint (flat config + `eslint-plugin-playwright`) & Prettier
- **CI/CD & Reporting:** GitHub Actions (matrix UI sharding + API job) with Playwright HTML & Allure reports

```text
playwright-qa-portfolio/
├── .github/workflows/ci.yml   # Lint/typecheck + API + sharded UI CI pipeline
├── api/
│   ├── ApiClient.ts           # Typed APIRequestContext wrapper
│   └── types.ts               # REST request/response interfaces
├── config/
│   └── env.ts                 # Centralized typed env configuration
├── fixtures/
│   └── test-fixtures.ts       # Custom POM & API client Playwright fixtures
├── pages/
│   ├── BasePage.ts            # Shared navigation helpers
│   ├── LoginPage.ts           # Authentication POM
│   ├── InventoryPage.ts       # Product catalog sorting & cart actions
│   ├── CartPage.ts            # Cart review & line-item removal
│   └── CheckoutPage.ts        # Checkout steps, totals verification & completion
├── tests/
│   ├── auth.setup.ts          # Saves browser storageState for UI specs
│   ├── ui/                    # Login, catalog sorting & E2E checkout specs
│   └── api/                   # Auth token & Products CRUD/validation specs
├── utils/
│   ├── assertions.ts          # Price parser, sort order & schema helpers
│   └── test-data.ts           # Faker test data factories
├── eslint.config.mjs
├── playwright.config.ts
└── tsconfig.json
```

---

## Local Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Install Playwright browsers (if not already installed):**

   ```bash
   npx playwright install chromium
   ```

3. **Optional environment file:**
   ```bash
   cp .env.example .env
   ```

---

## Running Tests & Quality Checks

| Command                | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `npm test`             | Run full UI (setup + Chromium) and API test suites     |
| `npm run test:ui`      | Run setup + UI E2E tests                               |
| `npm run test:api`     | Run REST API test suite only                           |
| `npm run test:headed`  | Run tests in visible browser mode                      |
| `npm run report`       | Open Playwright HTML test report                       |
| `npm run typecheck`    | Run TypeScript strict compiler check                   |
| `npm run lint`         | Run ESLint + Playwright rules                          |
| `npm run format:check` | Verify Prettier formatting                             |
| `npm run verify`       | Run typecheck, lint, format check, and full test suite |

---

## Author

**Hatim Vasanwala**  
QA Engineer | Manual & Automation Testing  
[LinkedIn](https://www.linkedin.com/in/hatim-vasanwala) • [GitHub](https://github.com/hatim-vasanwala-qa)
