// Sample API responses used by the Playwright tests, which intercept /api
// requests instead of calling the real server.
import { TIERS, weekBounds } from "../../src/lib/leagues.js";

export const courses = [
  {
    id: "calculus",
    title: "Calculus",
    tagline: "Rates of change, areas, and the machinery behind both",
    accent: "amber",
    icon: "∫",
    nodes: [
      { id: "limits", title: "Limits", xp: 20, summary: "What a function approaches as its input closes in on a value", difficulty: "beginner", minutes: 6, questionCount: 5, status: "completed" },
      { id: "derivatives", title: "Derivatives", xp: 25, summary: "Measure instantaneous rate of change as the slope of a tangent line", difficulty: "beginner", minutes: 8, questionCount: 5, status: "completed" },
      { id: "chain-rule", title: "Chain Rule", xp: 25, summary: "Differentiate functions nested inside other functions", difficulty: "intermediate", minutes: 12, questionCount: 6, status: "active" },
      { id: "integrals", title: "Integrals", xp: 30, summary: "Accumulate change and find the area under a curve", difficulty: "intermediate", minutes: 7, questionCount: 5, status: "locked" },
      { id: "series", title: "Series", xp: 35, summary: "Add infinitely many terms and decide when the sum is finite", difficulty: "advanced", minutes: 7, questionCount: 4, status: "locked" },
      { id: "differential-equations", title: "Differential Equations", xp: 40, summary: "Equations that link a quantity to its own rate of change", difficulty: "advanced", minutes: 8, questionCount: 4, status: "locked" },
      { id: "multivariable", title: "Multivariable", xp: 45, summary: "Extend calculus to functions of several variables", difficulty: "advanced", minutes: 8, questionCount: 4, status: "locked" },
    ],
  },
  {
    id: "mechanics",
    title: "Classical Mechanics",
    tagline: "Forces, motion, and why things fall the way they do",
    accent: "teal",
    icon: "⚙",
    nodes: [
      { id: "kinematics", title: "Kinematics", xp: 20, status: "completed" },
      { id: "newtons-laws", title: "Newton's Laws", xp: 25, status: "active" },
      { id: "energy", title: "Energy", xp: 25, status: "locked" },
      { id: "momentum", title: "Momentum", xp: 30, status: "locked" },
      { id: "rotation", title: "Rotation", xp: 35, status: "locked" },
      { id: "gravitation", title: "Gravitation", xp: 40, status: "locked" },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    tagline: "Patterns for solving problems fast, and knowing when you can't",
    accent: "violet",
    icon: "⌘",
    nodes: [
      { id: "big-o", title: "Big-O Notation", xp: 20, status: "completed" },
      { id: "recursion", title: "Recursion", xp: 25, status: "active" },
      { id: "sorting", title: "Sorting", xp: 30, status: "locked" },
      { id: "graphs", title: "Graph Traversal", xp: 35, status: "locked" },
      { id: "dynamic-programming", title: "Dynamic Programming", xp: 40, status: "locked" },
      { id: "greedy", title: "Greedy Methods", xp: 45, status: "locked" },
    ],
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra",
    tagline: "Vectors, transformations, and the geometry inside data",
    accent: "teal",
    icon: "↗",
    nodes: [
      { id: "vectors", title: "Vectors", xp: 20, status: "active" },
      { id: "matrices", title: "Matrices", xp: 25, status: "locked" },
      { id: "transformations", title: "Transformations", xp: 30, status: "locked" },
      { id: "eigenvectors", title: "Eigenvectors", xp: 35, status: "locked" },
      { id: "orthogonality", title: "Orthogonality", xp: 40, status: "locked" },
      { id: "decompositions", title: "Decompositions", xp: 45, status: "locked" },
    ],
  },
  {
    id: "probability",
    title: "Probability",
    tagline: "Reason clearly about uncertainty, evidence, and risk",
    accent: "amber",
    icon: "◫",
    nodes: [
      { id: "probability-basics", title: "Chance", xp: 20, status: "active" },
      { id: "conditional", title: "Conditional", xp: 25, status: "locked" },
      { id: "distributions", title: "Distributions", xp: 30, status: "locked" },
      { id: "bayes", title: "Bayes' Rule", xp: 35, status: "locked" },
      { id: "expectation", title: "Expected Value", xp: 40, status: "locked" },
      { id: "inference", title: "Inference", xp: 45, status: "locked" },
    ],
  },
  {
    id: "chemistry",
    title: "Chemistry",
    tagline: "Understand matter from atoms to energetic reactions",
    accent: "violet",
    icon: "◇",
    nodes: [
      { id: "atoms", title: "Atomic Structure", xp: 20, status: "active" },
      { id: "bonding", title: "Bonding", xp: 25, status: "locked" },
      { id: "reactions", title: "Reactions", xp: 30, status: "locked" },
      { id: "equilibrium", title: "Equilibrium", xp: 35, status: "locked" },
      { id: "thermochemistry", title: "Thermochemistry", xp: 40, status: "locked" },
      { id: "organic", title: "Organic Chemistry", xp: 45, status: "locked" },
    ],
  },
  {
    id: "astronomy",
    title: "Astronomy",
    tagline: "Use physics to read the story written across the sky",
    accent: "teal",
    icon: "✦",
    nodes: [
      { id: "stars", title: "Life of Stars", xp: 20, status: "active" },
      { id: "orbits", title: "Orbits", xp: 25, status: "locked" },
      { id: "galaxies", title: "Galaxies", xp: 30, status: "locked" },
      { id: "cosmology", title: "Cosmology", xp: 35, status: "locked" },
      { id: "relativity", title: "Relativity", xp: 40, status: "locked" },
      { id: "exoplanets", title: "Exoplanets", xp: 45, status: "locked" },
    ],
  },
];

// Each lesson is a sequence of interactive checks — mirrors a "questions"
// collection keyed by lessonId in your real schema.
export const lessons = {
  "chain-rule": {
    title: "Chain Rule",
    course: "Calculus",
    questions: [
      {
        id: "slope-lab",
        type: "lab",
        lab: "slope",
        prompt: "Scan a curve and discover how its slope changes.",
      },
      {
        id: "explore-composition",
        type: "interactive",
        prompt: "Explore how the chain rule follows a composed function.",
        expression: "y = (3x + 1)^{4}",
        inner: { label: "Inner function", math: "u = 3x + 1", explanation: "Differentiate the inside: $\\frac{du}{dx} = 3$." },
        outer: { label: "Outer function", math: "y = u^{4}", explanation: "Differentiate the outside: $\\frac{dy}{du} = 4u^{3}$." },
        explanation: "The chain rule multiplies both rates: $\\frac{dy}{dx} = \\frac{dy}{du}\\frac{du}{dx}$.",
      },
      {
        id: "q1",
        type: "mcq",
        prompt: "If $f(x) = (3x + 1)^{4}$, what is $f'(x)$?",
        options: ["4(3x + 1)^{3}", "12(3x + 1)^{3}", "4(3x)^{3}", "12x(3x + 1)^{3}"],
        optionsAreMath: true,
        correctIndex: 1,
        explanation:
          "Differentiate the outer power, then multiply by the inner derivative: $4(3x+1)^{3} \\cdot 3 = 12(3x+1)^{3}$.",
      },
      {
        id: "q2",
        type: "numeric",
        prompt: "Let $g(x) = \\sin(2x)$. Find $g'(0)$.",
        answer: 2,
        explanation: "$g'(x) = 2\\cos(2x)$, and $\\cos(0) = 1$, so $g'(0) = 2$.",
      },
      {
        id: "q3",
        type: "order",
        prompt: "Put these steps in order to differentiate $y = (x^{2} + 1)^{5}$.",
        items: [
          "Identify outer function $u^{5}$ and inner function $u = x^{2} + 1$",
          "Differentiate the outer part: $5u^{4}$",
          "Differentiate the inner part: $2x$",
          "Multiply: $5(x^{2} + 1)^{4} \\cdot 2x$",
        ],
        explanation:
          "The chain rule is always: differentiate the outside, keep the inside, then multiply by the derivative of the inside.",
      },
      {
        id: "q4",
        type: "mcq",
        prompt: "The chain rule is used when a function is...",
        options: [
          "A sum of two functions",
          "A function composed inside another function",
          "A quotient of two functions",
          "A constant multiple of a function",
        ],
        correctIndex: 1,
        explanation:
          "Composition — one function nested inside another — is exactly the case the chain rule handles.",
      },
    ],
  },
  "bonus-pattern": {
    title: "Problem of the Day",
    course: "Daily Challenge",
    questions: [
      {
        id: "daily-derivative",
        type: "mcq",
        prompt: "If $h(x) = \\sqrt{x^{2}+1}$, which derivative is correct?",
        options: ["\\frac{x}{\\sqrt{x^{2}+1}}", "\\frac{1}{2\\sqrt{x^{2}+1}}", "2x\\sqrt{x^{2}+1}", "\\sqrt{2x}"],
        optionsAreMath: true,
        correctIndex: 0,
        explanation: "Write the root as a power, then apply the chain rule: $h'(x)=\\frac{x}{\\sqrt{x^{2}+1}}$.",
      },
    ],
  },
  vectors: {
    title: "Vectors",
    course: "Linear Algebra",
    questions: [
      { id: "vector-lab", type: "lab", lab: "vector", prompt: "Compose a vector with a target magnitude." },
      { id: "v1", type: "mcq", prompt: "Which vector points three units right and two units up?", options: ["\\begin{bmatrix}3\\\\2\\end{bmatrix}", "\\begin{bmatrix}2\\\\3\\end{bmatrix}", "\\begin{bmatrix}-3\\\\2\\end{bmatrix}"], optionsAreMath: true, correctIndex: 0, explanation: "The first component measures horizontal change and the second measures vertical change." },
      { id: "v2", type: "numeric", prompt: "What is the magnitude of $\\begin{bmatrix}3\\\\4\\end{bmatrix}$?", answer: 5, explanation: "Use the Pythagorean theorem: $\\sqrt{3^2+4^2}=5$." },
    ],
  },
  "probability-basics": {
    title: "Chance",
    course: "Probability",
    questions: [
      { id: "chance-lab", type: "lab", lab: "probability", prompt: "Estimate a hidden probability from repeated evidence." },
      { id: "p1", type: "mcq", prompt: "A fair die is rolled once. What is $P(\\text{even})$?", options: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"], optionsAreMath: true, correctIndex: 2, explanation: "Three of the six equally likely outcomes are even, so the probability is $3/6=1/2$." },
      { id: "p2", type: "numeric", prompt: "A bag has 7 blue and 3 gold tokens. What percent are gold?", answer: 30, explanation: "There are 10 tokens total, and $3/10=30\\%$." },
    ],
  },
  atoms: {
    title: "Atomic Structure",
    course: "Chemistry",
    questions: [
      { id: "a1", type: "mcq", prompt: "Which particle determines an element's atomic number?", options: ["Electron", "Neutron", "Proton", "Photon"], correctIndex: 2, explanation: "The atomic number is the number of protons in the nucleus." },
      { id: "a2", type: "numeric", prompt: "A neutral carbon atom has 6 protons. How many electrons does it have?", answer: 6, explanation: "A neutral atom has equal numbers of positive protons and negative electrons." },
    ],
  },
  stars: {
    title: "Life of Stars",
    course: "Astronomy",
    questions: [
      { id: "s1", type: "mcq", prompt: "What powers a main-sequence star?", options: ["Chemical burning", "Nuclear fusion", "Gravitational friction", "Radioactive decay"], correctIndex: 1, explanation: "Hydrogen nuclei fuse into helium in the core, releasing energy." },
      { id: "s2", type: "mcq", prompt: "A star's color is most directly related to its...", options: ["distance", "age", "surface temperature", "number of planets"], correctIndex: 2, explanation: "Hotter stars peak at bluer wavelengths; cooler stars appear redder." },
    ],
  },
  "newtons-laws": {
    title: "Newton's Laws",
    course: "Classical Mechanics",
    questions: [
      { id: "force-lab", type: "lab", lab: "force", prompt: "Balance force and mass to produce a target acceleration." },
      {
        id: "q1",
        type: "mcq",
        prompt: "A $2\\,\\mathrm{kg}$ object accelerates at $3\\,\\mathrm{m/s^{2}}$. What net force acts on it?",
        options: ["1.5\\,\\mathrm{N}", "5\\,\\mathrm{N}", "6\\,\\mathrm{N}", "9\\,\\mathrm{N}"],
        optionsAreMath: true,
        correctIndex: 2,
        explanation: "$F = ma = 2\\,\\mathrm{kg} \\times 3\\,\\mathrm{m/s^{2}} = 6\\,\\mathrm{N}$.",
      },
      {
        id: "q2",
        type: "numeric",
        prompt: "In newtons, what force supports a $10\\,\\mathrm{kg}$ object at rest when $g = 10\\,\\mathrm{m/s^{2}}$?",
        answer: 100,
        explanation: "The supporting force balances gravity: $F = mg = 10 \\times 10 = 100\\,\\mathrm{N}$.",
      },
      {
        id: "q3",
        type: "mcq",
        prompt: "Newton's Third Law says every action has...",
        options: [
          "An equal reaction in the same direction",
          "An equal and opposite reaction",
          "A smaller opposite reaction",
          "No guaranteed reaction",
        ],
        correctIndex: 1,
        explanation: "Forces come in equal-magnitude, opposite-direction pairs acting on different bodies.",
      },
    ],
  },
  recursion: {
    title: "Recursion",
    course: "Algorithms",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "What must every correct recursive function have?",
        options: [
          "A loop",
          "A base case",
          "A global variable",
          "Multiple return statements",
        ],
        correctIndex: 1,
        explanation: "Without a base case, the recursion never stops and the call stack overflows.",
      },
      {
        id: "q2",
        type: "numeric",
        prompt: "What does $4!$ evaluate to?",
        answer: 24,
        explanation: "$4! = 4 \\times 3 \\times 2 \\times 1 = 24$.",
      },
      {
        id: "q3",
        type: "order",
        prompt: "Order the call stack for factorial(3) from first pushed to last resolved.",
        items: [
          "factorial(3) calls factorial(2)",
          "factorial(2) calls factorial(1)",
          "factorial(1) hits base case, returns 1",
          "Stack unwinds, multiplying results back up",
        ],
        explanation: "Recursive calls stack up until the base case, then resolve back in reverse order.",
      },
    ],
  },
};

// One weekly league cohort, ranked by XP earned this week.
export const leaderboard = [
  { rank: 1, name: "Chamodi P.", xp: 612, streak: 41 },
  { rank: 2, name: "Nadeesha R.", xp: 540, streak: 19 },
  { rank: 3, name: "Kavindu S.", xp: 488, streak: 8 },
  { rank: 4, name: "Tharusha W.", xp: 431, streak: 27 },
  { rank: 5, name: "You", xp: 380, streak: 12, isYou: true },
  { rank: 6, name: "Dinithi K.", xp: 355, streak: 5 },
  { rank: 7, name: "Ishan M.", xp: 322, streak: 14 },
  { rank: 8, name: "Sanduni F.", xp: 301, streak: 3 },
  { rank: 9, name: "Ravindu J.", xp: 276, streak: 9 },
  { rank: 10, name: "Malsha D.", xp: 240, streak: 2 },
  { rank: 11, name: "Pasindu L.", xp: 212, streak: 6 },
  { rank: 12, name: "Hiruni A.", xp: 180, streak: 11 },
  { rank: 13, name: "Yasiru G.", xp: 150, streak: 1 },
  { rank: 14, name: "Oshadi N.", xp: 131, streak: 4 },
  { rank: 15, name: "Lahiru B.", xp: 96, streak: 7 },
  { rank: 16, name: "Sachini T.", xp: 74, streak: 0 },
  { rank: 17, name: "Dulaj H.", xp: 52, streak: 3 },
  { rank: 18, name: "Amaya C.", xp: 40, streak: 1 },
  { rank: 19, name: "Nimesh E.", xp: 22, streak: 2 },
  { rank: 20, name: "Gayani V.", xp: 10, streak: 0 }
];

const week = weekBounds();
export const currentLeague = { ...TIERS[3], tier: 3, points: 380, joined: true, weekEndsAt: week.endsAt };

export const leagueStandings = {
  week,
  tiers: TIERS,
  league: currentLeague,
  joined: true,
  cohortSize: 30,
  zones: { promote: 7, demote: 5 },
  rows: leaderboard,
  lastResult: { outcome: "promoted", fromTier: 2, toTier: 3, rank: 2 },
};

export const currentUser = {
  name: "You",
  email: "you@example.com",
  bio: "Learning one powerful idea at a time.",
  xp: 4150,
  gems: 680,
  streak: 12,
  hearts: 5,
  maxHearts: 5,
  completedLessons: 8,
  totalStudySeconds: 7240,
  longestStreak: 18,
  league: currentLeague,
  joined: "2026-02-01",
  badges: [
    { id: "b1", label: "7-Day Streak", icon: "🔥" },
    { id: "b2", label: "Calculus Novice", icon: "∫" },
    { id: "b3", label: "First Perfect Lesson", icon: "★" },
  ],
};
