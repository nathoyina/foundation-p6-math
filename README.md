# P6 Visual Maths

A browser-based practice app for **Singapore Primary 6** students to build fluency in **fractions, decimals, and percentages** using interactive diagrams on every question.

---

## Overview

**P6 Visual Maths** is a small Next.js web app focused on “see it, then answer it” practice. Each topic uses a **canonical visual** (number line, fraction circles, or 100-square grid) so learners connect symbols to meaning, not just drill text-only questions.

**The problem it solves:** Rounding, mixed numbers, and percent conversion are easy to treat as rules without pictures. This app keeps the **model** and the **question** on the same screen.

**Why it exists:** It supports **MOE-style** P6 number work in a self-paced, low-friction way—no accounts required for the core experience.

**What makes it useful:** **Diagram-first** tasks, **immediate feedback**, **streaks** stored locally, and **varied prompts** (for example, “nearest tenth” as well as “one decimal place”).

---

## Features

- **Decimal rounding** on an interactive number line, with orange marker for the exact value and tap-to-choose rounded answers; prompts mix *nearest tenth / hundredth* and *one / two decimal places* wording
- **Mixed → improper fractions** with pie models, stacked mixed-number notation, and equivalence-aware checking
- **Percentage conversions** (percent ↔ decimal ↔ fraction) tied to a **10×10 hundred square** with clear grid lines; multiple practice modes in one flow
- **Seeded question generation** and small, testable **math + validation** layer (Vitest)
- **Local streak** persistence (per topic) via the browser

---

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Motion](https://motion.dev) (lightweight feedback animation on SVG)

### Backend
- *None* — static generation and client-side interactivity only

### Database
- *None*

### APIs / Services
- *None* (no external auth or paid APIs in the default app)

### Tooling
- [ESLint](https://eslint.org) (`eslint-config-next`)
- [Vitest](https://vitest.dev) (unit tests for math and question validation)

---

## Screenshots

Add screenshots or GIFs here.

```md
![Home page](./screenshots/home.png)
![Decimal rounding](./screenshots/rounding.png)
![Mixed to improper](./screenshots/mixed-fractions.png)
![Percent hundred square](./screenshots/percent-grid.png)
```

---

## Installation

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org) (LTS recommended)
- **npm** (comes with Node; the repo uses `package-lock.json`)

### Clone repository

```bash
git clone https://github.com/yourusername/foundation-p6-math.git
cd foundation-p6-math
```

### Install dependencies

```bash
npm install
```

### Environment variables

No environment variables are required to run the app locally. If you add analytics or a backend later, create a `.env.local` in the project root (Next.js convention).

Example (optional, for future use):

```env
# NEXT_PUBLIC_* only if you add client-side config
# NEXT_PUBLIC_ANALYTICS_ID=
```

### Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Open the **home** page and pick a topic card.
2. **Decimals · Rounding** — Read the prompt, then tap the tick that matches the rounded value; use **Check**, then **Next question**.
3. **Fractions · Mixed → improper** — Enter numerator and denominator of the improper fraction; **Check** to see feedback and the “explode wholes” animation when correct.
4. **Percentages · Conversions** — Choose a practice type (e.g. percent → decimal), fill in the answer, **Check** to see the three representations (% , decimal, simplest fraction) together.

Streaks are saved **in your browser** (`localStorage`) per activity.

---

## API endpoints

This project does **not** expose a custom REST API. It is a **static / client-side** Next.js app. Optional future APIs could be documented here if you add Route Handlers under `src/app/api/`.

---

## Project structure

```bash
foundation-p6-math/
│
├── public/                 # Static assets
├── src/
│   ├── app/                # App Router pages & layout
│   │   ├── decimals/rounding/
│   │   ├── fractions/mixed-to-improper/
│   │   ├── percentages/conversions/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Home / topic hub
│   │   └── globals.css
│   ├── components/
│   │   ├── math/           # e.g. stacked mixed-number notation
│   │   ├── skills/         # Practice screens per topic
│   │   ├── visuals/        # NumberLine, pies, PercentGrid
│   │   └── SkillShell.tsx  # Shared layout (diagram + sidebar)
│   ├── content/            # Copy strings
│   ├── hooks/              # e.g. practice streak + localStorage sync
│   └── lib/
│       ├── math/           # Pure fraction / rounding / percent helpers
│       └── questions/      # RNG, generators, validators, registry
├── package.json
├── vitest.config.ts
└── README.md
```

---

## Testing

Run unit tests (math + validators):

```bash
npm test
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

---

## Deployment

A typical deployment path for this stack:

**Frontend / full stack (static + server features you add later)**

- [Vercel](https://vercel.com) — native support for Next.js; connect the Git repo and deploy.

**Backend**

- *Not used* in the current codebase.

**Database**

- *Not used* in the current codebase.

After the first deploy, you can add production screenshots to the section above.
