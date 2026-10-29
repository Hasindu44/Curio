# Curio MongoDB architecture

## Running the connected application

1. Install MongoDB Community locally, or create a free MongoDB Atlas cluster.
2. Copy `.env.example` to `.env` (a local development `.env` is already included in this workspace).
3. For Atlas, replace `MONGODB_URI` with the connection string from **Atlas → Connect → Drivers**. URL-encode special characters in the database password.
4. Replace `JWT_SECRET` with a long random value before deployment.
5. Run `npm run dev:full`. The React client starts on port 5173 and the Express API on port 4000.
6. Open `http://localhost:5173`, create an account, and verify the document in the `arcwise.users` collection.

`VITE_USE_MOCKS=false` is required for database-backed operation. The Vite development proxy forwards `/api` to Express, so the browser never needs the MongoDB URL and must never receive database credentials.

The frontend currently runs with `USE_MOCKS = true` in `src/api/api.js`. Mock objects use stable slugs such as `calculus` and `chain-rule`; keep those as public identifiers when MongoDB ObjectIds are introduced.

## Collections

### `users`

```js
{
  _id: ObjectId,
  email: String, // unique, lowercase
  passwordHash: String,
  displayName: String,
  xp: Number,
  streak: { current: Number, longest: Number, lastActivityAt: Date, timezone: String },
  hearts: { current: Number, max: Number, nextRefillAt: Date },
  activeCourseId: ObjectId,
  courseProfiles: [{
    courseId: ObjectId,
    goal: "understand" | "exam" | "apply",
    level: "new" | "familiar" | "confident",
    paceMinutes: Number,
    updatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

Indexes: unique `{ email: 1 }`, plus `{ "streak.lastActivityAt": 1 }` for maintenance jobs.

### `courses`

```js
{
  _id: ObjectId,
  slug: String, // unique public identifier
  title: String,
  tagline: String,
  accent: "amber" | "teal" | "violet",
  icon: String,
  published: Boolean,
  order: Number,
  units: [{ slug: String, title: String, description: String, lessonIds: [ObjectId] }],
  createdAt: Date,
  updatedAt: Date
}
```

Indexes: unique `{ slug: 1 }`, plus `{ published: 1, order: 1 }`.

### `lessons`

```js
{
  _id: ObjectId,
  courseId: ObjectId,
  unitSlug: String,
  slug: String,
  title: String,
  xp: Number,
  order: Number,
  prerequisites: [ObjectId],
  estimatedMinutes: Number,
  published: Boolean,
  questions: [{
    key: String,
    type: "mcq" | "numeric" | "order" | "interactive" | "lab",
    prompt: String,
    lab: String,
    configVersion: Number,
    config: Schema.Types.Mixed,
    options: [String],
    correctIndex: Number,
    answer: Number,
    explanation: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

Indexes: unique `{ courseId: 1, slug: 1 }`, plus `{ courseId: 1, unitSlug: 1, order: 1 }`.

### `progress`

Use one document per user/course. This keeps dashboard reads small and avoids an unbounded progress array on the user document.

```js
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  activeLessonId: ObjectId,
  lessons: [{
    lessonId: ObjectId,
    status: "locked" | "active" | "completed",
    bestAccuracy: Number,
    bestTimeSeconds: Number,
    attempts: Number,
    completedAt: Date
  }],
  mastery: Map<String, Number>, // concept key -> 0..1
  updatedAt: Date
}
```

Indexes: unique `{ userId: 1, courseId: 1 }`, plus `{ userId: 1, updatedAt: -1 }`.

### `attempts`

Attempt history is append-only and supports analytics without inflating progress documents.

```js
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  lessonId: ObjectId,
  idempotencyKey: String,
  startedAt: Date,
  completedAt: Date,
  correctCount: Number,
  total: Number,
  xpAwarded: Number,
  answers: [{ questionKey: String, correct: Boolean, durationMs: Number }]
}
```

Indexes: unique `{ userId: 1, idempotencyKey: 1 }`, plus `{ userId: 1, completedAt: -1 }` and `{ lessonId: 1, completedAt: -1 }`.

## API contract

- `GET /api/courses` — published catalog plus the authenticated user's lesson statuses.
- `GET /api/courses/:slug` — course units and personalized next lesson.
- `PUT /api/users/me/course-profiles/:courseSlug` — save onboarding answers.
- `PUT /api/users/me/active-course` — explicitly switch the focused course.
- `GET /api/lessons/:slug` — lesson content. Do not send hidden answer keys if server-side validation is required.
- `POST /api/lessons/:slug/check` — validate one answer and return feedback.
- `POST /api/lessons/:slug/complete` — atomically create an attempt, update progress, XP, streak, and hearts.
- `GET /api/users/me/dashboard` — consolidated stats, active course, progress, and daily problem.
- `GET /api/leaderboard?period=week` — cached or pre-aggregated weekly ranking.

## Atomic completion transaction

`POST /lessons/:slug/complete` should run in a MongoDB transaction:

1. Insert the attempt with an idempotency key.
2. Update course progress and unlock the next lesson.
3. Increment XP and update streak dates in the user's timezone.
4. Apply heart changes according to server-side product rules.
5. Return the canonical updated stats used by the completion screen.

Never trust XP, correctness, unlocked status, or streak values supplied by the client.

## Migration from mocks

1. Seed courses and lessons using the existing slugs in `mockData.js`.
2. Replace the hard-coded mock flag with `VITE_USE_MOCKS` in `api.js`.
3. Keep response shapes identical to the mock responses during the first backend iteration.
4. Move answer validation to `/lessons/:slug/check` when cheating resistance matters.
5. Add validation, rate limiting, authentication, and idempotency before enabling XP writes.
