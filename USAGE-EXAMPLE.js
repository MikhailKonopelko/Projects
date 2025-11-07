/**
 * Quick Usage Example for Service Interfaces
 * 
 * This file demonstrates how to use the service interfaces in your project.
 */

const { sequelize } = require('./models');
const models = require('./models');
const serviceLocator = require('./ServiceLocator');

async function exampleUsage() {
  try {
    // Step 1: Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Step 2: Initialize Service Locator with models
    serviceLocator.initialize(models);
    console.log('✅ Service Locator initialized\n');

    // Step 3: Get service instance from Service Locator
    // The DataProcessingService implements IDataProcessingService interface
    const service = serviceLocator.getDataProcessingService();

    // Step 3: Use IProjectService methods
    console.log('=== Using IProjectService methods ===\n');
    
    // Get all projects
    const projects = await service.getAllProjects();
    console.log(`Found ${projects.length} project(s):`);
    projects.forEach(p => console.log(`  - ${p.name} (Client: ${p.client})`));

    // Get programmers for a specific project
    if (projects.length > 0) {
      const projectId = projects[0].id;
      const programmers = await service.getProgrammersByProject(projectId);
      console.log(`\nFound ${programmers.length} programmer(s) for project ID ${projectId}:`);
      programmers.forEach(p => {
        console.log(`  - ${p.firstName} ${p.lastName} (${p.position})`);
      });

      // Step 4: Use ICalculationService methods
      console.log('\n=== Using ICalculationService methods ===\n');
      
      // Calculate salary for each programmer
      console.log('Salaries:');
      programmers.forEach(programmer => {
        const salary = service.calculateSalary(programmer);
        console.log(`  - ${programmer.firstName} ${programmer.lastName}: $${salary}`);
      });

      // Calculate project cost
      const projectCost = await service.calculateProjectCost(projectId);
      console.log(`\nProject Cost (ID ${projectId}): $${projectCost}`);

      // Calculate project value
      const projectValue = await service.calculateProjectValue(projectId);
      console.log(`Project Value (ID ${projectId}): $${projectValue}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the example
exampleUsage();

