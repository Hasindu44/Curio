# Curio UI

The interface mixes a gamified drill-app feel (chunky 3D buttons, a winding
skill path, streak/gem/heart stats, a pass/fail lesson footer) with a clean
interactive-course feel (illustrated course cards, light experiment canvases,
"Jump back in" and "Daily problem" cards). All artwork, including "Pip" the robot
mascot, is original SVG; no third-party brand artwork is included.

## What is included

- Design tokens in `frontend/tailwind.config.js` and `frontend/src/index.css`. Soft tints are CSS
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
Google Fonts. License notices are included in `frontend/public/FONT-LICENSES.txt`.
Lesson/math code is loaded separately from the landing page.

## Run locally

See the setup steps in the [README](../README.md). `npm run dev` starts the
web app and the API together.

Some catalog nodes are drafts without questions; they show as locked “coming
soon” steps on the path, and opening one shows a recovery screen.

## Verification

```bash
npm run build
npm run test:ui
```

Run these from the project root.

UI tests use Playwright and intercept all API requests with fixtures; they do not
write to MongoDB. They start Vite on port 5178 and cover theme persistence,
onboarding, course switching, dialog keyboard behavior, profile editing, lesson
completion, the loader, mobile layouts, and the Lesson Studio CRUD screens. Screenshots and failure traces go in
`test-results/` (ignored by Git).

On Windows the test configuration uses Microsoft Edge, which ships with Windows. On other
platforms, install Playwright Chromium first with `npx playwright install chromium`.

## Main design files

- `frontend/src/index.css`: semantic surfaces, controls, sidebar, and typography.
- `frontend/src/components/course/CourseArtwork.jsx`: the original subject illustration system.
- `frontend/src/components/common/Brand.jsx`: `BRAND` name constant, logo mark, wordmark and the liquid-fill loader.
- `frontend/src/components/common/StatusIcons.jsx`: animated flame, gem, XP, heart, trophy and medal icons.
- `frontend/src/components/gamification/LeagueCrest.jsx`: ten flat league badges, Bronze → Diamond.
- `frontend/src/components/common/Modal.jsx`: reusable dialogs with focus handling;
  `ConfirmDialog.jsx` builds the delete confirmations on top of it.
- `frontend/src/components/common/FormField.jsx`: label, hint and error message
  for one input, with `aria-invalid` and `aria-describedby` set.
- `frontend/src/components/lesson/LessonFooter.jsx`: the check / feedback bar used by every lesson step.
- `frontend/src/components/common/Mascot.jsx`: Pip the robot (`happy` waves, `excited` cheers, `sad`, `thinking`).
- `frontend/src/pages/`: one component per screen; `pages/studio/` holds the
  Lesson Studio list, detail and editor.

The API is tested separately with `npm test`.

## Motion

Icons animate with CSS keyframes in `frontend/src/index.css` (`anim-flicker`,
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
- Weeks settle lazily on the learner's next request (`backend/src/services/league.service.js`),
  so no scheduled job is needed. The result is shown once in a dialog and then
  marked seen via `POST /api/leagues/result/seen`.
- `GET /api/leaderboard` returns the week, tiers, zones, cohort rows and any
  unseen result. `frontend/src/lib/leagues.js` mirrors the tier list for the UI.

Existing accounts start in Bronze.
