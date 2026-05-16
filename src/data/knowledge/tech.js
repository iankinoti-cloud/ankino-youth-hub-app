// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Tech Mentorship Knowledge Base
//  Covers: HTML/CSS, JS, React, Git, APIs, Databases,
//          Mobile Dev, UI/UX, Cybersecurity, AI/ML, Learning Paths
// ═══════════════════════════════════════════════════════════

export const TECH_KNOWLEDGE = [

  // ── HTML / CSS ────────────────────────────────────────
  {
    topic: 'html_css',
    label: 'HTML & CSS',
    patterns: [
      'html', 'css', 'html css', 'learn html', 'html basics',
      'css basics', 'flexbox', 'css grid', 'responsive design',
      'how to build website', 'web design', 'html elements',
      'css styling', 'css animations',
    ],
    getResponse: () => ({
      text: `**HTML + CSS** is where every web dev journey begins. Poa! 🌐\n\n**HTML** = Structure (the skeleton)\n**CSS** = Style (the clothes)\n**JavaScript** = Behaviour (the brain)\n\nKey CSS concepts to master:\n• **Flexbox** — for 1D layouts (rows or columns)\n• **CSS Grid** — for 2D layouts (rows AND columns)\n• **Responsive design** — \`@media\` queries + mobile-first approach\n• **CSS Variables** — \`--my-color: #00B140\` for reusable values\n• **Transitions/Animations** — smooth UI without JavaScript\n\n**Learning path:**\n1. html.com or MDN Web Docs (free)\n2. freeCodeCamp HTML/CSS certification\n3. Build a personal portfolio page\n4. Clone a real website (Safaricom, M-PESA homepage)`,
      code: {
        lang: 'css',
        content: `/* Modern CSS starter — Kenyan youth hub style */
:root {
  --green: #00B140;
  --dark: #050d05;
  --text: #e8f5e9;
}

/* Flexbox centering */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--dark);
  color: var(--text);
}

/* CSS Grid card layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Responsive — mobile first */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}`,
      },
      followUps: [
        'What\'s the difference between Flexbox and Grid?',
        'How do I make a website mobile-friendly?',
        'How do I add CSS animations?',
        'What should I learn after HTML/CSS?',
      ],
    }),
  },

  // ── JavaScript ────────────────────────────────────────
  {
    topic: 'javascript',
    label: 'JavaScript',
    patterns: [
      'javascript', 'js', 'learn javascript', 'javascript basics',
      'async await', 'promises', 'fetch api', 'dom manipulation',
      'es6', 'arrow functions', 'destructuring', 'javascript for beginners',
      'nodejs', 'node js', 'node.js basics', 'js tutorial',
    ],
    getResponse: () => ({
      text: `**JavaScript** is the language of the web — and with Node.js, it's the language of the backend too. One language, everywhere. 🔥\n\nMust-know modern JS concepts:\n• **Arrow functions** — \`const fn = (x) => x * 2\`\n• **Destructuring** — \`const { name, age } = user\`\n• **Spread/Rest** — \`const arr = [...a, ...b]\`\n• **Promises & async/await** — for API calls and async operations\n• **Modules** — \`import/export\` (ES Modules)\n• **Array methods** — \`.map()\`, \`.filter()\`, \`.reduce()\`, \`.find()\`\n• **Template literals** — \`\\\`Hello \${name}\\\`\`\n\n**For Kenyan devs:** The most valuable JS skill right now is being able to call the Daraja API from Node.js and handle async responses correctly.`,
      code: {
        lang: 'javascript',
        content: `// Modern JS patterns you need to know

// 1. Async/await for API calls
const fetchOpportunities = async () => {
  try {
    const res = await fetch('https://api.example.com/opportunities');
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch:', err.message);
  }
};

// 2. Destructuring + optional chaining
const { name, email, profile: { city } = {} } = user ?? {};

// 3. Array methods
const hackathons = opportunities
  .filter(o => o.type === 'hackathon')
  .map(o => ({ title: o.title, prize: o.prize }))
  .sort((a, b) => b.prize - a.prize);

// 4. Modules
export const formatKES = (amount) =>
  \`KES \${Number(amount).toLocaleString('en-KE')}\`;`,
      },
      followUps: [
        'What is the difference between async/await and Promises?',
        'How do I call a REST API from JavaScript?',
        'What is Node.js and when do I need it?',
        'How do I learn React after JavaScript?',
      ],
    }),
  },

  // ── React ─────────────────────────────────────────────
  {
    topic: 'react',
    label: 'React',
    patterns: [
      'react', 'reactjs', 'react.js', 'learn react', 'react basics',
      'react hooks', 'usestate', 'useeffect', 'usecallback',
      'components', 'react component', 'props', 'state management',
      'react router', 'context api', 'nextjs', 'next.js', 'vite react',
    ],
    getResponse: () => ({
      text: `**React** is the most in-demand frontend skill in Kenya right now. Every Nairobi tech startup is hiring React devs. 💼\n\nCore concepts in order of importance:\n1. **JSX** — HTML-like syntax inside JavaScript\n2. **Components** — Reusable UI building blocks (think Lego pieces)\n3. **Props** — Passing data into a component\n4. **State (\`useState\`)** — Data that changes over time inside a component\n5. **Effects (\`useEffect\`)** — Side effects: fetch data, subscriptions, timers\n6. **Events** — \`onClick\`, \`onChange\`, \`onSubmit\`\n7. **React Router** — For multi-page apps\n8. **Context / Zustand** — Global state management\n\n**Stack tip:** Vite + React is the fastest way to start in 2026. Skip Create React App.`,
      code: {
        lang: 'jsx',
        content: `// React component — M-PESA payment button
import { useState } from 'react';

function PayButton({ amount, phone, orderId }) {
  const [status, setStatus] = useState('idle');
  // 'idle' | 'loading' | 'sent' | 'error'

  const handlePay = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, phone, orderId }),
      });
      const data = await res.json();
      if (data.ResponseCode === '0') {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <button onClick={handlePay} disabled={status === 'loading'}>
      {status === 'idle'    && \`Pay KES \${amount} via M-PESA\`}
      {status === 'loading' && 'Sending request...'}
      {status === 'sent'    && 'Check your phone for PIN prompt ✓'}
      {status === 'error'   && 'Payment failed. Try again.'}
    </button>
  );
}`,
      },
      followUps: [
        'What is the difference between useState and useEffect?',
        'How do I fetch data in React?',
        'What is Next.js and should I use it?',
        'How do I manage global state in React?',
      ],
    }),
  },

  // ── Git / GitHub ──────────────────────────────────────
  {
    topic: 'git',
    label: 'Git & GitHub',
    patterns: [
      'git', 'github', 'version control', 'git basics', 'git commands',
      'how to use git', 'git commit', 'git push', 'git pull',
      'git branch', 'pull request', 'pr', 'merge', 'git merge',
      'git workflow', 'github actions', 'open source', 'git rebase',
      'gitignore', '.gitignore', 'github for beginners',
    ],
    getResponse: () => ({
      text: `**Git** is non-negotiable. Every serious developer uses it. Every company, every hackathon, every job interview will ask about it. Learn it properly. 💪\n\nEssential commands:\n• \`git init\` — Start tracking a project\n• \`git add .\` — Stage all changes\n• \`git commit -m "message"\` — Save a snapshot\n• \`git push origin main\` — Upload to GitHub\n• \`git pull\` — Get latest changes\n• \`git branch feature-name\` — Create a new branch\n• \`git checkout -b feature-name\` — Create + switch to branch\n• \`git merge feature-name\` — Merge into current branch\n• \`git status\` — See what's changed\n• \`git log --oneline\` — See commit history\n\n**Golden rule:** Never commit sensitive keys/secrets. Always use \`.env\` files and add them to \`.gitignore\`.`,
      code: {
        lang: 'bash',
        content: `# Typical development workflow

# Start a new feature
git checkout -b feature/mpesa-integration

# Work, work, work... then:
git add .
git commit -m "feat: add STK Push integration"

# Push your branch to GitHub
git push origin feature/mpesa-integration
# → Then open a Pull Request on GitHub

# When PR is approved, merge main into your branch first
git checkout main
git pull origin main
git checkout feature/mpesa-integration
git merge main
# Resolve any conflicts, then push again

# .gitignore — what to NEVER commit
# .env
# node_modules/
# .DS_Store
# dist/`,
      },
      followUps: [
        'How do I resolve a merge conflict?',
        'What is a pull request?',
        'How do I contribute to open source on GitHub?',
        'What is GitHub Actions for CI/CD?',
      ],
    }),
  },

  // ── REST APIs ─────────────────────────────────────────
  {
    topic: 'apis',
    label: 'APIs & REST',
    patterns: [
      'api', 'rest api', 'restful', 'http', 'fetch', 'axios',
      'get request', 'post request', 'api endpoints', 'json',
      'build api', 'express api', 'how apis work', 'api design',
      'http methods', 'status codes', 'authentication api',
      'jwt', 'json web token', 'api key', 'headers',
    ],
    getResponse: () => ({
      text: `**APIs** are how apps talk to each other — and the backbone of modern software. Daraja is an API. So is every service you use daily. 🔗\n\n**REST API key concepts:**\n• **Endpoints** — URLs that do specific things: \`GET /users\`, \`POST /payments\`\n• **HTTP Methods** — GET (read), POST (create), PUT/PATCH (update), DELETE (delete)\n• **Status Codes** — \`200\` OK, \`201\` Created, \`400\` Bad Request, \`401\` Unauthorized, \`404\` Not Found, \`500\` Server Error\n• **JSON** — The data format APIs use\n• **Headers** — Metadata: \`Authorization\`, \`Content-Type\`\n• **Authentication** — API Keys, Bearer tokens (OAuth), JWT\n\n**For building APIs in Node.js:** Express.js is the standard. FastAPI (Python) is excellent too.`,
      code: {
        lang: 'javascript',
        content: `// Building a simple REST API with Express
import express from 'express';
const app = express();
app.use(express.json());

// In-memory store (use a real DB in production)
let opportunities = [
  { id: 1, title: 'Safaricom API Hackathon', prize: 500000 },
  { id: 2, title: 'Nairobi GameJam', prize: 200000 },
];

// GET all opportunities
app.get('/api/opportunities', (req, res) => {
  res.json({ success: true, data: opportunities });
});

// GET one by ID
app.get('/api/opportunities/:id', (req, res) => {
  const opp = opportunities.find(o => o.id === Number(req.params.id));
  if (!opp) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data: opp });
});

// POST create new
app.post('/api/opportunities', (req, res) => {
  const { title, prize } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const newOpp = { id: Date.now(), title, prize };
  opportunities.push(newOpp);
  res.status(201).json({ success: true, data: newOpp });
});

app.listen(3000, () => console.log('API running on :3000'));`,
      },
      followUps: [
        'How do I add authentication to my API?',
        'What is JWT and how does it work?',
        'How do I call an API from React?',
        'What is the difference between REST and GraphQL?',
      ],
    }),
  },

  // ── Databases ─────────────────────────────────────────
  {
    topic: 'databases',
    label: 'Databases',
    patterns: [
      'database', 'databases', 'sql', 'nosql', 'mongodb', 'postgresql',
      'mysql', 'sqlite', 'prisma', 'supabase', 'firebase',
      'how to store data', 'data storage', 'crud', 'orm',
      'database design', 'sql vs nosql', 'when to use mongodb',
    ],
    getResponse: () => ({
      text: `Choosing your database is one of the most important early decisions in a project. Here's how to think about it: 🗄️\n\n**SQL (Relational) — PostgreSQL / MySQL / SQLite**\n• Structured data with clear relationships (users → orders → payments)\n• Great for: fintech, e-commerce, anything with transactions\n• Tools: **Prisma** (modern ORM, great DX), **Supabase** (PostgreSQL as a service — free tier)\n\n**NoSQL — MongoDB**\n• Flexible/unstructured data (social feeds, logs, analytics)\n• Great for: apps with rapidly changing data shapes\n• Tools: **Mongoose** (ODM for MongoDB)\n\n**Quick wins (managed services):**\n• **Supabase** — Free PostgreSQL + Auth + File storage. Best for startups\n• **Firebase Firestore** — Real-time NoSQL by Google. Great for mobile apps\n• **PlanetScale** — Serverless MySQL, scales automatically\n\n**Rule of thumb:** If you're building a fintech or M-PESA app, use **PostgreSQL**. Financial data needs ACID transactions.`,
      followUps: [
        'How do I use Supabase with Node.js?',
        'What is an ORM and should I use Prisma?',
        'How do I design a database for a startup?',
        'How do I store M-PESA transaction records?',
      ],
    }),
  },

  // ── Mobile Dev ────────────────────────────────────────
  {
    topic: 'mobile_dev',
    label: 'Mobile Development',
    patterns: [
      'mobile', 'mobile app', 'android', 'ios', 'flutter', 'react native',
      'mobile development', 'build app', 'app development',
      'kotlin', 'swift', 'flutter vs react native',
      'mobile app kenya', 'playstore', 'app store',
      'cross platform', 'mobile ui',
    ],
    getResponse: () => ({
      text: `For Kenyan youth building mobile apps, here's the honest guide: 📱\n\n**Flutter (Recommended for Kenya)**\n• Made by Google, builds iOS + Android from one codebase\n• Dart language (easy to learn if you know JS)\n• M-PESA Flutter packages exist (mpesa_stk_flutter)\n• Best performance, beautiful UI by default\n• Huge demand in Nairobi job market\n\n**React Native**\n• If you already know React/JavaScript — huge advantage\n• Meta-maintained, large ecosystem\n• Slightly more complex setup than Flutter\n• Great for startups that need a web + mobile team\n\n**Android (Kotlin) / iOS (Swift)**\n• Only if you're going native (best performance, platform-specific features)\n• Higher learning curve, separate codebases\n\n**For most Kenyan startups:** Flutter is the pragmatic choice — one team, one codebase, Android + iOS, great M-PESA integration.`,
      followUps: [
        'How do I integrate M-PESA into a Flutter app?',
        'How do I publish an app to the Play Store?',
        'Should I build web first or mobile first?',
        'What is a PWA and is it good for Kenya?',
      ],
    }),
  },

  // ── UI/UX ─────────────────────────────────────────────
  {
    topic: 'ui_ux',
    label: 'UI/UX Design',
    patterns: [
      'ui', 'ux', 'ui ux', 'design', 'figma', 'user experience',
      'user interface', 'wireframe', 'prototype', 'design system',
      'usability', 'user research', 'ux design', 'ui design',
      'how to design app', 'color palette', 'typography',
      'design principles', 'accessibility',
    ],
    getResponse: () => ({
      text: `**Good design is a competitive advantage** — especially in Kenya where most apps have terrible UX. If you can code AND design, you're twice as valuable. 🎨\n\n**Core UI/UX principles:**\n• **Hierarchy** — Guide the user's eye. Most important things are biggest/boldest.\n• **Consistency** — Same colors, spacing, components throughout\n• **Feedback** — Every action needs a response (loading states, success, error)\n• **Mobile-first** — 90%+ of Kenyans access the web on mobile\n• **Accessibility** — Contrast ratios, font sizes, touch target sizes (min 44px)\n• **Speed perception** — Skeleton loaders > blank screens\n\n**Tools:**\n• **Figma** — Industry standard, free for individuals. Start here.\n• **FigJam** — Whiteboarding and user journey mapping\n• **Coolors.co** — Color palette generator\n• **Google Fonts** — Free typography\n\n**For Kenyan apps:** Design for low-bandwidth, bright sunlight readability, and one-handed use.`,
      followUps: [
        'How do I learn Figma from scratch?',
        'What makes a good mobile UI for Kenya?',
        'What is a design system?',
        'How do I do user research on a budget?',
      ],
    }),
  },

  // ── Cybersecurity ─────────────────────────────────────
  {
    topic: 'cybersecurity',
    label: 'Cybersecurity Basics',
    patterns: [
      'security', 'cybersecurity', 'cyber security', 'hacking', 'secure app',
      'xss', 'sql injection', 'owasp', 'https', 'ssl', 'authentication',
      'authorization', 'password hashing', 'jwt security', 'api security',
      'protect my app', 'data breach', 'vulnerability',
    ],
    getResponse: () => ({
      text: `Security isn't optional — especially when your app handles M-PESA money. Here are the essentials: 🔒\n\n**OWASP Top 10 — things that will get you hacked:**\n1. **Injection (SQL/NoSQL)** — Never build queries with raw user input. Use parameterized queries/ORMs.\n2. **Broken Authentication** — Use bcrypt for passwords, expire tokens, implement rate limiting\n3. **XSS (Cross-Site Scripting)** — Never use \`innerHTML\` with user data. Sanitize everything.\n4. **Insecure Direct Object Reference** — Check \`userId === resource.ownerId\` before serving data\n5. **Sensitive Data Exposure** — Never log passwords/tokens, always use HTTPS\n6. **Broken Access Control** — Verify permissions on every backend endpoint, not just the frontend\n\n**Daraja-specific security:**\n• Store Consumer Key/Secret in \`.env\`, never in code\n• Validate that callbacks come from Safaricom IPs\n• Log every transaction to a tamper-evident audit trail\n• Use HTTPS-only for your CallbackURL`,
      code: {
        lang: 'javascript',
        content: `// Security essentials — Node.js

// 1. Password hashing (never store plaintext!)
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(plainPassword, 12);
const valid = await bcrypt.compare(plainPassword, hash);

// 2. Parameterized queries (prevent SQL injection)
// ❌ WRONG — injectable!
// db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
// ✅ CORRECT — parameterized
await db.query('SELECT * FROM users WHERE email = $1', [email]);

// 3. Sanitize user input for HTML contexts
// npm install dompurify (frontend) or sanitize-html (backend)
import sanitizeHtml from 'sanitize-html';
const safe = sanitizeHtml(userInput, { allowedTags: [] });

// 4. Rate limiting (prevent brute force)
import rateLimit from 'express-rate-limit';
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts
  message: 'Too many attempts',
}));

// 5. Environment variables — never hardcode!
const SECRET = process.env.JWT_SECRET; // ✅
// const SECRET = 'mypassword123';     // ❌`,
      },
      followUps: [
        'How do I implement JWT authentication?',
        'How do I secure my Daraja credentials?',
        'What is HTTPS and do I need it?',
        'How do I protect my API from bots?',
      ],
    }),
  },

  // ── AI / ML Basics ────────────────────────────────────
  {
    topic: 'ai_ml',
    label: 'AI & Machine Learning Basics',
    patterns: [
      'ai', 'ml', 'machine learning', 'artificial intelligence',
      'ai basics', 'deep learning', 'neural network', 'llm',
      'chatgpt api', 'gemini api', 'openai', 'python ml',
      'tensorflow', 'pytorch', 'scikit-learn', 'ai for beginners',
      'natural language processing', 'nlp', 'computer vision',
      'ai tools', 'build ai app', 'ai startup',
    ],
    getResponse: () => ({
      text: `AI is the biggest opportunity for Kenyan youth right now — especially applying it to local problems. Here's your roadmap: 🤖\n\n**AI Concepts to understand:**\n• **Machine Learning** — Systems that learn patterns from data instead of being explicitly programmed\n• **LLMs (Large Language Models)** — GPT-4, Gemini, Claude — they power AI chat\n• **Supervised Learning** — Train on labeled data (spam filter, loan default prediction)\n• **Computer Vision** — AI that understands images (crop disease detection, ID verification)\n• **NLP** — AI that understands text (Swahili, Sheng, customer service bots)\n\n**Practical AI for Kenyan startups:**\n• **Gemini API (Google)** — Free tier, excellent for Swahili + English\n• **OpenAI API** — Best quality, paid\n• **Hugging Face** — Open-source models, free to use\n\n**Start here:** Python → NumPy → Pandas → scikit-learn → then specialize\n\n**High-impact Kenyan AI ideas:** Swahili NLP, agricultural yield prediction, M-PESA fraud detection, USSD AI assistant`,
      code: {
        lang: 'javascript',
        content: `// AI chatbot using Gemini API (Node.js)
// npm install @google/generative-ai

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: \`You are Ankino AI, a tech mentor and 
    Safaricom ecosystem guide for Kenyan youth. You help with
    coding, startups, M-PESA integration, and opportunities.\`,
});

const chat = model.startChat({ history: [] });

export const askAI = async (userMessage) => {
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};

// Usage in Express
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const reply = await askAI(message);
  res.json({ reply });
});`,
      },
      followUps: [
        'How do I get a free Gemini API key?',
        'How do I make an AI app with Python?',
        'What AI problems can I solve for Kenya?',
        'What is prompt engineering?',
      ],
    }),
  },

  // ── Learning Paths ────────────────────────────────────
  {
    topic: 'learning_path',
    label: 'Learning Paths',
    patterns: [
      'how to learn coding', 'where to start', 'beginner',
      'learning path', 'roadmap', 'how to become developer',
      'self taught', 'what to learn first', 'programming for beginners',
      'coding from scratch', 'learn to code kenya', 'bootcamp',
      'how long to learn', 'resources', 'free courses', 'syllabus',
    ],
    getResponse: () => ({
      text: `Here's your **complete roadmap** — Kenyan dev edition. Sawa? Let's build. 🗺️\n\n**Track 1: Web Developer (3–6 months)**\nHTML/CSS → JavaScript → Git/GitHub → Node.js/Express → MongoDB or PostgreSQL → React → Deploy on Vercel/Railway\n\n**Track 2: Mobile Developer (4–6 months)**\nJavaScript → Dart basics → Flutter → M-PESA integration → Firebase → Publish on Play Store\n\n**Track 3: Fintech/M-PESA Builder (add-on, 2–4 weeks)**\nNode.js + Express → Daraja OAuth → STK Push → Callbacks → Database storage → Go live\n\n**Track 4: AI/Data Science (6–12 months)**\nPython → NumPy/Pandas → Visualization → scikit-learn → TensorFlow or PyTorch → Deploy ML model\n\n**Free resources:**\n• **The Odin Project** (theop.org) — Best free full-stack curriculum\n• **freeCodeCamp** — Great for HTML/CSS/JS certifications\n• **CS50** (Harvard) — cs50.harvard.edu — Free, world-class intro to CS\n• **Daraja docs** — developer.safaricom.co.ke\n• **YouTube:** Traversy Media, Fireship, Kevin Powell (CSS)`,
      followUps: [
        'What is the fastest path to getting a job in Kenya?',
        'What projects should I build for my portfolio?',
        'Should I do a bootcamp or self-study?',
        'What programming language should I start with?',
      ],
    }),
  },

  // ── Project Ideas ─────────────────────────────────────
  {
    topic: 'projects',
    label: 'Project Ideas for Kenyan Devs',
    patterns: [
      'project ideas', 'what to build', 'build project', 'portfolio project',
      'ideas for app', 'kenya project', 'startup idea', 'app idea',
      'what project should i build', 'kenyan app ideas', 'hackathon ideas',
      'side project', 'build something useful',
    ],
    getResponse: () => ({
      text: `Build things that solve **real Kenyan problems** — that's your biggest edge as a Kenyan developer. 💡\n\n**Beginner projects (build these first):**\n1. Personal portfolio website with your skills + GitHub projects\n2. M-PESA payment calculator (practice JS)\n3. Nairobi matatu route lookup (practice APIs + mapping)\n4. Simple CRUD app with a Supabase database\n\n**Intermediate (hackathon-ready):**\n5. Marketplace for local artisans with M-PESA checkout\n6. USSD app for farming tips or market prices\n7. Real-time job board for Nairobi tech companies\n8. Event booking system with M-PESA payment + SMS confirmation\n\n**Advanced (startup-worthy):**\n9. Boda boda rider insurance micro-premium collector (M-PESA + recurring billing)\n10. AI crop advisory via SMS/WhatsApp (Twilio/AT + ML model)\n11. Salary advance platform for gig workers (Daraja B2C + KYC)\n12. Campus food delivery with M-PESA split payments\n\n**Rule:** Build something you'd actually use. Then show it at the next hackathon!`,
      followUps: [
        'How do I add M-PESA to a marketplace?',
        'What APIs are free to use for projects?',
        'How do I deploy my project online for free?',
        'How do I turn a project into a startup?',
      ],
    }),
  },

  // ── Deployment ────────────────────────────────────────
  {
    topic: 'deployment',
    label: 'Deploying Your App',
    patterns: [
      'deploy', 'deployment', 'hosting', 'vercel', 'railway',
      'netlify', 'heroku', 'vps', 'digitalocean', 'aws',
      'how to deploy', 'put app online', 'domain', 'domain name',
      'free hosting', 'host backend', 'deploy react', 'deploy node',
    ],
    getResponse: () => ({
      text: `Deploying your app — the 2026 way. Zero excuses. 🚀\n\n**Frontend (React, HTML/CSS):**\n• **Vercel** — Free, instant, auto-deploys from GitHub. Best for Next.js + React\n• **Netlify** — Similar to Vercel, great drag-and-drop deployment\n• **GitHub Pages** — Free static site hosting\n\n**Backend (Node.js, Python APIs):**\n• **Railway** — Free tier, deploy any backend from GitHub in minutes\n• **Render** — Free tier backend hosting\n• **Fly.io** — More advanced, generous free tier\n\n**Database:**\n• **Supabase** — Free PostgreSQL (500MB)\n• **MongoDB Atlas** — Free NoSQL (512MB)\n\n**Full-stack setup (recommended for startups):**\nFrontend on Vercel + Backend on Railway + Database on Supabase = **completely free** until you get real users\n\n**Domain names:** Kenyan \`.co.ke\` domains from Truehost (~KES 800/year)`,
      followUps: [
        'How do I set up a custom domain?',
        'How do I set environment variables on Railway?',
        'How do I make my Daraja callback URL public?',
        'When do I need to pay for hosting?',
      ],
    }),
  },

  // ── General Greeting / Intro ───────────────────────────
  {
    topic: 'greeting',
    label: 'Greeting',
    patterns: [
      'hello', 'hi', 'hey', 'habari', 'niaje', 'sema', 'mambo', 'vipi',
      'good morning', 'good afternoon', 'what can you do',
      'what do you know', 'help me', 'where do i start',
    ],
    getResponse: () => ({
      text: `Niaje! 👋 I'm **Ankino AI** — your tech mentor and Safaricom ecosystem guide.\n\nI can help you with:\n\n• **Safaricom APIs** — Daraja, STK Push, M-PESA integration, C2B, B2C, OAuth\n• **Tech skills** — HTML/CSS, JavaScript, React, Git, APIs, Databases, Flutter, UI/UX\n• **Security** — Securing your app and Daraja credentials\n• **AI/ML** — Getting started with AI and building AI-powered apps\n• **Opportunities** — Hackathons, internships, scholarships at the Hub\n• **Startups** — How to build and launch your idea in Kenya\n\nWhat are we learning today? Ask me anything! 🔥`,
      followUps: [
        'How do I integrate M-PESA?',
        'What should I learn first as a beginner?',
        'Tell me about Daraja API',
        'Show me upcoming hackathons',
      ],
    }),
  },

];
