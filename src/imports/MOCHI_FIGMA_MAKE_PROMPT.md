# 🎨 Mochi Learns — Figma Make Design Prompt

> Paste this entire prompt into Figma Make to generate the full Mochi Learns UI.

---

## Project Brief

**Project:** Mochi Learns — Voice-First AI Literacy Platform for Kids
**Target:** Children ages 4–8
**Device:** Tablet-first (landscape 1024×768 primary, portrait 768×1024 secondary)
**Tech:** React web app, Three.js 3D world in background, Rive character center stage

---

## Design Philosophy

This is not a children's educational app that looks like a children's
educational app. It looks like a Nintendo game crossed with a Pixar
short film — but simplified enough that a 4-year-old can navigate it
by pointing. No text menus. No lists. No instructions. Everything
communicates through shape, color, animation, and sound.

The single design rule: if a 4-year-old can't figure out what to tap
in under 2 seconds, redesign it.

---

## Exact Color System

```
World background (deep):     #0B0E2D  (deep space navy — not black)
World mid-layer:             #1B2A6B  (twilight blue)
World foreground:            #2D5A8E  (soft horizon blue)

Sky gradient:    linear-gradient(180deg, #1a1040 0%, #2d4fa0 50%, #7ec8e3 100%)

UI surface:      rgba(255, 255, 255, 0.12)  (frosted glass — light)
UI surface dark: rgba(10, 8, 32, 0.65)      (frosted glass — dark)
UI border:       rgba(255, 255, 255, 0.22)

Mochi Pink:      #FF7EB3   (Mochi's signature — buttons, glows, highlights)
Mochi Yellow:    #FFE566   (XP, stars, celebration)
Mochi Mint:      #7FFFCF   (correct answers, success states)
Mochi Lavender:  #C4A8FF   (thinking states, knowledge cards)
Mochi Coral:     #FF8B6A   (warmth accents, dawn)

Text primary:    #FFFFFF
Text secondary:  rgba(255, 255, 255, 0.65)
Text on light:   #2D1B6B   (for knowledge cards which are light)

Shadow rule: use subject color at 40% opacity for drop shadows
Never use:   black shadows, white backgrounds, grey UI
```

---

## Typography

```
Display / titles:   Fredoka One — big, round, confident, zero intimidation
UI labels:          Nunito 800 — friendly weight, highly legible small
Mochi speech:       Nunito 700 italic — conversational, warm
Never use:          Inter, Roboto, Arial, Helvetica, system-ui
```

**Type Scale (tablet):**

| Role | Font | Size |
|---|---|---|
| Hero title | Fredoka One | 48px |
| Card title | Fredoka One | 28px |
| Button label | Nunito 800 | 20px |
| Body / bubble | Nunito 700 | 16px |
| Hint / small | Nunito 700 | 13px |

Minimum touch target: **56px height** on all interactive elements.
Children have imprecise motor control — make everything tappable.

---

## Layout — Landscape Primary (1024×768)

Divide the canvas into 3 horizontal zones:

**Left Column (200px wide)**
- Top-left: Mochi's face avatar chip (48px) + child's name + level badge
- Mid-left: 4 zone stat bars (vertical stack, colored per zone)
- Bottom-left: empty breathing room

**Center (624px wide — the stage)**
- Full height: Three.js 3D world canvas fills this entirely
- Center-bottom third: Mochi character (Rive) — approximately 280×280px
- Above Mochi: speech bubble floats, appears/disappears with animation
- Bottom center: microphone button (the hero element)

**Right Column (200px wide)**
- Top-right: streak badge + today's topic badge
- Mid-right: knowledge card slides in from right edge when triggered
- Bottom-right: mute toggle + exit home button

---

## Screen 1: Onboarding / Start Screen

The full canvas is the 3D world — a magical floating island at golden
hour. Soft volumetric light rays. Distant glowing mountains. Stars
beginning to appear at the top.

**Center composition:**
- Mochi character: large (340px), slightly above center, gentle
  breathing idle animation
- Mochi's eyes slowly open as if waking up
- Soft pink glow halo behind Mochi, pulsing slowly

**Below Mochi:**
- "Wake Up Mochi!" button
- Style: pill shape, width 280px, height 72px
- Background: `linear-gradient(135deg, #FF7EB3, #C4A8FF)`
- Glow: `0 0 40px rgba(255,126,179,0.7), 0 8px 32px rgba(196,168,255,0.5)`
- Text: "Wake Up Mochi! 🌟" — Fredoka One 22px white
- Button bounces gently: translateY 0 → -8px → 0, 2s infinite ease-in-out
- On tap: button expands to fill screen → world fades in → Mochi grows

**Corner elements:**
- Top-right: settings gear (40px icon button, frosted glass chip)
- Top-left: parent/guardian lock icon (discrete, small)

**Background particles:**
- Slow-drifting golden sparkles (50 particles)
- Soft floating clouds at 15% opacity
- Stars twinkling at the very top

---

## Screen 2: Main Talking Session

This is the PRIMARY screen — where most time is spent.

**Background (Three.js canvas, full bleed):**
Dreamy floating island world. Time of day matches real clock:
- 6am–8am: Warm sunrise, orange-pink sky, long shadows
- 8am–5pm: Bright day, sky blue, puffy clouds
- 5pm–8pm: Golden hour, deep amber light
- 8pm+: Night, deep navy, stars, fireflies

**Mochi (center stage):**
- Position: horizontal center, vertical 55% from top
- Size: 260×260px landscape / 220×220px portrait
- Rive artboard loaded here — idle bobbing always playing
- Pink ambient glow behind character:
  `radial-gradient(circle, rgba(255,126,179,0.3) 0%, transparent 65%)`

**Speech Bubble (above Mochi):**
- Appears with spring animation: scale 0 → 1.05 → 1, 400ms
- Style: `rgba(10,8,32,0.72)` + blur(16px) + border `rgba(255,255,255,0.2)`
- Border-radius: 20px with tail pointing down toward Mochi
- Max width: 420px
- Text: Nunito 700 italic 16px white
- Disappears with fade when Mochi stops speaking

**Microphone Button (hero element, bottom center):**

| State | Background | Glow |
|---|---|---|
| Default | `linear-gradient(135deg, #FF7EB3, #C4A8FF)` | Pink rings pulse outward slowly |
| Listening | `linear-gradient(135deg, #7FFFCF, #00BBF9)` | Mint glow, 5 orbiting dots |
| Mochi speaking | `linear-gradient(135deg, #FFE566, #FF8B6A)` | Yellow, waveform bars below |

- Size: 80px diameter circle
- Icon: microphone SVG white 32px
- Default glow: `0 0 0 8px rgba(255,126,179,0.25), 0 0 0 16px rgba(255,126,179,0.1)`

**Topic Badge (top center, floating):**
- Frosted glass pill: current AI topic + emoji
- e.g. "🤖 How AI Thinks"
- Only visible during active session

**HUD Corners:**
- Top-left: Child avatar chip (avatar + name + level)
- Top-right: Streak flame badge "🔥 5 days"
- Bottom-left: Mute toggle (icon button, frosted glass)
- Bottom-right: Home button (house icon, frosted glass)

All HUD elements:
```
background: rgba(0,0,0,0.42)
backdrop-filter: blur(12px)
border: 1.5px solid rgba(255,255,255,0.18)
border-radius: 50px
padding: 8px 16px
```

---

## Screen 3: Active Listening State

Transformation from default talking session:

1. World dims slightly: overlay `rgba(0,0,0,0.2)` fades in
2. Mochi's eyes widen (Rive state change)
3. Mochi leans forward slightly (Rive animation)
4. Speech bubble disappears (fade out 200ms)
5. Microphone button expands from 80px → 96px (spring animation)
6. Color shifts to mint/teal gradient
7. Glow rings pulse outward faster

**Audio visualizer appears above mic button:**
- 7 vertical bars, mint color `#7FFFCF`
- Heights driven by real microphone amplitude
- Bars: rounded tops, 6px wide, 4px gap
- Container: frosted glass pill, 180px wide

**Listening prompt floats above visualizer:**
- "I'm listening... 👂"
- Nunito 700 italic, white, 14px
- Gentle fade in/out animation

---

## Screen 4: Knowledge Card

Triggered mid-conversation when Mochi introduces a concept.
The 3D world stays visible. The card floats in from the right.

**Card Entry Animation:**
- Slides in from right edge: `translateX(110%) → translateX(0)`
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`, 500ms
- Slight rotation: `rotateY(15deg) → rotateY(0deg)` simultaneously
- Card leaves a brief trail of sparkles as it enters

**Card Design:**
- Size: 320×400px (landscape) / full-width × 340px (portrait)
- Background: `linear-gradient(145deg, #ffffff, #f0eaff)`
- Top accent stripe: 6px solid, color matches current zone topic
- Border-radius: 28px
- Shadow: `0 24px 64px rgba(196,168,255,0.5), 0 4px 16px rgba(0,0,0,0.15)`

**Inside the card (top to bottom):**

```
[Zone badge pill]
  e.g. "🔮 Crystal Cave"
  background: zone color, white text, Nunito 800 11px
  border-radius: 20px, padding 4px 12px

[Hero illustration area — 180px tall]
  Large centered emoji (72px) — the concept visual
  Soft radial gradient background in zone color at 15% opacity
  Gentle floating animation: translateY 0 → -6px → 0, 3s infinite

[Card title]
  Fredoka One 24px, color #2D1B6B
  e.g. "AI Learns Like You!"

[Fact text]
  Nunito 700 14px, color #4a3a7a, line-height 1.6
  Maximum 2 sentences

[Wow fact box]
  Background: zone color at 10% opacity
  Border: 1.5px solid zone color at 40% opacity
  Border-radius: 14px, padding 10px 14px
  Prefix: "🤯 " + wow fact text
  Nunito 800 12px, zone color

[Collect button]
  "✨ Collect Card!"
  Full width, height 48px, border-radius 14px
  gradient: zone color → lighter zone color
  On tap: card flips, flies to collection corner
```

**Card Collection Indicator (top-right HUD):**
- Small stack of cards icon
- Number badge showing total collected
- On new card added: scale pulse + number increments

---

## Screen 5: Celebration / Correct Answer

Triggered when child answers correctly or completes a topic.
Layered over current screen — world stays visible underneath.

**Particle Burst (originates from Mochi):**
- 40 particles: mix of ⭐ ✨ 💖
- Launch from Mochi's position, arc outward with gravity
- Colors: Mochi Yellow, Mochi Pink, Mochi Mint
- Duration: 1.8s, fade out at 70% of life

**Mochi Reaction:**
- Happy dance animation fires (Rive state trigger)
- Scale pulse: 1 → 1.15 → 1, 300ms
- Glow halo intensifies: opacity 0.3 → 0.8 → 0.3

**XP Popup (floats up from Mochi):**
- Pill shape: "+24 XP 🌟"
- Background: `linear-gradient(135deg, #FFE566, #FF8B6A)`
- Fredoka One 20px white
- Animation: `translateY(0) → translateY(-80px)`, opacity 1 → 0, 1.5s

**Stat Bar Update (left column):**
- Relevant stat bar fills with spring animation
- Colored glow pulses once on the bar
- If milestone hit (25/50/75/100): zone fog lifts in 3D world

**Completion Screen (full session end):**
- Centered card: "Amazing! 🎉"
- Total XP earned this session
- Knowledge cards collected (fan layout)
- "Keep Exploring!" button → topic picker
- "Bye for now!" button → start screen, Mochi waves

---

## Topic Picker Overlay

Slides up from bottom (portrait) or in from left (landscape).
`rgba(10,5,25,0.90)` + `blur(24px)` overlay behind cards.

Title: "Where to next?" — Fredoka One 32px white, centered

**4 Zone Cards (2×2 grid landscape / 1×4 scroll portrait):**

| Zone | Emoji | Color |
|---|---|---|
| 🔮 Crystal Cave — How AI Thinks | 🤖 | #a855f7 |
| 🌲 Ancient Forest — Talking to AI | ✍️ | #22c55e |
| 🏔️ Mountain — AI & Creativity | 🎨 | #ef4444 |
| 💧 River Valley — AI & Our World | 🌍 | #3b82f6 |

Each card: 220×180px, border-radius 24px
- Background: zone color at 18% opacity
- Border: 2px solid zone color at 45% opacity

Zone states:
- **Locked:** reduced opacity 0.5, lock icon floats center
- **Unlocked:** shimmer animation on border, progress ring around emoji
- **Completed:** golden checkmark badge

---

## Glassmorphism Component Spec

**Standard frosted chip (HUD elements):**
```css
background: rgba(0, 0, 0, 0.42);
backdrop-filter: blur(12px) saturate(180%);
border: 1.5px solid rgba(255, 255, 255, 0.18);
border-radius: 50px;
padding: 8px 18px;
```

**Floating panel (speech bubble, topic badge):**
```css
background: rgba(10, 8, 32, 0.72);
backdrop-filter: blur(16px) saturate(200%);
border: 1.5px solid rgba(255, 255, 255, 0.22);
border-radius: 20px;
```

**Light card (knowledge cards, celebration):**
```css
background: linear-gradient(145deg, #ffffff, #f0eaff);
box-shadow: 0 24px 64px rgba(196,168,255,0.45),
            0 2px 8px rgba(0,0,0,0.08);
border-radius: 28px;
```

---

## Animation Timing Reference

| Element | Animation | Duration |
|---|---|---|
| Mochi idle bob | translateY 0 → -8px | 3.5s ease-in-out infinite |
| Mochi glow pulse | scale 1 → 1.12 → 1 | 2s ease-in-out infinite |
| Mic button pulse | glow rings expand | 1.8s ease-out infinite |
| Speech bubble in | scale 0 → 1.05 → 1 | 400ms spring |
| Speech bubble out | opacity 1 → 0 | 200ms ease |
| Knowledge card in | translateX(110%) → 0 | 500ms spring |
| Knowledge card collect | scale 1 → 0.2, fly to corner | 600ms |
| XP float up | translateY + fade | 1.5s ease |
| Correct answer burst | particles arc gravity | 1.8s |
| Start button bounce | translateY 0 → -8px | 2s ease-in-out infinite |
| Screen transition | opacity + scale fade | 300ms ease |

**Spring easing (all card animations):**
```
cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## What NOT To Do

```
❌ No white or light backgrounds on main screens
❌ No text-heavy UI — if it needs more than 6 words, redesign it
❌ No black drop shadows — use colored shadows only
❌ No flat color buttons — always gradient
❌ No sharp corners — minimum 12px radius on everything
❌ No Inter, Roboto, Helvetica
❌ No generic app patterns — no nav bars, tab bars, or sidebars
❌ No error states visible to the child — Mochi handles errors in voice
❌ No loading spinners — use Mochi's thinking animation instead
❌ No text instructions — the UI teaches itself through shape and color
```

---

*Mochi Learns · Figma Make Prompt · March 2026*
