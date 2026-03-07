import React from 'react';
import { useParams, Link } from 'react-router-dom';
import eventsData from '../data/mockEvents';
import ReactMarkdown from 'react-markdown';

export default function EventPage() {
  const { id } = useParams();
  const event = eventsData.find(e => e.id === id);

  if (!event) return (
    <div className="event-page">
      <p>Event not found.</p>
      <p><Link to="/">Back to events</Link></p>
    </div>
  );

  return (
    <article className="event-page">
      <header>
        <h1>{event.name}</h1>
        <div className="event-meta">{event.category} • {event.author}</div>
      </header>
      <section className="event-info">
        <p><strong>When:</strong> {new Date(event.startTime).toLocaleString()} — {new Date(event.endTime).toLocaleString()}</p>
        <p><strong>Where:</strong> {event.location}</p>
        <p><strong>Groups:</strong> {event.groups.join(', ')}</p>
        <p><strong>Capacity:</strong> {event.maxCapacity}</p>
      </section>
      <section className="event-description">
        <ReactMarkdown>{event.description}</ReactMarkdown>
      </section>
      <p><Link to="/">Back to events</Link></p>
    </article>
  );
}
