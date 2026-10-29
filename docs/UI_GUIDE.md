# Curio UI

The interface mixes a gamified drill-app feel (chunky 3D buttons, a winding
skill path, streak/gem/heart stats, a pass/fail lesson footer) with a clean
interactive-course feel (illustrated course cards, light experiment canvases,
"Jump back in" and "Daily problem" cards). All artwork, including "Pip" the robot
mascot, is original SVG; no third-party brand artwork is included.

## What is included

- Design tokens in `tailwind.config.js` and `src/index.css`. Soft tints are CSS
  variables, so `bg-leaf-soft` etc. switch automatically in dark mode.
- Shared controls: `.primary-button`, `.secondary-button`, `.sky-button`,
  `.danger-button`, `.gold-button` (add `.btn-sm`), `.choice` tiles, `.field`.
- A sidebar that collapses to icons on tablets, a mobile top bar and bottom
  navigation, and a right rail (`StatRow`) on wide screens.
- A sine-wave skill path with a START bubble, progress ring and unit trophy.
- Lessons with a sticky `LessonFooter` that turns green or red with feedback,
  number-key shortcuts for choices, and Enter to check or continue.
- A completion screen with XP, accuracy and time tiles.

The font families remain Baloo 2, Nunito, and JetBrains Mono. Their Latin variable
fonts are bundled locally through Fontsource so rendering does not depend on
Google Fonts. License notices are included in `public/FONT-LICENSES.txt`.
Lesson/math code is loaded separately from the landing page.

## Run locally

Use `npm run dev:full` for the frontend and existing Express API. Database-backed
accounts still need a working `MONGODB_URI` and `JWT_SECRET` in your private
`.env`; this visual update does not change those settings.

To preview without the API, set `VITE_USE_MOCKS=true` in your local environment
and restart `npm run dev`. Mock mode uses a demo learner and is not real
authentication or database persistence. Set it back to `false` for the API.

Course setup records learning preferences. It does not generate new curriculum.
Some catalog nodes may not yet have authored lessons; unavailable lessons now
show a recovery screen.

## Verification

```bash
npm run build
npm run test:ui
```

UI tests use Playwright and intercept all API requests with fixtures; they do not
write to MongoDB. They start Vite on port 5178 and cover theme persistence,
onboarding, course switching, dialog keyboard behavior, profile editing, lesson
completion, the loader, and mobile layouts. Screenshots and failure traces go in
`test-results/` (ignored by Git).

On Windows the test configuration uses installed Google Chrome. On other
platforms, install Playwright Chromium first with `npx playwright install chromium`.

## Main design files

- `src/index.css`: semantic surfaces, controls, sidebar, and typography.
- `src/components/CourseArtwork.jsx`: the original subject illustration system.
- `src/components/Brand.jsx`: `BRAND` name constant, logo mark, wordmark and the liquid-fill loader.
- `src/components/StatusIcons.jsx`: animated flame, gem, XP, heart, trophy and medal icons.
- `src/components/LeagueCrest.jsx`: ten flat league badges, Bronze → Diamond.
- `src/components/Modal.jsx`: reusable dialogs with focus handling.
- `src/components/LessonFooter.jsx`: the check / feedback bar used by every lesson step.
- `src/components/Mascot.jsx`: Pip the robot (`happy` waves, `excited` cheers, `sad`, `thinking`).
- `src/pages/Landing.jsx`, `Dashboard.jsx`, `Profile.jsx`, `Leaderboard.jsx`:
  primary screen layouts.

The backend, grading model, and MongoDB configuration are separate concerns.
Passing these fixture-based UI tests does not establish production readiness.

## Motion

Icons animate with CSS keyframes in `src/index.css` (`anim-flicker`,
`anim-heartbeat`, `anim-shine`, `anim-zap`, `anim-float`, `anim-blink`, …).
Every loop starts and ends at rest, so with reduced motion the icons sit still.
Pass `still` to a status icon or `animated={false}` to the mascot to freeze it.

## Weekly leagues

Leagues follow a weekly ladder of ten tiers: Bronze, Silver, Gold, Sapphire,
Ruby, Emerald, Amethyst, Pearl, Obsidian, Diamond.

- A week runs Monday 00:00 UTC to the next Monday. A learner joins their tier's
  cohort (up to 30 people) with the first XP they earn that week.
- At the end of the week the top 7 move up a tier and the bottom 5 move down.
  Bronze never demotes, Diamond never promotes, and cohorts of 12 or fewer
  skip demotion.
- Weeks settle lazily on the learner's next request (`server/lib/leagues.js`),
  so no scheduled job is needed. The result is shown once in a dialog and then
  marked seen via `POST /api/leagues/result/seen`.
- `GET /api/leaderboard` returns the week, tiers, zones, cohort rows and any
  unseen result. `src/lib/leagues.js` mirrors the tier list for mock mode.

Existing accounts start in Bronze; the old lifetime `leaguePoints` field is
still updated but no longer decides the league.
