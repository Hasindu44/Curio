# Curio — Full-stack STEM Learning Platform

For the refreshed interface, local font setup, and browser checks, see
[the UI guide](docs/UI_GUIDE.md).

Curio includes a React/Vite client and an Express/MongoDB API. Authentication, learner profiles, XP, streaks, hearts, course preferences, lesson attempts, progress, and weekly league points are persisted in MongoDB when `VITE_USE_MOCKS=false`.

## Start with MongoDB

```bash
npm install
npm run dev:full
```

The included `.env` targets a local MongoDB instance at `mongodb://127.0.0.1:27017/arcwise`. To use MongoDB Atlas, replace `MONGODB_URI` in `.env` with your Atlas driver connection string. Do not add `.env` to source control; it is ignored by Git. See `docs/MONGODB_ARCHITECTURE.md` for the full data model and deployment notes.

A Duolingo-style skill tree + Brilliant-style interactive problems, built with
React, Vite, Tailwind, and React Router. This is the **frontend** half of a
MERN stack project — it's built to plug straight into an Express + MongoDB
backend once you have one.

The planned MongoDB collections, indexes, atomic completion flow, and API
contracts are documented in [`docs/MONGODB_ARCHITECTURE.md`](docs/MONGODB_ARCHITECTURE.md).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. It runs fully standalone right now using mock
data in `src/data/mockData.js` — no backend required to demo it.

## Project structure

```
src/
  api/api.js          <- All backend calls go through here
  context/AuthContext.jsx <- current user, hearts, XP, streak state
  data/mockData.js     <- stand-in for your MongoDB collections
  components/          <- Navbar, HeartsDisplay, StreakBadge, XPBadge,
                           SkillNode (skill-tree), QuestionCard (the
                           interactive question engine: MCQ, numeric
                           input, step-ordering)
  pages/
    Landing.jsx         <- marketing page
    Login.jsx / Signup.jsx
    Dashboard.jsx        <- skill-tree per course
    Lesson.jsx            <- runs a lesson's question sequence
    Profile.jsx
    Leaderboard.jsx
```

## Wiring up your Express + MongoDB backend

Every function in `src/api/api.js` already has the real `axios` call
written next to a mock fallback. Once your routes exist, flip one flag:

```js
// src/api/api.js
const USE_MOCKS = false;
```

Suggested Express routes to match what the frontend expects:

| Method | Route                        | Purpose                                  |
|--------|------------------------------|-------------------------------------------|
| POST   | `/api/auth/signup`           | create user, return `{ token, user }`     |
| POST   | `/api/auth/login`            | authenticate, return `{ token, user }`     |
| GET    | `/api/users/me`               | current user (xp, hearts, streak, badges) |
| GET    | `/api/courses`                | list of courses with skill-tree nodes     |
| GET    | `/api/lessons/:lessonId`      | a lesson's question sequence              |
| POST   | `/api/lessons/:lessonId/complete` | submit results, award XP              |
| GET    | `/api/leaderboard`            | ranked list of users by XP                |

Suggested Mongoose schemas to get you started:

```js
// models/User.js
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  xp: { type: Number, default: 0 },
  hearts: { type: Number, default: 5 },
  streak: { type: Number, default: 0 },
  lastActiveDate: Date,
  badges: [{ id: String, label: String, icon: String }],
});

// models/Course.js
const courseSchema = new Schema({
  slug: String,
  title: String,
  tagline: String,
  accent: String,
  icon: String,
  nodes: [{ id: String, title: String, xp: Number }],
});

// models/Lesson.js
const lessonSchema = new Schema({
  lessonId: String, // matches a node id in a Course
  title: String,
  course: String,
  questions: [
    {
      id: String,
      type: { type: String, enum: ["mcq", "numeric", "order"] },
      prompt: String,
      options: [String],       // mcq
      correctIndex: Number,    // mcq
      answer: Number,          // numeric
      items: [String],         // order (correct order)
      explanation: String,
    },
  ],
});
```

The dev server proxies `/api/*` to `http://localhost:4000` (see
`vite.config.js`) — point that at wherever your Express server runs, or
change the port.

## Design notes

The visual identity is a bright, playful "gamified learning app" look —
in the spirit of Duolingo's chunky 3D buttons and skill-tree path, and
Brilliant's clean white interactive-problem cards — built with an
original color palette and an original mascot (`src/components/Mascot.jsx`,
a simple rounded "spark" character), not any existing brand's actual
assets. Baloo 2 (bubbly, rounded) is used for display type/buttons,
Nunito for body text, and JetBrains Mono for the occasional equation.
Buttons use a `shadow-[0_Npx_0_0_#color]` + `translate-y` press effect on
`:active` for the chunky 3D feel. Colors and fonts are tokens in
`tailwind.config.js` so you can retheme easily.

## Extending it

- Add more courses/lessons in `mockData.js` (or your MongoDB) — the
  Dashboard and Lesson pages are fully data-driven, no page changes needed.
- `QuestionCard.jsx` supports three question types (`mcq`, `numeric`,
  `order`). Add a new `type` there to support things like matching pairs
  or free-text input.
- Hook up real JWT auth by having `login`/`signup` in `api.js` store the
  real token (already scaffolded) and protecting routes with a simple
  `<RequireAuth>` wrapper around `App.jsx`'s routes.
