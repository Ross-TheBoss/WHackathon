import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-page container py-5">
      <div className="card p-4">
        <section className="home-hero mb-4" aria-label="Featured events">
          <img src="/images/women_social.png" alt="People enjoying a community event" className="home-hero-image" />
        </section>

        {/* About Section */}
        <section className="about-section text-center mb-5">
          <h2 className="display-6 fw-bold d-inline-flex align-items-center justify-content-center gap-3 mb-4">
            <span aria-hidden="true">&#9829;</span>
            <span>Safe Socialising and Networking for Her</span>
            <span aria-hidden="true">&#9829;</span>
          </h2>
          <p>
            Welcome to Sista! Your go-to platform for discovering and booking amazing events.
            Whether you're looking for workshops, classes, or community gatherings, we've got you covered.
            Join our community and never miss out on exciting opportunities!
          </p>
        </section>

        {/* Buttons */}
        <div className="text-center">
          <div className="mb-3">
            <Link to="/login" className="btn btn-primary me-3">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
          <div>
            <Link to="/events" className="btn btn-success">Browse Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}