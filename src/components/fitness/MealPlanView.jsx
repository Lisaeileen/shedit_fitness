import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, ShoppingCart, MessageCircle, Heart, RefreshCcw, ChevronDown, X, Send, Sparkles, Sunrise, Sun, Moon, Apple } from 'lucide-react';
import { MealPlans } from '../storage';
import { base44 } from '@/api/base44Client';
import { getIngredientImage } from './ingredientImages';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', icon: 'sunrise',  calKey: 'breakfast_calories', protKey: 'breakfast_protein', carbKey: 'breakfast_carbs', fatKey: 'breakfast_fat', color: '#f59e0b' },
  { key: 'lunch',     label: 'Lunch',     icon: 'sun',      calKey: 'lunch_calories',     protKey: 'lunch_protein',     carbKey: 'lunch_carbs',     fatKey: 'lunch_fat',     color: '#a855f7' },
  { key: 'dinner',    label: 'Dinner',    icon: 'moon',     calKey: 'dinner_calories',    protKey: 'dinner_protein',    carbKey: 'dinner_carbs',    fatKey: 'dinner_fat',    color: '#6366f1' },
  { key: 'snacks',    label: 'Snacks',    icon: 'apple',    calKey: 'snacks_calories',    protKey: 'snacks_protein',    carbKey: 'snacks_carbs',    fatKey: 'snacks_fat',    color: '#ec4899' },
];

// Cache for AI-generated meal images
const mealImageCache = {};

async function getMealImage(mealName) {
  if (!mealName) return null;
  const key = mealName.slice(0, 60).toLowerCase();
  if (mealImageCache[key]) return mealImageCache[key];
  try {
    const res = await base44.integrations.Core.GenerateImage({
      prompt: `Professional food photography of ${mealName}, overhead shot on a beautiful dark plate, restaurant quality, vibrant colors, sharp focus, 4K`
    });
    mealImageCache[key] = res.url;
    return res.url;
  } catch { return null; }
}

// ── MealDetailModal ──────────────────────────────────────────────────────────

function MealDetailModal({ dayPlan, meal, onClose, onSaveFavorite, favorites, onSwap, swapping }) {
  if (!dayPlan) return null;
  const mealName = dayPlan[meal.key];
  const cal = dayPlan[meal.calKey] || 0;
  const prot = dayPlan[meal.protKey] || 0;
  const carbs = dayPlan[meal.carbKey] || 0;
  const fat = dayPlan[meal.fatKey] || 0;
  const detailKey = `${meal.key}_detail`;
  const detail = dayPlan[detailKey];
  const isFav = favorites.includes(mealName);
  const [mealImage, setMealImage] = useState(dayPlan[`${meal.key}_image`] || null);
  const [imgLoading, setImgLoading] = useState(!mealImage);

  useEffect(() => {
    if (!mealImage && mealName) {
      setImgLoading(true);
      getMealImage(mealName).then(url => {
        if (url) setMealImage(url);
        setImgLoading(false);
      });
    }
  }, [mealName]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="mt-auto w-full max-w-md mx-auto rounded-t-3xl overflow-hidden flex flex-col"
        style={{ background: '#120630', maxHeight: '90vh' }}>
        {/* Hero image */}
        <div className="relative flex-shrink-0 flex items-center justify-center" style={{ height: 200, background: 'linear-gradient(135deg, #1a0640, #2a0a4a)' }}>
          {imgLoading && <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />}
          {mealImage && <img src={mealImage} alt={mealName} className="w-full h-full object-cover absolute inset-0" />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #120630 0%, transparent 60%)' }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
              {meal.icon === 'sunrise' && <Sunrise className="w-4 h-4" style={{ color: meal.color }} />}
              {meal.icon === 'sun'     && <Sun     className="w-4 h-4" style={{ color: meal.color }} />}
              {meal.icon === 'moon'    && <Moon    className="w-4 h-4" style={{ color: meal.color }} />}
              {meal.icon === 'apple'   && <Apple   className="w-4 h-4" style={{ color: meal.color }} />}
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{meal.label}</span>
            </div>
        </div>

        <div className="overflow-y-auto no-scrollbar px-5 pb-8 pt-3">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-black text-white flex-1 pr-3 leading-tight">{mealName}</h2>
            <button onClick={() => onSaveFavorite(mealName)}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isFav ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.06)', border: isFav ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
              <Heart className="w-4 h-4" style={{ color: isFav ? '#ec4899' : '#6b7280' }} fill={isFav ? '#ec4899' : 'none'} />
            </button>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Cal', val: cal, unit: 'kcal', color: meal.color },
              { label: 'Protein', val: prot, unit: 'g', color: '#ec4899' },
              { label: 'Carbs', val: carbs, unit: 'g', color: '#3b82f6' },
              { label: 'Fat', val: fat, unit: 'g', color: '#f59e0b' },
            ].map(m => (
              <div key={m.label} className="rounded-xl p-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-black" style={{ color: m.color }}>{m.val}</p>
                <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          {/* AI-generated details */}
          {detail ? (
            <>
              {detail.ingredients && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ingredients</p>
                  <div className="space-y-2">
                    {detail.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <img
                          src={getIngredientImage(ing)}
                          alt={ing}
                          className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&q=70'; }}
                          loading="lazy"
                        />
                        <span className="text-sm text-gray-300 leading-tight">{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {detail.instructions && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instructions</p>
                  <div className="space-y-2">
                    {detail.instructions.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-xs font-bold w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>{i + 1}</span>
                        <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-gray-600">Tap "Swap Meal" to get full recipe details from AI</p>
            </div>
          )}

          {/* Swap button */}
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onSwap(meal)} disabled={swapping}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm mt-2"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))', border: '1px solid rgba(168,85,247,0.35)', color: '#c084fc' }}>
            {swapping ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            {swapping ? 'Finding alternative...' : 'Swap Meal'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── GroceryListModal ─────────────────────────────────────────────────────────

function GroceryListModal({ plans, onClose }) {
  const [loading, setLoading] = useState(true);
  const [groceries, setGroceries] = useState(null);

  React.useEffect(() => {
    const mealNames = plans.flatMap(p => [p.breakfast, p.lunch, p.dinner, p.snacks].filter(Boolean));
    base44.integrations.Core.InvokeLLM({
      prompt: `Generate a weekly grocery list for these meals: ${mealNames.join(', ')}. Group by category: Produce, Protein, Dairy, Grains & Pantry, Other. Return JSON.`,
      response_json_schema: {
        type: 'object',
        properties: {
          Produce: { type: 'array', items: { type: 'string' } },
          Protein: { type: 'array', items: { type: 'string' } },
          Dairy: { type: 'array', items: { type: 'string' } },
          'Grains & Pantry': { type: 'array', items: { type: 'string' } },
          Other: { type: 'array', items: { type: 'string' } },
        }
      }
    }).then(res => { setGroceries(res); setLoading(false); });
  }, []);

  const CATEGORY_ICONS = { Produce: '🥦', Protein: '🍗', Dairy: '🥛', 'Grains & Pantry': '🌾', Other: '🛒' };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="mt-auto w-full max-w-md mx-auto rounded-t-3xl overflow-hidden flex flex-col"
        style={{ background: '#120630', maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="text-[10px] text-purple-400/50 uppercase tracking-widest">Weekly</p>
            <h2 className="text-lg font-black text-white">Grocery List</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto no-scrollbar px-5 py-4">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Generating your grocery list...</p>
            </div>
          ) : groceries ? (
            <div className="space-y-5">
              {Object.entries(groceries).filter(([, items]) => items?.length > 0).map(([cat, items]) => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-base">{CATEGORY_ICONS[cat] || '📦'}</span>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat}</p>
                  </div>
                  <div className="space-y-2">
                     {items.map((item, i) => (
                       <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                         <img
                           src={getIngredientImage(item)}
                           alt={item}
                           className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                           onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&q=70'; }}
                           loading="lazy"
                         />
                         <span className="text-sm text-gray-300">{item}</span>
                       </div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Could not generate grocery list</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── MealChatModal ─────────────────────────────────────────────────────────────

function MealChatModal({ goals, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${goals?.user_name || 'there'}! I'm your AI Meal Assistant. Ask me anything — I can suggest recipes, swap meals, or help with your nutrition goals.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = React.useRef(null);

  const QUICK = [
    'High protein dinner under 500 cal',
    'Healthy breakfast with eggs',
    'Quick 15-min lunch idea',
    'Low carb snack suggestions',
  ];

  const send = async (text) => {
    if (!text.trim()) return;
    const msg = text.trim();
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a friendly AI nutritionist inside the Shedit fitness app. The user's diet preference is ${goals?.diet_styles?.join(', ') || 'balanced'}. Their calorie goal is ${goals?.daily_calorie_target || 2000} kcal/day. Foods to avoid: ${goals?.disliked_foods?.join(', ') || 'none'}. Answer this: "${msg}". Be concise, helpful, and include rough calories/macros if suggesting a recipe.`,
    });
    setMessages(m => [...m, { role: 'assistant', text: typeof res === 'string' ? res : JSON.stringify(res) }]);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="mt-auto w-full max-w-md mx-auto rounded-t-3xl flex flex-col"
        style={{ background: '#120630', height: '80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">AI Meal Assistant</p>
              <p className="text-[10px] text-purple-400/60">Powered by AI</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)}
                className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-6 pt-2 flex gap-2 flex-shrink-0">
          <input className="flex-1 px-4 py-3 rounded-2xl text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="Ask me anything about food..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input); }} />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main MealPlanView ─────────────────────────────────────────────────────────

export default function MealPlanView({ goals, mealPlans: initialPlans = [], onRefresh, onRedo, onRegenerate }) {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [generating, setGenerating] = useState(false);
  const [plans, setPlans] = useState(initialPlans);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [selectedMealModal, setSelectedMealModal] = useState(null);
  const [showGrocery, setShowGrocery] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shedit_fav_meals') || '[]'); } catch { return []; }
  });
  const [swapping, setSwapping] = useState(false);

  const dayPlan = plans.find(p => p.day_of_week === selectedDay);
  const totalCals = MEAL_CONFIG.reduce((s, m) => s + (dayPlan?.[m.calKey] || 0), 0);

  const saveFavorite = (name) => {
    setFavorites(favs => {
      const updated = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
      localStorage.setItem('shedit_fav_meals', JSON.stringify(updated));
      return updated;
    });
  };

  const swapMeal = async (meal) => {
    if (!dayPlan) return;
    setSwapping(true);
    const prefs = `Diet: ${goals?.diet_styles?.join(', ') || 'balanced'}. Avoid: ${goals?.disliked_foods?.join(', ') || 'none'}. Calorie target for ${meal.label}: ~${dayPlan[meal.calKey]} kcal.`;
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Suggest an alternative ${meal.label} meal. ${prefs} Return a JSON with: name (string), calories (number), protein (number), carbs (number), fat (number), ingredients (array of strings), instructions (array of strings).`,
      response_json_schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          calories: { type: 'number' },
          protein: { type: 'number' },
          carbs: { type: 'number' },
          fat: { type: 'number' },
          ingredients: { type: 'array', items: { type: 'string' } },
          instructions: { type: 'array', items: { type: 'string' } },
        }
      }
    });
    MealPlans.updateDay(dayPlan.id, {
      [meal.key]: res.name,
      [meal.calKey]: res.calories,
      [meal.protKey]: res.protein,
      [meal.carbKey]: res.carbs,
      [meal.fatKey]: res.fat,
      [`${meal.key}_detail`]: { ingredients: res.ingredients, instructions: res.instructions },
    });
    setPlans(MealPlans.list());
    setSwapping(false);
    setSelectedMealModal(null);
  };

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pt-2">
        <div>
          <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Nutrition</p>
          <h1 className="text-2xl font-black text-white">Weekly Plan</h1>
        </div>
        <div className="flex gap-2 mt-1">
          <motion.button whileTap={{ scale: 0.93 }} onClick={() => setShowGrocery(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }} onClick={() => setShowChat(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <MessageCircle className="w-4 h-4 text-purple-400" />
          </motion.button>
        </div>
      </div>

      {/* Action row */}
      <div className="flex gap-2 mb-4">
        {onRegenerate && (
          <motion.button whileTap={{ scale: 0.93 }} onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold flex-1 justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.12))', border: '1px solid rgba(168,85,247,0.3)' }}>
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-400">Regenerate Plan</span>
          </motion.button>
        )}
        {onRedo && (
          <motion.button whileTap={{ scale: 0.93 }} onClick={onRedo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-gray-500">Redo quiz</span>
          </motion.button>
        )}
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar -mx-4 px-4">
        {DAYS.map((day, i) => {
          const isActive = selectedDay === day;
          const hasPlan = plans.some(p => p.day_of_week === day);
          return (
            <motion.button key={day} whileTap={{ scale: 0.92 }} onClick={() => setSelectedDay(day)}
              className="flex flex-col items-center gap-1 px-3.5 py-2 rounded-xl flex-shrink-0 transition-all duration-200"
              style={isActive
                ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }}>
              <span className="text-xs font-bold">{DAY_SHORT[i]}</span>
              {hasPlan && !isActive && <div className="w-1 h-1 rounded-full bg-purple-400/50" />}
            </motion.button>
          );
        })}
      </div>

      {generating ? (
        <div className="flex flex-col items-center py-16">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-white">Shedit is building your plan...</p>
          <p className="text-xs text-purple-300/40 mt-1">Using AI to tailor meals to your goals</p>
        </div>
      ) : dayPlan ? (
        <AnimatePresence mode="wait">
          <motion.div key={selectedDay}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {/* Daily summary */}
            <div className="glass-card-purple rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[10px] text-purple-300/50 uppercase tracking-widest capitalize">{selectedDay}</p>
                  <p className="text-2xl font-black text-white mt-0.5">{totalCals.toLocaleString()} kcal</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-600 mb-1">Macros</p>
                  <div className="flex gap-3">
                    {[
                      { label: 'P', total: MEAL_CONFIG.reduce((s,m)=>s+(dayPlan?.[m.protKey]||0),0), color: '#ec4899' },
                      { label: 'C', total: MEAL_CONFIG.reduce((s,m)=>s+(dayPlan?.[m.carbKey]||0),0), color: '#3b82f6' },
                      { label: 'F', total: MEAL_CONFIG.reduce((s,m)=>s+(dayPlan?.[m.fatKey]||0),0), color: '#f59e0b' },
                    ].map(m => (
                      <div key={m.label} className="text-center">
                        <p className="text-xs font-black" style={{ color: m.color }}>{Math.round(m.total)}g</p>
                        <p className="text-[9px] text-gray-600">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {goals?.daily_calorie_target && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                    <span>Daily goal: {goals.daily_calorie_target} kcal</span>
                    <span>{Math.round((totalCals / goals.daily_calorie_target) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{
                      width: `${Math.min(100, (totalCals / goals.daily_calorie_target) * 100)}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #a855f7)'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Meal cards */}
            <div className="space-y-3 pb-4">
              {MEAL_CONFIG.map((meal, i) => (
                <motion.div key={meal.key}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onClick={() => setSelectedMealModal(meal)}>
                  <div className="flex">
                    {/* Small image */}
                    <div className="relative w-20 flex-shrink-0">
                      <img src={MEAL_IMAGES[meal.key]} alt={meal.label} className="w-full h-full object-cover" style={{ minHeight: 80 }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, rgba(10,4,26,0.7))' }} />
                    </div>
                    <div className="flex-1 p-3.5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            {meal.icon === 'sunrise' && <Sunrise className="w-3.5 h-3.5" style={{ color: meal.color }} />}
                            {meal.icon === 'sun'     && <Sun     className="w-3.5 h-3.5" style={{ color: meal.color }} />}
                            {meal.icon === 'moon'    && <Moon    className="w-3.5 h-3.5" style={{ color: meal.color }} />}
                            {meal.icon === 'apple'   && <Apple   className="w-3.5 h-3.5" style={{ color: meal.color }} />}
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{meal.label}</p>
                          </div>
                          <p className="text-sm font-bold text-white leading-tight line-clamp-2">{dayPlan[meal.key] || 'Not planned'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold" style={{ color: meal.color }}>{dayPlan[meal.calKey] || 0} kcal</span>
                        <div className="flex gap-2">
                          {[
                            { l: 'P', k: meal.protKey, c: '#ec4899' },
                            { l: 'C', k: meal.carbKey, c: '#3b82f6' },
                            { l: 'F', k: meal.fatKey, c: '#f59e0b' },
                          ].map(m => (
                            <span key={m.l} className="text-[10px] font-semibold" style={{ color: m.c }}>
                              {m.l}:{Math.round(dayPlan?.[m.k] || 0)}g
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center pr-3">
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-14">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No plan yet</h3>
          <p className="text-sm text-gray-500 mb-6">Generate your AI personalized weekly meal plan</p>
          {onRegenerate && <button onClick={onRegenerate} className="btn-primary max-w-xs mx-auto">Generate My Plan</button>}
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedMealModal && (
          <MealDetailModal
            dayPlan={dayPlan}
            meal={selectedMealModal}
            onClose={() => setSelectedMealModal(null)}
            onSaveFavorite={saveFavorite}
            favorites={favorites}
            onSwap={swapMeal}
            swapping={swapping} />
        )}
        {showGrocery && plans.length > 0 && (
          <GroceryListModal plans={plans} onClose={() => setShowGrocery(false)} />
        )}
        {showChat && (
          <MealChatModal goals={goals} onClose={() => setShowChat(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}