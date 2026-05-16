// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Common Tech Knowledge Base
//  Covers: Programming basics, Web concepts, JSON, DevOps,
//          Cloud, Linux/Terminal, Open Source, Blockchain,
//          How the internet works, IDEs & tools
//  For "what is X?" type questions — entry-level friendly
// ═══════════════════════════════════════════════════════════

export const COMMON_KNOWLEDGE = [

  // ── Programming Basics ─────────────────────────────────
  {
    topic: 'programming_basics',
    label: 'Programming Fundamentals',
    patterns: [
      'what is programming', 'what is coding', 'how to code',
      'what is a variable', 'what is a function', 'what is a loop',
      'what is an algorithm', 'what is a class', 'what is an object',
      'programming basics', 'coding basics', 'learn to code',
      'what is a string', 'what is an array', 'what is a boolean',
      'what is a condition', 'if statement', 'what is a method',
      'programming concepts', 'coding for beginners', 'start coding',
    ],
    getResponse: () => ({
      text: `Coding is just giving instructions to a computer in a language it understands. Let's break down the core concepts:\n\n**Variables** — containers that store data\n\`const name = "Ian"\` — name now holds the value "Ian"\n\n**Functions** — reusable blocks of instructions\n\`function greet(name) { return "Hello " + name; }\`\n\n**Conditionals** — make decisions\n\`if (age >= 18) { allow() } else { deny() }\`\n\n**Loops** — repeat something many times\n\`for (let i = 0; i < 5; i++) { console.log(i); }\`\n\n**Arrays** — a list of values\n\`const devs = ["Alice", "Brian", "Cynthia"]\`\n\n**Objects** — group related data together\n\`const user = { name: "Ian", age: 22, city: "Nairobi" }\`\n\n**Classes** — blueprints for creating objects (OOP)\n\nEvery programming language uses these same ideas — just with slightly different syntax. Master these in one language and you can learn any other in weeks. 🔑`,
      code: {
        lang: 'javascript',
        content: `// The 6 core concepts in one example
const city = "Nairobi";           // Variable

function greet(name) {            // Function
  return \`Niaje, \${name}!\`;
}

const devs = ["Ian", "Aisha"];    // Array

for (const dev of devs) {        // Loop
  if (dev === "Ian") {           // Conditional
    console.log(greet(dev));
  }
}

const user = {                    // Object
  name: "Ian",
  city: city,
  role: "developer",
};`,
      },
      followUps: [
        'Teach me JavaScript basics',
        'What is object-oriented programming?',
        'What learning path should I follow?',
        'What is the difference between frontend and backend?',
      ],
    }),
  },

  // ── How the Web Works ──────────────────────────────────
  {
    topic: 'how_web_works',
    label: 'How the Web Works',
    patterns: [
      'how does the web work', 'how does the internet work',
      'what is http', 'what is https', 'what is a browser',
      'what is a server', 'what is a client', 'client server',
      'what is a url', 'what is dns', 'how websites work',
      'what is a request', 'what is a response', 'how web works',
      'what happens when you visit a website', 'frontend backend difference',
      'what is a web server', 'what is hosting',
    ],
    getResponse: () => ({
      text: `Great question — understanding this makes everything else click. Here's what happens when you type a URL and hit Enter:\n\n**1. DNS Lookup**\nYour browser asks: *"What's the IP address for google.com?"*\nDNS (like the internet's phonebook) replies: *"It's 142.250.80.46"*\n\n**2. TCP Connection**\nYour browser connects to that IP address — like dialling a phone number\n\n**3. HTTP Request**\nYour browser sends a message:\n\`GET /search?q=daraja HTTP/1.1\`\nThis means: *"Please give me this page"*\n\n**4. Server Response**\nThe server sends back HTML, CSS, and JavaScript files — the building blocks of the page\n\n**5. Browser Renders**\nYour browser reads the HTML and draws the page you see\n\n**Key terms:**\n• **HTTP/HTTPS** — the language browsers and servers speak (S = encrypted)\n• **Frontend** — everything the user sees (HTML, CSS, JS in the browser)\n• **Backend** — server logic, databases, business rules\n• **API** — the bridge between frontend and backend\n• **Hosting** — a server that stores your website's files (Vercel, Netlify, AWS)\n\nEvery website you've ever used runs on this exact flow. 🌍`,
      followUps: [
        'What is an API?',
        'What is frontend vs backend?',
        'How do I host my website?',
        'What is HTTP vs HTTPS?',
      ],
    }),
  },

  // ── What is an API ─────────────────────────────────────
  {
    topic: 'what_is_api',
    label: 'What is an API?',
    patterns: [
      'what is an api', 'what is api', 'explain api',
      'what does api stand for', 'api meaning', 'api definition',
      'what is rest api', 'what is a rest api', 'what is restful',
      'how do apis work', 'api for beginners', 'api explained',
      'what is an endpoint', 'what is a request', 'what is json api',
      'what is graphql', 'soap vs rest',
    ],
    getResponse: () => ({
      text: `An **API** (Application Programming Interface) is a set of rules that lets two pieces of software talk to each other. Think of it like a waiter in a restaurant:\n\n• **You** = the frontend (client app)\n• **The kitchen** = the backend / database\n• **The waiter** = the API\n\nYou tell the waiter what you want → the waiter goes to the kitchen → brings back what you ordered. You never go into the kitchen yourself.\n\n**Real example:** When you tap "Pay with M-PESA" in an app:\n1. Your app sends an API request to Safaricom's Daraja API\n2. Daraja processes the payment\n3. Daraja sends back a response: "Payment successful"\n4. Your app shows you the confirmation\n\n**Types of APIs:**\n• **REST API** — most common, uses HTTP (GET, POST, PUT, DELETE)\n• **GraphQL** — flexible, you ask for exactly what you need\n• **WebSocket** — real-time, stays connected (live chat, live scores)\n\n**HTTP Methods you'll use most:**\n• \`GET\` — fetch data\n• \`POST\` — send/create data\n• \`PUT/PATCH\` — update data\n• \`DELETE\` — remove data`,
      code: {
        lang: 'javascript',
        content: `// Fetching data from a REST API
async function getUserData(userId) {
  const response = await fetch(
    \`https://api.example.com/users/\${userId}\`,
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) throw new Error('Request failed');

  const data = await response.json();
  console.log(data); // { id: 1, name: "Ian", city: "Nairobi" }
  return data;
}`,
      },
      followUps: [
        'How do I use APIs in JavaScript?',
        'What is the Daraja API?',
        'What is JSON?',
        'How do I handle API errors?',
      ],
    }),
  },

  // ── What is JSON ───────────────────────────────────────
  {
    topic: 'what_is_json',
    label: 'What is JSON?',
    patterns: [
      'what is json', 'json explained', 'json format', 'json meaning',
      'what does json stand for', 'json tutorial', 'json basics',
      'json vs xml', 'what is xml', 'data format', 'json parse',
      'json stringify', 'read json', 'json object', 'json array',
      'how to use json', 'what is a json file',
    ],
    getResponse: () => ({
      text: `**JSON** (JavaScript Object Notation) is the universal language of data on the internet. When apps talk to each other via APIs, they almost always send and receive JSON.\n\nIt's just text formatted as key-value pairs — easy to read for humans AND machines:\n\n**JSON Rules:**\n• Keys must be in double quotes\n• Values can be: string, number, boolean, array, object, or null\n• No trailing commas\n• No comments\n\n**In JavaScript:**\n• \`JSON.parse()\` — converts JSON text → JavaScript object (use when you *receive* data)\n• \`JSON.stringify()\` — converts JavaScript object → JSON text (use when you *send* data)\n\n**Where you'll see it:**\n• API responses from Daraja, Firebase, any backend\n• \`package.json\` — your project's config file\n• \`localStorage\` data\n• Config files (VSCode settings, Vercel config)`,
      code: {
        lang: 'javascript',
        content: `// What JSON looks like
const jsonText = '{"name":"Ian","age":22,"city":"Nairobi","skills":["JS","React"]}';

// Parse JSON string → JavaScript object
const user = JSON.parse(jsonText);
console.log(user.name);    // "Ian"
console.log(user.skills);  // ["JS", "React"]

// Stringify JavaScript object → JSON string (for sending via API)
const payload = {
  phone: "254712345678",
  amount: 100,
};
const body = JSON.stringify(payload);
// '{"phone":"254712345678","amount":100}'

// Use in fetch
fetch('/api/pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});`,
      },
      followUps: [
        'What is an API?',
        'How do I fetch data from an API?',
        'What is a database?',
        'Teach me JavaScript async/await',
      ],
    }),
  },

  // ── Frontend vs Backend ────────────────────────────────
  {
    topic: 'frontend_vs_backend',
    label: 'Frontend vs Backend',
    patterns: [
      'frontend vs backend', 'frontend or backend', 'what is frontend',
      'what is backend', 'what is fullstack', 'full stack developer',
      'full-stack', 'frontend developer', 'backend developer',
      'difference between frontend and backend', 'which to learn first',
      'what is a web developer', 'frontend backend fullstack',
      'should i learn frontend or backend',
    ],
    getResponse: () => ({
      text: `One of the most common questions — here's the honest breakdown:\n\n**Frontend** — what users see and interact with\n• Languages: HTML, CSS, JavaScript\n• Frameworks: React, Vue, Svelte\n• Job: UI, animations, forms, responsiveness, speed\n• You work in the **browser**\n\n**Backend** — the engine behind the scenes\n• Languages: Node.js, Python, Go, Java, PHP\n• Tools: Express, FastAPI, PostgreSQL, Firebase, Redis\n• Job: APIs, databases, authentication, business logic, payments\n• You work on **servers**\n\n**Full-stack** — does both\n• Most Kenyan startups want full-stack devs (smaller teams, more hats)\n• Typical Kenya stack: React + Node.js + PostgreSQL or Firebase\n\n**Which should you learn first?**\nStart with **Frontend** — you see results immediately (visual feedback keeps motivation high). Once you're comfortable with JavaScript, the backend is a natural next step.\n\n**Kenyan market demand (2026):**\n• Full-stack React/Node — highest demand\n• Mobile (Flutter) — growing fast\n• Backend Python/Go — corporate sector (banks, telcos)\n• Pure frontend — good entry point but combine with backend to stand out`,
      followUps: [
        'Teach me JavaScript',
        'Teach me React',
        'What is Node.js?',
        'What career path should I follow?',
      ],
    }),
  },

  // ── What is the Cloud ──────────────────────────────────
  {
    topic: 'what_is_cloud',
    label: 'Cloud Computing',
    patterns: [
      'what is the cloud', 'cloud computing', 'what is aws', 'what is gcp',
      'what is azure', 'what is firebase', 'cloud hosting',
      'what is serverless', 'what is a vps', 'what is a server',
      'cloud vs local', 'why use the cloud', 'cloud explained',
      'what is heroku', 'what is vercel', 'what is netlify',
      'deploy to cloud', 'cloud storage', 'cloud database',
    ],
    getResponse: () => ({
      text: `**The cloud** just means "someone else's computer" — servers you rent over the internet instead of buying your own hardware.\n\n**Main cloud providers:**\n• <a href="https://aws.amazon.com" target="_blank">**AWS (Amazon)**</a> — largest, most features, steep learning curve\n• <a href="https://cloud.google.com" target="_blank">**Google Cloud (GCP)**</a> — great AI/ML tools, good free tier\n• <a href="https://azure.microsoft.com" target="_blank">**Microsoft Azure**</a> — dominant in corporate Kenya (banks, government)\n• <a href="https://firebase.google.com" target="_blank">**Firebase (Google)**</a> — easiest for beginners, real-time database + auth\n\n**Beginner-friendly deploy platforms (start here):**\n• <a href="https://vercel.com" target="_blank">**Vercel**</a> — best for React/Next.js, free tier, automatic deploys\n• <a href="https://netlify.com" target="_blank">**Netlify**</a> — great for static sites and JAMstack\n• <a href="https://railway.app" target="_blank">**Railway**</a> — easy backend + database hosting\n• <a href="https://render.com" target="_blank">**Render**</a> — free Node.js hosting, good Postgres support\n\n**What is serverless?**\nYou write a function, deploy it, and pay only when it runs. No managing servers. AWS Lambda, Vercel Functions, Netlify Functions all do this.\n\n**For Kenyan devs:** Firebase is the fastest path to a working backend — real-time DB, authentication, and hosting all in one. Start there before jumping to AWS.`,
      followUps: [
        'How do I deploy my app for free?',
        'What is Firebase?',
        'What is serverless?',
        'How do I host a Node.js backend?',
      ],
    }),
  },

  // ── Linux & Terminal ───────────────────────────────────
  {
    topic: 'linux_terminal',
    label: 'Linux & The Terminal',
    patterns: [
      'what is linux', 'linux basics', 'linux commands', 'terminal',
      'command line', 'what is bash', 'what is the terminal',
      'command line basics', 'how to use terminal', 'linux tutorial',
      'what is ubuntu', 'what is a shell', 'terminal commands',
      'what is a cli', 'cli vs gui', 'how to use command line',
      'basic linux commands', 'navigate terminal', 'what is npm',
    ],
    getResponse: () => ({
      text: `The terminal is one of the most powerful tools in a developer's kit — and it looks scary but becomes natural fast. Here's the essential guide:\n\n**Why learn it?**\n• Run dev servers (\`npm run dev\`)\n• Use Git (\`git commit\`, \`git push\`)\n• Install packages (\`npm install\`, \`pip install\`)\n• Deploy apps, manage servers, automate repetitive tasks\n\n**Most-used commands:**\n\`pwd\` → print current directory (where am I?)\n\`ls\` → list files in current folder\n\`cd foldername\` → go into a folder\n\`cd ..\` → go back one level\n\`mkdir myproject\` → create a folder\n\`touch index.html\` → create a file\n\`rm filename\` → delete a file\n\`cat filename\` → read a file's contents\n\`clear\` → clean up the screen\n\n**What is Linux?**\nAn open-source operating system that powers most of the world's servers, Android phones, and developer machines. Ubuntu is the most popular version for developers.\n\n**Windows users:** Install <a href="https://docs.microsoft.com/en-us/windows/wsl/" target="_blank">WSL (Windows Subsystem for Linux)</a> — gives you a full Linux terminal inside Windows. Most Kenyan dev environments use this.`,
      code: {
        lang: 'bash',
        content: `# Navigate and set up a new project from terminal
pwd                        # see where you are
cd Desktop                 # go to Desktop
mkdir my-project           # create project folder
cd my-project              # enter it
touch index.html style.css # create files
ls                         # confirm files exist

# Start a Node project
npm init -y                # creates package.json
npm install express        # install a package
node index.js              # run your file

# Git workflow
git init                   # start git tracking
git add .                  # stage all changes
git commit -m "first commit"
git push origin main`,
      },
      followUps: [
        'Teach me Git basics',
        'What is npm?',
        'How do I set up a dev environment?',
        'What is open source?',
      ],
    }),
  },

  // ── DevOps Basics ─────────────────────────────────────
  {
    topic: 'devops_basics',
    label: 'DevOps & CI/CD',
    patterns: [
      'what is devops', 'devops basics', 'devops explained',
      'what is ci cd', 'what is ci/cd', 'continuous integration',
      'continuous deployment', 'what is docker', 'what is kubernetes',
      'what is a pipeline', 'github actions', 'devops tools',
      'what is jenkins', 'deploy automatically', 'what is infrastructure',
      'devops kenya', 'devops career', 'should i learn devops',
    ],
    getResponse: () => ({
      text: `**DevOps** is the practice of combining software development (Dev) and IT operations (Ops) to ship software faster and more reliably.\n\nIn plain English: DevOps is about **automating** the process of testing, building, and deploying your code so you don't have to do it manually every time.\n\n**Core concepts:**\n\n• **CI (Continuous Integration)** — Every time you push code, it's automatically tested. If tests fail, you know immediately.\n• **CD (Continuous Deployment)** — After tests pass, code is automatically deployed to production. No manual uploads.\n• **Docker** — Packages your app + its environment into a "container" that runs identically everywhere. No more "works on my machine" 😅\n• **Kubernetes** — Manages many Docker containers at scale (used by big companies)\n• **GitHub Actions** — Free CI/CD built into GitHub — easiest starting point\n\n**Beginner DevOps path:**\n1. Learn Git properly (branches, PRs, merges)\n2. Set up GitHub Actions to run tests automatically\n3. Deploy to Vercel/Railway on every push\n4. Learn Docker basics\n5. Then explore AWS/GCP if scaling up\n\n**Why it matters in Kenya:** Startups like Twiga and Safaricom run dozens of microservices. DevOps engineers who can manage this infrastructure earn some of the highest salaries in Kenyan tech (KES 200K–500K/mo). 📈`,
      followUps: [
        'How do I set up GitHub Actions?',
        'What is Docker?',
        'Teach me Git',
        'What are the highest paying tech roles in Kenya?',
      ],
    }),
  },

  // ── Open Source ────────────────────────────────────────
  {
    topic: 'open_source',
    label: 'Open Source',
    patterns: [
      'what is open source', 'open source explained', 'contribute to open source',
      'how to contribute to github', 'open source projects', 'github contribution',
      'what is a pull request', 'what is a fork', 'git fork',
      'open source kenya', 'contribute to open source as beginner',
      'what is mit license', 'what is a license', 'free software',
      'what is a contributor', 'how to contribute',
    ],
    getResponse: () => ({
      text: `**Open source** means the code is publicly available — anyone can read it, use it, and contribute improvements. The software you use every day (Linux, React, VS Code, Firefox) is open source.\n\n**Why it matters for you as a Kenyan dev:**\n• **Portfolio proof** — a merged Pull Request on a real project shows skills better than any CV\n• **Learning** — reading real production code teaches you patterns you won't find in tutorials\n• **Networking** — you collaborate with devs globally, some become colleagues or references\n• **Africa-specific OSS:** Ushahidi, OpenMRS, iCHASI are Kenyan/African open source projects you can contribute to\n\n**How to make your first contribution:**\n1. Find a project you use (React, VS Code extensions, etc.)\n2. Look for issues labelled \`good first issue\` or \`help wanted\`\n3. Fork the repo → make your change → open a Pull Request\n4. Respond to review feedback → get it merged 🎉\n\n**Good starting places:**\n→ <a href="https://goodfirstissue.dev" target="_blank">goodfirstissue.dev</a> — curated beginner-friendly issues\n→ <a href="https://up-for-grabs.net" target="_blank">up-for-grabs.net</a> — tasks labelled for new contributors\n→ <a href="https://github.com/ushahidi" target="_blank">Ushahidi on GitHub</a> — Kenyan-founded, globally used\n\n**Tip:** Even fixing a typo in documentation counts. Everyone starts somewhere!`,
      followUps: [
        'Teach me Git',
        'How do I use GitHub?',
        'What projects should I build?',
        'How does open source help my career?',
      ],
    }),
  },

  // ── What is Blockchain / Web3 ──────────────────────────
  {
    topic: 'blockchain_web3',
    label: 'Blockchain & Web3',
    patterns: [
      'what is blockchain', 'blockchain explained', 'what is web3',
      'what is crypto', 'what is nft', 'nft explained',
      'what is defi', 'what is ethereum', 'what is bitcoin',
      'blockchain kenya', 'crypto kenya', 'web3 developer',
      'smart contract', 'what is solidity', 'blockchain tutorial',
      'is blockchain worth learning', 'web3 career',
    ],
    getResponse: () => ({
      text: `**Blockchain** is a distributed database where data is stored in "blocks" that are chained together and can't be altered retroactively. No single company controls it.\n\n**Key concepts:**\n• **Bitcoin** — digital currency, runs on a blockchain\n• **Ethereum** — a programmable blockchain — you can write code ("smart contracts") that runs on it\n• **Smart Contracts** — self-executing code on the blockchain. When condition A is met, action B happens automatically — no middleman\n• **Web3** — the vision of an internet where users own their data and assets, not corporations\n• **DeFi** — Decentralised Finance — lending, borrowing, trading without banks\n• **NFTs** — Non-Fungible Tokens — proof of ownership of a digital item\n\n**Blockchain in Kenya:**\n• <a href="https://mpedigree.net" target="_blank">mPedigree</a> — blockchain for medicine verification\n• Several Kenyan fintech startups use blockchain for cross-border remittances\n• Safaricom has explored blockchain for supply chain\n\n**Should you learn it?**\nHonestly: only if you're genuinely interested. The hype has cooled since 2021, but **smart contract developers** (Solidity/Rust) still earn very well globally ($80K–$200K/yr remotely).\n\n**Starting point:** <a href="https://cryptozombies.io" target="_blank">CryptoZombies</a> — free, gamified Solidity course. Fun way to see if it clicks.`,
      followUps: [
        'What is Web3 development?',
        'How do I learn Solidity?',
        'What tech skills pay most internationally?',
        'Tell me about remote work for Kenyan devs',
      ],
    }),
  },

  // ── What is a Framework / Library ─────────────────────
  {
    topic: 'framework_vs_library',
    label: 'Frameworks & Libraries',
    patterns: [
      'what is a framework', 'what is a library', 'framework vs library',
      'what is node js', 'what is nodejs', 'what is express',
      'what is next js', 'what is nextjs', 'what is django',
      'what is flask', 'what is laravel', 'what is spring',
      'which framework should i learn', 'best framework',
      'react vs vue vs angular', 'what framework to use',
    ],
    getResponse: () => ({
      text: `**Library vs Framework** — one of the most common confusions in dev:\n\n• **Library** — a tool you call. *You're in control.* (e.g. Lodash, Axios, Moment.js)\n• **Framework** — calls your code. *It's in control.* (e.g. Express, Django, Next.js)\n\n> "A library is like a toolkit. A framework is like a job — it tells you where to show up and what to do." 😄\n\n**Popular frameworks by use case:**\n\n**Frontend:**\n• <a href="https://react.dev" target="_blank">**React**</a> — most popular globally, massive job market\n• **Vue.js** — gentler learning curve, great for beginners\n• **Svelte** — compiles to vanilla JS, very fast\n• **Next.js** — React + server-side rendering (great for SEO)\n\n**Backend:**\n• **Express.js** — minimal Node.js framework, most common in Kenya\n• **NestJS** — structured Node.js, TypeScript-first\n• **Django / Flask** — Python frameworks, great for data-heavy apps\n• **Laravel** — PHP, still widely used in Kenyan SME projects\n\n**Mobile:**\n• **Flutter** — Google's framework, one codebase for iOS + Android\n• **React Native** — React for mobile, huge community\n\n**For Kenya:** React + Express + Firebase is the fastest path to employment. Learn that stack first, then branch out based on what your job or startup needs.`,
      followUps: [
        'Teach me React',
        'What is Node.js and Express?',
        'React vs Flutter — which should I learn?',
        'What is Next.js?',
      ],
    }),
  },

  // ── Cybersecurity Basics (common questions) ────────────
  {
    topic: 'security_basics',
    label: 'Security Basics',
    patterns: [
      'what is cybersecurity', 'cyber security basics', 'what is hacking',
      'ethical hacking', 'what is a firewall', 'what is encryption',
      'what is ssl', 'what is tls', 'what is https',
      'what is sql injection', 'what is xss', 'what is ddos',
      'how to secure a website', 'web security basics',
      'what is a vpn', 'what is two factor auth', 'what is 2fa',
      'password security', 'what is owasp',
    ],
    getResponse: () => ({
      text: `Security isn't a feature you bolt on later — it's something you build in from day one. Here are the fundamentals every dev must know:\n\n**The OWASP Top 10 (most common web vulnerabilities):**\n• **SQL Injection** — attacker sneaks SQL into your forms to steal/delete database data. Fix: use parameterised queries, never string-concatenate SQL\n• **XSS (Cross-Site Scripting)** — attacker injects malicious JS into your page. Fix: escape user input, use \`textContent\` not \`innerHTML\` for user data\n• **Broken Auth** — weak passwords, no 2FA, exposed tokens. Fix: use bcrypt for passwords, JWT properly, HTTPS always\n• **Sensitive Data Exposure** — storing passwords in plain text, leaking API keys. Fix: hash passwords, use environment variables, never commit \`.env\` files\n• **IDOR** — accessing someone else's data by changing an ID in the URL. Fix: always verify ownership on the backend\n\n**Quick wins for any project:**\n• Always use **HTTPS** (free with Let's Encrypt / Vercel)\n• Store secrets in **environment variables**, never in code\n• Validate ALL user input on the **backend**, not just frontend\n• Enable **2FA** on your GitHub, hosting, and cloud accounts\n• Keep dependencies updated (\`npm audit\` regularly)\n\n**For Kenyan context:** Mobile money fraud is a real threat — if you build M-PESA integrations, validate callback URLs, whitelist IPs, and verify transaction amounts server-side. Never trust client-side data. 🔐`,
      followUps: [
        'How do I secure my M-PESA integration?',
        'What is SQL injection and how do I prevent it?',
        'How do I use environment variables?',
        'What is OWASP?',
      ],
    }),
  },

  // ── Computer & Hardware Basics ─────────────────────────
  {
    topic: 'computer_basics',
    label: 'Computers & Hardware',
    patterns: [
      'what is a computer', 'how does a computer work', 'what is hardware',
      'what is software', 'what is a cpu', 'what is a processor',
      'what is ram', 'what is memory', 'what is storage',
      'what is a hard drive', 'what is an ssd', 'what is a gpu',
      'what is a motherboard', 'what is an operating system',
      'what is windows', 'what is macos', 'what is an os',
      'computer components', 'computer parts', 'how computers work',
      'what is a program', 'what is software vs hardware',
      'what is a chip', 'what is a processor', 'what is a bit',
      'what is a byte', 'what is binary', 'what is a kernel',
    ],
    getResponse: () => ({
      text: `Great starting point — understanding computers makes you a better developer. Here's the full picture:\n\n**A computer is a machine that:**\n1. Takes **input** (keyboard, mouse, camera, network)\n2. **Processes** it (CPU does calculations)\n3. **Stores** results (RAM for temporary, SSD/HDD for permanent)\n4. Produces **output** (screen, speakers, network)\n\n**The key hardware components:**\n\n• **CPU (Central Processing Unit)** — the brain. Executes your code instructions billions of times per second. Intel Core, AMD Ryzen, Apple M-series are all CPUs.\n\n• **RAM (Random Access Memory)** — short-term memory. When you open VS Code or Chrome, they load into RAM. More RAM = more apps open at once. Clears when powered off.\n\n• **SSD / HDD (Storage)** — long-term memory. Your files, code, OS live here permanently. SSDs are much faster than old HDDs.\n\n• **GPU (Graphics Processing Unit)** — specialised chip for rendering visuals and now also AI/ML workloads. NVIDIA, AMD, Apple GPU.\n\n• **Motherboard** — the main circuit board connecting everything together.\n\n**Software vs Hardware:**\n• **Hardware** — physical components you can touch\n• **Software** — programs and data. Split into:\n  - **OS (Operating System)** — manages hardware for you (Windows, macOS, Linux, Android)\n  - **Applications** — programs that run on the OS (VS Code, Chrome, your app)\n  - **Drivers** — software that lets the OS talk to hardware\n\n**For developers:** Your code is just text files. The CPU reads them (via a compiler or interpreter), converts them to binary (1s and 0s), and executes them. That's all programming really is — giving the CPU a very detailed to-do list. 🖥️`,
      followUps: [
        'What is an operating system?',
        'What is the difference between software and hardware?',
        'How does code actually run on a computer?',
        'What specs do I need for coding?',
      ],
    }),
  },
];
