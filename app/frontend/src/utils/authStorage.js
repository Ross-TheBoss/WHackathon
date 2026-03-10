const AUTH_TOKEN_KEY = 'sista_auth_token_v1';
const CURRENT_USER_KEY = 'sista_current_user_v1';
const RES_PREFIX = 'sista_reservations_v1_';
const HOST_PREFIX = 'sista_hosted_v1_';
const USERS_KEY = 'sista_users_v1';

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

const getUsers = () => {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(USERS_KEY), []);
};

const saveUsers = (users) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(CURRENT_USER_KEY), null);
}

export async function registerUser(data) {
  if (typeof window === 'undefined') throw new Error('Registration unavailable in this environment');

  const users = getUsers();
  const exists = users.some((u) => u.email === data.email);
  if (exists) throw new Error('Email already registered');

  const newUser = {
    id: crypto.randomUUID?.() || `local-${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    age: Number(data.age),
    role: data.role || 'user',
  };

  saveUsers([...users, newUser]);
  return loginUser(data.email, data.password);
}

export async function loginUser(email, password) {
  if (typeof window === 'undefined') throw new Error('Login unavailable in this environment');

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) throw new Error('Invalid email or password');

  const token = `local-token-${user.id}`;
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

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === current.id);
  if (idx === -1) throw new Error('User not found');

  const updated = {
    ...current,
    ...updates,
    age: updates.age === '' ? null : Number(updates.age ?? current.age),
  };

  users[idx] = updated;
  saveUsers(users);

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
