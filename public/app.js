'use strict';

const accessTokenView = document.getElementById('accessTokenView');
const projectsView = document.getElementById('projectsView');
const userStatusText = document.getElementById('userStatusText');
const userStatus = document.getElementById('userStatus');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');

// Project form elements
const pNameEl = document.getElementById('pName');
const pClientEl = document.getElementById('pClient');
const pStartEl = document.getElementById('pStart');
const pEndEl = document.getElementById('pEnd');
const createProjectBtn = document.getElementById('createProjectBtn');
const projectFormMsg = document.getElementById('projectFormMsg');

// Programmer form elements
const prProjectEl = document.getElementById('prProject');
const prFirstEl = document.getElementById('prFirst');
const prLastEl = document.getElementById('prLast');
const prMiddleEl = document.getElementById('prMiddle');
const prPosEl = document.getElementById('prPos');
const prStartEl = document.getElementById('prStart');
const prEndEl = document.getElementById('prEnd');
const prRateEl = document.getElementById('prRate');
const prFullEl = document.getElementById('prFull');
const createProgrammerBtn = document.getElementById('createProgrammerBtn');
const programmerFormMsg = document.getElementById('programmerFormMsg');

// KPI elements
const kpiBar = document.getElementById('kpiBar');
const kpiProjects = document.getElementById('kpiProjects');
const kpiProgrammers = document.getElementById('kpiProgrammers');
const kpiSalaries = document.getElementById('kpiSalaries');
const kpiValue = document.getElementById('kpiValue');

let accessToken = null;
let currentUser = null;
let isRefreshing = false;
let cache = {
	projects: [],
	programmers: []
};

async function api(path, options = {}) {
	const resp = await fetch(`/api${path}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
		},
		...options
	});
	
	// If we get 401, try to refresh the token (but only once)
	if (resp.status === 401 && path !== '/auth/refresh' && path !== '/auth/login' && path !== '/auth/register' && !isRefreshing) {
		isRefreshing = true;
		try {
			const refreshResp = await fetch('/api/auth/refresh', {
				credentials: 'include',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});
			
			if (refreshResp.ok) {
				const refreshData = await refreshResp.json();
				accessToken = refreshData.accessToken;
				renderAccessToken();
				isRefreshing = false;
				// Retry the original request with new token
				return api(path, options);
			} else {
				// Refresh failed, user is not authenticated
				accessToken = null;
				currentUser = null;
				updateUserStatus();
				renderAccessToken();
				isRefreshing = false;
			}
		} catch (e) {
			// Refresh failed, user is not authenticated
			accessToken = null;
			currentUser = null;
			updateUserStatus();
			renderAccessToken();
			isRefreshing = false;
		}
	}
	
	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(text || resp.statusText);
	}
	return resp.json().catch(() => ({}));
}

function renderAccessToken() {
	accessTokenView.textContent = accessToken ? accessToken : '(none)';
}

function updateUserStatus() {
	userStatusText.textContent = currentUser ? `Logged in as: ${currentUser.email}` : 'Not logged in';
}

function formatMoney(num) {
	const n = Number(num || 0);
	return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function escapeHtml(text) {
	if (text == null) return '';
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// Business-calculation helpers (client-side mirror)
function computeWorkdaysInclusive(start, end) {
	const s = new Date(start);
	const e = new Date(end);
	if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || s > e) return 0;
	let days = 0;
	for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
		const day = d.getDay();
		// Weekdays only to mirror service
		if (day !== 0 && day !== 6) days++;
	}
	return days;
}

function computeSalary(dev) {
	const hoursPerDay = dev.fullTime ? 8 : 4;
	const workDays = computeWorkdaysInclusive(dev.startDate, dev.endDate);
	const base = workDays * hoursPerDay * (Number(dev.hourlyRate) || 0);
	// Mirror CalculationService: multiply by 1.77 and round
	return Math.round(base * 1.77);
}

function computeProjectMetrics(project, programmers) {
	const team = programmers.filter(p => p.projectId === project.id);
	const totalSalary = team.reduce((sum, p) => sum + computeSalary(p), 0);
	const projectValue = totalSalary * 2;
	return { teamCount: team.length, totalSalary, projectValue, team };
}

function renderKPIs(projects, programmers) {
	if (!projects.length) {
		kpiBar.style.display = 'none';
		return;
	}
	const totals = projects.reduce((acc, pr) => {
		const m = computeProjectMetrics(pr, programmers);
		acc.projects++;
		acc.programmers += m.teamCount;
		acc.salaries += m.totalSalary;
		acc.value += m.projectValue;
		return acc;
	}, { projects: 0, programmers: 0, salaries: 0, value: 0 });

	kpiProjects.textContent = String(totals.projects);
	kpiProgrammers.textContent = String(totals.programmers);
	kpiSalaries.textContent = formatMoney(totals.salaries);
	kpiValue.textContent = formatMoney(totals.value);
	kpiBar.style.display = 'flex';
}

function renderProjects(projects, programmers) {
	if (!projects || projects.length === 0) {
		projectsView.innerHTML = '<p class="small">No projects found.</p>';
		renderKPIs([], []);
		return;
	}

	const cards = projects.map(project => {
		const m = computeProjectMetrics(project, programmers);
		const start = project.startDate ? new Date(project.startDate).toLocaleDateString() : '—';
		const end = project.endDate ? new Date(project.endDate).toLocaleDateString() : '—';
		const teamHtml = m.team.map(dev => {
			const sal = computeSalary(dev);
			return `
				<div class="badge" data-prog-id="${dev.id}">
					<span>${escapeHtml(dev.lastName || '')} ${escapeHtml(dev.firstName || '')}</span>
					<span class="small">(${escapeHtml(dev.position || 'Dev')})</span>
					<span class="small">• ${dev.fullTime ? 'FT' : 'PT'}</span>
					<span class="small">• ${formatMoney(sal)}</span>
					<button title="Delete programmer" class="secondary btn-del-prog" data-id="${dev.id}" style="padding:2px 6px; margin-left:6px;">✕</button>
				</div>
			`;
		}).join(' ');

		return `
			<div class="project" data-project-id="${project.id}">
				<div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
					<h3 style="margin:0;">${escapeHtml(project.name || 'Unnamed Project')}</h3>
					<div class="actions">
						<button class="secondary btn-del-project" data-id="${project.id}" title="Delete project">Delete</button>
					</div>
				</div>
				<div class="meta">
					<span class="badge">Client: ${escapeHtml(project.client || 'N/A')}</span>
					<span class="badge">Dates: ${start} → ${end}</span>
					<span class="badge">Programmers: ${m.teamCount}</span>
					<span class="badge">Total salary: ${formatMoney(m.totalSalary)}</span>
					<span class="badge">Project value: ${formatMoney(m.projectValue)}</span>
				</div>
				<hr class="sep" />
				<div class="meta">${teamHtml || '<span class="small">No programmers assigned yet.</span>'}</div>
			</div>
		`;
	}).join('');

	projectsView.innerHTML = cards;
	renderKPIs(projects, programmers);
}

async function checkAuthStatus() {
	try {
		// Try to get current user info (works with cookies even if accessToken is null)
		const user = await fetch('/api/auth/me', {
			credentials: 'include',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
			}
		});
		
		if (user.ok) {
			const userData = await user.json();
			currentUser = userData;
			updateUserStatus();
			// Try to get the access token from the response or refresh
			if (!accessToken) {
				try {
					const refreshResp = await fetch('/api/auth/refresh', {
						credentials: 'include',
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({})
					});
					if (refreshResp.ok) {
						const refreshData = await refreshResp.json();
						accessToken = refreshData.accessToken;
						renderAccessToken();
					}
				} catch (e) {
					// Token refresh failed, but user is still authenticated via cookies
				}
			}
		} else {
			// Not authenticated, try refresh
			throw new Error('Not authenticated');
		}
	} catch (e) {
		// If that fails, try to refresh the token
		try {
			const refreshResp = await fetch('/api/auth/refresh', {
				credentials: 'include',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});
			
			if (refreshResp.ok) {
				const refreshData = await refreshResp.json();
				accessToken = refreshData.accessToken;
				renderAccessToken();
				// Try again to get user info
				const userResp = await fetch('/api/auth/me', {
					credentials: 'include',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${accessToken}`
					}
				});
				if (userResp.ok) {
					const userData = await userResp.json();
					currentUser = userData;
					updateUserStatus();
				} else {
					throw new Error('Failed to get user info');
				}
			} else {
				throw new Error('Refresh failed');
			}
		} catch (refreshError) {
			// Not authenticated
			accessToken = null;
			currentUser = null;
			updateUserStatus();
			renderAccessToken();
		}
	}
}

document.getElementById('registerBtn').addEventListener('click', async () => {
	try {
		projectFormMsg.textContent = '';
		programmerFormMsg.textContent = '';
		const email = emailEl.value.trim();
		const password = passwordEl.value;
		await api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
		userStatusText.textContent = 'Registered! Now log in.';
	} catch (e) {
		userStatusText.textContent = 'Register failed: ' + e.message;
	}
});

document.getElementById('loginBtn').addEventListener('click', async () => {
	try {
		projectFormMsg.textContent = '';
		programmerFormMsg.textContent = '';
		const email = emailEl.value.trim();
		const password = passwordEl.value;
		const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
		accessToken = data.accessToken;
		renderAccessToken();
		// Get user info after login
		await checkAuthStatus();
		await reloadAll();
	} catch (e) {
		userStatusText.textContent = 'Login failed: ' + e.message;
	}
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
	try {
		const data = await api('/auth/refresh', { method: 'POST', body: JSON.stringify({}) });
		accessToken = data.accessToken;
		renderAccessToken();
		await checkAuthStatus();
		await reloadAll();
	} catch (e) {
		userStatusText.textContent = 'Refresh failed: ' + e.message;
	}
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
	try {
		await api('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
		accessToken = null;
		currentUser = null;
		updateUserStatus();
		renderAccessToken();
		projectsView.innerHTML = '';
		kpiBar.style.display = 'none';
	} catch (e) {
		userStatusText.textContent = 'Logout failed: ' + e.message;
	}
});

document.getElementById('loadProjectsBtn').addEventListener('click', async () => {
	try {
		await reloadAll();
	} catch (e) {
		projectsView.innerHTML = `<p class="error">Error: ${escapeHtml(e.message)}</p>`;
	}
});

// Create Project handler
createProjectBtn.addEventListener('click', async () => {
	try {
		projectFormMsg.textContent = '';
		const name = pNameEl.value.trim();
		const client = pClientEl.value.trim();
		const startDate = pStartEl.value ? new Date(pStartEl.value) : null;
		const endDate = pEndEl.value ? new Date(pEndEl.value) : null;
		if (!name || !client || !startDate || !endDate) {
			projectFormMsg.textContent = 'Please fill all fields.';
			projectFormMsg.className = 'small error';
			return;
		}
		if (startDate >= endDate) {
			projectFormMsg.textContent = 'End date must be later than start date.';
			projectFormMsg.className = 'small error';
			return;
		}
		createProjectBtn.disabled = true;
		await api('/projects', { method: 'POST', body: JSON.stringify({
			name, client, startDate, endDate
		}) });
		projectFormMsg.textContent = 'Project created.';
		projectFormMsg.className = 'small success';
		// Clear
		pNameEl.value = '';
		pClientEl.value = '';
		pStartEl.value = '';
		pEndEl.value = '';
		await reloadAll();
	} catch (e) {
		projectFormMsg.textContent = 'Create failed: ' + e.message;
		projectFormMsg.className = 'small error';
	} finally {
		createProjectBtn.disabled = false;
	}
});

// Create Programmer handler
createProgrammerBtn.addEventListener('click', async () => {
	try {
		programmerFormMsg.textContent = '';
		const projectId = Number(prProjectEl.value);
		const firstName = prFirstEl.value.trim();
		const lastName = prLastEl.value.trim();
		const middleName = prMiddleEl.value.trim();
		const position = prPosEl.value.trim();
		const startDate = prStartEl.value ? new Date(prStartEl.value) : null;
		const endDate = prEndEl.value ? new Date(prEndEl.value) : null;
		const hourlyRate = Number(prRateEl.value);
		const fullTime = prFullEl.value === 'true';
		if (!projectId || !firstName || !lastName || !position || !startDate || !endDate || !hourlyRate) {
			programmerFormMsg.textContent = 'Please fill all required fields.';
			programmerFormMsg.className = 'small error';
			return;
		}
		if (startDate >= endDate) {
			programmerFormMsg.textContent = 'End date must be later than start date.';
			programmerFormMsg.className = 'small error';
			return;
		}
		createProgrammerBtn.disabled = true;
		await api('/programmers', { method: 'POST', body: JSON.stringify({
			projectId, firstName, lastName, middleName, position,
			startDate, endDate, hourlyRate, fullTime
		}) });
		programmerFormMsg.textContent = 'Programmer added.';
		programmerFormMsg.className = 'small success';
		// Clear
		prFirstEl.value = '';
		prLastEl.value = '';
		prMiddleEl.value = '';
		prPosEl.value = '';
		prStartEl.value = '';
		prEndEl.value = '';
		prRateEl.value = '';
		prFullEl.value = 'true';
		await reloadAll();
	} catch (e) {
		programmerFormMsg.textContent = 'Create failed: ' + e.message;
		programmerFormMsg.className = 'small error';
	} finally {
		createProgrammerBtn.disabled = false;
	}
});

async function reloadAll() {
	const [projects, programmers] = await Promise.all([
		api('/projects', { method: 'GET' }),
		api('/programmers', { method: 'GET' })
	]);
	cache.projects = Array.isArray(projects) ? projects : [projects];
	cache.programmers = Array.isArray(programmers) ? programmers : [programmers];
	populateProjectSelect(cache.projects);
	renderProjects(cache.projects, cache.programmers);
}

function populateProjectSelect(projects) {
	const opts = ['<option value="">Select project…</option>']
		.concat(projects.map(p => `<option value="${p.id}">${escapeHtml(p.name || 'Project ' + p.id)}</option>`));
	prProjectEl.innerHTML = opts.join('');
}

// Event delegation for DELETE actions
projectsView.addEventListener('click', async (e) => {
	const target = e.target;
	if (!(target instanceof HTMLElement)) return;

	// Delete project
	if (target.classList.contains('btn-del-project')) {
		const id = Number(target.getAttribute('data-id'));
		if (!id) return;
		const confirmMsg = 'Delete this project? All its programmers must be removed or will fail if FK constraints exist.';
		if (!confirm(confirmMsg)) return;
		try {
			target.disabled = true;
			await api(`/projects/${id}`, { method: 'DELETE' });
			await reloadAll();
		} catch (err) {
			alert('Delete project failed: ' + err.message);
		} finally {
			target.disabled = false;
		}
		return;
	}

	// Delete programmer
	if (target.classList.contains('btn-del-prog')) {
		const id = Number(target.getAttribute('data-id'));
		if (!id) return;
		if (!confirm('Delete this programmer?')) return;
		try {
			target.disabled = true;
			await api(`/programmers/${id}`, { method: 'DELETE' });
			await reloadAll();
		} catch (err) {
			alert('Delete programmer failed: ' + err.message);
		} finally {
			target.disabled = false;
		}
		return;
	}
});

// Check auth status on page load
renderAccessToken();
checkAuthStatus().then(() => reloadAll()).catch(() => {});
