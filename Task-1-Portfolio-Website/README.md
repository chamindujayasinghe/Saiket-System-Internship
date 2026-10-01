# Task 1 — Static Portfolio Website

A themed, responsive personal portfolio built for the **SaiKet Systems Full Stack Development Internship**.

## Features

- **Homepage:** hero section with an animated terminal-style typing line.
- **About:** professional summary, quick facts and a skills grid.
- **Projects:** featured personal projects (Event Management System, Smart Spend, Furniture Visualizer, Pixel Game, Money Tracker), plus placeholder cards for the six internship tasks with status labels.
- **Education:** education timeline and certifications.
- **Contact form with JavaScript validation:**
  - Required fields: name, email, subject, message
  - Email format check
  - Name character rules and minimum length
  - Message length of 20–500 characters, with a live character counter
  - Inline error messages (validated when a field loses focus, then live as you type)
  - Focuses the first invalid field on submit
  - Messages are emailed through [FormSubmit](https://formsubmit.co) (no back-end needed), with a honeypot spam filter, a sending state, and success/error messages
- **Responsive:** mobile menu toggle; layouts for mobile, tablet and desktop.
- **Extras:** scroll-reveal animations, active-section highlight in the navigation, skip link, visible focus states, and `prefers-reduced-motion` support.

## Tech Stack

- HTML5
- Tailwind CSS (Play CDN, custom theme in `tailwind.config`)
- Vanilla JavaScript (ES6+)
- Google Fonts: Instrument Serif, Inter Tight, JetBrains Mono

## Theme

"Editorial terminal": a warm near-black background, paper-white text and a single signal-orange accent (`#FF6B2C`). Headings use a large serif display font, and labels use monospace text like code comments.

## Run Locally

No build step is needed. Either:

- open `index.html` in a browser, or
- use the VS Code **Live Server** extension, or run `npx serve .` in this folder.

> An internet connection is required, because Tailwind and the fonts load from a CDN.
>
> **Contact form:** serve the page from a local server (Live Server or `npx serve .`), not by double-clicking `index.html`. FormSubmit rejects requests from `file://` pages. The first submission sends a one-time **activation email** to the inbox, and messages only arrive after you click "Activate Form".

## Files

```
Task-1-Portfolio-Website/
├── index.html   # Page structure and Tailwind theme config
├── script.js    # Menu, typing effect, scroll reveal, form validation
└── README.md
```

## Screenshots

_Add desktop and mobile screenshots here._
