'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Programmers', [
      {
        projectId: 1,
        firstName: 'Ivan',
        lastName: 'Petrov',
        middleName: 'Sergeevich',
        position: 'Frontend Developer',
        startDate: new Date('2025-09-05'),
        endDate: new Date('2025-11-30'),
        hourlyRate: 25.5,
        fullTime: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        projectId: 1,
        firstName: 'Anna',
        lastName: 'Smirnova',
        middleName: 'Igorevna',
        position: 'UI/UX Designer',
        startDate: new Date('2025-09-10'),
        endDate: new Date('2025-12-01'),
        hourlyRate: 30.0,
        fullTime: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        projectId: 2,
        firstName: 'Dmitry',
        lastName: 'Kozlov',
        middleName: 'Andreevich',
        position: 'Backend Developer',
        startDate: new Date('2025-10-20'),
        endDate: new Date('2026-01-15'),
        hourlyRate: 28.0,
        fullTime: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Programmers', null, {});
  }
};
