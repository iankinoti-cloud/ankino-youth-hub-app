// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Content Data & Color Palette
// ═══════════════════════════════════════════════════════════

export const COLORS = {
  green:  '#21F1A8',
  neon:   '#5FFFC4',
  gold:   '#A8F7DC',
  orange: '#0DBE83',
  red:    '#053A2C',
  dark:   '#171717',
  darker: '#0E0E0E',
};

// ── Opportunities Data ────────────────────────────────────
export const OPPORTUNITIES = {
  hackathons: [
    {
      title: 'Safaricom API Hackathon 2026',
      tag: 'Hackathon',
      date: 'May 15–17, 2026',
      prize: 'KES 500,000',
      desc: 'Build the next killer app using Safaricom\'s suite of APIs — M-PESA, Bonga Points, IoT, and more.',
      tags: ['APIs', 'Fintech', 'Open to all'],
      color: COLORS.green,
      link: '#',
    },
    {
      title: 'Nairobi GameJam 2026',
      tag: 'Hackathon',
      date: 'June 3–5, 2026',
      prize: 'KES 200,000',
      desc: 'A 48-hour game development marathon for Kenyan creators. Theme revealed at kickoff.',
      tags: ['Gaming', 'Unity', 'Godot', '18–30'],
      color: COLORS.orange,
      link: '#',
    },
    {
      title: 'AfriHack Climate Tech Challenge',
      tag: 'Hackathon',
      date: 'July 20–22, 2026',
      prize: 'USD 10,000',
      desc: 'Solve Africa\'s most pressing climate challenges with tech. Open to East African youth teams.',
      tags: ['ClimaTech', 'AI', 'IoT', 'Teams 2–5'],
      color: COLORS.gold,
      link: '#',
    },
    {
      title: 'M-PESA Fintech Sprint',
      tag: 'Hackathon',
      date: 'Aug 8–9, 2026',
      prize: 'KES 350,000',
      desc: 'Reimagine financial inclusion for the unbanked. Build on M-PESA\'s Daraja API.',
      tags: ['Fintech', 'Daraja', 'Inclusion'],
      color: COLORS.red,
      link: '#',
    },
  ],
  internships: [
    {
      title: 'Safaricom Software Engineering Internship',
      tag: 'Internship',
      date: 'Sep 2026 · 6 months',
      prize: 'Paid · KES 45,000/mo',
      desc: 'Work alongside senior engineers on products used by 40M+ Kenyans. Real code, real impact.',
      tags: ['Engineering', 'Degree students', 'Nairobi'],
      color: COLORS.green,
      link: '#',
    },
    {
      title: 'Decode Creative Residency',
      tag: 'Internship',
      date: 'Oct 2026 · 3 months',
      prize: 'Paid + Mentorship',
      desc: 'A creative tech residency for digital artists, motion designers, and UI/UX innovators.',
      tags: ['Creative', 'Design', 'Content'],
      color: COLORS.gold,
      link: '#',
    },
    {
      title: 'M-PESA Africa Product Intern',
      tag: 'Internship',
      date: 'Sep 2026 · 4 months',
      prize: 'Paid + Equity exposure',
      desc: 'Join the M-PESA Africa team shaping fintech products across 7 countries.',
      tags: ['Product', 'Fintech', 'Pan-Africa'],
      color: COLORS.red,
      link: '#',
    },
    {
      title: 'Safaricom Data Science Fellow',
      tag: 'Internship',
      date: 'Nov 2026 · 6 months',
      prize: 'Paid · KES 55,000/mo',
      desc: 'Build ML models on Africa\'s richest telecoms dataset. Network analytics, fraud detection & more.',
      tags: ['Data Science', 'ML', 'Python'],
      color: COLORS.orange,
      link: '#',
    },
  ],
  scholarships: [
    {
      title: 'Safaricom Youth STEM Scholarship',
      tag: 'Scholarship',
      date: 'Apply by: Jul 1, 2026',
      prize: 'Full tuition + KES 15k/mo',
      desc: 'Full scholarship for university students in Computer Science, Engineering & Data Science across Kenya.',
      tags: ['University', 'STEM', 'Countrywide'],
      color: COLORS.green,
      link: '#',
    },
    {
      title: 'Decode Coding Bootcamp Grant',
      tag: 'Scholarship',
      date: 'Rolling applications',
      prize: 'KES 80,000 grant',
      desc: 'Get funding to attend top coding bootcamps in Nairobi. No degree required. Talent only.',
      tags: ['Bootcamp', '18–28', 'No degree needed'],
      color: COLORS.gold,
      link: '#',
    },
    {
      title: 'She Codes Africa — Safaricom Chapter',
      tag: 'Scholarship',
      date: 'Apply by: Jun 15, 2026',
      prize: 'Full training + mentorship',
      desc: 'Empowering women in tech with free software engineering training, mentorship and job placement.',
      tags: ['Women in Tech', 'Training', 'Job-ready'],
      color: COLORS.red,
      link: '#',
    },
    {
      title: 'ALX Africa — Safaricom Partnership',
      tag: 'Scholarship',
      date: 'Quarterly intake',
      prize: '50% tuition subsidy',
      desc: 'Safaricom-sponsored spots on ALX\'s world-class software engineering programme.',
      tags: ['ALX', 'Software Eng', 'Remote-friendly'],
      color: COLORS.orange,
      link: '#',
    },
  ],
};

// ── Startup Showcase ──────────────────────────────────────
export const STARTUPS = [
  {
    name: 'BodaBridge',
    founder: 'Amani Otieno, 23',
    tagline: 'Connecting boda boda riders to tech-enabled insurance & financing.',
    category: 'FinTech · Mobility',
    raised: 'KES 4.5M seed',
    color: COLORS.green,
    emoji: '🛵',
  },
  {
    name: 'FarmIQ',
    founder: 'Zawadi Muthoni, 25',
    tagline: 'AI-powered crop advisory for smallholder farmers via SMS & WhatsApp.',
    category: 'AgriTech · AI',
    raised: 'KES 2.8M pre-seed',
    color: COLORS.gold,
    emoji: '🌾',
  },
  {
    name: 'MatStream',
    founder: 'Jabari Kamau, 21',
    tagline: 'Live streaming & ticketing platform for Nairobi\'s underground music scene.',
    category: 'Creator Economy',
    raised: 'Bootstrapped',
    color: COLORS.orange,
    emoji: '🎵',
  },
  {
    name: 'MediLink Africa',
    founder: 'Nyambura Waweru, 27',
    tagline: 'Telemedicine connecting rural Kenyans to verified doctors via USSD & app.',
    category: 'HealthTech',
    raised: 'KES 6.2M Series A',
    color: COLORS.red,
    emoji: '🏥',
  },
  {
    name: 'CarbonChain KE',
    founder: 'Baraka Ndung\'u, 24',
    tagline: 'Blockchain-verified carbon credits for Kenyan tree-planting projects.',
    category: 'Climate · Web3',
    raised: 'USD 120K grant',
    color: COLORS.neon,
    emoji: '🌍',
  },
  {
    name: 'PlayKe',
    founder: 'Sifa Achieng, 22',
    tagline: 'African mobile gaming studio — games inspired by Kenyan folklore & culture.',
    category: 'Gaming · Culture',
    raised: 'KES 1.5M pre-seed',
    color: COLORS.orange,
    emoji: '🎮',
  },
];

// ── Events Calendar ───────────────────────────────────────
export const EVENTS = [
  { date: '2026-05-03', title: 'Nairobi Dev Meetup', type: 'meetup',    location: 'iHub, Westlands' },
  { date: '2026-05-10', title: 'Web3 & DeFi Talk',   type: 'talk',      location: 'Strathmore Uni' },
  { date: '2026-05-15', title: 'Safaricom API Hackathon', type: 'hackathon', location: 'Safaricom HQ' },
  { date: '2026-05-16', title: 'Safaricom API Hackathon', type: 'hackathon', location: 'Safaricom HQ' },
  { date: '2026-05-17', title: 'Safaricom API Hackathon', type: 'hackathon', location: 'Safaricom HQ' },
  { date: '2026-05-22', title: 'Femtech Friday',     type: 'workshop',  location: 'Nairobi Garage' },
  { date: '2026-05-28', title: 'AI & ML Workshop',   type: 'workshop',  location: 'Microsoft Africa' },
  { date: '2026-06-03', title: 'GameJam Nairobi',    type: 'hackathon', location: 'KICC' },
  { date: '2026-06-12', title: 'Startup Pitch Night','type': 'pitch',   location: 'Ankino Hub · Online' },
  { date: '2026-06-19', title: 'UI/UX Design Sprint','type': 'workshop', location: 'GrowthAfrica' },
  { date: '2026-06-25', title: 'Cloud Computing Day','type': 'talk',    location: 'Google Nairobi' },
  { date: '2026-07-04', title: 'AfriHack Qualifier', 'type': 'hackathon', location: 'Mombasa' },
  { date: '2026-07-20', title: 'AfriHack Climate Challenge', type: 'hackathon', location: 'Kigali/Virtual' },
];

// ── Chatbot Knowledge Base ────────────────────────────────
export const CHATBOT_KB = {
  greetings: ['hello', 'hi', 'hey', 'habari', 'sema', 'niaje', 'mambo'],
  hackathon:  ['hackathon', 'hack', 'competition', 'challenge', 'code competition', 'build'],
  internship: ['internship', 'intern', 'internships', 'work experience', 'job', 'placement'],
  scholarship:['scholarship', 'scholarship', 'funding', 'bursary', 'grant', 'school', 'study', 'fee'],
  startup:    ['startup', 'start-up', 'business', 'company', 'venture', 'idea', 'pitch'],
  events:     ['event', 'events', 'meetup', 'calendar', 'when', 'upcoming', 'workshop'],
  mpesa:      ['mpesa', 'm-pesa', 'payment', 'daraja', 'api', 'money'],
  gamer:      ['game', 'gamer', 'gaming', 'gamejam', 'gamedev'],
  creator:    ['creator', 'creative', 'design', 'artist', 'content', 'music', 'media'],
  about:      ['about', 'what is', 'decode', 'hub', 'safaricom', 'who are', 'tell me'],
  apply:      ['apply', 'register', 'sign up', 'join', 'how to'],
};

export const CHATBOT_RESPONSES = {
  greetings: [
    'Hey! 👋 Welcome to Ankino Youth Hub. I\'m your AI guide. Ask me about hackathons, internships, scholarships, startups, or upcoming tech events in Kenya!',
    'Niaje! 🔥 I\'m Ankino AI. What opportunity are you looking for today? Hackathon? Internship? Scholarship?',
    'Hello! Ready to decode opportunities? Ask me anything about the hub.',
  ],
  hackathon: [
    '🏆 We have 4 upcoming hackathons:\n\n• **Safaricom API Hackathon** — May 15–17 · KES 500K prize\n• **Nairobi GameJam** — June 3–5 · KES 200K prize\n• **AfriHack Climate Tech** — July 20–22 · USD 10K\n• **M-PESA Fintech Sprint** — Aug 8–9 · KES 350K\n\nScroll to the Opportunities section to apply!',
  ],
  internship: [
    '💼 Current internship openings:\n\n• **Software Engineering Intern** at Safaricom — 6 months, KES 45K/mo\n• **Decode Creative Residency** — 3 months, paid\n• **M-PESA Africa Product Intern** — 4 months\n• **Data Science Fellow** — 6 months, KES 55K/mo\n\nCheck the Opportunities section for how to apply!',
  ],
  scholarship: [
    '🎓 Scholarships available:\n\n• **Safaricom Youth STEM Scholarship** — Full tuition + stipend\n• **Decode Coding Bootcamp Grant** — KES 80K grant\n• **She Codes Africa (Safaricom Chapter)** — Free training for women\n• **ALX Africa Partnership** — 50% tuition subsidy\n\nApply via the Opportunities tab!',
  ],
  startup: [
    '🚀 Our startup showcase features 6 incredible youth-led ventures — from FarmIQ (agritech AI) to PlayKe (African gaming). Want to get your startup featured? Join the next Pitch Night on June 12th!',
  ],
  events: [
    '📅 Upcoming highlights:\n\n• May 3 — Nairobi Dev Meetup (iHub)\n• May 15–17 — Safaricom API Hackathon\n• May 22 — Femtech Friday\n• June 3–5 — GameJam Nairobi\n• June 12 — Startup Pitch Night (Online)\n\nCheck the full calendar section below!',
  ],
  mpesa: [
    '💚 M-PESA\'s Daraja API is at the heart of our fintech hackathons. You can build payment flows, lending apps, and more. The M-PESA Fintech Sprint (Aug 8–9) is specifically for Daraja developers — prize: KES 350K!',
  ],
  gamer: [
    '🎮 Gamers, this is your zone! Check out the **Nairobi GameJam** (June 3–5, KES 200K prize) and **PlayKe** — a Kenyan gaming startup you can draw inspiration from. The hub also runs game dev workshops. What\'s your stack — Unity, Godot, or web?',
  ],
  creator: [
    '🎨 Creators thrive here! The **Decode Creative Residency** is a paid 3-month program for digital artists, motion designers, and UI/UX innovators. Also check out **MatStream** — a startup building for Nairobi\'s music scene!',
  ],
  about: [
    '🌍 **Ankino Youth Hub** is a digital ecosystem built for Kenya\'s next generation — Developers, Creators, Gamers & Startup Founders.\n\nFounded by **ANKINO DEVELOPERS** and powered by Safaricom\'s network, the hub connects youth talent to hackathons, internships, scholarships, startup resources, and Africa\'s most vibrant tech community.',
    '🌱 **Ankino Youth Hub** was built by **ANKINO DEVELOPERS** with a simple mission: give every young Kenyan creator, developer, gamer, and founder a launchpad. Powered by Safaricom\'s infrastructure.',
  ],
  apply: [
    '✅ To apply for any opportunity:\n1. Click the opportunity card in the **Opportunities** section\n2. Fill in the application form\n3. Submit before the deadline\n\nFor general membership, join for free at the top of the page. Need help with a specific application? Tell me which one!',
  ],
  fallback: [
    'Hmm, I\'m not sure about that one. Try asking about: hackathons, internships, scholarships, startups, or events!',
    'I\'m still learning! But I can help with opportunities, events, and startup info. What would you like to know?',
    'That\'s outside my knowledge base right now. For detailed queries, reach out to the Ankino Hub team directly. Want to know about hackathons or internships instead?',
  ],
};
