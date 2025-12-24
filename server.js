import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import models from './models/index.js';
import createFrontController from './src/controllers/frontController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
	origin: true,
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', createFrontController());

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

async function start() {
	try {
		await models.sequelize.authenticate();
		console.log('DB connection established.');
		await models.sequelize.sync(); // optional: ensure models are in sync
		app.listen(PORT, () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

start();


