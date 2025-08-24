Test Plan for Todo Application

1. Overview:
This document outlines the testing strategy for the Todo Application, covering both the backend API and frontend user interface. The goal is to verify functionality, security, and user experience through automated tests.

2. Scope & Objectives
What Is Being Tested:

- Backend API:
  - User authentication and authorization.
  - CRUD operations for todo items.
  - Validation and error handling.

- Frontend UI:
  - Login workflow.
  - Todo list display and manipulation.
  - Session management.
  - Error presentation and UI responsiveness.

3. Test Coverage Areas:

Backend:

- Authentication:
  - Successful login.
  - Failed login with invalid credentials.

- Authorization:
  - Access control on protected endpoints.
  - Handling unauthorized requests.

- Todos:
  - Fetch all todos.
  - Create todo with validation.
  - Update existing todo (full & partial).
  - Delete todo and handle non-existent cases.
  - Appropriate error responses (e.g., 400, 401, 404).

Frontend:

- Login Page:
  - UI elements visibility.
  - Error messages on failed login.
  - Redirect to todos on success.

- Todo List:
  - Display of todos.
  - Add new todo.
  - Toggle completion status.
  - Delete todo.
  - Reflect backend state in UI.

- Session Management:
  - Logout functionality.

4. Tools & Justification:

| Tool          | Purpose                                       | Reason for Use                              |
|---------------|-----------------------------------------------|---------------------------------------------|
| Jest          | Test orchestration and assertions             | Fast, widely used in Node.js environments   |
| Supertest     | HTTP assertions on Express routes             | Test API endpoints without full server start|
| Playwright    | End-to-end browser automation for UI testing  | Multi-browser support, detailed reporting   |

5. How to Run Tests:

Open Terminal - Nr.1 

Backend:

cd backend              # Correct location

npm install             # Install dependencies

npm test                # Run backend tests (Jest + Supertest)

- Tests run directly against the Express app without needing the server started manually.

Frontend:

Open Terminal - Nr.2


cd frontend             # Correct location

npx playwright install  # Install dependencies

Run Playwright tests:

npx playwright test --update-snapshots

npx playwright test

Optional: View test report:

npx playwright show-report

6. Assumptions & Limitations

- In-memory storage: Backend uses volatile memory, resets on restart.
- Static token: Authentication uses a fixed fake JWT token, no real security.
- UI selectors: Frontend tests rely on data-testid attributes.
- Browser coverage: Currently limited to Chromium, extendable.
- Focus: Functional correctness, excluding performance or security testing.
- API contract: Changes require corresponding test updates.
