'use strict';

const accessTokenView = document.getElementById('accessTokenView');
const projectsView = document.getElementById('projectsView');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');

let accessToken = null;

async function api(path, options = {}) {
	const resp = await fetch(`/api${path}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
		},
		...options
	});
	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(text || resp.statusText);
	}
	return resp.json().catch(() => ({}));
}

function renderAccessToken() {
	accessTokenView.textContent = accessToken ? accessToken : '(none)';
}

document.getElementById('registerBtn').addEventListener('click', async () => {
	try {
		const email = emailEl.value.trim();
		const password = passwordEl.value;
		await api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
		alert('Registered!');
	} catch (e) {
		alert('Register failed: ' + e.message);
	}
});

document.getElementById('loginBtn').addEventListener('click', async () => {
	try {
		const email = emailEl.value.trim();
		const password = passwordEl.value;
		const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
		accessToken = data.accessToken;
		renderAccessToken();
	} catch (e) {
		alert('Login failed: ' + e.message);
	}
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
	try {
		const data = await api('/auth/refresh', { method: 'POST', body: JSON.stringify({}) });
		accessToken = data.accessToken;
		renderAccessToken();
	} catch (e) {
		alert('Refresh failed: ' + e.message);
	}
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
	try {
		await api('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
		accessToken = null;
		renderAccessToken();
	} catch (e) {
		alert('Logout failed: ' + e.message);
	}
});

document.getElementById('loadProjectsBtn').addEventListener('click', async () => {
	try {
		const items = await api('/projects', { method: 'GET' });
		projectsView.textContent = JSON.stringify(items, null, 2);
	} catch (e) {
		alert('Load failed: ' + e.message);
	}
});

renderAccessToken();


