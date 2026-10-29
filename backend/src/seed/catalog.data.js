// Starter catalog inserted by the seed script. Lessons without questions are
// stored as drafts so instructors can finish them in the Lesson Studio.
export const courses = [
  {
    "slug": "calculus",
    "title": "Calculus",
    "tagline": "Rates of change, areas, and the machinery behind both",
    "accent": "amber",
    "icon": "∫"
  },
  {
    "slug": "mechanics",
    "title": "Classical Mechanics",
    "tagline": "Forces, motion, and why things fall the way they do",
    "accent": "teal",
    "icon": "⚙"
  },
  {
    "slug": "algorithms",
    "title": "Algorithms",
    "tagline": "Patterns for solving problems fast, and knowing when you can't",
    "accent": "violet",
    "icon": "⌘"
  },
  {
    "slug": "linear-algebra",
    "title": "Linear Algebra",
    "tagline": "Vectors, transformations, and the geometry inside data",
    "accent": "teal",
    "icon": "↗"
  },
  {
    "slug": "probability",
    "title": "Probability",
    "tagline": "Reason clearly about uncertainty, evidence, and risk",
    "accent": "amber",
    "icon": "◫"
  },
  {
    "slug": "chemistry",
    "title": "Chemistry",
    "tagline": "Understand matter from atoms to energetic reactions",
    "accent": "violet",
    "icon": "◇"
  },
  {
    "slug": "astronomy",
    "title": "Astronomy",
    "tagline": "Use physics to read the story written across the sky",
    "accent": "teal",
    "icon": "✦"
  },
  {
    "slug": "daily-challenge",
    "title": "Daily Challenge",
    "tagline": "One short puzzle a day",
    "accent": "amber",
    "icon": "★",
    "published": false
  }
];

export const lessons = [
  {
    "slug": "limits",
    "course": "calculus",
    "title": "Limits",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "derivatives",
    "course": "calculus",
    "title": "Derivatives",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "chain-rule",
    "course": "calculus",
    "title": "Chain Rule",
    "order": 3,
    "xp": 25,
    "difficulty": "intermediate",
    "estimatedMinutes": 12,
    "published": true,
    "questions": [
      {
        "id": "slope-lab",
        "type": "lab",
        "lab": "slope",
        "prompt": "Scan a curve and discover how its slope changes."
      },
      {
        "id": "explore-composition",
        "type": "interactive",
        "prompt": "Explore how the chain rule follows a composed function.",
        "expression": "y = (3x + 1)^{4}",
        "inner": {
          "label": "Inner function",
          "math": "u = 3x + 1",
          "explanation": "Differentiate the inside: $\\frac{du}{dx} = 3$."
        },
        "outer": {
          "label": "Outer function",
          "math": "y = u^{4}",
          "explanation": "Differentiate the outside: $\\frac{dy}{du} = 4u^{3}$."
        },
        "explanation": "The chain rule multiplies both rates: $\\frac{dy}{dx} = \\frac{dy}{du}\\frac{du}{dx}$."
      },
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "If $f(x) = (3x + 1)^{4}$, what is $f'(x)$?",
        "options": [
          "4(3x + 1)^{3}",
          "12(3x + 1)^{3}",
          "4(3x)^{3}",
          "12x(3x + 1)^{3}"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "Differentiate the outer power, then multiply by the inner derivative: $4(3x+1)^{3} \\cdot 3 = 12(3x+1)^{3}$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "Let $g(x) = \\sin(2x)$. Find $g'(0)$.",
        "answer": 2,
        "explanation": "$g'(x) = 2\\cos(2x)$, and $\\cos(0) = 1$, so $g'(0) = 2$."
      },
      {
        "id": "q3",
        "type": "order",
        "prompt": "Put these steps in order to differentiate $y = (x^{2} + 1)^{5}$.",
        "items": [
          "Identify outer function $u^{5}$ and inner function $u = x^{2} + 1$",
          "Differentiate the outer part: $5u^{4}$",
          "Differentiate the inner part: $2x$",
          "Multiply: $5(x^{2} + 1)^{4} \\cdot 2x$"
        ],
        "explanation": "The chain rule is always: differentiate the outside, keep the inside, then multiply by the derivative of the inside."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "The chain rule is used when a function is...",
        "options": [
          "A sum of two functions",
          "A function composed inside another function",
          "A quotient of two functions",
          "A constant multiple of a function"
        ],
        "correctIndex": 1,
        "explanation": "Composition — one function nested inside another — is exactly the case the chain rule handles."
      }
    ]
  },
  {
    "slug": "integrals",
    "course": "calculus",
    "title": "Integrals",
    "order": 4,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "series",
    "course": "calculus",
    "title": "Series",
    "order": 5,
    "xp": 35,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "differential-equations",
    "course": "calculus",
    "title": "Differential Equations",
    "order": 6,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "multivariable",
    "course": "calculus",
    "title": "Multivariable",
    "order": 7,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "kinematics",
    "course": "mechanics",
    "title": "Kinematics",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "newtons-laws",
    "course": "mechanics",
    "title": "Newton's Laws",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "force-lab",
        "type": "lab",
        "lab": "force",
        "prompt": "Balance force and mass to produce a target acceleration."
      },
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A $2\\,\\mathrm{kg}$ object accelerates at $3\\,\\mathrm{m/s^{2}}$. What net force acts on it?",
        "options": [
          "1.5\\,\\mathrm{N}",
          "5\\,\\mathrm{N}",
          "6\\,\\mathrm{N}",
          "9\\,\\mathrm{N}"
        ],
        "optionsAreMath": true,
        "correctIndex": 2,
        "explanation": "$F = ma = 2\\,\\mathrm{kg} \\times 3\\,\\mathrm{m/s^{2}} = 6\\,\\mathrm{N}$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "In newtons, what force supports a $10\\,\\mathrm{kg}$ object at rest when $g = 10\\,\\mathrm{m/s^{2}}$?",
        "answer": 100,
        "explanation": "The supporting force balances gravity: $F = mg = 10 \\times 10 = 100\\,\\mathrm{N}$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Newton's Third Law says every action has...",
        "options": [
          "An equal reaction in the same direction",
          "An equal and opposite reaction",
          "A smaller opposite reaction",
          "No guaranteed reaction"
        ],
        "correctIndex": 1,
        "explanation": "Forces come in equal-magnitude, opposite-direction pairs acting on different bodies."
      }
    ]
  },
  {
    "slug": "energy",
    "course": "mechanics",
    "title": "Energy",
    "order": 3,
    "xp": 25,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "momentum",
    "course": "mechanics",
    "title": "Momentum",
    "order": 4,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "rotation",
    "course": "mechanics",
    "title": "Rotation",
    "order": 5,
    "xp": 35,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "gravitation",
    "course": "mechanics",
    "title": "Gravitation",
    "order": 6,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "big-o",
    "course": "algorithms",
    "title": "Big-O Notation",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "recursion",
    "course": "algorithms",
    "title": "Recursion",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "What must every correct recursive function have?",
        "options": [
          "A loop",
          "A base case",
          "A global variable",
          "Multiple return statements"
        ],
        "correctIndex": 1,
        "explanation": "Without a base case, the recursion never stops and the call stack overflows."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "What does $4!$ evaluate to?",
        "answer": 24,
        "explanation": "$4! = 4 \\times 3 \\times 2 \\times 1 = 24$."
      },
      {
        "id": "q3",
        "type": "order",
        "prompt": "Order the call stack for factorial(3) from first pushed to last resolved.",
        "items": [
          "factorial(3) calls factorial(2)",
          "factorial(2) calls factorial(1)",
          "factorial(1) hits base case, returns 1",
          "Stack unwinds, multiplying results back up"
        ],
        "explanation": "Recursive calls stack up until the base case, then resolve back in reverse order."
      }
    ]
  },
  {
    "slug": "sorting",
    "course": "algorithms",
    "title": "Sorting",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "graphs",
    "course": "algorithms",
    "title": "Graph Traversal",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "dynamic-programming",
    "course": "algorithms",
    "title": "Dynamic Programming",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "greedy",
    "course": "algorithms",
    "title": "Greedy Methods",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "vectors",
    "course": "linear-algebra",
    "title": "Vectors",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "vector-lab",
        "type": "lab",
        "lab": "vector",
        "prompt": "Compose a vector with a target magnitude."
      },
      {
        "id": "v1",
        "type": "mcq",
        "prompt": "Which vector points three units right and two units up?",
        "options": [
          "\\begin{bmatrix}3\\\\2\\end{bmatrix}",
          "\\begin{bmatrix}2\\\\3\\end{bmatrix}",
          "\\begin{bmatrix}-3\\\\2\\end{bmatrix}"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "The first component measures horizontal change and the second measures vertical change."
      },
      {
        "id": "v2",
        "type": "numeric",
        "prompt": "What is the magnitude of $\\begin{bmatrix}3\\\\4\\end{bmatrix}$?",
        "answer": 5,
        "explanation": "Use the Pythagorean theorem: $\\sqrt{3^2+4^2}=5$."
      }
    ]
  },
  {
    "slug": "matrices",
    "course": "linear-algebra",
    "title": "Matrices",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "transformations",
    "course": "linear-algebra",
    "title": "Transformations",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "eigenvectors",
    "course": "linear-algebra",
    "title": "Eigenvectors",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "orthogonality",
    "course": "linear-algebra",
    "title": "Orthogonality",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "decompositions",
    "course": "linear-algebra",
    "title": "Decompositions",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "probability-basics",
    "course": "probability",
    "title": "Chance",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "chance-lab",
        "type": "lab",
        "lab": "probability",
        "prompt": "Estimate a hidden probability from repeated evidence."
      },
      {
        "id": "p1",
        "type": "mcq",
        "prompt": "A fair die is rolled once. What is $P(\\text{even})$?",
        "options": [
          "\\frac{1}{6}",
          "\\frac{1}{3}",
          "\\frac{1}{2}",
          "\\frac{2}{3}"
        ],
        "optionsAreMath": true,
        "correctIndex": 2,
        "explanation": "Three of the six equally likely outcomes are even, so the probability is $3/6=1/2$."
      },
      {
        "id": "p2",
        "type": "numeric",
        "prompt": "A bag has 7 blue and 3 gold tokens. What percent are gold?",
        "answer": 30,
        "explanation": "There are 10 tokens total, and $3/10=30\\%$."
      }
    ]
  },
  {
    "slug": "conditional",
    "course": "probability",
    "title": "Conditional",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "distributions",
    "course": "probability",
    "title": "Distributions",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "bayes",
    "course": "probability",
    "title": "Bayes' Rule",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "expectation",
    "course": "probability",
    "title": "Expected Value",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "inference",
    "course": "probability",
    "title": "Inference",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "atoms",
    "course": "chemistry",
    "title": "Atomic Structure",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "published": true,
    "questions": [
      {
        "id": "a1",
        "type": "mcq",
        "prompt": "Which particle determines an element's atomic number?",
        "options": [
          "Electron",
          "Neutron",
          "Proton",
          "Photon"
        ],
        "correctIndex": 2,
        "explanation": "The atomic number is the number of protons in the nucleus."
      },
      {
        "id": "a2",
        "type": "numeric",
        "prompt": "A neutral carbon atom has 6 protons. How many electrons does it have?",
        "answer": 6,
        "explanation": "A neutral atom has equal numbers of positive protons and negative electrons."
      }
    ]
  },
  {
    "slug": "bonding",
    "course": "chemistry",
    "title": "Bonding",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "reactions",
    "course": "chemistry",
    "title": "Reactions",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "equilibrium",
    "course": "chemistry",
    "title": "Equilibrium",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "thermochemistry",
    "course": "chemistry",
    "title": "Thermochemistry",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "organic",
    "course": "chemistry",
    "title": "Organic Chemistry",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "stars",
    "course": "astronomy",
    "title": "Life of Stars",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "published": true,
    "questions": [
      {
        "id": "s1",
        "type": "mcq",
        "prompt": "What powers a main-sequence star?",
        "options": [
          "Chemical burning",
          "Nuclear fusion",
          "Gravitational friction",
          "Radioactive decay"
        ],
        "correctIndex": 1,
        "explanation": "Hydrogen nuclei fuse into helium in the core, releasing energy."
      },
      {
        "id": "s2",
        "type": "mcq",
        "prompt": "A star's color is most directly related to its...",
        "options": [
          "distance",
          "age",
          "surface temperature",
          "number of planets"
        ],
        "correctIndex": 2,
        "explanation": "Hotter stars peak at bluer wavelengths; cooler stars appear redder."
      }
    ]
  },
  {
    "slug": "orbits",
    "course": "astronomy",
    "title": "Orbits",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "galaxies",
    "course": "astronomy",
    "title": "Galaxies",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "cosmology",
    "course": "astronomy",
    "title": "Cosmology",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "relativity",
    "course": "astronomy",
    "title": "Relativity",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "exoplanets",
    "course": "astronomy",
    "title": "Exoplanets",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "published": false,
    "questions": []
  },
  {
    "slug": "bonus-pattern",
    "course": "daily-challenge",
    "title": "Problem of the Day",
    "order": 1,
    "xp": 10,
    "difficulty": "intermediate",
    "estimatedMinutes": 2,
    "published": true,
    "questions": [
      {
        "id": "daily-derivative",
        "type": "mcq",
        "prompt": "If $h(x) = \\sqrt{x^{2}+1}$, which derivative is correct?",
        "options": [
          "\\frac{x}{\\sqrt{x^{2}+1}}",
          "\\frac{1}{2\\sqrt{x^{2}+1}}",
          "2x\\sqrt{x^{2}+1}",
          "\\sqrt{2x}"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "Write the root as a power, then apply the chain rule: $h'(x)=\\frac{x}{\\sqrt{x^{2}+1}}$."
      }
    ]
  }
];
