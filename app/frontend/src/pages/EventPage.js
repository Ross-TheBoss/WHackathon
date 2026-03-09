import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import slugify from 'react-slugify';
import eventsData from '../data/mockEvents';
import ReactMarkdown from 'react-markdown';
import { formatEventTime } from '../utils/dateUtils';
import { Rating } from '@mui/material';
import GroupChat from '../components/GroupChat';

export default function EventPage() {
  const RESERVE_MODAL_TOP = 72;
  const { id } = useParams();
  const event = eventsData.find(e => slugify(e.name) === id);

  const [showModal, setShowModal] = useState(false);
  const [modalLaunchOffset, setModalLaunchOffset] = useState({ x: 0, y: 0 });
  const [username, setUsername] = useState('');
  const [groupChat, setGroupChat] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '', author: '' });
  const [reviews, setReviews] = useState(event?.reviews || []);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');

  const handleConfirm = () => {
    if (!username || !acceptedTerms) {
      alert("Please enter a username and accept the terms.");
      return;
    }

    alert(`Reservation confirmed for ${username}!`);
    setRegisteredUsername(username);
    setIsRegistered(true);
    if (groupChat) {
      setIsChatOpen(true);
    }
    setShowModal(false);
    setUsername('');
    setGroupChat(false);
    setAcceptedTerms(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      alert("Please provide your name and a comment.");
      return;
    }

    const review = {
      id: Date.now(),
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([...reviews, review]);
    setNewReview({ rating: 5, comment: '', author: '' });
    alert("Thank you for your review!");
  };

  const handleOpenReserveModal = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + (rect.width / 2);
    const clickY = rect.top + (rect.height / 2);
    const offsetX = clickX - (window.innerWidth / 2);
    const offsetY = clickY - RESERVE_MODAL_TOP;

    setModalLaunchOffset({ x: offsetX, y: offsetY });
    setShowModal(true);
  };

  if (!event) return (
    <div className="event-page">
      <p>Event not found.</p>
      <p><Link to="/events">Back to events</Link></p>
    </div>
  );

  const publicUrl = process.env.PUBLIC_URL || '';
  const templates = [
    `${publicUrl}/images/pottery_hero.png`,
    `${publicUrl}/images/yoga_hero.png`,
    `${publicUrl}/images/tech_hero.png`,
    `${publicUrl}/images/salsa_hero.png`,
    `${publicUrl}/images/talk_hero.png`,
  ];

  const heroUrl = event.image || templates[(Number(event.id) - 1) % templates.length];
  const timeDisplay = formatEventTime(event.startTime, event.endTime);

  return (
    <article className="event-page container px-4 px-lg-5 py-4">
      <div className="card">
        <div className="event-hero mb-4 rounded overflow-hidden">
          <img src={heroUrl} alt={event.name} className="img-fluid w-100 hero-img" />
        </div>
        <div className="card-body">
          <header className="mb-3">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h1 className="display-5 fw-bold">{event.name}</h1>
              <div className="d-flex gap-2">
                {isRegistered && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsChatOpen(true)}
                    style={{ backgroundColor: '#c5addc', borderColor: '#c5addc' }}
                  >
                    <i className="fa-solid fa-comments me-2"></i>
                    Group Chat
                  </button>
                )}
                <button className="btn btn-success" onClick={handleOpenReserveModal}>
                  Reserve
                </button>
              </div>
            </div>
            <div className="text-muted">
              <small>By {event.author}</small>
              <div className="d-flex gap-3 align-items-center mt-2">
                <span className="text-muted">
                  <i className="fa-solid fa-calendar-days me-2"></i>
                  {timeDisplay}
                </span>
                <span className="text-muted">
                  <i className="fa-solid fa-map-marker-alt me-2"></i>
                  {event.location}
                </span>
                <span className="badge bg-secondary">
                  {event.category}
                </span>
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
                      inline
                        ? <code className={className} {...props}>{children}</code>
                        : <pre className="p-2 bg-light rounded">
                            <code className={className} {...props}>{children}</code>
                          </pre>
                    )
                  }}
                >
                  {event.description}
                </ReactMarkdown>
              </section>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="reviews-section mt-4 mb-4">
            <h2 className="h4 mb-3">Reviews</h2>
            
            {/* Existing Reviews */}
            {reviews && reviews.length > 0 ? (
              <div className="reviews-list mb-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card mb-3 review-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="card-title mb-1">{review.author}</h5>
                          <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                        </div>
                        <Rating value={review.rating} readOnly size="small" />
                      </div>
                      <p className="card-text mb-0">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-4">No reviews yet. Be the first to review this event!</p>
            )}

            {/* Add Review Form */}
            <div className="card">
              <div className="card-body">
                <h3 className="h5 mb-3">Write a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newReview.author}
                      onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div>
                      <Rating
                        value={newReview.rating}
                        onChange={(e, newValue) => setNewReview({...newReview, rating: newValue})}
                        size="large"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
              </div>
            </div>
          </section>

          <div className="back-to-events-wrap">
            <p className="btn btn-primary mb-0">
              <Link className="text-white text-decoration-none" to="/events">
                Back to events
              </Link>
            </p>
          </div>
        </div>
      </div>
      {showModal && (
        <>
          <div className="modal-backdrop show reserve-modal-backdrop" onClick={() => setShowModal(false)}></div>
          <div className="modal show d-block reserve-modal" tabIndex="-1">
            <div
              className="modal-dialog reserve-modal-dialog"
              style={{
                '--reserve-from-x': `${modalLaunchOffset.x}px`,
                '--reserve-from-y': `${modalLaunchOffset.y}px`
              }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reserve Spot</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="groupchat"
                      checked={groupChat}
                      onChange={(e) => setGroupChat(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="groupchat">
                      Add me to the event group chat
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I accept the Terms and Conditions
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleConfirm}>
                    Confirm Reservation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Group Chat Component */}
      <GroupChat 
        eventName={event.name}
        eventId={event.id}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        username={registeredUsername}
      />
    </article>
  );
}