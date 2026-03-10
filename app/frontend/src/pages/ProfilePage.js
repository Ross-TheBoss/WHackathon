import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatEventTime } from '../utils/dateUtils';
import {
  getCurrentUser,
  updateCurrentUser,
} from '../utils/authStorage';
import { fetchUserRegisteredEvents, fetchEvents } from '../utils/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    role: 'participant',
  });
  const [reservations, setReservations] = useState([]);
  const [hosted, setHosted] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // On mount: require auth and seed form data
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to view your profile.' } });
      return;
    }
    setCurrentUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: user.password || '',
      age: user.age || '',
      role: user.role || 'participant',
    });

    const authHandler = () => {
      const u = getCurrentUser();
      setCurrentUser(u);
      if (!u) navigate('/login', { state: { message: 'Session ended. Please log in again.' } });
    };
    window.addEventListener('auth-changed', authHandler);
    return () => window.removeEventListener('auth-changed', authHandler);
  }, [navigate]);

  // Load reservation + hosted lists when user changes
  useEffect(() => {
    if (!currentUser) return;

    // Registered events from API
    fetchUserRegisteredEvents(currentUser.id)
      .then((events) => setReservations(Array.isArray(events) ? events : []))
      .catch(() => setReservations([]));

    // Hosted events: events where organiser_id matches current user
    fetchEvents({ organiser_id: currentUser.id })
      .then((events) => setHosted(Array.isArray(events) ? events : []))
      .catch(() => setHosted([]));
  }, [currentUser]);

  const stats = useMemo(() => ({
    attended: reservations.length,
    hosting: hosted.length,
    saved: 0,
  }), [reservations.length, hosted.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const updated = await updateCurrentUser(form);
      setCurrentUser(updated);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Could not update profile right now.');
    }
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-start">
        <div>
          <h5 className="card-title mb-1">
            <Link className="text-decoration-none" to={`/events/${event.id}`}>
              {event.name}
            </Link>
          </h5>
          <small className="text-muted d-block">{formatEventTime(event.startTime, event.endTime)}</small>
          <small className="text-muted">
            <i className="fa-solid fa-map-marker-alt me-1"></i>
            {event.location}
          </small>
        </div>
        <span className="badge bg-secondary">{event.category}</span>
      </div>
    </div>
  );

  const renderInitialAvatar = () => (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center text-white"
      style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #c5addc, #7f6bff)', fontWeight: 700, fontSize: '1.5rem' }}
      aria-hidden="true"
    >
      {currentUser?.name?.slice(0, 1) || '?'}
    </div>
  );

  if (!currentUser) return null;

  return (
    <div className="container py-5 profile-page">
      <div className="row g-4">
        {/* Profile summary + edit form */}
        <section className="col-lg-4">
          <div className="card p-4 h-100">
            <div className="d-flex align-items-center mb-3">
              {renderInitialAvatar()}
              <div className="ms-3">
                <h1 className="h4 mb-1">{currentUser.name}</h1>
                <div className="text-muted small">Role: {currentUser.role}</div>
                <div className="text-muted small">Email: {currentUser.email}</div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="mt-2">
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="participant">Participant</option>
                  <option value="organiser">Organiser</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">Save changes</button>
            </form>

            <div className="mt-3">
              <Link to="/create-event" className="btn btn-outline-primary w-100 mb-2">
                <i className="fa-solid fa-plus me-2"></i>
                Host a new event
              </Link>
              <Link to="/events" className="btn btn-outline-secondary w-100">
                Browse events
              </Link>
            </div>
          </div>
        </section>

        {/* Activity and lists */}
        <section className="col-lg-8">
          <div className="card p-4 mb-4">
            <div className="row text-center g-3">
              <div className="col-4">
                <div className="p-3 bg-light rounded">
                  <div className="fw-bold fs-4">{stats.attended}</div>
                  <div className="text-muted small">Reserved</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 bg-light rounded">
                  <div className="fw-bold fs-4">{stats.hosting}</div>
                  <div className="text-muted small">Hosting</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 bg-light rounded">
                  <div className="fw-bold fs-4">{stats.saved}</div>
                  <div className="text-muted small">Saved</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Your reservations</h2>
              <Link to="/events" className="small">Find more</Link>
            </div>
            {reservations.length === 0 && (
              <p className="text-muted mb-0">No reservations yet. Book an event to see it here.</p>
            )}
            {reservations.map(renderEventCard)}
          </div>

          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Your hosted events</h2>
              <Link to="/create-event" className="small">Create</Link>
            </div>
            {hosted.length === 0 && (
              <p className="text-muted mb-0">You haven't hosted anything yet. Start one today!</p>
            )}
            {hosted.map(renderEventCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
