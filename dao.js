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

function calculateSalary(dev) {
  const start = new Date(dev.startDate);
  const end = new Date(dev.endDate);
  let workDays = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) workDays++;
  }

  const hoursPerDay = dev.fullTime ? 8 : 4;
  const base = workDays * hoursPerDay * dev.hourlyRate;
  return Math.round(base * 1.77); // с налогами
}

async function calculateProjectValue(projectId) {
  const programmers = await Programmer.findAll({ where: { projectId } });
  let total = 0;
  for (const dev of programmers) {
    total += calculateSalary(dev);
  }
  return total * 2;
}


module.exports = {
  getAllProjects,
  getProgrammersByProject,
  calculateProjectCost,
  calculateSalary,
  calculateProjectValue
};
