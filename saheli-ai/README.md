# Saheli AI — Your Calm AI Health Companion 🌸

A clean, modern website for an AI-powered women's health assistant built with **React + Vite + Tailwind CSS**.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Getting Started

```bash
# 1. Navigate into the project folder
cd saheli-ai

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

## Project Structure

```
saheli-ai/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── mockApi.js          # Dummy API with simulated delay
│   ├── pages/
│   │   ├── LandingPage.jsx     # Hero, features, disclaimer
│   │   ├── AssessmentPage.jsx  # Multi-step survey form
│   │   └── ResultsPage.jsx     # AI-generated plan display
│   ├── App.jsx                 # Router setup
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind directives + custom styles
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Pages

| Route      | Component        | Description                          |
|------------|------------------|--------------------------------------|
| `/`        | LandingPage      | Hero, how-it-works, disclaimer       |
| `/assess`  | AssessmentPage   | 8-step multi-step survey form        |
| `/results` | ResultsPage      | Risk summary + daily health plan     |

## Tech Stack

- **React 18** (functional components + hooks)
- **React Router v6** (client-side routing)
- **Tailwind CSS 3** (utility-first styling)
- **Vite 5** (fast dev server & build)

## Swapping the Mock API

The file `src/api/mockApi.js` exports `fetchHealthPlan(answers)`. To connect a real backend:

```js
export async function fetchHealthPlan(answers) {
  const res = await fetch('https://your-api.com/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });
  return res.json();
}
```

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## License

MIT
