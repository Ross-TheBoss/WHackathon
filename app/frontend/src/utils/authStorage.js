const USERS_KEY = 'sista_users_v1';
const CURRENT_USER_KEY = 'sista_current_user_email_v1';
const RES_PREFIX = 'sista_reservations_v1_';
const HOST_PREFIX = 'sista_hosted_v1_';

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

const loadUsers = () => {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(USERS_KEY), []);
};

const saveUsers = (users) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const reservationsKey = (email) => `${RES_PREFIX}${email}`;
const hostedKey = (email) => `${HOST_PREFIX}${email}`;

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const email = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  return loadUsers().find((u) => u.email === email) || null;
}

export function registerUser(data) {
  if (typeof window === 'undefined') throw new Error('Registration unavailable in this environment');
  const users = loadUsers();
  const exists = users.find((u) => u.email === data.email);
  if (exists) throw new Error('An account with this email already exists.');
  const user = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  window.localStorage.setItem(CURRENT_USER_KEY, user.email);
  window.dispatchEvent(new Event('auth-changed'));
  return user;
}

export function loginUser(email, password) {
  if (typeof window === 'undefined') throw new Error('Login unavailable in this environment');
  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  window.localStorage.setItem(CURRENT_USER_KEY, user.email);
  window.dispatchEvent(new Event('auth-changed'));
  return user;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event('auth-changed'));
}

export function updateCurrentUser(updates) {
  if (typeof window === 'undefined') throw new Error('Update unavailable in this environment');
  const current = getCurrentUser();
  if (!current) throw new Error('No user logged in');
  const users = loadUsers();
  const idx = users.findIndex((u) => u.email === current.email);
  if (idx === -1) throw new Error('User not found');

  const oldEmail = current.email;
  const updated = { ...current, ...updates };
  users[idx] = updated;
  saveUsers(users);

  // migrate reservation + hosted keys if email changed
  if (updates.email && updates.email !== oldEmail) {
    const oldRes = safeParse(window.localStorage.getItem(reservationsKey(oldEmail)), []);
    const oldHosted = safeParse(window.localStorage.getItem(hostedKey(oldEmail)), []);
    window.localStorage.removeItem(reservationsKey(oldEmail));
    window.localStorage.removeItem(hostedKey(oldEmail));
    window.localStorage.setItem(reservationsKey(updated.email), JSON.stringify(oldRes));
    window.localStorage.setItem(hostedKey(updated.email), JSON.stringify(oldHosted));
    window.localStorage.setItem(CURRENT_USER_KEY, updated.email);
  }

  window.dispatchEvent(new Event('auth-changed'));
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
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.localStorage.removeItem(USERS_KEY);
}
