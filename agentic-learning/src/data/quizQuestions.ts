export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

export interface LessonQuiz {
  lessonId: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface QuizNote {
  topic: string;
  title: string;
  content: string;
  keyPoints: string[];
}

const generateId = (topic: string, num: number) => `${topic}-${num}`;

export const quizNotes: QuizNote[] = [
  {
    topic: 'derivatives',
    title: 'Complete Derivatives Guide',
    keyPoints: [
      'Power Rule: d/dx(xⁿ) = nxⁿ⁻¹',
      'Product Rule: d/dx[fg] = f\'g + fg\'',
      'Quotient Rule: d/dx[f/g] = (f\'g - fg\')/g²',
      'Chain Rule: d/dx[f(g(x))] = f\'(g(x)) × g\'(x)',
      'Derivatives of trig: sin\'=cos, cos\'=-sin, tan\'=sec²',
      'Derivative of eˣ = eˣ',
      'Derivative of ln(x) = 1/x',
      'Stationary points: f\'(x) = 0',
      'Local max: f\' changes + to -, Local min: - to +',
      'Second derivative: f\'\' > 0 concave up, f\'\' < 0 concave down'
    ],
    content: `# Complete Derivatives Guide

## 1. Basic Derivatives

### Power Rule
The most fundamental rule: **d/dx(xⁿ) = nxⁿ⁻¹**

Examples:
- d/dx(x³) = 3x²
- d/dx(x⁵) = 5x⁴
- d/dx(x) = 1
- d/dx(5) = 0 (derivative of constant)

### Exponential Functions
- **d/dx(eˣ) = eˣ**
- **d/dx(aˣ) = aˣln(a)**
- d/dx(eᵏˣ) = keᵏˣ

### Logarithmic Functions
- **d/dx(ln(x)) = 1/x**
- d/dx(logₐ(x)) = 1/(x ln(a))

## 2. Trigonometric Derivatives

| Function | Derivative |
|----------|------------|
| sin(x) | cos(x) |
| cos(x) | -sin(x) |
| tan(x) | sec²(x) |
| cot(x) | -csc²(x) |
| sec(x) | sec(x)tan(x) |
| csc(x) | -csc(x)cot(x) |

### Chain Rule with Trig
- d/dx(sin(u)) = cos(u) × u'
- d/dx(cos(u)) = -sin(u) × u'
- d/dx(tan(u)) = sec²(u) × u'

## 3. Product Rule
When multiplying two functions: **d/dx[fg] = f'g + fg'**

Example: d/dx[x²sin(x)] = 2x·sin(x) + x²·cos(x)

## 4. Quotient Rule
When dividing functions: **d/dx[f/g] = (f'g - fg')/g²**

Example: d/dx[sin(x)/x] = (x·cos(x) - sin(x))/x²

## 5. Chain Rule
For composite functions: **d/dx[f(g(x))] = f'(g(x)) × g'(x)**

Example: d/dx(sin(x³)) = cos(x³) × 3x²

## 6. Applications

### Finding Turning Points
1. Find f'(x)
2. Solve f'(x) = 0
3. Use first or second derivative test

### Tangent Line
At point (a, f(a)): **y - f(a) = f'(a)(x - a)**

### Motion
- Position: s(t)
- Velocity: v(t) = s'(t)
- Acceleration: a(t) = v'(t) = s''(t)

## 7. Important Theorems

### Mean Value Theorem
If f is continuous on [a,b] and differentiable on (a,b), then there exists c where:
**f'(c) = (f(b) - f(a))/(b - a)**

### Roll's Theorem
Special case of MVT where f(a) = f(b)

## 8. Higher Order Derivatives
- Second derivative: f''(x)
- Used to determine concavity
- Inflection point: f''(x) = 0 and changes sign

## Exam Tips
1. Always check which rule to apply
2. Simplify your answer
3. Remember: derivative of constant = 0
4. Practice daily!`
  },
  {
    topic: 'integration',
    title: 'Complete Integration Guide',
    keyPoints: [
      'Power Rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n≠-1)',
      '∫eˣ dx = eˣ + C',
      '∫1/x dx = ln|x| + C',
      '∫sin(x) dx = -cos(x) + C',
      '∫cos(x) dx = sin(x) + C',
      '∫sec²(x) dx = tan(x) + C',
      'Integration by parts: ∫u dv = uv - ∫v du',
      'Fundamental Theorem: ∫ₐᵇf(x)dx = F(b) - F(a)',
      'Area under curve: ∫f(x)dx',
      'LIATE: L=Log, I=Inverse trig, A=Algebraic, T=Trig, E=Exponential'
    ],
    content: `# Complete Integration Guide

## 1. Basic Integrals

### Power Rule
**∫xⁿ dx = xⁿ⁺¹/(n+1) + C** (when n ≠ -1)

Examples:
- ∫x² dx = x³/3 + C
- ∫x³ dx = x⁴/4 + C
- ∫dx = x + C

### Exponential
- **∫eˣ dx = eˣ + C**
- ∫aˣ dx = aˣ/ln(a) + C
- ∫eᵏˣ dx = eᵏˣ/k + C

### Logarithmic
- **∫1/x dx = ln|x| + C**
- ∫ln(x) dx = xln(x) - x + C

## 2. Trigonometric Integrals

| Function | Integral |
|----------|----------|
| sin(x) | -cos(x) + C |
| cos(x) | sin(x) + C |
| tan(x) | -ln\|cos(x)\| + C |
| sec²(x) | tan(x) + C |
| csc²(x) | -cot(x) + C |
| sec(x)tan(x) | sec(x) + C |

## 3. Integration Techniques

### Substitution (Reverse Chain Rule)
1. Identify inner function u
2. Find du = u'dx
3. Replace and integrate
4. Substitute back

Example: ∫2x·cos(x²)dx
- Let u = x², du = 2x dx
- ∫cos(u)du = sin(u) + C = sin(x²) + C

### Integration by Parts
**∫u dv = uv - ∫v du**

LIATE Rule (choose u in order):
- L: Logarithmic (ln(x))
- I: Inverse trig (arcsin, arctan)
- A: Algebraic (x², x³)
- T: Trig (sin, cos)
- E: Exponential (eˣ, aˣ)

Example: ∫x·eˣdx
- u = x, dv = eˣdx
- du = dx, v = eˣ
- = x·eˣ - ∫eˣdx = eˣ(x-1) + C

## 4. Definite Integrals

### Fundamental Theorem
**∫ₐᵇf(x)dx = F(b) - F(a)**

Example: ∫₀² x² dx = [x³/3]₀² = 8/3

### Area Between Curves
Area = ∫ₐᵇ[f(x) - g(x)]dx where f(x) ≥ g(x)

## 5. Applications

### Area Under Curve
- Above x-axis: positive area
- Below x-axis: negative area

### Average Value
f_avg = (1/(b-a)) ∫ₐᵇf(x)dx

### Kinematics
- Velocity: v(t) = ∫a(t)dt
- Position: s(t) = ∫v(t)dt

### Area in Polar Coordinates
A = (1/2) ∫(r(θ))² dθ

## 6. Common Integrals Table

| Integral | Result |
|----------|--------|
| ∫1/(1+x²) | arctan(x) + C |
| ∫1/√(1-x²) | arcsin(x) + C |
| ∫sec(x)dx | ln\|sec(x)+tan(x)\| + C |
| ∫csc(x)dx | -ln\|csc(x)+cot(x)\| + C |

## 7. Tips for Success
1. Memorize basic integrals
2. Practice substitution daily
3. For by parts, use LIATE
4. Always include + C
5. Check by differentiating your answer`
  }
];

export const quizData: Record<string, Question[]> = {
  derivatives: Array.from({ length: 100 }, (_, i) => {
    const q = i + 1;
    const questions = [
      { q: 'What is the derivative of x³?', a: '3x²', o: ['x²', '3x²', '3x', 'x³'] },
      { q: 'Using the power rule, what is d/dx(x⁵)?', a: '5x⁴', o: ['5x⁴', '5x⁵', 'x⁶', 'x⁴'] },
      { q: 'The derivative of eˣ is:', a: 'eˣ', o: ['eˣ', 'xeˣ⁻¹', 'eˣ⁺¹', '1/eˣ'] },
      { q: 'd/dx(cos(x)) = ?', a: '-sin(x)', o: ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'] },
      { q: 'The derivative of sin(x) is:', a: 'cos(x)', o: ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'] },
      { q: 'd/dx(tan(x)) = ?', a: 'sec²(x)', o: ['cot(x)', 'sec²(x)', 'csc²(x)', '-sec²(x)'] },
      { q: 'The product rule states: d/dx[fg] = ?', a: "f'g + fg'", o: ["f'g + fg'", "f'g - fg'", "fg'", 'f + g'] },
      { q: 'd/dx[ln(x)] = ?', a: '1/x', o: ['1/x', 'x', 'ln(x)', 'eˣ'] },
      { q: 'A stationary point occurs where:', a: "f'(x) = 0", o: ["f'(x) = 0", "f'(x) > 0", "f'(x) < 0", "f''(x) = 0"] },
      { q: "If f'(x) > 0, the function is:", a: 'Increasing', o: ['Decreasing', 'Constant', 'Increasing', 'Undefined'] },
      { q: 'The second derivative test determines:', a: 'Concavity', o: ['Roots', 'Concavity', 'Domain', 'Range'] },
      { q: 'd/dx(sec(x)) = ?', a: 'sec(x)tan(x)', o: ['sec(x)tan(x)', '-sec(x)tan(x)', 'sec²(x)', '-sec²(x)'] },
      { q: 'd/dx(cot(x)) = ?', a: '-csc²(x)', o: ['csc²(x)', '-csc²(x)', 'sec(x)tan(x)', '-sec(x)tan(x)'] },
      { q: 'The quotient rule is d/dx[f/g] = ?', a: "(f'g - fg')/g²", o: ["(f'g - fg')/g²", "(f'g + fg')/g²", "(f' - g')/g", "fg'/g²"] },
      { q: 'd/dx(sin(2x)) = ?', a: '2cos(2x)', o: ['cos(2x)', '2cos(2x)', '-sin(2x)', '-2sin(2x)'] },
      { q: "A local minimum occurs when f' changes from:", a: '- to +', o: ['+ to -', '- to +', '+ to 0', '- to 0'] },
      { q: 'd/dx(e²ˣ) = ?', a: '2e²ˣ', o: ['e²ˣ', '2e²ˣ', '2xe²ˣ', 'e²ˣ⁺¹'] },
      { q: 'The gradient of y = x³ at x = 2 is:', a: '12', o: ['6', '8', '12', '4'] },
      { q: 'd/dx(x⁴ + x³) = ?', a: '4x³ + 3x²', o: ['4x³ + 3x²', '4x⁴ + 3x³', 'x⁵ + x⁴', '4x³ + 3x'] },
      { q: 'If y = √x, then dy/dx = ?', a: '1/(2√x)', o: ['1/√x', '2√x', '1/(2√x)', '√x/2'] },
      { q: 'd/dx[sin⁻¹(x)] = ?', a: '1/√(1-x²)', o: ['1/√(1-x²)', '-1/√(1-x²)', '√(1-x²)', '1/(1-x²)'] },
      { q: 'd/dx[cos⁻¹(x)] = ?', a: '-1/√(1-x²)', o: ['1/√(1-x²)', '-1/√(1-x²)', '√(1-x²)', '-1/(1-x²)'] },
      { q: 'The derivative of a constant is:', a: '0', o: ['1', '0', 'Constant', 'Undefined'] },
      { q: 'd/dx(x⁻¹) = ?', a: '-x⁻²', o: ['-x⁻²', 'x⁻²', '-x', 'x'] },
      { q: 'd/dx(tan⁻¹(x)) = ?', a: '1/(1+x²)', o: ['1/(1+x²)', '-1/(1+x²)', '1+x²', '-1-x²'] },
      { q: 'An inflection point is where:', a: "f'' = 0 and changes sign", o: ["f' = 0", "f'' = 0 and changes sign", 'f = 0', "f'' > 0"] },
      { q: 'd/dx[ln(sin(x))] = ?', a: 'cot(x)', o: ['cot(x)', 'tan(x)', 'sec(x)', 'csc(x)'] },
      { q: "What does f'(x) represent?", a: 'Rate of change', o: ['Area under curve', 'Rate of change', 'Sum', 'Product'] },
      { q: "If f(x) = x² + 2x, then f'(3) = ?", a: '8', o: ['6', '8', '11', '5'] },
      { q: 'The chain rule is used for:', a: 'Composite functions', o: ['Products', 'Quotients', 'Composite functions', 'Sums'] },
      { q: 'What is a derivative?', a: 'Rate of change', o: ['Area under curve', 'Rate of change', 'Sum of areas', 'Volume'] },
      { q: "d/dx(x³ + 2x²) = ?", a: '3x² + 4x', o: ['3x² + 4x', '3x³ + 4x²', 'x⁴ + x³', '3x² + 2x'] },
      { q: "If f'(x) < 0, the function is:", a: 'Decreasing', o: ['Increasing', 'Decreasing', 'Constant', 'Undefined'] },
      { q: "A local maximum occurs when f' changes from:", a: '+ to -', o: ['+ to -', '- to +', '+ to 0', '- to 0'] },
      { q: 'd/dx[cos(eˣ)] = ?', a: '-eˣsin(eˣ)', o: ['eˣsin(eˣ)', '-eˣsin(eˣ)', 'sin(eˣ)', '-sin(eˣ)'] },
      { q: "d/dx(x²sin(x)) = ?", a: '2xsin(x) + x²cos(x)', o: ['2xsin(x) + x²cos(x)', '2xcos(x) + x²sin(x)', 'x²sin(x)', '2xsin(x)'] },
      { q: 'd/dx[ln(x²)] = ?', a: '2/x', o: ['1/x²', '2/x', '2x', 'ln(x²)'] },
      { q: 'd/dx(sin⁻¹(2x)) = ?', a: '2/√(1-4x²)', o: ['1/√(1-4x²)', '2/√(1-4x²)', '√(1-4x²)', '1/(1-4x²)'] },
      { q: 'The derivative of log₁₀(x) is:', a: '1/(xln(10))', o: ['1/x', '1/(xln(10))', 'ln(x)', 'x'] },
      { q: 'd/dx(aˣ) = ?', a: 'aˣln(a)', o: ['aˣ', 'aˣln(a)', 'xaˣ⁻¹', 'aˣ/ln(a)'] },
      { q: "If y = xⁿ, then dy/dx = ?", a: 'nxⁿ⁻¹', o: ['xⁿ', 'nxⁿ⁻¹', '(n+1)xⁿ', 'nxⁿ'] },
      { q: 'd/dx(1/x) = ?', a: '-1/x²', o: ['1/x²', '-1/x²', '1/x', '-x⁻²'] },
      { q: "d/dx[sin(x)cos(x)] = ?", a: 'cos²(x) - sin²(x)', o: ['sin²(x)', 'cos²(x) - sin²(x)', '2cos²(x)', '-sin²(x)'] },
      { q: 'The critical points are where:', a: "f'(x) = 0 or undefined", o: ["f'(x) = 0", "f''(x) = 0", "f'(x) = 0 or undefined", 'f(x) = 0'] },
      { q: "d/dx(tan(x) + cot(x)) = ?", a: 'sec²(x) - csc²(x)', o: ['sec²(x) + csc²(x)', 'sec²(x) - csc²(x)', 'tan(x) + cot(x)', '1'] },
      { q: 'd/dx(x⁵/5) = ?', a: 'x⁴', o: ['x⁴', 'x⁵', '5x⁴', 'x⁵/4'] },
      { q: 'A function is differentiable at x if:', a: 'Limit exists', o: ['Limit exists', 'Continuous only', 'Has derivative', 'Both A & C'] },
      { q: 'd/dx[eˣln(x)] = ?', a: 'eˣ(ln(x) + 1/x)', o: ['eˣln(x)', 'eˣ(ln(x) + 1/x)', 'eˣ/x', 'eˣ + 1/x'] },
      { q: "The where function changes direction is:", a: 'Turning point', o: ['Inflection point', 'Turning point', 'Stationary point', 'Critical point'] },
      { q: "d/dx(cos³(x)) = ?", a: '-3cos²(x)sin(x)', o: ['3cos²(x)sin(x)', '-3cos²(x)sin(x)', '-3cos(x)sin²(x)', '3sin²(x)'] },
      { q: "d/dx[(2x+1)³] = ?", a: '6(2x+1)²', o: ['3(2x+1)²', '6(2x+1)²', '(2x+1)²', '6x²+1'] },
      { q: "If f''(x) > 0, the graph is:", a: 'Concave up', o: ['Concave down', 'Concave up', 'Linear', 'Both'] },
      { q: "If f''(x) < 0, the graph is:", a: 'Concave down', o: ['Concave down', 'Concave up', 'Linear', 'Both'] },
      { q: "d/dx[sec⁻¹(x)] = ?", a: '1/(|x|√(x²-1))', o: ['1/√(x²-1)', '1/(|x|√(x²-1))', 'x/√(x²-1)', '-1/√(x²-1)'] },
      { q: 'Vertical tangent occurs when:', a: "f'(x) is undefined", o: ["f'(x) = 0", "f'(x) is undefined", "f''(x) = 0", 'f(x) = 0'] },
      { q: 'd/dx(x!)', a: 'Not defined', o: ['x!', 'Not defined', '(x+1)!', '1'] },
      { q: 'Mean Value Theorem states there exists c where:', a: "f'(c) = (f(b)-f(a))/(b-a)", o: ["f'(c) = 0", "f'(c) = (f(b)-f(a))/(b-a)", "f(c) = (f(b)+f(a))/2", 'f(c) = f(a)'] },
      { q: "d/dx[sin(x) + cos(x)] = ?", a: 'cos(x) - sin(x)', o: ['sin(x) + cos(x)', 'cos(x) - sin(x)', '-cos(x) - sin(x)', 'sin(x) - cos(x)'] },
      { q: 'd/dx[√(x+1)] = ?', a: '1/(2√(x+1))', o: ['2√(x+1)', '1/(2√(x+1))', '√(x+1)', '1/√(x+1)'] },
      { q: 'd/dx(1/x²) = ?', a: '-2/x³', o: ['-2/x³', '2/x³', '-1/x', '-2/x'] },
      { q: 'd/dx[e⁻ˣ] = ?', a: '-e⁻ˣ', o: ['e⁻ˣ', '-e⁻ˣ', '-xe⁻ˣ', 'eˣ'] },
      { q: 'The derivative of 5 is:', a: '0', o: ['5', '0', '1', 'Undefined'] },
      { q: "d/dx[x² + 3x + 5] = ?", a: '2x + 3', o: ['2x + 3', '2x + 8', 'x³/3 + 1.5x²', 'x² + 3'] },
      { q: "d/dx(sin(x)cos(x)) = ?", a: 'cos²(x) - sin²(x)', o: ['sin(x)cos(x)', 'cos²(x) - sin²(x)', '-sin(x)cos(x)', '2cos²(x)'] },
      { q: "d/dx(x³ - 3x) = ?", a: '3x² - 3', o: ['3x² - 3', 'x⁴/4 - 1.5x²', '3x² + 3', 'x³ - 3'] },
      { q: 'd/dx[ln(1/x)] = ?', a: '-1/x', o: ['1/x', '-1/x', 'ln(x)', '-ln(x)'] },
      { q: 'If f(x) = x³, then f\'(2) = ?', a: '12', o: ['6', '8', '12', '4'] },
      { q: 'd/dx(x²eˣ) = ?', a: 'eˣ(x² + 2x)', o: ['2xeˣ', 'eˣ(x² + 2x)', 'x²eˣ', '2eˣ'] },
      { q: 'The derivative of position is:', a: 'Velocity', o: ['Acceleration', 'Velocity', 'Momentum', 'Displacement'] },
      { q: 'The derivative of velocity is:', a: 'Acceleration', o: ['Acceleration', 'Velocity', 'Position', 'Momentum'] },
      { q: "d/dx[cos(x) - sin(x)] = ?", a: '-sin(x) - cos(x)', o: ['sin(x) + cos(x)', '-sin(x) - cos(x)', 'cos(x) + sin(x)', 'sin(x) - cos(x)'] },
      { q: 'd/dx(ln(sin(x) + 1)) = ?', a: 'cos(x)/(sin(x)+1)', o: ['sin(x)', 'cos(x)/(sin(x)+1)', 'tan(x)', 'sec(x)'] },
      { q: "d/dx[(x²+1)²] = ?", a: '4x(x²+1)', o: ['2(x²+1)', '4x(x²+1)', '(x²+1)²', '4x³+2x'] },
      { q: 'If y = x², the slope at x=3 is:', a: '6', o: ['6', '9', '3', '12'] },
      { q: 'd/dx[eˣ²] = ?', a: '2xeˣ²', o: ['eˣ²', '2xeˣ²', 'x²eˣ²', '2eˣ²'] },
      { q: 'd/dx[log₂(x)] = ?', a: '1/(xln(2))', o: ['1/x', '1/(xln(2))', 'ln(x)', 'ln(2)/x'] },
      { q: 'At a point of inflection, f\'\' equals:', a: '0', o: ['0', 'Positive', 'Negative', 'Undefined'] },
      { q: 'd/dx[tan(x) + 1] = ?', a: 'sec²(x)', o: ['tan(x)', 'sec²(x)', 'sec(x)tan(x)', '1'] },
      { q: 'The derivative of cos(x) at x=0 is:', a: '0', o: ['1', '0', '-1', 'Undefined'] },
      { q: 'd/dx[sinh(x)] = ?', a: 'cosh(x)', o: ['sinh(x)', 'cosh(x)', '-sinh(x)', 'cosh(x)+sinh(x)'] },
      { q: 'd/dx[cosh(x)] = ?', a: 'sinh(x)', o: ['cosh(x)', 'sinh(x)', '-sinh(x)', 'cosh(x)-sinh(x)'] },
      { q: 'd/dx[tanh(x)] = ?', a: 'sech²(x)', o: ['tanh(x)', 'sech²(x)', 'sech(x)tanh(x)', '1-tanh²(x)'] },
      { q: "d/dx[arctan(x) + x] = ?", a: '1/(1+x²) + 1', o: ['1/(1+x²)', '1/(1+x²) + 1', 'x/(1+x²)', 'arctan(x) + 1'] },
      { q: 'd/dx[ln(cos(x))] = ?', a: '-tan(x)', o: ['tan(x)', '-tan(x)', 'sec(x)', '-sec(x)'] },
      { q: 'd/dx(x/ln(x)) = ?', a: '(ln(x) - 1)/ln(x)²', o: ['1/ln(x)', '(ln(x) - 1)/ln(x)²', 'ln(x)', '1/x'] },
      { q: 'd/dx[log(x)] base 10 = ?', a: '1/(xln(10))', o: ['1/x', '1/(xln(10))', '10/x', 'xln(10)'] },
      { q: "If y = f(g(x)), dy/dx = ?", a: "f'(g(x))g'(x)", o: ["f'(g(x))", "f'(g(x))g'(x)", 'f(g(x))g(x)', 'f(x)g(x)'] },
      { q: "d/dx[x³eˣ] = ?", a: 'eˣ(x³ + 3x²)', o: ['3x²eˣ', 'eˣ(x³ + 3x²)', 'x³eˣ', 'eˣ(3x²)'] },
      { q: "d/dx[ln(x² + 1)] = ?", a: '2x/(x²+1)', o: ['2x', '2x/(x²+1)', '1/(x²+1)', 'x²+1'] },
      { q: 'The derivative of a sum equals:', a: 'Sum of derivatives', o: ['Sum of derivatives', 'Product of derivatives', 'Derivative of product', 'None'] },
      { q: "d/dx[sec(x)tan(x)] = ?", a: 'sec(x)tan²(x) + sec³(x)', o: ['sec(x)tan(x)', 'sec(x)tan²(x) + sec³(x)', 'tan(x) + sec(x)', 'sec²(x)'] },
      { q: "d/dx(csch(x)) = ?", a: '-csch(x)coth(x)', o: ['csch(x)coth(x)', '-csch(x)coth(x)', '-csch²(x)', 'coth(x)'] },
      { q: "d/dx[sech(x)] = ?", a: '-sech(x)tanh(x)', o: ['sech(x)tanh(x)', '-sech(x)tanh(x)', '-sech²(x)', 'tanh(x)'] },
      { q: "d/dx[arsinh(x)] = ?", a: '1/√(x²+1)', o: ['1/√(x²+1)', '1/√(x²-1)', '1/(x√(x²+1))', 'x/√(x²+1)'] },
      { q: "d/dx[acosh(x)] = ?", a: '1/(√(x-1)√(x+1))', o: ['1/(x²-1)', '1/(√(x-1)√(x+1))', '1/√(x²-1)', 'x/√(x²-1)'] },
      { q: "If y = x⁴ - 4x³ + 6x², dy/dx = ?", a: '4x³ - 12x² + 12x', o: ['4x³ - 12x² + 12x', 'x⁴ - 4x³ + 6x²', '4x² - 12x + 12', '4x³ - 12x²'] },
      { q: "d/dx[ln(√(x+1))] = ?", a: '1/(2(x+1))', o: ['1/(2√(x+1))', '1/(2(x+1))', '1/√(x+1)', '√(x+1)/2'] },
    ];
    const data = questions[q % questions.length];
    const correctIndex = data.o.indexOf(data.a);
    return {
      id: generateId('deriv', q),
      question: data.q,
      options: data.o,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      topic: 'derivatives'
    };
  }),

  integration: Array.from({ length: 100 }, (_, i) => {
    const q = i + 1;
    const questions = [
      { q: '∫x² dx = ?', a: 'x³/3 + C', o: ['x³ + C', 'x³/3 + C', '2x + C', 'x² + C'] },
      { q: 'Integration is the reverse of:', a: 'Differentiation', o: ['Addition', 'Multiplication', 'Differentiation', 'Division'] },
      { q: '∫eˣ dx = ?', a: 'eˣ + C', o: ['eˣ + C', 'xeˣ + C', 'eˣ⁻¹ + C', 'eˣ/eˣ + C'] },
      { q: 'What is the constant of integration?', a: 'C', o: ['k', 'C', 'π', 'x'] },
      { q: '∫1/x dx = ?', a: 'ln|x| + C', o: ['ln|x| + C', '1/x² + C', 'x + C', 'log|x| + C'] },
      { q: '∫sin(x) dx = ?', a: '-cos(x) + C', o: ['cos(x) + C', '-cos(x) + C', 'sin(x) + C', '-sin(x) + C'] },
      { q: '∫cos(x) dx = ?', a: 'sin(x) + C', o: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C'] },
      { q: '∫xⁿ dx (n ≠ -1) = ?', a: 'xⁿ⁺¹/(n+1) + C', o: ['xⁿ⁺¹/(n+1) + C', 'nxⁿ⁻¹ + C', 'xⁿ + C', 'xⁿ⁺¹ + C'] },
      { q: '∫sec²(x) dx = ?', a: 'tan(x) + C', o: ['tan(x) + C', '-tan(x) + C', 'sec(x) + C', '-sec(x) + C'] },
      { q: '∫csc²(x) dx = ?', a: '-cot(x) + C', o: ['cot(x) + C', '-cot(x) + C', 'csc(x) + C', '-csc(x) + C'] },
      { q: '∫e²ˣ dx = ?', a: 'e²ˣ/2 + C', o: ['e²ˣ/2 + C', '2e²ˣ + C', 'e²ˣ + C', 'e²ˣ⁺¹/2 + C'] },
      { q: 'The area under a curve is found by:', a: 'Integration', o: ['Differentiation', 'Integration', 'Derivative', 'Limit'] },
      { q: '∫(x + 1) dx = ?', a: 'x²/2 + x + C', o: ['x²/2 + x + C', 'x² + x + C', 'x²/2 + 1 + C', 'x + C'] },
      { q: '∫sec(x)tan(x) dx = ?', a: 'sec(x) + C', o: ['sec(x) + C', '-sec(x) + C', 'tan(x) + C', '-tan(x) + C'] },
      { q: '∫csc(x)cot(x) dx = ?', a: '-csc(x) + C', o: ['csc(x) + C', '-csc(x) + C', 'cot(x) + C', '-cot(x) + C'] },
      { q: 'Integration by parts formula:', a: '∫u dv = uv - ∫v du', o: ['∫u dv = uv - ∫v du', '∫u dv = u + v', '∫u dv = uv + ∫v du', '∫u dv = uv'] },
      { q: '∫ln(x) dx = ?', a: 'xln(x) - x + C', o: ['xln(x) - x + C', 'xln(x) + x + C', 'ln(x) + C', 'x/ln(x) + C'] },
      { q: '∫aˣ dx = ?', a: 'aˣ/ln(a) + C', o: ['aˣ/ln(a) + C', 'aˣln(a) + C', 'aˣ + C', 'xaˣ + C'] },
      { q: 'The definite integral from a to a equals:', a: '0', o: ['a', '1', '0', 'undefined'] },
      { q: '∫₀² x² dx = ?', a: '8/3', o: ['8/3', '4', '8', '2/3'] },
      { q: "If F'(x) = f(x), then ∫f(x)dx = ?", a: 'F(x) + C', o: ['F(x)', "F'(x)", 'F(x) + C', "F'(x) + C"] },
      { q: '∫(f(x) + g(x))dx = ?', a: '∫f + ∫g', o: ['∫f × ∫g', 'f + g', '∫f - ∫g', '∫f + ∫g'] },
      { q: '∫k f(x)dx = ?', a: 'k∫f(x)dx', o: ['k∫f(x)dx', '∫f(x)dx/k', 'k + ∫f', 'k∫f + C'] },
      { q: 'The average value of f on [a,b] is:', a: '1/(b-a)∫ₐᵇf', o: ['(b-a)∫ₐᵇf', '1/(b-a)∫ₐᵇf', '∫ₐᵇf/(b+a)', '∫ₐᵇf'] },
      { q: '∫tan(x) dx = ?', a: 'ln|sec(x)| + C', o: ['ln|sec(x)| + C', 'ln|cos(x)| + C', 'sec(x) + C', 'tan(x) + C'] },
      { q: '∫cot(x) dx = ?', a: 'ln|sin(x)| + C', o: ['ln|sin(x)| + C', 'ln|cos(x)| + C', 'sec(x) + C', 'tan(x) + C'] },
      { q: '∫x√x dx = ?', a: '2x^(5/2)/5 + C', o: ['2x^(5/2)/5 + C', 'x²/2 + C', 'x^(3/2) + C', 'x³ + C'] },
      { q: 'The Fundamental Theorem connects:', a: 'Derivatives and integrals', o: ['Derivatives and integrals', 'Limits and derivatives', 'Sequences and series', 'Algebra and geometry'] },
      { q: '∫₁² 1/x dx = ?', a: 'ln(2)', o: ['ln(2)', 'ln(1)', '1', '0'] },
      { q: '∫sin²(x) dx = ?', a: 'x/2 - sin(2x)/4 + C', o: ['x/2 - sin(2x)/4 + C', 'x + C', '-cos²(x) + C', 'sin(x) + C'] },
      { q: '∫cos²(x) dx = ?', a: 'x/2 + sin(2x)/4 + C', o: ['x/2 + sin(2x)/4 + C', 'x + C', 'cos²(x)', 'sin(x) + C'] },
      { q: '∫eˣ(eˣ + 1) dx = ?', a: 'e²ˣ/2 + eˣ + C', o: ['e²ˣ/2 + eˣ + C', 'eˣ + C', 'e²ˣ + C', 'eˣ² + x + C'] },
      { q: '∫(2x+1)³ dx = ?', a: '(2x+1)⁴/8 + C', o: ['(2x+1)⁴/8 + C', '(2x+1)⁴/4 + C', '(2x+1)³/3 + C', '(2x+1)⁴ + C'] },
      { q: '∫1/(x+1) dx = ?', a: 'ln|x+1| + C', o: ['1/(x+1) + C', 'ln|x+1| + C', 'ln(x+1) + C', 'x + C'] },
      { q: '∫x(x+1) dx = ?', a: 'x³/3 + x²/2 + C', o: ['x³/3 + x²/2 + C', 'x² + x + C', 'x³ + x² + C', 'x²/2 + C'] },
      { q: '∫sin(2x) dx = ?', a: '-cos(2x)/2 + C', o: ['cos(2x) + C', '-cos(2x)/2 + C', 'sin²(x) + C', '-sin(2x)/2 + C'] },
      { q: '∫cos(2x) dx = ?', a: 'sin(2x)/2 + C', o: ['sin(2x)/2 + C', 'sin(x) + C', '-sin(2x)/2 + C', 'cos²(x) + C'] },
      { q: '∫(1-x²)dx = ?', a: 'x - x³/3 + C', o: ['x - x³/3 + C', 'x - x³ + C', 'x³/3 - x + C', '-x³ + C'] },
      { q: '∫e⁻ˣ dx = ?', a: '-e⁻ˣ + C', o: ['e⁻ˣ + C', '-e⁻ˣ + C', '-eˣ + C', 'eˣ + C'] },
      { q: '∫x⁴ dx = ?', a: 'x⁵/5 + C', o: ['x⁵ + C', 'x⁵/5 + C', '4x⁵ + C', 'x⁴ + C'] },
      { q: '∫5 dx = ?', a: '5x + C', o: ['5 + C', '5x + C', 'x + C', '5x² + C'] },
      { q: '∫√x dx = ?', a: '2x^(3/2)/3 + C', o: ['2x^(3/2)/3 + C', '√x² + C', 'x√x + C', 'x^(3/2) + C'] },
      { q: '∫(x²+1)² dx = ?', a: 'x⁵/5 + 2x³/3 + x + C', o: ['x⁵/5 + 2x³/3 + x + C', 'x⁴ + x² + C', '(x²+1)³/3 + C', 'x⁴ + C'] },
      { q: '∫sin³(x) dx = ?', a: '-cos(x) + cos³(x)/3 + C', o: ['-cos(x) + cos³(x)/3 + C', '-cos³(x) + C', 'sin(x) - sin³(x) + C', 'cos(x) + C'] },
      { q: '∫xsin(x) dx = ?', a: 'sin(x) - xcos(x) + C', o: ['sin(x) - xcos(x) + C', 'xcos(x) + C', '-xsin(x) + C', 'sin(x)x + C'] },
      { q: '∫xeˣ dx = ?', a: 'eˣ(x-1) + C', o: ['eˣx + C', 'eˣ(x-1) + C', 'eˣ + C', 'xeˣ + C'] },
      { q: '∫x²eˣ dx = ?', a: 'eˣ(x²-2x+2) + C', o: ['eˣ(x²-2x+2) + C', 'eˣx² + C', 'eˣ(x²+2x) + C', 'x²eˣ + C'] },
      { q: '∫ln(x)/x dx = ?', a: 'ln²(x)/2 + C', o: ['ln²(x)/2 + C', '1/x² + C', 'ln(x) + C', '1/ln(x) + C'] },
      { q: '∫1/(1+x²) dx = ?', a: 'arctan(x) + C', o: ['arctan(x) + C', 'ln(1+x²) + C', 'x + C', '1/x + C'] },
      { q: '∫x/(1+x²) dx = ?', a: 'ln(1+x²)/2 + C', o: ['ln(1+x²)/2 + C', 'arctan(x) + C', '1/(1+x²) + C', 'x + C'] },
      { q: '∫eˣsin(x) dx = ?', a: 'eˣ(sin(x)-cos(x))/2 + C', o: ['eˣ(sin(x)-cos(x))/2 + C', 'eˣcos(x) + C', 'eˣsin(x) + C', 'eˣ + C'] },
      { q: '∫eˣcos(x) dx = ?', a: 'eˣ(sin(x)+cos(x))/2 + C', o: ['eˣ(sin(x)+cos(x))/2 + C', 'eˣsin(x) + C', 'eˣcos(x) + C', 'eˣ + C'] },
      { q: '∫1/√(1-x²) dx = ?', a: 'arcsin(x) + C', o: ['arcsin(x) + C', 'arccos(x) + C', '√(1-x²) + C', '1 + C'] },
      { q: '∫x√(1+x²) dx = ?', a: '(1+x²)^(3/2)/3 + C', o: ['(1+x²)^(3/2)/3 + C', '√(1+x²) + C', 'x²√(1+x²) + C', '(1+x²) + C'] },
      { q: '∫(x+1)⁵ dx = ?', a: '(x+1)⁶/6 + C', o: ['(x+1)⁶/6 + C', '(x+1)⁵/5 + C', '(x+1)⁶ + C', 'x⁶ + C'] },
      { q: '∫1/(x²+4) dx = ?', a: 'arctan(x/2)/2 + C', o: ['arctan(x/2)/2 + C', 'arctan(x) + C', 'ln(x²+4) + C', 'x/2 + C'] },
      { q: '∫arcsin(x) dx = ?', a: 'xarcsin(x) + √(1-x²) + C', o: ['xarcsin(x) + √(1-x²) + C', 'arcsin(x) + C', 'x²arcsin(x) + C', 'arccos(x) + C'] },
      { q: '∫arccos(x) dx = ?', a: 'xarccos(x) - √(1-x²) + C', o: ['xarccos(x) - √(1-x²) + C', 'arccos(x) + C', 'x²arccos(x) + C', 'x + C'] },
      { q: '∫sinh(x) dx = ?', a: 'cosh(x) + C', o: ['cosh(x) + C', 'sinh(x) + C', '-cosh(x) + C', 'sinh(x) + C'] },
      { q: '∫cosh(x) dx = ?', a: 'sinh(x) + C', o: ['sinh(x) + C', 'cosh(x) + C', '-sinh(x) + C', 'cosh(x) + C'] },
      { q: '∫sech²(x) dx = ?', a: 'tanh(x) + C', o: ['tanh(x) + C', 'sech(x) + C', '-tanh(x) + C', 'sech²(x) + C'] },
      { q: '∫tanh(x) dx = ?', a: 'ln(cosh(x)) + C', o: ['ln(cosh(x)) + C', 'tanh(x) + C', 'sech(x) + C', 'cosh(x) + C'] },
      { q: '∫1/(x√(x²-1)) dx = ?', a: 'arcsec(|x|) + C', o: ['arcsec(|x|) + C', 'arccos(1/x) + C', '√(x²-1) + C', '1/x + C'] },
      { q: '∫|x| dx = ?', a: 'x|x|/2 + C', o: ['x|x|/2 + C', 'x²/2 + C', '|x| + C', 'x + C'] },
      { q: '∫max(x,0) dx = ?', a: 'x²/2 + C if x>0', o: ['x²/2 + C if x>0', 'x + C', '|x| + C', 'max(x,0) + C'] },
      { q: '∫dx/(eˣ+e⁻ˣ) = ?', a: 'arctan(eˣ) + C', o: ['arctan(eˣ) + C', 'ln(eˣ) + C', 'eˣ + C', '1 + C'] },
      { q: '∫dx/(1+eˣ) = ?', a: 'x - ln(1+eˣ) + C', o: ['x - ln(1+eˣ) + C', 'ln(1+eˣ) + C', 'eˣ + C', 'x + C'] },
      { q: '∫xln(x) dx = ?', a: 'x²ln(x)/2 - x²/4 + C', o: ['x²ln(x)/2 - x²/4 + C', 'xln(x) + C', 'ln(x)/2 + C', 'x² + C'] },
      { q: '∫√(ax+b) dx = ?', a: '2(ax+b)^(3/2)/(3a) + C', o: ['2(ax+b)^(3/2)/(3a) + C', '√(ax+b) + C', '(ax+b)² + C', 'ax + C'] },
      { q: '∫x/(x+1) dx = ?', a: 'x - ln|x+1| + C', o: ['x - ln|x+1| + C', 'x + C', 'ln|x+1| + C', 'x² + C'] },
      { q: '∫x²/(x+1) dx = ?', a: 'x²/2 - x + ln|x+1| + C', o: ['x²/2 - x + ln|x+1| + C', 'x² + C', 'x - ln|x+1| + C', '(x+1)² + C'] },
      { q: '∫sin³(x)cos(x) dx = ?', a: 'sin⁴(x)/4 + C', o: ['sin⁴(x)/4 + C', 'sin³(x) + C', 'cos⁴(x) + C', 'sin(x) + C'] },
      { q: '∫tan²(x) dx = ?', a: 'tan(x) - x + C', o: ['tan(x) - x + C', 'tan²(x) + C', 'sec²(x) + C', 'tan(x) + C'] },
      { q: '∫sec³(x) dx = ?', a: '(sec(x)tan(x) + ln|sec(x)+tan(x)|)/2 + C', o: ['(sec(x)tan(x) + ln|sec(x)+tan(x)|)/2 + C', 'sec³(x)/3 + C', 'sec(x) + C', 'tan(x) + C'] },
      { q: '∫tan³(x) dx = ?', a: 'tan²(x)/2 - ln|cos(x)| + C', o: ['tan²(x)/2 - ln|cos(x)| + C', 'tan³(x)/3 + C', 'tan(x) + C', 'sec(x) + C'] },
      { q: '∫cot³(x) dx = ?', a: '-cot²(x)/2 - ln|sin(x)| + C', o: ['-cot²(x)/2 - ln|sin(x)| + C', 'cot³(x)/3 + C', 'cot(x) + C', 'csc(x) + C'] },
      { q: '∫1/(x²+4x+5) dx = ?', a: 'arctan(x+2) + C', o: ['arctan(x+2) + C', 'ln(x²+4x+5) + C', 'x + C', '1/(x+2) + C'] },
      { q: '∫√(x²+1) dx = ?', a: '(x√(x²+1) + asinh(x))/2 + C', o: ['(x√(x²+1) + asinh(x))/2 + C', '√(x²+1) + C', 'x² + C', '(x²+1)^(3/2) + C'] },
      { q: '∫x√(x-1) dx = ?', a: '2(x-1)^(5/2)/5 + 2(x-1)^(3/2)/3 + C', o: ['2(x-1)^(5/2)/5 + 2(x-1)^(3/2)/3 + C', '√(x-1) + C', 'x² + C', '(x-1)² + C'] },
      { q: '∫x³√(1+x²) dx = ?', a: '(1+x²)^(5/2)/5 - (1+x²)^(3/2)/3 + C', o: ['(1+x²)^(5/2)/5 - (1+x²)^(3/2)/3 + C', '√(1+x²) + C', 'x⁴ + C', '(1+x²)² + C'] },
      { q: '∫e^(2x) dx = ?', a: 'e^(2x)/2 + C', o: ['e^(2x)/2 + C', 'e^(2x) + C', '2e^(2x) + C', 'e^(2x)+C'] },
      { q: '∫1/(eˣ+1) dx = ?', a: 'x - ln(eˣ+1) + C', o: ['x - ln(eˣ+1) + C', 'ln(eˣ+1) + C', 'eˣ + C', 'eˣ-1 + C'] },
      { q: '∫dx/√(x-x²) = ?', a: 'arcsin(2x-1) + C', o: ['arcsin(2x-1) + C', '√(x-x²) + C', 'x + C', 'ln(x) + C'] },
      { q: '∫sin(3x) dx = ?', a: '-cos(3x)/3 + C', o: ['-cos(3x)/3 + C', 'cos(3x) + C', '-3cos(x) + C', 'sin(x) + C'] },
      { q: '∫cos(5x) dx = ?', a: 'sin(5x)/5 + C', o: ['sin(5x)/5 + C', '5sin(x) + C', 'cos(x) + C', '-sin(5x)/5 + C'] },
      { q: '∫xsec²(x) dx = ?', a: 'xtan(x) + ln|cos(x)| + C', o: ['xtan(x) + ln|cos(x)| + C', 'sec²(x) + C', 'tan(x) + C', 'x + C'] },
      { q: '∫x/(x²+1) dx = ?', a: 'ln(x²+1)/2 + C', o: ['ln(x²+1)/2 + C', 'arctan(x) + C', 'x + C', '1 + C'] },
      { q: '∫ln(x+1) dx = ?', a: '(x+1)ln(x+1) - x + C', o: ['(x+1)ln(x+1) - x + C', 'ln(x+1) + C', 'xln(x+1) + C', '(x+1) + C'] },
      { q: '∫1/(x²+2x+2) dx = ?', a: 'arctan(x+1) + C', o: ['arctan(x+1) + C', 'ln(x²+2x+2) + C', 'x + C', '1 + C'] },
      { q: '∫x^(n) dx = ?', a: 'x^(n+1)/(n+1) + C (n≠-1)', o: ['x^(n+1)/(n+1) + C (n≠-1)', 'nx^(n-1) + C', 'x^n + C', 'x^(n+1) + C'] },
    ];
    const data = questions[q % questions.length];
    const correctIndex = data.o.indexOf(data.a);
    return {
      id: generateId('int', q),
      question: data.q,
      options: data.o,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      topic: 'integration'
    };
  }),
};

export const getQuizForLesson = (lessonTitle: string): Question[] => {
  const title = lessonTitle.toLowerCase();
  if (title.includes('derivative')) return quizData.derivatives || [];
  if (title.includes('integral') || title.includes('integration')) return quizData.integration || [];
  return [...quizData.derivatives, ...quizData.integration].slice(0, 20);
};

export const getQuizCountForLesson = (lessonTitle: string): number => {
  return getQuizForLesson(lessonTitle).length;
};

export const getTotalQuizCount = (): number => {
  return Object.values(quizData).reduce((sum, arr) => sum + arr.length, 0);
};

export const getNotesForTopic = (topic: string): QuizNote | undefined => {
  return quizNotes.find(n => n.topic.toLowerCase().includes(topic.toLowerCase()));
};

export const getAllQuizNotes = (): QuizNote[] => {
  return quizNotes;
};
