// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Main App Entry
// ═══════════════════════════════════════════════════════════
import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EcosystemCanvas, SectionCanvas, MPESACanvas } from './canvas/ecosystem.js';
import { OPPORTUNITIES, STARTUPS, EVENTS } from './data/content.js';
import { initChatbot, updateChatbotProfile } from './components/chatbot.js';
import { initAuthNavbar, initAudienceNodeAuth } from './components/auth-modal.js';
import { onAuthStateChange } from './lib/auth.js';
import {
  joinHub,
  registerInterest,
  subscribeNewsletter,
  trackOpportunityClick,
} from './lib/firebase.js';

gsap.registerPlugin(ScrollTrigger);

// ── Modal helpers ─────────────────────────────────────────
function openModal(overlayId) {
  const el = document.getElementById(overlayId);
  if (!el) return;
  el.setAttribute('aria-hidden', 'false');
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlayId) {
  const el = document.getElementById(overlayId);
  if (!el) return;
  el.setAttribute('aria-hidden', 'true');
  el.classList.remove('open');
  document.body.style.overflow = '';
}

function setFormStatus(statusId, type, message) {
  const el = document.getElementById(statusId);
  if (!el) return;
  el.className = `form-status ${type}`;
  el.textContent = message;
}

function clearFormStatus(statusId) {
  const el = document.getElementById(statusId);
  if (!el) return;
  el.className = 'form-status';
  el.textContent = '';
}

// ── Init canvas animations ────────────────────────────────
function initCanvases() {
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) new EcosystemCanvas(heroCanvas);

  document.querySelectorAll('.section-canvas').forEach((el) => {
    const theme = el.dataset.section || 'default';
    new SectionCanvas(el, theme);
  });

  const mpesaCanvas = document.getElementById('mpesa-canvas');
  if (mpesaCanvas) new MPESACanvas(mpesaCanvas);
}

// ── Navbar scroll effect ───────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('mobile-open');
  });
}

// ── Opportunities section ──────────────────────────────────
function initOpportunities() {
  const grid = document.getElementById('opp-grid');
  const tabs = document.querySelectorAll('.opp-tab');
  let activeTab = 'hackathons';

  function renderCards(type) {
    grid.innerHTML = '';
    const items = OPPORTUNITIES[type] || [];
    items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'opp-card';
      card.style.setProperty('--card-color', item.color);
      card.style.animationDelay = `${i * 0.08}s`;
      card.innerHTML = `
        <div class="opp-card-tag">${item.tag}</div>
        <h3>${item.title}</h3>
        <div class="opp-card-date">${item.date}</div>
        <div class="opp-card-prize">${item.prize}</div>
        <p>${item.desc}</p>
        <div class="opp-card-tags">
          ${item.tags.map((t) => `<span>${t}</span>`).join('')}
        </div>
        <button class="opp-card-cta apply-btn"
          data-title="${item.title}"
          data-type="${type}">Apply Now</button>
      `;

      // Track click + open register interest modal
      const btn = card.querySelector('.apply-btn');
      btn.addEventListener('click', () => {
        trackOpportunityClick(item.title, type);
        document.getElementById('ri-title').textContent = item.title;
        document.getElementById('ri-opp-title').value = item.title;
        document.getElementById('ri-opp-type').value = type;
        clearFormStatus('register-interest-status');
        document.getElementById('register-interest-form').reset();
        document.getElementById('ri-opp-title').value = item.title;
        document.getElementById('ri-opp-type').value = type;
        openModal('register-interest-overlay');
      });

      grid.appendChild(card);

      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, delay: i * 0.08, ease: 'power2.out' }
      );
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderCards(activeTab);
    });
  });

  renderCards('hackathons');
}

// ── Startup Showcase carousel ──────────────────────────────
function initShowcase() {
  const track  = document.getElementById('showcase-track');
  const dotsEl = document.getElementById('showcase-dots');
  const prev   = document.getElementById('showcase-prev');
  const next   = document.getElementById('showcase-next');

  let currentPage = 0;
  const perPage = window.innerWidth < 680 ? 1 : window.innerWidth < 900 ? 2 : 3;
  const pageCount = Math.ceil(STARTUPS.length / perPage);

  STARTUPS.forEach((startup) => {
    const card = document.createElement('div');
    card.className = 'startup-card';
    card.style.setProperty('--card-color', startup.color);
    card.innerHTML = `
      <span class="startup-emoji">${startup.emoji}</span>
      <h3>${startup.name}</h3>
      <div class="startup-founder">${startup.founder}</div>
      <p>${startup.tagline}</p>
      <div class="startup-meta">
        <span class="startup-category">${startup.category}</span>
        <span class="startup-raised">${startup.raised}</span>
      </div>
    `;
    track.appendChild(card);
  });

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement('button');
    dot.className = `showcase-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Page ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  }

  function goTo(page) {
    currentPage = Math.max(0, Math.min(page, pageCount - 1));
    const cards = track.querySelectorAll('.startup-card');
    const cardWidth = cards[0]?.offsetWidth + 24 || 0;
    gsap.to(track, { x: -currentPage * perPage * cardWidth, duration: 0.5, ease: 'power2.out' });
    dotsEl.querySelectorAll('.showcase-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentPage);
    });
  }

  prev.addEventListener('click', () => goTo(currentPage - 1));
  next.addEventListener('click', () => goTo(currentPage + 1));
}

// ── Events Calendar ────────────────────────────────────────
function initCalendar() {
  const grid      = document.getElementById('cal-grid');
  const label     = document.getElementById('cal-month-label');
  const prevBtn   = document.getElementById('cal-prev');
  const nextBtn   = document.getElementById('cal-next');
  const eventFeed = document.getElementById('events-feed');

  let year  = new Date().getFullYear();
  let month = new Date().getMonth();
  const today = new Date();

  const eventMap = {};
  EVENTS.forEach((ev) => {
    if (!eventMap[ev.date]) eventMap[ev.date] = [];
    eventMap[ev.date].push(ev);
  });

  function dateKey(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function renderCalendar() {
    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    label.textContent = `${MONTHS[month]} ${year}`;

    grid.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = document.createElement('div');
      d.className = 'cal-day other-month';
      d.textContent = daysInPrev - i;
      grid.appendChild(d);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d);
      const div = document.createElement('div');
      div.className = 'cal-day';
      div.textContent = d;

      if (eventMap[key]) div.classList.add('has-event');
      if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
        div.classList.add('today');
      }

      div.addEventListener('click', () => {
        grid.querySelectorAll('.cal-day').forEach((x) => x.classList.remove('selected'));
        div.classList.add('selected');
        showEventsForDate(key);
      });

      grid.appendChild(div);
    }

    const total = firstDay + daysInMonth;
    const remainder = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let d = 1; d <= remainder; d++) {
      const div = document.createElement('div');
      div.className = 'cal-day other-month';
      div.textContent = d;
      grid.appendChild(div);
    }
  }

  function showEventsForDate(key) {
    const items = eventMap[key] || [];
    if (!items.length) {
      eventFeed.innerHTML = '<p style="color:var(--muted);font-size:.85rem;padding:.5rem 0">No events on this date.</p>';
      return;
    }
    eventFeed.innerHTML = items.map((ev) => {
      const [, , day] = ev.date.split('-');
      const month = new Date(ev.date).toLocaleString('en', { month: 'short' });
      return `
        <div class="event-item">
          <div class="event-date-badge">
            <strong>${day}</strong>${month}
          </div>
          <div class="event-info">
            <h4>${ev.title} <span class="event-type-badge ${ev.type}">${ev.type}</span></h4>
            <span>Location: ${ev.location}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderUpcoming() {
    const now = new Date().toISOString().split('T')[0];
    const upcoming = EVENTS.filter((e) => e.date >= now).slice(0, 6);
    eventFeed.innerHTML = upcoming.map((ev) => {
      const [, , day] = ev.date.split('-');
      const monthStr = new Date(ev.date).toLocaleString('en', { month: 'short' });
      return `
        <div class="event-item">
          <div class="event-date-badge">
            <strong>${day}</strong>${monthStr}
          </div>
          <div class="event-info">
            <h4>${ev.title} <span class="event-type-badge ${ev.type}">${ev.type}</span></h4>
            <span>Location: ${ev.location}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  prevBtn.addEventListener('click', () => {
    month--;
    if (month < 0) { month = 11; year--; }
    renderCalendar();
  });
  nextBtn.addEventListener('click', () => {
    month++;
    if (month > 11) { month = 0; year++; }
    renderCalendar();
  });

  renderCalendar();
  renderUpcoming();
}

// ── Animated counter (about stats) ────────────────────────
function initCounters() {
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(this.targets()[0].val).toLocaleString();
          },
        });
      },
      once: true,
    });
  });
}

// ── GSAP scroll reveal ─────────────────────────────────────
function initScrollAnimations() {
  gsap.utils.toArray('.section-header').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      }
    );
  });

  gsap.fromTo('.about-text',
    { opacity: 0, x: -40 },
    {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
    }
  );

  gsap.fromTo('.mpesa-visual',
    { opacity: 0, x: 40 },
    {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.mpesa-visual', start: 'top 80%' },
    }
  );
}

// ── Join Hub Modal ─────────────────────────────────────────
function initJoinHubModal() {
  const overlay = document.getElementById('join-hub-overlay');
  const closeBtn = document.getElementById('join-hub-close');
  const form     = document.getElementById('join-hub-form');
  const submitBtn = document.getElementById('join-hub-submit');

  // Open via hero "Explore Opportunities" button
  // We intercept the click, open the modal, then let scroll happen after close
  const heroExploreBtn = document.querySelector('.hero-cta-group .btn-primary');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearFormStatus('join-hub-status');
      form.reset();
      openModal('join-hub-overlay');
    });
  }

  // Also expose a global opener so nav CTA can trigger it
  document.getElementById('open-join-hub')?.addEventListener('click', () => {
    clearFormStatus('join-hub-status');
    form.reset();
    openModal('join-hub-overlay');
  });

  // Close handlers
  closeBtn.addEventListener('click', () => closeModal('join-hub-overlay'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal('join-hub-overlay');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal('join-hub-overlay');
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormStatus('join-hub-status');

    const name   = form.querySelector('#jh-name').value.trim();
    const email  = form.querySelector('#jh-email').value.trim();
    const role   = form.querySelector('#jh-role').value;
    const county = form.querySelector('#jh-county').value.trim();

    if (!name || !email || !role || !county) {
      setFormStatus('join-hub-status', 'error', 'Please fill in all fields.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const result = await joinHub({ name, email, role, county });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Join the Hub';

    if (result.ok) {
      setFormStatus('join-hub-status', 'success', 'Welcome to Ankino Youth Hub. You are registered.');
      form.reset();
      setTimeout(() => closeModal('join-hub-overlay'), 2200);
    } else {
      setFormStatus('join-hub-status', 'error', 'Something went wrong. Please try again.');
    }
  });
}

// ── Register Interest Modal ────────────────────────────────
function initRegisterInterestModal() {
  const overlay  = document.getElementById('register-interest-overlay');
  const closeBtn = document.getElementById('register-interest-close');
  const form     = document.getElementById('register-interest-form');
  const submitBtn = document.getElementById('register-interest-submit');

  closeBtn.addEventListener('click', () => closeModal('register-interest-overlay'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal('register-interest-overlay');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormStatus('register-interest-status');

    const name        = form.querySelector('#ri-name').value.trim();
    const email       = form.querySelector('#ri-email').value.trim();
    const phone       = form.querySelector('#ri-phone').value.trim();
    const opportunity = form.querySelector('#ri-opp-title').value;
    const type        = form.querySelector('#ri-opp-type').value;

    if (!name || !email) {
      setFormStatus('register-interest-status', 'error', 'Name and email are required.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const result = await registerInterest({ name, email, phone, opportunity, type });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Register Interest';

    if (result.ok) {
      setFormStatus('register-interest-status', 'success', 'Interest registered. We will be in touch.');
      form.reset();
      setTimeout(() => closeModal('register-interest-overlay'), 2200);
    } else {
      setFormStatus('register-interest-status', 'error', 'Could not save. Please try again.');
    }
  });
}

// ── Newsletter form (footer) ───────────────────────────────
function initNewsletter() {
  const form   = document.querySelector('.newsletter-form');
  const input  = form?.querySelector('input[type="email"]');
  const button = form?.querySelector('button');
  if (!form || !input || !button) return;

  // Add status element
  const status = document.createElement('div');
  status.className = 'nl-status';
  form.appendChild(status);

  button.addEventListener('click', async () => {
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Enter a valid email address.';
      status.className = 'nl-status visible';
      return;
    }

    form.classList.add('loading');
    button.textContent = '...';

    const result = await subscribeNewsletter(email);

    form.classList.remove('loading');
    button.textContent = '';
    button.innerHTML = '&#10003;';

    if (result.ok) {
      status.textContent = 'Subscribed. You are on the list.';
      status.className = 'nl-status visible';
      input.value = '';
    } else {
      status.textContent = 'Could not subscribe. Try again.';
      status.className = 'nl-status visible';
      button.textContent = '';
      button.innerHTML = '&rarr;';
    }
  });
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCanvases();
  initNavbar();
  initOpportunities();
  initShowcase();
  initCalendar();
  initCounters();
  initScrollAnimations();
  initChatbot();
  initJoinHubModal();
  initRegisterInterestModal();
  initNewsletter();

  // ── Auth: navbar + audience node clicks ───────────────
  initAuthNavbar();          // sets up Sign In button, user chip, logout
  initAudienceNodeAuth();    // makes audience nodes open the auth modal

  // When profile changes, update chatbot persona
  onAuthStateChange((_user, profile) => {
    if (profile) updateChatbotProfile(profile);
  });

  // Seed initial chatbot suggestion chips
  const initialChips = document.getElementById('initial-chips');
  if (initialChips) {
    const suggestions = [
      'Show me hackathons in Kenya',
      'How do I integrate M-PESA?',
      'Freelancing tips for devs',
      'Career paths in tech',
    ];
    suggestions.forEach((text) => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        const input = document.getElementById('chatbot-input');
        if (input) {
          input.value = text;
          document.getElementById('chatbot-send')?.click();
        }
      });
      initialChips.appendChild(btn);
    });
  }
});
