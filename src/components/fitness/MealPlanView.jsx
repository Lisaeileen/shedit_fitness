import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Edit2, Check, X } from 'lucide-react';
import { MealPlans } from '../storage';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅', calKey: 'breakfast_calories', color: '#f59e0b' },
  { key: 'lunch',     label: 'Lunch',     emoji: '☀️', calKey: 'lunch_calories',     color: '#10b981' },
  { key: 'dinner',    label: 'Dinner',    emoji: '🌙', calKey: 'dinner_calories',     color: '#6366f1' },
  { key: 'snacks',    label: 'Snacks',    emoji: '🍎', calKey: 'snacks_calories',     color: '#ec4899' },
];

// Pre-built 7-day meal plans (no external API required)
const SAMPLE_PLANS = {
  lose_weight: [
    { day_of_week: 'monday',    breakfast: 'Greek yogurt with berries and chia seeds (300 kcal)', breakfast_calories: 300, lunch: 'Grilled chicken salad with olive oil and lemon (350 kcal)', lunch_calories: 350, dinner: 'Baked salmon with roasted broccoli and sweet potato (450 kcal)', dinner_calories: 450, snacks: 'Apple with almond butter (200 kcal)', snacks_calories: 200 },
    { day_of_week: 'tuesday',   breakfast: 'Oatmeal with banana and cinnamon (350 kcal)', breakfast_calories: 350, lunch: 'Turkey wrap with lettuce, tomato and mustard (380 kcal)', lunch_calories: 380, dinner: 'Stir-fried tofu with mixed vegetables and brown rice (420 kcal)', dinner_calories: 420, snacks: 'Carrot sticks with hummus (150 kcal)', snacks_calories: 150 },
    { day_of_week: 'wednesday', breakfast: 'Scrambled eggs with spinach and whole grain toast (320 kcal)', breakfast_calories: 320, lunch: 'Lentil soup with a side salad (360 kcal)', lunch_calories: 360, dinner: 'Grilled chicken breast with quinoa and green beans (480 kcal)', dinner_calories: 480, snacks: 'Mixed nuts (180 kcal)', snacks_calories: 180 },
    { day_of_week: 'thursday',  breakfast: 'Smoothie with spinach, protein powder, banana and almond milk (300 kcal)', breakfast_calories: 300, lunch: 'Tuna salad on whole grain bread (370 kcal)', lunch_calories: 370, dinner: 'Beef and vegetable stir-fry with cauliflower rice (430 kcal)', dinner_calories: 430, snacks: 'Boiled egg and cucumber slices (120 kcal)', snacks_calories: 120 },
    { day_of_week: 'friday',    breakfast: 'Whole grain pancakes with fresh strawberries (340 kcal)', breakfast_calories: 340, lunch: 'Grilled shrimp over mixed greens with avocado (360 kcal)', lunch_calories: 360, dinner: 'Baked cod with roasted asparagus and brown rice (440 kcal)', dinner_calories: 440, snacks: 'Cottage cheese with pineapple (160 kcal)', snacks_calories: 160 },
    { day_of_week: 'saturday',  breakfast: 'Avocado toast with poached eggs (380 kcal)', breakfast_calories: 380, lunch: 'Vegetable minestrone soup with whole grain roll (390 kcal)', lunch_calories: 390, dinner: 'Grilled lean steak with sweet potato and salad (500 kcal)', dinner_calories: 500, snacks: 'Rice cake with peanut butter (200 kcal)', snacks_calories: 200 },
    { day_of_week: 'sunday',    breakfast: 'Veggie omelette with mushrooms and peppers (310 kcal)', breakfast_calories: 310, lunch: 'Chicken and vegetable soup (340 kcal)', lunch_calories: 340, dinner: 'Baked chicken thighs with roasted root vegetables (460 kcal)', dinner_calories: 460, snacks: 'Fresh fruit salad (130 kcal)', snacks_calories: 130 },
  ],
  eat_healthy: [
    { day_of_week: 'monday',    breakfast: 'Overnight oats with chia seeds, honey and mixed berries (400 kcal)', breakfast_calories: 400, lunch: 'Quinoa bowl with roasted chickpeas and tahini dressing (480 kcal)', lunch_calories: 480, dinner: 'Grilled salmon with roasted vegetables and wild rice (550 kcal)', dinner_calories: 550, snacks: 'Handful of almonds and an orange (250 kcal)', snacks_calories: 250 },
    { day_of_week: 'tuesday',   breakfast: 'Green smoothie bowl with granola (420 kcal)', breakfast_calories: 420, lunch: 'Mediterranean wrap with hummus and falafel (500 kcal)', lunch_calories: 500, dinner: 'Lemon herb chicken with roasted potatoes and broccoli (580 kcal)', dinner_calories: 580, snacks: 'Celery with almond butter (200 kcal)', snacks_calories: 200 },
    { day_of_week: 'wednesday', breakfast: 'Whole grain toast with avocado and smoked salmon (430 kcal)', breakfast_calories: 430, lunch: 'Brown rice sushi bowl with edamame (460 kcal)', lunch_calories: 460, dinner: 'Beef and vegetable stew with crusty bread (600 kcal)', dinner_calories: 600, snacks: 'Greek yogurt with walnuts (230 kcal)', snacks_calories: 230 },
    { day_of_week: 'thursday',  breakfast: 'Egg muffins with spinach and feta (380 kcal)', breakfast_calories: 380, lunch: 'Black bean tacos with fresh salsa (490 kcal)', lunch_calories: 490, dinner: 'Teriyaki salmon with bok choy and sesame noodles (560 kcal)', dinner_calories: 560, snacks: 'Apple with cheese (210 kcal)', snacks_calories: 210 },
    { day_of_week: 'friday',    breakfast: 'Buckwheat porridge with berries and seeds (410 kcal)', breakfast_calories: 410, lunch: 'Greek salad with grilled chicken (450 kcal)', lunch_calories: 450, dinner: 'Pork tenderloin with roasted beets and lentils (570 kcal)', dinner_calories: 570, snacks: 'Edamame (180 kcal)', snacks_calories: 180 },
    { day_of_week: 'saturday',  breakfast: 'French toast with maple syrup and fresh fruit (460 kcal)', breakfast_calories: 460, lunch: 'Roasted veggie and halloumi wrap (510 kcal)', lunch_calories: 510, dinner: 'Prawn and vegetable curry with basmati rice (590 kcal)', dinner_calories: 590, snacks: 'Dark chocolate and raspberries (240 kcal)', snacks_calories: 240 },
    { day_of_week: 'sunday',    breakfast: 'Shakshuka with whole grain bread (440 kcal)', breakfast_calories: 440, lunch: 'Roasted butternut squash soup with toasted pumpkin seeds (430 kcal)', lunch_calories: 430, dinner: 'Whole roasted chicken with garlic herbs and mixed vegetables (620 kcal)', dinner_calories: 620, snacks: 'Banana smoothie (220 kcal)', snacks_calories: 220 },
  ],
};

function getPlan(goal) {
  return SAMPLE_PLANS[goal] || SAMPLE_PLANS['eat_healthy'];
}

function EditableField({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <div className="flex gap-2 items-start mt-1">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
          className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-xl p-2.5 text-sm text-white outline-none resize-none"
          rows={2} autoFocus />
        <div className="flex flex-col gap-1.5">
          <button onClick={save} className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-green-400" />
          </button>
          <button onClick={cancel} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 mt-1">
      <p className="text-sm text-white flex-1 leading-relaxed">
        {value || <span className="text-gray-600 italic">Not planned</span>}
      </p>
      <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/[0.06] flex-shrink-0">
        <Edit2 className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  );
}

export default function MealPlanView({ goals, mealPlans: initialPlans = [], onRefresh }) {
  const [selectedDay, setSelectedDay] = useState(
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  );
  const [generating, setGenerating] = useState(false);
  const [plans, setPlans] = useState(initialPlans);

  const dayPlan = plans.find(p => p.day_of_week === selectedDay);

  const generatePlan = () => {
    setGenerating(true);
    setTimeout(() => {
      const template = getPlan(goals?.primary_goal);
      const saved = MealPlans.replaceAll(template);
      setPlans(saved);
      setGenerating(false);
      onRefresh?.();
    }, 1200);
  };

  const updateMealField = (field, value) => {
    if (!dayPlan) return;
    MealPlans.updateDay(dayPlan.id, { [field]: value });
    setPlans(MealPlans.list());
  };

  const totalCals = MEAL_CONFIG.reduce((sum, m) => sum + (dayPlan?.[m.calKey] || 0), 0);

  return (
    <div className="px-4 pt-2">
      <div className="flex items-start justify-between mb-5 pt-2">
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Nutrition</p>
          <h1 className="text-2xl font-black text-white">Weekly Plan</h1>
        </div>
        <motion.button whileTap={{ scale: 0.93 }} onClick={generatePlan} disabled={generating}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold mt-1"
          style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(74,222,128,0.25)' }}>
          {generating
            ? <Loader2 className="w-3.5 h-3.5 text-green-400 animate-spin" />
            : <RefreshCw className="w-3.5 h-3.5 text-green-400" />
          }
          <span className="text-green-400">{plans.length > 0 ? 'Regenerate' : 'Generate'}</span>
        </motion.button>
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar -mx-4 px-4">
        {DAYS.map((day, i) => {
          const isActive = selectedDay === day;
          const hasPlan = plans.some(p => p.day_of_week === day);
          return (
            <motion.button key={day} whileTap={{ scale: 0.92 }} onClick={() => setSelectedDay(day)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0 transition-all duration-200"
              style={isActive
                ? { background: 'linear-gradient(135deg, #4ade80, #a855f7)', color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }
              }>
              <span className="text-xs font-bold">{DAY_SHORT[i]}</span>
              {hasPlan && !isActive && <div className="w-1 h-1 rounded-full bg-green-400/50" />}
            </motion.button>
          );
        })}
      </div>

      {generating ? (
        <div className="flex flex-col items-center py-16">
          <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-white">Building your plan...</p>
          <p className="text-xs text-gray-500 mt-1">Tailoring meals to your goal</p>
        </div>
      ) : dayPlan ? (
        <AnimatePresence mode="wait">
          <motion.div key={selectedDay}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            <div className="glass-card-green rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total for {selectedDay}</p>
                <p className="text-2xl font-black text-white mt-0.5">{totalCals.toLocaleString()} kcal</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
            <div className="space-y-3">
              {MEAL_CONFIG.map((meal, i) => (
                <motion.div key={meal.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{meal.emoji}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{meal.label}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: meal.color }}>{dayPlan[meal.calKey] || 0} kcal</span>
                  </div>
                  <EditableField value={dayPlan[meal.key]} onChange={(v) => updateMealField(meal.key, v)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-14">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-bold text-white mb-2">No plan yet</h3>
          <p className="text-sm text-gray-500 mb-6">Generate a personalized weekly meal plan</p>
          <button onClick={generatePlan} className="btn-primary max-w-xs mx-auto">Generate Weekly Plan</button>
        </motion.div>
      )}
    </div>
  );
}