'use strict';

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../../models');
const { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies, verifyRefreshToken } = require('../utils/jwt');

module.exports = function createAuthCommands() {
	return {
		register: async (req, res) => {
			try {
				const { email, password } = req.body || {};
				if (!email || !password) {
					return res.status(400).json({ message: 'Email and password are required' });
				}
				const existing = await User.findOne({ where: { email: { [Op.iLike]: email } } });
				if (existing) {
					return res.status(409).json({ message: 'User already exists' });
				}
				const passwordHash = await bcrypt.hash(password, 10);
				// Регистрация создает только обычных пользователей
				const created = await User.create({ email, passwordHash, role: 'user' });
				return res.status(201).json({ id: created.id, email: created.email, role: created.role });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ message: 'Registration failed' });
			}
		},

		login: async (req, res) => {
			try {
				const { email, password } = req.body || {};
				if (!email || !password) {
					return res.status(400).json({ message: 'Email and password are required' });
				}
				const user = await User.findOne({ where: { email } });
				if (!user) return res.status(401).json({ message: 'Invalid credentials' });
				const ok = await bcrypt.compare(password, user.passwordHash);
				if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

				const accessToken = generateAccessToken({ sub: user.id, email: user.email });
				const refreshToken = generateRefreshToken({ sub: user.id, email: user.email });

				await user.update({ refreshTokenHash: await bcrypt.hash(refreshToken, 10) });
				setAuthCookies(res, accessToken, refreshToken);

				return res.json({ accessToken });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ message: 'Login failed' });
			}
		},

		refresh: async (req, res) => {
			try {
				const { refreshToken: tokenFromBody } = req.body || {};
				const token = tokenFromBody || req.cookies?.refreshToken;
				if (!token) return res.status(401).json({ message: 'Missing refresh token' });

				const payload = verifyRefreshToken(token);
				const user = await User.findByPk(payload.sub);
				if (!user || !user.refreshTokenHash) {
					return res.status(401).json({ message: 'Invalid refresh context' });
				}
				const matches = await bcrypt.compare(token, user.refreshTokenHash);
				if (!matches) return res.status(401).json({ message: 'Invalid refresh token' });

				const newAccess = generateAccessToken({ sub: user.id, email: user.email });
				const newRefresh = generateRefreshToken({ sub: user.id, email: user.email });
				await user.update({ refreshTokenHash: await bcrypt.hash(newRefresh, 10) });
				setAuthCookies(res, newAccess, newRefresh);
				return res.json({ accessToken: newAccess });
			} catch (err) {
				console.error(err);
				return res.status(401).json({ message: 'Refresh failed' });
			}
		},

		logout: async (req, res) => {
			try {
				// Try to get user from access token if available
				let userId = req.user?.id || null;
				
				// If no user from access token, try to get from refresh token
				if (!userId) {
					const { refreshToken: tokenFromBody } = req.body || {};
					const token = tokenFromBody || req.cookies?.refreshToken;
					if (token) {
						try {
							const payload = verifyRefreshToken(token);
							userId = payload.sub;
						} catch (e) {
							// Refresh token is invalid/expired, ignore
						}
					}
				}
				
				// Clear refresh token from database if we have a user ID
				if (userId) {
					await User.update({ refreshTokenHash: null }, { where: { id: userId } });
				}
			} catch (e) {
				// ignore errors, still clear cookies
			} finally {
				clearAuthCookies(res);
				return res.status(200).json({ message: 'Logged out' });
			}
		},

		me: async (req, res) => {
			try {
				if (!req.user) {
					return res.status(401).json({ message: 'Not authenticated' });
				}
				return res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ message: 'Failed to get user info' });
			}
		}
	};
};


