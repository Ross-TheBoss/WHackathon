import React from 'react';
import { Link } from 'react-router-dom';

export default function AddEventCard() {
  return (
    <article className="event-card card h-100 shadow-sm position-relative add-event-card">
      <Link to="/create-event" className="stretched-link h-100 d-flex flex-column" aria-label="Create new event">
        <div className="thumb-wrap position-relative flex-grow-1 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <i className="fa-solid fa-plus fa-3x text-muted mb-3"></i>
            <h3 className="text-muted mb-0">Add Event</h3>
          </div>
        </div>
      </Link>
    </article>
  );
}
