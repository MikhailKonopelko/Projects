'use strict';

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { sequelize } = require('./models');
const createFrontController = require('./src/controllers/frontController');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
	origin: true,
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static client
app.use(express.static(path.join(__dirname, 'public')));

// API - Front Controller
app.use('/api', createFrontController());

// Healthcheck
app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

async function start() {
	try {
		await sequelize.authenticate();
		console.log('DB connection established.');
		await sequelize.sync(); // optional: ensure models are in sync
		app.listen(PORT, () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

start();


