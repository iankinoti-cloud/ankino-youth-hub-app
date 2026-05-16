// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Kenyan Youth Tech Opportunities KB
//  Covers: Hackathons, Internship Prep, Portfolio, Networking,
//          Remote Work, Startup Culture, Freelancing,
//          Troubleshooting, Career Guidance, Startup Intel
//  Tone: Youthful · Swahili-aware · Encouraging · Futuristic
// ═══════════════════════════════════════════════════════════

export const KENYA_KNOWLEDGE = [

  // ── Local Hackathons ────────────────────────────────────
  {
    topic: 'hackathons_kenya',
    label: 'Hackathons in Kenya',
    patterns: [
      'hackathon', 'hackathons', 'hack', 'nairobi hackathon',
      'safaricom hackathon', 'gdg hackathon', 'coding competition',
      'code challenge', 'build challenge', 'devchallenge', 'code jam',
      'hackathon kenya', 'local hackathon', 'upcoming hackathon',
      'prize hackathon', 'student hackathon',
    ],
    getResponse: () => ({
      text: `Poa! Kenya is seriously one of the best places in Africa to hack — the scene is 🔥.\n\nHere are the top hackathons to chase:\n\n• **Safaricom Developer Challenge** — Kenya's biggest, real M-PESA prizes\n→ <a href="https://devchallenge.safaricom.co.ke" target="_blank">devchallenge.safaricom.co.ke</a>\n\n• **GDG Nairobi / Google DevFest** — Annual Google-powered event, global community\n→ <a href="https://gdg.community.dev/gdg-nairobi/" target="_blank">gdg.community.dev/gdg-nairobi</a>\n\n• **Nairobi GameJam** — For game devs, designers, and storytellers\n→ <a href="https://globalgamejam.org" target="_blank">globalgamejam.org</a>\n\n• **MEST Africa Challenge** — Build an African startup idea, win equity + mentorship\n→ <a href="https://meltwater.org/mest" target="_blank">meltwater.org/mest</a>\n\n• **iHub Hackathons** — Nairobi's OG tech hub hosts multiple per year\n→ <a href="https://ihub.co.ke" target="_blank">ihub.co.ke</a>\n\n• **Hack4PWDs / CivicHackathon** — Government-adjacent, great for impact portfolios\n\n**Pro tip:** Even if you don't win, hackathons = your fastest path to a GitHub portfolio, new teammates, and recruiter visibility. Go for it! 💪`,
      followUps: [
        'How do I prepare for a hackathon?',
        'What should I build at a hackathon?',
        'How do I find a hackathon team?',
        'Tell me about portfolio advice',
      ],
    }),
  },

  // ── Internship Prep ────────────────────────────────────
  {
    topic: 'internship_prep',
    label: 'Internship Prep',
    patterns: [
      'internship', 'internships', 'attachment', 'industrial attachment',
      'internship prep', 'how to get internship', 'apply internship',
      'internship kenya', 'tech internship', 'software internship',
      'safaricom internship', 'equity bank internship', 'twiga internship',
      'andela', 'cv for internship', 'resume for developer',
    ],
    getResponse: () => ({
      text: `Sawa sawa — internships in Kenya are very competitive but very winnable if you prepare right. Here's your playbook:\n\n**1. Fix your GitHub first**\n• At least 3 complete projects with READMEs\n• Show commits over time — not one giant dump the night before\n\n**2. Craft a 1-page dev CV**\n• Lead with skills: Languages → Frameworks → Tools → Cloud\n• Add links: GitHub, LinkedIn, portfolio site\n• No "Objective" section — just build it\n\n**3. Top places to apply in Kenya:**\n→ <a href="https://www.fuzu.com/kenya" target="_blank">fuzu.com/kenya</a> — Best for entry-level tech roles\n→ <a href="https://www.brightermonday.co.ke" target="_blank">brightermonday.co.ke</a> — Good mix of corporates + startups\n→ <a href="https://andela.com" target="_blank">andela.com</a> — Andela Fellowship (remote-first)\n→ <a href="https://www.linkedin.com/jobs" target="_blank">LinkedIn Jobs</a> — filter Kenya + Internship\n→ <a href="https://safaricom.co.ke/careers" target="_blank">safaricom.co.ke/careers</a> — Safaricom attachments\n→ <a href="https://apply.workable.com/equity-bank" target="_blank">Equity Bank careers</a> — Equity Wings To Fly tech roles\n\n**4. What companies want to see:**\n• You've built something (anything!)\n• You can explain your code decisions\n• You know Git — \`git pull\`, \`git commit\`, \`git push\` flow\n\nDon't sleep on **cover letters** — most applicants skip them, so even a short honest one stands out! ✊`,
      followUps: [
        'What projects should I build?',
        'How do I write a good GitHub README?',
        'Tell me about portfolio advice',
        'What tech skills do Kenyan companies want?',
      ],
    }),
  },

  // ── Portfolio Advice ────────────────────────────────────
  {
    topic: 'portfolio',
    label: 'Portfolio Advice',
    patterns: [
      'portfolio', 'portfolio advice', 'what to build', 'project ideas',
      'github portfolio', 'portfolio site', 'showcase projects',
      'portfolio for developers', 'portfolio kenya', 'portfolio ideas',
      'build my portfolio', 'show my work', 'portfolio website',
      'what projects should i build',
    ],
    getResponse: () => ({
      text: `Your portfolio is your CV, your pitch deck, and your proof of work — all in one. Here's what actually works in Kenya:\n\n**3 Projects That Impress Recruiters:**\n\n• **M-PESA Integration App** — A simple payment checkout using Daraja STK Push. Shows local stack knowledge + real-world thinking\n\n• **REST API with a database** — CRUD app (notes, todos, expenses) with Node.js + PostgreSQL or Firebase. Shows backend fundamentals\n\n• **Responsive landing page** — Clean, fast-loading HTML/CSS/JS. No frameworks needed — just prove you can design\n\n**Bonus projects that stand out:**\n• Matatu route tracker (maps API + realtime)\n• Boda booking mini-clone (Firebase + auth)\n• Hack a local problem — water, trash, queues — recruiters LOVE hyperlocal ideas\n\n**Portfolio site:** Deploy free on:\n→ <a href="https://pages.github.com" target="_blank">GitHub Pages</a>\n→ <a href="https://vercel.com" target="_blank">Vercel</a>\n→ <a href="https://netlify.com" target="_blank">Netlify</a>\n\n**README formula:**\n\`\`\`\nProject Name\nWhat it does (2 sentences)\nTech stack\nHow to run it locally\nScreenshots / live link\n\`\`\`\n\nQuality over quantity — 3 polished projects beat 20 abandoned repos. 🎯`,
      code: {
        lang: 'markdown',
        content: `# My Project Name

## What it does
A simple M-PESA payment checkout built with Node.js + Daraja STK Push.
Users enter their phone number and amount — payment prompt appears instantly.

## Tech Stack
- Node.js + Express
- Safaricom Daraja API (M-PESA Express)
- HTML/CSS/Vanilla JS frontend

## Run Locally
\`\`\`bash
git clone https://github.com/yourname/project
cd project
npm install
cp .env.example .env  # add your Daraja keys
npm start
\`\`\`

## Live Demo
[https://yourproject.vercel.app](https://yourproject.vercel.app)`,
      },
      followUps: [
        'How do I deploy to Vercel?',
        'Show me STK Push code',
        'Tell me about GitHub for developers',
        'How do I make my portfolio site look good?',
      ],
    }),
  },

  // ── Networking in Kenya ─────────────────────────────────
  {
    topic: 'networking_kenya',
    label: 'Tech Networking in Kenya',
    patterns: [
      'networking', 'tech community', 'nairobi tech', 'meet developers',
      'tech events nairobi', 'ihub', 'nailab', 'nest nairobi',
      'gdg nairobi', 'gdg', 'google developer group',
      'twitter tech kenya', 'tech twitter', 'dev community kenya',
      'where to meet developers', 'tech network kenya', 'dev meetup',
      'tech meetup nairobi',
    ],
    getResponse: () => ({
      text: `The Nairobi tech community is real, warm, and full of people who want to see you win. Here's where to plug in:\n\n**Physical Hubs:**\n• <a href="https://ihub.co.ke" target="_blank">**iHub**</a> — Nairobi's original innovation hub, Upper Hill. Go there.\n• <a href="https://nailab.co.ke" target="_blank">**Nailab**</a> — Startup accelerator + community space\n• **NEST (Nairobi Enterprise & Startup Tech)** — Good for student energy\n• **Swahilipot Hub** — Mombasa-based, amazing coast community\n→ <a href="https://swahilipothub.co.ke" target="_blank">swahilipothub.co.ke</a>\n\n**Online Communities:**\n• <a href="https://twitter.com/search?q=%23TechKenya" target="_blank">**#TechKenya on X/Twitter**</a> — Most active daily feed\n• <a href="https://gdg.community.dev/gdg-nairobi/" target="_blank">**GDG Nairobi**</a> — Free Google-sponsored meetups monthly\n• **Nairobi Dev WhatsApp/Telegram groups** — Ask in iHub or GDG events for links\n• <a href="https://www.meetup.com/nairobi-software-developers/" target="_blank">**Nairobi Software Developers on Meetup.com**</a>\n\n**Strategy that works:**\n1. Show up to one event and talk to 3 people\n2. Share a project on Twitter with \`#BuiltInKenya\`\n3. Comment genuinely on other devs' work — not just "great post!"\n4. Offer help before asking for it\n\nKenyan tech is a relationship economy. Pata connections, uwe consistent! 🤝`,
      followUps: [
        'Tell me about hackathons in Kenya',
        'How do I build my online presence?',
        'What is GDG Nairobi?',
        'Tips for remote work as a Kenyan dev',
      ],
    }),
  },

  // ── Remote Work ────────────────────────────────────────
  {
    topic: 'remote_work',
    label: 'Remote Work for Kenyan Devs',
    patterns: [
      'remote work', 'remote job', 'work remotely', 'work from home',
      'remote developer', 'upwork', 'toptal', 'fiverr remote',
      'international client', 'usd income', 'dollar income kenya',
      'freelance remote', 'remote kenya', 'work abroad from kenya',
      'distributed team', 'andela remote', 'remote frontend',
      'remote backend', 'remote full stack',
    ],
    getResponse: () => ({
      text: `Remote work from Kenya is real and the earnings can be life-changing. Let's be practical about it:\n\n**Top platforms to find remote dev roles:**\n→ <a href="https://andela.com" target="_blank">**Andela**</a> — Vets you and matches with global companies. Mid-senior focused.\n→ <a href="https://www.upwork.com" target="_blank">**Upwork**</a> — Best for freelance remote contracts. Takes 10% cut.\n→ <a href="https://www.toptal.com" target="_blank">**Toptal**</a> — Hardest to get in, highest paying. Top 3% only.\n→ <a href="https://remote.co/remote-jobs" target="_blank">**Remote.co**</a> — Curated remote-only job board\n→ <a href="https://weworkremotely.com" target="_blank">**We Work Remotely**</a> — Good for entry-to-mid roles\n→ <a href="https://www.turing.com" target="_blank">**Turing.com**</a> — AI-matched remote jobs, pays in USD\n\n**Practical Kenya-specific realities:**\n• **Time zones:** US clients = wake up for 4pm–8pm EAT calls. EU clients = much easier overlap\n• **Payments:** Use <a href="https://www.payoneer.com" target="_blank">Payoneer</a> or <a href="https://wise.com" target="_blank">Wise</a> to receive USD — way better rates than bank wire\n• **Power cuts:** Get a UPS or work from a hub on important call days\n• **Bundles:** Budget at least KES 3,000/month for a reliable data plan — Safaricom Home Fibre if possible\n• **Tax:** Register as a sole proprietor with KRA — you'll need a PIN for anything above KES 100K/year\n\n**USD → KES reality check:** A $2,000/mo remote contract = ~KES 258,000 at current rates. That's very achievable with 1–2 years of good skills. 💰`,
      followUps: [
        'How do I get my first Upwork client?',
        'Tell me about freelancing basics',
        'What skills do remote companies want?',
        'How do I set up Payoneer in Kenya?',
      ],
    }),
  },

  // ── Startup Culture Kenya ──────────────────────────────
  {
    topic: 'startup_culture_kenya',
    label: 'Startup Culture in Kenya',
    patterns: [
      'startup culture', 'silicon savannah', 'nairobi startup',
      'kenya startup scene', 'startup life', 'work at startup',
      'join startup', 'startup job', 'equity job', 'nairobi ecosystem',
      'kenya tech ecosystem', 'startup kenya', 'tech scene nairobi',
      'startup vs corporate', 'work at mpesa', 'work at twiga',
      'wasoko', 'sendy', 'lipa na mpesa startup',
    ],
    getResponse: () => ({
      text: `Welcome to **Silicon Savannah** — Nairobi is genuinely one of Africa's most exciting tech ecosystems. Here's what you need to know:\n\n**Why Kenya's startup scene is different:**\n• M-PESA gave Kenya a 15-year head start on mobile payments — ideas here don't need to "educate the market" on cashless\n• Informal economy is HUGE — the best startups solve matatu, boda, jua kali, or chama problems\n• Investors now watch Nairobi closely — Partech, Norrsken, Novastar, Antler all active here\n\n**Well-known Kenya-born tech companies:**\n• <a href="https://www.twiga.com" target="_blank">**Twiga Foods**</a> — B2B food distribution, raised $50M+\n• **Wasoko** (formerly Sokowatch) — FMCG distribution across East Africa\n• **Sendy** — Logistics platform\n• **Pezesha, Turaco, Pula** — Fintech, insurtech\n• **Cellulant** — Pan-African payments\n\n**Startup vs Corporate tradeoff in Kenya:**\n| | Startup | Corporate (e.g. Safaricom) |\n|---|---|---|\n| Pay | Lower base, equity/options | Higher guaranteed |\n| Learning | Very fast, wear many hats | More structured |\n| Risk | High | Low |\n| Network | Founder access | Industry access |\n\n**Honest advice:** Do a corporate internship first to learn process and build credibility, then jump to a startup when you have skills to offer. That's the fastest growth path in Kenya. 🚀`,
      followUps: [
        'How do I get startup funding in Kenya?',
        'Tell me about startup accelerators',
        'What is iHub?',
        'How do I join a startup as a dev?',
      ],
    }),
  },

  // ── Freelancing Basics ─────────────────────────────────
  {
    topic: 'freelancing',
    label: 'Freelancing Basics',
    patterns: [
      'freelance', 'freelancing', 'freelancer', 'fiverr', 'upwork',
      'get clients', 'first client', 'freelance kenya',
      'how to freelance', 'freelance developer', 'freelance tips',
      'pricing freelance', 'charge clients', 'invoice client',
      'freelance income', 'side hustle tech', 'side project money',
    ],
    getResponse: () => ({
      text: `Freelancing is the fastest way to start earning from code in Kenya — no job offer needed. Here's the honest guide:\n\n**Step 1: Pick one service to sell first**\nDon't offer "full-stack + design + SEO". Start with ONE:\n• WordPress sites for small businesses (easiest)\n• Mobile-responsive landing pages\n• M-PESA integration for local shops\n• Simple REST APIs for other devs\n\n**Step 2: Where to find clients**\n→ <a href="https://www.fiverr.com" target="_blank">**Fiverr**</a> — Great for beginners, but price competitively (start low, build reviews)\n→ <a href="https://www.upwork.com" target="_blank">**Upwork**</a> — Better rates, harder to get started. Write very specific proposals.\n→ **Your network** — Tell every contact you're taking dev projects. WhatsApp groups, uni classmates, church, family business owners — they all need websites\n→ **Facebook local business groups** — Nairobi entrepreneurs post here constantly\n\n**Step 3: Pricing reality in Kenya**\n• Local client (KES): Simple website KES 15,000–40,000\n• International client (USD): Simple website $300–$1,000+\n• M-PESA integration: KES 20,000–50,000 for local, $500–$2,000 for international\n\n**Never forget:**\n• Always take 50% upfront — no exceptions\n• Use a simple contract (even a WhatsApp message screenshot counts in Kenya)\n• Invoice with your M-PESA Till or Paybill number for professionalism\n\nFreelancing isn't easy at first, but your first KES 10,000 project will change your mindset forever. Fanya! 💪`,
      followUps: [
        'How do I write a good Upwork proposal?',
        'Tell me about remote work',
        'How do I set up M-PESA for my freelance business?',
        'What skills are in demand for freelancing?',
      ],
    }),
  },

  // ── Troubleshooting Mindset ────────────────────────────
  {
    topic: 'troubleshooting',
    label: 'Debugging & Troubleshooting',
    patterns: [
      'debug', 'debugging', 'troubleshoot', 'troubleshooting',
      'error', 'bug', 'fix bug', 'code not working', 'my code broke',
      'how to debug', 'how to fix', 'console error', 'null error',
      'undefined error', 'stack overflow', 'google error', 'stuck',
      'cannot read property', 'syntax error', 'runtime error',
      'code broken', 'help with error', 'my app crashed',
    ],
    getResponse: () => ({
      text: `Kukwama ni sehemu ya kazi — every dev gets stuck. The difference between a junior and a senior? **How fast they unstick themselves.** 🔧\n\n**The Debugging Loop (use this every time):**\n\n1. **Read the error message** — actually read it. The line number is gold.\n2. **\`console.log\` everything suspicious** — print variables before and after the broken line\n3. **Isolate** — comment out code until you find the line that causes the problem\n4. **Rubber duck debug** — explain your code out loud step by step. Your brain finds the bug while talking.\n5. **Google the exact error message** — copy-paste the error into Google, add your framework name\n6. **Stack Overflow** — <a href="https://stackoverflow.com" target="_blank">stackoverflow.com</a> — 95% of your errors have been answered here\n7. **GitHub Issues / Docs** — if it's a library bug, check their GitHub issues tab\n8. **Ask for help** — after 30 minutes of real trying, ask a teammate or post in a community\n\n**Common JS errors and what they mean:**\n\`TypeError: Cannot read property 'x' of undefined\` → something is null/undefined before you used it. Check your data flow.\n\n\`ReferenceError: x is not defined\` → typo in variable name, or scope issue (declared in wrong place)\n\n\`CORS error\` → your frontend and backend are on different origins. Add CORS headers on the backend.\n\n\`401 Unauthorized\` → missing or wrong auth token. Check your headers.\n\n**Remember:** Bugs don't mean you're bad at coding. They mean you're coding. 💪`,
      code: {
        lang: 'javascript',
        content: `// Debugging template — use this when stuck
console.log('--- DEBUG CHECKPOINT ---');
console.log('variable name:', yourVariable);
console.log('type:', typeof yourVariable);
console.log('value:', JSON.stringify(yourVariable, null, 2));

// Isolate async issues
async function myFunction() {
  try {
    const result = await someAPICall();
    console.log('API response:', result); // check this first
    return result;
  } catch (error) {
    console.error('Error details:', error.message);
    console.error('Full error:', error);
  }
}`,
      },
      followUps: [
        'How do I debug a Daraja API error?',
        'What is CORS and how do I fix it?',
        'How do I use browser DevTools?',
        'Teach me about async/await in JavaScript',
      ],
    }),
  },

  // ── Career Guidance ────────────────────────────────────
  {
    topic: 'career_guidance',
    label: 'Tech Career in Kenya',
    patterns: [
      'career', 'career advice', 'career path', 'career guidance',
      'developer salary', 'salary kenya', 'how much do devs earn',
      'frontend vs backend', 'what to learn', 'career switch',
      'tech career kenya', 'become developer', 'software engineer career',
      'career roadmap', 'learning path career', 'best language to learn',
      'is coding worth it', 'tech job kenya', 'software job nairobi',
    ],
    getResponse: () => ({
      text: `Tech is one of the best career decisions you can make in Kenya right now — and the entry barrier keeps dropping. Here's the real picture:\n\n**Salary ranges (Kenya, 2026 estimates):**\n| Level | Monthly (KES) | Remote (USD) |\n|---|---|---|\n| Junior Dev (0–2yrs) | 60K–120K | $800–1,500/mo |\n| Mid Dev (2–5yrs) | 130K–250K | $1,500–3,500/mo |\n| Senior Dev (5yrs+) | 270K–500K+ | $3,500–7,000+/mo |\n| Tech Lead / CTO | 400K–800K | $6,000–15,000+/mo |\n\n**Most in-demand roles in Kenya right now:**\n• **Full-stack web developer** (React/Node.js) — highest demand\n• **Mobile developer** (Flutter or React Native) — massive mobile-first market\n• **DevOps / Cloud engineer** — AWS, GCP growing fast in corporate Kenya\n• **Data analyst / Data engineer** — Equity, NCBA, Safaricom all hiring\n• **Cybersecurity analyst** — Government + banks scrambling for talent\n\n**Career paths from zero:**\n→ Frontend → Full-stack → Lead (2–3 years with consistency)\n→ Mobile Dev → Flutter → Play Store app → freelance/startup\n→ Data → SQL → Python → Machine Learning Engineer\n\n**Best companies to target in Kenya:**\n• Safaricom, Equity Bank, KCB Group (large, stable, train juniors)\n• Twiga, Wasoko, Pezesha (startups, fast growth, equity possible)\n• Andela, Turing (remote-first, USD salary from Nairobi)\n\nThe 🔑 truth: **1 year of daily consistent practice beats a 4-year degree with no projects.** Build things, show your work, stay consistent. Utafanikiwa! 🎯`,
      followUps: [
        'What learning path should I follow?',
        'Tell me about remote work for Kenyan devs',
        'How do I build my portfolio?',
        'Teach me about internship preparation',
      ],
    }),
  },

  // ── Startup Intelligence ────────────────────────────────
  {
    topic: 'startup_intel',
    label: 'Kenya Startup Ecosystem',
    patterns: [
      'startup funding', 'raise funding', 'get investment', 'investor kenya',
      'nailab', 'antler kenya', 'mest africa', 'accelerator', 'incubator',
      'pre-seed', 'seed funding', 'pitch deck', 'startup idea',
      'startup intelligence', 'startup resources', 'startup support',
      'how to start a startup', 'launch startup kenya', 'found startup',
      'co-founder', 'mvp startup', 'equity kenya', 'venture capital kenya',
      'vc africa', 'startup accelerator nairobi',
    ],
    getResponse: () => ({
      text: `Kenya's startup funding ecosystem is more accessible than most people think — you just need to know where to knock. 🚪\n\n**Stage 1 — Pre-idea / Idea stage (Free support):**\n→ <a href="https://nailab.co.ke" target="_blank">**Nailab**</a> — East Africa's leading accelerator, free programs for early startups\n→ <a href="https://ihub.co.ke" target="_blank">**iHub**</a> — Free workspace, events, connections\n→ <a href="https://swahilipothub.co.ke" target="_blank">**Swahilipot Hub**</a> — Youth-focused, Mombasa + Nairobi\n→ <a href="https://www.ushaidi.com" target="_blank">**Ushahidi**</a> — Open-source, great community for civic tech ideas\n\n**Stage 2 — MVP / Early traction (Equity-free grants + small checks):**\n→ <a href="https://www.africaprize.org" target="_blank">**Royal Academy of Engineering Africa Prize**</a> — Up to £50K\n→ <a href="https://www.villgro.org/africa" target="_blank">**Villgro Africa**</a> — Health + impact startups\n→ **GSMA Innovation Fund** — Mobile-focused, East Africa\n→ <a href="https://www.seedstarsworld.com" target="_blank">**Seedstars Kenya**</a> — Annual pitch competition, global network\n\n**Stage 3 — Proven MVP, ready to scale (Equity investment):**\n→ <a href="https://www.antler.co/location/east-africa" target="_blank">**Antler East Africa**</a> — $100K–$200K pre-seed, co-builder model\n→ <a href="https://meltwater.org/mest" target="_blank">**MEST Africa**</a> — Training + $50K–$100K seed\n→ <a href="https://novastarventures.com" target="_blank">**Novastar Ventures**</a> — Series A, East Africa focus\n→ <a href="https://www.norrsken.org/africa" target="_blank">**Norrsken22**</a> — Impact-first, $100M African fund\n\n**What investors look for in Kenya:**\n• **Traction** — Even 100 paying customers beats a beautiful deck\n• **Local insight** — Why Kenya, why now, why you\n• **Team** — Solo founders are harder to fund. Find a co-founder.\n• **M-PESA integration** — If payments are involved and you haven't integrated, red flag\n\n**Free pitch deck template:** <a href="https://bit.ly/african-startup-deck" target="_blank">bit.ly/african-startup-deck</a>\n\nRemember: Africa's biggest startups started by solving African problems. Anza na problem unayoijua! 🌍`,
      followUps: [
        'How do I build an MVP fast?',
        'Tell me about startup culture in Kenya',
        'How do I integrate M-PESA in my startup?',
        'What is a pitch deck and how do I make one?',
      ],
    }),
  },
];
