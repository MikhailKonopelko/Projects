'use strict';

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../../models');

module.exports = function createUserCommands() {
	return {
		list: async (req, res) => {
			// Только админ может просматривать список пользователей
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only admins can view users' });
			}
			const users = await User.findAll({
				attributes: { exclude: ['passwordHash', 'refreshTokenHash'] },
				order: [['createdAt', 'DESC']]
			});
			return res.json(users);
		},
		getById: async (req, res) => {
			// Только админ может просматривать пользователя
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only admins can view users' });
			}
			const user = await User.findByPk(req.params.id, {
				attributes: { exclude: ['passwordHash', 'refreshTokenHash'] }
			});
			if (!user) return res.status(404).json({ message: 'Not found' });
			return res.json(user);
		},
		create: async (req, res) => {
			// Только админ может создавать пользователей
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only admins can create users' });
			}
			try {
				const { email, password, role = 'user' } = req.body || {};
				if (!email || !password) {
					return res.status(400).json({ message: 'Email and password are required' });
				}
				// Админ может создавать только обычных пользователей
				if (role !== 'user') {
					return res.status(400).json({ message: 'Only regular users can be created' });
				}
				const existing = await User.findOne({ where: { email: { [Op.iLike]: email } } });
				if (existing) {
					return res.status(409).json({ message: 'User already exists' });
				}
				const passwordHash = await bcrypt.hash(password, 10);
				const created = await User.create({ email, passwordHash, role: 'user' });
				return res.status(201).json({ id: created.id, email: created.email, role: created.role });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ message: 'User creation failed' });
			}
		},
		remove: async (req, res) => {
			// Только админ может удалять пользователей
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only admins can delete users' });
			}
			const userId = parseInt(req.params.id);
			// Нельзя удалить себя
			if (userId === req.user.id) {
				return res.status(400).json({ message: 'Cannot delete yourself' });
			}
			const user = await User.findByPk(userId);
			if (!user) return res.status(404).json({ message: 'Not found' });
			// Нельзя удалить менеджера или админа
			if (user.role === 'manager' || user.role === 'admin') {
				return res.status(400).json({ message: 'Cannot delete manager or admin users' });
			}
			await user.destroy();
			return res.status(204).send();
		}
	};
};

