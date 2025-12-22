const { sequelize } = require('./models');
const models = require('./models');
const serviceLocator = require('./ServiceLocator');

/**
 * Comprehensive test demonstrating Service Locator pattern usage
 */
async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Initialize Service Locator (must be done once at application startup)
    serviceLocator.initialize(models);
    console.log('✅ Service Locator initialized\n');

    console.log('='.repeat(60));
    console.log('SERVICE LOCATOR PATTERN DEMONSTRATION');
    console.log('='.repeat(60));

    // ============================================================
    // Method 1: Using the main DataProcessingService
    // ============================================================
    console.log('\n📦 Method 1: Using DataProcessingService (Main Service)');
    console.log('-'.repeat(60));
    const mainService = serviceLocator.getDataProcessingService();
    
    const projects = await mainService.getAllProjects();
    console.log(`Found ${projects.length} project(s):`);
    projects.forEach(p => console.log(`  - ${p.name} (${p.client})`));

    if (projects.length > 0) {
      const projectId = projects[0].id;
      const programmers = await mainService.getProgrammersByProject(projectId);
      console.log(`\nProgrammers for project ID ${projectId}: ${programmers.length}`);
      
      const cost = await mainService.calculateProjectCost(projectId);
      const value = await mainService.calculateProjectValue(projectId);
      console.log(`Project Cost: $${cost}`);
      console.log(`Project Value: $${value}`);
    }

    // ============================================================
    // Method 2: Using individual services
    // ============================================================
    console.log('\n\n📦 Method 2: Using Individual Services');
    console.log('-'.repeat(60));
    const projectService = serviceLocator.getProjectService();
    const calculationService = serviceLocator.getCalculationService();

    const allProjects = await projectService.getAllProjects();
    console.log(`Total projects via ProjectService: ${allProjects.length}`);

    if (allProjects.length > 0) {
      const firstProjectId = allProjects[0].id;
      const projectProgrammers = await projectService.getProgrammersByProject(firstProjectId);
      console.log(`Programmers for project ${firstProjectId}: ${projectProgrammers.length}`);

      if (projectProgrammers.length > 0) {
        const salary = calculationService.calculateSalary(projectProgrammers[0]);
        console.log(`Salary for ${projectProgrammers[0].firstName} ${projectProgrammers[0].lastName}: $${salary}`);
      }

      const projectCost = await calculationService.calculateProjectCost(firstProjectId);
      console.log(`Project Cost (via CalculationService): $${projectCost}`);
    }

    // ============================================================
    // Method 3: Using Service Locator's get() method
    // ============================================================
    console.log('\n\n📦 Method 3: Using Service Locator get() method');
    console.log('-'.repeat(60));
    const service = serviceLocator.get('dataProcessing');
    const projectsViaGet = await service.getAllProjects();
    console.log(`Projects retrieved via get('dataProcessing'): ${projectsViaGet.length}`);

    // ============================================================
    // Method 4: Direct repository access (if needed)
    // ============================================================
    console.log('\n\n📦 Method 4: Direct Repository Access');
    console.log('-'.repeat(60));
    const projectRepository = serviceLocator.getProjectRepository();
    const programmerRepository = serviceLocator.getProgrammerRepository();

    const allProjectsFromRepo = await projectRepository.findAll();
    console.log(`Projects from repository: ${allProjectsFromRepo.length}`);

    if (allProjectsFromRepo.length > 0) {
      const programmersFromRepo = await programmerRepository.findByProjectId(allProjectsFromRepo[0].id);
      console.log(`Programmers from repository: ${programmersFromRepo.length}`);
    }

    // ============================================================
    // Demonstration: Service Locator caches instances
    // ============================================================
    console.log('\n\n📦 Method 5: Service Locator Caching');
    console.log('-'.repeat(60));
    const service1 = serviceLocator.getDataProcessingService();
    const service2 = serviceLocator.getDataProcessingService();
    console.log(`Same instance returned? ${service1 === service2}`); // Should be true

    const repo1 = serviceLocator.getProjectRepository();
    const repo2 = serviceLocator.getProjectRepository();
    console.log(`Same repository instance? ${repo1 === repo2}`); // Should be true

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));

  } catch (err) {
    console.error('❌ Error:', err);
    console.error(err.stack);
  } finally {
    await sequelize.close();
    console.log('\n✅ Database connection closed');
  }
}

run();





