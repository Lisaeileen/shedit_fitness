import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, ThumbsUp, ThumbsDown, Heart, Plus, X, Search } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const DIET_STYLES = [
  { value: 'balanced',             label: 'Balanced',              desc: 'Flexible, thoughtful portions',        img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80' },
  { value: 'high_protein',        label: 'High Protein',           desc: 'Protein-first, satisfying meals',      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
  { value: 'low_carb',            label: 'Low Carb',               desc: 'Fewer carbs, less sugar',              img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { value: 'keto',                label: 'Keto',                   desc: 'Very low carb, higher fat',            img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80' },
  { value: 'mediterranean',       label: 'Mediterranean',          desc: 'Plant-forward, healthy fats',          img: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80' },
  { value: 'whole_food',          label: 'Whole-Food Focus',       desc: 'Whole, unprocessed foods',             img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80' },
  { value: 'vegetarian',          label: 'Vegetarian',             desc: 'No meat, plant-rich',                  img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80' },
  { value: 'vegan',               label: 'Vegan',                  desc: 'Fully plant-based',                    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { value: 'pescatarian',         label: 'Pescatarian',            desc: 'Fish & plants only',                   img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80' },
  { value: 'gluten_free',         label: 'Gluten Free',            desc: 'No wheat, barley or rye',              img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80' },
  { value: 'dairy_free',          label: 'Dairy Free',             desc: 'No milk, cheese or yogurt',            img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' },
  { value: 'paleo',               label: 'Paleo',                  desc: 'Meat, fish, nuts & veggies',           img: 'https://images.unsplash.com/photo-1544025162-d76538b2a681?w=400&q=80' },
  { value: 'high_fiber',          label: 'High Fiber',             desc: 'Grains, beans & vegetables',           img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { value: 'low_sugar',           label: 'Low Sugar',              desc: 'Minimize added sugars',                img: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=400&q=80' },
  { value: 'intermittent_fasting',label: 'Intermittent Fasting',   desc: '16:8 or 5:2 eating windows',           img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' },
  { value: 'plant_based',         label: 'Plant-Based',            desc: 'Mostly plants, minimal animal',        img: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=400&q=80' },
  { value: 'anti_inflammatory',   label: 'Anti-Inflammatory',      desc: 'Foods that reduce inflammation',       img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&q=80' },
  { value: 'dash',                label: 'DASH Diet',              desc: 'Lower blood pressure naturally',       img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80' },
  { value: 'flexitarian',         label: 'Flexitarian',            desc: 'Mostly plant, occasional meat',        img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
];

const DISLIKED_FOODS = [
  'Beef','Beets','Bell peppers','Broccoli','Brussels sprouts','Cilantro',
  'Eggplant','Eggs','Fish','Ginger','Kale','Mayonnaise','Mushrooms',
  'Okra','Olives','Peas','Pickles','Pork','Quinoa','Shellfish',
  'Shrimp','Spinach','Tofu','Tomatoes','Tuna',
];

const CUISINES = [
  { value: 'american',      label: 'American' },
  { value: 'italian',       label: 'Italian' },
  { value: 'mexican',       label: 'Mexican' },
  { value: 'asian',         label: 'Asian' },
  { value: 'chinese',       label: 'Chinese' },
  { value: 'japanese',      label: 'Japanese' },
  { value: 'thai',          label: 'Thai' },
  { value: 'indian',        label: 'Indian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'greek',         label: 'Greek' },
  { value: 'french',        label: 'French' },
  { value: 'korean',        label: 'Korean' },
];

const COOKED_VEGS = [
  { value: 'sauteed_spinach',      label: 'Sautéed Spinach',          img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80' },
  { value: 'sauteed_zucchini',     label: 'Sautéed Zucchini',         img: 'https://images.unsplash.com/photo-1608032364895-84e16138b4fc?w=300&q=80' },
  { value: 'roasted_eggplant',     label: 'Roasted Eggplant',         img: 'https://images.unsplash.com/photo-1605989920742-2e9a9d0e75b9?w=300&q=80' },
  { value: 'cooked_broccoli',      label: 'Cooked Broccoli',          img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&q=80' },
  { value: 'sauteed_carrots',      label: 'Sautéed Carrots',          img: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=300&q=80' },
  { value: 'sauteed_cauliflower',  label: 'Sautéed Cauliflower',      img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=300&q=80' },
  { value: 'roasted_sweet_potato', label: 'Roasted Sweet Potatoes',   img: 'https://images.unsplash.com/photo-1596097636487-2675b64f9cdd?w=300&q=80' },
  { value: 'grilled_asparagus',    label: 'Grilled Asparagus',        img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=300&q=80' },
];

const RAW_VEGS = [
  { value: 'bell_pepper',     label: 'Bell Pepper Strips',  img: 'https://images.unsplash.com/photo-1525607551316-4a7b35fc5a42?w=300&q=80' },
  { value: 'baby_carrots',    label: 'Baby Carrots',        img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=300&q=80' },
  { value: 'cherry_tomatoes', label: 'Cherry Tomatoes',     img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80' },
  { value: 'cucumber',        label: 'Cucumber Slices',     img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&q=80' },
  { value: 'celery',          label: 'Celery Sticks',       img: 'https://images.unsplash.com/photo-1528150395929-9b39e73d43cb?w=300&q=80' },
  { value: 'snap_peas',       label: 'Snap Peas',           img: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=300&q=80' },
];

const FRUITS = [
  { value: 'apple',        label: 'Apple',        img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=80' },
  { value: 'banana',       label: 'Banana',       img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80' },
  { value: 'blueberries',  label: 'Blueberries',  img: 'https://images.unsplash.com/photo-1425934398893-310a009a77f9?w=300&q=80' },
  { value: 'strawberry',   label: 'Strawberries', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80' },
  { value: 'blackberries', label: 'Blackberries', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80' },
  { value: 'raspberries',  label: 'Raspberries',  img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=300&q=80' },
  { value: 'grapes',       label: 'Grapes',       img: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=300&q=80' },
  { value: 'orange',       label: 'Orange',       img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&q=80' },
  { value: 'mandarin',     label: 'Mandarin',     img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300&q=80' },
  { value: 'pineapple',    label: 'Pineapple',    img: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=300&q=80' },
  { value: 'mango',        label: 'Mango',        img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80' },
  { value: 'papaya',       label: 'Papaya',       img: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=300&q=80' },
  { value: 'kiwi',         label: 'Kiwi',         img: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=300&q=80' },
  { value: 'watermelon',   label: 'Watermelon',   img: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300&q=80' },
  { value: 'cantaloupe',   label: 'Cantaloupe',   img: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=300&q=80' },
  { value: 'honeydew',     label: 'Honeydew',     img: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=300&q=80' },
  { value: 'peach',        label: 'Peach',        img: 'https://images.unsplash.com/photo-1595124046883-4b9dc3c2bbcd?w=300&q=80' },
  { value: 'nectarine',    label: 'Nectarine',    img: 'https://images.unsplash.com/photo-1595124046883-4b9dc3c2bbcd?w=300&q=80' },
  { value: 'plum',         label: 'Plum',         img: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=300&q=80' },
  { value: 'apricot',      label: 'Apricot',      img: 'https://images.unsplash.com/photo-1559181567-c3190e008a33?w=300&q=80' },
  { value: 'pear',         label: 'Pear',         img: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=300&q=80' },
  { value: 'pomegranate',  label: 'Pomegranate',  img: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=300&q=80' },
  { value: 'dragon_fruit', label: 'Dragon Fruit', img: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=300&q=80' },
  { value: 'passion_fruit',label: 'Passion Fruit',img: 'https://images.unsplash.com/photo-1604495771767-bab51a6a3e09?w=300&q=80' },
  { value: 'guava',        label: 'Guava',        img: 'https://images.unsplash.com/photo-1536823631994-3aeaed1e9bbc?w=300&q=80' },
  { value: 'lychee',       label: 'Lychee',       img: 'https://images.unsplash.com/photo-1600147131759-880e94a6185f?w=300&q=80' },
  { value: 'coconut',      label: 'Coconut',      img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&q=80' },
  { value: 'fig',          label: 'Fig',          img: 'https://images.unsplash.com/photo-1601379329542-31c59347e2b0?w=300&q=80' },
  { value: 'date',         label: 'Dates',        img: 'https://images.unsplash.com/photo-1559181567-c3190e008a33?w=300&q=80' },
  { value: 'persimmon',    label: 'Persimmon',    img: 'https://images.unsplash.com/photo-1601379329542-31c59347e2b0?w=300&q=80' },
  { value: 'starfruit',    label: 'Starfruit',    img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=300&q=80' },
];

const RECIPES = [
  { value: 'avocado_chicken_salad', label: 'Avocado Chicken Salad',    cal: 410, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { value: 'turkey_avocado_wrap',   label: 'Turkey Avocado Wrap',      cal: 669, img: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80' },
  { value: 'baked_beef_nachos',     label: 'Baked Beef Nachos',        cal: 710, img: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80' },
  { value: 'chicken_alfredo',       label: 'Quick Chicken Alfredo',    cal: 596, img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80' },
  { value: 'spring_veggie_pasta',   label: 'Spring Veggie Pasta',      cal: 471, img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80' },
  { value: 'southwest_wrap',        label: 'Southwest Breakfast Wrap', cal: 645, img: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=400&q=80' },
];

const PRIORITIES = [
  { key: 'budget',       label: 'Budget-friendly meals' },
  { key: 'weight_loss',  label: 'Weight loss' },
  { key: 'easy',         label: 'Easy recipes' },
  { key: 'quick',        label: 'Quick recipes' },
  { key: 'variety',      label: 'Recipe variety' },
  { key: 'delicious',    label: 'Delicious meals' },
];

const TOTAL_STEPS = 13;

// ─── Sub-components ──────────────────────────────────────────────────────────

function ImageCardGrid({ items, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const sel = Array.isArray(selected) ? selected.includes(item.value) : selected === item.value;
        return (
          <motion.button key={item.value} whileTap={{ scale: 0.96 }} onClick={() => onToggle(item.value)}
            className="relative overflow-hidden rounded-2xl text-left"
            style={{ border: sel ? '2px solid #a855f7' : '2px solid transparent', boxShadow: sel ? '0 0 20px rgba(168,85,247,0.4)' : 'none' }}>
            <img src={item.img} alt={item.label}
              className="w-full object-cover"
              style={{ height: 120 }}
              onError={(e) => { e.target.style.background = '#1e0a40'; e.target.src = ''; }} />
            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,4,26,0.95) 0%, rgba(10,4,26,0.3) 60%, transparent 100%)' }} />
            {sel && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#a855f7' }}>
                <Heart className="w-3 h-3 text-white" fill="white" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-sm font-bold text-white leading-tight">{item.label}</p>
              {item.desc && <p className="text-[10px] text-gray-300 mt-0.5 leading-tight">{item.desc}</p>}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function ChipGrid({ items, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const val = typeof item === 'string' ? item : item.value;
        const label = typeof item === 'string' ? item : item.label;
        const sel = Array.isArray(selected) ? selected.includes(val) : selected === val;
        return (
          <motion.button key={val} whileTap={{ scale: 0.93 }} onClick={() => onToggle(val)}
            className="px-3.5 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: sel ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
              border: sel ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)',
              color: sel ? '#c084fc' : '#9ca3af',
            }}>
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

function ImagePickGrid({ items, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const sel = selected.includes(item.value);
        return (
          <motion.button key={item.value} whileTap={{ scale: 0.96 }} onClick={() => onToggle(item.value)}
            className="relative overflow-hidden rounded-2xl"
            style={{ border: sel ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.08)' }}>
            <img src={item.img} alt={item.label} className="w-full object-cover" style={{ height: 110 }}
              onError={(e) => { e.target.parentElement.style.background = '#1e0a40'; e.target.remove(); }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,4,26,0.8) 0%, transparent 60%)' }} />
            {sel && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#a855f7' }}>
                <Heart className="w-3 h-3 text-white" fill="white" />
              </div>
            )}
            <p className="absolute bottom-2 left-2 text-xs font-bold text-white">{item.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

function RecipeRater({ recipe, rating, onRate }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <img src={recipe.img} alt={recipe.label} className="w-full object-cover" style={{ height: 220 }}
        onError={(e) => { e.target.style.display = 'none'; }} />
      <div className="p-4">
        <p className="text-base font-bold text-white">{recipe.label}</p>
        <p className="text-sm text-gray-500 mb-3">{recipe.cal} cal</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Dislike', icon: ThumbsDown, val: 'dislike', color: '#a855f7' },
            { label: 'Like',    icon: ThumbsUp,   val: 'like',    color: '#a855f7' },
          ].map(btn => {
            const active = rating === btn.val;
            const Icon = btn.icon;
            return (
              <motion.button key={btn.val} whileTap={{ scale: 0.94 }} onClick={() => onRate(btn.val)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: active ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)',
                  border: active ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  color: active ? btn.color : '#6b7280',
                }}>
                <Icon className="w-4 h-4" fill={active ? btn.color : 'none'} />
                {btn.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
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
    servings: '1 person',
    meal_types: ['breakfast','lunch','dinner','snacks'],
    priorities: { budget: 50, weight_loss: 70, easy: 50, quick: 50, variety: 60, delicious: 70 },
  });
  const scrollRef = useRef(null);

  const set = (field, value) => setAnswers(a => ({ ...a, [field]: value }));
  const toggleArr = (field, val) => {
    const arr = answers[field] || [];
    set(field, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const showHighProtein = answers.diet_styles.includes('high_protein');

  const canContinue = () => {
    if (step === 0) return !!answers.change_level;
    if (step === 1) return answers.diet_styles.length > 0;
    if (step === 2) return !showHighProtein || !!answers.high_protein_experience;
    if (step === 9) return answers.user_name.trim().length > 0;
    return true;
  };

  const next = () => {
    if (step === 1 && !showHighProtein) { setStep(3); scrollRef.current?.scrollTo(0,0); return; }
    if (step === 8) {
      // recipe rating step: cycle through recipes then move on
      if (recipeIdx < RECIPES.length - 1) { setRecipeIdx(i => i + 1); return; }
    }
    if (step < TOTAL_STEPS - 1) { setStep(s => s + 1); scrollRef.current?.scrollTo(0,0); }
    else { onComplete({ ...answers, onboarding_complete: true }); }
  };

  const back = () => {
    if (step === 3 && !showHighProtein) { setStep(1); return; }
    if (step === 9 && recipeIdx > 0) { setRecipeIdx(i => i - 1); return; }
    if (step > 0) { setStep(s => s - 1); scrollRef.current?.scrollTo(0,0); }
  };

  const displayStep = step + 1;

  const CHANGE_OPTS = [
    { value: 'small',    label: 'Small changes',             desc: 'Minor tweaks to my current diet' },
    { value: 'moderate', label: 'Steady change',             desc: 'Balanced progress at a sustainable pace' },
    { value: 'major',    label: 'Major lifestyle change',    desc: 'Big commitment to healthy eating' },
    { value: 'commit',   label: "I'm ready to fully commit", desc: 'All-in on my nutrition goals' },
  ];

  const filteredDislikes = DISLIKED_FOODS.filter(f =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0618' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={back}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </motion.button>
          )}
          <div className="flex-1 flex gap-1.5">
            {[0,1,2].map(seg => (
              <div key={seg} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: '#4f9ef7' }}
                  animate={{ width: displayStep > (seg + 1) * (TOTAL_STEPS / 3) ? '100%' : displayStep > seg * (TOTAL_STEPS / 3) ? `${((displayStep - seg * (TOTAL_STEPS/3)) / (TOTAL_STEPS/3)) * 100}%` : '0%' }}
                  transition={{ duration: 0.4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-32 no-scrollbar">
        <AnimatePresence initial={false}>
          <motion.div key={`${step}-${recipeIdx}`}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24, position: 'absolute' }}
            transition={{ duration: 0.18 }}>

            {/* ── Step 0: Change level ── */}
            {step === 0 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">How much change are you ready for?</h2>
                <p className="text-sm text-gray-500 mb-5">We'll build your plan around this</p>
                <div className="space-y-2.5">
                  {CHANGE_OPTS.map(opt => {
                    const sel = answers.change_level === opt.value;
                    return (
                      <motion.button key={opt.value} whileTap={{ scale: 0.97 }}
                        onClick={() => { set('change_level', opt.value); setTimeout(next, 180); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(79,158,247,0.12)' : 'rgba(255,255,255,0.04)',
                          border: sel ? '1px solid rgba(79,158,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{opt.label}</p>
                          {sel && <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>}
                        </div>
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: sel ? '#4f9ef7' : 'transparent', border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.2)' }}>
                          {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 1: Diet style with images ── */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Which diet plan do you prefer?</h2>
                <p className="text-sm text-gray-500 mb-4">Select one or more</p>
                <ImageCardGrid items={DIET_STYLES} selected={answers.diet_styles}
                  onToggle={v => toggleArr('diet_styles', v)} />
              </>
            )}

            {/* ── Step 2: High protein experience (conditional) ── */}
            {step === 2 && showHighProtein && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Have you tried a high protein diet before?</h2>
                <p className="text-sm text-gray-500 mb-5">This helps us calibrate your plan</p>
                <div className="space-y-2.5">
                  {[
                    { value: 'not_yet',   label: 'Not yet' },
                    { value: 'tried',     label: 'Tried before' },
                    { value: 'following', label: 'Current approach' },
                  ].map(opt => {
                    const sel = answers.high_protein_experience === opt.value;
                    return (
                      <motion.button key={opt.value} whileTap={{ scale: 0.97 }}
                        onClick={() => { set('high_protein_experience', opt.value); setTimeout(next, 180); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(79,158,247,0.12)' : 'rgba(255,255,255,0.04)',
                          border: sel ? '1px solid rgba(79,158,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <span className="text-sm font-semibold text-white flex-1">{opt.label}</span>
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: sel ? '#4f9ef7' : 'transparent', border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.2)' }}>
                          {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 3: Restrictions & dislikes ── */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Restrictions and dislikes</h2>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">Add any foods you avoid or have allergies to. Always check ingredients if you have health conditions.</p>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white outline-none input-dark"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Common dislikes</p>
                <ChipGrid items={filteredDislikes} selected={answers.disliked_foods}
                  onToggle={v => toggleArr('disliked_foods', v)} />
                {/* Custom */}
                <div className="flex gap-2 mt-4">
                  <input
                    className="input-dark flex-1 text-sm py-2.5"
                    placeholder="Add custom food or allergy..."
                    value={answers.custom_disliked}
                    onChange={e => set('custom_disliked', e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && answers.custom_disliked.trim()) {
                        toggleArr('disliked_foods', answers.custom_disliked.trim()); set('custom_disliked', '');
                      }
                    }} />
                  <button onClick={() => {
                    if (answers.custom_disliked.trim()) {
                      toggleArr('disliked_foods', answers.custom_disliked.trim()); set('custom_disliked', '');
                    }
                  }} className="px-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}>
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

            {/* ── Step 4: Cuisines (thumbs up / thumbs down) ── */}
            {step === 4 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Are there any cuisines you really love — or really don't love?</h2>
                <p className="text-sm text-gray-500 mb-4">Help us personalize your plan</p>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {CUISINES.map((c, i) => {
                    const pref = answers.cuisine_prefs[c.value];
                    return (
                      <div key={c.value} className="flex items-center gap-3 px-4 py-3.5"
                        style={{ borderBottom: i < CUISINES.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <span className="text-sm text-white font-medium flex-1">{c.label}</span>
                        <div className="flex gap-2">
                          <button onClick={() => set('cuisine_prefs', { ...answers.cuisine_prefs, [c.value]: pref === 'dislike' ? null : 'dislike' })}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: pref === 'dislike' ? 'rgba(79,158,247,0.2)' : 'rgba(255,255,255,0.05)', border: pref === 'dislike' ? '1px solid rgba(79,158,247,0.4)' : '1px solid transparent' }}>
                            <ThumbsDown className="w-4 h-4" style={{ color: pref === 'dislike' ? '#4f9ef7' : '#4b5563' }} fill={pref === 'dislike' ? '#4f9ef7' : 'none'} />
                          </button>
                          <button onClick={() => set('cuisine_prefs', { ...answers.cuisine_prefs, [c.value]: pref === 'love' ? null : 'love' })}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: pref === 'love' ? 'rgba(79,158,247,0.2)' : 'rgba(255,255,255,0.05)', border: pref === 'love' ? '1px solid rgba(79,158,247,0.4)' : '1px solid transparent' }}>
                            <ThumbsUp className="w-4 h-4" style={{ color: pref === 'love' ? '#4f9ef7' : '#4b5563' }} fill={pref === 'love' ? '#4f9ef7' : 'none'} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 5: Cooked vegs ── */}
            {step === 5 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Which of these cooked veggies would you like in your meal plans?</h2>
                <p className="text-sm text-gray-500 mb-4">Select all you enjoy</p>
                <ImagePickGrid items={COOKED_VEGS} selected={answers.cooked_vegs}
                  onToggle={v => toggleArr('cooked_vegs', v)} />
              </>
            )}

            {/* ── Step 6: Raw vegs ── */}
            {step === 6 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Which of these raw veggies would you like in your meal plans?</h2>
                <p className="text-sm text-gray-500 mb-4">Great for snacks and salads</p>
                <ImagePickGrid items={RAW_VEGS} selected={answers.raw_vegs}
                  onToggle={v => toggleArr('raw_vegs', v)} />
              </>
            )}

            {/* ── Step 7: Fruits ── */}
            {step === 7 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Which of these fruit would you like in your meal plans?</h2>
                <p className="text-sm text-gray-500 mb-4">We'll include these in snacks and breakfasts</p>
                <ImagePickGrid items={FRUITS} selected={answers.fruits}
                  onToggle={v => toggleArr('fruits', v)} />
              </>
            )}

            {/* ── Step 8: Rate recipes ── */}
            {step === 8 && recipeIdx < RECIPES.length && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Rate a few recipes so we can learn more about what you like</h2>
                <p className="text-sm text-gray-500 mb-4">{recipeIdx + 1} of {RECIPES.length}</p>
                <RecipeRater
                  recipe={RECIPES[recipeIdx]}
                  rating={answers.recipe_ratings[RECIPES[recipeIdx].value]}
                  onRate={val => set('recipe_ratings', { ...answers.recipe_ratings, [RECIPES[recipeIdx].value]: val })} />
              </>
            )}

            {/* ── Step 9: Name ── */}
            {step === 9 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">What should we call you?</h2>
                <p className="text-sm text-gray-500 mb-5">We'll personalize your plan with your name</p>
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-widest">First name</p>
                <input
                  className="input-dark text-lg font-semibold"
                  placeholder="Your name..."
                  value={answers.user_name}
                  onChange={e => set('user_name', e.target.value)}
                  autoFocus
                  autoComplete="given-name"
                  autoCorrect="off"
                  spellCheck="false"
                  style={{ fontSize: 18, fontWeight: 600, caretColor: '#a855f7' }}
                />
              </>
            )}

            {/* ── Step 10: Servings ── */}
            {step === 10 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">How many people would you like each meal to feed?</h2>
                <p className="text-sm text-gray-500 mb-5">This affects ingredient quantities</p>
                <div className="space-y-2.5">
                  {[
                    { val: 'Lunch',  key: 'lunch_servings' },
                    { val: 'Dinner', key: 'dinner_servings' },
                  ].map(meal => {
                    const count = answers[meal.key] || 1;
                    return (
                      <div key={meal.val} className="flex items-center gap-4 p-4 rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span className="text-sm font-semibold text-white flex-1">{meal.val}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => set(meal.key, Math.max(1, count - 1))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: 'rgba(255,255,255,0.08)' }}>−</button>
                          <span className="text-sm font-bold text-white w-4 text-center">{count}</span>
                          <button onClick={() => set(meal.key, Math.min(10, count + 1))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: 'rgba(79,158,247,0.25)', border: '1px solid rgba(79,158,247,0.4)', color: '#4f9ef7' }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 11: Meal types ── */}
            {step === 11 && (
              <>
                <h2 className="text-2xl font-black text-white mb-1 mt-2">Which meals to plan?</h2>
                <p className="text-sm text-gray-500 mb-5">Select the meals you want included</p>
                <div className="space-y-2.5">
                  {[
                    { value: 'breakfast', label: 'Breakfast', time: 'Morning meal' },
                    { value: 'lunch',     label: 'Lunch',     time: 'Midday meal' },
                    { value: 'dinner',    label: 'Dinner',    time: 'Evening meal' },
                    { value: 'snacks',    label: 'Snacks',    time: 'Between meals' },
                  ].map(m => {
                    const sel = answers.meal_types.includes(m.value);
                    return (
                      <motion.button key={m.value} whileTap={{ scale: 0.97 }}
                        onClick={() => toggleArr('meal_types', m.value)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: sel ? 'rgba(79,158,247,0.1)' : 'rgba(255,255,255,0.04)',
                          border: sel ? '1px solid rgba(79,158,247,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{m.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{m.time}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: sel ? '#4f9ef7' : 'transparent', border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.2)' }}>
                          {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
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
                <h2 className="text-2xl font-black text-white mb-1 mt-2">How important are these factors to your meal plans?</h2>
                <p className="text-sm text-gray-500 mb-5">Drag to set your priorities</p>
                <div className="space-y-5">
                  {PRIORITIES.map(p => {
                    const val = answers.priorities[p.key];
                    const label = val < 35 ? 'Less important' : val < 65 ? 'Important' : 'Very important';
                    return (
                      <div key={p.key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white font-medium">{p.label}</span>
                          <span className="text-xs font-bold" style={{ color: '#4f9ef7' }}>{label}</span>
                        </div>
                        <input type="range" min={0} max={100} value={val}
                          onChange={e => set('priorities', { ...answers.priorities, [p.key]: Number(e.target.value) })}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, #4f9ef7 ${val}%, rgba(255,255,255,0.1) ${val}%)`, accentColor: '#4f9ef7' }} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer button — hidden on auto-advance steps */}
      {![0, 2].includes(step) && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 max-w-md mx-auto"
          style={{ background: 'linear-gradient(to top, #0d0618 60%, transparent)' }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={next} disabled={!canContinue()}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all"
            style={{
              background: canContinue() ? '#4f9ef7' : 'rgba(79,158,247,0.2)',
              color: 'white',
              boxShadow: canContinue() ? '0 6px 24px rgba(79,158,247,0.35)' : 'none',
            }}>
            {step < TOTAL_STEPS - 1 ? 'Next' : 'Build My Plan'}
          </motion.button>
        </div>
      )}
    </div>
  );
}