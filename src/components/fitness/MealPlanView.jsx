import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MealPlans } from '../storage';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅', calKey: 'breakfast_calories', protKey: 'breakfast_protein', carbKey: 'breakfast_carbs', fatKey: 'breakfast_fat', color: '#f59e0b' },
  { key: 'lunch',     label: 'Lunch',     emoji: '☀️', calKey: 'lunch_calories',     protKey: 'lunch_protein',     carbKey: 'lunch_carbs',     fatKey: 'lunch_fat',     color: '#a855f7' },
  { key: 'dinner',    label: 'Dinner',    emoji: '🌙', calKey: 'dinner_calories',    protKey: 'dinner_protein',    carbKey: 'dinner_carbs',    fatKey: 'dinner_fat',    color: '#6366f1' },
  { key: 'snacks',    label: 'Snacks',    emoji: '🍎', calKey: 'snacks_calories',    protKey: 'snacks_protein',    carbKey: 'snacks_carbs',    fatKey: 'snacks_fat',    color: '#ec4899' },
];

// Goal-based meal plans with macros
const PLANS = {
  lose_weight: [
    { day_of_week: 'monday',    breakfast: 'Greek yogurt parfait with mixed berries and granola', breakfast_calories: 310, breakfast_protein: 20, breakfast_carbs: 38, breakfast_fat: 8, lunch: 'Grilled chicken salad with olive oil vinaigrette', lunch_calories: 370, lunch_protein: 35, lunch_carbs: 12, lunch_fat: 14, dinner: 'Baked salmon with roasted broccoli and sweet potato', dinner_calories: 450, dinner_protein: 38, dinner_carbs: 28, dinner_fat: 16, snacks: 'Apple with almond butter', snacks_calories: 190, snacks_protein: 4, snacks_carbs: 24, snacks_fat: 10 },
    { day_of_week: 'tuesday',   breakfast: 'Oatmeal with banana, chia seeds and cinnamon', breakfast_calories: 340, breakfast_protein: 12, breakfast_carbs: 58, breakfast_fat: 7, lunch: 'Turkey wrap with lettuce, tomato and mustard on wholegrain', lunch_calories: 380, lunch_protein: 32, lunch_carbs: 34, lunch_fat: 10, dinner: 'Stir-fried tofu with mixed vegetables and brown rice', dinner_calories: 420, dinner_protein: 22, dinner_carbs: 52, dinner_fat: 12, snacks: 'Carrot sticks with hummus', snacks_calories: 140, snacks_protein: 5, snacks_carbs: 18, snacks_fat: 6 },
    { day_of_week: 'wednesday', breakfast: 'Scrambled eggs with spinach and wholegrain toast', breakfast_calories: 320, breakfast_protein: 22, breakfast_carbs: 28, breakfast_fat: 12, lunch: 'Lentil soup with a side salad', lunch_calories: 360, lunch_protein: 18, lunch_carbs: 48, lunch_fat: 8, dinner: 'Chicken breast with quinoa and steamed green beans', dinner_calories: 460, dinner_protein: 44, dinner_carbs: 38, dinner_fat: 10, snacks: 'Mixed nuts (1 small handful)', snacks_calories: 160, snacks_protein: 5, snacks_carbs: 6, snacks_fat: 14 },
    { day_of_week: 'thursday',  breakfast: 'Green protein smoothie (spinach, banana, protein powder)', breakfast_calories: 295, breakfast_protein: 28, breakfast_carbs: 32, breakfast_fat: 5, lunch: 'Tuna salad on wholegrain with cucumber', lunch_calories: 360, lunch_protein: 34, lunch_carbs: 28, lunch_fat: 10, dinner: 'Lean beef stir-fry with cauliflower rice', dinner_calories: 420, dinner_protein: 38, dinner_carbs: 20, dinner_fat: 18, snacks: 'Boiled egg with cucumber slices', snacks_calories: 120, snacks_protein: 7, snacks_carbs: 3, snacks_fat: 7 },
    { day_of_week: 'friday',    breakfast: 'Avocado toast with poached egg on wholegrain', breakfast_calories: 380, breakfast_protein: 16, breakfast_carbs: 34, breakfast_fat: 20, lunch: 'Grilled shrimp over mixed greens with avocado', lunch_calories: 360, lunch_protein: 30, lunch_carbs: 14, lunch_fat: 20, dinner: 'Baked cod with roasted asparagus and brown rice', dinner_calories: 430, dinner_protein: 40, dinner_carbs: 38, dinner_fat: 8, snacks: 'Cottage cheese with pineapple chunks', snacks_calories: 155, snacks_protein: 18, snacks_carbs: 16, snacks_fat: 4 },
    { day_of_week: 'saturday',  breakfast: 'Veggie omelette with mushrooms, peppers and feta', breakfast_calories: 330, breakfast_protein: 24, breakfast_carbs: 8, breakfast_fat: 22, lunch: 'Chicken and vegetable minestrone soup', lunch_calories: 340, lunch_protein: 28, lunch_carbs: 30, lunch_fat: 8, dinner: 'Grilled steak with roasted root vegetables', dinner_calories: 490, dinner_protein: 44, dinner_carbs: 28, dinner_fat: 20, snacks: 'Rice cake with peanut butter', snacks_calories: 185, snacks_protein: 6, snacks_carbs: 22, snacks_fat: 9 },
    { day_of_week: 'sunday',    breakfast: 'Chia pudding with mango and coconut', breakfast_calories: 300, breakfast_protein: 10, breakfast_carbs: 44, breakfast_fat: 11, lunch: 'Roasted vegetable and feta salad with quinoa', lunch_calories: 380, lunch_protein: 16, lunch_carbs: 44, lunch_fat: 16, dinner: 'Herb-baked chicken thighs with roasted broccoli', dinner_calories: 440, dinner_protein: 42, dinner_carbs: 12, dinner_fat: 22, snacks: 'Fresh fruit salad', snacks_calories: 110, snacks_protein: 2, snacks_carbs: 28, snacks_fat: 1 },
  ],
  eat_healthy: [
    { day_of_week: 'monday',    breakfast: 'Overnight oats with chia seeds, honey and mixed berries', breakfast_calories: 400, breakfast_protein: 14, breakfast_carbs: 64, breakfast_fat: 10, lunch: 'Quinoa bowl with roasted chickpeas and tahini dressing', lunch_calories: 490, lunch_protein: 18, lunch_carbs: 60, lunch_fat: 18, dinner: 'Grilled salmon with roasted vegetables and wild rice', dinner_calories: 560, dinner_protein: 42, dinner_carbs: 44, dinner_fat: 18, snacks: 'Almonds and an orange', snacks_calories: 230, snacks_protein: 6, snacks_carbs: 22, snacks_fat: 14 },
    { day_of_week: 'tuesday',   breakfast: 'Smoothie bowl with granola and fresh fruit', breakfast_calories: 420, breakfast_protein: 12, breakfast_carbs: 72, breakfast_fat: 10, lunch: 'Mediterranean wrap with hummus and falafel', lunch_calories: 510, lunch_protein: 16, lunch_carbs: 64, lunch_fat: 20, dinner: 'Lemon herb chicken with roasted potatoes and broccoli', dinner_calories: 580, dinner_protein: 46, dinner_carbs: 44, dinner_fat: 18, snacks: 'Greek yogurt with walnuts and honey', snacks_calories: 240, snacks_protein: 12, snacks_carbs: 22, snacks_fat: 12 },
    { day_of_week: 'wednesday', breakfast: 'Wholegrain toast with avocado and smoked salmon', breakfast_calories: 430, breakfast_protein: 24, breakfast_carbs: 36, breakfast_fat: 22, lunch: 'Brown rice bowl with edamame and miso dressing', lunch_calories: 470, lunch_protein: 20, lunch_carbs: 64, lunch_fat: 14, dinner: 'Beef and vegetable stew with crusty bread', dinner_calories: 600, dinner_protein: 38, dinner_carbs: 54, dinner_fat: 22, snacks: 'Dark chocolate and raspberries', snacks_calories: 220, snacks_protein: 3, snacks_carbs: 26, snacks_fat: 13 },
    { day_of_week: 'thursday',  breakfast: 'Egg muffins with spinach and feta', breakfast_calories: 380, breakfast_protein: 24, breakfast_carbs: 12, breakfast_fat: 26, lunch: 'Black bean tacos with fresh salsa and guacamole', lunch_calories: 500, lunch_protein: 18, lunch_carbs: 60, lunch_fat: 22, dinner: 'Teriyaki salmon with bok choy and sesame noodles', dinner_calories: 570, dinner_protein: 40, dinner_carbs: 50, dinner_fat: 20, snacks: 'Apple with cheese', snacks_calories: 200, snacks_protein: 7, snacks_carbs: 22, snacks_fat: 10 },
    { day_of_week: 'friday',    breakfast: 'Buckwheat porridge with berries and seeds', breakfast_calories: 410, breakfast_protein: 14, breakfast_carbs: 60, breakfast_fat: 13, lunch: 'Greek salad with grilled chicken and pita', lunch_calories: 470, lunch_protein: 38, lunch_carbs: 32, lunch_fat: 20, dinner: 'Pork tenderloin with roasted beets and lentils', dinner_calories: 580, dinner_protein: 44, dinner_carbs: 44, dinner_fat: 18, snacks: 'Edamame (1 cup)', snacks_calories: 190, snacks_protein: 17, snacks_carbs: 14, snacks_fat: 8 },
    { day_of_week: 'saturday',  breakfast: 'Shakshuka with wholegrain pitta bread', breakfast_calories: 440, breakfast_protein: 22, breakfast_carbs: 44, breakfast_fat: 20, lunch: 'Roasted veggie and halloumi wrap', lunch_calories: 520, lunch_protein: 22, lunch_carbs: 50, lunch_fat: 26, dinner: 'Prawn and vegetable curry with basmati rice', dinner_calories: 600, dinner_protein: 36, dinner_carbs: 62, dinner_fat: 18, snacks: 'Banana protein smoothie', snacks_calories: 230, snacks_protein: 20, snacks_carbs: 30, snacks_fat: 4 },
    { day_of_week: 'sunday',    breakfast: 'French toast with maple syrup and fresh strawberries', breakfast_calories: 460, breakfast_protein: 16, breakfast_carbs: 68, breakfast_fat: 14, lunch: 'Butternut squash soup with toasted pumpkin seeds', lunch_calories: 430, lunch_protein: 12, lunch_carbs: 58, lunch_fat: 18, dinner: 'Whole roasted chicken with garlic herbs and mixed veg', dinner_calories: 620, dinner_protein: 52, dinner_carbs: 34, dinner_fat: 28, snacks: 'Hummus with pitta chips', snacks_calories: 240, snacks_protein: 9, snacks_carbs: 32, snacks_fat: 10 },
  ],
};

function getPlan(goal) {
  return PLANS[goal] || PLANS['eat_healthy'];
}

function EditableField({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);

  const save   = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) return (
    <div className="flex gap-2 items-start mt-1">
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
        className="flex-1 rounded-xl p-2.5 text-sm text-white outline-none resize-none"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
        rows={2} autoFocus />
      <div className="flex flex-col gap-1.5">
        <button onClick={save} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.2)' }}>
          <Check className="w-3.5 h-3.5 text-purple-400" />
        </button>
        <button onClick={cancel} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
  return (
    <div className="flex items-start gap-2 mt-1">
      <p className="text-sm text-white flex-1 leading-relaxed">
        {value || <span className="text-gray-600 italic">Not planned</span>}
      </p>
      <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/[0.06]">
        <Edit2 className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  );
}

export default function MealPlanView({ goals, mealPlans: initialPlans = [], onRefresh, onRedo }) {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [generating, setGenerating]   = useState(false);
  const [plans, setPlans]             = useState(initialPlans);
  const [expandedMeal, setExpandedMeal] = useState(null);

  const dayPlan  = plans.find(p => p.day_of_week === selectedDay);
  const totalCals = MEAL_CONFIG.reduce((s, m) => s + (dayPlan?.[m.calKey] || 0), 0);

  const generatePlan = () => {
    setGenerating(true);
    setTimeout(() => {
      const saved = MealPlans.replaceAll(getPlan(goals?.primary_goal));
      setPlans(saved);
      setGenerating(false);
      onRefresh?.();
    }, 1500);
  };

  const updateField = (field, value) => {
    if (!dayPlan) return;
    MealPlans.updateDay(dayPlan.id, { [field]: value });
    setPlans(MealPlans.list());
  };

  return (
    <div className="px-4 pt-2">
      <div className="flex items-start justify-between mb-5 pt-2">
        <div>
          <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Nutrition</p>
          <h1 className="text-2xl font-black text-white">Weekly Plan</h1>
        </div>
        <motion.button whileTap={{ scale: 0.93 }} onClick={generatePlan} disabled={generating}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold mt-1"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.12))', border: '1px solid rgba(168,85,247,0.3)' }}>
          {generating ? <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-purple-400" />}
          <span className="text-purple-400">{plans.length > 0 ? 'Regenerate' : 'Generate'}</span>
        </motion.button>
        {onRedo && (
          <motion.button whileTap={{ scale: 0.93 }} onClick={onRedo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold mt-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-gray-500">✏️ Redo quiz</span>
          </motion.button>
        )
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar -mx-4 px-4">
        {DAYS.map((day, i) => {
          const isActive = selectedDay === day;
          const hasPlan  = plans.some(p => p.day_of_week === day);
          return (
            <motion.button key={day} whileTap={{ scale: 0.92 }} onClick={() => setSelectedDay(day)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0 transition-all duration-200"
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
          <p className="text-sm font-semibold text-white">Building your plan...</p>
          <p className="text-xs text-purple-300/40 mt-1">Tailoring meals to your goals</p>
        </div>
      ) : dayPlan ? (
        <AnimatePresence mode="wait">
          <motion.div key={selectedDay}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {/* Daily summary */}
            <div className="glass-card-purple rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] text-purple-300/50 uppercase tracking-widest">Total for {selectedDay}</p>
                  <p className="text-2xl font-black text-white mt-0.5">{totalCals.toLocaleString()} kcal</p>
                </div>
                <div className="text-3xl">📋</div>
              </div>
              <div className="flex gap-3">
                {[
                  { label: 'P', total: MEAL_CONFIG.reduce((s,m)=>s+(dayPlan?.[m.protKey]||0),0), color: '#ec4899' },
                  { label: 'C', total: MEAL_CONFIG.reduce((s,m)=>s+(dayPlan?.[m.carbKey]||0),0), color: '#3b82f6' },
                  { label: 'F', total: MEAL_CONFIG.reduce((s,m)=>s+(dayPlan?.[m.fatKey]||0),0),  color: '#f59e0b' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-1">
                    <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.label}:</span>
                    <span className="text-[11px] text-white font-semibold">{Math.round(m.total)}g</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {MEAL_CONFIG.map((meal, i) => (
                <motion.div key={meal.key}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setExpandedMeal(expandedMeal === meal.key ? null : meal.key)}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{meal.emoji}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{meal.label}</p>
                        <p className="text-[11px] font-bold mt-0.5" style={{ color: meal.color }}>{dayPlan[meal.calKey] || 0} kcal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2 text-right">
                        {['P','C','F'].map((l, li) => {
                          const keys = [meal.protKey, meal.carbKey, meal.fatKey];
                          const colors = ['#ec4899','#3b82f6','#f59e0b'];
                          return (
                            <span key={l} className="text-[10px] font-semibold" style={{ color: colors[li] }}>
                              {l}:{Math.round(dayPlan?.[keys[li]] || 0)}g
                            </span>
                          );
                        })}
                      </div>
                      {expandedMeal === meal.key
                        ? <ChevronUp className="w-4 h-4 text-gray-600" />
                        : <ChevronDown className="w-4 h-4 text-gray-600" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedMeal === meal.key && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="px-4 pb-4 pt-3">
                          <EditableField value={dayPlan[meal.key]} onChange={(v) => updateField(meal.key, v)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-14">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-bold text-white mb-2">No plan for {selectedDay}</h3>
          <p className="text-sm text-gray-500 mb-6">Generate your personalized weekly meal plan</p>
          <button onClick={generatePlan} className="btn-primary max-w-xs mx-auto">Generate My Plan</button>
        </motion.div>
      )}
    </div>
  );
}