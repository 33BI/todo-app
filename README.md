# Todo Application - Test Plan 🧪

[![Tests](https://img.shields.io/badge/tests-automated-green.svg)](https://github.com/your-username/todo-app)
[![Backend](https://img.shields.io/badge/backend-jest%20%2B%20supertest-blue.svg)](https://jestjs.io/)
[![Frontend](https://img.shields.io/badge/frontend-playwright-orange.svg)](https://playwright.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📖 Overview

This document outlines the comprehensive testing strategy for our Todo Application, ensuring reliability and quality across both backend API and frontend user interface through automated testing.

## 🎯 Testing Objectives

### What We're Testing

| Component | Coverage |
|-----------|----------|
| **Backend API** | Authentication, CRUD operations, validation, error handling |
| **Frontend UI** | User workflows, session management, error presentation, responsiveness |

## 🔍 Test Coverage

### Backend Testing

#### 🔐 Authentication & Authorization
- ✅ Successful user login
- ❌ Failed login with invalid credentials  
- 🛡️ Access control on protected endpoints
- 🚫 Unauthorized request handling

#### 📝 Todo Operations
- 📋 Fetch all todos
- ➕ Create todo with validation
- ✏️ Update existing todo (full & partial)
- 🗑️ Delete todo with error handling
- ⚠️ Proper HTTP status codes (400, 401, 404)

### Frontend Testing

#### 🚪 Login Page
- 👁️ UI element visibility
- ❌ Error message display on failed login
- ➡️ Successful login redirect

#### 📱 Todo List Interface
- 📊 Todo display functionality
- ➕ Add new todo capability
- ✅ Toggle completion status
- 🗑️ Delete todo functionality
- 🔄 Real-time UI state synchronization

#### 👤 Session Management
- 🚪 Logout functionality

## 🛠️ Testing Stack

| Tool | Purpose | Why We Chose It |
|------|---------|-----------------|
| **Jest** | Test orchestration & assertions | Industry standard, fast execution, great Node.js support |
| **Supertest** | HTTP endpoint testing | Seamless Express integration, no server startup required |
| **Playwright** | E2E browser automation | Multi-browser support, reliable selectors, detailed reporting |

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Running Backend Tests

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run all backend tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Running Frontend Tests

```bash
# Navigate to frontend directory  
cd frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npx playwright test

# Run tests with UI mode
npx playwright test --ui

# Generate and view test report
npx playwright show-report
```

### Running All Tests

```bash
# From project root
npm run test:all
```

## 📊 Test Reports

After running tests, you can view detailed reports:

- **Backend**: Coverage reports in `backend/coverage/`
- **Frontend**: Playwright HTML reports in `frontend/playwright-report/`

## ⚠️ Known Limitations

| Area | Limitation | Impact |
|------|------------|--------|
| **Data Storage** | In-memory only, resets on restart | Tests run in isolation but no persistence |
| **Authentication** | Static JWT token for demo | Not production-ready security |
| **Browser Support** | Currently Chromium only | Can be extended to Firefox/Safari |
| **Test Scope** | Functional testing focus | Performance/security testing separate |

## 🔧 Configuration

### Backend Test Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ]
}
```

### Frontend Test Configuration
```javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true
  }
}
```

## 🤝 Contributing

1. Write tests for new features
2. Ensure all tests pass before submitting PR
3. Update test documentation for significant changes
4. Follow existing test patterns and naming conventions

## 📈 Test Metrics

- **Backend Coverage Target**: 90%+
- **E2E Test Execution Time**: < 2 minutes
- **Test Reliability**: 99%+ pass rate

## 🆘 Troubleshooting

### Common Issues

**Backend tests failing?**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Playwright tests timing out?**
```bash
# Increase timeout in playwright.config.js
timeout: 30000
```

**Port conflicts?**
- Ensure ports 3000 (frontend) and 3001 (backend) are available

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest GitHub](https://github.com/visionmedia/supertest)  
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Happy Testing! 🎉**

*For questions or issues, please open a GitHub issue or contact the development team.*
