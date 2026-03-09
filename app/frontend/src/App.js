import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import './layout.css';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';

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
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/" className="brand" aria-label="Event Booking home">
            <img src="/images/sista.png" alt="EventHub logo" className="brand-logo" />
          </Link>
          <div className="top-nav-actions">
            <Link to="/login" className="top-nav-btn">Log In</Link>
            <Link to="/register" className="top-nav-btn">Register</Link>
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
