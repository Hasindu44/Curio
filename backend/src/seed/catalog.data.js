// Starter catalog inserted by the seed script. Every lesson ships with its
// questions so the whole learning path can be played.
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
    "summary": "What a function approaches as its input closes in on a value",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "What does $\\lim_{x \\to 2} f(x) = 5$ mean?",
        "options": [
          "$f(2)$ must equal 5",
          "$f(x)$ gets arbitrarily close to 5 as $x$ approaches 2",
          "$f(x)$ is never equal to 5",
          "$f$ is undefined at 2"
        ],
        "correctIndex": 1,
        "explanation": "A limit describes where the outputs are heading, not necessarily the value at the point itself."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "Evaluate $\\lim_{x \\to 3} (2x + 1)$.",
        "answer": 7,
        "explanation": "Polynomials are continuous, so substitute directly: $2(3) + 1 = 7$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "Evaluate $\\lim_{x \\to 2} \\frac{x^{2} - 4}{x - 2}$.",
        "answer": 4,
        "explanation": "Factor: $\\frac{(x-2)(x+2)}{x-2} = x + 2$ for $x \\neq 2$, which approaches $4$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "If the left-hand limit is 1 and the right-hand limit is 3, the two-sided limit...",
        "options": [
          "Equals 2",
          "Equals 3",
          "Does not exist",
          "Equals 1"
        ],
        "correctIndex": 2,
        "explanation": "A two-sided limit exists only when both one-sided limits agree."
      },
      {
        "id": "q5",
        "type": "mcq",
        "prompt": "What is $\\lim_{x \\to \\infty} \\frac{1}{x}$?",
        "options": [
          "0",
          "1",
          "\\infty",
          "\\text{undefined}"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "As $x$ grows without bound, $\\frac{1}{x}$ shrinks toward $0$."
      }
    ]
  },
  {
    "slug": "derivatives",
    "course": "calculus",
    "title": "Derivatives",
    "summary": "Measure instantaneous rate of change as the slope of a tangent line",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "slope-lab",
        "type": "lab",
        "lab": "slope",
        "prompt": "Scan a curve and discover how its slope changes."
      },
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "The derivative $f'(a)$ represents...",
        "options": [
          "The area under $f$ up to $a$",
          "The slope of the tangent line at $x = a$",
          "The value of $f$ at $a$",
          "The average of $f$ on $[0, a]$"
        ],
        "correctIndex": 1,
        "explanation": "The derivative is the instantaneous rate of change: the tangent slope at that point."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Using the power rule, what is $\\frac{d}{dx} x^{5}$?",
        "options": [
          "5x^{4}",
          "x^{4}",
          "5x^{5}",
          "4x^{5}"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "Bring the exponent down and subtract one: $5x^{4}$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "If $f(x) = 3x^{2}$, find $f'(2)$.",
        "answer": 12,
        "explanation": "$f'(x) = 6x$, so $f'(2) = 12$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "What is the derivative of a constant, like $f(x) = 7$?",
        "options": [
          "7",
          "1",
          "0",
          "x"
        ],
        "optionsAreMath": true,
        "correctIndex": 2,
        "explanation": "A constant never changes, so its rate of change is $0$."
      }
    ]
  },
  {
    "slug": "chain-rule",
    "course": "calculus",
    "title": "Chain Rule",
    "summary": "Differentiate functions nested inside other functions",
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
    "summary": "Accumulate change and find the area under a curve",
    "order": 4,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A definite integral $\\int_a^b f(x)\\,dx$ of a positive function measures...",
        "options": [
          "The slope at $b$",
          "The area under $f$ between $a$ and $b$",
          "The maximum of $f$",
          "The average slope"
        ],
        "correctIndex": 1,
        "explanation": "For a positive function, the definite integral equals the area between the curve and the $x$-axis."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Which is an antiderivative of $2x$?",
        "options": [
          "x^{2} + C",
          "2",
          "2x^{2} + C",
          "\\frac{x}{2} + C"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "Differentiating $x^{2} + C$ gives $2x$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "Evaluate $\\int_0^3 2x\\,dx$.",
        "answer": 9,
        "explanation": "$[x^{2}]_0^3 = 9 - 0 = 9$."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "Evaluate $\\int_1^4 5\\,dx$.",
        "answer": 15,
        "explanation": "A constant height of 5 over a width of 3 gives a rectangle of area $15$."
      },
      {
        "id": "q5",
        "type": "order",
        "prompt": "Order the steps to evaluate $\\int_a^b f(x)\\,dx$ with the Fundamental Theorem.",
        "items": [
          "Find an antiderivative $F$ of $f$",
          "Evaluate $F(b)$",
          "Evaluate $F(a)$",
          "Subtract: $F(b) - F(a)$"
        ],
        "explanation": "The Fundamental Theorem of Calculus turns area into a difference of antiderivative values."
      }
    ]
  },
  {
    "slug": "series",
    "course": "calculus",
    "title": "Series",
    "summary": "Add infinitely many terms and decide when the sum is finite",
    "order": 5,
    "xp": 35,
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "Find the sum $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots$",
        "answer": 2,
        "explanation": "Geometric series: $\\frac{a}{1-r} = \\frac{1}{1 - 1/2} = 2$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "A geometric series $\\sum ar^{n}$ converges when...",
        "options": [
          "|r| < 1",
          "|r| > 1",
          "r = 1",
          "a < 1"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "The terms must shrink, which happens exactly when $|r| < 1$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "The harmonic series $1 + \\frac{1}{2} + \\frac{1}{3} + \\cdots$...",
        "options": [
          "Converges to 2",
          "Converges to $\\ln 2$",
          "Diverges",
          "Converges to 1"
        ],
        "correctIndex": 2,
        "explanation": "Even though its terms shrink, the harmonic series grows without bound."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "If $\\lim_{n \\to \\infty} a_n \\neq 0$, then $\\sum a_n$...",
        "options": [
          "Must converge",
          "Must diverge",
          "Might do either",
          "Equals $\\lim a_n$"
        ],
        "correctIndex": 1,
        "explanation": "This is the divergence test: terms that don't shrink to zero can't produce a finite sum."
      }
    ]
  },
  {
    "slug": "differential-equations",
    "course": "calculus",
    "title": "Differential Equations",
    "summary": "Equations that link a quantity to its own rate of change",
    "order": 6,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A differential equation relates a function to...",
        "options": [
          "Its inverse",
          "Its derivatives",
          "Its integral bounds",
          "Its domain"
        ],
        "correctIndex": 1,
        "explanation": "Differential equations describe how a quantity changes in terms of the quantity itself."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Which function solves $\\frac{dy}{dx} = y$?",
        "options": [
          "y = x^{2}",
          "y = Ce^{x}",
          "y = \\ln x",
          "y = \\sin x"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "$e^{x}$ is its own derivative, so any multiple $Ce^{x}$ works."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "If $\\frac{dy}{dx} = 2y$ and $y(0) = 3$, how fast is $y$ changing at $x = 0$?",
        "answer": 6,
        "explanation": "Plug in: $y'(0) = 2 \\times y(0) = 2 \\times 3 = 6$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "$\\frac{dP}{dt} = kP$ with $k > 0$ models...",
        "options": [
          "Exponential growth",
          "Linear decay",
          "Oscillation",
          "Constant population"
        ],
        "correctIndex": 0,
        "explanation": "The growth rate is proportional to the current size, producing exponential growth."
      }
    ]
  },
  {
    "slug": "multivariable",
    "course": "calculus",
    "title": "Multivariable",
    "summary": "Extend calculus to functions of several variables",
    "order": 7,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "When finding $\\frac{\\partial f}{\\partial x}$, you treat $y$ as...",
        "options": [
          "A second variable to differentiate",
          "A constant",
          "Zero",
          "Equal to $x$"
        ],
        "correctIndex": 1,
        "explanation": "A partial derivative varies one input while holding the others fixed."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "If $f(x, y) = x^{2}y$, what is $\\frac{\\partial f}{\\partial x}$?",
        "options": [
          "2xy",
          "x^{2}",
          "2x",
          "x^{2}y"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "Treat $y$ as constant: $\\frac{\\partial}{\\partial x} x^{2}y = 2xy$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "For $f(x, y) = 3x + 4y$, what is $\\frac{\\partial f}{\\partial y}$?",
        "answer": 4,
        "explanation": "Hold $x$ fixed; only the $4y$ term changes with $y$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "The gradient $\\nabla f$ points in the direction of...",
        "options": [
          "Steepest increase of $f$",
          "Steepest decrease of $f$",
          "Zero change",
          "The $x$-axis"
        ],
        "correctIndex": 0,
        "explanation": "The gradient points uphill, and its length is the steepest slope."
      }
    ]
  },
  {
    "slug": "kinematics",
    "course": "mechanics",
    "title": "Kinematics",
    "summary": "Describe motion with position, velocity and acceleration",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "A car travels $120\\,\\mathrm{m}$ in $6\\,\\mathrm{s}$. What is its average speed in m/s?",
        "answer": 20,
        "explanation": "$v = \\frac{d}{t} = \\frac{120}{6} = 20\\,\\mathrm{m/s}$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "Starting from rest, a bike accelerates at $2\\,\\mathrm{m/s^{2}}$ for $5\\,\\mathrm{s}$. What is its final speed in m/s?",
        "answer": 10,
        "explanation": "$v = u + at = 0 + 2 \\times 5 = 10\\,\\mathrm{m/s}$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Acceleration is the rate of change of...",
        "options": [
          "Position",
          "Velocity",
          "Distance",
          "Mass"
        ],
        "correctIndex": 1,
        "explanation": "Acceleration measures how quickly velocity changes."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "From rest, an object accelerates at $4\\,\\mathrm{m/s^{2}}$ for $3\\,\\mathrm{s}$. How far does it travel in metres?",
        "answer": 18,
        "explanation": "$s = \\frac{1}{2}at^{2} = \\frac{1}{2} \\times 4 \\times 9 = 18\\,\\mathrm{m}$."
      }
    ]
  },
  {
    "slug": "newtons-laws",
    "course": "mechanics",
    "title": "Newton's Laws",
    "summary": "Force, mass and acceleration, and the three laws that link them",
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
    "summary": "Track kinetic and potential energy as they trade places",
    "order": 3,
    "xp": 25,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "What is the kinetic energy, in joules, of a $2\\,\\mathrm{kg}$ ball moving at $3\\,\\mathrm{m/s}$?",
        "answer": 9,
        "explanation": "$KE = \\frac{1}{2}mv^{2} = \\frac{1}{2} \\times 2 \\times 9 = 9\\,\\mathrm{J}$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "A $5\\,\\mathrm{kg}$ box sits $4\\,\\mathrm{m}$ up a shelf. With $g = 10\\,\\mathrm{m/s^{2}}$, what is its potential energy in joules?",
        "answer": 200,
        "explanation": "$PE = mgh = 5 \\times 10 \\times 4 = 200\\,\\mathrm{J}$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "If you double an object's speed, its kinetic energy...",
        "options": [
          "Doubles",
          "Halves",
          "Quadruples",
          "Stays the same"
        ],
        "correctIndex": 2,
        "explanation": "$KE \\propto v^{2}$, so doubling $v$ multiplies the energy by four."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Without friction, as a pendulum swings down...",
        "options": [
          "Potential energy turns into kinetic energy",
          "Energy is destroyed",
          "Kinetic energy turns into potential energy",
          "Both energies increase"
        ],
        "correctIndex": 0,
        "explanation": "Total mechanical energy is conserved; height is traded for speed."
      }
    ]
  },
  {
    "slug": "momentum",
    "course": "mechanics",
    "title": "Momentum",
    "summary": "Mass in motion, impulse, and conservation in collisions",
    "order": 4,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "What is the momentum, in kg·m/s, of a $3\\,\\mathrm{kg}$ cart moving at $4\\,\\mathrm{m/s}$?",
        "answer": 12,
        "explanation": "$p = mv = 3 \\times 4 = 12\\,\\mathrm{kg\\,m/s}$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "In a collision with no external forces, total momentum...",
        "options": [
          "Increases",
          "Decreases",
          "Is conserved",
          "Becomes zero"
        ],
        "correctIndex": 2,
        "explanation": "Internal forces come in equal and opposite pairs, so total momentum stays constant."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "A $2\\,\\mathrm{kg}$ cart at $6\\,\\mathrm{m/s}$ sticks to a resting $1\\,\\mathrm{kg}$ cart. What is their shared speed in m/s?",
        "answer": 4,
        "explanation": "Momentum before: $12$. After: $(2 + 1)v = 12$, so $v = 4\\,\\mathrm{m/s}$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Impulse equals...",
        "options": [
          "Force × time",
          "Mass × distance",
          "Force ÷ time",
          "Energy × time"
        ],
        "correctIndex": 0,
        "explanation": "Impulse $J = F\\Delta t$, and it equals the change in momentum."
      }
    ]
  },
  {
    "slug": "rotation",
    "course": "mechanics",
    "title": "Rotation",
    "summary": "Torque, angular velocity, and how things spin",
    "order": 5,
    "xp": 35,
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "A $20\\,\\mathrm{N}$ force pushes perpendicular to a wrench $0.5\\,\\mathrm{m}$ from the bolt. What torque, in N·m, does it apply?",
        "answer": 10,
        "explanation": "$\\tau = rF = 0.5 \\times 20 = 10\\,\\mathrm{N\\,m}$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Why is a door handle placed far from the hinges?",
        "options": [
          "It looks better",
          "A longer lever arm gives more torque for the same force",
          "It reduces the door's mass",
          "It increases friction"
        ],
        "correctIndex": 1,
        "explanation": "Torque grows with distance from the pivot, so less force is needed."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "A spinning skater pulls in their arms. Their spin rate...",
        "options": [
          "Decreases",
          "Stays the same",
          "Increases",
          "Stops"
        ],
        "correctIndex": 2,
        "explanation": "Angular momentum $L = I\\omega$ is conserved; reducing $I$ raises $\\omega$."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "A wheel turns through $12\\,\\mathrm{rad}$ in $3\\,\\mathrm{s}$. What is its average angular velocity in rad/s?",
        "answer": 4,
        "explanation": "$\\omega = \\frac{\\theta}{t} = \\frac{12}{3} = 4\\,\\mathrm{rad/s}$."
      }
    ]
  },
  {
    "slug": "gravitation",
    "course": "mechanics",
    "title": "Gravitation",
    "summary": "The universal pull between masses, from apples to planets",
    "order": 6,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "If the distance between two masses doubles, the gravitational force becomes...",
        "options": [
          "Twice as strong",
          "Half as strong",
          "A quarter as strong",
          "Unchanged"
        ],
        "correctIndex": 2,
        "explanation": "Gravity follows an inverse-square law: $F \\propto \\frac{1}{r^{2}}$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "With $g = 10\\,\\mathrm{m/s^{2}}$, what is the weight in newtons of a $60\\,\\mathrm{kg}$ person?",
        "answer": 600,
        "explanation": "$W = mg = 60 \\times 10 = 600\\,\\mathrm{N}$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Ignoring air resistance, a hammer and a feather dropped together...",
        "options": [
          "The hammer lands first",
          "The feather lands first",
          "They land together",
          "Neither falls"
        ],
        "correctIndex": 2,
        "explanation": "All objects fall with the same acceleration $g$ in a vacuum, as shown on the Moon by Apollo 15."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Astronauts on the ISS float because...",
        "options": [
          "There is no gravity in orbit",
          "They are in continuous free fall around Earth",
          "The station shields gravity",
          "Their mass becomes zero"
        ],
        "correctIndex": 1,
        "explanation": "Gravity there is about 90% of surface gravity; they float because they and the station fall together."
      }
    ]
  },
  {
    "slug": "big-o",
    "course": "algorithms",
    "title": "Big-O Notation",
    "summary": "Describe how running time grows as the input gets larger",
    "order": 1,
    "xp": 20,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A loop that visits each of $n$ items once runs in...",
        "options": [
          "O(1)",
          "O(n)",
          "O(n^{2})",
          "O(\\log n)"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "The work grows in direct proportion to $n$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Two nested loops, each over $n$ items, run in...",
        "options": [
          "O(n)",
          "O(2n)",
          "O(n^{2})",
          "O(\\log n)"
        ],
        "optionsAreMath": true,
        "correctIndex": 2,
        "explanation": "For each of $n$ outer steps, the inner loop does $n$ steps: $n \\times n$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Binary search on a sorted array of $n$ items runs in...",
        "options": [
          "O(\\log n)",
          "O(n)",
          "O(n \\log n)",
          "O(1)"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "Each step halves the remaining search space."
      },
      {
        "id": "q4",
        "type": "order",
        "prompt": "Order these growth rates from slowest to fastest.",
        "items": [
          "$O(1)$",
          "$O(\\log n)$",
          "$O(n)$",
          "$O(n^{2})$"
        ],
        "explanation": "Constant < logarithmic < linear < quadratic."
      },
      {
        "id": "q5",
        "type": "numeric",
        "prompt": "Binary search on 1024 sorted items needs at most how many halvings to reach one item?",
        "answer": 10,
        "explanation": "$2^{10} = 1024$, so $\\log_2 1024 = 10$."
      }
    ]
  },
  {
    "slug": "recursion",
    "course": "algorithms",
    "title": "Recursion",
    "summary": "Functions that solve a problem by calling themselves",
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
    "summary": "Put data in order and compare classic sorting strategies",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "What is the average running time of merge sort?",
        "options": [
          "O(n)",
          "O(n \\log n)",
          "O(n^{2})",
          "O(\\log n)"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "Merge sort splits $\\log n$ times and does $O(n)$ merging work per level."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Bubble sort repeatedly...",
        "options": [
          "Splits the list in half",
          "Swaps adjacent items that are out of order",
          "Picks a pivot",
          "Builds a heap"
        ],
        "correctIndex": 1,
        "explanation": "Each pass bubbles the largest remaining item to the end."
      },
      {
        "id": "q3",
        "type": "order",
        "prompt": "Order the steps of merge sort.",
        "items": [
          "Split the list into two halves",
          "Recursively sort each half",
          "Merge the two sorted halves",
          "Return the merged list"
        ],
        "explanation": "Divide, conquer, then combine."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Quicksort's worst case, $O(n^{2})$, happens when...",
        "options": [
          "The pivot always splits evenly",
          "The pivot is always the smallest or largest item",
          "The list has duplicates",
          "The list is short"
        ],
        "correctIndex": 1,
        "explanation": "Unbalanced partitions leave one side with almost every item."
      }
    ]
  },
  {
    "slug": "graphs",
    "course": "algorithms",
    "title": "Graph Traversal",
    "summary": "Explore networks with breadth-first and depth-first search",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "Breadth-first search uses which data structure?",
        "options": [
          "Stack",
          "Queue",
          "Heap",
          "Hash set only"
        ],
        "correctIndex": 1,
        "explanation": "A queue processes nodes level by level, nearest first."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Depth-first search naturally uses...",
        "options": [
          "A queue",
          "A stack (or recursion)",
          "A sorted array",
          "A priority queue"
        ],
        "correctIndex": 1,
        "explanation": "DFS dives deep first, backtracking with a stack."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "In an unweighted graph, which search finds the shortest path?",
        "options": [
          "Depth-first search",
          "Breadth-first search",
          "Random walk",
          "Binary search"
        ],
        "correctIndex": 1,
        "explanation": "BFS reaches every node in order of edge distance from the start."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "A graph has 5 nodes and every pair is connected by one edge. How many edges are there?",
        "answer": 10,
        "explanation": "A complete graph has $\\frac{n(n-1)}{2} = \\frac{5 \\times 4}{2} = 10$ edges."
      }
    ]
  },
  {
    "slug": "dynamic-programming",
    "course": "algorithms",
    "title": "Dynamic Programming",
    "summary": "Solve big problems by remembering answers to small ones",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "Dynamic programming works best when a problem has...",
        "options": [
          "No subproblems",
          "Overlapping subproblems and optimal substructure",
          "Only random inputs",
          "A single loop"
        ],
        "correctIndex": 1,
        "explanation": "Reusing answers to repeated subproblems is what makes DP fast."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "Using $F(0) = 0$ and $F(1) = 1$, what is the Fibonacci number $F(10)$?",
        "answer": 55,
        "explanation": "$0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Memoization means...",
        "options": [
          "Writing comments",
          "Caching results of function calls",
          "Sorting the input",
          "Using more recursion"
        ],
        "correctIndex": 1,
        "explanation": "Store each answer the first time so repeated calls are instant."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Naive recursive Fibonacci takes exponential time. With memoization it takes...",
        "options": [
          "O(2^{n})",
          "O(n)",
          "O(n^{2})",
          "O(1)"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "Each $F(k)$ is computed once, giving linear time."
      }
    ]
  },
  {
    "slug": "greedy",
    "course": "algorithms",
    "title": "Greedy Methods",
    "summary": "Make the locally best choice and learn when that works",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A greedy algorithm...",
        "options": [
          "Tries every possibility",
          "Makes the best-looking choice at each step",
          "Always uses recursion",
          "Works backwards"
        ],
        "correctIndex": 1,
        "explanation": "Greedy methods commit to the locally optimal choice without revisiting it."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "Using coins of 25, 10, 5 and 1, how many coins does the greedy method use to make 41?",
        "answer": 4,
        "explanation": "$25 + 10 + 5 + 1 = 41$, four coins."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "With coins 1, 3 and 4, greedy makes 6 as $4 + 1 + 1$. The best answer is...",
        "options": [
          "$3 + 3$, two coins",
          "$4 + 1 + 1$, three coins",
          "$1 \\times 6$",
          "Impossible"
        ],
        "correctIndex": 0,
        "explanation": "Greedy isn't always optimal; here it misses $3 + 3$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Which classic algorithm is greedy?",
        "options": [
          "Dijkstra's shortest path",
          "Merge sort",
          "Binary search",
          "Fibonacci with memoization"
        ],
        "correctIndex": 0,
        "explanation": "Dijkstra always settles the closest unvisited node next."
      }
    ]
  },
  {
    "slug": "vectors",
    "course": "linear-algebra",
    "title": "Vectors",
    "summary": "Quantities with both size and direction",
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
    "summary": "Grids of numbers that store and combine linear data",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A $2 \\times 3$ matrix has...",
        "options": [
          "2 rows and 3 columns",
          "3 rows and 2 columns",
          "6 rows",
          "2 columns only"
        ],
        "correctIndex": 0,
        "explanation": "Matrix size is written rows × columns."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "Find the top-left entry of $\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}\\begin{bmatrix}5\\\\6\\end{bmatrix}$.",
        "answer": 17,
        "explanation": "Row 1 dotted with the column: $1 \\times 5 + 2 \\times 6 = 17$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "What is the determinant of $\\begin{bmatrix}3 & 1\\\\2 & 4\\end{bmatrix}$?",
        "answer": 10,
        "explanation": "$ad - bc = 3 \\times 4 - 1 \\times 2 = 10$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "You can multiply $A$ ($m \\times n$) by $B$ ($p \\times q$) only when...",
        "options": [
          "m = p",
          "n = p",
          "m = q",
          "n = q"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "The columns of $A$ must match the rows of $B$."
      }
    ]
  },
  {
    "slug": "transformations",
    "course": "linear-algebra",
    "title": "Transformations",
    "summary": "See matrices as machines that stretch, rotate and flip space",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "Which matrix rotates the plane $90^{\\circ}$ counter-clockwise?",
        "options": [
          "\\begin{bmatrix}0 & -1\\\\1 & 0\\end{bmatrix}",
          "\\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}",
          "\\begin{bmatrix}2 & 0\\\\0 & 2\\end{bmatrix}",
          "\\begin{bmatrix}1 & 0\\\\0 & -1\\end{bmatrix}"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "It sends $(1, 0)$ to $(0, 1)$ and $(0, 1)$ to $(-1, 0)$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "The columns of a transformation matrix show...",
        "options": [
          "Where the basis vectors land",
          "The eigenvalues",
          "The determinant",
          "Random scaling factors"
        ],
        "correctIndex": 0,
        "explanation": "Column $j$ is the image of the $j$-th basis vector."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "A transformation has determinant 3. A unit square becomes a shape of what area?",
        "answer": 3,
        "explanation": "The determinant is the area scaling factor."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "A transformation with determinant 0...",
        "options": [
          "Preserves area",
          "Squashes space into a lower dimension",
          "Rotates space",
          "Doubles area"
        ],
        "correctIndex": 1,
        "explanation": "Zero area scaling means the plane collapses onto a line or point."
      }
    ]
  },
  {
    "slug": "eigenvectors",
    "course": "linear-algebra",
    "title": "Eigenvectors",
    "summary": "Find the directions a transformation only stretches",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "An eigenvector $v$ of $A$ satisfies...",
        "options": [
          "Av = 0",
          "Av = \\lambda v",
          "Av = v + \\lambda",
          "A = \\lambda"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "$A$ only scales an eigenvector by its eigenvalue $\\lambda$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "What is the larger eigenvalue of $\\begin{bmatrix}3 & 0\\\\0 & 5\\end{bmatrix}$?",
        "answer": 5,
        "explanation": "For a diagonal matrix, the eigenvalues are the diagonal entries."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "If $\\lambda = -1$, the eigenvector is...",
        "options": [
          "Stretched",
          "Flipped to point the opposite way",
          "Unchanged",
          "Sent to zero"
        ],
        "correctIndex": 1,
        "explanation": "Multiplying by $-1$ reverses direction without changing length."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Eigenvalues are found by solving...",
        "options": [
          "\\det(A - \\lambda I) = 0",
          "A + \\lambda = 0",
          "\\det(A) = \\lambda",
          "A^{2} = \\lambda"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "Non-zero solutions of $(A - \\lambda I)v = 0$ exist only when that determinant is zero."
      }
    ]
  },
  {
    "slug": "orthogonality",
    "course": "linear-algebra",
    "title": "Orthogonality",
    "summary": "Perpendicular vectors, projections and the dot product",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "Compute the dot product $(2, 3) \\cdot (4, -1)$.",
        "answer": 5,
        "explanation": "$2 \\times 4 + 3 \\times (-1) = 8 - 3 = 5$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Two non-zero vectors are orthogonal when their dot product is...",
        "options": [
          "1",
          "0",
          "-1",
          "Their length"
        ],
        "correctIndex": 1,
        "explanation": "$u \\cdot v = |u||v|\\cos\\theta$, which is zero at $90^{\\circ}$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "For $(1, 2)$ and $(k, -1)$ to be orthogonal, what must $k$ be?",
        "answer": 2,
        "explanation": "$k - 2 = 0$, so $k = 2$."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "What is the length of the vector $(3, 4)$?",
        "answer": 5,
        "explanation": "$\\sqrt{3^{2} + 4^{2}} = \\sqrt{25} = 5$."
      }
    ]
  },
  {
    "slug": "decompositions",
    "course": "linear-algebra",
    "title": "Decompositions",
    "summary": "Factor matrices into simpler pieces that reveal structure",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "LU decomposition writes $A$ as...",
        "options": [
          "A lower-triangular times an upper-triangular matrix",
          "Two diagonal matrices",
          "A sum of vectors",
          "Its inverse"
        ],
        "correctIndex": 0,
        "explanation": "$A = LU$ makes solving systems fast by forward and back substitution."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Singular value decomposition $A = U\\Sigma V^{T}$ exists for...",
        "options": [
          "Only square matrices",
          "Only symmetric matrices",
          "Every matrix",
          "Only invertible matrices"
        ],
        "correctIndex": 2,
        "explanation": "SVD works for any real matrix, which is why it's so widely used."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "A symmetric matrix can always be diagonalized using...",
        "options": [
          "Orthogonal eigenvectors",
          "Only triangular matrices",
          "Random vectors",
          "Its determinant"
        ],
        "correctIndex": 0,
        "explanation": "The spectral theorem: $A = Q\\Lambda Q^{T}$ with orthonormal eigenvectors."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Which application relies on SVD?",
        "options": [
          "Image compression and PCA",
          "Binary search",
          "Sorting",
          "Hashing"
        ],
        "correctIndex": 0,
        "explanation": "Keeping the largest singular values captures most of the data's structure."
      }
    ]
  },
  {
    "slug": "probability-basics",
    "course": "probability",
    "title": "Chance",
    "summary": "Measure how likely outcomes are, from 0 to 1",
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
    "summary": "Update probabilities once you learn something new",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "$P(A \\mid B)$ means...",
        "options": [
          "The probability of A and B",
          "The probability of A given that B happened",
          "The probability of B given A",
          "The probability of A or B"
        ],
        "correctIndex": 1,
        "explanation": "Conditioning restricts attention to outcomes where $B$ occurred."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "A fair die shows an even number. What is the probability that it's a 4?",
        "options": [
          "\\frac{1}{6}",
          "\\frac{1}{3}",
          "\\frac{1}{2}",
          "\\frac{2}{3}"
        ],
        "optionsAreMath": true,
        "correctIndex": 1,
        "explanation": "Only $\\{2, 4, 6\\}$ remain possible, and one of those three is 4."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "If $P(A \\cap B) = 0.2$ and $P(B) = 0.5$, what is $P(A \\mid B)$?",
        "answer": 0.4,
        "explanation": "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.2}{0.5} = 0.4$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Events A and B are independent when...",
        "options": [
          "$P(A \\mid B) = P(A)$",
          "$P(A \\cap B) = 0$",
          "$P(A) = P(B)$",
          "$P(A \\mid B) = 1$"
        ],
        "correctIndex": 0,
        "explanation": "Learning $B$ tells you nothing new about $A$."
      }
    ]
  },
  {
    "slug": "distributions",
    "course": "probability",
    "title": "Distributions",
    "summary": "Model random outcomes with binomial, uniform and normal shapes",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "Counting heads in 10 fair coin flips follows which distribution?",
        "options": [
          "Binomial",
          "Normal",
          "Uniform",
          "Exponential"
        ],
        "correctIndex": 0,
        "explanation": "A fixed number of independent yes/no trials gives a binomial distribution."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "What is the expected number of heads in 10 fair coin flips?",
        "answer": 5,
        "explanation": "For a binomial, $E[X] = np = 10 \\times 0.5 = 5$."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "Roughly what percent of a normal distribution lies within one standard deviation of the mean? (Nearest whole number.)",
        "answer": 68,
        "explanation": "The 68–95–99.7 rule: about 68% lies within $\\pm 1\\sigma$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "A fair die roll follows a...",
        "options": [
          "Discrete uniform distribution",
          "Normal distribution",
          "Binomial distribution",
          "Skewed distribution"
        ],
        "correctIndex": 0,
        "explanation": "Each of the six faces has the same probability, $\\frac{1}{6}$."
      }
    ]
  },
  {
    "slug": "bayes",
    "course": "probability",
    "title": "Bayes' Rule",
    "summary": "Reverse a conditional probability with evidence and priors",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "Bayes' rule computes $P(A \\mid B)$ as...",
        "options": [
          "\\frac{P(B \\mid A)P(A)}{P(B)}",
          "P(A)P(B)",
          "\\frac{P(A)}{P(B)}",
          "P(B \\mid A)"
        ],
        "optionsAreMath": true,
        "correctIndex": 0,
        "explanation": "It flips a conditional using the prior $P(A)$ and the evidence $P(B)$."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "In Bayes' rule, $P(A)$ is called the...",
        "options": [
          "Posterior",
          "Prior",
          "Likelihood",
          "Evidence"
        ],
        "correctIndex": 1,
        "explanation": "The prior is your belief before seeing the new evidence."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "1% of people have a condition. A test catches 90% of cases and gives 9% false positives. Out of 1000 people, roughly how many test positive in total? (Nearest whole number.)",
        "answer": 98,
        "explanation": "True positives: $10 \\times 0.9 = 9$. False positives: $990 \\times 0.09 \\approx 89$. Total $\\approx 98$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "With those numbers, a positive result means the person most likely...",
        "options": [
          "Has the condition",
          "Does not have the condition",
          "Has a 90% chance of the condition",
          "Must retest twice"
        ],
        "correctIndex": 1,
        "explanation": "Only about 9 of 98 positives are real, roughly 9%. Rare conditions make false positives dominate."
      }
    ]
  },
  {
    "slug": "expectation",
    "course": "probability",
    "title": "Expected Value",
    "summary": "The long-run average of a random quantity",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "What is the expected value of one fair six-sided die roll?",
        "answer": 3.5,
        "explanation": "$\\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3.5$."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "A game pays 10 points with probability $0.3$, otherwise 0. What is its expected payout?",
        "answer": 3,
        "explanation": "$E = 10 \\times 0.3 + 0 \\times 0.7 = 3$."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Expectation is linear, so $E[X + Y]$ equals...",
        "options": [
          "$E[X] + E[Y]$, always",
          "$E[X]E[Y]$",
          "$E[X] + E[Y]$ only if independent",
          "$\\max(E[X], E[Y])$"
        ],
        "correctIndex": 0,
        "explanation": "Linearity holds even when $X$ and $Y$ are dependent."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "What is the expected total of two fair dice?",
        "answer": 7,
        "explanation": "By linearity, $3.5 + 3.5 = 7$."
      }
    ]
  },
  {
    "slug": "inference",
    "course": "probability",
    "title": "Inference",
    "summary": "Draw conclusions about a population from a sample",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "A sample statistic is used to estimate a...",
        "options": [
          "Population parameter",
          "Random seed",
          "Sample size",
          "Prior"
        ],
        "correctIndex": 0,
        "explanation": "Inference uses the sample we see to learn about the population we don't."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "As the sample size grows, the standard error of the mean...",
        "options": [
          "Grows",
          "Shrinks",
          "Stays the same",
          "Becomes negative"
        ],
        "correctIndex": 1,
        "explanation": "Standard error is $\\frac{\\sigma}{\\sqrt{n}}$, so larger samples are more precise."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "A p-value of $0.01$ means...",
        "options": [
          "The hypothesis is 1% likely to be true",
          "Data this extreme would occur 1% of the time if the null hypothesis were true",
          "There's a 99% chance of an effect",
          "The sample is 1% wrong"
        ],
        "correctIndex": 1,
        "explanation": "A p-value measures surprise under the null hypothesis, not the probability the null is true."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "By what factor must you multiply the sample size to halve the standard error?",
        "answer": 4,
        "explanation": "Standard error scales with $\\frac{1}{\\sqrt{n}}$; quadrupling $n$ halves it."
      }
    ]
  },
  {
    "slug": "atoms",
    "course": "chemistry",
    "title": "Atomic Structure",
    "summary": "Protons, neutrons and electrons, and what makes each element unique",
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
    "summary": "How atoms share or swap electrons to form compounds",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "In an ionic bond, electrons are...",
        "options": [
          "Shared equally",
          "Transferred from one atom to another",
          "Destroyed",
          "Shared unequally only"
        ],
        "correctIndex": 1,
        "explanation": "Ionic bonds form when a metal gives electrons to a non-metal, creating oppositely charged ions."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "The bond in a water molecule between O and H is...",
        "options": [
          "Ionic",
          "Polar covalent",
          "Metallic",
          "Non-polar covalent"
        ],
        "correctIndex": 1,
        "explanation": "Oxygen pulls the shared electrons closer, making a polar covalent bond."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "How many electrons are shared in a double covalent bond?",
        "answer": 4,
        "explanation": "Each bond is one shared pair; a double bond shares two pairs, four electrons."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Which pair is most likely to form an ionic compound?",
        "options": [
          "Na and Cl",
          "C and H",
          "O and O",
          "N and H"
        ],
        "correctIndex": 0,
        "explanation": "Sodium readily loses an electron and chlorine readily gains one."
      }
    ]
  },
  {
    "slug": "reactions",
    "course": "chemistry",
    "title": "Reactions",
    "summary": "Balance equations and recognise common reaction types",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "Balance $\\_\\,\\mathrm{H_2} + \\mathrm{O_2} \\to \\_\\,\\mathrm{H_2O}$. What coefficient goes in front of $\\mathrm{H_2}$?",
        "answer": 2,
        "explanation": "$2\\mathrm{H_2} + \\mathrm{O_2} \\to 2\\mathrm{H_2O}$ gives four H and two O on each side."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Balancing equations reflects the conservation of...",
        "options": [
          "Energy",
          "Mass",
          "Volume",
          "Temperature"
        ],
        "correctIndex": 1,
        "explanation": "Atoms are rearranged, never created or destroyed."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "$\\mathrm{CH_4} + 2\\mathrm{O_2} \\to \\mathrm{CO_2} + 2\\mathrm{H_2O}$ is a...",
        "options": [
          "Combustion reaction",
          "Decomposition reaction",
          "Single displacement",
          "Neutralisation"
        ],
        "correctIndex": 0,
        "explanation": "A fuel reacting with oxygen to form $\\mathrm{CO_2}$ and water is combustion."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "An acid reacting with a base produces...",
        "options": [
          "A salt and water",
          "Only gas",
          "A metal",
          "An element"
        ],
        "correctIndex": 0,
        "explanation": "This is a neutralisation reaction."
      }
    ]
  },
  {
    "slug": "equilibrium",
    "course": "chemistry",
    "title": "Equilibrium",
    "summary": "Reactions that run both ways until they balance",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "At chemical equilibrium...",
        "options": [
          "All reactions stop",
          "Forward and reverse rates are equal",
          "Only products remain",
          "Only reactants remain"
        ],
        "correctIndex": 1,
        "explanation": "Equilibrium is dynamic: both directions continue at the same rate."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Adding more reactant to a system at equilibrium shifts it...",
        "options": [
          "Toward products",
          "Toward reactants",
          "Nowhere",
          "To stop completely"
        ],
        "correctIndex": 0,
        "explanation": "Le Chatelier's principle: the system works to use up the added reactant."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "A very large equilibrium constant $K$ means...",
        "options": [
          "Mostly reactants at equilibrium",
          "Mostly products at equilibrium",
          "No reaction",
          "Equal amounts always"
        ],
        "correctIndex": 1,
        "explanation": "$K$ compares products to reactants, so a large $K$ favours products."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Increasing pressure on $\\mathrm{N_2} + 3\\mathrm{H_2} \\rightleftharpoons 2\\mathrm{NH_3}$ favours...",
        "options": [
          "The side with fewer gas molecules, $\\mathrm{NH_3}$",
          "The side with more gas molecules",
          "Neither side",
          "Decomposition of $\\mathrm{NH_3}$"
        ],
        "correctIndex": 0,
        "explanation": "Four gas molecules become two, so higher pressure pushes the reaction right."
      }
    ]
  },
  {
    "slug": "thermochemistry",
    "course": "chemistry",
    "title": "Thermochemistry",
    "summary": "Heat flow in reactions: exothermic, endothermic and enthalpy",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "An exothermic reaction...",
        "options": [
          "Absorbs heat",
          "Releases heat",
          "Has no energy change",
          "Only happens when cold"
        ],
        "correctIndex": 1,
        "explanation": "Exothermic reactions give off heat, so the surroundings warm up."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "A negative $\\Delta H$ indicates the reaction is...",
        "options": [
          "Endothermic",
          "Exothermic",
          "At equilibrium",
          "Impossible"
        ],
        "correctIndex": 1,
        "explanation": "The system loses enthalpy to its surroundings."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "How many joules raise $2\\,\\mathrm{g}$ of water by $5\\,^{\\circ}\\mathrm{C}$? Use $c = 4.2\\,\\mathrm{J/(g\\,^{\\circ}C)}$.",
        "answer": 42,
        "explanation": "$q = mc\\Delta T = 2 \\times 4.2 \\times 5 = 42\\,\\mathrm{J}$."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Melting ice is...",
        "options": [
          "Endothermic",
          "Exothermic",
          "Neither",
          "A chemical reaction"
        ],
        "correctIndex": 0,
        "explanation": "Ice absorbs heat from its surroundings to break into liquid."
      }
    ]
  },
  {
    "slug": "organic",
    "course": "chemistry",
    "title": "Organic Chemistry",
    "summary": "The chemistry of carbon and the molecules of life",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "numeric",
        "prompt": "How many covalent bonds does a carbon atom typically form?",
        "answer": 4,
        "explanation": "Carbon has four valence electrons, so it forms four bonds."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Methane, $\\mathrm{CH_4}$, belongs to which family?",
        "options": [
          "Alkanes",
          "Alkenes",
          "Alcohols",
          "Acids"
        ],
        "correctIndex": 0,
        "explanation": "Alkanes contain only single C–C and C–H bonds."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "The $-\\mathrm{OH}$ group identifies an...",
        "options": [
          "Alcohol",
          "Alkane",
          "Ester",
          "Amine"
        ],
        "correctIndex": 0,
        "explanation": "Ethanol, $\\mathrm{C_2H_5OH}$, is a familiar alcohol."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "How many hydrogen atoms are in propane, $\\mathrm{C_3H_{n}}$? Alkanes follow $\\mathrm{C_{k}H_{2k+2}}$.",
        "answer": 8,
        "explanation": "$2 \\times 3 + 2 = 8$, so propane is $\\mathrm{C_3H_8}$."
      }
    ]
  },
  {
    "slug": "stars",
    "course": "astronomy",
    "title": "Life of Stars",
    "summary": "How stars form, shine and change over their lives",
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
    "summary": "Why planets and moons travel in ellipses",
    "order": 2,
    "xp": 25,
    "difficulty": "beginner",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "According to Kepler's first law, planets orbit the Sun in...",
        "options": [
          "Perfect circles",
          "Ellipses with the Sun at one focus",
          "Straight lines",
          "Spirals"
        ],
        "correctIndex": 1,
        "explanation": "Orbits are ellipses; circles are just a special case."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "A planet moves fastest when it is...",
        "options": [
          "Farthest from the Sun",
          "Closest to the Sun",
          "At the same speed always",
          "Behind the Sun"
        ],
        "correctIndex": 1,
        "explanation": "Kepler's second law: it sweeps equal areas in equal times, so it speeds up near the Sun."
      },
      {
        "id": "q3",
        "type": "numeric",
        "prompt": "Kepler's third law, $T^{2} = a^{3}$ (years and AU). A planet orbits at $a = 4\\,\\mathrm{AU}$. What is its period in years?",
        "answer": 8,
        "explanation": "$T^{2} = 4^{3} = 64$, so $T = 8$ years."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "What keeps the Moon in orbit around Earth?",
        "options": [
          "Magnetism",
          "Earth's gravity pulling it into a curved path",
          "Air pressure",
          "Nothing; it is stationary"
        ],
        "correctIndex": 1,
        "explanation": "The Moon is constantly falling toward Earth while moving sideways fast enough to miss it."
      }
    ]
  },
  {
    "slug": "galaxies",
    "course": "astronomy",
    "title": "Galaxies",
    "summary": "Vast star systems and our place in the Milky Way",
    "order": 3,
    "xp": 30,
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "What type of galaxy is the Milky Way?",
        "options": [
          "Elliptical",
          "Barred spiral",
          "Irregular",
          "Lenticular"
        ],
        "correctIndex": 1,
        "explanation": "The Milky Way has spiral arms winding from a central bar."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "Most large galaxies have what at their centre?",
        "options": [
          "A supermassive black hole",
          "A giant planet",
          "Empty space",
          "A neutron star"
        ],
        "correctIndex": 0,
        "explanation": "The Milky Way's is called Sagittarius A*, about four million solar masses."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "Galaxy rotation curves suggest galaxies contain extra unseen mass called...",
        "options": [
          "Dark matter",
          "Antimatter",
          "Black holes only",
          "Interstellar gas only"
        ],
        "correctIndex": 0,
        "explanation": "Outer stars orbit too fast to be held by visible matter alone."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Light from the Andromeda Galaxy takes about 2.5 million years to reach us. When we look at it we see...",
        "options": [
          "It as it is right now",
          "It as it was 2.5 million years ago",
          "Its future",
          "Only its reflection"
        ],
        "correctIndex": 1,
        "explanation": "Looking far away is looking back in time."
      }
    ]
  },
  {
    "slug": "cosmology",
    "course": "astronomy",
    "title": "Cosmology",
    "summary": "The origin, expansion and fate of the universe",
    "order": 4,
    "xp": 35,
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "Distant galaxies are redshifted because...",
        "options": [
          "They are cooling",
          "The universe is expanding",
          "Dust makes them red",
          "They are made of red stars"
        ],
        "correctIndex": 1,
        "explanation": "Expansion stretches light to longer wavelengths as it travels."
      },
      {
        "id": "q2",
        "type": "numeric",
        "prompt": "To the nearest billion years, how old is the universe?",
        "answer": 14,
        "explanation": "Measurements of the cosmic microwave background give about 13.8 billion years."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "The cosmic microwave background is...",
        "options": [
          "Light from the first stars",
          "Leftover radiation from the hot early universe",
          "Radio noise from Earth",
          "Light from the Sun"
        ],
        "correctIndex": 1,
        "explanation": "It was released about 380,000 years after the Big Bang when atoms first formed."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "Hubble's law says a galaxy's recession speed is proportional to its...",
        "options": [
          "Distance from us",
          "Mass",
          "Brightness",
          "Age"
        ],
        "correctIndex": 0,
        "explanation": "$v = H_0 d$: the farther away, the faster it recedes."
      }
    ]
  },
  {
    "slug": "relativity",
    "course": "astronomy",
    "title": "Relativity",
    "summary": "Space, time and light according to Einstein",
    "order": 5,
    "xp": 40,
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "In special relativity, the speed of light in a vacuum is...",
        "options": [
          "Different for each observer",
          "The same for all observers",
          "Infinite",
          "Slower in space"
        ],
        "correctIndex": 1,
        "explanation": "This postulate leads to time dilation and length contraction."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "A fast-moving clock, viewed from a stationary observer, ticks...",
        "options": [
          "Faster",
          "Slower",
          "At the same rate",
          "Backwards"
        ],
        "correctIndex": 1,
        "explanation": "Time dilation: moving clocks run slow."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "In $E = mc^{2}$, the $c$ stands for...",
        "options": [
          "Charge",
          "The speed of light",
          "A constant of gravity",
          "Heat capacity"
        ],
        "correctIndex": 1,
        "explanation": "A small mass holds a huge energy because $c^{2}$ is enormous."
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "General relativity describes gravity as...",
        "options": [
          "A force carried by magnets",
          "The curvature of spacetime by mass and energy",
          "Air pressure",
          "An illusion"
        ],
        "correctIndex": 1,
        "explanation": "Mass tells spacetime how to curve; curved spacetime tells matter how to move."
      }
    ]
  },
  {
    "slug": "exoplanets",
    "course": "astronomy",
    "title": "Exoplanets",
    "summary": "Find and study planets around other stars",
    "order": 6,
    "xp": 45,
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "published": true,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "The transit method detects a planet by...",
        "options": [
          "A star's light dimming as the planet passes in front",
          "Hearing radio signals",
          "Seeing the planet directly in every case",
          "Measuring the planet's temperature"
        ],
        "correctIndex": 0,
        "explanation": "A small, regular dip in brightness reveals an orbiting planet."
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "The radial velocity method detects...",
        "options": [
          "A star's wobble shifting its light back and forth",
          "Planet rings",
          "Comets",
          "Solar flares"
        ],
        "correctIndex": 0,
        "explanation": "The planet's gravity tugs the star, Doppler-shifting its spectrum."
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "The \"habitable zone\" is the region where...",
        "options": [
          "Liquid water could exist on a planet's surface",
          "There are no asteroids",
          "Planets have moons",
          "Stars are born"
        ],
        "correctIndex": 0,
        "explanation": "Not too hot, not too cold, so it's sometimes called the Goldilocks zone."
      },
      {
        "id": "q4",
        "type": "numeric",
        "prompt": "A planet blocks 1% of its star's light during transit. Its radius is what fraction of the star's? (Answer the $n$ in $\\frac{1}{n}$.)",
        "answer": 10,
        "explanation": "The dip equals the area ratio $(R_p / R_s)^{2} = 0.01$, so $R_p / R_s = \\frac{1}{10}$."
      }
    ]
  },
  {
    "slug": "bonus-pattern",
    "course": "daily-challenge",
    "title": "Problem of the Day",
    "summary": "A quick pattern puzzle",
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
