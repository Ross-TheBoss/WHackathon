import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        {/* Placeholder logo */}
        <div className="mb-4">
          <h1 className="display-1 fw-bold text-primary">EventHub</h1>
          <p className="text-muted">Your gateway to amazing events</p>
        </div>
      </div>

      {/* About section */}
      <section className="mb-5 text-center">
        <h2 className="h3 mb-3">About Us</h2>
        <p className="lead">
          Welcome to EventHub, where you can discover and book exciting events in your area.
          From workshops and classes to social gatherings and talks, we have something for everyone.
        </p>
        <p>
          Our platform makes it easy to find events that match your interests, read reviews from other attendees,
          and reserve your spot with just a few clicks.
        </p>
      </section>

      {/* Action buttons */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className="btn btn-outline-primary">Login</button>
        <button className="btn btn-primary">Register</button>
      </div>

      {/* Temporary button to events page */}
      <div className="text-center">
        <Link to="/events" className="btn btn-success btn-lg">Browse Events</Link>
      </div>
    </div>
  );
}