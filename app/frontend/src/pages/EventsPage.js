import React, { useState, useMemo } from 'react';
import eventsData from '../data/mockEvents';
import EventCard from '../components/EventCard';
import SearchFilter from '../components/SearchFilter';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('dateAsc');
  const [participants, setParticipants] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = eventsData.filter(ev => {
      if (category && ev.category !== category) return false;
      if (participants > 0 && ev.maxCapacity < participants) return false;
      if (!q) return true;
      return (
        ev.name.toLowerCase().includes(q) ||
        ev.author.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q)
      );
    });

    // sorting
    list = list.slice();
    if (sort === 'dateAsc') {
      list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (sort === 'dateDesc') {
      list.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (sort === 'nameAsc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'capacityDesc') {
      list.sort((a, b) => b.maxCapacity - a.maxCapacity);
    }

    return list;
  }, [search, category, sort]);

  return (
    <section className="events-page py-6">
      <div className="container">
        <div className="row">
          <aside className="col-md-3 mb-4">
            <div className="filters-card">
              <h3 className="mb-3">Filters</h3>
              <SearchFilter
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                participants={participants}
                setParticipants={setParticipants}
                showSearch={false}
              />
            </div>
          </aside>

          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="w-75 mx-auto">
                <input
                  aria-label="Search events"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="ms-3">
                <div className="btn-group" role="group" aria-label="Sort options">
                  <button className={`btn btn-sm ${sort === 'dateAsc' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setSort('dateAsc')}>Newest</button>
                  <button className={`btn btn-sm ${sort === 'dateDesc' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setSort('dateDesc')}>Soonest</button>
                  <button className={`btn btn-sm ${sort === 'nameAsc' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setSort('nameAsc')}>A–Z</button>
                  <button className={`btn btn-sm ${sort === 'capacityDesc' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setSort('capacityDesc')}>Capacity</button>
                </div>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {filtered.map(ev => (
                <div className="col" key={ev.id}>
                  <EventCard event={ev} />
                </div>
              ))}
              {filtered.length === 0 && <p>No events match your search.</p>}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
