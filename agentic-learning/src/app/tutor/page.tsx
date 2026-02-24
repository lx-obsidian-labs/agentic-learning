'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { 
  ChevronLeft, 
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Heart,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { icon: <BookOpen className="w-4 h-4" />, text: 'Explain quadratic equations' },
  { icon: <Calculator className="w-4 h-4" />, text: 'How do I calculate force?' },
  { icon: <FlaskConical className="w-4 h-4" />, text: 'What is photosynthesis?' },
  { icon: <Globe className="w-4 h-4" />, text: 'Describe the water cycle' },
  { icon: <Heart className="w-4 h-4" />, text: 'Explain DNA replication' },
  { icon: <Lightbulb className="w-4 h-4" />, text: 'What is supply and demand?' },
];

export default function TutorPage() {
  const { progress } = useProgress();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Study Tutor. I'm here to help you understand any concept from your subjects. Ask me anything about Math, Physics, Life Sciences, or Geography!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes('quadratic') || q.includes('equation')) {
      return `A quadratic equation is an equation of the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0.

**Key Points:**
• The solutions are given by the quadratic formula: x = (-b ± √(b²-4ac)) / 2a
• The discriminant (b²-4ac) determines the nature of roots:
  - Positive: 2 real roots
  - Zero: 1 real root
  - Negative: 2 complex roots

**Example:** For x² - 5x + 6 = 0:
- a = 1, b = -5, c = 6
- x = (5 ± √(25-24)) / 2 = (5 ± 1) / 2
- x = 3 or x = 2

Would you like me to explain more about factoring quadratic equations?`;
    }
    
    if (q.includes('force') || q.includes('newton')) {
      return `Force is calculated using Newton's Second Law: **F = ma**

Where:
- F = Force (measured in Newtons, N)
- m = Mass (kg)
- a = Acceleration (m/s²)

**Example:**
If a 5kg object accelerates at 2 m/s²:
F = 5 × 2 = **10 Newtons**

**Key concepts:**
• 1 Newton = force needed to accelerate 1kg at 1m/s²
• Force is a vector (has direction)
• Friction and gravity are common forces in physics problems

Need help with a specific force problem?`;
    }
    
    if (q.includes('photosynthesis')) {
      return `Photosynthesis is the process plants use to convert light energy into chemical energy.

**Equation:**
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

**Two Main Stages:**

1. **Light-dependent reactions** (in thylakoid membranes)
   - Chlorophyll absorbs light
   - Water is split (photolysis)
   - ATP and NADPH produced
   - Oxygen released as byproduct

2. **Light-independent reactions** (Calvin cycle in stroma)
   - CO₂ fixation
   - Reduction reactions
   - Sugar (glucose) produced

**Factors affecting rate:**
- Light intensity
- CO₂ concentration
- Temperature
- Water availability

Want me to explain any part in more detail?`;
    }
    
    if (q.includes('water cycle') || q.includes('hydrological')) {
      return `The water cycle describes how water moves through Earth's systems.

**Key Processes:**

1. **Evaporation** - Sun heats water in oceans/lakes, turning it to vapor
2. **Transpiration** - Plants release water vapor through leaves
3. **Condensation** - Water vapor cools and forms clouds
4. **Precipitation** - Water falls as rain/snow/sleet
5. **Collection** - Water gathers in oceans, lakes, groundwater

**Importance:**
- Freshwater distribution
- Weather patterns
- Ecosystem support
- Climate regulation

**Human Impact:**
- Deforestation affects transpiration
- Pollution enters water sources
- Climate change alters precipitation patterns

Would you like to learn about any specific part of the cycle?`;
    }
    
    if (q.includes('derivative') || q.includes('differentiat')) {
      return `A derivative represents the rate of change of a function.

**Basic Rules:**

1. **Power Rule:** d/dx(xⁿ) = n·xⁿ⁻¹
   - Example: d/dx(x³) = 3x²

2. **Constant Rule:** d/dx(c) = 0

3. **Constant Multiple:** d/dx(c·f) = c·f'

4. **Sum/Difference:** d/dx(f ± g) = f' ± g'

**Trigonometric:**
- d/dx(sin x) = cos x
- d/dx(cos x) = -sin x

**Example:** Find derivative of f(x) = 3x⁴ + 2x² - 5x + 7
- f'(x) = 12x³ + 4x - 5

Want me to show integration (the reverse process)?`;
    }
    
    if (q.includes('cell') || q.includes('biology')) {
      return `Cells are the basic unit of life. Here's an overview:

**Types:**
- **Prokaryotic** - No nucleus (bacteria)
- **Eukaryotic** - Has nucleus (plants, animals, fungi)

**Cell Organelles:**

| Organelle | Function |
|-----------|----------|
| Nucleus | Contains DNA, controls cell |
| Ribosome | Protein synthesis |
| Mitochondria | Energy production (ATP) |
| Chloroplast | Photosynthesis (plants) |
| Cell membrane | Controls what enters/exits |
| Vacuole | Storage (plants) |

**Cell Theory:**
1. All living things are made of cells
2. Cells come from pre-existing cells
3. Cells are the basic unit of life

Which type of cell would you like to explore further?`;
    }
    
    return `That's a great question! I'm designed to help with your matric subjects:

**I can help with:**
• **Math:** Algebra, Geometry, Calculus, Statistics
• **Physical Sciences:** Physics, Chemistry formulas
• **Life Sciences:** Biology, Ecology, Human anatomy
• **Geography:** Climate, Geology, Map work

**Try asking me about:**
- Key formulas and how to use them
- Step-by-step problem solving
- Concept explanations
- Exam preparation tips

What would you like to learn about?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleQuickQuestion = (text: string) => {
    setInput(text);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Study Tutor</h1>
                <p className="text-xs text-white/60">Powered by LX Obsidian Labs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-4" style={{ height: 'calc(100vh - 220px)', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                    : 'bg-white/20'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white border border-white/10'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="mt-1 text-white/40 hover:text-white/70 text-xs flex items-center gap-1"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 text-white/60 p-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-white/60 text-sm mb-2 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" /> Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q.text)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {q.icon}
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          
            <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about your subjects..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-white/40 text-xs">Press Enter to send • Get instant help with any topic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
