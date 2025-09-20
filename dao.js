const { Project, Programmer } = require('./models');

async function getAllProjects() {
  return await Project.findAll();
}

async function getProgrammersByProject(projectId) {
  return await Programmer.findAll({ where: { projectId } });
}

async function calculateProjectCost(projectId) {
  const programmers = await Programmer.findAll({ where: { projectId } });

  let totalCost = 0;
  for (const dev of programmers) {
    const hours = dev.fullTime ? 160 : 80;
    totalCost += dev.hourlyRate * hours;
  }

  return totalCost;
}

module.exports = {
  getAllProjects,
  getProgrammersByProject,
  calculateProjectCost
};
