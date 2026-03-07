const now = new Date();
const addHours = (d, h) => new Date(d.getTime() + h * 60 * 60 * 1000).toISOString();

const events = [
  {
    id: '1',
    name: 'Intro to Pottery',
    author: 'Lena Park',
    category: 'Arts & Crafts',
    startTime: now.toISOString(),
    endTime: addHours(now, 2),
    location: 'Community Center Room A',
    groups: ['Adults', 'Beginners'],
    maxCapacity: 12,
    description: '# Intro to Pottery\n\nLearn basic wheel-throwing and hand-building techniques. Materials included.'
  },
  {
    id: '2',
    name: 'Family Yoga',
    author: 'Samir Patel',
    category: 'Health',
    startTime: addHours(now, 24),
    endTime: addHours(now, 25.5),
    location: 'Park Pavilion',
    groups: ['Families', 'All Ages'],
    maxCapacity: 40,
    description: 'A gentle yoga session for parents and kids. Bring mats.'
  },
  {
    id: '3',
    name: 'Advanced Python Workshop',
    author: 'Dr. Chen',
    category: 'Technology',
    startTime: addHours(now, 48),
    endTime: addHours(now, 52),
    location: 'Tech Hub Lab 3',
    groups: ['Adults', 'Advanced'],
    maxCapacity: 20,
    description: '## Topics\n\n- Async programming\n- Type hints\n- Performance profiling'
  },
  {
    id: '4',
    name: 'Beginner Salsa',
    author: 'Elena & Marco',
    category: 'Dance',
    startTime: addHours(now, 72),
    endTime: addHours(now, 74),
    location: 'Studio B',
    groups: ['Adults', 'Couples'],
    maxCapacity: 30,
    description: 'No partner required. Comfortable shoes recommended.'
  },
  {
    id: '5',
    name: 'Local History Talk',
    author: 'Historical Society',
    category: 'Talk',
    startTime: addHours(now, 96),
    endTime: addHours(now, 98),
    location: 'Library Main Hall',
    groups: ['All Ages'],
    maxCapacity: 100,
    description: 'An illustrated talk about the origins of the town and nearby landmarks.'
  }
];

export default events;
