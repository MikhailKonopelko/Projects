# Commands Guide - How to Test and Use

## 🚀 Quick Test Commands

### Test Service Locator Implementation
```bash
node test-with-service-locator.js
```
This will:
- Connect to database
- Initialize Service Locator
- Test all services
- Show service caching
- Display results

### Test Basic Services
```bash
node test-services.js
```
This will:
- Test service interfaces
- Show project operations
- Show calculation operations

### Run Simple Example
```bash
node USAGE-EXAMPLE.js
```
This will:
- Show basic usage
- Display projects and calculations

## 📋 Setup Commands

### Check Database Connection
```bash
node -e "const {sequelize} = require('./models'); sequelize.authenticate().then(() => console.log('✅ DB OK')).catch(e => console.error('❌ DB Error:', e)).finally(() => process.exit())"
```

### Check if Models Load
```bash
node -e "const models = require('./models'); console.log('✅ Models:', Object.keys(models).filter(k => k !== 'sequelize' && k !== 'Sequelize'))"
```

### Check Service Locator
```bash
node -e "const sl = require('./ServiceLocator'); const models = require('./models'); sl.initialize(models); console.log('✅ Service Locator initialized'); const service = sl.getDataProcessingService(); console.log('✅ Service created:', typeof service.getAllProjects === 'function')"
```

## 🔍 Verification Commands

### Verify All Files Exist
```bash
# Windows PowerShell
Test-Path ServiceLocator.js
Test-Path interfaces/services.d.ts
Test-Path interfaces/repositories.d.ts
Test-Path repositories/ProjectRepository.js
Test-Path repositories/ProgrammerRepository.js
Test-Path services/ProjectService.js
Test-Path services/CalculationService.js
Test-Path services/DataProcessingService.js

```

### Check for Syntax Errors
```bash
node -c ServiceLocator.js
node -c services/ProjectService.js
node -c services/CalculationService.js
node -c services/DataProcessingService.js
node -c repositories/ProjectRepository.js
node -c repositories/ProgrammerRepository.js
```


## 🛠️ Development Commands

### Run Database Migrations
```bash
npx sequelize-cli db:migrate
```

### Run Seeders (if you have test data)
```bash
npx sequelize-cli db:seed:all
```

### Check Database Status
```bash
npx sequelize-cli db:migrate:status
```

## 📊 Full Test Suite

Run all tests in sequence:
```bash
# Test 1: Basic functionality
node test-with-service-locator.js

# Test 2: Service interfaces
node test-services.js

# Test 3: Simple usage
node USAGE-EXAMPLE.js
```

## ❌ Troubleshooting Commands

### Check Node.js Version
```bash
node --version
```

### Check if Dependencies Installed
```bash
npm list sequelize pg
```

### Install Dependencies (if missing)
```bash
npm install
```

### Check Database Config
```bash
node -e "console.log(require('./config/config.json'))"
```

## 🎯 Quick Reference

| What to Test | Command |
|-------------|---------|
| Full test | `node test-with-service-locator.js` |
| Basic test | `node test-services.js` |
| Simple example | `node USAGE-EXAMPLE.js` |
| DB connection | `node -e "require('./models').sequelize.authenticate().then(() => console.log('OK')).catch(e => console.error(e))"` |
| Service Locator | See Test 1 above |
| Get projects | See Test 2 above |
| Calculate cost | See Test 3 above |
| Service caching | See Test 4 above |

````
