import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, TrendingDown, Droplets, Footprints, Flame, Brain, Loader2 } from 'lucide-react';
import { DailyLogs, Meals, CoachMessages, UserGoals } from '../components/storage';
import { format } from 'date-fns';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { base44 } from '@/api/base44Client';

// ── AI Coach logic (local, no API) ──────────────────────────────────────────
function generateCoachResponse(userMessage, context) {
  const { todayLog, logs, goals } = context;
  const cals    = todayLog.calories_consumed || 0;
  const calsGoal = todayLog.calories_goal || 2000;
  const protein = todayLog.protein || 0;
  const proteinGoal = todayLog.protein_goal || 120;
  const steps   = todayLog.steps || 0;
  const stepsGoal = todayLog.steps_goal || 10000;
  const water   = todayLog.water_glasses || 0;
  const waterGoal = todayLog.water_goal || 8;

  const msg = userMessage.toLowerCase();

  // Weight trend
  const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentWeight = weightLogs.at(-1)?.weight;
  const startWeight   = weightLogs[0]?.weight;
  const lostKg = currentWeight && startWeight ? Math.max(startWeight - currentWeight, 0) : 0;

  // Weekly avg calorie deficit
  const recent7 = logs.slice(-7);
  const avgCals = recent7.length ? Math.round(recent7.reduce((s, l) => s + (l.calories_consumed || 0), 0) / recent7.length) : cals;
  const dailyDeficit = calsGoal - avgCals;
  const weeksToGoal = goals?.target_weight && currentWeight
    ? Math.max(Math.round(((currentWeight - goals.target_weight) * 7700) / Math.max(dailyDeficit * 7, 1)), 0)
    : null;

  // Match intent
  if (msg.includes('calories') || msg.includes('calorie')) {
    if (cals === 0) return `You haven't logged any food yet today. Start by tapping + to add your meals. I'll help you stay on track!`;
    if (cals > calsGoal) return `⚠️ You've consumed ${cals} kcal today — that's ${cals - calsGoal} kcal over your ${calsGoal} kcal goal. Try swapping your next snack for something lighter like fruit or yogurt.`;
    return `You've consumed **${cals} kcal** today, which is within your goal of ${calsGoal} kcal. You have **${calsGoal - cals} kcal** remaining. Great discipline!`;
  }

  if (msg.includes('protein')) {
    if (protein < proteinGoal * 0.6) return `You're low on protein today — only ${protein}g out of your ${proteinGoal}g goal. Try adding **eggs, chicken breast, Greek yogurt, or a protein shake** to your next meal. Protein keeps you full and preserves muscle mass.`;
    if (protein >= proteinGoal) return `Excellent! You've hit your protein goal of ${proteinGoal}g today with ${protein}g. That's fantastic for muscle maintenance and satiety! 💪`;
    return `You're at ${protein}g protein — ${proteinGoal - protein}g to go. Add a **protein-rich snack** like cottage cheese or tuna to finish strong.`;
  }

  if (msg.includes('steps') || msg.includes('walk')) {
    const remaining = stepsGoal - steps;
    if (steps >= stepsGoal) return `🎉 Amazing! You've crushed your step goal with ${steps.toLocaleString()} steps today! You've burned an estimated ${Math.round(steps * 0.04)} extra calories from walking.`;
    if (remaining < 2000) return `You're so close! Just **${remaining.toLocaleString()} more steps** to hit your goal of ${stepsGoal.toLocaleString()}. A 15-minute walk will get you there!`;
    return `You've walked **${steps.toLocaleString()} steps** today. You need ${remaining.toLocaleString()} more to reach ${stepsGoal.toLocaleString()}. Try a 20-minute walk after your next meal — it also helps digestion!`;
  }

  if (msg.includes('water') || msg.includes('hydrat')) {
    if (water < 4) return `💧 You've only had ${water} glasses of water today. Aim for at least 8 glasses. Dehydration can cause fatigue and hunger — drink a glass right now!`;
    if (water >= waterGoal) return `💧 Excellent hydration! ${water} glasses today — you're on track. Staying hydrated boosts metabolism and reduces cravings.`;
    return `You've had ${water} glasses of water. ${waterGoal - water} more to go! Tip: keep a water bottle at your desk as a visual reminder.`;
  }

  if (msg.includes('weight') || msg.includes('trend') || msg.includes('progress')) {
    if (!currentWeight) return `You haven't logged your weight yet. Go to the Today tab and tap '+ Log' under Weight to get started. I'll then be able to give you trend predictions!`;
    if (lostKg > 0) {
      const monthlyPrediction = dailyDeficit > 0 ? (dailyDeficit * 30 / 7700).toFixed(1) : '0';
      return `📊 You've lost **${lostKg.toFixed(1)} kg** since you started — incredible progress! Based on your current habits, you're on track to lose approximately **${monthlyPrediction} kg this month**. ${weeksToGoal ? `Your goal weight is approximately **${weeksToGoal} weeks** away.` : ''} Keep it up!`;
    }
    return `Your current weight is ${currentWeight} kg. Keep logging consistently and I'll be able to show you your trend and predict when you'll reach your goal!`;
  }

  if (msg.includes('meal') || msg.includes('eat') || msg.includes('food') || msg.includes('suggest')) {
    const suggestions = [
      ['**Breakfast**', 'Greek yogurt with berries (300 kcal, 20g protein)', 'Overnight oats with chia seeds (350 kcal, 12g protein)'],
      ['**Lunch**', 'Grilled chicken salad with avocado (420 kcal, 38g protein)', 'Tuna wrap with lettuce and tomato (380 kcal, 32g protein)'],
      ['**Dinner**', 'Salmon with roasted vegetables (480 kcal, 40g protein)', 'Stir-fried tofu with brown rice (420 kcal, 22g protein)'],
      ['**Snack**', 'Apple with peanut butter (220 kcal, 7g protein)', 'Cottage cheese with cucumber (150 kcal, 18g protein)'],
    ];
    const r = suggestions[Math.floor(Math.random() * suggestions.length)];
    return `Here are some ${r[0]} ideas tailored to your goals:\n\n🍽️ ${r[1]}\n🍽️ ${r[2]}\n\nBoth are high in protein and will keep you satisfied. Want me to add one to your diary?`;
  }

  if (msg.includes('motivat') || msg.includes('help') || msg.includes('struggle')) {
    const messages = [
      `Every healthy choice you make is a vote for the person you want to become. You've already started — that's the hardest part. Keep going! 🔥`,
      `Progress, not perfection. Even on tough days, logging your food and taking a short walk moves you forward. You've got this! 💪`,
      `Remember why you started. Small consistent actions create massive results over time. Trust the process — your body is changing! 🌟`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (msg.includes('predict') || msg.includes('goal') || msg.includes('when')) {
    if (weeksToGoal !== null && weeksToGoal > 0) {
      return `📈 Based on your average calorie deficit of ${dailyDeficit} kcal/day, you could reach your goal in approximately **${weeksToGoal} weeks**. Stay consistent and I'll update this prediction as your habits evolve!`;
    }
    return `To give you a prediction, make sure you've logged your weight and set a calorie goal. Then I can calculate exactly when you'll reach your target! 🎯`;
  }

  // Default intelligent response
  const dailyTips = [];
  if (cals === 0) dailyTips.push('log your first meal');
  if (protein < proteinGoal * 0.5) dailyTips.push(`boost protein (${protein}g/${proteinGoal}g)`);
  if (steps < stepsGoal * 0.5) dailyTips.push(`walk more (${steps.toLocaleString()}/${stepsGoal.toLocaleString()} steps)`);
  if (water < 4) dailyTips.push('drink more water');

  if (dailyTips.length > 0) {
    return `Here's your daily coaching summary 📊\n\n**Today's focus areas:**\n${dailyTips.map(t => `• ${t}`).join('\n')}\n\nAsk me about calories, protein, steps, water, weight trends, or meal suggestions!`;
  }

  return `Great job today! 🌟 You're on track with your calories (${cals}/${calsGoal} kcal) and steps (${steps.toLocaleString()}/${stepsGoal.toLocaleString()}). Ask me about your progress, meal suggestions, or weight trends!`;
}

// Weight prediction chart
function PredictionChart({ logs }) {
  const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-8);
  if (weightLogs.length < 2) return null;

  const last = weightLogs.at(-1);
  const first = weightLogs[0];
  const totalDays = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24) || 1;
  const ratePerDay = (first.weight - last.weight) / totalDays;

  const historicalData = weightLogs.map(l => ({
    label: format(new Date(l.date), 'MMM d'),
    actual: l.weight,
    predicted: null,
  }));

  const futureData = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(last.date);
    d.setDate(d.getDate() + (i + 1) * 7);
    return {
      label: format(d, 'MMM d'),
      actual: null,
      predicted: +(last.weight - ratePerDay * (i + 1) * 7).toFixed(1),
    };
  });

  const data = [...historicalData, ...futureData];

  return (
    <div className="glass-card rounded-2xl p-4 mb-4">
      <p className="text-[10px] text-purple-300/50 uppercase tracking-widest font-bold mb-1">Weight Prediction</p>
      <p className="text-sm font-bold text-white mb-3">
        If you maintain current habits:
        <span className="text-purple-400 ml-1">{futureData[3]?.predicted?.toFixed(1)} kg in 4 weeks</span>
      </p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 5 }}>
            <defs>
              <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            <Tooltip contentStyle={{ background: '#2A0A4A', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#a855f7' }} />
            <Area type="monotone" dataKey="actual" stroke="#a855f7" strokeWidth={2.5} fill="url(#actGrad)" connectNulls={false} dot={{ fill: '#a855f7', r: 3, strokeWidth: 0 }} name="Actual" />
            <Area type="monotone" dataKey="predicted" stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 3" fill="url(#predGrad)" connectNulls={false} dot={false} name="Predicted" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-1 rounded-full bg-purple-400" /><span className="text-[10px] text-gray-500">Actual</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-1 rounded-full bg-cyan-400" style={{ background: 'repeating-linear-gradient(90deg,#22d3ee 0,#22d3ee 4px,transparent 4px,transparent 7px)' }} /><span className="text-[10px] text-gray-500">Predicted</span></div>
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  { label: 'Today\'s calories', icon: Flame, color: '#a855f7' },
  { label: 'Protein check', icon: Brain, color: '#ec4899' },
  { label: 'Steps update', icon: Footprints, color: '#c084fc' },
  { label: 'Water intake', icon: Droplets, color: '#22d3ee' },
  { label: 'Weight trend', icon: TrendingDown, color: '#10b981' },
  { label: 'Meal ideas', icon: Sparkles, color: '#f59e0b' },
];

export default function Coach() {
  const [messages, setMessages] = useState(() => {
    const saved = CoachMessages.list();
    if (saved.length === 0) {
      const welcome = { id: 'welcome', role: 'coach', ts: Date.now(), text: "Hi! I'm your **Shedit Coach** 🧠\n\nI analyze your daily nutrition, steps, and weight to give you personalized feedback.\n\nAsk me about your calories, protein, steps, hydration, weight trends, or meal suggestions!" };
      return [welcome];
    }
    return saved;
  });
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const bottomRef = useRef(null);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const logs     = useMemo(() => DailyLogs.list(), []);
  const todayLog = useMemo(() => logs.find(l => l.date === todayStr) || {}, [logs, todayStr]);
  const goals    = useMemo(() => UserGoals.get(), []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = CoachMessages.add({ role: 'user', text });
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    // Build context snapshot for AI
    const cals      = todayLog.calories_consumed || 0;
    const calsGoal  = todayLog.calories_goal || 2000;
    const protein   = todayLog.protein || 0;
    const proteinGoal = todayLog.protein_goal || 120;
    const steps     = todayLog.steps || 0;
    const stepsGoal = todayLog.steps_goal || 10000;
    const water     = todayLog.water_glasses || 0;
    const weightLogs = [...logs].filter(l => l.weight).sort((a, b) => new Date(a.date) - new Date(b.date));
    const currentWeight = weightLogs.at(-1)?.weight;
    const startWeight   = weightLogs[0]?.weight;
    const lostKg        = currentWeight && startWeight ? Math.max(startWeight - currentWeight, 0).toFixed(1) : '0';
    const recent7 = logs.slice(-7);
    const avgCals = recent7.length
      ? Math.round(recent7.reduce((s, l) => s + (l.calories_consumed || 0), 0) / recent7.length)
      : cals;

    const contextSummary = `
User's data today (${format(new Date(), 'MMM d, yyyy')}):
- Calories consumed: ${cals} / ${calsGoal} kcal goal
- Protein: ${protein}g / ${proteinGoal}g goal
- Steps: ${steps.toLocaleString()} / ${stepsGoal.toLocaleString()} goal
- Water: ${water} glasses
- Weight: ${currentWeight ? `${currentWeight} kg` : 'not logged'}
- Total weight lost: ${lostKg} kg
- 7-day average calories: ${avgCals} kcal
- User's target weight: ${goals?.target_weight ? `${goals.target_weight} kg` : 'not set'}
    `.trim();

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Shedit Coach, a friendly and knowledgeable personal nutrition and fitness AI assistant.

${contextSummary}

User message: "${text}"

Respond in 2-4 sentences. Be specific, data-driven, and encouraging. Reference their actual numbers when relevant. Use **bold** for key numbers/recommendations. Keep it concise and actionable.`,
      });
      const coachMsg = CoachMessages.add({ role: 'coach', text: result });
      setMessages(m => [...m, coachMsg]);
    } catch {
      // Fallback to local logic
      const responseText = generateCoachResponse(text, { todayLog, logs, goals });
      const coachMsg = CoachMessages.add({ role: 'coach', text: responseText });
      setMessages(m => [...m, coachMsg]);
    } finally {
      setTyping(false);
    }
  };

  // Readiness score
  const readiness = useMemo(() => {
    let score = 40;
    const cals = todayLog.calories_consumed || 0;
    const calsGoal = todayLog.calories_goal || 2000;
    if (cals > 0 && cals <= calsGoal) score += 20;
    const steps = todayLog.steps || 0;
    if (steps >= 10000) score += 20; else if (steps >= 5000) score += 10;
    const water = todayLog.water_glasses || 0;
    if (water >= 8) score += 10; else if (water >= 4) score += 5;
    const exercise = todayLog.exercise_minutes || 0;
    if (exercise >= 30) score += 10; else if (exercise >= 15) score += 5;
    return Math.min(score, 100);
  }, [todayLog]);

  const readinessColor = readiness >= 75 ? '#10b981' : readiness >= 50 ? '#f59e0b' : '#f43f5e';
  const readinessLabel = readiness >= 75 ? 'Excellent' : readiness >= 50 ? 'Good' : 'Low';

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div className="px-4 pt-2 pb-3 flex-shrink-0">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">AI Assistant</p>
          <h1 className="text-2xl font-black gradient-text">Shedit Coach</h1>
        </motion.div>

        {/* Readiness Score */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card-purple rounded-2xl p-4 mt-3 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <svg width={72} height={72} className="-rotate-90">
              <circle cx={36} cy={36} r={28} fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth={7} />
              <motion.circle cx={36} cy={36} r={28} fill="none" stroke={readinessColor} strokeWidth={7} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - readiness / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                style={{ filter: `drop-shadow(0 0 6px ${readinessColor}80)` }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-white">{readiness}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-purple-300/50 font-medium">Daily Readiness</p>
            <p className="text-base font-black text-white">{readinessLabel} day for activity</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {readiness >= 75 ? 'Great day for a workout!' : readiness >= 50 ? 'Moderate activity recommended.' : 'Rest and recover today.'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Prediction chart */}
      <div className="px-4 flex-shrink-0">
        <PredictionChart logs={logs} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-2">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'coach' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
              style={msg.role === 'user'
                ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <p className="text-sm text-white leading-relaxed">{renderText(msg.text)}</p>
              <p className="text-[9px] text-white/30 mt-1">{new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
          {QUICK_PROMPTS.map((p) => (
            <motion.button key={p.label} whileTap={{ scale: 0.93 }} onClick={() => send(p.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
              style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}25` }}>
              <p.icon className="w-3 h-3" />{p.label}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask your coach anything..."
              className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => send(input)} disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.06)' }}>
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}