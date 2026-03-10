import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import './layout.css';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import ProfilePage from './pages/ProfilePage';
import { getCurrentUser, logoutUser } from './utils/authStorage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.key} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const handler = () => setCurrentUser(getCurrentUser());
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/" className="brand" aria-label="Event Booking home">
            <img src="/images/sista.png" alt="EventHub logo" className="brand-logo" />
          </Link>
          <div className="top-nav-actions">
            {currentUser ? (
              <>
                <span className="me-2 text-muted small">Hi, {currentUser.name}</span>
                <Link to="/profile" className="top-nav-btn">Profile</Link>
                <button className="top-nav-btn btn btn-link text-decoration-none" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="top-nav-btn">Log In</Link>
                <Link to="/register" className="top-nav-btn">Register</Link>
              </>
            )}
          </div>
        </nav>
        <main className="app-main">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
