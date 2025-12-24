import express from 'express';
import createAuthCommands from '../commands/authCommands.js';
import createProjectCommands from '../commands/projectCommands.js';
import createProgrammerCommands from '../commands/programmerCommands.js';
import createUserCommands from '../commands/userCommands.js';
import { verifyAccessToken } from '../middleware/auth.js';

export default function createFrontController() {
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


