// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — "What is X?" Semantic Dictionary
//  Extracted from brain.js to reduce its context size.
//  Covers ~30 common tech terms for entry-level queries.
// ═══════════════════════════════════════════════════════════

export const WHAT_IS_DICT = {
  // ── Hardware / Devices ────────────────────────────────
  computer:   {
    text: 'A **computer** is a programmable electronic device that processes data — input → process → store → output. Every phone, laptop, and server is a computer.',
    topic: 'computer_basics',
  },
  laptop: {
    text: 'A **laptop** is a portable PC with built-in screen, keyboard, and battery. For devs: aim for 8GB+ RAM, Core i5+ or Ryzen 5+ or Apple M-series, and an SSD.',
    topic: 'computer_basics',
  },
  hardware: {
    text: '**Hardware** = physical parts you can touch — CPU, RAM, SSD, screen, keyboard. The opposite is software (programs + data).',
    topic: 'computer_basics',
  },
  software: {
    text: '**Software** = programs and data that tell hardware what to do. Three layers: OS (Windows/Linux/macOS), applications (VS Code, Chrome), and your own code.',
    topic: 'computer_basics',
  },
  cpu: {
    text: '**CPU** (Central Processing Unit) — the brain that executes every instruction. Speed in GHz. Modern CPUs have multiple cores (4, 8, 16+) for parallel tasks.',
    topic: 'computer_basics',
  },
  processor: {
    text: 'A **processor** (CPU) executes your code. Apple M4, Intel Core i9, AMD Ryzen 9 are processors. Every JS line you write becomes CPU instructions.',
    topic: 'computer_basics',
  },
  ram: {
    text: '**RAM** (Random Access Memory) — short-term working memory. 8GB is minimum for coding; 16GB is comfortable; 32GB+ for Docker/video workloads. Clears on power-off.',
    topic: 'computer_basics',
  },
  gpu: {
    text: '**GPU** (Graphics Processing Unit) — specialised for rendering + AI/ML. NVIDIA GPUs (CUDA) are the standard for machine learning training.',
    topic: 'computer_basics',
  },
  ssd: {
    text: 'An **SSD** (Solid State Drive) — fast permanent storage with no moving parts. Much faster than HDDs. Your OS, code, and files live here. Always code on SSD.',
    topic: 'computer_basics',
  },
  'operating system': {
    text: '**Operating System (OS)** manages your hardware and provides a platform for apps. Big three: **Windows** (most common), **macOS** (dev-popular), **Linux** (servers + Android).',
    topic: 'computer_basics',
  },

  // ── Languages ─────────────────────────────────────────
  python: {
    text: '**Python** — beginner-friendly, readable language used for AI/ML, data science, automation, and backend web dev. Syntax close to plain English. Great first language.',
    topic: 'programming_basics',
  },
  java: {
    text: '**Java** — "write once, run anywhere" compiled language. Popular in enterprise, Android dev, and backend APIs. Widely used in Kenyan banks and telcos.',
    topic: 'programming_basics',
  },
  typescript: {
    text: '**TypeScript** is JavaScript + types — catches errors before your code runs. Major companies use it for large codebases. Learn JS first, then TypeScript.',
    topic: 'javascript',
  },
  php: {
    text: '**PHP** powers ~77% of the web (including WordPress). Still widely used in Kenya for SME websites and Safaricom partner integrations. Laravel is its best framework.',
    topic: 'programming_basics',
  },
  'c++': {
    text: '**C++** — powerful, low-level language for game engines, OS, and high-performance software. Used in competitive programming (ICPC, Codeforces).',
    topic: 'programming_basics',
  },
  rust: {
    text: '**Rust** — modern systems language focused on speed and memory safety. Used by Mozilla, Dropbox, and Web3 projects (Solana is built in Rust).',
    topic: 'programming_basics',
  },
  go: {
    text: '**Go (Golang)** — Google\'s fast, simple language for cloud infrastructure and microservices. Growing fast in Kenyan fintech backends.',
    topic: 'programming_basics',
  },

  // ── Tools / Concepts ──────────────────────────────────
  ide: {
    text: 'An **IDE** (Integrated Development Environment) = code editor with superpowers: autocomplete, debugging, terminal, extensions. **VS Code** is the most popular, and it\'s free → <a href="https://code.visualstudio.com" target="_blank">code.visualstudio.com</a>.',
    topic: 'linux_terminal',
  },
  'vs code': {
    text: '**VS Code** — world\'s most popular code editor (free, fast, extensible). Essential extensions: ESLint, Prettier, GitLens, Thunder Client. → <a href="https://code.visualstudio.com" target="_blank">code.visualstudio.com</a>.',
    topic: 'linux_terminal',
  },
  github: {
    text: '**GitHub** — world\'s largest code hosting platform. Where devs store, share, and collaborate on code using Git. Your GitHub profile IS your dev portfolio. → <a href="https://github.com" target="_blank">github.com</a>.',
    topic: 'git',
  },
  git: {
    text: '**Git** — version control that tracks every code change so you can go back in time, work in teams, and never lose work. The single most important tool devs use daily. → <a href="https://git-scm.com" target="_blank">git-scm.com</a>.',
    topic: 'git',
  },
  database: {
    text: 'A **database** — organised collection of data stored electronically. Two types: **SQL** (structured tables — PostgreSQL, MySQL) and **NoSQL** (flexible documents — MongoDB, Firebase). Every app you build needs one.',
    topic: 'databases',
  },
  'machine learning': {
    text: '**Machine Learning (ML)** — computers learn patterns from data instead of being explicitly programmed. Used in recommendation systems (Netflix, TikTok), fraud detection (M-PESA), and language models (ChatGPT). Python + TensorFlow/PyTorch is the stack.',
    topic: 'ai_ml',
  },
  'artificial intelligence': {
    text: '**AI** — simulation of human intelligence in machines. ML is a subset of AI. Generative AI (ChatGPT, Gemini, Claude) is the newest frontier. The Gemini API gives you AI superpowers in your own apps for free.',
    topic: 'ai_ml',
  },
  token: {
    text: 'In computing, **token** means two things:\n\n• **Auth token** — proves your identity to an API (OAuth, JWT, Daraja access tokens)\n• **AI token** — unit of text LLMs process. ~1 token ≈ 4 characters. API pricing is per 1K tokens.',
    topic: 'what_is_api',
  },
  cache: {
    text: 'A **cache** — temporary storage that saves expensive operation results for fast reuse. Browsers cache websites (faster revisits). Apps cache API responses. Redis is the most popular backend caching tool.',
    topic: 'databases',
  },
  cookie: {
    text: 'A **cookie** — small data stored in your browser by a website. Used for: keeping you logged in (session cookie), remembering preferences, tracking (analytics). View/delete in DevTools → Application tab.',
    topic: 'how_web_works',
  },
  localhost: {
    text: '**Localhost** (127.0.0.1) — your own computer acting as a server. When you run `npm run dev`, your app is at `localhost:3000`. Only you can access it — your private dev environment before deploying.',
    topic: 'how_web_works',
  },
  regex: {
    text: '**Regex** (Regular Expression) — pattern-matching language for text. Used to validate emails, phone numbers, extract data. Example: `/^[0-9]{10}$/` matches any 10-digit number. Test at <a href="https://regexr.com" target="_blank">regexr.com</a>.',
    topic: 'programming_basics',
  },
  'virtual machine': {
    text: 'A **Virtual Machine (VM)** — software emulation of a complete computer. Useful for testing on different OSes, running Linux on Windows, or isolating environments. VirtualBox and VMware are common tools.',
    topic: 'what_is_cloud',
  },
  chatgpt: {
    text: '**ChatGPT** — OpenAI\'s AI chatbot (GPT-4). As a developer, it\'s your pair programmer — great for explaining errors, generating boilerplate, and learning new concepts. → <a href="https://chat.openai.com" target="_blank">chat.openai.com</a>. But always understand the code it gives you!',
    topic: 'ai_ml',
  },
};
