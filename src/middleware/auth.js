'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../../models');

async function verifyAccessToken(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const token = tokenFromHeader || req.cookies?.accessToken;
	if (!token) return res.status(401).json({ message: 'Missing access token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_access_secret');
		const user = await User.findByPk(payload.sub);
		if (!user) return res.status(401).json({ message: 'User not found' });
		req.user = { id: user.id, email: user.email, role: user.role };
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

function requireRole(...allowedRoles) {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ message: 'Authentication required' });
		}
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Insufficient permissions' });
		}
		return next();
	};
}

function requireManagerOrAdmin(req, res, next) {
	return requireRole('manager', 'admin')(req, res, next);
}

function requireAdmin(req, res, next) {
	return requireRole('admin')(req, res, next);
}

module.exports = { 
	verifyAccessToken, 
	requireRole, 
	requireManagerOrAdmin, 
	requireAdmin 
};


