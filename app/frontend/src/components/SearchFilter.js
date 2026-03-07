import React, { useState } from 'react';

export default function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  participants,
  setParticipants,
  showSearch = true
}) {

  return (
    <div className="search-filter">
      {showSearch !== false && (
        <div className="mb-3">
          <input
            aria-label="Search events"
            placeholder="Search events"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
          <option value="">All categories</option>
          <option value="Arts & Crafts">Arts & Crafts</option>
          <option value="Health">Health</option>
          <option value="Technology">Technology</option>
          <option value="Dance">Dance</option>
          <option value="Talk">Talk</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Sort</label>
        <select value={sort} onChange={e => setSort(e.target.value)} className="form-select">
          <option value="dateAsc">Date ↑</option>
          <option value="dateDesc">Date ↓</option>
          <option value="nameAsc">Name A–Z</option>
          <option value="capacityDesc">Capacity ↓</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Participants (min): {participants}</label>
        <input type="range" className="form-range" min="0" max="100" value={participants} onChange={e => setParticipants(Number(e.target.value))} />
      </div>
    </div>
  );
}
