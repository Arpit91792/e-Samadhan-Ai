# e-Samadhan AI 🇮🇳

**AI-Powered Smart Government Grievance Redressal Platform**

A modern, futuristic landing page built with React.js, Tailwind CSS, and Framer Motion — designed for next-generation Indian smart governance.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — version **18 or higher**
- npm — comes bundled with Node.js

To verify:
```bash
node -v
npm -v
```

---

## Getting Started

### 1. Navigate to the project folder

```bash
cd "e-Samadhan AI"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open in browser

Visit: [http://localhost:5173](http://localhost:5173)

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `localhost:5173` |
| `npm run build` | Build for production (output in `/dist`) |
| `npm run preview` | Preview the production build locally |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion 11 | Animations & transitions |
| Lucide React | Icon library |
| React CountUp | Animated number counters |
| React Intersection Observer | Scroll-triggered animations |

---

## Project Structure

```
e-Samadhan AI/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Departments.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Analytics.jsx
│   │   ├── WhyChooseUs.jsx
│   │   ├── Testimonials.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Troubleshooting

**Port already in use?**
Vite will automatically try the next available port. Or specify one:
```bash
npm run dev -- --port 3000
```

**Dependencies not installing?**
Try clearing the npm cache:
```bash
npm cache clean --force
npm install
```

**Node version too old?**
Download the latest LTS from [nodejs.org](https://nodejs.org/).

---

## License

MIT — free to use for hackathons, portfolios, and projects.
