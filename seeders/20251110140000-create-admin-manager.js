'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
	async up(queryInterface) {
		const passwordHash = await bcrypt.hash('admin123', 10);
		const managerPasswordHash = await bcrypt.hash('manager123', 10);
		
		await queryInterface.bulkInsert('Users', [
			{
				email: 'admin@company.com',
				passwordHash: passwordHash,
				role: 'admin',
				refreshTokenHash: null,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				email: 'manager@company.com',
				passwordHash: managerPasswordHash,
				role: 'manager',
				refreshTokenHash: null,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},

	async down(queryInterface, Sequelize) {
		const { Op } = Sequelize;
		await queryInterface.bulkDelete('Users', {
			email: { [Op.in]: ['admin@company.com', 'manager@company.com'] }
		}, {});
	}
};

