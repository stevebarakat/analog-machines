# Project Agents & Requirements

This document tracks the requirements, design decisions, and agent personas for the Analog Machines project.

## Project Scope
Boutique analog synthesizer company website built with Astro.

## Questions & Answers
- **Aesthetic:** Vintage / Classic (Warm wood tones, vintage knobs, 70s aesthetic)
- **Features:** Product Catalog, E-commerce, Audio Demos, Engineering Blog, Contact Form
- **Catalog Size:** Small Collection (3-5 items)
- **Tech Stack:** Astro + React

## Implementation Plan
1. **Setup:** Initialize Astro with React and Tailwind CSS.
2. **Design System:** Define "Vintage Analog" theme (wood, brass, cream colors, serif fonts).
3. **Data:** Mock product data for 3 synths (e.g., "The Monolith", "Oscillator X", "Vapor Wave").
4. **Components:**
   - `AudioPlayer.jsx` (React): Interactive waveform/playback.
   - `Knob.jsx` (React): Interactive UI elements for "feel".
   - Layouts: Classic header/footer with serif typography.
5. **Pages:**
   - Home (Hero + Featured)
   - Shop (Grid + Detail)
   - Blog (Engineering notes)
   - Contact
