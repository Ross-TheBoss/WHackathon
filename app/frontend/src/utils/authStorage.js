const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const AUTH_TOKEN_KEY = 'sista_auth_token_v1';
const CURRENT_USER_KEY = 'sista_current_user_v1';
const RES_PREFIX = 'sista_reservations_v1_';
const HOST_PREFIX = 'sista_hosted_v1_';

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

const reservationsKey = (email) => `${RES_PREFIX}${email}`;
const hostedKey = (email) => `${HOST_PREFIX}${email}`;

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

const setSession = ({ token, user }) => {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user) window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('auth-changed'));
};

const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event('auth-changed'));
};

const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload.detail === 'string') return payload.detail;
  if (Array.isArray(payload.detail)) {
    return payload.detail.map((item) => item?.msg).filter(Boolean).join(', ') || fallback;
  }
  return payload.message || fallback;
};

async function api(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text ? safeParse(text, null) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `Request failed (${response.status})`));
  }

  return payload;
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(CURRENT_USER_KEY), null);
}

export async function registerUser(data) {
  if (typeof window === 'undefined') throw new Error('Registration unavailable in this environment');

  await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      age: Number(data.age),
    }),
  });

  return loginUser(data.email, data.password);
}

export async function loginUser(email, password) {
  if (typeof window === 'undefined') throw new Error('Login unavailable in this environment');

  const result = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const token = result?.access_token;
  const user = result?.user;

  if (!token || !user) {
    throw new Error('Login response missing token or user information');
  }

  setSession({ token, user });
  return user;
}

export function logoutUser() {
  clearSession();
}

export async function updateCurrentUser(updates) {
  if (typeof window === 'undefined') throw new Error('Update unavailable in this environment');
  const current = getCurrentUser();
  if (!current) throw new Error('No user logged in');

  const payload = {
    ...updates,
    age: updates.age === '' ? null : Number(updates.age),
  };

  const updated = await api(`/api/v1/users/${current.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (updates.email && updates.email !== current.email) {
    const oldRes = safeParse(window.localStorage.getItem(reservationsKey(current.email)), []);
    const oldHosted = safeParse(window.localStorage.getItem(hostedKey(current.email)), []);
    window.localStorage.removeItem(reservationsKey(current.email));
    window.localStorage.removeItem(hostedKey(current.email));
    window.localStorage.setItem(reservationsKey(updated.email), JSON.stringify(oldRes));
    window.localStorage.setItem(hostedKey(updated.email), JSON.stringify(oldHosted));
  }

  setSession({ token: getStoredToken(), user: updated });
  return updated;
}

export function getReservationsForUser(email) {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(reservationsKey(email)), []);
}

export function addReservationForCurrentUser(eventId) {
  if (typeof window === 'undefined') throw new Error('Not available');
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const key = reservationsKey(user.email);
  const existing = new Set(getReservationsForUser(user.email).map(String));
  existing.add(String(eventId));
  window.localStorage.setItem(key, JSON.stringify([...existing]));
  return [...existing];
}

export function getHostedEventsForUser(email) {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(hostedKey(email)), []);
}

export function addHostedEventForCurrentUser(eventId) {
  if (typeof window === 'undefined') throw new Error('Not available');
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const key = hostedKey(user.email);
  const existing = new Set(getHostedEventsForUser(user.email).map(String));
  existing.add(String(eventId));
  window.localStorage.setItem(key, JSON.stringify([...existing]));
  return [...existing];
}

export function clearAllAuthData() {
  clearSession();
}
