import React from 'react';
import { Link } from 'react-router-dom';

function Thumbnail({ event }) {
  // prefer explicit event.image, otherwise pick a local template by id
  const publicUrl = process.env.PUBLIC_URL || '';
  const templates = [
    `${publicUrl}/images/template-1.svg`,
    `${publicUrl}/images/template-2.svg`,
    `${publicUrl}/images/template-3.svg`,
    `${publicUrl}/images/template-4.svg`,
  ];
  let url = '';
  if (event.image) url = event.image;
  else {
    const idx = (Number(event.id) - 1) % templates.length;
    url = templates[idx];
  }
  return <img src={url} alt={event.name || 'event'} className="card-img-top" />;
}

export default function EventCard({ event }) {
  const start = new Date(event.startTime).toLocaleString();
  const end = new Date(event.endTime).toLocaleString();

  return (
    <article className="event-card card h-100 shadow-sm">
      <div className="thumb-wrap position-relative">
        <Thumbnail event={event} />
        <button className="btn btn-light position-absolute top-0 end-0 m-2" aria-label="favorite"><i className="fa-regular fa-heart"></i></button>
      </div>
      <div className="card-body">
        <h3 className="event-name"><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <div className="event-meta text-muted small">{event.category} • {event.author}</div>

        <div className="event-info d-flex gap-3 mt-2 text-muted small">
          <div className="time"><i className="fa-regular fa-clock me-1"></i> {start}</div>
          <div className="location"><i className="fa-solid fa-map-marker-alt me-1"></i> {event.location}</div>
        </div>

        <div className="event-footer d-flex justify-content-between align-items-center mt-3">
          <div className="left d-flex gap-3 text-muted">
            <span className="people"><i className="fa-solid fa-users me-1"></i> {event.groups.length}</span>
            <span className="participants"><i className="fa-solid fa-user-check me-1"></i> {event.maxCapacity}</span>
          </div>
          <div className="right text-warning">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
          </div>
        </div>
      </div>
    </article>
  );
}
