/**
 * API utility for communicating with the backend.
 * All event, registration, and review calls live here.
 */

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || ''
).replace(/\/$/, '');

const AUTH_TOKEN_KEY = 'sista_auth_token_v1';

function getToken() {
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
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
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = data?.detail;
    const msg =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
        ? detail.map((d) => d?.msg).filter(Boolean).join(', ')
        : data?.message || `Request failed (${response.status})`;
    throw new Error(msg);
  }

  return data;
}

// ── Events ────────────────────────────────────────────────────────────────────

/** Fetch all events. Optionally filter by organiser_id. */
export function fetchEvents(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null)
  ).toString();
  return request(`/api/v1/events${qs ? `?${qs}` : ''}`);
}

/** Fetch a single event by numeric ID. */
export function fetchEvent(id) {
  return request(`/api/v1/events/${id}`);
}

/** Create a new event. `data` uses backend snake_case field names. */
export function createEvent(data) {
  return request('/api/v1/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Registrations ─────────────────────────────────────────────────────────────

/** Create a registration for an event. */
export function createRegistration(data) {
  return request('/api/v1/registrations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Fetch all registrations, optionally filtered by user_id or event_id. */
export function fetchRegistrations(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null)
  ).toString();
  return request(`/api/v1/registrations${qs ? `?${qs}` : ''}`);
}

/** Fetch all events a user is registered for. */
export function fetchUserRegisteredEvents(userId) {
  return request(`/api/v1/users/${userId}/registered-events`);
}

// ── Reviews ───────────────────────────────────────────────────────────────────

/** Submit a review for an event. */
export function createReview(data) {
  return request('/api/v1/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
