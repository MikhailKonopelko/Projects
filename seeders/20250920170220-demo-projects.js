'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Projects', [
      {
        name: 'Site Redesign',
        client: 'Acme Corp',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-12-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mobile App Development',
        client: 'Globex Inc',
        startDate: new Date('2025-10-15'),
        endDate: new Date('2026-01-30'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Projects', null, {});
  }
};
