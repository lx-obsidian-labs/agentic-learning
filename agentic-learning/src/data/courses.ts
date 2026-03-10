export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  courses: number;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  notes: string;
  keyPoints: string[];
  timestamps: { time: string; label: string }[];
  videoQuality: 'must-watch' | 'supplementary';
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  grade: number;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  instructor: string;
  estimatedHours: number;
  thumbnail: string;
}

export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    color: '#3B82F6',
    courses: 15,
    description: 'Algebra, Calculus, Geometry & more'
  },
  {
    id: 'physical-sciences',
    name: 'Physical Sciences',
    icon: 'Atom',
    color: '#EF4444',
    courses: 12,
    description: 'Physics & Chemistry for Matric'
  },
  {
    id: 'life-sciences',
    name: 'Life Sciences',
    icon: 'Dna',
    color: '#22C55E',
    courses: 10,
    description: 'Biology, Genetics & Evolution'
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    color: '#8B5CF6',
    courses: 8,
    description: 'Physical & Human Geography'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    icon: 'Receipt',
    color: '#F59E0B',
    courses: 11,
    description: 'Financial Statements & Tax'
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: 'TrendingUp',
    color: '#06B6D4',
    courses: 9,
    description: 'Macro & Micro Economics'
  },
  {
    id: 'english',
    name: 'English',
    icon: 'BookOpen',
    color: '#EC4899',
    courses: 7,
    description: 'Literature & Language'
  },
  {
    id: 'afrikaans',
    name: 'Afrikaans',
    icon: 'Languages',
    color: '#14B8A6',
    courses: 6,
    description: 'Taal & Letterkunde'
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Landmark',
    color: '#DC2626',
    courses: 6,
    description: 'World & South African History'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: 'Laptop',
    color: '#7C3AED',
    courses: 8,
    description: 'Programming & Digital Skills'
  },
  {
    id: 'business-studies',
    name: 'Business Studies',
    icon: 'Briefcase',
    color: '#0891B2',
    courses: 7,
    description: 'Business Principles & Management'
  }
];

export const courses: Course[] = [
  {
    id: 'mathematics-grade-12',
    title: 'Mathematics Grade 12',
    subject: 'mathematics',
    grade: 12,
    description: 'Master Calculus, Algebra, Probability and Geometry with strategic video selection.',
    difficulty: 'Advanced',
    instructor: 'Dr. Sarah Mitchell',
    estimatedHours: 40,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    modules: [
      {
        id: 'calculus',
        title: 'Calculus',
        lessons: [
          {
            id: 'derivatives-intro',
            title: 'Introduction to Derivatives',
            duration: '25 min',
            videoId: 'FLAm7Hqm-58',
            videoQuality: 'must-watch',
            notes: `# Introduction to Derivatives

## 1. What is a Derivative?
The derivative is one of the most fundamental concepts in calculus. It measures how a function changes as its input changes. Think of it as the "instantaneous rate of change" - how fast something is changing at any given moment.

### Historical Context
Isaac Newton developed the concept of derivatives in the 17th century to solve problems in physics, particularly in understanding motion and gravity. Today, derivatives are used in virtually every field of science and engineering.

### Mathematical Definition
The derivative of f(x) at point x is defined as:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

This limit, if it exists, gives us the slope of the tangent line to the function at that point.

## 2. The Power Rule (Most Important!)
If f(x) = xⁿ, where n is any real number, then:
$$\\frac{d}{dx}[x^n] = nx^{n-1}$$

### Examples:
- f(x) = x³ → f'(x) = 3x²
- f(x) = x⁵ → f'(x) = 5x⁴
- f(x) = x → f'(x) = 1 (since x = x¹)
- f(x) = 5 → f'(x) = 0 (constant rule)
- f(x) = 7x² → f'(x) = 14x
- f(x) = 3x⁴ + 2x² → f'(x) = 12x³ + 4x

### Practice Problems:
1. d/dx(x⁸) = 8x⁷
2. d/dx(4x³) = 12x²
3. d/dx(x² + 3x + 5) = 2x + 3

## 3. The Product Rule
When you have two functions multiplied together, you cannot simply multiply their derivatives. Use:
$$(fg)' = f'g + fg'$$

Or in Leibniz notation: d/dx(uv) = u(dv/dx) + v(du/dx)

### Example:
Find d/dx(x² · sin(x))
- Let u = x², v = sin(x)
- u' = 2x, v' = cos(x)
- Answer: 2x · sin(x) + x² · cos(x)

### Memory Tip: "First times derivative of second plus second times derivative of first"

## 4. The Quotient Rule
For dividing functions:
$$\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$$

### Example:
d/dx(x²/sin(x)) = (2x · sin(x) - x² · cos(x)) / sin²(x)

## 5. The Chain Rule (Composite Functions)
When a function is nested inside another:
$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) · g'(x)$$

### Example:
Find d/dx(sin(x³))
- Let u = x³, so sin(u)
- du/dx = 3x²
- d/du(sin(u)) = cos(u)
- Answer: 3x² · cos(x³)

### Chain Rule Steps:
1. Identify outer function and inner function
2. Differentiate outer function (keep inner function unchanged)
3. Multiply by derivative of inner function

## 6. Derivatives of Common Functions

| Function | Derivative |
|----------|------------|
| xⁿ | nxⁿ⁻¹ |
| sin(x) | cos(x) |
| cos(x) | -sin(x) |
| tan(x) | sec²(x) |
| eˣ | eˣ |
| ln(x) | 1/x |
| aˣ | aˣ · ln(a) |
| log₁₀(x) | 1/(x · ln(10)) |

## 7. Higher Order Derivatives
The second derivative tells us about concavity:
- f''(x) > 0: Concave up (like a cup)
- f''(x) < 0: Concave down (like a cap)
- f''(x) = 0: Possible inflection point

## 8. Applications in Real Life
- **Physics**: Velocity is derivative of position, acceleration is derivative of velocity
- **Economics**: Marginal cost and marginal revenue
- **Biology**: Rate of population growth
- **Engineering**: Optimizing designs

## 9. Exam Tips
1. Always check if you need the product, quotient, or chain rule
2. Simplify your answer if possible
3. Remember: derivative of constant = 0
4. Practice, practice, practice!`,
            keyPoints: ['Power Rule', 'Product Rule', 'Chain Rule', 'Quotient Rule', 'Derivatives of trig functions', 'Higher order derivatives'],
            timestamps: [
              { time: '0:00', label: 'Introduction' },
              { time: '2:30', label: 'Power Rule' },
              { time: '8:15', label: 'Product Rule' },
              { time: '14:00', label: 'Chain Rule' }
            ]
          },
          {
            id: 'derivatives-applications',
            title: 'Applications of Derivatives',
            duration: '30 min',
            videoId: 'G03GZuPp3FQ',
            videoQuality: 'must-watch',
            notes: `# Applications of Derivatives

## 1. Finding Turning Points (Critical Points)
Turning points (also called critical points) are where the function changes direction from increasing to decreasing or vice versa. These are found where f'(x) = 0 or f'(x) is undefined.

### Steps to Find Turning Points:
1. Find f'(x)
2. Solve f'(x) = 0 to find critical numbers
3. Use the first or second derivative test to classify them

### Example:
Find turning points of f(x) = x³ - 3x²
1. f'(x) = 3x² - 6x
2. 3x² - 6x = 0 → 3x(x - 2) = 0 → x = 0 or x = 2
3. These are our critical points

## 2. First Derivative Test
- If f' changes from positive to negative: local maximum
- If f' changes from negative to positive: local minimum
- If f' doesn't change sign: neither max nor min

### Example with f(x) = x³ - 3x²:
- Test x = -1 (left of 0): f'(-1) = 3(1) + 6 = 9 > 0 (increasing)
- Test x = 1 (between 0 and 2): f'(1) = 3 - 6 = -3 < 0 (decreasing)
- Test x = 3 (right of 2): f'(3) = 27 - 18 = 9 > 0 (increasing)
→ x = 0 is a local maximum
→ x = 2 is a local minimum

## 3. Second Derivative Test (More Convenient!)
- If f''(c) > 0: local minimum at c
- If f''(c) < 0: local maximum at c
- If f''(c) = 0: test is inconclusive (use first derivative test)

### Why This Works:
- f'' > 0 means f' is increasing, so we're at a "valley" (minimum)
- f'' < 0 means f' is decreasing, so we're at a "hill" (maximum)

### Example:
f(x) = x⁴ - 2x²
- f'(x) = 4x³ - 4x = 4x(x² - 1) = 0 → x = 0, ±1
- f''(x) = 12x² - 4
- At x = 0: f''(0) = -4 < 0 → local maximum
- At x = ±1: f''(±1) = 12 - 4 = 8 > 0 → local minimum

## 4. Equation of Tangent Line
The tangent line at point (a, f(a)):
$$y - f(a) = f'(a)(x - a)$$

### Example:
Find tangent to f(x) = x² at x = 3
- f(3) = 9
- f'(x) = 2x, so f'(3) = 6
- Equation: y - 9 = 6(x - 3)
- Simplified: y = 6x - 9

## 5. Equation of Normal Line
The normal is perpendicular to the tangent:
$$y - f(a) = -\\frac{1}{f'(a)}(x - a)$$

(Note: if f'(a) = 0, the normal is a vertical line x = a)

## 6. Optimization Problems (Real Applications!)
Derivatives help us find maximum and minimum values - crucial in real-world optimization.

### Problem-Solving Strategy:
1. Identify what needs to be maximized or minimized
2. Write an equation for the quantity in terms of one variable
3. Find the derivative and set it to zero
4. Solve for the critical points
5. Verify it's a maximum/minimum using second derivative test
6. Answer the question

### Example Problem:
A farmer has 100m of fencing to enclose a rectangular pen against a wall. What dimensions maximize the area?

**Solution:**
- Let x = width (perpendicular to wall)
- Let y = length (parallel to wall)
- Perimeter: x + x + y = 100 → 2x + y = 100 → y = 100 - 2x
- Area: A = x · y = x(100 - 2x) = 100x - 2x²
- A' = 100 - 4x = 0 → x = 25m
- y = 100 - 2(25) = 50m
- Maximum area = 25 × 50 = 1250 m²

### Common Optimization Problems:
- Maximum area with fixed perimeter
- Minimum cost with constraints
- Maximum profit / minimum cost
- Optimal speed/distance problems

## 7. Related Rates
When two or more quantities are changing with time and are related by an equation.

### The Process:
1. Identify all variables
2. Write an equation relating them
3. Differentiate with respect to time (t)
4. Substitute known values
5. Solve for the unknown rate

### Example:
A ladder 10m long slides down a wall. If the bottom is moving at 2m/s, how fast is the top moving when the bottom is 6m from the wall?

**Solution:**
- Let x = distance of bottom from wall
- Let y = height of top on wall
- By Pythagoras: x² + y² = 100
- Differentiate: 2x(dx/dt) + 2y(dy/dt) = 0
- When x = 6: y = √(100 - 36) = 8m
- 2(6)(2) + 2(8)(dy/dt) = 0
- 24 + 16(dy/dt) = 0
- dy/dt = -24/16 = -1.5 m/s (downward)

## 8. Motion Applications
- **Position** s(t)
- **Velocity** v(t) = s'(t)
- **Acceleration** a(t) = v'(t) = s''(t)

- Object moving upward: v < 0 (if upward is positive)
- Object at maximum height: v = 0
- Object speeding up: v and a have same sign
- Object slowing down: v and a have opposite signs

## 9. Curve Sketching
Use derivatives to sketch accurate graphs:
1. Find y-intercept (x = 0)
2. Find x-intercepts (y = 0)
3. Find vertical asymptotes (denominator = 0)
4. Find horizontal asymptotes (as x → ±∞)
5. Find critical points and classify
6. Determine intervals of increase/decrease
7. Find inflection points (f'' = 0)

## 10. Mean Value Theorem
If f is continuous on [a,b] and differentiable on (a,b), then there exists at least one c in (a,b) where:
$$f'(c) = \\frac{f(b) - f(a)}{b - a}$$

This guarantees the instantaneous rate equals the average rate at some point.`,
            keyPoints: ['Turning points', 'First derivative test', 'Second derivative test', 'Tangent/Normal lines', 'Optimization', 'Related rates', 'Motion applications'],
            timestamps: [
              { time: '0:00', label: 'Critical Points' },
              { time: '5:00', label: 'First Derivative Test' },
              { time: '12:00', label: 'Second Derivative Test' },
              { time: '20:00', label: 'Optimization' }
            ]
          },
          {
            id: 'integrals-intro',
            title: 'Introduction to Integration',
            duration: '28 min',
            videoId: 'rC5HH7r4i7I',
            videoQuality: 'must-watch',
            notes: `# Introduction to Integration

## 1. What is Integration?
Integration is the reverse process of differentiation (antidifferentiation). While derivatives break functions into rates of change, integration builds functions from rates of change.

Think of it as "undoing" differentiation:
- If d/dx[F(x)] = f(x), then ∫f(x)dx = F(x) + C

### Why Do We Need Integration?
Integration allows us to:
- Find areas under curves
- Calculate total quantities from rates
- Find volumes of solids
- Solve differential equations
- And much more in physics, engineering, and economics

## 2. Basic Integration Rules

### Power Rule (Reversed):
$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$$

**Examples:**
- ∫x⁴ dx = x⁵/5 + C
- ∫x² dx = x³/3 + C
- ∫dx = x + C

### Constant Multiple Rule:
$$\\int k · f(x) dx = k \\int f(x) dx$$

**Examples:**
- ∫5x² dx = 5 · x³/3 = 5x³/3 + C
- ∫3dx = 3x + C

### Sum/Difference Rule:
$$\\int [f(x) ± g(x)] dx = \\int f(x) dx ± \\int g(x) dx$$

**Example:**
∫(x² + 3x - 4)dx = x³/3 + 3x²/2 - 4x + C

## 3. Common Integrals Table

| Function | Integral |
|----------|----------|
| xⁿ | xⁿ⁺¹/(n+1) + C (n≠-1) |
| 1/x | ln|x| + C |
| eˣ | eˣ + C |
| aˣ | aˣ/ln(a) + C |
| sin(x) | -cos(x) + C |
| cos(x) | sin(x) + C |
| sec²(x) | tan(x) + C |
| 1/(1+x²) | arctan(x) + C |

## 4. Definite vs Indefinite Integrals

### Indefinite Integral:
∫f(x)dx = F(x) + C
- No limits of integration
- Produces a family of functions (all differing by constant C)
- Represents general antiderivative

### Definite Integral:
∫ₐᵇ f(x)dx = F(b) - F(a)
- Has upper and lower limits
- Produces a number (area under curve)
- Represents net signed area

**Example:**
∫₀² x² dx = [x³/3]₀² = (8/3) - (0) = 8/3

## 5. The Fundamental Theorem of Calculus
This brilliant theorem connects differentiation and integration:

### Part 1:
If F(x) = ∫ₐˣ f(t)dt, then F'(x) = f(x)

### Part 2 (Evaluation Theorem):
∫ₐᵇ f(x)dx = F(b) - F(a), where F is any antiderivative of f

This means we can evaluate definite integrals by finding antiderivatives!

## 6. Integration Techniques

### Substitution (Reverse Chain Rule):
Used when you have a function inside another function.

**Strategy:**
1. Look for "inner function" - set u = inner function
2. Find du = derivative · dx
3. Replace and integrate
4. Substitute back

**Example:**
∫2x·cos(x²)dx
- Let u = x², du = 2x dx
- ∫cos(u)du = sin(u) + C = sin(x²) + C

### Integration by Parts:
For products of functions: ∫u dv = uv - ∫v du

**LIATE Rule** (choose u in order):
- L: Logarithmic
- I: Inverse trig
- A: Algebraic
- T: Trig
- E: Exponential

**Example:**
∫x·eˣdx
- Let u = x, dv = eˣdx
- du = dx, v = eˣ
- ∫x·eˣdx = x·eˣ - ∫eˣdx = x·eˣ - eˣ + C = eˣ(x-1) + C

## 7. Area Under Curves

### Between curve and x-axis:
∫ₐᵇ f(x)dx gives signed area:
- Above x-axis: positive area
- Below x-axis: negative area

### Between two curves:
Area = ∫ₐᵇ [f(x) - g(x)]dx where f(x) ≥ g(x)

**Example:**
Find area between y = x² and y = x + 2
1. Find intersection: x² = x + 2 → x² - x - 2 = 0 → (x-2)(x+1) = 0 → x = -1, 2
2. Top function: x + 2 is above x² on [-1, 2]
3. Area = ∫₋₁² [(x+2) - x²]dx = [x²/2 + 2x - x³/3]₋₁² = (2 + 4 - 8/3) - (1/2 - 2 + 1/3) = 4.5 - (-1.17) ≈ 5.67

## 8. Average Value of a Function
The average value of f(x) on [a,b]:
$$f_{avg} = \\frac{1}{b-a} \\int_a^b f(x)dx$$

**Example:**
Average value of f(x) = x² on [0,3]:
= (1/3)∫₀³ x² dx = (1/3)[x³/3]₀³ = (1/3)(27/3) = 3

## 9. Applications in Physics

### Displacement from Velocity:
s(t) = s₀ + ∫₀ᵗ v(t)dt

### Work Done by Variable Force:
W = ∫ₐᵇ F(x)dx

### Center of Mass:
x̄ = (∫ₐᵇ x·ρ(x)dx) / (∫ₐᵇ ρ(x)dx)

## 10. Tips for Success
1. Practice basic integrals until they're automatic
2. Memorize the common integral table
3. For substitution, look for patterns: something and its derivative
4. For by parts, use LIATE to choose u
5. Always include + C (constant of integration)
6. For definite integrals, check if integrand changes sign`,
            keyPoints: ['Power rule', 'Common integrals', 'Definite vs indefinite', 'Fundamental theorem', 'Substitution', 'Integration by parts', 'Area under curves'],
            timestamps: [
              { time: '0:00', label: 'What is Integration?' },
              { time: '4:00', label: 'Basic Rules' },
              { time: '12:00', label: 'Definite Integrals' },
              { time: '20:00', label: 'Area Under Curves' }
            ]
          },
          {
            id: 'integration-applications',
            title: 'Applications of Integration',
            duration: '32 min',
            videoId: 'xec6HTcn2M8',
            videoQuality: 'supplementary',
            notes: `# Applications of Integration

## Area Between Two Curves
Area = ∫ₐᵇ [f(x) - g(x)] dx where f(x) ≥ g(x)

## Kinematics
- Velocity: v(t) = ds/dt
- Position: s(t) = ∫v(t)dt

## Volume of Revolution
V = π∫[f(x)]²dx`,
            keyPoints: ['Area between curves', 'Kinematics', 'Volume of revolution'],
            timestamps: [
              { time: '0:00', label: 'Area Between Curves' },
              { time: '10:00', label: 'Kinematics' },
              { time: '20:00', label: 'Volume' }
            ]
          }
        ]
      },
      {
        id: 'algebra',
        title: 'Advanced Algebra',
        lessons: [
          {
            id: 'sequences-arithmetic',
            title: 'Arithmetic Sequences',
            duration: '20 min',
            videoId: 'IRxLHHPhrak',
            videoQuality: 'must-watch',
            notes: `# Arithmetic Sequences

## Definition
An arithmetic sequence has a constant difference between consecutive terms.

## Formula
aₙ = a₁ + (n-1)d

Where:
- a₁ = first term
- d = common difference
- n = term number

## Sum of Arithmetic Series
Sₙ = n/2(a₁ + aₙ)
Sₙ = n/2[2a₁ + (n-1)d]`,
            keyPoints: ['Common difference', 'nth term formula', 'Sum formula'],
            timestamps: [
              { time: '0:00', label: 'Definition' },
              { time: '5:00', label: 'nth Term' },
              { time: '12:00', label: 'Sum of Series' }
            ]
          },
          {
            id: 'sequences-geometric',
            title: 'Geometric Sequences',
            duration: '22 min',
            videoId: 'IRxLHHPhrak',
            videoQuality: 'must-watch',
            notes: `# Geometric Sequences

## Definition
A geometric sequence has a constant ratio between consecutive terms.

## Formula
aₙ = a₁ · rⁿ⁻¹

## Sum of Geometric Series
**Finite:** Sₙ = a₁(1-rⁿ)/(1-r)  (r ≠ 1)
**Infinite:** S∞ = a₁/(1-r)  (|r| < 1)`,
            keyPoints: ['Common ratio', 'nth term', 'Finite & infinite sums'],
            timestamps: [
              { time: '0:00', label: 'Definition' },
              { time: '6:00', label: 'nth Term' },
              { time: '12:00', label: 'Sum Formulas' }
            ]
          },
          {
            id: 'binomial',
            title: 'The Binomial Theorem',
            duration: '25 min',
            videoId: 'PK_qbXbN7z4',
            videoQuality: 'must-watch',
            notes: `# The Binomial Theorem

## Binomial Expansion
(a + b)ⁿ = Σ C(n,r) · aⁿ⁻ʳ · bʳ

## Binomial Coefficients
C(n,r) = n! / [r!(n-r)!]

## Pascal's Triangle
Row n gives coefficients for (a+b)ⁿ`,
            keyPoints: ['Pascal\'s Triangle', 'General term', 'Coefficient calculation'],
            timestamps: [
              { time: '0:00', label: 'Theorem' },
              { time: '8:00', label: 'Pascal\'s Triangle' },
              { time: '15:00', label: 'General Term' }
            ]
          }
        ]
      },
      {
        id: 'probability',
        title: 'Probability & Counting',
        lessons: [
          {
            id: 'probability-basics',
            title: 'Probability Fundamentals',
            duration: '28 min',
            videoId: 'UZyU4t_Tb2U',
            videoQuality: 'must-watch',
            notes: `# Probability Fundamentals

## Basic Concepts
- Experiment: Process with uncertain outcome
- Sample Space (S): All possible outcomes
- Event (E): Subset of sample space

## Probability Formula
P(E) = n(E) / n(S)

## Rules
- 0 ≤ P(E) ≤ 1
- P(S) = 1
- P(E') = 1 - P(E)

## Addition Rule
P(A or B) = P(A) + P(B) - P(A and B)

## Multiplication Rule (Independent)
P(A and B) = P(A) × P(B)

## Types of Probability
1. **Theoretical**: Based on reasoning
2. **Experimental**: Based on trials
3. **Subjective**: Based on judgment`,
            keyPoints: ['Sample space', 'Probability formula', 'Addition rule', 'Multiplication rule'],
            timestamps: [
              { time: '0:00', label: 'Basic Concepts' },
              { time: '8:00', label: 'Rules' },
              { time: '15:00', label: 'Addition Rule' },
              { time: '22:00', label: 'Multiplication Rule' }
            ]
          },
          {
            id: 'counting-principles',
            title: 'Counting Principles',
            duration: '25 min',
            videoId: 'VBvZDwN12c0',
            videoQuality: 'must-watch',
            notes: `# Counting Principles

## Fundamental Counting Principle
If task A can be done in m ways and task B in n ways, then both can be done in m × n ways.

## Permutations
Arrangement of objects in a specific order.

### Formula
P(n,r) = n! / (n-r)!

**Example:** Arrange 3 letters from A,B,C,D
P(4,3) = 4! / 1! = 24

## Combinations
Selection of objects without regard to order.

### Formula
C(n,r) = n! / [r!(n-r)!]

**Example:** Select 3 people from 5
C(5,3) = 10

## Key Differences
- **Permutation**: Order matters
- **Combination**: Order doesn't matter`,
            keyPoints: ['Fundamental principle', 'Permutations', 'Combinations', 'Factorials'],
            timestamps: [
              { time: '0:00', label: 'Fundamental Principle' },
              { time: '8:00', label: 'Permutations' },
              { time: '15:00', label: 'Combinations' }
            ]
          },
          {
            id: 'probability-distributions',
            title: 'Probability Distributions',
            duration: '30 min',
            videoId: 'q1rdK5BuHtA',
            videoQuality: 'supplementary',
            notes: `# Probability Distributions

## Random Variables
A variable that takes on numerical values based on outcomes of a random experiment.

## Discrete vs Continuous
- **Discrete**: Countable values (0,1,2,...)
- **Continuous**: Any value in interval

## Probability Mass Function (PMF)
P(X = x) for discrete variables

## Expected Value
E(X) = Σ[x × P(X = x)]

## Variance
Var(X) = E(X²) - [E(X)]²

## Common Distributions
1. **Binomial**: Fixed number of trials
2. **Poisson**: Rare events
3. **Normal**: Bell-shaped curve`,
            keyPoints: ['Random variables', 'Expected value', 'Variance', 'Binomial distribution'],
            timestamps: [
              { time: '0:00', label: 'Random Variables' },
              { time: '10:00', label: 'Expected Value' },
              { time: '18:00', label: 'Binomial' }
            ]
          }
        ]
      },
      {
        id: 'finance-math',
        title: 'Financial Mathematics',
        lessons: [
          {
            id: 'simple-interest',
            title: 'Simple Interest',
            duration: '20 min',
            videoId: 'P4lQZ1eBqT8',
            videoQuality: 'must-watch',
            notes: `# Simple Interest

## Formula
I = P × r × t

Where:
- I = Interest
- P = Principal (initial amount)
- r = Rate (per year as decimal)
- t = Time (in years)

## Total Amount
A = P + I = P(1 + rt)

## Example
P = R10,000, r = 8% = 0.08, t = 3 years
I = 10,000 × 0.08 × 3 = R2,400
A = 10,000 + 2,400 = R12,400

## Key Difference from Compound
Simple interest calculated on principal only`,
            keyPoints: ['I = Prt', 'Principal', 'Rate', 'Time'],
            timestamps: [
              { time: '0:00', label: 'Formula' },
              { time: '5:00', label: 'Examples' },
              { time: '12:00', label: 'Applications' }
            ]
          },
          {
            id: 'compound-interest',
            title: 'Compound Interest',
            duration: '25 min',
            videoId: 'EpjLT1qC44g',
            videoQuality: 'must-watch',
            notes: `# Compound Interest

## Formula
A = P(1 + r/n)^(nt)

Where:
- A = Final amount
- P = Principal
- r = Annual rate (decimal)
- n = Compounding periods per year
- t = Time in years

## Compound Interest
CI = A - P

## Common Compounding
- Annually: n = 1
- Semi-annually: n = 2
- Quarterly: n = 4
- Monthly: n = 12

## Effective Annual Rate
EAR = (1 + r/n)^n - 1`,
            keyPoints: ['Compound formula', 'Compounding periods', 'Effective rate', 'Future value'],
            timestamps: [
              { time: '0:00', label: 'Formula' },
              { time: '8:00', label: 'Compounding' },
              { time: '15:00', label: 'Effective Rate' }
            ]
          }
        ]
      },
      {
        id: 'trigonometry',
        title: 'Trigonometry',
        lessons: [
          {
            id: 'trig-equations',
            title: 'Solving Trigonometric Equations',
            duration: '30 min',
            videoId: 'N2XpZ2gXGk0',
            videoQuality: 'must-watch',
            notes: `# Solving Trigonometric Equations

## Basic Equations
Solve for x in [0°, 360°]:

### sin x = k
- x = sin⁻¹(k) or 180° - sin⁻¹(k)

### cos x = k
- x = cos⁻¹(k) or 360° - cos⁻¹(k)

### tan x = k
- x = tan⁻¹(k) or 180° + tan⁻¹(k)

## Special Angles
| Angle | sin | cos | tan |
|-------|-----|-----|-----|
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | √2/2 | √2/2 | 1 |
| 60° | √3/2 | 1/2 | √3 |

## Double Angle Formulas
- sin 2θ = 2 sinθ cosθ
- cos 2θ = cos²θ - sin²θ

## Identities to Remember
- sin²θ + cos²θ = 1
- 1 + tan²θ = sec²θ`,
            keyPoints: ['Basic trig equations', 'Special angles', 'Double angle', 'Identities'],
            timestamps: [
              { time: '0:00', label: 'Basic Equations' },
              { time: '10:00', label: 'Special Angles' },
              { time: '20:00', label: 'Double Angle' }
            ]
          },
          {
            id: 'trig-graphs',
            title: 'Trigonometric Graphs',
            duration: '28 min',
            videoId: 'U6_5KhtfT7s',
            videoQuality: 'must-watch',
            notes: `# Trigonometric Graphs

## y = sin x
- Domain: All real numbers
- Range: [-1, 1]
- Period: 360° (2π)
- Amplitude: 1

## y = cos x
- Same as sin shifted 90° left
- Period: 360°

## y = tan x
- Period: 180° (π)
- Asymptotes at 90°, 270°
- Range: all real numbers

## Transformations
y = a sin(b(x - c)) + d
- |a|: Amplitude
- b: Period = 360°/b
- c: Phase shift
- d: Vertical shift`,
            keyPoints: ['Sine graph', 'Cosine graph', 'Tangent graph', 'Transformations'],
            timestamps: [
              { time: '0:00', label: 'Sine Graph' },
              { time: '10:00', label: 'Cosine Graph' },
              { time: '20:00', label: 'Transformations' }
            ]
          }
        ]
      },
      {
        id: 'geometry',
        title: 'Analytical Geometry',
        lessons: [
          {
            id: 'distance-formula',
            title: 'Distance & Midpoint Formula',
            duration: '25 min',
            videoId: 'hH2B9j1VtZQ',
            videoQuality: 'must-watch',
            notes: `# Distance & Midpoint

## Distance Formula
$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$

## Midpoint Formula
$$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$$

## Gradient Formula
$$m = \\frac{y_2-y_1}{x_2-x_1}$$

## Equation of a Line
- Point-slope: y - y₁ = m(x - x₁)
- Slope-intercept: y = mx + c
- Standard form: Ax + By + C = 0`,
            keyPoints: ['Distance formula', 'Midpoint formula', 'Gradient', 'Equation of line'],
            timestamps: [
              { time: '0:00', label: 'Distance' },
              { time: '8:00', label: 'Midpoint' },
              { time: '16:00', label: 'Line Equation' }
            ]
          },
          {
            id: 'circle-geometry',
            title: 'Circles',
            duration: '28 min',
            videoId: 'zI3_5j_NjME',
            videoQuality: 'must-watch',
            notes: `# Circles

## Equation of Circle
Center (a, b), radius r:
$$(x-a)^2 + (y-b)^2 = r^2$$

## Circle at Origin
$$x^2 + y^2 = r^2$$

## Tangent to Circle
- Line perpendicular to radius at point
- Gradient of tangent = -1/gradient of radius

## Intersection of Lines & Circles
Substitute line equation into circle equation`,
            keyPoints: ['Circle equation', 'Tangent', 'Intersection', 'Properties'],
            timestamps: [
              { time: '0:00', label: 'Equation' },
              { time: '10:00', label: 'Tangent' },
              { time: '20:00', label: 'Intersection' }
            ]
          }
        ]
      },
      {
        id: 'statistics',
        title: 'Statistics',
        lessons: [
          {
            id: 'data-analysis',
            title: 'Data Analysis & Representation',
            duration: '30 min',
            videoId: '4nHBrZHrjNQ',
            videoQuality: 'must-watch',
            notes: `# Data Analysis

## Measures of Central Tendency
- Mean: Sum/n
- Median: Middle value (sorted)
- Mode: Most frequent

## Quartiles
- Q1: 25th percentile
- Q2: Median
- Q3: 75th percentile
- IQR = Q3 - Q1

## Box & Whisker Plot
- Shows: Min, Q1, Median, Q3, Max
- Outliers: < Q1 - 1.5×IQR or > Q3 + 1.5×IQR

## Standard Deviation
$$σ = \\sqrt{\\frac{Σ(x - \\bar{x})^2}{n}}$$`,
            keyPoints: ['Mean, median, mode', 'Quartiles', 'Box plot', 'Standard deviation'],
            timestamps: [
              { time: '0:00', label: 'Central Tendency' },
              { time: '10:00', label: 'Quartiles' },
              { time: '20:00', label: 'Standard Deviation' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'physical-sciences-grade-12',
    title: 'Physical Sciences Grade 12',
    subject: 'physical-sciences',
    grade: 12,
    description: 'Master Physics and Chemistry with strategic video selection.',
    difficulty: 'Advanced',
    instructor: 'Prof. James Chen',
    estimatedHours: 50,
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    modules: [
      {
        id: 'mechanics',
        title: 'Mechanics',
        lessons: [
          {
            id: 'newtons-laws',
            title: "Newton's Laws of Motion",
            duration: '35 min',
            videoId: 'kK48msP1VvQ',
            videoQuality: 'must-watch',
            notes: `# Newton's Laws of Motion

## 1. First Law of Motion (Law of Inertia)
"An object remains at rest or in uniform straight-line motion unless acted upon by a net external force."

### Understanding Inertia
Inertia is the property of matter that resists changes in motion. Mass is a measure of inertia:
- More mass = more inertia = harder to change motion
- Less mass = less inertia = easier to change motion

### Real-World Examples:
- Seat belts prevent passengers from continuing forward when a car stops suddenly
- A hockey puck sliding on ice continues moving because friction is minimal
- Objects in space continue moving indefinitely without thrust

### Inertial Reference Frames
Newton's first law applies in inertial (non-accelerating) reference frames. An observer in an accelerating car feels "pushed back" - this is a non-inertial frame where Newton's laws appear to break down.

## 2. Second Law of Motion
"The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."

### The Equation:
$$F = ma$$

Where:
- F = net force (in Newtons, N)
- m = mass (in kilograms, kg)
- a = acceleration (in meters per second squared, m/s²)

### The Newton (Unit of Force):
1 N = 1 kg · 1 m/s²
- Force needed to accelerate 1 kg at 1 m/s²
- Approximately the weight of an apple

### More Detailed Form:
$$\\vec{F}_{net} = \\frac{d\\vec{p}}{dt}$$

Where p = mv (momentum). This form works even when mass changes!

### Types of Forces:
1. **Contact Forces**: Friction, normal force, tension, applied force
2. **Field Forces**: Gravity, electromagnetic forces

### Free Body Diagrams (FBD):
Essential for solving physics problems!
1. Identify all forces acting on object
2. Draw arrow for each force from center of mass
3. Label each arrow with force type and magnitude/direction
4. Choose coordinate system

### Problem-Solving Steps:
1. Draw FBD
2. Choose coordinate axes (usually horizontal/vertical)
3. Resolve forces into components
4. Apply F = ma in each direction
5. Solve system of equations

### Example Problem:
A 5kg box is pulled across a frictionless floor with force of 20N. Find acceleration.
- F = ma
- 20 = 5a
- a = 4 m/s²

### With Friction:
A 5kg box is pulled with 20N on surface with μ = 0.3
- Normal force: N = mg = 5(9.8) = 49 N
- Friction: f = μN = 0.3(49) = 14.7 N
- Net force: F_net = 20 - 14.7 = 5.3 N
- a = 5.3/5 = 1.06 m/s²

## 3. Third Law of Motion
"For every action force, there is an equal and opposite reaction force."

### Key Points:
- Forces ALWAYS come in pairs
- Action and reaction are equal in magnitude but opposite in direction
- They act on DIFFERENT objects!

### Common Misconception:
"Action-reaction pairs cancel each other" - WRONG!
They act on different objects, so they cannot cancel.

### Examples:
1. **Walking**: Foot pushes backward on ground, ground pushes forward on foot
2. **Swimming**: Hands push water backward, water pushes swimmer forward
3. **Rocket propulsion**: Engine pushes gases down, gases push rocket up
4. **Ball hitting wall**: Ball exerts force on wall, wall exerts equal force on ball

### Identifying Action-Reaction Pairs:
1. Identify force on object A due to object B
2. Find force on object B due to object A
3. These are your action-reaction pair

## 4. Applications and Problem Solving

### Normal Force (N):
- Perpendicular to surface
- Equals mg only on horizontal surface
- N = mg·cos(θ) on inclined plane

### Friction Force (f):
- Parallel to surface, opposes motion
- Static friction: f_s ≤ μ_sN (just about to move)
- Kinetic friction: f_k = μ_kN (already moving)
- μ_s > μ_k usually

### Tension (T):
- Pulling force in rope/string
- Same throughout rope (if massless)
- Pulleys can change direction but not magnitude (ideal)

### Weight (W):
- W = mg (force of gravity)
- Direction: always downward
- Different from mass (scalar)!

## 5. Connected Objects
When objects are connected, analyze system or each separately:

### System Analysis:
Treat as single object with combined mass

### Individual Analysis:
Draw FBD for each object, use Newton's third law at contact points

### Example:
Two blocks (m1 = 2kg, m2 = 3kg) pulled by 10N force on frictionless surface
- Total mass = 5 kg
- a = 10/5 = 2 m/s²
- Force on m1: F₁₂ = m₁a = 2(2) = 4 N (m2 pushes m1)
- Force on m2: F₂₁ = m₂a = 3(2) = 6 N (m1 pushes m2)
- Note: F₁₂ + F₂₁ = 4 + 6 = 10 N ✓

## 6. Inclined Planes
### Components of Weight:
- Parallel: mg·sin(θ)
- Perpendicular: mg·cos(θ)

### Acceleration on Incline (frictionless):
a = g·sin(θ)

### With Friction:
a = g(sinθ - μcosθ)

## 7. Key Formulas Summary
| Concept | Formula |
|---------|---------|
| Second Law | F = ma |
| Weight | W = mg |
| Friction | f = μN |
| Normal (horizontal) | N = mg |
| Normal (incline) | N = mg·cosθ |
| Parallel (incline) | F∥ = mg·sinθ |

## 8. Exam Tips
1. Always draw a free body diagram!
2. Identify all forces, don't miss any
3. Use Newton's third law to find contact forces
4. Choose convenient coordinate axes
5. Check your answer: reasonable? units correct?
6. Remember: force causes acceleration, not velocity!`,
            keyPoints: ['F = ma', 'Inertia', 'Action-reaction pairs', 'Free body diagrams', 'Friction', 'Inclined planes', 'Connected objects'],
            timestamps: [
              { time: '0:00', label: 'First Law' },
              { time: '8:00', label: 'Second Law' },
              { time: '18:00', label: 'Third Law' },
              { time: '28:00', label: 'Applications' }
            ]
          },
          {
            id: 'momentum',
            title: 'Momentum & Impulse',
            duration: '30 min',
            videoId: 'zCqc4XIvYls',
            videoQuality: 'must-watch',
            notes: `# Momentum & Impulse

## Momentum
p = mv
- Units: kg·m/s
- Vector quantity

## Impulse
J = FΔt = Δp

## Conservation of Momentum
m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'

## Types of Collisions
1. Elastic: KE conserved
2. Inelastic: KE not conserved`,
            keyPoints: ['p = mv', 'Impulse-momentum', 'Conservation', 'Collisions'],
            timestamps: [
              { time: '0:00', label: 'Momentum' },
              { time: '8:00', label: 'Impulse' },
              { time: '15:00', label: 'Conservation' }
            ]
          },
          {
            id: 'work-energy',
            title: 'Work, Energy & Power',
            duration: '32 min',
            videoId: 'oatwdRW1klg',
            videoQuality: 'must-watch',
            notes: `# Work, Energy & Power

## Work
W = F·d·cosθ
- Units: Joule (J) = N·m

## Kinetic Energy
KE = ½mv²

## Potential Energy
PE = mgh (gravitational)

## Conservation
KE_i + PE_i = KE_f + PE_f`,
            keyPoints: ['W = Fd cosθ', 'Kinetic energy', 'Potential energy', 'Conservation'],
            timestamps: [
              { time: '0:00', label: 'Work' },
              { time: '10:00', label: 'Kinetic Energy' },
              { time: '18:00', label: 'Potential Energy' }
            ]
          }
        ]
      },
      {
        id: 'waves',
        title: 'Waves & Sound',
        lessons: [
          {
            id: 'wave-properties',
            title: 'Wave Properties',
            duration: '28 min',
            videoId: 'CVsdXKO9xlk',
            videoQuality: 'must-watch',
            notes: `# Wave Properties

## Types of Waves
- Mechanical: Require medium
- Electromagnetic: Don't need medium

## Wave Parameters
- Wavelength (λ): Distance between peaks
- Frequency (f): Waves per second (Hz)
- Period (T): Time for one wave
- Speed: v = fλ`,
            keyPoints: ['v = fλ', 'Wavelength & frequency', 'Wave types', 'Interference'],
            timestamps: [
              { time: '0:00', label: 'Wave Types' },
              { time: '8:00', label: 'Parameters' },
              { time: '18:00', label: 'Wave Equation' }
            ]
          },
          {
            id: 'sound-waves',
            title: 'Sound Waves',
            duration: '25 min',
            videoId: 'WiTQxNaKAYA',
            videoQuality: 'must-watch',
            notes: `# Sound Waves

## Nature of Sound
- Mechanical longitudinal wave
- Speed: ~340 m/s in air

## Properties
- Pitch: Frequency
- Loudness: Amplitude

## Doppler Effect
f' = f(v ± v₀)/(v ∓ vₛ)`,
            keyPoints: ['Longitudinal wave', 'Speed in air', 'Doppler effect'],
            timestamps: [
              { time: '0:00', label: 'Nature of Sound' },
              { time: '8:00', label: 'Properties' },
              { time: '15:00', label: 'Doppler Effect' }
            ]
          }
        ]
      },
      {
        id: 'chemistry',
        title: 'Chemical Systems',
        lessons: [
          {
            id: 'chemical-equilibrium',
            title: 'Chemical Equilibrium',
            duration: '35 min',
            videoId: 'cyJxEt5iyBM',
            videoQuality: 'must-watch',
            notes: `# Chemical Equilibrium

## Dynamic Equilibrium
Rate of forward = rate of reverse

## Equilibrium Constant (Kc)
For: aA + bB ⇌ cC + dD
Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ

## Le Chatelier's Principle
When equilibrium is disturbed, system shifts to counteract.

### Factors:
1. Concentration
2. Temperature
3. Pressure`,
            keyPoints: ['Dynamic equilibrium', 'Kc expression', 'Le Chatelier'],
            timestamps: [
              { time: '0:00', label: 'Dynamic Equilibrium' },
              { time: '10:00', label: 'Kc' },
              { time: '20:00', label: 'Le Chatelier' }
            ]
          },
          {
            id: 'acids-bases',
            title: 'Acids & Bases',
            duration: '30 min',
            videoId: 'J9S1sXolR3E',
            videoQuality: 'must-watch',
            notes: `# Acids & Bases

## Brønsted-Lowry
- Acid: Donates H⁺
- Base: Accepts H⁺

## pH Scale
pH = -log[H⁺]
- pH < 7: Acidic
- pH = 7: Neutral
- pH > 7: Basic

## Strong vs Weak
- Strong: Complete dissociation
- Weak: Partial dissociation`,
            keyPoints: ['Brønsted-Lowry', 'pH calculations', 'Conjugate pairs'],
            timestamps: [
              { time: '0:00', label: 'Definitions' },
              { time: '10:00', label: 'pH Scale' },
              { time: '18:00', label: 'Strong vs Weak' }
            ]
          },
          {
            id: 'electrochemistry',
            title: 'Electrochemistry',
            duration: '35 min',
            videoId: 'rDCFmN7DxjM',
            videoQuality: 'must-watch',
            notes: `# Electrochemistry

## Oxidation & Reduction
- Oxidation: Loss of electrons (OIL)
- Reduction: Gain of electrons (RIG)

## Galvanic Cells
Spontaneous reaction producing electricity.

### Components:
- Anode: Oxidation occurs
- Cathode: Reduction occurs
- Salt bridge: Maintains charge balance

## Electrolytic Cells
Non-spontaneous, requires external电源.

## Redox Reactions
Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag

## Standard Reduction Potentials
E°cell = E°cathode - E°anode`,
            keyPoints: ['Oxidation states', 'Galvanic cells', 'Electrolytic cells', 'E°cell'],
            timestamps: [
              { time: '0:00', label: 'Oxidation-Reduction' },
              { time: '10:00', label: 'Galvanic Cells' },
              { time: '20:00', label: 'Electrolytic Cells' }
            ]
          }
        ]
      },
      {
        id: 'electricity-magnetism',
        title: 'Electricity & Magnetism',
        lessons: [
          {
            id: 'electrostatics',
            title: 'Electrostatics',
            duration: '30 min',
            videoId: 'Qq_7i_tY9Fw',
            videoQuality: 'must-watch',
            notes: `# Electrostatics

## Electric Charge
- Positive (+): Proton
- Negative (-): Electron
- Unit: Coulomb (C)

## Coulomb's Law
F = kq₁q₂ / r²
- k = 8.99 × 10⁹ N·m²/C²

## Electric Field
E = F / q = kQ / r²

## Fields Lines
- Point away from positive
- Point toward negative
- Density indicates strength

## Electric Potential
V = kQ / r
Unit: Volt (V)`,
            keyPoints: ['Coulomb\'s Law', 'Electric field', 'Potential', 'Charge'],
            timestamps: [
              { time: '0:00', label: 'Charge' },
              { time: '8:00', label: 'Coulomb\'s Law' },
              { time: '15:00', label: 'Electric Field' }
            ]
          },
          {
            id: 'electric-circuits',
            title: 'Electric Circuits',
            duration: '35 min',
            videoId: 'lQ6wlU4tE7Y',
            videoQuality: 'must-watch',
            notes: `# Electric Circuits

## Ohm's Law
V = IR
- V: Voltage (V)
- I: Current (A)
- R: Resistance (Ω)

## Series Circuits
- RT = R₁ + R₂ + R₃
- Same current throughout
- Voltage divides

## Parallel Circuits
- 1/RT = 1/R₁ + 1/R₂ + 1/R₃
- Same voltage across branches
- Current divides

## Power
P = IV = I²R = V²/R
Unit: Watt (W)

## Resistors in Series vs Parallel
- Series: Add resistances
- Parallel: Decrease total resistance`,
            keyPoints: ['Ohm\'s Law', 'Series circuits', 'Parallel circuits', 'Power'],
            timestamps: [
              { time: '0:00', label: 'Ohm\'s Law' },
              { time: '10:00', label: 'Series Circuits' },
              { time: '18:00', label: 'Parallel Circuits' }
            ]
          },
          {
            id: 'electromagnetism',
            title: 'Electromagnetism',
            duration: '32 min',
            videoId: 'v_-FYPm14xk',
            videoQuality: 'must-watch',
            notes: `# Electromagnetism

## Magnetic Fields
- Produced by moving charges
- Direction: Right-hand rule

## Current & Magnetism
- Oersted's discovery: Current creates magnetic field
- Solenoid: Coil of wire with current

## Force on Moving Charge
F = qvB sinθ
- Perpendicular to both v and B

## Electromagnetic Induction
- Faraday's Law: Changing flux induces EMF
- ε = -dΦ/dt

## Transformers
- Step-up: V₂ > V₁
- Step-down: V₂ < V₁
- V₁/V₂ = N₁/N₂`,
            keyPoints: ['Magnetic fields', 'Force on charge', 'Faraday\'s Law', 'Transformers'],
            timestamps: [
              { time: '0:00', label: 'Magnetic Fields' },
              { time: '10:00', label: 'Force on Charge' },
              { time: '18:00', label: 'Induction' }
            ]
          }
        ]
      },
      {
        id: 'optics',
        title: 'Optics',
        lessons: [
          {
            id: 'light-reflection',
            title: 'Reflection & Mirrors',
            duration: '28 min',
            videoId: 'DQEa5ZjKk1A',
            videoQuality: 'must-watch',
            notes: `# Reflection & Mirrors

## Laws of Reflection
1. Angle of incidence = Angle of reflection
2. Incident ray, normal, reflected ray in same plane

## Mirror Types
- Plane mirror: Virtual, upright image
- Concave mirror: Real inverted (object beyond F)
- Convex mirror: Virtual, upright, diminished

## Mirror Formula
1/f = 1/u + 1/v
- f = focal length
- u = object distance
- v = image distance

## Magnification
M = -v/u = hi/ho`,
            keyPoints: ['Laws of reflection', 'Mirror types', 'Mirror formula', 'Magnification'],
            timestamps: [
              { time: '0:00', label: 'Laws' },
              { time: '10:00', label: 'Mirror Types' },
              { time: '20:00', label: 'Formula' }
            ]
          },
          {
            id: 'light-refraction',
            title: 'Refraction & Lenses',
            duration: '30 min',
            videoId: 'bH6Y4z7XZ1M',
            videoQuality: 'must-watch',
            notes: `# Refraction & Lenses

## Snell's Law
n₁ sinθ₁ = n₂ sinθ₂

## Critical Angle
sinθc = n₂/n₁ (n₁ > n₂)

## Lens Types
- Converging (convex): Real/focus light
- Diverging (concave): Virtual/diverge light

## Lens Formula
1/f = 1/u + 1/v

## Power of Lens
P = 1/f (in meters)
Unit: Dioptre (D)`,
            keyPoints: ['Snell\'s Law', 'Critical angle', 'Lens types', 'Lens formula'],
            timestamps: [
              { time: '0:00', label: 'Refraction' },
              { time: '10:00', label: 'Critical Angle' },
              { time: '20:00', label: 'Lenses' }
            ]
          }
        ]
      },
      {
        id: 'matter',
        title: 'Matter & Materials',
        lessons: [
          {
            id: 'atomic-structure',
            title: 'Atomic Structure',
            duration: '32 min',
            videoId: 'v_3K4j4v8Q',
            videoQuality: 'must-watch',
            notes: `# Atomic Structure

## Sub-atomic Particles
- Protons: +1, mass 1u
- Neutrons: 0, mass 1u
- Electrons: -1, negligible mass

## Isotopes
Same atomic number, different mass number

## Electron Configuration
- Shells: K, L, M, N (max 2, 8, 18, 32)
- valence electrons determine reactivity

## Periodic Table Trends
- Atomic radius decreases across period
- Electronegativity increases across period`,
            keyPoints: ['Sub-atomic particles', 'Isotopes', 'Electron config', 'Periodic trends'],
            timestamps: [
              { time: '0:00', label: 'Particles' },
              { time: '10:00', label: 'Isotopes' },
              { time: '20:00', label: 'Trends' }
            ]
          },
          {
            id: 'chemical-bonding',
            title: 'Chemical Bonding',
            duration: '30 min',
            videoId: 'q_a9K3K8vT',
            videoQuality: 'must-watch',
            notes: `# Chemical Bonding

## Types of Bonds
### Ionic: Metal + Non-metal
- Transfer of electrons
- Strong, high melting point
- Conduct electricity when dissolved

### Covalent: Non-metal + Non-metal
- Sharing of electrons
- Can be polar or non-polar

### Metallic: Metal + Metal
- Sea of electrons
- Conduct heat and electricity

## Lewis Structures
Show valence electrons around atoms`,
            keyPoints: ['Ionic bonding', 'Covalent bonding', 'Metallic bonding', 'Lewis structures'],
            timestamps: [
              { time: '0:00', label: 'Types' },
              { time: '10:00', label: 'Ionic' },
              { time: '20:00', label: 'Covalent' }
            ]
          }
        ]
      },
      {
        id: 'organic-chem',
        title: 'Organic Chemistry',
        lessons: [
          {
            id: 'hydrocarbons',
            title: 'Hydrocarbons',
            duration: '35 min',
            videoId: 'v_9K4j4v8U',
            videoQuality: 'must-watch',
            notes: `# Hydrocarbons

## Alkanes (CₙH₂ₙ₊₂)
- Single bonds only
- Saturated
- General formula: CₙH₂ₙ₊₂

## Alkenes (CₙH₂ₙ)
- At least one double bond
- Unsaturated
- General formula: CₙH₂ₙ

## Alkynes (CₙH₂ₙ₋₂)
- At least one triple bond
- Highly unsaturated

## Reactions
- Combustion: CxHy + O₂ → CO₂ + H₂O
- Substitution (alkanes): UV light
- Addition (alkenes/alkynes): Br₂, H₂, H₂O`,
            keyPoints: ['Alkanes', 'Alkenes', 'Alkynes', 'Reactions'],
            timestamps: [
              { time: '0:00', label: 'Alkanes' },
              { time: '12:00', label: 'Alkenes' },
              { time: '25:00', label: 'Reactions' }
            ]
          },
          {
            id: 'functional-groups',
            title: 'Functional Groups',
            duration: '32 min',
            videoId: 'w_a8K3K8vX',
            videoQuality: 'must-watch',
            notes: `# Functional Groups

## Alcohols (-OH)
- Primary, Secondary, Tertiary
- Oxidation: Primary → Aldehyde → Carboxylic acid
- Secondary → Ketone

## Carboxylic Acids (-COOH)
- Weak acids
- Form esters with alcohols

## Esters (-COO-)
- Formed from acid + alcohol
- Sweet/fruity smell

## Amines (-NH₂)
- Basic
- Found in amino acids`,
            keyPoints: ['Alcohols', 'Carboxylic acids', 'Esters', 'Amines'],
            timestamps: [
              { time: '0:00', label: 'Alcohols' },
              { time: '12:00', label: 'Acids' },
              { time: '22:00', label: 'Esters' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'life-sciences-grade-12',
    title: 'Life Sciences Grade 12',
    subject: 'life-sciences',
    grade: 12,
    description: 'Master Genetics, Evolution, and Human Biology.',
    difficulty: 'Intermediate',
    instructor: 'Dr. Emily Watson',
    estimatedHours: 35,
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800',
    modules: [
      {
        id: 'genetics',
        title: 'Genetics',
        lessons: [
          {
            id: 'dna-structure',
            title: 'DNA Structure & Replication',
            duration: '30 min',
            videoId: '8kK2zwjRV0M',
            videoQuality: 'must-watch',
            notes: `# DNA Structure & Replication

## 1. The Discovery of DNA
DNA (Deoxyribonucleic Acid) was identified as the genetic material through key experiments:
- **Griffith's Transformation Experiment** (1928): Showed something in bacteria could transfer genetic information
- **Avery, MacLeod & McCarty** (1944): Identified DNA as the transforming principle
- **Hershey-Chase Experiment** (1952): Proved DNA (not protein) is genetic material
- **Watson & Crick** (1953): Proposed double helix structure with help from Rosalind Franklin's X-ray data

## 2. DNA Structure - The Double Helix

### Overall Structure:
- Two antiparallel strands winding around each other
- Right-handed helix
- Approximately 10 base pairs per turn
- Diameter: 2nm, turn pitch: 3.4nm

### The Backbone (Sugar-Phosphate):
- Deoxyribose sugar + phosphate group
- Sugar is connected to phosphate via phosphodiester bonds
- 5' to 3' direction on each strand
- Provides structural framework

### The Bases (Nitrogenous Bases):
**Purines (double ring) - larger:**
- Adenine (A)
- Guanine (G)

**Pyrimidines (single ring) - smaller:**
- Cytosine (C)
- Thymine (T)

### Base Pairing Rules:
- **Adenine pairs with Thymine** (2 hydrogen bonds)
- **Guanine pairs with Cytosine** (3 hydrogen bonds)

This is called **complementary base pairing** - crucial for replication and information storage!

### Why This Structure?
- Complementary pairing allows for accurate replication
- Hydrogen bonds are strong enough to hold strands together but weak enough to separate when needed
- Antiparallel strands allow for antiparallel replication

## 3. DNA vs RNA

| Feature | DNA | RNA |
|---------|-----|-----|
| Sugar | Deoxyribose | Ribose |
| Bases | A, T, G, C | A, U, G, C |
| Strands | Double stranded | Usually single stranded |
| Location | Nucleus | Nucleus + Cytoplasm |
| Function | Storage of genetic info | Protein synthesis |

## 4. DNA Replication - Copying the Code

### Why Does DNA Replicate?
- Cell division requires identical copies of DNA
-DNA gets damaged and needs repair
- Evolution requires reproduction

### The Semi-Conservative Model:
Each new DNA molecule consists of one old (parent) strand and one newly synthesized (daughter) strand. This was proven by Meselson and Stahl's experiment (1958).

### The Replication Process:

**Step 1: Initiation**
- Origin of replication (specific sequence)
- Helicase enzyme unwinds the double helix
- Creates "replication fork"
- Single-strand binding proteins stabilize single strands

**Step 2: Primer Synthesis**
- Primase synthesizes short RNA primer
- Primer provides starting point for DNA polymerase
- Usually 10-12 nucleotides long

**Step 3: Elongation**
- **Leading strand**: Continuous synthesis toward replication fork
- **Lagging strand**: Discontinuous synthesis away from fork
  - Okazaki fragments (100-200 nucleotides)
  - DNA polymerase III adds nucleotides (5' to 3')
  - Proofreading by DNA polymerase I

**Step 4: Processing**
- DNA polymerase I removes RNA primers
- DNA ligase joins Okazaki fragments
- Ligase also repairs nicks

### Key Enzymes:

| Enzyme | Function |
|--------|----------|
| Helicase | Unwinds DNA double helix |
| Topoisrelieve | Relieves tension ahead of fork |
| Primase | Synthesizes RNA primers |
| DNA Polymerase III | Main replication enzyme |
| DNA Polymerase I | Removes primers, replaces with DNA |
| Ligase | Joins DNA fragments |

## 5. The Genetic Code

### Codons:
- 3 nucleotides = 1 codon
- 64 possible codons (4³)
- 61 code for amino acids
- 3 are STOP codons (UAA, UAG, UGA)
- AUG is START codon (also codes for Methionine)

### Reading the Code:
- Read in 5' to 3' direction
- Non-overlapping
- Degenerate (redundant) - multiple codons can code for same amino acid

## 6. Mutations - Changes in DNA

### Types of Mutations:

**Point Mutations:**
- Substitution: One nucleotide replaced
  - Silent: No amino acid change
  - Missense: Different amino acid
  - Nonsense: Creates STOP codon

**Frameshift Mutations:**
- Insertion or deletion of nucleotides
- Shifts entire reading frame
- Usually severe consequences

### Causes of Mutations:
- Spontaneous errors in replication
- Environmental factors (radiation, chemicals)
- Transposable elements

## 7. DNA Technology Applications

### DNA Fingerprinting:
- Used in forensics, paternity testing
- Analyzes VNTRs (Variable Number Tandem Repeats)
- Unique to each individual (except identical twins)

### Polymerase Chain Reaction (PCR):
- Amplifies specific DNA sequences
- Used in diagnostics, forensics, research

### Gene Cloning:
- Inserting genes into vectors
- Producing proteins medically/industrially

## 8. Important Concepts to Remember
1. DNA is antiparallel and double-stranded
2. A pairs with T, G pairs with C
3. Replication is semi-conservative
4. DNA polymerase can only add nucleotides to 3' end
5. Leading strand is continuous, lagging is discontinuous
6. Mutations can be silent, missense, or nonsense

## 9. Exam Tips
- Know base pairing rules!
- Understand difference between leading and lagging strand
- Remember: DNA polymerase needs primer, cannot start from scratch
- Semi-conservative means each new DNA has one old and one new strand`,
            keyPoints: ['Double helix', 'Base pairing (A-T, G-C)', 'Semi-conservative replication', 'Helicase and DNA polymerase', 'Okazaki fragments', 'Genetic code'],
            timestamps: [
              { time: '0:00', label: 'Structure' },
              { time: '10:00', label: 'Replication' },
              { time: '20:00', label: 'Enzymes' }
            ]
          },
          {
            id: 'protein-synthesis',
            title: 'Protein Synthesis',
            duration: '35 min',
            videoId: 'yLQe138HY3s',
            videoQuality: 'must-watch',
            notes: `# Protein Synthesis - From DNA to Protein

## 1. The Central Dogma of Molecular Biology
The flow of genetic information:
**DNA → RNA → Protein**

Francis Crick proposed this in 1958:
- **Transcription**: DNA → mRNA (in nucleus)
- **Translation**: mRNA → Protein (at ribosome)

## 2. Transcription - Making the Message

### What is Transcription?
Transcription is the process of copying a gene's DNA sequence into messenger RNA (mRNA). Only one strand of DNA is transcribed (the template strand).

### The Gene:
- Gene = segment of DNA that codes for a functional product (usually protein)
- Promoter = region where transcription begins (e.g., TATA box)
- Structural gene = the part that gets transcribed

### The Transcription Process:

**Step 1: Initiation**
- RNA polymerase binds to promoter region
- In eukaryotes: requires transcription factors
- In prokaryotes: sigma factor helps
- Transcription factors form transcription initiation complex

**Step 2: Elongation**
- RNA polymerase moves along template strand (3' to 5')
- Synthesizes RNA in 5' to 3' direction
- Adds complementary nucleotides:
  - DNA A → RNA U
  - DNA T → RNA A
  - DNA C → RNA G
  - DNA G → RNA C

**Step 3: Termination**
- In eukaryotes: polyadenylation signal (AAUAAA)
- RNA polymerase releases
- Pre-mRNA is produced

### RNA Processing (Eukaryotes Only!):
Before mRNA leaves nucleus:

**1. 5' Capping:**
- Adds 7-methylguanosine cap
- Protects mRNA from degradation
- Helps ribosome attach

**2. 3' Polyadenylation:**
- Adds poly-A tail (150-200 adenine nucleotides)
- Protects 3' end
- Helps export from nucleus

**3. RNA Splicing:**
- Introns (non-coding) removed
- Exons (coding) joined together
- Done by spliceosome
- Alternative splicing: one gene → multiple proteins!

### Types of RNA:
| Type | Function |
|------|----------|
| mRNA | Carries genetic code to ribosome |
| tRNA | Brings amino acids to ribosome |
| rRNA | Makes up ribosome structure |
| miRNA | Regulates gene expression |
| snRNA | Involved in splicing |

## 3. Translation - Building the Protein

### The Players:

**mRNA (Messenger RNA):**
- Carries genetic code from DNA to ribosome
- Read in triplets (codons)
- 5' cap helps ribosome attach

**tRNA (Transfer RNA):**
- "Adaptor" molecule
- Has anticodon at one end
- Carries specific amino acid at other end
- Recognizes codons via anticodon

**Ribosome:**
- Made of rRNA and proteins
- Has two subunits (large and small)
- Has three sites: A, P, E
- Catalyzes peptide bond formation

### The Genetic Code:
- 64 codons → 20 amino acids
- Start codon: AUG (Methionine)
- Stop codons: UAA, UAG, UGA
- Degenerate/redundant: Multiple codons can code same amino acid
- Universal (nearly): Same code in almost all organisms!

### The Translation Process:

**Step 1: Initiation**
- Small ribosomal subunit binds to 5' cap
- Scans to first AUG (start codon)
- Large subunit joins
- Initiator tRNA (Met) binds to P site

**Step 2: Elongation**
- Aminoacyl-tRNA enters A site (codon-ant codon pairing)
- Peptide bond forms between amino acids in P and A sites
- Ribosome translocates: tRNA in A → P site, tRNA in P → E site
- Empty tRNA ejected from E site
- Process repeats

**Step 3: Termination**
- Stop codon enters A site
- Release factor binds
- Polypeptide released
- Ribosome subunits dissociate

### Peptide Bond Formation:
- Bond forms between carboxyl group of amino acid in P site and amino group of amino acid in A site
- Catalyzed by rRNA (ribozyme) - not by protein!

## 4. Post-Translational Modification

After translation, proteins may be modified:
- **Folding**: Chaperone proteins help proper 3D shape
- **Cleavage**: Cutting polypeptide into smaller pieces
- **Phorylation**: Adding phosphate groups (regulates activity)
- **Glycosylation**: Adding carbohydrate groups
- **Methylation**: Adding methyl groups

## 5. Mutations and Protein Synthesis

### Effects on Proteins:

**Silent Mutation:**
- Same amino acid (due to degenerate code)
- Usually no effect

**Missense Mutation:**
- Different amino acid
- May affect protein function
- Severity depends on importance of amino acid

**Nonsense Mutation:**
- Creates STOP codon
- Truncated (shortened) protein
- Usually non-functional

**Frameshift Mutation:**
- Insertion/deletion not in multiples of 3
- Shifts reading frame
- Usually severe consequences

## 6. Gene Expression Regulation

**In Prokaryotes:**
- Operons: Group of genes under one promoter
- Repressor protein binds to operator
- Lac operon example: lactose presence removes repressor

**In Eukaryotes:**
- Chromatin remodeling
- Transcription factors
- RNA processing
- mRNA stability
- miRNA regulation

## 7. Biotechnology Applications

### Recombinant DNA Technology:
- Cut DNA with restriction enzymes
- Insert into plasmid vector
- Transform into bacteria
- Produce protein (insulin, growth hormone, etc.)

### CRISPR-Cas9:
- Guide RNA directs Cas9 to specific location
- Cas9 cuts DNA
- Can disable gene or insert new sequence

## 8. Key Concepts Summary
1. Central dogma: DNA → RNA → Protein
2. Transcription: DNA → mRNA (in nucleus)
3. Translation: mRNA → Protein (at ribosome)
4. mRNA is read in codons (3 nucleotides)
5. tRNA brings amino acids, matches via anticodon
6. Ribosome has A, P, E sites
7. AUG is start codon, UAA/UAG/UGA are stop codons

## 9. Exam Tips
- Know difference between transcription and translation
- Remember: mRNA is read 5' to 3', adds amino acids to C-terminus
- Understand codon-anticodon pairing (remember: A-U, G-C)
- Know that ribosome catalyzes peptide bond formation (rRNA!)
- Understand how mutations affect protein synthesis`,
            keyPoints: ['Transcription', 'Translation', 'Genetic code', 'mRNA processing', 'tRNA and ribosome', 'Mutations'],
            timestamps: [
              { time: '0:00', label: 'Transcription' },
              { time: '12:00', label: 'Translation' },
              { time: '22:00', label: 'Genetic Code' }
            ]
          },
          {
            id: 'inheritance',
            title: 'Mendelian Inheritance',
            duration: '28 min',
            videoId: 'NWqgZUnJdAY',
            videoQuality: 'must-watch',
            notes: `# Mendelian Inheritance

## Key Terms
- Gene: Unit of heredity
- Allele: Different versions
- Dominant vs Recessive
- Genotype vs Phenotype

## Laws
1. Dominance
2. Segregation
3. Independent Assortment`,
            keyPoints: ['Dominant/Recessive', 'Punnett squares', 'Mendel\'s Laws'],
            timestamps: [
              { time: '0:00', label: 'Key Terms' },
              { time: '8:00', label: 'Punnett Square' },
              { time: '16:00', label: 'Mendel\'s Laws' }
            ]
          }
        ]
      },
      {
        id: 'evolution',
        title: 'Evolution',
        lessons: [
          {
            id: 'evolution-evidence',
            title: 'Evidence for Evolution',
            duration: '25 min',
            videoId: 'ffd5J3kQ7lU',
            videoQuality: 'must-watch',
            notes: `# Evidence for Evolution

## Fossil Record
Shows transitional forms over time

## Comparative Anatomy
- Homologous: Common ancestry
- Analogous: Similar function

## Molecular Evidence
- DNA sequences
- Protein structures`,
            keyPoints: ['Fossils', 'Homologous structures', 'Molecular evidence'],
            timestamps: [
              { time: '0:00', label: 'Fossils' },
              { time: '8:00', label: 'Anatomy' },
              { time: '16:00', label: 'DNA Evidence' }
            ]
          }
        ]
      },
      {
        id: 'human-reproduction',
        title: 'Human Reproduction',
        lessons: [
          {
            id: 'male-reproductive',
            title: 'Male Reproductive System',
            duration: '22 min',
            videoId: 'gP3Mu6GmSBk',
            videoQuality: 'must-watch',
            notes: `# Male Reproductive System

## Structures
- Testes: Produce sperm + testosterone
- Epididymis: Sperm maturation
- Vas deferens: Transport

## Spermatogenesis
1. Mitosis → spermatogonia
2. Meiosis → spermatids
3. Differentiation → spermatozoa`,
            keyPoints: ['Testes function', 'Spermatogenesis', 'Hormones'],
            timestamps: [
              { time: '0:00', label: 'Structures' },
              { time: '8:00', label: 'Spermatogenesis' },
              { time: '15:00', label: 'Hormones' }
            ]
          },
          {
            id: 'female-reproductive',
            title: 'Female Reproductive System',
            duration: '25 min',
            videoId: 'R0P4y8A4j5Y',
            videoQuality: 'must-watch',
            notes: `# Female Reproductive System

## Structures
- Ovaries: Produce oocytes + hormones
- Fallopian tubes: Fertilization site
- Uterus: Implantation

## Menstrual Cycle (28 days)
- Days 1-5: Menstruation
- Days 6-14: Follicular
- Day 14: Ovulation
- Days 15-28: Luteal`,
            keyPoints: ['Ovaries', 'Oogenesis', 'Menstrual cycle'],
            timestamps: [
              { time: '0:00', label: 'Structures' },
              { time: '8:00', label: 'Oogenesis' },
              { time: '15:00', label: 'Cycle' }
            ]
          }
        ]
      },
      {
        id: 'human-biology',
        title: 'Human Biology',
        lessons: [
          {
            id: 'nervous-system',
            title: 'The Nervous System',
            duration: '35 min',
            videoId: '3bR3m85X8s8',
            videoQuality: 'must-watch',
            notes: `# The Nervous System

## Central Nervous System (CNS)
- Brain: Cerebrum, Cerebellum, Medulla
- Spinal Cord

## Peripheral Nervous System (PNS)
- Somatic: Voluntary
- Autonomic: Involuntary
  - Sympathetic: Fight or flight
  - Parasympathetic: Rest and digest

## Neurons
- Sensory: Receive stimuli
- Motor: Send response
- Interconnector: Connect

## Nerve Impulse
1. Resting potential: -70mV
2. Depolarization: Na⁺ influx
3. Repolarization: K⁺ efflux
4. Refractory period

## Synapse
- Neurotransmitters
- Acetylcholine
- Noradrenaline`,
            keyPoints: ['CNS vs PNS', 'Neuron types', 'Action potential', 'Synapse'],
            timestamps: [
              { time: '0:00', label: 'CNS' },
              { time: '10:00', label: 'PNS' },
              { time: '18:00', label: 'Neurons' },
              { time: '25:00', label: 'Synapse' }
            ]
          },
          {
            id: 'excretory-system',
            title: 'Excretory System',
            duration: '28 min',
            videoId: 'Foo-Y1X0nCw',
            videoQuality: 'must-watch',
            notes: `# Excretory System

## Excretion vs Excretion
- Excretion: Removal of metabolic wastes
- Egestion: Removal of undigested food

## Human Excretory Organs
1. Lungs: CO₂, H₂O
2. Skin: Sweat (water, salts, urea)
3. Liver: Urea (from ammonia)
4. Kidneys: Urine

## Kidney Structure
- Cortex
- Medulla
- Pelvis

## Nephron
1. Glomerular filtration
2. Tubular reabsorption
3. Tubular secretion

## Urine Composition
- Water (95%)
- Urea
- Salts
- Creatinine`,
            keyPoints: ['Kidney structure', 'Nephron function', 'Urine formation', 'Homeostasis'],
            timestamps: [
              { time: '0:00', label: 'Excretory Organs' },
              { time: '8:00', label: 'Kidney' },
              { time: '15:00', label: 'Nephron' },
              { time: '22:00', label: 'Urine' }
            ]
          },
          {
            id: 'immune-system',
            title: 'The Immune System',
            duration: '30 min',
            videoId: 'CElgMdZVUeM',
            videoQuality: 'must-watch',
            notes: `# The Immune System

## Types of Immunity
1. **Innate**: Non-specific (skin, mucous, phagocytes)
2. **Adaptive**: Specific (B-cells, T-cells)

## Line of Defense
1. First: Physical barriers (skin)
2. Second: Phagocytes, inflammation
3. Third: Specific immune response

## Immune Response
- **Humoral**: B-cells → Antibodies
- **Cell-mediated**: T-cells → Destroy infected cells

## Antigens & Antibodies
- Antigen: Foreign substance
- Antibody: Protein that binds antigen

## Vaccination
- Active: Weak/dead pathogen
- Passive: Ready-made antibodies`,
            keyPoints: ['Innate vs Adaptive', 'B-cells and T-cells', 'Antibodies', 'Vaccines'],
            timestamps: [
              { time: '0:00', label: 'Defense Lines' },
              { time: '10:00', label: 'Immune Response' },
              { time: '18:00', label: 'Antigens' },
              { time: '24:00', label: 'Vaccination' }
            ]
          }
        ]
      },
      {
        id: 'plants',
        title: 'Plant Biology',
        lessons: [
          {
            id: 'plant-structure',
            title: 'Plant Tissues & Structure',
            duration: '30 min',
            videoId: 'cKHL_K3rYpA',
            videoQuality: 'must-watch',
            notes: `# Plant Tissues

## Meristematic Tissue
- Growth zones
- Apical, lateral, intercalary

## Permanent Tissues
- Epidermis: Protection
- Xylem: Water transport (up)
- Phloem: Food transport (down)
- Collenchyma: Support
- Sclerenchyma: Hard support

## Plant Organs
- Roots: Absorption, anchorage
- Stems: Support, transport
- Leaves: Photosynthesis`,
            keyPoints: ['Meristems', 'Xylem & Phloem', 'Plant organs', 'Functions'],
            timestamps: [
              { time: '0:00', label: 'Tissues' },
              { time: '10:00', label: 'Vascular' },
              { time: '20:00', label: 'Organs' }
            ]
          },
          {
            id: 'plant-reproduction',
            title: 'Plant Reproduction',
            duration: '28 min',
            videoId: 'yHPLL1n5j8U',
            videoQuality: 'must-watch',
            notes: `# Plant Reproduction

## Asexual Reproduction
- Vegetative: Runners, tubers, bulbs
- Spores: Ferns, mosses

## Sexual Reproduction
- Flowers: Reproductive organs
- Pollination: Transfer of pollen
- Fertilization: Pollen tube → ovule
- Fruit development: ovary → fruit
- Seed dispersal: Wind, animals, water

## Alternation of Generations
- Sporophyte (diploid)
- Gametophyte (haploid)`,
            keyPoints: ['Asexual reproduction', 'Sexual reproduction', 'Pollination', 'Seed dispersal'],
            timestamps: [
              { time: '0:00', label: 'Asexual' },
              { time: '10:00', label: 'Sexual' },
              { time: '20:00', label: 'Dispersal' }
            ]
          }
        ]
      },
      {
        id: 'evolution',
        title: 'Evolution',
        lessons: [
          {
            id: 'evolution-mechanisms',
            title: 'Mechanisms of Evolution',
            duration: '35 min',
            videoId: '4TiA7K3j8V',
            videoQuality: 'must-watch',
            notes: `# Mechanisms of Evolution

## Darwin's Theory
1. Variation exists in populations
2. More offspring than survive
3. Survival of the fittest
4. Adaptation to environment

## Sources of Variation
- Mutations: Genetic changes
- Gene flow: Between populations
- Sexual reproduction: Recombination

## Natural Selection
- Directional: One extreme favored
- Stabilizing: Average favored
- Disruptive: Both extremes favored

## Evidence
- Fossil record
- Comparative anatomy
- Molecular evidence (DNA)
- Biogeography`,
            keyPoints: ['Darwin\'s theory', 'Variation', 'Natural selection', 'Evidence'],
            timestamps: [
              { time: '0:00', label: 'Theory' },
              { time: '12:00', label: 'Variation' },
              { time: '25:00', label: 'Evidence' }
            ]
          },
          {
            id: 'human-evolution',
            title: 'Human Evolution',
            duration: '30 min',
            videoId: '5Uj5K3j8W',
            videoQuality: 'must-watch',
            notes: `# Human Evolution

## Hominin Evolution
- Australopithecus → Homo habilis → Homo erectus → Homo sapiens

## Key Characteristics
- Bipedalism
- Large brain
- Tool use
- Language

## Evidence
- Fossil skulls
- Footprints (Laetoli)
- DNA analysis
- Stone tools`,
            keyPoints: ['Hominins', 'Key adaptations', 'Timeline', 'Evidence'],
            timestamps: [
              { time: '0:00', label: 'Timeline' },
              { time: '12:00', label: 'Adaptations' },
              { time: '22:00', label: 'Evidence' }
            ]
          }
        ]
      },
      {
        id: 'ecology',
        title: 'Ecology',
        lessons: [
          {
            id: 'ecosystems',
            title: 'Ecosystems & Energy Flow',
            duration: '32 min',
            videoId: '6V6K4j8X',
            videoQuality: 'must-watch',
            notes: `# Ecosystems

## Components
- Biotic: Living (producers, consumers, decomposers)
- Abiotic: Non-living (temp, water, light, soil)

## Energy Flow
- Producers → Primary consumers → Secondary → Tertiary
- 10% rule: Only 10% transfers to next level

## Food Webs
- Interconnected food chains
- Show dependencies

## Biomes
- Terrestrial: Tundra, desert, forest, grassland
- Aquatic: Freshwater, marine`,
            keyPoints: ['Biotic/abiotic', 'Energy flow', 'Food webs', 'Biomes'],
            timestamps: [
              { time: '0:00', label: 'Components' },
              { time: '12:00', label: 'Energy' },
              { time: '22:00', label: 'Biomes' }
            ]
          },
          {
            id: 'conservation',
            title: 'Conservation & Biodiversity',
            duration: '28 min',
            videoId: '7W7K4j8Y',
            videoQuality: 'must-watch',
            notes: `# Conservation

## Threats to Biodiversity
- Habitat loss
- Pollution
- Overexploitation
- Invasive species
- Climate change

## Conservation Strategies
- Protected areas
- Captive breeding
- Sustainable use
- Education

## SA Conservation
- National parks
- Endangered species: Rhino, elephant, leopard
- Marine protected areas`,
            keyPoints: ['Threats', 'Strategies', 'SA examples', 'Sustainability'],
            timestamps: [
              { time: '0:00', label: 'Threats' },
              { time: '10:00', label: 'Strategies' },
              { time: '20:00', label: 'SA Conservation' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'geography-grade-12',
    title: 'Geography Grade 12',
    subject: 'geography',
    grade: 12,
    description: 'Physical and Human Geography for matric.',
    difficulty: 'Intermediate',
    instructor: 'Mr. David Brown',
    estimatedHours: 30,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    modules: [
      {
        id: 'geomorphology',
        title: 'Geomorphology',
        lessons: [
          {
            id: 'weathering',
            title: 'Weathering & Erosion',
            duration: '25 min',
            videoId: 'P0v0-3-gZB4',
            videoQuality: 'must-watch',
            notes: `# Weathering & Erosion

## Weathering
Breakdown of rocks in place

### Types:
1. Physical: Frost wedging, thermal
2. Chemical: Oxidation, hydrolysis
3. Biological: Lichens, roots

## Erosion Agents
- Water
- Wind
- Ice (glaciers)
- Gravity`,
            keyPoints: ['Physical weathering', 'Chemical weathering', 'Erosion agents'],
            timestamps: [
              { time: '0:00', label: 'Weathering Types' },
              { time: '10:00', label: 'Chemical' },
              { time: '17:00', label: 'Erosion' }
            ]
          },
          {
            id: 'drainage-basins',
            title: 'Drainage Basins',
            duration: '28 min',
            videoId: 'wW0sAkXa6L0',
            videoQuality: 'must-watch',
            notes: `# Drainage Basins

## Key Concepts
- Drainage Basin: Area drained by river
- Watershed: Boundary between basins
- Confluence: Where rivers meet
- Tributary: Smaller river joining main

## River Stages
1. Youthful: V-shaped valley
2. Mature: Meanders develop
3. Old: Deltas form`,
            keyPoints: ['Drainage basin', 'River stages', 'Features'],
            timestamps: [
              { time: '0:00', label: 'Basin Concepts' },
              { time: '10:00', label: 'River Stages' },
              { time: '20:00', label: 'Features' }
            ]
          }
        ]
      },
      {
        id: 'climatology',
        title: 'Climatology',
        lessons: [
          {
            id: 'climate-factors',
            title: 'Factors Influencing Climate',
            duration: '30 min',
            videoId: 'rBqBThz2j3Q',
            videoQuality: 'must-watch',
            notes: `# Factors Influencing Climate

## 1. Latitude
Temperature decreases with latitude

## 2. Altitude
Temperature decreases ~6.5°C/1000m

## 3. Distance from Sea
- Maritime: Moderate
- Continental: Extreme

## 4. Ocean Currents
Warm/Cold currents affect coast

## 5. Prevailing Winds
Onshore = moist, Offshore = dry`,
            keyPoints: ['Latitude effect', 'Altitude effect', 'Ocean currents'],
            timestamps: [
              { time: '0:00', label: 'Latitude & Altitude' },
              { time: '12:00', label: 'Ocean Influence' },
              { time: '20:00', label: 'Winds' }
            ]
          },
          {
            id: 'global-climate',
            title: 'Global Climate Zones',
            duration: '28 min',
            videoId: 'AdQlg3eZgpY',
            videoQuality: 'must-watch',
            notes: `# Global Climate Zones

## Tropical (0°-23.5°)
- Hot year-round
- High rainfall
- Types: Af, Am, Aw

## Arid (15°-35°)
- Low rainfall
- High evaporation
- Types: BWh, BWk, BSh, BSk

## Temperate (35°-55°)
- Moderate temperature
- Seasonal variation
- Types: Cfa, Cfb, Cfc, Csa, Csb

## Continental (55°-70°)
- Cold winters
- Warm summers
- Types: Dfa, Dfb, Dfc

## Polar (>70°)
- Very cold
- Ice cap/Tundra
- Types: ET, EF`,
            keyPoints: ['Tropical zone', 'Arid zone', 'Temperate zone', 'Polar zone'],
            timestamps: [
              { time: '0:00', label: 'Tropical' },
              { time: '8:00', label: 'Arid' },
              { time: '14:00', label: 'Temperate' },
              { time: '20:00', label: 'Polar' }
            ]
          }
        ]
      },
      {
        id: 'geographic-skills',
        title: 'Geographic Skills',
        lessons: [
          {
            id: 'map-reading',
            title: 'Map Reading & Interpretation',
            duration: '30 min',
            videoId: 'pXcDqwI_g',
            videoQuality: 'must-watch',
            notes: `# Map Reading & Interpretation

## Map Elements
- Scale: Ratio of distance
- Legend: Symbols meaning
- Direction: North indicator
- Grid: Latitude/Longitude

## Types of Maps
- Topographic: Contour lines
- Choropleth: Statistical data
- Dot: Distribution
- Isoline: Connect equal values

## Contour Lines
- Close together: Steep
- Far apart: Gentle
- V-shape: Valley
- Loop: Summit

## Scale Types
- Ratio: 1:50,000
- Verbal: "1cm = 1km"
- Graphic: Bar scale`,
            keyPoints: ['Map elements', 'Contour lines', 'Scale types', 'Map symbols'],
            timestamps: [
              { time: '0:00', label: 'Elements' },
              { time: '8:00', label: 'Contours' },
              { time: '18:00', label: 'Scale' }
            ]
          },
          {
            id: 'gis-remote-sensing',
            title: 'GIS & Remote Sensing',
            duration: '25 min',
            videoId: 'd5Ys7lHG4UA',
            videoQuality: 'supplementary',
            notes: `# GIS & Remote Sensing

## Geographic Information Systems (GIS)
- Computer-based data analysis
- Layered spatial data
- Spatial querying

## Remote Sensing
- Satellite imagery
- Aerial photography
- Electromagnetic spectrum

## Applications
- Land use planning
- Environmental monitoring
- Disaster management
- Urban planning

## GIS Processes
1. Data capture
2. Storage
3. Analysis
4. Output/Display`,
            keyPoints: ['GIS components', 'Remote sensing', 'Spatial analysis', 'Applications'],
            timestamps: [
              { time: '0:00', label: 'GIS' },
              { time: '10:00', label: 'Remote Sensing' },
              { time: '18:00', label: 'Applications' }
            ]
          }
        ]
      },
      {
        id: 'coasts',
        title: 'Coastal Environments',
        lessons: [
          {
            id: 'coastal-processes',
            title: 'Coastal Processes',
            duration: '30 min',
            videoId: '8X8K4j8Z',
            videoQuality: 'must-watch',
            notes: `# Coastal Processes

## Wave Types
- Constructive: Low energy, build up beach
- Destructive: High energy, erode beach

## Erosion Processes
- Hydraulic action
- Abrasion
- Attrition
- Solution

## Transportation
- Longshore drift
- Beach drift
- Suspended load
- Bed load

## Deposition
- Beaches
- Spits
- Bars
- Tombolos`,
            keyPoints: ['Wave types', 'Erosion', 'Longshore drift', 'Deposition features'],
            timestamps: [
              { time: '0:00', label: 'Waves' },
              { time: '10:00', label: 'Erosion' },
              { time: '20:00', label: 'Deposition' }
            ]
          },
          {
            id: 'coastal-features',
            title: 'Coastal Landforms',
            duration: '28 min',
            videoId: '9Y9K4j9A',
            videoQuality: 'must-watch',
            notes: `# Coastal Landforms

## Erosional Features
- Cliffs: Steep rock faces
- Wave-cut platforms: Flat rock at base
- Caves, arches, stacks, stumps

## Depositional Features
- Beaches: Sand/gravel accumulation
- Spits: Long narrow ridges
- Bars: Connect two headlands
- Tombolos: Connect island to mainland

## SA Coast Examples
- Wild Coast: Erosion
- KZN: Beaches
- West Coast: Upwelling`,
            keyPoints: ['Erosional features', 'Depositional features', 'SA examples', 'Management'],
            timestamps: [
              { time: '0:00', label: 'Erosional' },
              { time: '10:00', label: 'Depositional' },
              { time: '20:00', label: 'SA Coast' }
            ]
          }
        ]
      },
      {
        id: 'rural-urban',
        title: 'Rural & Urban Settlements',
        lessons: [
          {
            id: 'settlement-geography',
            title: 'Settlement Patterns',
            duration: '28 min',
            videoId: '0Z0L4j9B',
            videoQuality: 'must-watch',
            notes: `# Settlement Patterns

## Rural Settlements
- Dispersed: Scattered farms
- Nucleated: Villages around central point
- Linear: Along roads/rivers

## Urban Patterns
- Concentric: Rings from CBD
- Sector: Wedges from center
- Multiple nuclei: Several centers

## Factors Influencing
- Physical: Water, relief, climate
- Economic: Resources, transport
- Social: Culture, security

## SA Urbanization
- Rapid growth
- Informal settlements
- Rural-urban migration`,
            keyPoints: ['Rural patterns', 'Urban patterns', 'Factors', 'SA urbanization'],
            timestamps: [
              { time: '0:00', label: 'Rural' },
              { time: '10:00', label: 'Urban' },
              { time: '20:00', label: 'SA Context' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mathematics-grade-10',
    title: 'Mathematics Grade 10',
    subject: 'mathematics',
    grade: 10,
    description: 'Build a strong foundation in Algebra, Geometry, and Functions.',
    difficulty: 'Beginner',
    instructor: 'Ms. Lisa Johnson',
    estimatedHours: 35,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    modules: [
      {
        id: 'algebra-grade10',
        title: 'Algebra Fundamentals',
        lessons: [
          {
            id: 'exponents-grade10',
            title: 'Exponents and Surds',
            duration: '25 min',
            videoId: 'BCn4j9D',
            videoQuality: 'must-watch',
            notes: `# Exponents and Surds

## Laws of Exponents

### Product Rule
$$x^m \\cdot x^n = x^{m+n}$$

### Quotient Rule
$$\\frac{x^m}{x^n} = x^{m-n}$$

### Power Rule
$$(x^m)^n = x^{mn}$$

### Zero Exponent
$$x^0 = 1 \\quad (x \\neq 0)$$

### Negative Exponents
$$x^{-n} = \\frac{1}{x^n}$$

## Rational Exponents
$$x^{m/n} = \\sqrt[n]{x^m}$$

## Surds
Simplifying square roots:
$$\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2}$$

## Rationalizing Denominators
Multiply numerator and denominator by conjugate:
$$\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$$`,
            keyPoints: ['Laws of exponents', 'Negative exponents', 'Simplifying surds', 'Rationalizing denominators'],
            timestamps: [
              { time: '0:00', label: 'Exponent Laws' },
              { time: '8:00', label: 'Negative Exponents' },
              { time: '15:00', label: 'Surds' }
            ]
          },
          {
            id: 'equations-grade10',
            title: 'Linear Equations',
            duration: '22 min',
            videoId: 'YvK4x9D',
            videoQuality: 'must-watch',
            notes: `# Linear Equations

## Solving Linear Equations

### Steps:
1. Remove brackets
2. Collect like terms
3. Isolate the variable

### Example:
$$3(x + 2) = 2x + 12$$
$$3x + 6 = 2x + 12$$
$$3x - 2x = 12 - 6$$
$$x = 6$$

## Word Problems
1. Define variable
2. Set up equation
3. Solve
4. Check answer`,
            keyPoints: ['Solving equations', 'Variables on both sides', 'Word problems'],
            timestamps: [
              { time: '0:00', label: 'Basic Equations' },
              { time: '8:00', label: 'Variables Both Sides' },
              { time: '15:00', label: 'Word Problems' }
            ]
          }
        ]
      },
      {
        id: 'geometry-grade10',
        title: 'Geometry & Trigonometry',
        lessons: [
          {
            id: 'triangles-grade10',
            title: 'Triangle Geometry',
            duration: '28 min',
            videoId: 'ZvL4x9E',
            videoQuality: 'must-watch',
            notes: `# Triangle Geometry

## Triangle Theorems

### Angle Sum
Sum of interior angles = 180°

### Exterior Angle
Exterior angle = sum of two opposite interior angles

## Congruent Triangles (SSS, SAS, ASA, AAS, RHS)

## Similar Triangles
- Corresponding angles equal
- Corresponding sides in proportion

## Area of Triangles
$$A = \\frac{1}{2}bh$$`,
            keyPoints: ['Angle sum theorem', 'Congruent triangles', 'Similar triangles', 'Area'],
            timestamps: [
              { time: '0:00', label: 'Basic Theorems' },
              { time: '10:00', label: 'Congruence' },
              { time: '18:00', label: 'Similarity' }
            ]
          },
          {
            id: 'trig-basics',
            title: 'Introduction to Trigonometry',
            duration: '30 min',
            videoId: 'A1M4x9F',
            videoQuality: 'must-watch',
            notes: `# Introduction to Trigonometry

## Trigonometric Ratios

### Right-Angled Triangles
$$\\sin\\theta = \\frac{opposite}{hypotenuse}$$
$$\\cos\\theta = \\frac{adjacent}{hypotenuse}$$
$$\\tan\\theta = \\frac{opposite}{adjacent}$$

## Special Angles
| Angle | sin | cos | tan |
|-------|-----|-----|-----|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | √2/2 | √2/2 | 1 |
| 60° | √3/2 | 1/2 | √3 |
| 90° | 1 | 0 | undefined |

## Calculator Skills
Make sure calculator is in DEG mode!`,
            keyPoints: ['SOH CAH TOA', 'Special angles', 'Calculator skills'],
            timestamps: [
              { time: '0:00', label: 'Ratios' },
              { time: '10:00', label: 'Special Angles' },
              { time: '20:00', label: 'Applications' }
            ]
          }
        ]
      },
      {
        id: 'functions-grade10',
        title: 'Functions & Graphs',
        lessons: [
          {
            id: 'linear-functions',
            title: 'Linear Functions',
            duration: '25 min',
            videoId: 'B2N4x9G',
            videoQuality: 'must-watch',
            notes: `# Linear Functions

## Equation Forms

### Standard Form
$$y = mx + c$$
- m = gradient/slope
- c = y-intercept

### Gradient Formula
$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

## Drawing Linear Graphs
1. Find y-intercept (set x = 0)
2. Find x-intercept (set y = 0)
3. Draw line through points

## Parallel Lines
Same gradient: m₁ = m₂

## Perpendicular Lines
$$m_1 \\cdot m_2 = -1$$`,
            keyPoints: ['y = mx + c', 'Gradient', 'Intercepts', 'Parallel/Perpendicular'],
            timestamps: [
              { time: '0:00', label: 'Equation' },
              { time: '8:00', label: 'Gradient' },
              { time: '16:00', label: 'Lines' }
            ]
          },
          {
            id: 'quadratic-functions',
            title: 'Quadratic Functions',
            duration: '28 min',
            videoId: 'C3O4x9H',
            videoQuality: 'must-watch',
            notes: `# Quadratic Functions

## Standard Form
$$y = ax^2 + bx + c$$

## Parabola Shape
- a > 0: opens upward (minimum)
- a < 0: opens downward (maximum)

## Turning Point
$$x = -\\frac{b}{2a}$$

## Intercepts
- y-intercept: (0, c)
- x-intercepts: solve ax² + bx + c = 0`,
            keyPoints: ['Parabola shape', 'Turning point', 'Intercepts'],
            timestamps: [
              { time: '0:00', label: 'Shape' },
              { time: '10:00', label: 'Turning Point' },
              { time: '18:00', label: 'Intercepts' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mathematics-grade-11',
    title: 'Mathematics Grade 11',
    subject: 'mathematics',
    grade: 11,
    description: 'Advanced Algebra, Trigonometry, and Probability.',
    difficulty: 'Intermediate',
    instructor: 'Mr. Robert Williams',
    estimatedHours: 38,
    thumbnail: 'https://images.unsplash.com/photo-1633621412960-96dbdd9a8eca?w=800',
    modules: [
      {
        id: 'trig-grade11',
        title: 'Trigonometry',
        lessons: [
          {
            id: 'trig-identities',
            title: 'Trigonometric Identities',
            duration: '30 min',
            videoId: 'D4P4x9I',
            videoQuality: 'must-watch',
            notes: `# Trigonometric Identities

## Pythagorean Identities
$$\\sin^2\\theta + \\cos^2\\theta = 1$$
$$1 + \\tan^2\\theta = \\sec^2\\theta$$
$$1 + \\cot^2\\theta = \\csc^2\\theta$$

## Co-function Identities
$$\\sin(90° - \\theta) = \\cos\\theta$$
$$\\cos(90° - \\theta) = \\sin\\theta$$

## Double Angle Formulas
$$\\sin2\\theta = 2\\sin\\theta\\cos\\theta$$
$$\\cos2\\theta = \\cos^2\\theta - \\sin^2\\theta$$

## Solving Trig Equations
1. Isolate trig function
2. Find reference angle
3. Determine all solutions in given interval`,
            keyPoints: ['Pythagorean identities', 'Double angle', 'Solving equations'],
            timestamps: [
              { time: '0:00', label: 'Pythagorean' },
              { time: '10:00', label: 'Double Angle' },
              { time: '20:00', label: 'Equations' }
            ]
          },
          {
            id: 'trig-graphs',
            title: 'Trigonometric Graphs',
            duration: '28 min',
            videoId: 'U6_5KhtfT7s',
            videoQuality: 'must-watch',
            notes: `# Trigonometric Graphs

## Sine Graph: y = sin x
- Amplitude: |a|
- Period: 360°/b
- Phase shift: -c/b

## Cosine Graph: y = cos x
Same transformations as sine

## Tangent Graph: y = tan x
- Period: 180°
- Asymptotes at odd multiples of 90°

## Transformations
$$y = a\\sin(b(x - c)) + d$$`,
            keyPoints: ['Amplitude', 'Period', 'Phase shift', 'Transformations'],
            timestamps: [
              { time: '0:00', label: 'Sine Graph' },
              { time: '10:00', label: 'Cosine Graph' },
              { time: '18:00', label: 'Tangent Graph' }
            ]
          }
        ]
      },
      {
        id: 'finance-grade11',
        title: 'Financial Mathematics',
        lessons: [
          {
            id: 'finance-applications',
            title: 'Financial Applications',
            duration: '32 min',
            videoId: 'finance-grade11',
            videoQuality: 'must-watch',
            notes: `# Financial Mathematics

## Simple Interest
$$A = P(1 + rt)$$

## Compound Interest
$$A = P(1 + r/n)^{nt}$$

## Future Value
$$FV = PV(1 + i)^n$$

## Present Value
$$PV = \\frac{FV}{(1 + i)^n}$$

## Annuities
Regular payments/receipts

## Effective vs Nominal Rate
$$r_{eff} = (1 + r/n)^n - 1$$`,
            keyPoints: ['Simple interest', 'Compound interest', 'Annuities', 'Effective rate'],
            timestamps: [
              { time: '0:00', label: 'Simple Interest' },
              { time: '10:00', label: 'Compound Interest' },
              { time: '20:00', label: 'Annuities' }
            ]
          }
        ]
      },
      {
        id: 'probability-grade11',
        title: 'Probability & Counting',
        lessons: [
          {
            id: 'probability-advanced',
            title: 'Advanced Probability',
            duration: '30 min',
            videoId: 'E5Q4x9J',
            videoQuality: 'must-watch',
            notes: `# Advanced Probability

## Dependent vs Independent Events
- Independent: P(A and B) = P(A) × P(B)
- Dependent: P(A and B) = P(A) × P(B|A)

## Conditional Probability
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$$

## Bayes' Theorem
$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

## Probability Trees
Useful for dependent events`,
            keyPoints: ['Dependent events', 'Conditional probability', 'Bayes theorem'],
            timestamps: [
              { time: '0:00', label: 'Independent Events' },
              { time: '10:00', label: 'Conditional' },
              { time: '20:00', label: 'Bayes Theorem' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'history-grade-12',
    title: 'History Grade 12',
    subject: 'history',
    grade: 12,
    description: 'South African and World History.',
    difficulty: 'Intermediate',
    instructor: 'Mrs. Sarah Malan',
    estimatedHours: 32,
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=800',
    modules: [
      {
        id: 'colonialism',
        title: ' colonialism & Resistance',
        lessons: [
          {
            id: 'colonial-conquest',
            title: 'Colonial Conquest in SA',
            duration: '35 min',
            videoId: 'colonial-conquest',
            videoQuality: 'must-watch',
            notes: `# Colonial Conquest in South Africa

## Background
- 1652: Dutch East India Company establishes refreshment station
- 1795: British take over during Napoleonic Wars
- 1806: British annexation confirmed

## Key Conflicts
1. Anglo-Zulu War (1879)
2. First Boer War (1880-81)
3. Second Boer War (1899-1902)

## Impact
- Land dispossession
- Creation of reserves
- Introduction of pass laws`,
            keyPoints: ['Dutch settlement', 'British takeover', 'Boer wars', 'Land dispossession'],
            timestamps: [
              { time: '0:00', label: 'Dutch Period' },
              { time: '12:00', label: 'British Colonisation' },
              { time: '22:00', label: 'Conflicts' }
            ]
          },
          {
            id: 'resistance-movements',
            title: 'Resistance Movements',
            duration: '30 min',
            videoId: 'resistance',
            videoQuality: 'must-watch',
            notes: `# Resistance Movements

## Early Resistance
- 1856-57: Cattle Killing Movement
- 1879: Anglo-Zulu War

## Pre-Apartheid Resistance
- 1906-08: Bambatha Rebellion
- 1912: ANC founded
- 1940s: Youth League formed

## Anti-Apartheid
- 1952: Defiance Campaign
- 1955: Congress of the People
- 1976: Soweto Uprising
- 1990s: Negotiations to democracy`,
            keyPoints: ['Early resistance', 'ANC formation', 'Defiance Campaign', 'Soweto Uprising'],
            timestamps: [
              { time: '0:00', label: 'Early Resistance' },
              { time: '10:00', label: 'ANC' },
              { time: '18:00', label: 'Anti-Apartheid' }
            ]
          }
        ]
      },
      {
        id: 'cold-war',
        title: 'Cold War & Superpowers',
        lessons: [
          {
            id: 'cold-war-origin',
            title: 'Origins of the Cold War',
            duration: '28 min',
            videoId: 'cold-war-origin',
            videoQuality: 'must-watch',
            notes: `# Origins of the Cold War

## Context
Post-WWII power vacuum

## Ideological Differences
- USA: Capitalism, democracy
- USSR: Communism, socialism

## Key Events
- 1945: Yalta & Potsdam Conferences
- 1947: Truman Doctrine
- 1948: Marshall Plan
- 1949: NATO formed

## Cold War in Africa
- Decolonisation
- Proxy wars
- Cuban Missile Crisis indirect involvement`,
            keyPoints: ['US vs USSR', 'Truman Doctrine', 'NATO', 'Africa in Cold War'],
            timestamps: [
              { time: '0:00', label: 'Origins' },
              { time: '10:00', label: 'Key Events' },
              { time: '18:00', label: 'Africa' }
            ]
          }
        ]
      },
      {
        id: 'civil-rights',
        title: 'Civil Rights Movement',
        lessons: [
          {
            id: 'usa-civil-rights',
            title: 'USA Civil Rights',
            duration: '32 min',
            videoId: 'civil-rights',
            videoQuality: 'must-watch',
            notes: `# USA Civil Rights Movement

## Background
- Jim Crow laws
- Segregation
- Plessy v. Ferguson (1896)

## Key Events
- 1955: Montgomery Bus Boycott
- 1957: Little Rock Nine
- 1960: Sit-ins
- 1963: March on Washington
- 1964: Civil Rights Act
- 1965: Voting Rights Act

## Key Figures
- Martin Luther King Jr.
- Rosa Parks
- Malcolm X
- John Lewis`,
            keyPoints: ['Segregation', 'Montgomery', 'March on Washington', 'Key legislation'],
            timestamps: [
              { time: '0:00', label: 'Background' },
              { time: '10:00', label: 'Key Events' },
              { time: '22:00', label: 'Legislation' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'computer-science-grade-10',
    title: 'Computer Science Grade 10',
    subject: 'computer-science',
    grade: 10,
    description: 'Introduction to Programming and Digital Concepts.',
    difficulty: 'Beginner',
    instructor: 'Mr. Thabo Molefe',
    estimatedHours: 30,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    modules: [
      {
        id: 'python-intro',
        title: 'Introduction to Python',
        lessons: [
          {
            id: 'python-basics',
            title: 'Python Basics',
            duration: '30 min',
            videoId: 'python-basics',
            videoQuality: 'must-watch',
            notes: `# Python Basics

## Why Python?
- Easy to learn
- Versatile
- Popular in industry

## Variables
\`\`\`python
name = "John"
age = 15
height = 1.65
\`\`\`

## Data Types
- Strings: "Hello"
- Integers: 42
- Floats: 3.14
- Booleans: True, False

## Input/Output
\`\`\`python
name = input("Enter your name: ")
print(f"Hello, {name}!")
\`\`\``,
            keyPoints: ['Variables', 'Data types', 'Input/Output', 'Print statements'],
            timestamps: [
              { time: '0:00', label: 'Why Python' },
              { time: '5:00', label: 'Variables' },
              { time: '15:00', label: 'Data Types' },
              { time: '22:00', label: 'Input/Output' }
            ]
          },
          {
            id: 'python-control',
            title: 'Control Structures',
            duration: '35 min',
            videoId: 'python-control',
            videoQuality: 'must-watch',
            notes: `# Control Structures

## If Statements
\`\`\`python
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")
\`\`\`

## While Loops
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## For Loops
\`\`\`python
for i in range(5):
    print(i)
\`\`\`

## Logical Operators
- and, or, not`,
            keyPoints: ['If statements', 'While loops', 'For loops', 'Logical operators'],
            timestamps: [
              { time: '0:00', label: 'If Statements' },
              { time: '10:00', label: 'While Loops' },
              { time: '18:00', label: 'For Loops' }
            ]
          }
        ]
      },
      {
        id: 'python-functions',
        title: 'Functions & Lists',
        lessons: [
          {
            id: 'functions-python',
            title: 'Functions',
            duration: '30 min',
            videoId: 'functions-python',
            videoQuality: 'must-watch',
            notes: `# Functions

## Defining Functions
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b
\`\`\`

## Parameters
- Positional parameters
- Default parameters
- *args, **kwargs

## Scope
- Local variables
- Global variables`,
            keyPoints: ['Defining functions', 'Parameters', 'Return values', 'Scope'],
            timestamps: [
              { time: '0:00', label: 'Defining' },
              { time: '10:00', label: 'Parameters' },
              { time: '20:00', label: 'Scope' }
            ]
          },
          {
            id: 'lists-python',
            title: 'Lists',
            duration: '28 min',
            videoId: 'lists-python',
            videoQuality: 'must-watch',
            notes: `# Lists

## Creating Lists
\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
\`\`\`

## List Operations
- Access: fruits[0]
- Modify: fruits[1] = "orange"
- Append: fruits.append("mango")
- Remove: fruits.remove("apple")
- Length: len(fruits)

## Slicing
\`\`\`python
numbers[1:4]  # elements 1,2,3
numbers[:3]   # first 3
numbers[2:]   # from index 2
\`\`\``,
            keyPoints: ['Creating lists', 'Accessing elements', 'Modifying lists', 'Slicing'],
            timestamps: [
              { time: '0:00', label: 'Creating' },
              { time: '8:00', label: 'Operations' },
              { time: '18:00', label: 'Slicing' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'business-studies-grade-12',
    title: 'Business Studies Grade 12',
    subject: 'business-studies',
    grade: 12,
    description: 'Business Principles, Management, and Entrepreneurship.',
    difficulty: 'Advanced',
    instructor: 'Mrs. Jenny Meyer',
    estimatedHours: 35,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    modules: [
      {
        id: 'business-env',
        title: 'Business Environment',
        lessons: [
          {
            id: 'business-env-analysis',
            title: 'Business Environment Analysis',
            duration: '30 min',
            videoId: 'business-env',
            videoQuality: 'must-watch',
            notes: `# Business Environment Analysis

## Components
1. Micro Environment
   - Suppliers
   - Customers
   - Competitors
   - Marketing intermediaries

2. Macro Environment
   - PESTEL: Political, Economic, Social, Technological, Environmental, Legal
   - SWOT Analysis

## Stakeholders
- Internal: Employees, owners, managers
- External: Suppliers, customers, community`,
            keyPoints: ['PESTEL', 'SWOT', 'Stakeholders', 'Micro/Macro environment'],
            timestamps: [
              { time: '0:00', label: 'Micro Environment' },
              { time: '10:00', label: 'Macro Environment' },
              { time: '20:00', label: 'Stakeholders' }
            ]
          }
        ]
      },
      {
        id: 'marketing',
        title: 'Marketing Management',
        lessons: [
          {
            id: 'marketing-mix',
            title: 'Marketing Mix (7Ps)',
            duration: '35 min',
            videoId: 'marketing-mix',
            videoQuality: 'must-watch',
            notes: `# Marketing Mix (7 Ps)

## Product
- Features
- Branding
- Packaging
- Quality

## Price
- Pricing strategies
- Discounts

## Place
- Distribution channels
- Location

## Promotion
- Advertising
- Personal selling
- Sales promotion
- PR

## People
- Staff training
- Customer service

## Process
- Service delivery
- Systems

## Physical Evidence
- Store appearance
- Signage`,
            keyPoints: ['7 Ps', 'Product strategy', 'Pricing', 'Promotion strategies'],
            timestamps: [
              { time: '0:00', label: 'Product & Price' },
              { time: '12:00', label: 'Place & Promotion' },
              { time: '25:00', label: 'People, Process, Physical' }
            ]
          },
          {
            id: 'market-research',
            title: 'Market Research',
            duration: '28 min',
            videoId: 'market-research',
            videoQuality: 'must-watch',
            notes: `# Market Research

## Types
- Primary: Collecting new data
- Secondary: Using existing data

## Methods
- Surveys
- Interviews
- Focus groups
- Observations

## Process
1. Define problem
2. Set objectives
3. Collect data
4. Analyze data
5. Present findings`,
            keyPoints: ['Primary vs Secondary', 'Research methods', 'Data analysis'],
            timestamps: [
              { time: '0:00', label: 'Types' },
              { time: '10:00', label: 'Methods' },
              { time: '20:00', label: 'Process' }
            ]
          }
        ]
      },
      {
        id: 'entrepreneurship',
        title: 'Entrepreneurship',
        lessons: [
          {
            id: 'entrepreneur qualities',
            title: 'Qualities of an Entrepreneur',
            duration: '25 min',
            videoId: 'entrepreneur-qual',
            videoQuality: 'must-watch',
            notes: `# Qualities of an Entrepreneur

## Key Qualities
- Creativity & Innovation
- Risk taking
- Leadership
- Decision making
- Problem solving
- Financial literacy

## Types of Entrepreneurs
- Serial entrepreneur
- Social entrepreneur
- Intrapreneur

## Role in Economy
- Job creation
- Innovation
- Economic growth`,
            keyPoints: ['Key qualities', 'Types of entrepreneurs', 'Economic role'],
            timestamps: [
              { time: '0:00', label: 'Qualities' },
              { time: '10:00', label: 'Types' },
              { time: '18:00', label: 'Role' }
            ]
          },
          {
            id: 'business-plan',
            title: 'Business Plan',
            duration: '30 min',
            videoId: 'business-plan',
            videoQuality: 'must-watch',
            notes: `# Business Plan

## Components
1. Executive Summary
2. Business Description
3. Market Analysis
4. Organization & Management
5. Marketing Strategy
6. Financial Plan
7. Operations Plan

## Importance
- Guides operations
- Attracts investors
- Measures progress`,
            keyPoints: ['Plan components', 'Executive summary', 'Financial plan'],
            timestamps: [
              { time: '0:00', label: 'Components' },
              { time: '12:00', label: 'Executive Summary' },
              { time: '22:00', label: 'Financial Plan' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'accounting-grade-10',
    title: 'Accounting Grade 10',
    subject: 'accounting',
    grade: 10,
    description: 'Introduction to Accounting Principles and Concepts.',
    difficulty: 'Beginner',
    instructor: 'Mr. Kevin Petersen',
    estimatedHours: 28,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    modules: [
      {
        id: 'accounting-basics',
        title: 'Accounting Fundamentals',
        lessons: [
          {
            id: 'accounting-concepts',
            title: 'Accounting Concepts',
            duration: '25 min',
            videoId: 'acc-concepts',
            videoQuality: 'must-watch',
            notes: `# Accounting Concepts

## Basic Concepts
1. Business Entity
2. Going Concern
3. Cost Concept
4. Accrual Basis
5. Matching Principle
6. Materiality

## Users of Accounting
- Internal: Managers, owners
- External: Creditors, investors, SARS

## Accounting Equation
Assets = Liabilities + Equity
OR
Assets - Liabilities = Equity`,
            keyPoints: ['Accounting concepts', 'Users', 'Accounting equation'],
            timestamps: [
              { time: '0:00', label: 'Concepts' },
              { time: '10:00', label: 'Users' },
              { time: '18:00', label: 'Equation' }
            ]
          }
        ]
      },
      {
        id: 'ledger-grade10',
        title: 'The Ledger',
        lessons: [
          {
            id: 'double-entry',
            title: 'Double Entry',
            duration: '30 min',
            videoId: 'double-entry',
            videoQuality: 'must-watch',
            notes: `# Double Entry

## Principle
Every transaction affects at least two accounts

## Debit & Credit
- Debit (Dr): Left side
- Credit (Cr): Right side

## Rules
| Account | Debit | Credit |
|---------|-------|--------|
| Assets | + | - |
| Liabilities | - | + |
| Income | - | + |
| Expenses | + | - |
| Capital | - | + |`,
            keyPoints: ['Double entry', 'Debit/Credit rules', 'T-accounts'],
            timestamps: [
              { time: '0:00', label: 'Principle' },
              { time: '10:00', label: 'Dr/Cr Rules' },
              { time: '20:00', label: 'T-accounts' }
            ]
          },
          {
            id: 'trial-balance',
            title: 'Trial Balance',
            duration: '25 min',
            videoId: 'trial-balance',
            videoQuality: 'must-watch',
            notes: `# Trial Balance

## Purpose
Check arithmetic accuracy of ledger

## Format
| Account | Debit | Credit |
|---------|-------|--------|
| Capital | | 50000 |
| Cash | 20000 | |
| ... | | |

## Limitations
- Doesn't detect all errors
- Won't find missing transactions
- Won't find errors of principle`,
            keyPoints: ['Purpose', 'Format', 'Limitations'],
            timestamps: [
              { time: '0:00', label: 'Purpose' },
              { time: '8:00', label: 'Format' },
              { time: '18:00', label: 'Limitations' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'economics-grade-10',
    title: 'Economics Grade 10',
    subject: 'economics',
    grade: 10,
    description: 'Introduction to Economic Concepts.',
    difficulty: 'Beginner',
    instructor: 'Dr. Michael Santos',
    estimatedHours: 26,
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    modules: [
      {
        id: 'economics-intro',
        title: 'Introduction to Economics',
        lessons: [
          {
            id: 'basic-concepts',
            title: 'Basic Economic Concepts',
            duration: '28 min',
            videoId: 'econ-concepts',
            videoQuality: 'must-watch',
            notes: `# Basic Economic Concepts

## Economics Definition
Study of how people make choices about scarce resources

## Fundamental Problems
1. What to produce?
2. How to produce?
3. For whom to produce?

## Economic Systems
- Traditional
- Command (Planned)
- Market
- Mixed

## Needs vs Wants
- Needs: Essential for survival
- Wants: Desired but not essential

## Factors of Production
1. Land
2. Labour
3. Capital
4. Entrepreneurship`,
            keyPoints: ['Scarcity', 'Economic systems', 'Needs vs Wants', 'Factors of production'],
            timestamps: [
              { time: '0:00', label: 'Definition' },
              { time: '8:00', label: 'Problems' },
              { time: '18:00', label: 'Factors' }
            ]
          }
        ]
      },
      {
        id: 'demand-supply',
        title: 'Demand & Supply',
        lessons: [
          {
            id: 'demand-grade10',
            title: 'Demand',
            duration: '25 min',
            videoId: 'demand',
            videoQuality: 'must-watch',
            notes: `# Demand

## Definition
Quantity consumers willing and able to buy at various prices

## Law of Demand
Price ↑ = Quantity ↓
Price ↓ = Quantity ↑

## Determinants
1. Income
2. Price of related goods
3. Tastes & preferences
4. Expectations
5. Population

## Demand Schedule & Curve
Shows relationship between price and quantity demanded`,
            keyPoints: ['Law of demand', 'Determinants', 'Demand curve'],
            timestamps: [
              { time: '0:00', label: 'Law' },
              { time: '8:00', label: 'Determinants' },
              { time: '18:00', label: 'Curve' }
            ]
          },
          {
            id: 'supply-grade10',
            title: 'Supply',
            duration: '25 min',
            videoId: 'supply',
            videoQuality: 'must-watch',
            notes: `# Supply

## Definition
Quantity producers willing and able to sell at various prices

## Law of Supply
Price ↑ = Quantity ↑
Price ↓ = Quantity ↓

## Determinants
1. Cost of production
2. Technology
3. Number of sellers
4. Expectations
5. Government taxes/subsidies`,
            keyPoints: ['Law of supply', 'Determinants', 'Supply curve'],
            timestamps: [
              { time: '0:00', label: 'Law' },
              { time: '8:00', label: 'Determinants' },
              { time: '18:00', label: 'Curve' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'technology-grade-10',
    title: 'Technology Grade 10',
    subject: 'technology',
    grade: 10,
    description: 'Design and Technology fundamentals.',
    difficulty: 'Beginner',
    instructor: 'Mr. Peter Ngobeni',
    estimatedHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    modules: [
      {
        id: 'design-process',
        title: 'Design Process',
        lessons: [
          {
            id: 'design-thinking',
            title: 'Design Thinking',
            duration: '25 min',
            videoId: 'design-thinking',
            videoQuality: 'must-watch',
            notes: `# Design Thinking

## What is Design?
Creating solutions to problems

## Design Process Steps:
1. Identify the problem
2. Research
3. Brainstorm solutions
4. Develop prototype
5. Test and evaluate

## Design Brief
- What are you designing?
- For whom?
- What are the requirements?`,
            keyPoints: ['Design process', 'Problem identification', 'Prototyping', 'Evaluation'],
            timestamps: [
              { time: '0:00', label: 'What is Design' },
              { time: '8:00', label: 'Process Steps' },
              { time: '18:00', label: 'Design Brief' }
            ]
          }
        ]
      },
      {
        id: 'structures',
        title: 'Structures',
        lessons: [
          {
            id: 'types-structures',
            title: 'Types of Structures',
            duration: '28 min',
            videoId: 'types-structures',
            videoQuality: 'must-watch',
            notes: `# Types of Structures

## Natural Structures
- Shell structures
- Frame structures
- Mass structures

## Forces
- Compression: Squeezing
- Tension: Stretching
- Shear: Sliding apart
- Torsion: Twisting

## Strengthening
- Triangulation
- Bracing
- Buttressing`,
            keyPoints: ['Structure types', 'Forces', 'Strengthening methods'],
            timestamps: [
              { time: '0:00', label: 'Types' },
              { time: '10:00', label: 'Forces' },
              { time: '18:00', label: 'Strengthening' }
            ]
          }
        ]
      },
      {
        id: 'systems',
        title: 'Control Systems',
        lessons: [
          {
            id: 'control-systems',
            title: 'Introduction to Control',
            duration: '25 min',
            videoId: 'control-systems',
            videoQuality: 'must-watch',
            notes: `# Control Systems

## Types of Control
- Manual: Human operated
- Mechanical: Uses mechanisms
- Electronic: Uses circuits
- Computer: Program controlled

## Input-Process-Output
- Input: Signal received
- Process: Processing the signal
- Output: Action taken

## Sensors and Actuators
- Sensors: Detect changes
- Actuators: Create motion`,
            keyPoints: ['Control types', 'IPO model', 'Sensors and actuators'],
            timestamps: [
              { time: '0:00', label: 'Types' },
              { time: '10:00', label: 'IPO' },
              { time: '18:00', label: 'Components' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'computer-science-grade-11',
    title: 'Computer Science Grade 11',
    subject: 'computer-science',
    grade: 11,
    description: 'Advanced Python Programming and Databases.',
    difficulty: 'Intermediate',
    instructor: 'Mr. Thabo Molefe',
    estimatedHours: 35,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    modules: [
      {
        id: 'python-oop',
        title: 'Object-Oriented Programming',
        lessons: [
          {
            id: 'classes-objects',
            title: 'Classes and Objects',
            duration: '35 min',
            videoId: 'classes-objects',
            videoQuality: 'must-watch',
            notes: `# Classes and Objects

## Classes
\`\`\`python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
    def display(self):
        print(f"{self.name}: {self.grade}")

# Create object
student1 = Student("John", 12)
\`\`\`

## Methods
- __init__: Constructor
- self: Reference to object
- Instance methods

## Attributes
- Instance variables
- Class variables`,
            keyPoints: ['Class definition', 'Constructor', 'Objects', 'Methods'],
            timestamps: [
              { time: '0:00', label: 'Classes' },
              { time: '12:00', label: 'Objects' },
              { time: '25:00', label: 'Methods' }
            ]
          },
          {
            id: 'inheritance',
            title: 'Inheritance',
            duration: '30 min',
            videoId: 'inheritance',
            videoQuality: 'must-watch',
            notes: `# Inheritance

## What is Inheritance?
One class inherits from another

## Example
\`\`\`python
class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade
\`\`\`

## Benefits
- Code reuse
- Extensibility
- Organization`,
            keyPoints: ['Parent class', 'Child class', 'super()', 'Method overriding'],
            timestamps: [
              { time: '0:00', label: 'Concept' },
              { time: '10:00', label: 'Syntax' },
              { time: '20:00', label: 'Benefits' }
            ]
          }
        ]
      },
      {
        id: 'python-files',
        title: 'File Handling',
        lessons: [
          {
            id: 'reading-files',
            title: 'Reading and Writing Files',
            duration: '28 min',
            videoId: 'file-handling',
            videoQuality: 'must-watch',
            notes: `# File Handling

## Opening Files
\`\`\`python
# Read
file = open("data.txt", "r")
content = file.read()
file.close()

# Write
file = open("data.txt", "w")
file.write("Hello")
file.close()

# With statement (better)
with open("data.txt", "r") as file:
    content = file.read()
\`\`\`

## Modes
- r: Read
- w: Write (overwrites)
- a: Append
- rb: Read binary
- wb: Write binary`,
            keyPoints: ['Open/close files', 'Read/Write', 'File modes', 'With statement'],
            timestamps: [
              { time: '0:00', label: 'Opening Files' },
              { time: '10:00', label: 'Reading' },
              { time: '18:00', label: 'Writing' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-grade-10',
    title: 'English Grade 10',
    subject: 'english',
    grade: 10,
    description: 'Language, Literature, and Writing Skills.',
    difficulty: 'Beginner',
    instructor: 'Mrs. Amy Thompson',
    estimatedHours: 28,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    modules: [
      {
        id: 'language-skills',
        title: 'Language Skills',
        lessons: [
          {
            id: 'grammar-essentials',
            title: 'Grammar Essentials',
            duration: '30 min',
            videoId: 'grammar-essentials',
            videoQuality: 'must-watch',
            notes: `# Grammar Essentials

## Parts of Speech
- Nouns: People, places, things
- Verbs: Actions, states
- Adjectives: Describe nouns
- Adverbs: Describe verbs
- Pronouns: Replace nouns

## Tenses
- Present: I write
- Past: I wrote
- Future: I will write

## Subject-Verb Agreement
Singular subject → singular verb
Plural subject → plural verb`,
            keyPoints: ['Parts of speech', 'Tenses', 'Subject-verb agreement'],
            timestamps: [
              { time: '0:00', label: 'Parts of Speech' },
              { time: '10:00', label: 'Tenses' },
              { time: '20:00', label: 'Agreement' }
            ]
          },
          {
            id: 'essay-writing',
            title: 'Essay Writing',
            duration: '32 min',
            videoId: 'essay-writing',
            videoQuality: 'must-watch',
            notes: `# Essay Writing

## Essay Structure
1. Introduction
   - Hook
   - Background
   - Thesis statement
2. Body Paragraphs
   - Topic sentence
   - Evidence
   - Analysis
   - Transition
3. Conclusion
   - Restate thesis
   - Summarize points
   - Final thought

## Types
- Argumentative
- Expository
- Narrative
- Descriptive`,
            keyPoints: ['Essay structure', 'Introduction', 'Body paragraphs', 'Conclusion'],
            timestamps: [
              { time: '0:00', label: 'Structure' },
              { time: '10:00', label: 'Introduction' },
              { time: '20:00', label: 'Body & Conclusion' }
            ]
          }
        ]
      },
      {
        id: 'poetry-analysis',
        title: 'Poetry Analysis',
        lessons: [
          {
            id: 'poetry-elements',
            title: 'Elements of Poetry',
            duration: '28 min',
            videoId: 'poetry-elements',
            videoQuality: 'must-watch',
            notes: `# Elements of Poetry

## Key Elements
- Line and stanza
- Rhythm and meter
- Rhyme scheme
- Imagery
- Metaphor and simile
- Personification

## How to Analyze
1. Read poem multiple times
2. Identify literary devices
3. Consider context
4. Determine theme
5. Explain effect on reader

## Terms
- Verse: Single line
- Stanza: Group of verses
- Couplet: 2 lines
- Quatrain: 4 lines`,
            keyPoints: ['Literary devices', 'Poetry terms', 'Analysis approach'],
            timestamps: [
              { time: '0:00', label: 'Elements' },
              { time: '10:00', label: 'Devices' },
              { time: '20:00', label: 'How to Analyze' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'afrikaans-grade-10',
    title: 'Afrikaans Grade 10',
    subject: 'afrikaans',
    grade: 10,
    description: 'Taal, Begrips, en Skryfwerk.',
    difficulty: 'Beginner',
    instructor: 'Mev. Anna van der Merwe',
    estimatedHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    modules: [
      {
        id: 'afrikaans-taal',
        title: 'Taalkunde',
        lessons: [
          {
            id: 'woordsoorte',
            title: 'Woordsoorte',
            duration: '25 min',
            videoId: 'woordsoorte',
            videoQuality: 'must-watch',
            notes: `# Woordsoorte

## Selfstandige Naamwoorde
- Naam van mense, plekke, dinge
- Enkelvoud en meervoud

## Werkwoorde
- Aksie of toestand
- Tense: teenwoordig, verlede, toekoms

## Byvoeglike Naamwoorde
- Beskryf selfstandige naamwoorde
- Trappe van vergelyking

## Voorsetsels
- Verhouding tussen woorde`,
            keyPoints: ['Naamwoorde', 'Werkwoorde', 'Byvoeglike naamwoorde', 'Voorsetsels'],
            timestamps: [
              { time: '0:00', label: 'Naamwoorde' },
              { time: '8:00', label: 'Werkwoorde' },
              { time: '16:00', label: 'Ander' }
            ]
          }
        ]
      },
      {
        id: 'afrikaans-skryf',
        title: 'Skryfwerk',
        lessons: [
          {
            id: 'opstel-schrijven',
            title: 'Opstel Skryf',
            duration: '28 min',
            videoId: 'opstel-skryf',
            videoQuality: 'must-watch',
            notes: `# Opstel Skryf

## Tipes Opstelle
1. Beschrywende
2. Narratief
3. Argumenterend
4. Beskrywend

## Struktuur
1. Inleiding: Hook + Stelling
2. Hoofdeel: Argument + Bewys
3. Slot: Opsomming + Gevolgtrekking

## Wenke
- Beplan voor jy skryf
- Gebruik oorgangswoorde
- Korrekte spelling en grammatika`,
            keyPoints: ['Opstel tipes', 'Struktur', 'Skryf wenke'],
            timestamps: [
              { time: '0:00', label: 'Tipes' },
              { time: '10:00', label: 'Struktur' },
              { time: '20:00', label: 'Wenke' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'economics-grade-11',
    title: 'Economics Grade 11',
    subject: 'economics',
    grade: 11,
    description: 'Micro and Macro Economics.',
    difficulty: 'Intermediate',
    instructor: 'Dr. Michael Santos',
    estimatedHours: 30,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    modules: [
      {
        id: 'microeconomics',
        title: 'Microeconomics',
        lessons: [
          {
            id: 'elasticity',
            title: 'Price Elasticity of Demand',
            duration: '30 min',
            videoId: 'elasticity',
            videoQuality: 'must-watch',
            notes: `# Price Elasticity of Demand

## Formula
$$Ed = \\frac{\\% \\Delta Qd}{\\% \\Delta P}$$

## Types
- Elastic: Ed > 1 (responsive)
- Inelastic: Ed < 1 (unresponsive)
- Unitary: Ed = 1

## Factors Affecting
1. Availability of substitutes
2. Necessity vs luxury
3. Time period
4. Proportion of income

## Importance
- Pricing decisions
- Revenue calculations`,
            keyPoints: ['Elasticity formula', 'Types of elasticity', 'Factors', 'Applications'],
            timestamps: [
              { time: '0:00', label: 'Formula' },
              { time: '10:00', label: 'Types' },
              { time: '20:00', label: 'Factors' }
            ]
          },
          {
            id: 'cost-analysis',
            title: 'Cost Analysis',
            duration: '28 min',
            videoId: 'cost-analysis',
            videoQuality: 'must-watch',
            notes: `# Cost Analysis

## Types of Costs
- Fixed Costs: Don't change with output
- Variable Costs: Change with output
- Total Cost = FC + VC

## Short Run vs Long Run
- SR: At least one fixed input
- LR: All inputs variable

## Economies of Scale
- Internal: Within firm
- External: Outside firm

## Production Function
Relationship between inputs and outputs`,
            keyPoints: ['Fixed & variable costs', 'Total cost', 'Economies of scale', 'Production function'],
            timestamps: [
              { time: '0:00', label: 'Cost Types' },
              { time: '10:00', label: 'SR vs LR' },
              { time: '20:00', label: 'Scale' }
            ]
          }
        ]
      },
      {
        id: 'macroeconomics-grade11',
        title: 'Macroeconomics',
        lessons: [
          {
            id: 'gdp-growth',
            title: 'GDP and Economic Growth',
            duration: '32 min',
            videoId: 'gdp-growth',
            videoQuality: 'must-watch',
            notes: `# GDP and Economic Growth

## GDP Definition
Total value of all final goods/services produced in a country in a year

## Methods of Calculation
1. Expenditure: C + I + G + (X-M)
2. Income: Sum of all incomes
3. Production: Value added at each stage

## Economic Growth
- Increase in GDP over time
- Usually measured annually
- Important for improving living standards

## Limitations of GDP
- Doesn't measure distribution
- Ignores informal sector
- Doesn't value environment`,
            keyPoints: ['GDP calculation', 'Economic growth', 'Limitations'],
            timestamps: [
              { time: '0:00', label: 'GDP' },
              { time: '12:00', label: 'Growth' },
              { time: '22:00', label: 'Limitations' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'accounting-grade-11',
    title: 'Accounting Grade 11',
    subject: 'accounting',
    grade: 11,
    description: 'Financial Statements and Reconciliations.',
    difficulty: 'Intermediate',
    instructor: 'Mr. Kevin Petersen',
    estimatedHours: 32,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=800',
    modules: [
      {
        id: 'financial-statements',
        title: 'Financial Statements',
        lessons: [
          {
            id: 'income-statement',
            title: 'Income Statement',
            duration: '30 min',
            videoId: 'income-statement',
            videoQuality: 'must-watch',
            notes: `# Income Statement

## Purpose
Shows revenue, expenses, and profit/loss for a period

## Format
| Item | Amount |
|------|--------|
| Revenue | XXX |
| Cost of Sales | (XXX) |
| Gross Profit | XXX |
| Operating Expenses | (XXX) |
| Profit before Tax | XXX |
| Tax | (XXX) |
| Net Profit | XXX |

## Calculating Gross Profit
Revenue - Cost of Sales

## Net Profit
Gross Profit - All Expenses`,
            keyPoints: ['Revenue and expenses', 'Gross profit', 'Net profit', 'Format'],
            timestamps: [
              { time: '0:00', label: 'Purpose' },
              { time: '8:00', label: 'Format' },
              { time: '20:00', label: 'Calculations' }
            ]
          },
          {
            id: 'balance-sheet',
            title: 'Balance Sheet',
            duration: '28 min',
            videoId: 'balance-sheet',
            videoQuality: 'must-watch',
            notes: `# Balance Sheet

## Purpose
Shows financial position at a point in time

## Equation
Assets = Liabilities + Equity

## Assets
- Non-current: Long-term (property, equipment)
- Current: Short-term (cash, inventory, debtors)

## Liabilities
- Non-current: Long-term loans
- Current: Short-term (creditors, overdraft)

## Equity
- Owner's capital
- Retained earnings`,
            keyPoints: ['Assets', 'Liabilities', 'Equity', 'Accounting equation'],
            timestamps: [
              { time: '0:00', label: 'Purpose' },
              { time: '10:00', label: 'Assets' },
              { time: '20:00', label: 'Liabilities & Equity' }
            ]
          }
        ]
      },
      {
        id: 'bank-reconciliation',
        title: 'Bank Reconciliation',
        lessons: [
          {
            id: 'bank-recon',
            title: 'Bank Reconciliation Statement',
            duration: '32 min',
            videoId: 'bank-recon',
            videoQuality: 'must-watch',
            notes: `# Bank Reconciliation

## Purpose
Reconcile cash book with bank statement

## Reasons for Differences
- Outstanding deposits
- Unpresented checks
- Bank charges
- Interest received
- Errors

## Process
1. Update cash book
2. Compare items
3. Prepare reconciliation statement

## Adjustments
- Add: Deposits in transit
- Less: Outstanding checks`,
            keyPoints: ['Purpose', 'Timing differences', 'Process', 'Statement'],
            timestamps: [
              { time: '0:00', label: 'Purpose' },
              { time: '10:00', label: 'Differences' },
              { time: '20:00', label: 'Process' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'history-grade-10',
    title: 'History Grade 10',
    subject: 'history',
    grade: 10,
    description: 'South African and World History.',
    difficulty: 'Beginner',
    instructor: 'Mrs. Sarah Malan',
    estimatedHours: 26,
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=800',
    modules: [
      {
        id: 'colonialism-grade10',
        title: 'Colonisation of South Africa',
        lessons: [
          {
            id: 'dutch-settlement',
            title: 'Dutch Settlement',
            duration: '28 min',
            videoId: 'dutch-settlement',
            videoQuality: 'must-watch',
            notes: `# Dutch Settlement

## 1652: Jan van Riebeeck
- Dutch East India Company
- Refreshment station
- Established Cape Town

## VOC Rule
- 1652-1795
- Land settlement
- Slave trade introduction

## Voortrekkers
- 1830s Great Trek
- Away from British rule
- Established republics

## Impact
- Displacement of indigenous people
- Introduction of Christianity
- New cultural interactions`,
            keyPoints: ['Van Riebeeck', 'VOC', 'Voortrekkers', 'Impact'],
            timestamps: [
              { time: '0:00', label: '1652' },
              { time: '10:00', label: 'VOC Rule' },
              { time: '18:00', label: 'Voortrekkers' }
            ]
          }
        ]
      },
      {
        id: 'world-war1',
        title: 'World War I',
        lessons: [
          {
            id: 'ww1-causes',
            title: 'Causes of WWI',
            duration: '30 min',
            videoId: 'ww1-causes',
            videoQuality: 'must-watch',
            notes: `# Causes of World War I

## Main Causes (M.A.I.N)
1. Militarism: Arms race
2. Alliances: Treaty system
3. Imperialism: Competition for colonies
4. Nationalism: Pride in nation

## Immediate Cause
Assassination of Archduke Franz Ferdinand (1914)

## Trench Warfare
- Western Front
- New weapons: machine guns, poison gas
- High casualties

## Treaty of Versailles (1919)
- Germany held responsible
- Territory lost
- Reparations`,
            keyPoints: ['MAIN causes', 'Assassination', 'Trench warfare', 'Treaty'],
            timestamps: [
              { time: '0:00', label: 'Causes' },
              { time: '12:00', label: 'War' },
              { time: '22:00', label: 'Treaty' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'business-studies-grade-11',
    title: 'Business Studies Grade 11',
    subject: 'business-studies',
    grade: 11,
    description: 'Human Resources and Operations Management.',
    difficulty: 'Intermediate',
    instructor: 'Mrs. Jenny Meyer',
    estimatedHours: 30,
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    modules: [
      {
        id: 'human-resources',
        title: 'Human Resources Management',
        lessons: [
          {
            id: 'hr-functions',
            title: 'HR Functions',
            duration: '30 min',
            videoId: 'hr-functions',
            videoQuality: 'must-watch',
            notes: `# Human Resources Functions

## Key Functions
1. Recruitment
   - Job analysis
   - Job description
   - Selection

2. Training & Development
   - Skills development
   - Orientation

3. Performance Appraisal
   - Assessing work
   - Feedback

4. Compensation
   - Salaries
   - Benefits

## Labour Relations
- Trade unions
- Collective bargaining
- Disputes`,
            keyPoints: ['Recruitment', 'Training', 'Performance appraisal', 'Compensation'],
            timestamps: [
              { time: '0:00', label: 'Functions' },
              { time: '12:00', label: 'Training' },
              { time: '22:00', label: 'Labour' }
            ]
          }
        ]
      },
      {
        id: 'operations',
        title: 'Operations Management',
        lessons: [
          {
            id: 'production',
            title: 'Production Planning',
            duration: '28 min',
            videoId: 'production-planning',
            videoQuality: 'must-watch',
            notes: `# Production Planning

## Production Process
1. Input: Raw materials, labour, capital
2. Conversion: Manufacturing
3. Output: Finished goods

## Types of Production
- Job: Custom products
- Batch: Groups of products
- Mass: Assembly line

## Quality Control
- Standards
- Inspection
- Total Quality Management

## Stock Control
- EOQ: Economic Order Quantity
- Just-in-Time`,
            keyPoints: ['Production process', 'Production types', 'Quality control', 'Stock'],
            timestamps: [
              { time: '0:00', label: 'Process' },
              { time: '10:00', label: 'Types' },
              { time: '20:00', label: 'Quality' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-grade-12',
    title: 'English Grade 12',
    subject: 'english',
    grade: 12,
    description: 'Advanced Literature, Language and Creative Writing.',
    difficulty: 'Advanced',
    instructor: 'Mrs. Amy Thompson',
    estimatedHours: 35,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    modules: [
      {
        id: 'poetry-grade12',
        title: 'Poetry Analysis',
        lessons: [
          {
            id: 'poetry-unseen',
            title: 'Unseen Poetry',
            duration: '35 min',
            videoId: 'unseen-poetry',
            videoQuality: 'must-watch',
            notes: `# Unseen Poetry Analysis

## Approach to Unseen Poems
1. Read poem multiple times
2. Identify tone and mood
3. Note literary devices
4. Consider context
5. Form interpretation

## Common Devices
- Imagery: Visual, auditory, kinesthetic
- Metaphor/Simile: Direct comparison
- Personification: Human qualities to objects
- Alliteration: Repeated consonant sounds
- Assonance: Repeated vowel sounds

## Exam Tips
- Don't panic - first reading is for understanding
- Focus on effect, not just identification
- Quote relevant lines to support points`,
            keyPoints: ['Reading strategies', 'Literary devices', 'Tone and mood', 'Analytical approach'],
            timestamps: [
              { time: '0:00', label: 'Approach' },
              { time: '10:00', label: 'Devices' },
              { time: '25:00', label: 'Exam Tips' }
            ]
          },
          {
            id: 'poetry-set',
            title: 'Set Poems',
            duration: '40 min',
            videoId: 'set-poems',
            videoQuality: 'must-watch',
            notes: `# Set Poems Analysis

## Memorization Strategy
- Understand, don't just memorize
- Connect themes to devices
- Practice essay writing

## Common Themes in Set Poems
- Love and loss
- Social justice
- Nature vs humanity
- Identity and belonging
- Time and mortality

## Essay Structure
1. Introduction: Poet, title, theme
2. Body: Quotes + analysis
3. Conclusion: Link to broader context`,
            keyPoints: ['Themes', 'Memorization', 'Essay technique', 'Quotes'],
            timestamps: [
              { time: '0:00', label: 'Themes' },
              { time: '15:00', label: 'Memorization' },
              { time: '30:00', label: 'Essay' }
            ]
          }
        ]
      },
      {
        id: 'novel-grade12',
        title: 'Novel Study',
        lessons: [
          {
            id: 'novel-analysis',
            title: 'Novel Analysis Techniques',
            duration: '38 min',
            videoId: 'novel-analysis',
            videoQuality: 'must-watch',
            notes: `# Novel Analysis

## Key Elements to Analyse
1. Plot: Structure, conflict, climax
2. Characters: Protagonist, antagonist, round/flat
3. Setting: Time, place, atmosphere
4. Theme: Central ideas
5. Narrative technique: POV, style
6. Social context

## Character Analysis
- External characterization
- Internal characterization
- Character development
- Relationships

## Essay Questions
- Always relate to theme
- Use quotes strategically
- Show understanding of author's purpose`,
            keyPoints: ['Plot structure', 'Character analysis', 'Themes', 'Context'],
            timestamps: [
              { time: '0:00', label: 'Elements' },
              { time: '15:00', label: 'Characters' },
              { time: '28:00', label: 'Essays' }
            ]
          }
        ]
      },
      {
        id: 'drama-grade12',
        title: 'Drama Study',
        lessons: [
          {
            id: 'drama-analysis',
            title: 'Drama Analysis',
            duration: '35 min',
            videoId: 'drama-analysis',
            videoQuality: 'must-watch',
            notes: `# Drama Analysis

## Features of Drama
- Dialogue
- Stage directions
- Acts and scenes
- Character actions
- Monologues/soliloquies

## Visual Elements
- Costume
- Set design
- Lighting
- Props

## Key Questions
- How does the playwright create meaning?
- What is the social commentary?
- How do characters represent ideas?

## Performance
- Consider how text translates to stage
- Think about actor choices`,
            keyPoints: ['Drama features', 'Visual elements', 'Stagecraft', 'Analysis'],
            timestamps: [
              { time: '0:00', label: 'Features' },
              { time: '12:00', label: 'Visual' },
              { time: '25:00', label: 'Questions' }
            ]
          }
        ]
      },
      {
        id: 'language-grade12',
        title: 'Language in Context',
        lessons: [
          {
            id: 'advertising',
            title: 'Advertising Techniques',
            duration: '28 min',
            videoId: 'advertising-tech',
            videoQuality: 'must-watch',
            notes: `# Advertising Techniques

## Persuasive Techniques
1. Bandwagon: Everyone is doing it
2. Testimonials: Celebrity endorsement
3. Repetition: Reinforce message
4. Emotional appeal: Fear, joy, nostalgia
5. Statistics: Credibility
6. Comparison: Before/after

## Visual Techniques
- Colour psychology
- Layout and design
- Camera angles
- Typography

## Analysing Ads
- Target audience
- Purpose (sell/convince/inform)
- Techniques used
- Effectiveness`,
            keyPoints: ['Persuasive techniques', 'Visual analysis', 'Target audience', 'Critical thinking'],
            timestamps: [
              { time: '0:00', label: 'Techniques' },
              { time: '12:00', label: 'Visual' },
              { time: '22:00', label: 'Analysis' }
            ]
          },
          {
            id: 'cartoon-analysis',
            title: 'Cartoon Analysis',
            duration: '25 min',
            videoId: 'cartoon-analysis',
            videoQuality: 'must-watch',
            notes: `# Cartoon Analysis

## Elements of Cartoons
- Visual metaphors
- Exaggeration
- Stereotypes
- Symbols
- Irony

## How to Analyse
1. Identify subject matter
2. Note visual techniques
3. Identify symbolism
4. Consider context
5. Determine message/angle

## Common Symbols
- Politicians: Animals
- Countries: Flags/landmarks
- Concepts: Abstract figures`,
            keyPoints: ['Visual metaphors', 'Symbols', 'Context', 'Message'],
            timestamps: [
              { time: '0:00', label: 'Elements' },
              { time: '10:00', label: 'Analysis' },
              { time: '20:00', label: 'Symbols' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'afrikaans-grade-12',
    title: 'Afrikaans Grade 12',
    subject: 'afrikaans',
    grade: 12,
    description: 'Taal, Literatuur en Skryfwerk.',
    difficulty: 'Advanced',
    instructor: 'Mev. Anna van der Merwe',
    estimatedHours: 32,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    modules: [
      {
        id: 'afrikaans-poesie',
        title: 'Poesie',
        lessons: [
          {
            id: 'poesie-analise',
            title: 'Poesie Analise',
            duration: '35 min',
            videoId: 'poesie-analise',
            videoQuality: 'must-watch',
            notes: `# Poesie Analise

## Stap vir Stap
1. Lees die gedig verskeie kere
2. Identifiseer die spreker
3. Bepaal die tema
4. Identifiseer tegnieke
5. Verduidelik effek

## Tegnieke
- Metafoor: Direkte vergelyking
- Simboliek: Simbole
- Personifikasie: Menslike eienskappe
- Alliterasie: Herhaling konsonante
- Assonansie: Herhaling vokale

## Tema's
- Liefde en verlies
- Identiteit
- Sosiale kommentaar`,
            keyPoints: ['Stappe', 'Tegnieke', 'Tema', 'Effek'],
            timestamps: [
              { time: '0:00', label: 'Stappe' },
              { time: '12:00', label: 'Tegnieke' },
              { time: '25:00', label: 'Tema' }
            ]
          }
        ]
      },
      {
        id: 'afrikaans-taal12',
        title: 'Taalkunde',
        lessons: [
          {
            id: 'taalstrukturen',
            title: 'Taalstrukture',
            duration: '30 min',
            videoId: 'taal-strukture',
            videoQuality: 'must-watch',
            notes: `# Taalstrukture

## Woordsoorte
- Selfstandige naamwoord
- Werkwoord
- Byvoeglike naamwoord
- Bywoord
- Voorsetsel
- Voegwoord

## Sinstrukture
- Enkelvoudige sin
- Saamgestelde sin
- Paradoks
- Hipotese

## FunkSIONELE TAAL
- Informerend
- Persuasief
- Literêr`,
            keyPoints: ['Woordsoorte', 'Sinstrukture', 'Funksioneel'],
            timestamps: [
              { time: '0:00', label: 'Woordsoorte' },
              { time: '12:00', label: 'Sinne' },
              { time: '22:00', label: 'Funksioneel' }
            ]
          }
        ]
      },
      {
        id: 'afrikaans-opstel',
        title: 'Opstel Skryf',
        lessons: [
          {
            id: 'opstel-tipes',
            title: 'Opstel Tipes',
            duration: '32 min',
            videoId: 'opstel-tipes',
            videoQuality: 'must-watch',
            notes: `# Opstel Skryf

## Tipes Opstelle
1. Beskrywende: Skilder 'n prent
2. Narratief: Vertel 'n storie
3. Argumenterend: Oorreed leser
4. Refleterend: Persoonlike gedagtes

## Struktuur
1. Inleiding: Hook + Stelling
2. Hoofdeel: Punte + Bewys
3. Slot: Opsomming + Gevolgtrekking

## Wenke
- Beplan eerste
- Kies relevante voorbeelde
- Gebruik oorgangswoorde
- Korrekte taalgebruik`,
            keyPoints: ['Tipes', 'Struktuur', 'Beplanning', 'Taalgebruik'],
            timestamps: [
              { time: '0:00', label: 'Tipes' },
              { time: '10:00', label: 'Struktuur' },
              { time: '22:00', label: 'Wenke' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'history-grade-12',
    title: 'History Grade 12',
    subject: 'history',
    grade: 12,
    description: 'South African and World History.',
    difficulty: 'Advanced',
    instructor: 'Mrs. Sarah Malan',
    estimatedHours: 38,
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=800',
    modules: [
      {
        id: 'nationalism',
        title: 'Nationalism & Independence',
        lessons: [
          {
            id: 'african-nationalism',
            title: 'African Nationalism',
            duration: '40 min',
            videoId: 'african-nationalism',
            videoQuality: 'must-watch',
            notes: `# African Nationalism

## Background
- Discontent with colonial rule
- Urbanisation and education
- Black consciousness

## Key Movements
1. ANC (1912)
   - Early years
   - Defiance campaigns
   - Congress of the People (1955)

## Key Figures
- Nelson Mandela
- Oliver Tambo
- Albert Luthuli
- Steve Biko

## Impact
- Rise of black consciousness
- International pressure
- Negotiations`,
            keyPoints: ['ANC formation', 'Defiance campaigns', 'Black consciousness', 'Key figures'],
            timestamps: [
              { time: '0:00', label: 'Background' },
              { time: '15:00', label: 'ANC' },
              { time: '28:00', label: 'Impact' }
            ]
          }
        ]
      },
      {
        id: 'cold-war-africa',
        title: 'Cold War in Africa',
        lessons: [
          {
            id: 'cold-war-context',
            title: 'Cold War & Southern Africa',
            duration: '38 min',
            videoId: 'cold-war-africa',
            videoQuality: 'must-watch',
            notes: `# Cold War & Southern Africa

## Context
- Superpower rivalry
- Decolonisation
- Strategic interests

## Case Studies
1. Angola
   - Civil war
   - Cuban intervention
   - US involvement

2. Mozambique
   - FRELIMO vs RENAMO
   - Soviet support
   - Apartheid destabilisation

## Impact on SA
- Border war
- ANC support from USSR
- International relations`,
            keyPoints: ['Superpowers', 'Angola', 'Mozambique', 'Border war'],
            timestamps: [
              { time: '0:00', label: 'Context' },
              { time: '15:00', label: 'Case Studies' },
              { time: '30:00', label: 'Impact' }
            ]
          }
        ]
      },
      {
        id: 'civil-rights',
        title: 'Civil Rights Movement',
        lessons: [
          {
            id: 'usa-rights',
            title: 'USA Civil Rights',
            duration: '35 min',
            videoId: 'usa-civil-rights',
            videoQuality: 'must-watch',
            notes: `# USA Civil Rights

## Background
- Jim Crow laws
- Segregation
- Plessy v Ferguson (1896)

## Key Events
- 1955: Montgomery Bus Boycott
- 1957: Little Rock Nine
- 1960: Student sit-ins
- 1963: March on Washington
- 1964: Civil Rights Act
- 1965: Voting Rights Act

## Key Figures
- Martin Luther King Jr
- Rosa Parks
- Malcolm X
- John Lewis

## Legacy
- Legal equality
- Ongoing challenges`,
            keyPoints: ['Segregation', 'Key events', 'Key figures', 'Legacy'],
            timestamps: [
              { time: '0:00', label: 'Background' },
              { time: '12:00', label: 'Events' },
              { time: '28:00', label: 'Legacy' }
            ]
          }
        ]
      },
      {
        id: 'democracy-sa',
        title: 'Democracy in SA',
        lessons: [
          {
            id: 'transition',
            title: 'Transition to Democracy',
            duration: '42 min',
            videoId: 'transition-democracy',
            videoQuality: 'must-watch',
            notes: `# Transition to Democracy

## Background
- 1990: Mandela released
- Negotiations process
- CODESA I & II

## 1994 Elections
- First democratic election
- Voting experience
- Results

## Key Challenges
- Truth & Reconciliation
- Nation building
- Economic inequality
- Service delivery

## Consolidation
- Constitution (1996)
- Good governance
- Challenges remain`,
            keyPoints: ['1990 release', 'Negotiations', '1994 elections', 'Challenges'],
            timestamps: [
              { time: '0:00', label: 'Background' },
              { time: '15:00', label: '1994' },
              { time: '30:00', label: 'Challenges' }
            ]
          }
        ]
      }
    ]
  }
];
