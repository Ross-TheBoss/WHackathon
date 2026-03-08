import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './layout.css';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/" className="brand">Event Booking</Link>
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
