import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Star, Plus, X } from 'lucide-react';

// ─── Step definitions ────────────────────────────────────────────────────────

const DIET_STYLES = [
  { value: 'balanced',      label: 'Balanced Diet',        emoji: '⚖️',  desc: 'Well-rounded nutrients' },
  { value: 'high_protein',  label: 'High Protein',         emoji: '💪',  desc: 'Lean meats & legumes' },
  { value: 'low_carb',      label: 'Low Carb',             emoji: '🥩',  desc: 'Fewer grains & sugars' },
  { value: 'keto',          label: 'Keto',                 emoji: '🥑',  desc: 'High fat, very low carb' },
  { value: 'whole_food',    label: 'Whole Food Focus',     emoji: '🥦',  desc: 'Minimally processed' },
  { value: 'mediterranean', label: 'Mediterranean',        emoji: '🫒',  desc: 'Olive oil, fish & veg' },
  { value: 'vegetarian',    label: 'Vegetarian',           emoji: '🌿',  desc: 'No meat' },
  { value: 'vegan',         label: 'Vegan',                emoji: '🌱',  desc: 'Fully plant-based' },
  { value: 'pescatarian',   label: 'Pescatarian',          emoji: '🐟',  desc: 'Fish & plants' },
  { value: 'italian',       label: 'Italian-style',        emoji: '🍝',  desc: 'Pasta, herbs & olive oil' },
  { value: 'asian',         label: 'Asian-style',          emoji: '🍜',  desc: 'Rice, noodles & umami' },
  { value: 'high_fiber',    label: 'High Fiber',           emoji: '🌾',  desc: 'Grains, beans & veg' },
  { value: 'plant_focused', label: 'Plant-focused',        emoji: '🥗',  desc: 'Mostly plants, some animal' },
];

const DISLIKED_FOODS = [
  'Beef','Beans','Bell peppers','Broccoli','Brussels sprouts','Cilantro',
  'Eggplant','Eggs','Fish','Chicken','Mushrooms','Onions','Garlic',
  'Spinach','Tofu','Pork',
];

const CUISINES = [
  { value: 'italian',       label: 'Italian',       emoji: '🇮🇹' },
  { value: 'american',      label: 'American',      emoji: '🇺🇸' },
  { value: 'mexican',       label: 'Mexican',       emoji: '🇲🇽' },
  { value: 'chinese',       label: 'Chinese',       emoji: '🇨🇳' },
  { value: 'japanese',      label: 'Japanese',      emoji: '🇯🇵' },
  { value: 'thai',          label: 'Thai',          emoji: '🇹🇭' },
  { value: 'indian',        label: 'Indian',        emoji: '🇮🇳' },
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { value: 'greek',         label: 'Greek',         emoji: '🇬🇷' },
  { value: 'middle_eastern',label: 'Middle Eastern',emoji: '🧆' },
  { value: 'korean',        label: 'Korean',        emoji: '🇰🇷' },
  { value: 'vietnamese',    label: 'Vietnamese',    emoji: '🇻🇳' },
  { value: 'french',        label: 'French',        emoji: '🇫🇷' },
  { value: 'spanish',       label: 'Spanish',       emoji: '🇪🇸' },
  { value: 'nigerian',      label: 'Nigerian',      emoji: '🇳🇬' },
  { value: 'caribbean',     label: 'Caribbean',     emoji: '🌴' },
  { value: 'ethiopian',     label: 'Ethiopian',     emoji: '🇪🇹' },
  { value: 'brazilian',     label: 'Brazilian',     emoji: '🇧🇷' },
];

const COOKED_VEGS = [
  { value: 'sauteed_spinach',       label: 'Sautéed Spinach',         emoji: '🍃' },
  { value: 'sauteed_zucchini',      label: 'Sautéed Zucchini',        emoji: '🥒' },
  { value: 'roasted_eggplant',      label: 'Roasted Eggplant',        emoji: '🍆' },
  { value: 'cooked_broccoli',       label: 'Cooked Broccoli',         emoji: '🥦' },
  { value: 'sauteed_carrots',       label: 'Sautéed Carrots',         emoji: '🥕' },
  { value: 'sauteed_cauliflower',   label: 'Sautéed Cauliflower',     emoji: '🌸' },
  { value: 'roasted_sweet_potato',  label: 'Roasted Sweet Potatoes',  emoji: '🍠' },
  { value: 'grilled_asparagus',     label: 'Grilled Asparagus',       emoji: '🌿' },
  { value: 'roasted_brussels',      label: 'Roasted Brussels Sprouts',emoji: '🫛' },
];

const RAW_VEGS = [
  { value: 'bell_pepper',     label: 'Bell Pepper Strips',  emoji: '🫑' },
  { value: 'baby_carrots',    label: 'Baby Carrots',        emoji: '🥕' },
  { value: 'cherry_tomatoes', label: 'Cherry Tomatoes',     emoji: '🍅' },
  { value: 'cucumber',        label: 'Cucumber Slices',     emoji: '🥒' },
  { value: 'celery',          label: 'Celery Sticks',       emoji: '🌿' },
  { value: 'snap_peas',       label: 'Snap Peas',           emoji: '🫛' },
  { value: 'radishes',        label: 'Radishes',            emoji: '🌸' },
  { value: 'avocado',         label: 'Avocado Slices',      emoji: '🥑' },
  { value: 'lettuce',         label: 'Lettuce',             emoji: '🥬' },
];

const FRUITS = [
  { value: 'apple',       label: 'Apple',        emoji: '🍎' },
  { value: 'blueberries', label: 'Blueberries',  emoji: '🫐' },
  { value: 'grapes',      label: 'Grapes',       emoji: '🍇' },
  { value: 'orange',      label: 'Oranges',      emoji: '🍊' },
  { value: 'banana',      label: 'Banana',       emoji: '🍌' },
  { value: 'peach',       label: 'Peach',        emoji: '🍑' },
  { value: 'strawberry',  label: 'Strawberries', emoji: '🍓' },
  { value: 'mango',       label: 'Mango',        emoji: '🥭' },
  { value: 'pineapple',   label: 'Pineapple',    emoji: '🍍' },
  { value: 'kiwi',        label: 'Kiwi',         emoji: '🥝' },
  { value: 'watermelon',  label: 'Watermelon',   emoji: '🍉' },
  { value: 'papaya',      label: 'Papaya',       emoji: '🍈' },
];

const RECIPES = [
  { value: 'avocado_chicken_salad', label: 'Avocado Chicken Salad',  emoji: '🥗' },
  { value: 'chicken_avocado_wrap',  label: 'Chicken Avocado Wrap',   emoji: '🌯' },
  { value: 'baked_beef_nachos',     label: 'Baked Beef Nachos',      emoji: '🌮' },
  { value: 'chicken_alfredo',       label: 'Quick Chicken Alfredo',  emoji: '🍝' },
  { value: 'spring_veggie_pasta',   label: 'Spring Veggie Pasta',    emoji: '🍃' },
  { value: 'jollof_rice',           label: 'Jollof Rice',            emoji: '🍚' },
  { value: 'southwest_wrap',        label: 'Southwest Breakfast Wrap',emoji: '🌯' },
  { value: 'grilled_salmon_bowl',   label: 'Grilled Salmon Bowl',    emoji: '🐟' },
  { value: 'turkey_lettuce_wraps',  label: 'Turkey Lettuce Wraps',   emoji: '🥬' },
];

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch',     label: 'Lunch',     emoji: '☀️' },
  { value: 'dinner',    label: 'Dinner',    emoji: '🌙' },
  { value: 'snacks',    label: 'Snacks',    emoji: '🍎' },
];

const PRIORITIES = [
  { key: 'budget',       label: 'Budget-friendly meals' },
  { key: 'weight_loss',  label: 'Weight loss' },
  { key: 'easy',         label: 'Easy recipes' },
  { key: 'quick',        label: 'Quick recipes' },
  { key: 'variety',      label: 'Recipe variety' },
  { key: 'delicious',    label: 'Delicious meals' },
  { key: 'high_protein', label: 'High protein focus' },
  { key: 'healthy',      label: 'Healthy ingredients' },
];

const TOTAL_STEPS = 13;

// ─── Sub-components ──────────────────────────────────────────────────────────

function ChipGrid({ items, selected, onToggle, cols = 3 }) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map((item) => {
        const val = typeof item === 'string' ? item : item.value;
        const label = typeof item === 'string' ? item : item.label;
        const emoji = typeof item === 'string' ? null : item.emoji;
        const sel = Array.isArray(selected) ? selected.includes(val) : selected === val;
        return (
          <motion.button key={val} whileTap={{ scale: 0.95 }} onClick={() => onToggle(val)}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl text-center transition-all duration-200"
            style={{
              background: sel ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.03)',
              border: sel ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.07)',
            }}>
            {emoji && <span className="text-2xl">{emoji}</span>}
            <span className="text-[11px] font-semibold text-white leading-tight">{label}</span>
            {sel && <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: '#a855f7' }}>
              <Check className="w-2 h-2 text-white" strokeWidth={3} />
            </div>}
          </motion.button>
        );
      })}
    </div>
  );
}

function CuisineRow({ cuisine, pref, onSet }) {
  const opts = ['Love', 'Neutral', 'Avoid'];
  const colors = { Love: '#10b981', Neutral: '#6b7280', Avoid: '#f43f5e' };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <span className="text-lg flex-shrink-0">{cuisine.emoji}</span>
      <span className="text-sm text-white font-medium flex-1">{cuisine.label}</span>
      <div className="flex gap-1.5">
        {opts.map(o => (
          <button key={o} onClick={() => onSet(cuisine.value, o)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
            style={pref === o
              ? { background: `${colors[o]}25`, color: colors[o], border: `1px solid ${colors[o]}50` }
              : { background: 'rgba(255,255,255,0.04)', color: '#4b5563', border: '1px solid transparent' }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={() => onChange(s)}>
          <Star className="w-5 h-5 transition-colors"
            style={{ color: s <= value ? '#f59e0b' : '#374151', fill: s <= value ? '#f59e0b' : 'none' }} />
        </button>
      ))}
    </div>
  );
}

function PrioritySlider({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-white font-medium">{label}</span>
        <span className="text-xs font-bold" style={{ color: '#a855f7' }}>{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #a855f7 ${value}%, rgba(255,255,255,0.1) ${value}%)`, accentColor: '#a855f7' }} />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    change_level: null,
    diet_styles: [],
    high_protein_experience: null,
    disliked_foods: [],
    custom_disliked: '',
    cuisine_prefs: {},
    cooked_vegs: [],
    raw_vegs: [],
    fruits: [],
    recipe_ratings: {},
    user_name: '',
    servings: null,
    meal_types: [],
    priorities: { budget: 50, weight_loss: 50, easy: 50, quick: 50, variety: 50, delicious: 50, high_protein: 50, healthy: 50 },
  });
  const scrollRef = useRef(null);

  const set = (field, value) => setAnswers(a => ({ ...a, [field]: value }));

  const toggleArr = (field, val) => {
    const arr = answers[field] || [];
    set(field, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const canContinue = () => {
    if (step === 0) return !!answers.change_level;
    if (step === 1) return answers.diet_styles.length > 0;
    if (step === 2) return !answers.diet_styles.includes('high_protein') || !!answers.high_protein_experience;
    if (step === 9) return answers.user_name.trim().length > 0;
    if (step === 10) return !!answers.servings;
    if (step === 11) return answers.meal_types.length > 0;
    return true;
  };

  const next = () => {
    if (step === 1 && !answers.diet_styles.includes('high_protein')) {
      // skip high protein step
      setStep(3); scrollRef.current?.scrollTo(0, 0); return;
    }
    if (step < TOTAL_STEPS - 1) { setStep(s => s + 1); scrollRef.current?.scrollTo(0, 0); }
    else {
      onComplete({ ...answers, onboarding_complete: true });
    }
  };

  const back = () => {
    if (step === 3 && !answers.diet_styles.includes('high_protein')) { setStep(1); return; }
    if (step > 0) setStep(s => s - 1);
  };

  const showHighProtein = answers.diet_styles.includes('high_protein');
  // Adjust displayed step count — if no high protein selected, step 3 is hidden
  const displayStep = step + 1;

  const CHANGE_OPTS = [
    { value: 'small',     label: 'Small changes',           emoji: '🌱' },
    { value: 'moderate',  label: 'Moderate changes',        emoji: '📈' },
    { value: 'major',     label: 'Major lifestyle change',  emoji: '💪' },
    { value: 'commit',    label: "I'm ready to fully commit", emoji: '🚀' },
  ];

  const SERVINGS = ['1 person','2 people','3 people','4 people','5+ people'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #12062A 0%, #2A0A4A 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <div className="mb-4">
          <h1 className="text-2xl font-black gradient-text">Shedit</h1>
          <p className="text-[10px] text-purple-400/50">Walk it off. Climb it up. Shed it.</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.07]">
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
              animate={{ width: `${(displayStep / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[10px] text-purple-400/60 font-semibold flex-shrink-0">
            {displayStep} / {TOTAL_STEPS}
          </span>
        </div>

        {step > 0 && (
          <motion.button whileTap={{ scale: 0.92 }} onClick={back}
            className="flex items-center gap-1 text-sm text-purple-400/60 mb-2 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back
          </motion.button>
        )}
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-32 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.22 }}>

            {/* ── Step 0: Change level ── */}
            {step === 0 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">How much change are you ready to make?</h2>
                <p className="text-sm text-purple-300/50 mb-5">We'll build your plan around this</p>
                <div className="space-y-2.5">
                  {CHANGE_OPTS.map(opt => {
                    const sel = answers.change_level === opt.value;
                    return (
                      <motion.button key={opt.value} whileTap={{ scale: 0.97 }}
                        onClick={() => { set('change_level', opt.value); setTimeout(next, 200); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                          border: sel ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        }}>
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-sm font-semibold text-white flex-1">{opt.label}</span>
                        {sel && <Check className="w-4 h-4 text-purple-400" />}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 1: Diet style ── */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Which diet style do you prefer?</h2>
                <p className="text-sm text-purple-300/50 mb-5">Select one or more</p>
                <ChipGrid items={DIET_STYLES} selected={answers.diet_styles}
                  onToggle={v => toggleArr('diet_styles', v)} cols={2} />
              </>
            )}

            {/* ── Step 2: High protein info (conditional) ── */}
            {step === 2 && showHighProtein && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">High Protein Diet</h2>
                <p className="text-sm text-purple-300/50 mb-4">Here's what to expect</p>
                <div className="rounded-2xl p-4 mb-5 space-y-2"
                  style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  {['💪 Lean meats (chicken, turkey, beef)', '🥚 Eggs & egg whites', '🫙 Greek yogurt & cottage cheese',
                    '🐟 Fish & seafood', '🫘 Beans & legumes', '🥛 Protein-rich snacks & shakes'].map(t => (
                    <p key={t} className="text-sm text-gray-300">{t}</p>
                  ))}
                </div>
                <h3 className="text-base font-bold text-white mb-3">Have you tried a high protein diet before?</h3>
                <div className="space-y-2.5">
                  {[
                    { value: 'not_yet',    label: 'Not yet',               emoji: '🤔' },
                    { value: 'tried',      label: 'Tried before',          emoji: '👍' },
                    { value: 'following',  label: 'Currently following it', emoji: '🔥' },
                  ].map(opt => {
                    const sel = answers.high_protein_experience === opt.value;
                    return (
                      <motion.button key={opt.value} whileTap={{ scale: 0.97 }}
                        onClick={() => { set('high_protein_experience', opt.value); setTimeout(next, 200); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                          border: sel ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        }}>
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-sm font-semibold text-white flex-1">{opt.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 3: Disliked foods ── */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Foods to avoid?</h2>
                <p className="text-sm text-purple-300/50 mb-4">Select all you dislike or want to skip</p>
                <ChipGrid items={DISLIKED_FOODS} selected={answers.disliked_foods}
                  onToggle={v => toggleArr('disliked_foods', v)} cols={3} />
                {/* Custom input */}
                <div className="mt-4 flex gap-2">
                  <input className="input-dark flex-1 text-sm py-2.5"
                    placeholder="Add custom food…" value={answers.custom_disliked}
                    onChange={e => set('custom_disliked', e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && answers.custom_disliked.trim()) {
                        toggleArr('disliked_foods', answers.custom_disliked.trim());
                        set('custom_disliked', '');
                      }
                    }} />
                  <button onClick={() => {
                    if (answers.custom_disliked.trim()) {
                      toggleArr('disliked_foods', answers.custom_disliked.trim());
                      set('custom_disliked', '');
                    }
                  }} className="px-3 py-2 rounded-xl" style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}>
                    <Plus className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
                {answers.disliked_foods.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {answers.disliked_foods.map(f => (
                      <div key={f} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', color: '#f87171' }}>
                        {f}
                        <button onClick={() => toggleArr('disliked_foods', f)}><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Step 4: Cuisines ── */}
            {step === 4 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Favourite cuisines?</h2>
                <p className="text-sm text-purple-300/50 mb-4">Mark your preferences</p>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {CUISINES.map(c => (
                    <CuisineRow key={c.value} cuisine={c}
                      pref={answers.cuisine_prefs[c.value]}
                      onSet={(val, pref) => set('cuisine_prefs', { ...answers.cuisine_prefs, [val]: pref })} />
                  ))}
                </div>
              </>
            )}

            {/* ── Step 5: Cooked vegs ── */}
            {step === 5 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Cooked vegetables you enjoy?</h2>
                <p className="text-sm text-purple-300/50 mb-4">Select all you'd like in your plan</p>
                <ChipGrid items={COOKED_VEGS} selected={answers.cooked_vegs}
                  onToggle={v => toggleArr('cooked_vegs', v)} cols={3} />
              </>
            )}

            {/* ── Step 6: Raw vegs ── */}
            {step === 6 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Raw vegetables you enjoy?</h2>
                <p className="text-sm text-purple-300/50 mb-4">Great for snacks and salads</p>
                <ChipGrid items={RAW_VEGS} selected={answers.raw_vegs}
                  onToggle={v => toggleArr('raw_vegs', v)} cols={3} />
              </>
            )}

            {/* ── Step 7: Fruits ── */}
            {step === 7 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Fruits you love?</h2>
                <p className="text-sm text-purple-300/50 mb-4">We'll include these in snacks & breakfasts</p>
                <ChipGrid items={FRUITS} selected={answers.fruits}
                  onToggle={v => toggleArr('fruits', v)} cols={3} />
              </>
            )}

            {/* ── Step 8: Rate recipes ── */}
            {step === 8 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Rate these recipes</h2>
                <p className="text-sm text-purple-300/50 mb-4">Helps us personalize your plan</p>
                <div className="space-y-3">
                  {RECIPES.map(r => (
                    <div key={r.value} className="flex items-center justify-between p-4 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{r.emoji}</span>
                        <span className="text-sm font-semibold text-white">{r.label}</span>
                      </div>
                      <StarRating value={answers.recipe_ratings[r.value] || 0}
                        onChange={v => set('recipe_ratings', { ...answers.recipe_ratings, [r.value]: v })} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 9: Name ── */}
            {step === 9 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">What should we call you?</h2>
                <p className="text-sm text-purple-300/50 mb-5">We'll personalize your plan with your name</p>
                <input className="input-dark text-xl font-bold text-center"
                  placeholder="Your name…" value={answers.user_name}
                  onChange={e => set('user_name', e.target.value)}
                  style={{ fontSize: '1.25rem' }} />
              </>
            )}

            {/* ── Step 10: Servings ── */}
            {step === 10 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">How many people?</h2>
                <p className="text-sm text-purple-300/50 mb-5">How many will this meal plan serve?</p>
                <div className="space-y-2.5">
                  {SERVINGS.map(s => {
                    const sel = answers.servings === s;
                    return (
                      <motion.button key={s} whileTap={{ scale: 0.97 }}
                        onClick={() => { set('servings', s); setTimeout(next, 200); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                          border: sel ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        }}>
                        <span className="text-2xl">{['👤','👥','👨‍👩‍👦','👨‍👩‍👧‍👦','🏡'][SERVINGS.indexOf(s)]}</span>
                        <span className="text-sm font-semibold text-white flex-1">{s}</span>
                        {sel && <Check className="w-4 h-4 text-purple-400" />}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 11: Meal types ── */}
            {step === 11 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Which meals to include?</h2>
                <p className="text-sm text-purple-300/50 mb-5">Select all that apply</p>
                <div className="space-y-2.5">
                  {MEAL_TYPES.map(m => {
                    const sel = answers.meal_types.includes(m.value);
                    return (
                      <motion.button key={m.value} whileTap={{ scale: 0.97 }}
                        onClick={() => toggleArr('meal_types', m.value)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                          border: sel ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        }}>
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-sm font-semibold text-white flex-1">{m.label}</span>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: sel ? '#a855f7' : 'rgba(255,255,255,0.08)', border: sel ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
                          {sel && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 12: Priorities ── */}
            {step === 12 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1">Meal plan priorities</h2>
                <p className="text-sm text-purple-300/50 mb-5">Slide to set importance (0–100)</p>
                {PRIORITIES.map(p => (
                  <PrioritySlider key={p.key} label={p.label} value={answers.priorities[p.key]}
                    onChange={v => set('priorities', { ...answers.priorities, [p.key]: v })} />
                ))}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky footer button — hidden on auto-advance steps */}
      {![0, 2, 10].includes(step) && !(step === 2 && !showHighProtein) && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 max-w-md mx-auto"
          style={{ background: 'linear-gradient(to top, #12062A 60%, transparent)' }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={next} disabled={!canContinue()}
            className="btn-primary">
            {step < TOTAL_STEPS - 1 ? 'Continue →' : '✨ Build My Plan'}
          </motion.button>
        </div>
      )}
    </div>
  );
}