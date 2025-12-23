'use strict';

const express = require('express');
const createAuthCommands = require('../commands/authCommands');
const createProjectCommands = require('../commands/projectCommands');
const createProgrammerCommands = require('../commands/programmerCommands');
const createUserCommands = require('../commands/userCommands');
const { verifyAccessToken } = require('../middleware/auth');

module.exports = function createFrontController() {
	const router = express.Router();

	const auth = createAuthCommands();
	const project = createProjectCommands();
	const programmer = createProgrammerCommands();
	const user = createUserCommands();

	router.post('/auth/register', auth.register);
	router.post('/auth/login', auth.login);
	router.post('/auth/refresh', auth.refresh);
	router.post('/auth/logout', auth.logout);
	router.get('/auth/me', verifyAccessToken, auth.me);

	router.get('/projects', verifyAccessToken, project.list);
	router.get('/projects/:id', verifyAccessToken, project.getById);
	router.post('/projects', verifyAccessToken, project.create);
	router.put('/projects/:id', verifyAccessToken, project.update);
	router.delete('/projects/:id', verifyAccessToken, project.remove);

	router.get('/programmers', verifyAccessToken, programmer.list);
	router.get('/programmers/:id', verifyAccessToken, programmer.getById);
	router.post('/programmers', verifyAccessToken, programmer.create);
	router.put('/programmers/:id', verifyAccessToken, programmer.update);
	router.delete('/programmers/:id', verifyAccessToken, programmer.remove);

	router.get('/users', verifyAccessToken, user.list);
	router.get('/users/:id', verifyAccessToken, user.getById);
	router.post('/users', verifyAccessToken, user.create);
	router.delete('/users/:id', verifyAccessToken, user.remove);

	return router;
};


