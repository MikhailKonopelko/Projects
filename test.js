const { sequelize } = require('./models');
const {
  getAllProjects,
  getProgrammersByProject,
  calculateSalary,
  calculateProjectValue
} = require('./dao');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const projects = await getAllProjects();
    console.log('\n📁 Projects:');
    projects.forEach(p => {
      console.log(`- ${p.name} (${p.client})`);
    });

    const projectId = 1;
    const devs = await getProgrammersByProject(projectId);
    console.log(`\n👨‍💻 Programmers for Project ID ${projectId}:`);
    devs.forEach(d => {
      const salary = calculateSalary(d);
      console.log(`- ${d.firstName} ${d.lastName} (${d.position}) → зарплата: $${salary}`);
    });

    const value = await calculateProjectValue(projectId);
    console.log(`\n💼 Финальная стоимость проекта ID ${projectId}: $${value}`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await sequelize.close();
  }
}

run();
