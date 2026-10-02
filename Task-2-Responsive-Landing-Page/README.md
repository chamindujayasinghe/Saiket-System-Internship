# Task 2 — Responsive E-Commerce Landing Page

A responsive landing page for **Ember Hill Coffee Co.**, a fictional small-batch coffee roastery, built for the **SaiKet Systems Full Stack Development Internship**.

## Features

**Page sections**
- Dismissible announcement bar
- Sticky header with navigation, theme toggle and cart button
- Hero with illustrated product bags and a live "roasted on" date
- Trust strip (shipping, roasting, sourcing)
- Shop: 8 products rendered from a JavaScript data array
- Our Story: a three-step process
- Customer reviews (sample content)
- Newsletter signup
- Footer

**Interactive features (vanilla JavaScript)**
- 🌗 **Dark / light mode toggle**: follows the system setting by default and saves your choice
- 🍔 **Mobile menu toggle** with accessible `aria-expanded` state
- 🏷️ **Product filtering** by roast level (All / Light / Medium / Dark)
- 🛒 **Shopping cart drawer**:
  - Add to cart, with button feedback and a counter badge animation
  - Increase or decrease quantity, or remove an item
  - Live subtotal and a free-shipping progress bar (free over $50)
  - Cart saved in `localStorage`
  - Closes with Escape or the overlay, and keeps keyboard focus inside while open
- ✉️ **Newsletter form validation**: empty and invalid-email checks with inline messages
- 🔔 Toast notifications

**Responsive & accessible**
- Mobile-first layouts: 1 → 2 → 4 product columns
- Skip link, visible focus states, ARIA labels, and `prefers-reduced-motion` support

## Tech Stack

- HTML5
- Tailwind CSS (Play CDN, with custom colours driven by CSS variables for dark mode)
- Vanilla JavaScript (ES6+), no libraries
- Google Fonts: Fraunces, DM Sans

## E-Commerce Concepts Shown

Product catalogue and categories, product cards (price, origin, tasting notes, roast level), badges (Bestseller / New), cart and quantities, subtotal, free-shipping threshold, promotional banner, newsletter discount offer, and social proof (reviews).

## Run Locally

No build step is needed. Open `index.html` in a browser, or use VS Code **Live Server**, or run `npx serve .` in this folder.

> An internet connection is required, because Tailwind and the fonts load from a CDN.

## Files

```
Task-2-Responsive-Landing-Page/
├── index.html   # Page structure, theme tokens, Tailwind config
├── script.js    # Products, filtering, cart, theme, menu, validation
└── README.md
```

## Screenshots

_Add desktop (light and dark) and mobile screenshots here._

---

*Ember Hill Coffee Co. is a fictional brand. Products and reviews are sample content.*
