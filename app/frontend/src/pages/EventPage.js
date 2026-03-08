import React from 'react';
import { useParams, Link } from 'react-router-dom';
import slugify from 'react-slugify';
import eventsData from '../data/mockEvents';
import ReactMarkdown from 'react-markdown';
import { formatEventTime } from '../utils/dateUtils';

export default function EventPage() {
  const { id } = useParams();
  const event = eventsData.find(e => slugify(e.name) === id);

  if (!event) return (
    <div className="event-page">
      <p>Event not found.</p>
      <p><Link to="/events">Back to events</Link></p>
    </div>
  );

  const publicUrl = process.env.PUBLIC_URL || '';
  const templates = [
    `${publicUrl}/images/pottery.png`,
    `${publicUrl}/images/yoga.jpeg`,
    `${publicUrl}/images/tech.jpg`,
    `${publicUrl}/images/salsa.jpg`,
    `${publicUrl}/images/talk.jpg`,
  ];
  const heroUrl = event.image || templates[(Number(event.id) - 1) % templates.length];

  const timeDisplay = formatEventTime(event.startTime, event.endTime);

  return (
    <article className="event-page container px-4 px-lg-5 py-4">
      <div className="event-hero mb-4 rounded overflow-hidden">
        <img src={heroUrl} alt={event.name} className="img-fluid w-100 hero-img" />
      </div>

      <header className="mb-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <div>
            <h1 className="display-5 fw-bold d-inline">{event.name}</h1>
            <button className="btn btn-success ms-3">Reserve</button>
          </div>
          <div className="text-muted">
            <small>By {event.author}</small>
            <div className="d-flex gap-3 align-items-center mt-2">
              <span className="text-muted"><i className="fa-solid fa-calendar-days me-2"></i>{timeDisplay}</span>
              <span className="text-muted"><i className="fa-solid fa-map-marker-alt me-2"></i>{event.location}</span>
              <span className="badge bg-secondary">{event.category}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="event-info mb-3">
        <div className="row">
            <section className="event-description markdown-body">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="display-5 fw-bold" {...props} />,
                  h2: ({node, ...props}) => <h2 className="h4 fw-semibold" {...props} />,
                  h3: ({node, ...props}) => <h3 className="h5" {...props} />,
                  h4: ({node, ...props}) => <h4 className="h6" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="mb-2" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="blockquote ps-3" {...props} />,
                  code: ({node, inline, className, children, ...props}) => (
                    inline ? <code className={className} {...props}>{children}</code>
                    : <pre className="p-2 bg-light rounded"><code className={className} {...props}>{children}</code></pre>
                  )
                }}
              >
                {event.description}
              </ReactMarkdown>
            </section>
        </div>
      </section>

      <p className="btn btn-primary"><Link to="/events">Back to events</Link></p>
    </article>
  );
}
