import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SmartMealSuggestions({ calorieGoal, protein, proteinGoal, carbs, fat, onAddMeal }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const remaining = Math.max(calorieGoal - 0, calorieGoal); // rough estimate
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a nutrition expert. Suggest 4 specific meal ideas for someone with these daily goals:
- Calorie target: ${calorieGoal} kcal/day
- Protein already consumed today: ${protein}g (goal: ${proteinGoal}g)
- Carbs consumed: ${carbs}g, Fat consumed: ${fat}g

Give 4 diverse meal suggestions (breakfast, lunch, dinner, snack) that would fit their remaining macros.
Be specific with real food names, not generic descriptions.`,
        response_json_schema: {
          type: 'object',
          properties: {
            meals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', description: 'breakfast, lunch, dinner, or snack' },
                  calories: { type: 'number' },
                  protein: { type: 'number' },
                  carbs: { type: 'number' },
                  fat: { type: 'number' },
                  serving: { type: 'string' },
                  reason: { type: 'string', description: 'one-line reason why this suits their goals' },
                }
              }
            }
          }
        }
      });
      setSuggestions(result.meals || []);
    } catch {
      setError('Could not load suggestions. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(o => {
      if (!o && suggestions.length === 0) generate();
      return !o;
    });
  };

  const typeColors = {
    breakfast: '#f59e0b',
    lunch: '#3b82f6',
    dinner: '#a855f7',
    snack: '#10b981',
  };

  return (
    <div className="mb-4">
      <button onClick={handleOpen}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(124,58,237,0.06))', border: '1px solid rgba(168,85,247,0.2)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.18)' }}>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Smart Meal Suggestions</p>
            <p className="text-[10px] text-purple-300/50">AI picks based on your goals</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-purple-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div className="pt-3 space-y-2.5">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  <p className="text-sm text-gray-500">Generating suggestions...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-4">
                  <p className="text-xs text-red-400 mb-2">{error}</p>
                  <button onClick={generate} className="text-xs text-purple-400 underline">Try again</button>
                </div>
              )}
              {suggestions.map((meal, i) => {
                const color = typeColors[meal.type?.toLowerCase()] || '#a855f7';
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl p-4 flex items-start gap-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: `${color}22`, color }}>
                          {meal.type}
                        </span>
                        <span className="text-[10px] text-gray-600">{meal.calories} kcal</span>
                      </div>
                      <p className="text-sm font-bold text-white">{meal.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{meal.serving}</p>
                      <p className="text-[10px] text-purple-300/50 mt-1 italic">{meal.reason}</p>
                      <div className="flex gap-3 mt-2">
                        {[
                          { l: 'P', v: meal.protein, c: '#ec4899' },
                          { l: 'C', v: meal.carbs,   c: '#3b82f6' },
                          { l: 'F', v: meal.fat,     c: '#f59e0b' },
                        ].map(m => (
                          <div key={m.l} className="flex items-center gap-1">
                            <span className="text-[10px] font-black" style={{ color: m.c }}>{Math.round(m.v || 0)}g</span>
                            <span className="text-[9px] text-gray-600">{m.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => onAddMeal && onAddMeal(meal)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
                      <Plus className="w-4 h-4 text-purple-400" />
                    </button>
                  </motion.div>
                );
              })}
              {suggestions.length > 0 && (
                <button onClick={generate} disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-purple-400 flex items-center justify-center gap-1.5"
                  style={{ background: 'rgba(168,85,247,0.08)' }}>
                  <Sparkles className="w-3.5 h-3.5" /> Regenerate suggestions
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}