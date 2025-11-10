'use strict';

const { Project } = require('../../models');

module.exports = function createProjectCommands() {
	return {
		list: async (_req, res) => {
			const items = await Project.findAll();
			return res.json(items);
		},
		getById: async (req, res) => {
			const item = await Project.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			return res.json(item);
		},
		create: async (req, res) => {
			try {
				const created = await Project.create(req.body);
				return res.status(201).json(created);
			} catch (e) {
				return res.status(400).json({ message: e.message });
			}
		},
		update: async (req, res) => {
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
			const item = await Project.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			await item.destroy();
			return res.status(204).send();
		}
	};
};


