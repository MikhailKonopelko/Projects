'use strict';

const { Project } = require('../../models');
const { requireManagerOrAdmin } = require('../middleware/auth');

module.exports = function createProjectCommands() {
	return {
		list: async (_req, res) => {
			// Все авторизованные пользователи могут просматривать проекты
			const items = await Project.findAll();
			return res.json(items);
		},
		getById: async (req, res) => {
			// Все авторизованные пользователи могут просматривать проекты
			const item = await Project.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			return res.json(item);
		},
		create: async (req, res) => {
			// Только менеджер и админ могут создавать проекты
			if (req.user.role !== 'manager' && req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only managers and admins can create projects' });
			}
			try {
				const created = await Project.create(req.body);
				return res.status(201).json(created);
			} catch (e) {
				return res.status(400).json({ message: e.message });
			}
		},
		update: async (req, res) => {
			// Только менеджер и админ могут обновлять проекты
			if (req.user.role !== 'manager' && req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only managers and admins can update projects' });
			}
			const item = await Project.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			try {
				await item.update(req.body);
				return res.json(item);
			} catch (e) {
				return res.status(400).json({ message: e.message });
			}
		},
		remove: async (req, res) => {
			// Только менеджер и админ могут удалять проекты
			if (req.user.role !== 'manager' && req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Only managers and admins can delete projects' });
			}
			const item = await Project.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			await item.destroy();
			return res.status(204).send();
		}
	};
};


