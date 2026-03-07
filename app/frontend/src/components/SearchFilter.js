import React, { useState } from 'react';
import { Range } from 'react-range';

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
  const minLimit = 0;
  const maxLimit = 100;
  const [minP, maxP] = participants;

  const getBg = (minV, maxV) => {
    const left = ((minV - minLimit) / (maxLimit - minLimit)) * 100;
    const right = ((maxV - minLimit) / (maxLimit - minLimit)) * 100;
    return `linear-gradient(to right, #d1d5db ${left}%, #0d6efd ${left}%, #0d6efd ${right}%, #d1d5db ${right}%)`;
  };

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
          <option value="newest">Newest</option>
          <option value="soonest">Soonest</option>
          <option value="closest">Closest</option>
          <option value="nameAsc">A–Z</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Participants: {minP} — {maxP}</label>
        <div style={{ padding: '12px 0' }}>
          <Range
            values={[minP, maxP]}
            step={1}
            min={minLimit}
            max={maxLimit}
            onChange={(vals) => {
              // ensure min < max
              const [a, b] = vals;
              if (a >= b) return;
              setParticipants(vals);
            }}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '100%',
                  borderRadius: '6px',
                  background: getBg(minP, maxP)
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '16px',
                  width: '16px',
                  borderRadius: '50%',
                  background: '#083c8a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
