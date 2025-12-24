import jwt from 'jsonwebtoken';

export function generateAccessToken(payload) {
	return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'dev_access_secret', { expiresIn: '15m' });
}

export function generateRefreshToken(payload) {
	return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret', { expiresIn: '7d' });
}

export function verifyRefreshToken(token) {
	return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret');
}

export function setAuthCookies(res, accessToken, refreshToken) {
	const isProd = process.env.NODE_ENV === 'production';
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'lax',
		maxAge: 15 * 60 * 1000
	});
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000
	});
}

export function clearAuthCookies(res) {
	const isProd = process.env.NODE_ENV === 'production';
	res.clearCookie('accessToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
	res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
}


