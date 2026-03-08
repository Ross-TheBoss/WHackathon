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
    latitude: 37.7749,
    longitude: -122.4194,
    groups: ['Adults', 'Beginners'],
    participants: 12,
    rating: 4.0,
    description: `
  Join us for a hands-on introduction to pottery where you'll learn both wheel-throwing and hand-building techniques.

  What to expect:

  - A short demo on centering clay and shaping basic forms
  - Guided practice time with one-on-one feedback
  - Hand-building exercises (pinch pots, coils)
  - All tools and materials provided; just wear clothes you don't mind getting a little clay on

  Suitable for beginners and those who've never touched a wheel before. By the end of the session you'll have at least one small piece to take home and a clear path to continue learning.
  `,
    reviews: [
      { id: 1, author: 'Sarah M.', rating: 5, comment: 'Amazing experience! Lena was very patient and helpful. I made my first bowl and I\'m so proud of it!', date: '2026-02-15' },
      { id: 2, author: 'Mia T.', rating: 4, comment: 'Great intro class. Would recommend for complete beginners.', date: '2026-02-20' },
      { id: 3, author: 'Emma L.', rating: 4, comment: 'Really enjoyed this! The studio is well-equipped and the atmosphere was relaxing.', date: '2026-02-28' }
    ]
  },
  {
    id: '2',
    name: 'Family Yoga',
    author: 'Samir Patel',
    category: 'Health',
    startTime: addHours(now, 24),
    endTime: addHours(now, 25.5),
    location: 'Park Pavilion',
    latitude: 37.7694,
    longitude: -122.4862,
    groups: ['Families', 'All Ages'],
    participants: 40,
    rating: 4.5,
    description: `
  A relaxed, family-friendly yoga session designed for parents and children to move, breathe and play together.

  Highlights:

  - Breathwork and calming exercises for kids
  - Partner stretches and balance games
  - Simple sequences suitable for ages 4 and up

  Please bring a mat for each participant and a small towel. No prior experience required — the instructor will offer gentle progressions and options for all levels.
  `,
    reviews: [
      { id: 4, author: 'Jennifer K.', rating: 5, comment: 'My kids loved it! Samir made it fun and engaging for all ages.', date: '2026-02-10' },
      { id: 5, author: 'Diana R.', rating: 4, comment: 'Great family activity. We\'ll definitely be back!', date: '2026-02-18' }
    ]
  },
  {
    id: '3',
    name: 'Advanced Python Workshop',
    author: 'Dr. Chen',
    category: 'Technology',
    startTime: addHours(now, 48),
    endTime: addHours(now, 52),
    location: 'Tech Hub Lab 3',
    latitude: 37.7813,
    longitude: -122.4056,
    groups: ['Adults', 'Advanced'],
    participants: 20,
    rating: 4.8,
    description: `

  This intensive workshop covers advanced Python topics aimed at professional developers looking to level up their skills.

  Topics covered:

  - **Asynchronous programming** with asyncio and concurrent patterns
  - **Type hints & static analysis** to improve maintainability
  - **Performance profiling & optimization** techniques
  - **Memory management** and common pitfalls

  Participants should be comfortable with Python fundamentals. Bring your laptop, a charged battery, and your favorite editor. We'll provide example code and profiling datasets.
  `,
    reviews: [
      { id: 6, author: 'Alexa P.', rating: 5, comment: 'Excellent workshop! Dr. Chen explained complex concepts clearly. The hands-on exercises were very valuable.', date: '2026-01-25' },
      { id: 7, author: 'Rachel G.', rating: 5, comment: 'Best Python workshop I\'ve attended. Great pace and depth.', date: '2026-01-28' },
      { id: 8, author: 'Tessa H.', rating: 4, comment: 'Very informative. Could have used more time on asyncio but overall great content.', date: '2026-02-05' }
    ]
  },
  {
    id: '4',
    name: 'Beginner Salsa',
    author: 'Elena & Marco',
    category: 'Dance',
    startTime: addHours(now, 72),
    endTime: addHours(now, 74),
    location: 'Studio B',
    latitude: 37.7600,
    longitude: -122.4477,
    groups: ['Adults', 'Couples'],
    participants: 30,
    rating: 4.2,
    description: `
  Get moving with introductory salsa basics — no partner required. This class focuses on rhythm, basic steps, and turning technique.

  What you'll learn:

  - Basic timing and footwork
  - Simple partner patterns (practice solo first)
  - Simple turns and balance drills

  Wear comfortable shoes with a little slide (no thick rubber soles). We'll end with a short social dance practice so you can try moves with others in a friendly environment.
  `,
    reviews: [
      { id: 9, author: 'Lisa M.', rating: 4, comment: 'Fun class! Elena and Marco are great teachers. I felt comfortable as a complete beginner.', date: '2026-02-12' },
      { id: 10, author: 'Carla D.', rating: 4, comment: 'Enjoyed learning the basics. Looking forward to the next level!', date: '2026-02-22' }
    ]
  },
  {
    id: '5',
    name: 'Local History Talk',
    author: 'Historical Society',
    category: 'Talk',
    startTime: addHours(now, 96),
    endTime: addHours(now, 98),
    location: 'Library Main Hall',
    latitude: 37.7786,
    longitude: -122.4216,
    groups: ['All Ages'],
    participants: 100,
    rating: 3.9,
    description: `

  Join the Historical Society for an illustrated talk exploring the town's origins, notable landmarks, and the people who shaped our community.

  Highlights:

  - Rare archival photographs and maps
  - Stories behind key buildings and public spaces
  - Q&A and recommendations for self-guided walking routes

  This talk is suitable for history buffs and curious residents alike. Seating is limited; please arrive early to secure a spot.
  `,
    reviews: [
      { id: 11, author: 'Margaret S.', rating: 4, comment: 'Very informative! Learned so much about our town\'s history.', date: '2026-02-08' },
      { id: 12, author: 'Joanna W.', rating: 3, comment: 'Interesting but could have been more engaging. Still worth attending.', date: '2026-02-14' }
    ]
  }
];

export default events;
