# Test-automation-hands-on-
Part 1: Test automation (hands-on)  WEB UI and API
1. How to install and run the suite.
  - npm install
  - npx playwright install
  - npm test
  - npm run test:ui
  - npm run test:api


2. Which tools you chose and why, given the kind of system described below.
  - Single framework for UI and API
  - Reliable auto-waiting
  - Fast execution
  - Excellent reporting
  - TypeScript and JavaScript support
  - Easy CI integration

3. What you tested at the UI layer versus the API layer, and the reasoning behind that split.
  - UI tests verify critical user journeys such as authentication, cart management, and checkout because these validate the user experience and integration between frontend and backend. CRUD functionality is validated at the API layer, where tests are faster, more deterministic, and less brittle. This keeps the UI suite lean while still providing comprehensive functional coverage.


4. What you would add or change with more time.
  - GitHub Actions CI
  - Retry strategy
  - Test data factories
  - Environment configuration
  - Parallel execution
  - HTML reports uploaded as artifacts
  - Allure reporting
  - API schema validation
  - Visual regression testing
  - Accessibility testing using Axe

5. Where you used AI tooling, what you accepted, and what you had to correct or rewrite.
  - AI tooling was used to accelerate boilerplate generation, repository structure, and initial Page Object Model scaffolding. All generated code was reviewed, adapted to the application's behavior, and corrected where necessary. Assertions, test scenarios, negative cases, and architectural decisions were manually validated to ensure they reflected the application's actual behavior.


5. Where you used AI tooling, what you accepted, and what you had to correct or rewrite.
  - AI tooling was used to accelerate boilerplate generation, repository structure, and initial Page Object Model scaffolding. All generated code was reviewed, adapted to the application's behavior, and corrected where necessary. Assertions, test scenarios, negative cases, and architectural decisions were manually validated to ensure they reflected the application's actual behavior.

