'use strict';

const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const token = tokenFromHeader || req.cookies?.accessToken;
	if (!token) return res.status(401).json({ message: 'Missing access token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_access_secret');
		req.user = { id: payload.sub, email: payload.email };
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

module.exports = { verifyAccessToken };


