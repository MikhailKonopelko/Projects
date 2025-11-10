/* eslint-disable no-console */

const serviceLocator = require('../ServiceLocator');
const models = require('../models');

async function main() {
  try {
    console.log('== Verify: Database connection ==');
    await models.sequelize.authenticate();
    console.log('✅ DB connected\n');

    console.log('== Initialize Service Locator ==');
    serviceLocator.initialize(models);
    const svc = serviceLocator.getDataProcessingService();
    console.log('✅ Service Locator ready\n');

    console.log('== Enable SQL logging for visibility ==');
    models.sequelize.options.logging = console.log;
    console.log('✅ SQL logging ON\n');

    console.log('== Transaction + Identity Map: getAllProjects ==');
    const projects = await svc.getAllProjects();
    console.log(`Fetched projects: ${projects.length}\n`);

    const projectId = 1;
    console.log('== Transaction + Identity Map: getProgrammersByProject ==');
    const programmers = await svc.getProgrammersByProject(projectId);
    console.log(`Fetched programmers for project ${projectId}: ${programmers.length}\n`);

    console.log('== Calculations inside transaction (reads only) ==');
    const cost = await svc.calculateProjectCost(projectId);
    const value = await svc.calculateProjectValue(projectId);
    console.log(`Project ${projectId} cost: ${cost}, value: ${value}\n`);

    console.log('== Lazy Load: project.programmers accessed after tx commit ==');
    const p = await svc.getProjectWithLazyProgrammers(projectId);
    console.log('Project loaded, accessing programmers lazily...');
    const lazyList = await p.programmers;
    console.log(`Lazy programmers count: ${lazyList.length}\n`);

    console.log('== Pooling under concurrency: 25 parallel getAllProjects ==');
    models.sequelize.options.logging = false; // reduce noise for concurrency
    const N = 25;
    await Promise.all(Array.from({ length: N }).map(() => svc.getAllProjects()));
    console.log(`✅ Completed ${N} concurrent calls (pooling engaged)\n`);

    console.log('All checks finished successfully.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  }
}

main();


