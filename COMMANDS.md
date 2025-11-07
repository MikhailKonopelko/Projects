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

# Linux/Mac
ls -la ServiceLocator.js interfaces/ repositories/ services/
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

## 🧪 Test Scenarios

### Test 1: Service Locator Initialization
```bash
node -e "
const models = require('./models');
const serviceLocator = require('./ServiceLocator');
const {sequelize} = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    serviceLocator.initialize(models);
    console.log('✅ Service Locator initialized successfully');
    const service = serviceLocator.getDataProcessingService();
    console.log('✅ Service retrieved:', service ? 'OK' : 'FAILED');
    await sequelize.close();
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
"
```

### Test 2: Get All Projects
```bash
node -e "
const models = require('./models');
const serviceLocator = require('./ServiceLocator');
const {sequelize} = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    serviceLocator.initialize(models);
    const service = serviceLocator.getDataProcessingService();
    const projects = await service.getAllProjects();
    console.log('✅ Projects found:', projects.length);
    projects.forEach(p => console.log('  -', p.name));
    await sequelize.close();
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
"
```

### Test 3: Calculate Project Cost
```bash
node -e "
const models = require('./models');
const serviceLocator = require('./ServiceLocator');
const {sequelize} = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    serviceLocator.initialize(models);
    const service = serviceLocator.getDataProcessingService();
    const projects = await service.getAllProjects();
    if (projects.length > 0) {
      const cost = await service.calculateProjectCost(projects[0].id);
      console.log('✅ Project Cost:', cost);
    } else {
      console.log('⚠️  No projects found');
    }
    await sequelize.close();
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
"
```

### Test 4: Service Caching
```bash
node -e "
const models = require('./models');
const serviceLocator = require('./ServiceLocator');
const {sequelize} = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    serviceLocator.initialize(models);
    const service1 = serviceLocator.getDataProcessingService();
    const service2 = serviceLocator.getDataProcessingService();
    console.log('✅ Same instance?', service1 === service2 ? 'YES (cached)' : 'NO (different)');
    await sequelize.close();
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
"
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

## ✅ Success Checklist

Run these commands to verify everything works:

```bash
# 1. Check files exist
ls ServiceLocator.js services/ repositories/ interfaces/

# 2. Test syntax
node -c ServiceLocator.js && node -c services/*.js && node -c repositories/*.js && echo "✅ Syntax OK"

# 3. Test database connection
node -e "require('./models').sequelize.authenticate().then(() => {console.log('✅ DB OK'); process.exit(0)}).catch(e => {console.error('❌ DB Error'); process.exit(1)})"

# 4. Run full test
node test-with-service-locator.js

# 5. If all pass, you're good to go! 🎉
```

## 🚨 Common Issues

### Issue: "Cannot find module"
**Fix:** Run `npm install`

### Issue: "Database connection failed"
**Fix:** Check `config/config.json` and ensure database is running

### Issue: "ServiceLocator must be initialized"
**Fix:** Make sure you call `serviceLocator.initialize(models)` before using services

### Issue: "No projects found"
**Fix:** Run migrations and seeders:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

