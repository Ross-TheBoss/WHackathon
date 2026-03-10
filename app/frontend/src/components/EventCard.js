import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { formatEventTime } from '../utils/dateUtils';

const FAVORITES_STORAGE_KEY = 'favorite_event_ids';

const getFavoriteIds = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (e) {
    return [];
  }
};

function Thumbnail({ event }) {
  // prefer explicit event.image, otherwise pick a local template by id
  const publicUrl = process.env.PUBLIC_URL || '';
  const templates = [
    `${publicUrl}/images/pottery.png`,
    `${publicUrl}/images/yoga.jpeg`,
    `${publicUrl}/images/tech.jpg`,
    `${publicUrl}/images/salsa.jpg`,
    `${publicUrl}/images/talk.jpg`,
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
  const timeDisplay = formatEventTime(event.startTime, event.endTime);
  const [fav, setFav] = useState(
    Boolean(event.favorited) || getFavoriteIds().includes(String(event.id))
  );
  const [pulse, setPulse] = useState(false);
  // portal data for heart-break overlay so animation is independent of list reordering
  const [breakPortal, setBreakPortal] = useState(null);
  const pulseTimerRef = useRef(null);
  const breakTimerRef = useRef(null);
  const wrapRef = useRef(null);

  const toggleFav = () => {
    setFav((prev) => {
      const newVal = !prev;

      const favoriteIds = new Set(getFavoriteIds());
      const currentId = String(event.id);
      if (newVal) favoriteIds.add(currentId);
      else favoriteIds.delete(currentId);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favoriteIds]));
        window.dispatchEvent(new Event('favorites-updated'));
      }

      if (newVal) {
        // favourited -> show pulse
        setPulse(true);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => setPulse(false), 700);
        if (breakTimerRef.current) {
          clearTimeout(breakTimerRef.current);
          setBreakPortal(null);
        }
      } else {
        // unfavourited -> create a portal overlay positioned over the thumb-wrap
        const id = Date.now();
        let rect = null;
        try {
          if (wrapRef.current && wrapRef.current.getBoundingClientRect) rect = wrapRef.current.getBoundingClientRect();
        } catch (e) {
          rect = null;
        }
        setBreakPortal({ id, rect });
        if (breakTimerRef.current) clearTimeout(breakTimerRef.current);
        breakTimerRef.current = setTimeout(() => setBreakPortal(null), 900);
        if (pulseTimerRef.current) {
          clearTimeout(pulseTimerRef.current);
          setPulse(false);
        }
      }
      return newVal;
    });
  };

  useEffect(() => {
    setFav(Boolean(event.favorited) || getFavoriteIds().includes(String(event.id)));
  }, [event.id, event.favorited]);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (breakTimerRef.current) clearTimeout(breakTimerRef.current);
    };
  }, []);

  return (
    <>
    <article tabIndex={0} className="event-card card h-100 position-relative">
      <div ref={wrapRef} className="thumb-wrap position-relative">
        <Thumbnail event={event} />
        <div className={`heart-overlay ${pulse ? 'show' : ''}`} aria-hidden>
          <i className="fa-solid fa-heart"></i>
        </div>
        {/* heart-break portal renders independently */}
        <button
          className="btn btn-light text-danger position-absolute top-0 end-0 m-2"
          aria-label="favorite"
          aria-pressed={fav}
          style={{ zIndex: 3 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFav();
          }}
        >
          <i className={fav ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>
      </div>
      <div className="card-body">
        <Link to={`/events/${event.id}`} className="stretched-link" aria-label={`Open ${event.name}`} />
        <h3 className="event-name"><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <div className="event-meta text-muted small d-flex align-items-center gap-2 flex-wrap">
          <span className="badge bg-secondary event-category-badge">{event.category}</span>
          <span>By {event.author}</span>
        </div>

        <div className="event-info d-flex gap-3 mt-2 text-muted small">
          <div className="time"><i className="fa-regular fa-clock me-1"></i> {timeDisplay}</div>
          <div className="location"><i className="fa-solid fa-map-marker-alt me-1"></i> {event.location}</div>
        </div>

        <div className="event-footer d-flex justify-content-between align-items-center mt-3">
          <div className="left d-flex gap-3 text-muted">
              <span className="participants"><i className="fa-solid fa-user-check me-1"></i> {event.participants}</span>
          </div>
          <div className="right d-flex align-items-center">
            <Rating name="read-only" value={Number(event.rating ?? 0)} precision={0.1} readOnly size="small" />
            <small className="ms-2 text-muted">{(event.rating ?? 0).toFixed(1)}</small>
          </div>
        </div>
      </div>
    </article>
      {breakPortal && typeof document !== 'undefined' ? createPortal(
        <div
          key={breakPortal.id}
          className="heart-break show heart-break-portal"
          style={breakPortal.rect ? {
            position: 'fixed',
            left: `${breakPortal.rect.left + breakPortal.rect.width / 2}px`,
            top: `${breakPortal.rect.top + breakPortal.rect.height / 2}px`,
            transform: 'translate(-50%, -50%)'
          } : {}}
          aria-hidden
        >
          <i className="fa-solid fa-heart-crack"></i>
        </div>,
        document.body
      ) : null}
    </>
  );
}
