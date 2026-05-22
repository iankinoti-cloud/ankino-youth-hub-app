"""
Ankino Youth Hub — Project Proposal Pitch Generator
Generates: ankino-youth-hub-proposal.pptx
Import into Google Slides: File > Import slides

Structure:
  01 — Cover / Executive Summary
  02 — Problem Statement
  03 — Proposed Solution
  04 — Objectives & Success Metrics
  05 — Target Audience
  06 — Technical Approach
  07 — Roadmap & Timeline
  08 — Budget & Resources
  09 — Expected Impact
  10 — Team & Credentials
  11 — Call to Action
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

# ── Colour palette ────────────────────────────────────────
C_BG      = RGBColor(0x05, 0x0d, 0x05)   # #050d05 near-black
C_GREEN   = RGBColor(0x00, 0xB1, 0x40)   # #00B140 Safaricom green
C_WHITE   = RGBColor(0xE8, 0xF5, 0xE9)   # near white
C_MUTED   = RGBColor(0x7A, 0xAB, 0x7A)   # muted green
C_GOLD    = RGBColor(0xFF, 0xD7, 0x00)   # #FFD700
C_ACCENT  = RGBColor(0x00, 0xFF, 0x66)   # neon green
C_DARK2   = RGBColor(0x0a, 0x20, 0x0a)   # dark card bg

# ── Slide dimensions (widescreen 16:9) ────────────────────
W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

BLANK = prs.slide_layouts[6]   # blank layout


# ─────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────

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
    run.font.size      = Pt(font_size)
    run.font.bold      = bold
    run.font.italic    = italic
    run.font.color.rgb = color
    run.font.name      = "Calibri"
    return txBox


def divider(slide, top_inches=1.55):
    line = slide.shapes.add_shape(
        1,
        Inches(0.6), Inches(top_inches), Inches(12.1), Inches(0.03)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = C_GREEN
    line.line.fill.background()


def section_header(slide, tag, heading, top_tag=0.25, top_head=0.65):
    add_text(slide, tag,
             Inches(0.6), Inches(top_tag), Inches(12), Inches(0.4),
             font_size=11, color=C_GREEN)
    add_text(slide, heading,
             Inches(0.6), Inches(top_head), Inches(12), Inches(0.9),
             font_size=34, bold=True, color=C_GREEN)
    divider(slide)


def bullet_slide(slide, tag, heading, bullets):
    """Standard bullet layout."""
    section_header(slide, tag, heading)
    top = Inches(1.75)
    for bullet in bullets:
        add_text(slide, bullet,
                 Inches(0.75), top, Inches(11.8), Inches(0.56),
                 font_size=18, color=C_WHITE)
        top += Inches(0.56)


def note_box(slide, text, top_inches=6.55):
    box = slide.shapes.add_shape(
        1, Inches(0.6), Inches(top_inches), Inches(12.1), Inches(0.7)
    )
    box.fill.solid()
    box.fill.fore_color.rgb = C_DARK2
    box.line.color.rgb = C_GREEN
    tf = box.text_frame
    tf.text = "  " + text
    tf.paragraphs[0].runs[0].font.size      = Pt(13)
    tf.paragraphs[0].runs[0].font.color.rgb = C_ACCENT
    tf.paragraphs[0].runs[0].font.name      = "Calibri"


# ─────────────────────────────────────────────────────────
# SLIDE 1 — COVER / EXECUTIVE SUMMARY
# ─────────────────────────────────────────────────────────
s1 = new_slide()

add_text(s1, "// PROJECT PROPOSAL  ·  ANKINO YOUTH HUB  ·  MAY 2026",
         Inches(0.6), Inches(0.3), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)

add_text(s1, "PROJECT",
         Inches(0.5), Inches(1.1), Inches(12), Inches(1.3),
         font_size=76, bold=True, color=C_GREEN)

add_text(s1, "PROPOSAL",
         Inches(0.5), Inches(2.25), Inches(12), Inches(1.3),
         font_size=76, bold=True, color=C_WHITE)

add_text(s1, "Ankino Youth Hub — Bridging Kenya's Youth Talent to Economic Opportunity",
         Inches(0.5), Inches(3.75), Inches(12), Inches(0.7),
         font_size=20, color=C_MUTED, italic=True)

line = s1.shapes.add_shape(1, Inches(0.5), Inches(4.6), Inches(5), Inches(0.04))
line.fill.solid()
line.fill.fore_color.rgb = C_GREEN
line.line.fill.background()

add_text(s1, "Submitted by: Ian Kinoti   ·   kinotiian12@gmail.com   ·   github.com/iankinoti-cloud",
         Inches(0.5), Inches(4.8), Inches(12.4), Inches(0.45),
         font_size=13, color=C_MUTED)

add_text(s1, "Organisation: Ankino Youth Hub   ·   Date: May 2026   ·   Version: 1.0",
         Inches(0.5), Inches(5.2), Inches(12.4), Inches(0.45),
         font_size=13, color=C_MUTED)

add_text(s1, "Category: Digital Platform  ·  Sector: Youth Employment & Technology  ·  Geography: Kenya / East Africa",
         Inches(0.5), Inches(5.6), Inches(12.4), Inches(0.45),
         font_size=13, color=C_MUTED)


# ─────────────────────────────────────────────────────────
# SLIDE 2 — PROBLEM STATEMENT
# ─────────────────────────────────────────────────────────
s2 = new_slide()
bullet_slide(s2, "// 01 — PROBLEM STATEMENT", "The Problem We Are Solving", [
    "67% of Kenya's unemployed are youth aged 15–34  (KNBS 2024)",
    "26 million Kenyans are under the age of 35 — the largest talent pool in East Africa",
    "Tech opportunities exist: hackathons, internships, scholarships, grants, events",
    "These opportunities are fragmented across 30+ separate platforms and social channels",
    "Youth from outside Nairobi have near-zero awareness of available pathways",
    "Kenya loses skilled talent annually to uncertainty — not lack of ability",
    "No single digital platform currently aggregates, organises, and enables access for Kenyan youth",
])


# ─────────────────────────────────────────────────────────
# SLIDE 3 — PROPOSED SOLUTION
# ─────────────────────────────────────────────────────────
s3 = new_slide()
bullet_slide(s3, "// 02 — PROPOSED SOLUTION", "What Ankino Youth Hub Delivers", [
    "A centralised digital platform aggregating hackathons, internships, scholarships & startup resources",
    "AI chatbot mentor with deep Kenya tech ecosystem and Safaricom Daraja API knowledge",
    "Live Nairobi tech events calendar — searchable, tagged, and updated in real time",
    "Youth startup showcase — Kenya-born ventures profiled and discoverable by investors & peers",
    "M-PESA integration via Safaricom Daraja STK Push for seamless membership and event payments",
    "Firebase Firestore backend capturing real behaviour data — clicks, registrations, subscribers",
    "Deployed to Azure Static Web Apps — globally accessible, free to use, always on",
])


# ─────────────────────────────────────────────────────────
# SLIDE 4 — OBJECTIVES & SUCCESS METRICS
# ─────────────────────────────────────────────────────────
s4 = new_slide()
section_header(s4, "// 03 — OBJECTIVES & SUCCESS METRICS", "What Success Looks Like")

objectives = [
    ("Primary Goal",   "Connect 50,000 Kenyan youth to verified opportunities within 12 months"),
    ("Data Goal",      "Build Kenya's first behavioural dataset on youth opportunity interest by county"),
    ("Ecosystem Goal", "Partner with 10+ corporates (Safaricom, Equity, Microsoft) for live data feeds"),
    ("Revenue Goal",   "Reach KES 500,000/month within 18 months via sponsored listings and M-PESA tiers"),
    ("Scale Goal",     "Expand to Uganda, Tanzania, and Rwanda by end of Year 2"),
    ("Impact KPI",     "Track % of registered members who successfully apply for an opportunity within 30 days"),
]

top = Inches(1.75)
for label, text in objectives:
    add_text(s4, label,
             Inches(0.6), top, Inches(2.3), Inches(0.52),
             font_size=14, bold=True, color=C_GREEN)
    add_text(s4, text,
             Inches(3.1), top, Inches(9.7), Inches(0.52),
             font_size=16, color=C_WHITE)
    top += Inches(0.6)


# ─────────────────────────────────────────────────────────
# SLIDE 5 — TARGET AUDIENCE
# ─────────────────────────────────────────────────────────
s5 = new_slide()
section_header(s5, "// 04 — TARGET AUDIENCE", "Who We Serve")

segments = [
    ("Developers",  "18–32",  "University students, bootcamp graduates, self-taught coders across Kenya"),
    ("Creators",    "18–30",  "Digital artists, UI/UX designers, content creators, motion designers"),
    ("Gamers",      "16–28",  "Game developers, esports players, gaming content creators"),
    ("Founders",    "20–35",  "First-time startup founders seeking funding, co-founders, and mentorship"),
]

# Column headers
add_text(s5, "Segment",   Inches(0.6),  Inches(1.75), Inches(2.5), Inches(0.45),
         font_size=13, bold=True, color=C_MUTED)
add_text(s5, "Age Range", Inches(3.3),  Inches(1.75), Inches(1.8), Inches(0.45),
         font_size=13, bold=True, color=C_MUTED)
add_text(s5, "Description", Inches(5.3), Inches(1.75), Inches(7.5), Inches(0.45),
         font_size=13, bold=True, color=C_MUTED)

# Thin sub-divider
sub = s5.shapes.add_shape(1, Inches(0.6), Inches(2.2), Inches(12.1), Inches(0.02))
sub.fill.solid()
sub.fill.fore_color.rgb = C_MUTED
sub.line.fill.background()

top = Inches(2.3)
for seg, age, desc in segments:
    add_text(s5, seg,  Inches(0.6),  top, Inches(2.5), Inches(0.55),
             font_size=17, bold=True, color=C_GREEN)
    add_text(s5, age,  Inches(3.3),  top, Inches(1.8), Inches(0.55),
             font_size=16, color=C_GOLD)
    add_text(s5, desc, Inches(5.3),  top, Inches(7.5), Inches(0.55),
             font_size=15, color=C_WHITE)
    top += Inches(0.65)

add_text(s5,
         "Total addressable population: 26 million Kenyans under 35  ·  Urban + rural reach via mobile-first design",
         Inches(0.6), Inches(6.1), Inches(12.1), Inches(0.55),
         font_size=14, color=C_MUTED, italic=True)


# ─────────────────────────────────────────────────────────
# SLIDE 6 — TECHNICAL APPROACH
# ─────────────────────────────────────────────────────────
s6 = new_slide()
add_text(s6, "// 05 — TECHNICAL APPROACH",
         Inches(0.6), Inches(0.25), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)
add_text(s6, "Architecture & Engineering",
         Inches(0.6), Inches(0.65), Inches(12), Inches(0.9),
         font_size=34, bold=True, color=C_GREEN)
divider(s6)

left_items = [
    ("Frontend",  "Vite + Vanilla JS + GSAP animations + Canvas API particle system"),
    ("AI Layer",  "Custom offline NLP engine (brain.js) — zero API cost for common queries"),
    ("AI Cloud",  "Azure Functions proxy routes complex queries to Gemini / Claude"),
    ("Payments",  "Safaricom Daraja STK Push — OAuth token caching, live M-PESA endpoint"),
    ("Testing",   "Vitest unit tests · ESLint 9 flat config enforced in CI pipeline"),
]
right_items = [
    ("Database",  "Firebase Firestore — 4 live collections: members, registrations, newsletter, clicks"),
    ("Hosting",   "Azure Static Web Apps — global CDN, automatic SSL, custom domain ready"),
    ("CI/CD",     "GitHub Actions — lint → test → build → deploy on every push to main"),
    ("Auth",      "Managed Identity — no hardcoded secrets · Azure Key Vault integration path"),
    ("Observability", "Firestore real-time analytics + GitHub Actions build status badges"),
]

top = Inches(1.72)
for label, desc in left_items:
    add_text(s6, label, Inches(0.6),  top, Inches(2.0), Inches(0.44),
             font_size=13, bold=True, color=C_GREEN)
    add_text(s6, desc,  Inches(2.75), top, Inches(3.85), Inches(0.44),
             font_size=12, color=C_WHITE)
    top += Inches(0.47)

top = Inches(1.72)
for label, desc in right_items:
    add_text(s6, label, Inches(6.9),   top, Inches(2.1), Inches(0.44),
             font_size=13, bold=True, color=C_GREEN)
    add_text(s6, desc,  Inches(9.1),   top, Inches(3.85), Inches(0.44),
             font_size=12, color=C_WHITE)
    top += Inches(0.47)


# ─────────────────────────────────────────────────────────
# SLIDE 7 — ROADMAP & TIMELINE
# ─────────────────────────────────────────────────────────
s7 = new_slide()
section_header(s7, "// 06 — ROADMAP & TIMELINE", "Phased Delivery Plan")

phases = [
    ("Phase 0  ·  Done",       "MVP live on Azure — Firestore, chatbot, M-PESA, CI/CD pipeline fully operational"),
    ("Phase 1  ·  Month 1–3",  "Launch county-level member onboarding; partner with 3 Nairobi universities for reach"),
    ("Phase 2  ·  Month 3–6",  "Integrate live opportunity data feeds from Safaricom, ALX, Equity Bank partner APIs"),
    ("Phase 3  ·  Month 6–9",  "Launch M-PESA premium membership tier (KES 99/mo) + sponsored listing revenue stream"),
    ("Phase 4  ·  Month 9–12", "Reach 50,000 registered members; publish Kenya Youth Opportunity Report (KNBS data + ours)"),
    ("Phase 5  ·  Year 2",     "Expand to Uganda, Tanzania, Rwanda — replicate model with local partner organisations"),
]

top = Inches(1.75)
for phase, desc in phases:
    add_text(s7, phase,
             Inches(0.6), top, Inches(3.4), Inches(0.52),
             font_size=13, bold=True, color=C_GREEN)
    add_text(s7, desc,
             Inches(4.15), top, Inches(8.75), Inches(0.52),
             font_size=15, color=C_WHITE)
    top += Inches(0.6)


# ─────────────────────────────────────────────────────────
# SLIDE 8 — BUDGET & RESOURCES
# ─────────────────────────────────────────────────────────
s8 = new_slide()
section_header(s8, "// 07 — BUDGET & RESOURCES", "Funding Requirements — Year 1")

budget_items = [
    ("Engineering",        "KES 1,800,000",  "Backend engineer + frontend developer — 12-month contracts"),
    ("Cloud Infrastructure","KES 240,000",   "Azure Static Web Apps scale tier + Functions compute + Firestore reads"),
    ("Partnerships & BD",  "KES 360,000",    "Business development lead for corporate partnership negotiations"),
    ("Marketing & Growth", "KES 480,000",    "County-level outreach campaigns, social media, university activations"),
    ("Legal & Compliance", "KES 120,000",    "Entity registration, GDPR/DPA Kenya compliance, contract templates"),
    ("Contingency (10%)",  "KES 300,000",    "Buffer for unexpected scaling costs or partnership opportunities"),
    ("TOTAL ASK",          "KES 3,300,000",  "~USD 25,500  ·  12-month runway to 50,000 members and revenue break-even"),
]

# Headers
add_text(s8, "Category",       Inches(0.6),  Inches(1.75), Inches(3.0), Inches(0.44),
         font_size=12, bold=True, color=C_MUTED)
add_text(s8, "Amount",         Inches(3.75), Inches(1.75), Inches(2.3), Inches(0.44),
         font_size=12, bold=True, color=C_MUTED)
add_text(s8, "Justification",  Inches(6.2),  Inches(1.75), Inches(6.7), Inches(0.44),
         font_size=12, bold=True, color=C_MUTED)

sub = s8.shapes.add_shape(1, Inches(0.6), Inches(2.18), Inches(12.1), Inches(0.02))
sub.fill.solid()
sub.fill.fore_color.rgb = C_MUTED
sub.line.fill.background()

top = Inches(2.28)
for cat, amt, just in budget_items:
    is_total = cat == "TOTAL ASK"
    col_cat  = C_GOLD if is_total else C_WHITE
    col_amt  = C_GOLD if is_total else C_ACCENT
    sz       = 15 if is_total else 13
    bd       = is_total
    add_text(s8, cat,  Inches(0.6),  top, Inches(3.0), Inches(0.47),
             font_size=sz, bold=bd, color=col_cat)
    add_text(s8, amt,  Inches(3.75), top, Inches(2.3), Inches(0.47),
             font_size=sz, bold=bd, color=col_amt)
    add_text(s8, just, Inches(6.2),  top, Inches(6.7), Inches(0.47),
             font_size=12, color=col_cat)
    top += Inches(0.5)


# ─────────────────────────────────────────────────────────
# SLIDE 9 — EXPECTED IMPACT
# ─────────────────────────────────────────────────────────
s9 = new_slide()
section_header(s9, "// 08 — EXPECTED IMPACT", "Measurable Outcomes for Kenya's Youth")

impacts = [
    ("50,000",        "Registered youth members accessing verified opportunities by Month 12"),
    ("30+ Counties",  "Geographic coverage — from Nairobi to Turkana, Kisumu to Mombasa"),
    ("KES 1B+",       "Total opportunity value surfaced (prize money, internship salaries, scholarship grants)"),
    ("32M Users",     "M-PESA infrastructure reaches every Kenyan — zero payment friction for youth in any county"),
    ("1st Dataset",   "First behavioural data set on Kenyan youth opportunity access — open to KNBS and partners"),
    ("100+ Startups", "Youth ventures showcased and connected to investors, mentors, and corporate partners"),
]

top = Inches(1.75)
for metric, desc in impacts:
    add_text(s9, metric,
             Inches(0.6), top, Inches(2.5), Inches(0.56),
             font_size=22, bold=True, color=C_GREEN)
    add_text(s9, desc,
             Inches(3.3), top, Inches(9.6), Inches(0.56),
             font_size=16, color=C_WHITE)
    top += Inches(0.63)

note_box(s9, "Impact is already happening — Firebase Firestore shows live member registrations, opportunity clicks, and newsletter subscribers from Day 1 of launch.")


# ─────────────────────────────────────────────────────────
# SLIDE 10 — TEAM & CREDENTIALS
# ─────────────────────────────────────────────────────────
s10 = new_slide()
section_header(s10, "// 09 — TEAM & CREDENTIALS", "Who Is Building This")

add_text(s10, "Ian Kinoti — Founder & Lead Engineer",
         Inches(0.6), Inches(1.75), Inches(12), Inches(0.6),
         font_size=22, bold=True, color=C_WHITE)

credentials = [
    "Full-stack JavaScript engineer with experience in Vite, Node.js, Firebase, and Azure",
    "Built and shipped Ankino Youth Hub end-to-end — frontend, backend, AI layer, and CI/CD pipeline",
    "Integrated Safaricom Daraja API (OAuth 2.0 + STK Push) in a live production environment",
    "Designed and deployed a custom AI chatbot trained on Kenya tech and Safaricom ecosystem knowledge",
    "GitHub: github.com/iankinoti-cloud  ·  Contact: kinotiian12@gmail.com",
]

top = Inches(2.45)
for cred in credentials:
    add_text(s10, "•  " + cred,
             Inches(0.75), top, Inches(11.8), Inches(0.52),
             font_size=16, color=C_WHITE)
    top += Inches(0.53)

add_text(s10, "Hiring plan: backend engineer (Month 1), growth lead (Month 3), partnerships manager (Month 6)",
         Inches(0.6), Inches(5.8), Inches(12.1), Inches(0.55),
         font_size=14, color=C_MUTED, italic=True)

note_box(s10, "The MVP was built solo — proving execution ability, not just vision. Every line of code is live and testable at the GitHub repository above.")


# ─────────────────────────────────────────────────────────
# SLIDE 11 — CALL TO ACTION
# ─────────────────────────────────────────────────────────
s11 = new_slide()

add_text(s11, "// 10 — CALL TO ACTION",
         Inches(0.6), Inches(0.3), Inches(12), Inches(0.4),
         font_size=11, color=C_GREEN)

add_text(s11, "Partner with",
         Inches(0.5), Inches(1.0), Inches(12), Inches(1.1),
         font_size=62, bold=True, color=C_WHITE)

add_text(s11, "Ankino Youth Hub",
         Inches(0.5), Inches(2.0), Inches(12), Inches(1.1),
         font_size=62, bold=True, color=C_GREEN)

add_text(s11, "Kenya's youth talent gap is the biggest solvable problem in our ecosystem.",
         Inches(0.5), Inches(3.2), Inches(12), Inches(0.65),
         font_size=19, color=C_MUTED, italic=True)

line = s11.shapes.add_shape(1, Inches(0.5), Inches(3.95), Inches(4.5), Inches(0.04))
line.fill.solid()
line.fill.fore_color.rgb = C_GREEN
line.line.fill.background()

asks = [
    "Seed funding of KES 3.3M to scale from MVP to 50,000 members",
    "Introductions to Safaricom, Equity Bank, and ALX Africa for live data partnerships",
    "Mentorship from Kenya tech founders and operators who have scaled community platforms",
]
top = Inches(4.1)
for ask in asks:
    add_text(s11, "▶   " + ask,
             Inches(0.7), top, Inches(11.9), Inches(0.55),
             font_size=17, color=C_WHITE)
    top += Inches(0.6)

add_text(s11,
         "kinotiian12@gmail.com   ·   github.com/iankinoti-cloud/ankino-youth-hub-app   ·   Built. Deployed. Ready to scale.",
         Inches(0.5), Inches(6.45), Inches(12.4), Inches(0.5),
         font_size=13, color=C_MUTED)


# ─────────────────────────────────────────────────────────
# Save
# ─────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__), "..", "ankino-youth-hub-proposal.pptx")
prs.save(out)
print(f"Saved: {os.path.abspath(out)}")
