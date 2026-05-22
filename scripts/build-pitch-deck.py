"""
Ankino Youth Hub — Hackathon Pitch Deck Generator
Generates: ankino-youth-hub-pitch.pptx
Import into Google Slides: File > Import slides
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Pt
import os

# ── Colour palette ────────────────────────────────────────
C_BG      = RGBColor(0x05, 0x0d, 0x05)   # #050d05 dark
C_GREEN   = RGBColor(0x00, 0xB1, 0x40)   # #00B140
C_WHITE   = RGBColor(0xE8, 0xF5, 0xE9)   # near white
C_MUTED   = RGBColor(0x7A, 0xAB, 0x7A)   # muted green
C_GOLD    = RGBColor(0xFF, 0xD7, 0x00)   # #FFD700
C_ACCENT  = RGBColor(0x00, 0xFF, 0x66)   # neon green

# ── Slide dimensions (widescreen 16:9) ────────────────────
W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

BLANK = prs.slide_layouts[6]   # blank layout


def new_slide():
    slide = prs.slides.add_slide(BLANK)
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = C_BG
    return slide


def add_text(slide, text, left, top, width, height,
             font_size=24, bold=False, color=C_WHITE,
             align=PP_ALIGN.LEFT, italic=False):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf    = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size    = Pt(font_size)
    run.font.bold    = bold
    run.font.italic  = italic
    run.font.color.rgb = color
    run.font.name    = "Calibri"
    return txBox


def add_bullet_slide(slide, heading, bullets, tag=None):
    """Shared layout: optional tag, green heading, white bullet points."""
    # Tag (monospaced label)
    if tag:
        add_text(slide, tag,
                 Inches(0.6), Inches(0.25), Inches(12), Inches(0.4),
                 font_size=11, color=C_GREEN)

    # Heading
    add_text(slide, heading,
             Inches(0.6), Inches(0.65), Inches(12), Inches(1.0),
             font_size=34, bold=True, color=C_GREEN)

    # Divider line
    from pptx.util import Pt as PT
    from pptx.enum.text import PP_ALIGN
    line = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        Inches(0.6), Inches(1.55), Inches(12.1), Inches(0.03)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = C_GREEN
    line.line.fill.background()

    # Bullets
    top = Inches(1.75)
    for bullet in bullets:
        add_text(slide, bullet,
                 Inches(0.75), top, Inches(11.8), Inches(0.55),
                 font_size=18, color=C_WHITE)
        top += Inches(0.55)


# ─────────────────────────────────────────────────────────
# SLIDE 1 — TITLE
# ─────────────────────────────────────────────────────────
s1 = new_slide()

# Top tag
add_text(s1, "// MORINGA SCHOOL HACKATHON 2026  ·  SOLVE X FOR KENYA",
         Inches(0.6), Inches(0.3), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)

# Main title
add_text(s1, "ANKINO",
         Inches(0.5), Inches(1.1), Inches(12), Inches(1.4),
         font_size=80, bold=True, color=C_GREEN)

add_text(s1, "YOUTH HUB",
         Inches(0.5), Inches(2.3), Inches(12), Inches(1.4),
         font_size=80, bold=True, color=C_WHITE)

# Tagline
add_text(s1, "Solving Youth Unemployment in Kenya Through Technology",
         Inches(0.5), Inches(3.85), Inches(12), Inches(0.7),
         font_size=22, color=C_MUTED, italic=True)

# Divider
line = s1.shapes.add_shape(1, Inches(0.5), Inches(4.65), Inches(4), Inches(0.04))
line.fill.solid()
line.fill.fore_color.rgb = C_GREEN
line.line.fill.background()

# Bottom details
add_text(s1, "Founded by ANKINO DEVELOPERS     |     kinotiian12@gmail.com     |     github.com/iankinoti-cloud",
         Inches(0.5), Inches(4.85), Inches(12.4), Inches(0.5),
         font_size=13, color=C_MUTED)

add_text(s1, "Stack: Vite  ·  Firebase Firestore  ·  Azure Static Web Apps  ·  Safaricom Daraja API",
         Inches(0.5), Inches(5.3), Inches(12.4), Inches(0.5),
         font_size=13, color=C_MUTED)


# ─────────────────────────────────────────────────────────
# SLIDE 2 — THE PROBLEM
# ─────────────────────────────────────────────────────────
s2 = new_slide()
add_bullet_slide(s2, "The Problem", [
    "67% of Kenya's unemployed are youth aged 15–34   (KNBS 2024)",
    "Kenya has 26 million people under 35 — the largest talent pool in East Africa",
    "Tech opportunities exist: hackathons, internships, scholarships, startup grants",
    "They are scattered across 30+ separate platforms with no central access point",
    "Young talent is abundant — but opportunity access is broken",
    "Result: developers, creators, founders graduate into uncertainty",
], tag="// 01 — PROBLEM STATEMENT")


# ─────────────────────────────────────────────────────────
# SLIDE 3 — THE SOLUTION
# ─────────────────────────────────────────────────────────
s3 = new_slide()
add_bullet_slide(s3, "Ankino Youth Hub", [
    "One platform — hackathons, internships, scholarships, and startup resources",
    "AI chatbot mentor with deep Safaricom and Kenya tech ecosystem knowledge",
    "Live tech events calendar — Nairobi scene, mapped and searchable",
    "Youth startup showcase — Kenya-born ventures displayed and discoverable",
    "M-PESA payment integration via Safaricom Daraja STK Push API (live endpoint)",
    "Live deployed production app — not a prototype, not a mock-up",
], tag="// 02 — THE SOLUTION")


# ─────────────────────────────────────────────────────────
# SLIDE 4 — LIVE PRODUCT
# ─────────────────────────────────────────────────────────
s4 = new_slide()
add_bullet_slide(s4, "Working Product — Deployed Today", [
    "Hosted on Azure Static Web Apps with GitHub Actions CI/CD pipeline",
    "Join Hub modal saves member data (name, role, county) to Firebase Firestore",
    "Apply Now on opportunity cards logs registrations + tracks clicks in Firestore",
    "Footer newsletter saves subscribers to Firestore newsletter collection",
    "AI chatbot: answers Daraja, JavaScript, career, freelancing questions offline",
    "Live demo: open Firebase Console and watch documents appear in real time",
], tag="// 03 — LIVE DEMO")

# Note box
note = s4.shapes.add_shape(1, Inches(0.6), Inches(6.6), Inches(12.1), Inches(0.65))
note.fill.solid()
note.fill.fore_color.rgb = RGBColor(0x0a, 0x20, 0x0a)
note.line.color.rgb = C_GREEN
tb = note.text_frame
tb.text = "  Firebase Console open during demo — show live Firestore writes as judges interact with the app"
tb.paragraphs[0].runs[0].font.size = Pt(13)
tb.paragraphs[0].runs[0].font.color.rgb = C_ACCENT
tb.paragraphs[0].runs[0].font.name = "Calibri"


# ─────────────────────────────────────────────────────────
# SLIDE 5 — TECHNICAL ARCHITECTURE
# ─────────────────────────────────────────────────────────
s5 = new_slide()
add_text(s5, "// 04 — TECHNICAL ARCHITECTURE",
         Inches(0.6), Inches(0.25), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)
add_text(s5, "Production-Grade Stack",
         Inches(0.6), Inches(0.65), Inches(12), Inches(0.9),
         font_size=34, bold=True, color=C_GREEN)

# Divider
line = s5.shapes.add_shape(1, Inches(0.6), Inches(1.55), Inches(12.1), Inches(0.03))
line.fill.solid()
line.fill.fore_color.rgb = C_GREEN
line.line.fill.background()

left_items = [
    "Frontend",
    "Vite 8 + GSAP animations + Canvas API particle system",
    "",
    "AI Layer",
    "Custom local NLP engine (zero API cost for offline use)",
    "Azure Functions proxy to Claude and Gemini for complex queries",
    "",
    "Payments",
    "Safaricom Daraja STK Push — live endpoint with OAuth caching",
]
right_items = [
    "Database",
    "Google Firebase Firestore — 4 live collections",
    "members  ·  registrations  ·  newsletter  ·  opportunity_clicks",
    "",
    "Hosting",
    "Azure Static Web Apps — global CDN, automatic SSL",
    "GitHub Actions CI/CD — lint, test, build, deploy on every push",
    "",
    "Quality",
    "Vitest unit tests  ·  ESLint 9 flat config enforced in CI",
]

top = Inches(1.72)
for item in left_items:
    col = C_MUTED if item in ["Frontend", "AI Layer", "Payments"] else C_WHITE
    sz  = 14 if item in ["Frontend", "AI Layer", "Payments"] else 13
    bd  = item in ["Frontend", "AI Layer", "Payments"]
    add_text(s5, item, Inches(0.6), top, Inches(6), Inches(0.38),
             font_size=sz, color=col, bold=bd)
    top += Inches(0.38)

top = Inches(1.72)
for item in right_items:
    col = C_MUTED if item in ["Database", "Hosting", "Quality"] else C_WHITE
    sz  = 14 if item in ["Database", "Hosting", "Quality"] else 13
    bd  = item in ["Database", "Hosting", "Quality"]
    add_text(s5, item, Inches(6.9), top, Inches(6), Inches(0.38),
             font_size=sz, color=col, bold=bd)
    top += Inches(0.38)


# ─────────────────────────────────────────────────────────
# SLIDE 6 — EMPIRICAL DATA
# ─────────────────────────────────────────────────────────
s6 = new_slide()
add_bullet_slide(s6, "Data-Driven from Day One", [
    "KNBS 2024: Youth aged 15–34 account for 67% of all unemployed Kenyans",
    "Safaricom 2024 Annual Report: 32M+ active M-PESA users, KES 39 trillion transacted",
    "Our Firestore data collected today shows which opportunities get most interest",
    "opportunity_clicks collection: real-time signal on what youth want — not assumptions",
    "members collection: role breakdown (Developer / Creator / Gamer / Founder) per county",
    "This data directly informs which counties to expand to first and which categories to grow",
], tag="// 05 — EMPIRICAL DATA")


# ─────────────────────────────────────────────────────────
# SLIDE 7 — IMPACT & SCALE
# ─────────────────────────────────────────────────────────
s7 = new_slide()
add_text(s7, "// 06 — IMPACT & SCALABILITY",
         Inches(0.6), Inches(0.25), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)
add_text(s7, "Built to Scale Across East Africa",
         Inches(0.6), Inches(0.65), Inches(12), Inches(0.9),
         font_size=34, bold=True, color=C_GREEN)

line = s7.shapes.add_shape(1, Inches(0.6), Inches(1.55), Inches(12.1), Inches(0.03))
line.fill.solid()
line.fill.fore_color.rgb = C_GREEN
line.line.fill.background()

milestones = [
    ("Year 1", "50,000 registered youth members across 5 Kenyan counties"),
    ("Year 2", "Expand to Uganda, Tanzania, and Rwanda"),
    ("Revenue 1", "Sponsored opportunity listings — companies pay to feature internships and hackathons"),
    ("Revenue 2", "M-PESA membership tier at KES 99/month for premium features"),
    ("Revenue 3", "API access packages for Safaricom, Equity Bank, and corporate partners"),
    ("Edge", "Only platform combining M-PESA payments + AI mentorship + Kenya opportunity data"),
]

top = Inches(1.75)
for label, text in milestones:
    add_text(s7, label,
             Inches(0.6), top, Inches(1.8), Inches(0.5),
             font_size=14, bold=True, color=C_GREEN)
    add_text(s7, text,
             Inches(2.55), top, Inches(10.2), Inches(0.5),
             font_size=16, color=C_WHITE)
    top += Inches(0.58)


# ─────────────────────────────────────────────────────────
# SLIDE 8 — ASK
# ─────────────────────────────────────────────────────────
s8 = new_slide()
add_text(s8, "// 07 — TEAM & ASK",
         Inches(0.6), Inches(0.25), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)
add_text(s8, "ANKINO DEVELOPERS — Founder and Engineer",
         Inches(0.6), Inches(0.65), Inches(12), Inches(0.9),
         font_size=34, bold=True, color=C_GREEN)

line = s8.shapes.add_shape(1, Inches(0.6), Inches(1.55), Inches(12.1), Inches(0.03))
line.fill.solid()
line.fill.fore_color.rgb = C_GREEN
line.line.fill.background()

add_text(s8, "kinotiian12@gmail.com",
         Inches(0.6), Inches(1.75), Inches(12), Inches(0.45),
         font_size=16, color=C_MUTED)
add_text(s8, "github.com/iankinoti-cloud/ankino-youth-hub-app",
         Inches(0.6), Inches(2.15), Inches(12), Inches(0.45),
         font_size=16, color=C_MUTED)

add_text(s8, "What we are asking for:",
         Inches(0.6), Inches(2.8), Inches(12), Inches(0.5),
         font_size=20, bold=True, color=C_WHITE)

asks = [
    "Connections to Safaricom and Equity Bank ecosystem partners for live opportunity data feeds",
    "Mentorship from Kenya tech founders who have scaled a community product",
    "Seed funding to grow the member base, hire engineers, and expand county coverage",
]
top = Inches(3.35)
for ask in asks:
    add_text(s8, "—  " + ask,
             Inches(0.75), top, Inches(11.8), Inches(0.55),
             font_size=18, color=C_WHITE)
    top += Inches(0.6)

# Closing statement
add_text(s8,
         "Kenya's youth talent is abundant. The infrastructure gap is the problem we are solving.",
         Inches(0.6), Inches(6.1), Inches(12.1), Inches(0.7),
         font_size=16, color=C_MUTED, italic=True)


# ─────────────────────────────────────────────────────────
# Save
# ─────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__), "..", "ankino-youth-hub-pitch.pptx")
prs.save(out)
print(f"Saved: {os.path.abspath(out)}")
