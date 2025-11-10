'use strict';

const { Programmer, Project } = require('../../models');

module.exports = function createProgrammerCommands() {
	return {
		list: async (_req, res) => {
			const items = await Programmer.findAll();
			return res.json(items);
		},
		getById: async (req, res) => {
			const item = await Programmer.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			return res.json(item);
		},
		create: async (req, res) => {
			try {
				const project = await Project.findByPk(req.body.projectId);
				if (!project) return res.status(400).json({ message: 'Project not found' });
				const created = await Programmer.create(req.body);
				return res.status(201).json(created);
			} catch (e) {
				return res.status(400).json({ message: e.message });
			}
		},
		update: async (req, res) => {
			const item = await Programmer.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			try {
				await item.update(req.body);
				return res.json(item);
			} catch (e) {
				return res.status(400).json({ message: e.message });
			}
		},
		remove: async (req, res) => {
			const item = await Programmer.findByPk(req.params.id);
			if (!item) return res.status(404).json({ message: 'Not found' });
			await item.destroy();
			return res.status(204).send();
		}
	};
};


