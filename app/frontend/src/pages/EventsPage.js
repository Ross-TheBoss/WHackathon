import React, { useState, useMemo, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import eventsData from '../data/mockEvents';
import EventCard from '../components/EventCard';
import AddEventCard from '../components/AddEventCard';
import SearchFilter from '../components/SearchFilter';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('soonest');
  const [participants, setParticipants] = useState([0, 100]);
  const [userLocation, setUserLocation] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const loadFavoriteIds = () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('favorite_event_ids');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (!navigator || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {
        // silently ignore if user denies or errors
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 5 }
    );
  }, []);

  useEffect(() => {
    setFavoriteIds(loadFavoriteIds());

    const handleFavoritesUpdated = () => {
      setFavoriteIds(loadFavoriteIds());
    };

    window.addEventListener('favorites-updated', handleFavoritesUpdated);
    window.addEventListener('storage', handleFavoritesUpdated);

    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated);
      window.removeEventListener('storage', handleFavoritesUpdated);
    };
  }, []);

  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = eventsData.filter(ev => {
      if (showFavoritesOnly && !favoriteIds.includes(String(ev.id))) return false;
      if (category && ev.category !== category) return false;
      const [minP, maxP] = participants;
      if (minP > 0 && (ev.participants ?? 0) < minP) return false;
      if (maxP < 100 && (ev.participants ?? 0) > maxP) return false;
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
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (sort === 'soonest') {
      list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (sort === 'closest') {
      if (userLocation) {
        list.sort((a, b) => {
          const da = distanceKm(userLocation.latitude, userLocation.longitude, a.latitude ?? 0, a.longitude ?? 0);
          const db = distanceKm(userLocation.latitude, userLocation.longitude, b.latitude ?? 0, b.longitude ?? 0);
          return da - db;
        });
      }
    } else if (sort === 'nameAsc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [search, category, sort, participants, userLocation, showFavoritesOnly, favoriteIds]);

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
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                showSearch={false}
              />
            </div>
          </aside>

          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="w-75 mx-auto">
                <TextField
                  aria-label="Search events"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: 'white' }
                  }}
                />
              </div>

              <div className="ms-3">
                <div className="btn-group" role="group" aria-label="Sort options">
                  <button
                    className="btn btn-sm text-nowrap btn-light border-0 shadow-none"
                    style={sort === 'newest' ? { backgroundColor: '#c5addc', color: 'white' } : {}}
                    onClick={() => setSort('newest')}
                  >Newest</button>
                  <button
                    className="btn btn-sm text-nowrap btn-light border-0 shadow-none"
                    style={sort === 'soonest' ? { backgroundColor: '#c5addc', color: 'white' } : {}}
                    onClick={() => setSort('soonest')}
                  >Soonest</button>
                  <button
                    className="btn btn-sm text-nowrap btn-light border-0 shadow-none"
                    style={sort === 'closest' ? { backgroundColor: '#c5addc', color: 'white' } : {}}
                    onClick={() => setSort('closest')}
                  >Closest</button>
                  <button
                    className="btn btn-sm text-nowrap btn-light border-0 shadow-none"
                    style={sort === 'nameAsc' ? { backgroundColor: '#c5addc', color: 'white' } : {}}
                    onClick={() => setSort('nameAsc')}
                  >A–Z</button>
                </div>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {filtered.map(ev => (
                <div className="col" key={ev.id}>
                  <EventCard event={ev} />
                </div>
              ))}
              {!showFavoritesOnly && (
                <div className="col">
                  <AddEventCard />
                </div>
              )}
              {filtered.length === 0 && <p>No events match your search.</p>}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
