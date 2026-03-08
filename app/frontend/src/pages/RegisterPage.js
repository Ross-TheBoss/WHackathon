import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('participant');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !age || !role) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Registration successful for ${name}!`);
    // Add actual registration logic here
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h1 className="display-6 fw-bold mb-4 text-center">Register</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="age" className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="0"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="participant"
                    value="participant"
                    checked={role === 'participant'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="participant">
                    Participant
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="organiser"
                    value="organiser"
                    checked={role === 'organiser'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="organiser">
                    Organiser
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Register
              </button>
            </form>

            <div className="text-center">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
