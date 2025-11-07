const { sequelize } = require('./models');
const models = require('./models');
const serviceLocator = require('./ServiceLocator');

/**
 * Test file demonstrating how to use the service interfaces with Service Locator
 */
async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Initialize Service Locator with models
    serviceLocator.initialize(models);
    console.log('✅ Service Locator initialized\n');

    // Get service instance from Service Locator
    const service = serviceLocator.getDataProcessingService();

    // Test IProjectService methods
    console.log('\n📁 Testing IProjectService:');
    const projects = await service.getAllProjects();
    console.log('Projects:');
    projects.forEach(p => {
      console.log(`- ${p.name} (${p.client})`);
    });

    const projectId = 1;
    const programmers = await service.getProgrammersByProject(projectId);
    console.log(`\n👨‍💻 Programmers for Project ID ${projectId}:`);
    programmers.forEach(d => {
      console.log(`- ${d.firstName} ${d.lastName} (${d.position})`);
    });

    // Test ICalculationService methods
    console.log('\n💰 Testing ICalculationService:');
    programmers.forEach(d => {
      const salary = service.calculateSalary(d);
      console.log(`- ${d.firstName} ${d.lastName} → зарплата: $${salary}`);
    });

    const projectCost = await service.calculateProjectCost(projectId);
    console.log(`\n💵 Project cost (ID ${projectId}): $${projectCost}`);

    const projectValue = await service.calculateProjectValue(projectId);
    console.log(`💼 Финальная стоимость проекта ID ${projectId}: $${projectValue}`);

    // Example: Using individual services from Service Locator
    console.log('\n🔧 Example: Using individual services separately');
    const projectService = serviceLocator.getProjectService();
    const calculationService = serviceLocator.getCalculationService();

    const allProjects = await projectService.getAllProjects();
    console.log(`Total projects: ${allProjects.length}`);

    if (allProjects.length > 0) {
      const firstProjectId = allProjects[0].id;
      const cost = await calculationService.calculateProjectCost(firstProjectId);
      console.log(`Cost of first project: $${cost}`);
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await sequelize.close();
  }
}

run();

