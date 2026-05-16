// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Hero Ecosystem Canvas Engine
//  Particles · Network Nodes · M-PESA Arcs · Matatu Vibes
// ═══════════════════════════════════════════════════════════

import { COLORS } from '../data/content.js';

// ── Math helpers ──────────────────────────────────────────
const rand = (a, b) => Math.random() * (b - a) + a;
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── Audience node definitions ─────────────────────────────
const NODE_DEFS = [
  { label: 'DEV',     icon: '{ }', color: COLORS.green,  angle: Math.PI * 0.15  },
  { label: 'CREATOR', icon: '◈',   color: COLORS.gold,   angle: Math.PI * 0.65  },
  { label: 'GAMER',   icon: '⬡',  color: COLORS.orange, angle: Math.PI * 1.15  },
  { label: 'FOUNDER', icon: '⬢',  color: COLORS.red,    angle: Math.PI * 1.65  },
];

// ══════════════════════════════════════════════════════════
//  Particle class
// ══════════════════════════════════════════════════════════
class Particle {
  constructor(w, h) {
    this.reset(w, h);
    // stagger starting position
    this.y = rand(0, h);
  }

  reset(w, h) {
    this.x = rand(0, w);
    this.y = rand(0, h);
    this.vx = rand(-0.4, 0.4);
    this.vy = rand(-0.4, 0.4);
    this.radius = rand(1.5, 3.5);
    this.alpha = rand(0.3, 0.8);
    this.colorIdx = Math.floor(rand(0, 4));
    this.life = rand(0, 1);
    this.lifeSpeed = rand(0.002, 0.006);
  }

  update(w, h, mouse) {
    // Mouse repulsion field
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 120) {
        const force = (120 - d) / 120 * 0.8;
        this.vx += (dx / d) * force;
        this.vy += (dy / d) * force;
      }
    }

    // Friction
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;
    this.life += this.lifeSpeed;

    // Fade life cycle
    if (this.life > 1) this.reset(w, h);

    // Wrap edges
    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    if (this.y > h) this.y = 0;
  }

  draw(ctx) {
    const palette = [COLORS.green, COLORS.gold, COLORS.orange, COLORS.red];
    const pulse = 0.5 + 0.5 * Math.sin(this.life * Math.PI * 2);
    const a = this.alpha * pulse;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = palette[this.colorIdx] + Math.round(a * 255).toString(16).padStart(2, '0');
    ctx.fill();
  }
}

// ══════════════════════════════════════════════════════════
//  DataStream — a dot traveling along a bezier path
// ══════════════════════════════════════════════════════════
class DataStream {
  constructor(from, to, color) {
    this.from = from;
    this.to = to;
    this.color = color;
    this.t = rand(0, 1);
    this.speed = rand(0.003, 0.008);
    this.radius = rand(2.5, 5);
    // control point for bezier
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const offset = rand(-120, 120);
    const angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
    this.cp = { x: mx + Math.cos(angle) * offset, y: my + Math.sin(angle) * offset };
  }

  update() {
    this.t += this.speed;
    if (this.t > 1) this.t = 0;
  }

  draw(ctx) {
    // Draw faint path line
    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.quadraticCurveTo(this.cp.x, this.cp.y, this.to.x, this.to.y);
    ctx.strokeStyle = `${this.color}22`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Traveling dot along path
    const t = this.t;
    const px = (1 - t) * (1 - t) * this.from.x + 2 * (1 - t) * t * this.cp.x + t * t * this.to.x;
    const py = (1 - t) * (1 - t) * this.from.y + 2 * (1 - t) * t * this.cp.y + t * t * this.to.y;

    // Glow
    const grd = ctx.createRadialGradient(px, py, 0, px, py, this.radius * 3);
    grd.addColorStop(0, `${this.color}ff`);
    grd.addColorStop(1, `${this.color}00`);
    ctx.beginPath();
    ctx.arc(px, py, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(px, py, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

// ══════════════════════════════════════════════════════════
//  M-PESA Arc — money value transfer arc animation
// ══════════════════════════════════════════════════════════
class MPESAArc {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.t = 0;
    this.speed = rand(0.004, 0.009);
    this.amount = `KES ${Math.round(rand(100, 9999)).toLocaleString()}`;
    this.active = false;
    this.delay = rand(0, 300);
    this.timer = 0;
  }

  update() {
    this.timer++;
    if (this.timer < this.delay) return;
    if (!this.active) { this.active = true; this.t = 0; }
    this.t += this.speed;
    if (this.t > 1.1) {
      this.t = 0;
      this.delay = rand(80, 200);
      this.timer = 0;
      this.active = false;
      this.amount = `KES ${Math.round(rand(100, 9999)).toLocaleString()}`;
    }
  }

  draw(ctx) {
    if (!this.active || this.t > 1) return;
    const t = clamp(this.t, 0, 1);

    // Arc path (quadratic)
    const mx = (this.from.x + this.to.x) / 2;
    const my = Math.min(this.from.y, this.to.y) - 80;
    const cp = { x: mx, y: my };

    const px = (1 - t) * (1 - t) * this.from.x + 2 * (1 - t) * t * cp.x + t * t * this.to.x;
    const py = (1 - t) * (1 - t) * this.from.y + 2 * (1 - t) * t * cp.y + t * t * this.to.y;

    // Trail
    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.quadraticCurveTo(cp.x, cp.y, px, py);
    ctx.strokeStyle = `${COLORS.red}55`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // M-PESA traveling circle
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.red;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Amount label
    if (t > 0.2 && t < 0.8) {
      ctx.save();
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(this.amount, px, py - 15);
      ctx.restore();
    }
  }
}

// ══════════════════════════════════════════════════════════
//  Matatu Pattern Overlay (geometric tribal-tech)
// ══════════════════════════════════════════════════════════
function drawMatatuOverlay(ctx, w, h, time) {
  const step = 80;
  ctx.save();
  ctx.globalAlpha = 0.03;

  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      const wave = Math.sin((x + y) / 200 + time * 0.3) * 0.5 + 0.5;
      ctx.strokeStyle = wave > 0.5 ? COLORS.green : COLORS.gold;
      ctx.lineWidth = 1;

      // Diamond shapes
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y);
      ctx.lineTo(x + step, y + step / 2);
      ctx.lineTo(x + step / 2, y + step);
      ctx.lineTo(x, y + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ══════════════════════════════════════════════════════════
//  Main EcosystemCanvas class
// ══════════════════════════════════════════════════════════
export class EcosystemCanvas {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.particles = [];
    this.anchorNodes = [];
    this.streams = [];
    this.mpesaArcs = [];
    this.mouse = { x: null, y: null };
    this.time = 0;
    this.raf = null;
    this._onResize = this._resize.bind(this);
    this._onMouseMove = this._mouseMove.bind(this);
    this._onMouseLeave = () => { this.mouse.x = null; this.mouse.y = null; };
    this._onTouch = this._onTouchMove.bind(this);
    this._init();
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._buildNodes();
    this._buildStreams();
  }

  _mouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  _onTouchMove(e) {
    if (!e.touches.length) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.touches[0].clientX - rect.left;
    this.mouse.y = e.touches[0].clientY - rect.top;
  }

  _buildNodes() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.32;

    this.anchorNodes = NODE_DEFS.map((def) => ({
      ...def,
      x: cx + Math.cos(def.angle) * r,
      y: cy + Math.sin(def.angle) * r,
      pulsePhase: rand(0, Math.PI * 2),
    }));
  }

  _buildStreams() {
    this.streams = [];
    this.mpesaArcs = [];
    const nodes = this.anchorNodes;

    // Data streams between every pair of nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        this.streams.push(new DataStream(nodes[i], nodes[j], nodes[i].color));
        this.streams.push(new DataStream(nodes[j], nodes[i], nodes[j].color));
        this.mpesaArcs.push(new MPESAArc(nodes[i], nodes[j]));
      }
    }
  }

  _init() {
    this._resize();
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Create particles
    const count = Math.min(Math.floor((w * h) / 6000), 180);
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(w, h));
    }

    // Event listeners
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this.canvas.addEventListener('touchmove', this._onTouch, { passive: true });

    this._loop();
  }

  _loop() {
    this.raf = requestAnimationFrame(() => this._loop());
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.time += 0.016;

    // Clear
    ctx.fillStyle = '#050d05';
    ctx.fillRect(0, 0, w, h);

    // Matatu geometric overlay
    drawMatatuOverlay(ctx, w, h, this.time);

    // Draw connection lines between nearby particles
    this._drawConnections();

    // Update + draw particles
    for (const p of this.particles) {
      p.update(w, h, this.mouse);
      p.draw(ctx);
    }

    // M-PESA arcs
    for (const arc of this.mpesaArcs) {
      arc.update();
      arc.draw(ctx);
    }

    // Data streams
    for (const s of this.streams) {
      s.update();
      s.draw(ctx);
    }

    // Anchor nodes
    this._drawNodes();

    // Center hub pulse
    this._drawCenterHub(w / 2, h / 2);
  }

  _drawConnections() {
    const ctx = this.ctx;
    const pts = this.particles;
    const maxDist = 100;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = dist(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
        if (d < maxDist) {
          const a = (1 - d / maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,177,64,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Particles near anchor nodes
      for (const node of this.anchorNodes) {
        const d = dist(pts[i].x, pts[i].y, node.x, node.y);
        if (d < 150) {
          const a = (1 - d / 150) * 0.35;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = node.color + Math.round(a * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  _drawNodes() {
    const ctx = this.ctx;
    for (const node of this.anchorNodes) {
      const pulse = Math.sin(this.time * 1.5 + node.pulsePhase);
      const r1 = 28 + pulse * 4;
      const r2 = 44 + pulse * 6;
      const r3 = 62 + pulse * 8;

      // Outer glow rings
      ctx.beginPath();
      ctx.arc(node.x, node.y, r3, 0, Math.PI * 2);
      ctx.strokeStyle = `${node.color}18`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(node.x, node.y, r2, 0, Math.PI * 2);
      ctx.strokeStyle = `${node.color}33`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Core circle with radial gradient
      const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r1);
      grd.addColorStop(0, `${node.color}cc`);
      grd.addColorStop(1, `${node.color}11`);
      ctx.beginPath();
      ctx.arc(node.x, node.y, r1, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.arc(node.x, node.y, r1, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.font = 'bold 11px Orbitron, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      ctx.restore();
    }
  }

  _drawCenterHub(cx, cy) {
    const ctx = this.ctx;
    const t = this.time;
    const r = 20 + Math.sin(t * 2) * 3;

    // Spinning dashes ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, r + 16, 0, Math.PI * 2);
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = `${COLORS.green}88`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Core dot
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.4, COLORS.green);
    grd.addColorStop(1, `${COLORS.green}00`);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._onResize);
  }
}

// ══════════════════════════════════════════════════════════
//  Section mini-canvas (ambient background per section)
// ══════════════════════════════════════════════════════════
export class SectionCanvas {
  constructor(canvasEl, theme) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.theme = theme;
    this.time = 0;
    this.raf = null;
    this._resize();
    this._loop();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  _loop() {
    this.raf = requestAnimationFrame(() => this._loop());
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.time += 0.01;

    ctx.clearRect(0, 0, w, h);

    // Flowing sine waves at the bottom
    const colors = this.theme === 'opportunities' ? [COLORS.green, COLORS.gold]
                 : this.theme === 'showcase'      ? [COLORS.orange, COLORS.red]
                 : this.theme === 'calendar'      ? [COLORS.green, COLORS.orange]
                 : [COLORS.green, COLORS.gold];

    for (let k = 0; k < 3; k++) {
      const color = k % 2 === 0 ? colors[0] : colors[1];
      const amp = 30 + k * 15;
      const freq = 0.004 + k * 0.002;
      const phase = this.time * (0.5 + k * 0.2);
      const yBase = h * (0.6 + k * 0.12);

      ctx.beginPath();
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= w; x += 4) {
        const y = yBase + Math.sin(x * freq + phase) * amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = `${color}12`;
      ctx.fill();
    }

    // Floating small dots
    ctx.save();
    for (let i = 0; i < 20; i++) {
      const x = (Math.sin(this.time * 0.3 + i * 1.1) * 0.5 + 0.5) * w;
      const y = (Math.cos(this.time * 0.2 + i * 0.9) * 0.5 + 0.5) * h;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `${colors[i % 2]}55`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════
//  M-PESA standalone canvas (About section)
// ══════════════════════════════════════════════════════════
export class MPESACanvas {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.time = 0;
    this._resize();
    this._loop();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.canvas.width = this.canvas.offsetWidth || 400;
    this.canvas.height = this.canvas.offsetHeight || 400;
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    this.time += 0.02;
    const t = this.time;

    ctx.fillStyle = '#060606';
    ctx.fillRect(0, 0, w, h);

    // Concentric pulsing rings
    for (let i = 0; i < 5; i++) {
      const r = 30 + i * 30 + Math.sin(t + i) * 10;
      const a = (0.6 - i * 0.1) * (0.5 + 0.5 * Math.sin(t * 1.5 + i));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(227,24,55,${a})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Orbiting satellites (value nodes)
    const satColors = [COLORS.green, COLORS.gold, COLORS.orange];
    for (let i = 0; i < 3; i++) {
      const angle = t * 0.8 + (i * Math.PI * 2) / 3;
      const sr = 90 + i * 25;
      const sx = cx + Math.cos(angle) * sr;
      const sy = cy + Math.sin(angle) * sr;

      ctx.beginPath();
      ctx.arc(sx, sy, 10, 0, Math.PI * 2);
      ctx.fillStyle = satColors[i];
      ctx.fill();

      // Connection line to center
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `${satColors[i]}44`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Traveling dot on line
      const dt = (t * 0.5 + i * 0.3) % 1;
      const dx = lerp(cx, sx, dt);
      const dy = lerp(cy, sy, dt);
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Center M-PESA logo placeholder
    ctx.save();
    ctx.font = 'bold 13px Orbitron, sans-serif';
    ctx.fillStyle = COLORS.red;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M-PESA', cx, cy);
    ctx.restore();
  }
}
