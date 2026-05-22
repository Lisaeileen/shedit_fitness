import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGoals, MealPlans } from '../components/storage';
import OnboardingFlow from '../components/fitness/OnboardingFlow';
import MealPlanView from '../components/fitness/MealPlanView';
import WorkoutPanel from '../components/fitness/panels/WorkoutPanel';
import { Loader2, Utensils, Dumbbell, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { SheditWordmark } from '../components/fitness/SheditLogo';

// ── Generating Screen ────────────────────────────────────────────────────────

function GeneratingScreen({ userName }) {
  const messages = [
    'Analyzing your preferences…',
    'Matching your diet style…',
    'Selecting your favourite foods…',
    'Balancing your macros…',
    'Crafting 7-day meal plan with AI…',
    'Finalizing recipes and portions…',
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setMsgIdx(i => Math.min(i + 1, messages.length - 1)), 900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: 'linear-gradient(160deg, #12062A 0%, #2A0A4A 100%)' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 48px rgba(168,85,247,0.5)' }}>
        <Loader2 className="w-10 h-10 text-white" />
      </motion.div>
      <h2 className="text-2xl font-black text-white mb-3">
        {userName ? `Building your plan, ${userName}…` : 'Building your plan…'}
      </h2>
      <p className="text-sm text-purple-300/50 mb-10">Shedit AI is crafting your personalized meal plan</p>
      <div className="w-48 h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
          initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 30, ease: 'easeInOut' }} />
      </div>
      <motion.p key={msgIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="text-xs text-purple-400/60">
        {messages[msgIdx]}
      </motion.p>
      <Loader2 className="w-5 h-5 text-purple-400/40 animate-spin mt-6" />
    </div>
  );
}

// ── Ready Banner ─────────────────────────────────────────────────────────────

function ReadyBanner({ userName, goals, onView }) {
  const currentWeight = goals?.current_weight || goals?.weight_kg || 80;
  const targetWeight = goals?.target_weight || goals?.desired_weight_kg || (currentWeight - 8);
  const diff = Math.abs(currentWeight - targetWeight);
  const weeksNeeded = Math.round(diff / 0.5);
  const months = Math.max(1, Math.round(weeksNeeded / 4));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'linear-gradient(160deg, #12062A 0%, #2A0A4A 100%)' }}>
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14 }}
        className="w-28 h-28 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 48px rgba(168,85,247,0.4)' }}>
        <TrendingUp className="w-12 h-12 text-white" />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-2xl font-black text-white mb-4 leading-snug">
        Shedit will build meal plans that can help you{' '}
        {currentWeight > targetWeight ? 'lose' : 'gain'}{' '}
        <span className="gradient-text">{diff} kg</span>{' '}
        {months > 0 && <span>in <span className="gradient-text">{months} month{months > 1 ? 's' : ''}</span></span>}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="text-sm text-gray-400 mb-3 leading-relaxed max-w-xs">
        And you'll be able to eat delicious meals, too.
      </motion.p>
      {userName && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-xs text-purple-300/50 mb-8">
          Personalized for {userName}
        </motion.p>
      )}
      <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }} onClick={onView} className="btn-primary max-w-xs">
        View My Meal Plan →
      </motion.button>
    </div>
  );
}

// ── AI Plan Generator ────────────────────────────────────────────────────────

async function generateAIPlan(goals) {
  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  const lovedCuisines = Object.entries(goals.cuisine_prefs || {}).filter(([,v])=>v==='love').map(([k])=>k);
  const dislikedCuisines = Object.entries(goals.cuisine_prefs || {}).filter(([,v])=>v==='dislike').map(([k])=>k);
  const hasCuisinePrefs = lovedCuisines.length > 0;

  const dietStyles = goals.diet_styles || [];
  const isVegan        = dietStyles.includes('vegan');
  const isVegetarian   = dietStyles.includes('vegetarian') || dietStyles.includes('plant_based');
  const isPescatarian  = dietStyles.includes('pescatarian');
  const isNigerian     = lovedCuisines.some(c => ['nigerian','west_african','ghanaian'].includes(c))
                        || dietStyles.includes('african_style');
  const isKeto         = dietStyles.includes('keto');
  const isHighProtein  = dietStyles.includes('high_protein');
  const isLowCarb      = dietStyles.includes('low_carb') || isKeto;

  const allAvoid = [...(goals.disliked_foods || [])];
  if (isVegan)       allAvoid.push('meat', 'chicken', 'fish', 'seafood', 'eggs', 'dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream');
  if (isVegetarian)  allAvoid.push('meat', 'chicken', 'beef', 'pork', 'lamb', 'fish', 'seafood');
  if (isPescatarian) allAvoid.push('meat', 'chicken', 'beef', 'pork', 'lamb');

  const goalDesc = goals.primary_goal === 'lose_weight' ? 'weight loss (calorie deficit, high protein)'
    : goals.primary_goal === 'gain_weight' ? 'muscle gain (calorie surplus, high protein)'
    : 'maintain weight and eat healthy';

  const prompt = `You are an expert nutritionist. Create a detailed 7-day personalized meal plan.

USER PROFILE:
- Fitness goal: ${goalDesc}
- Daily calorie target: ${goals.daily_calorie_target || 2000} kcal
- Diet style: ${dietStyles.join(', ') || 'balanced'}
- FOODS TO ABSOLUTELY AVOID (HARD RULE): ${allAvoid.length > 0 ? allAvoid.join(', ') : 'none'}
- PREFERRED CUISINES: ${hasCuisinePrefs ? lovedCuisines.join(', ') : 'diverse global mix'}
- Cuisines to avoid: ${dislikedCuisines.length > 0 ? dislikedCuisines.join(', ') : 'none'}
- Preferred fruits: ${(goals.fruits || []).join(', ') || 'any'}
- Preferred cooked vegs: ${(goals.cooked_vegs || []).join(', ') || 'any'}

STRICT DIET RULES (follow these exactly):
${isVegan ? '- VEGAN: Use ONLY plant-based foods. No meat, chicken, fish, eggs, dairy, honey, or any animal products whatsoever.' : ''}
${isVegetarian ? '- VEGETARIAN: No meat, chicken, fish, or seafood. Eggs and dairy are allowed.' : ''}
${isPescatarian ? '- PESCATARIAN: Fish and seafood are allowed. NO chicken, beef, pork, lamb, or other meat.' : ''}
${isKeto ? '- KETO: Very low carb (<50g/day total). High fat, moderate protein. No rice, pasta, bread, sugar, potatoes.' : ''}
${isHighProtein ? '- HIGH PROTEIN: Each meal should have high protein. Prioritize lean meats, eggs, legumes, Greek yogurt.' : ''}
${isLowCarb && !isKeto ? '- LOW CARB: Keep carbs minimal. No rice, pasta, or bread. Use cauliflower rice, zucchini noodles, etc.' : ''}

CUISINE RULES:
${isNigerian
  ? `- NIGERIAN FOOD REQUIRED: ALL meals must be authentic Nigerian/West African dishes.
  Breakfast options: Oats with banana and groundnuts, Akara with pap, Moi Moi, Boiled egg with sweet potato, Custard with fruit, Yam and egg sauce, Corn porridge.
  Lunch/Dinner options: Jollof rice with grilled chicken, Ofada rice with stew, Beans and plantain, Efo Riro with eba, Egusi soup with swallow, Okra soup with fish, Afang soup, Vegetable soup with chicken, Grilled fish with fried plantain, Pepper soup with yam, Beans porridge, Yam porridge, Moi Moi with rice, Chicken stew with rice, Nigerian fried rice.
  Snack options: Fresh fruit, Groundnuts (peanuts), Boiled corn, Tiger nuts, Smoothie, Roasted plantain, Akara.
  Use portion-controlled, health-appropriate versions.`
  : hasCuisinePrefs
  ? `- The user loves: ${lovedCuisines.join(', ')}. MOST meals MUST be authentic dishes from these cuisines. Do NOT default to generic Western food.`
  : `- Use a diverse mix of global cuisines.`}

NON-REPETITION RULES:
- NO meal name should repeat across the 7 days.
- Each day must have completely different dishes.
- Vary protein sources: alternate between different proteins each day.

CALORIE DISTRIBUTION per day:
- Breakfast: ~${Math.round((goals.daily_calorie_target || 2000) * 0.25)} kcal
- Lunch: ~${Math.round((goals.daily_calorie_target || 2000) * 0.30)} kcal
- Dinner: ~${Math.round((goals.daily_calorie_target || 2000) * 0.35)} kcal
- Snacks: ~${Math.round((goals.daily_calorie_target || 2000) * 0.10)} kcal

REQUIREMENTS:
1. Each meal must NOT include any avoided foods.
2. For EVERY meal, provide exact ingredients with precise quantities (e.g. "2 large eggs", "200g chicken breast").
3. Provide 3-5 step-by-step cooking instructions per meal.
4. Macros must add up correctly to the calorie target.
5. Include a short serving size description per meal.

Return JSON with a "days" array of 7 objects, one per day in order: monday through sunday.`;

  const schema = {
    type: 'object',
    properties: {
      days: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day_of_week: { type: 'string' },
            breakfast: { type: 'string' },
            breakfast_calories: { type: 'number' },
            breakfast_protein: { type: 'number' },
            breakfast_carbs: { type: 'number' },
            breakfast_fat: { type: 'number' },
            breakfast_ingredients: { type: 'array', items: { type: 'string' } },
            breakfast_instructions: { type: 'array', items: { type: 'string' } },
            lunch: { type: 'string' },
            lunch_calories: { type: 'number' },
            lunch_protein: { type: 'number' },
            lunch_carbs: { type: 'number' },
            lunch_fat: { type: 'number' },
            lunch_ingredients: { type: 'array', items: { type: 'string' } },
            lunch_instructions: { type: 'array', items: { type: 'string' } },
            dinner: { type: 'string' },
            dinner_calories: { type: 'number' },
            dinner_protein: { type: 'number' },
            dinner_carbs: { type: 'number' },
            dinner_fat: { type: 'number' },
            dinner_ingredients: { type: 'array', items: { type: 'string' } },
            dinner_instructions: { type: 'array', items: { type: 'string' } },
            snacks: { type: 'string' },
            snacks_calories: { type: 'number' },
            snacks_protein: { type: 'number' },
            snacks_carbs: { type: 'number' },
            snacks_fat: { type: 'number' },
            snacks_ingredients: { type: 'array', items: { type: 'string' } },
            snacks_instructions: { type: 'array', items: { type: 'string' } },
          }
        }
      }
    }
  };

  const result = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
  const planData = result.days || [];
  return DAYS.map((day, i) => {
    const d = planData[i] || {};
    // Embed ingredients & instructions into _detail objects that MealPlanView can read
    const withDetail = { day_of_week: day, ...d };
    for (const m of ['breakfast', 'lunch', 'dinner', 'snacks']) {
      const ing = d[`${m}_ingredients`];
      const ins = d[`${m}_instructions`];
      if (ing?.length || ins?.length) {
        withDetail[`${m}_detail`] = { ingredients: ing || [], instructions: ins || [] };
      }
    }
    return withDetail;
  });
}

// ── Main Plan Page ────────────────────────────────────────────────────────────

export default function Plan() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);
  const [phase, setPhase] = useState('check');
  const [aiError, setAiError] = useState(false);
  const [planTab, setPlanTab] = useState('meals');

  useEffect(() => {
    const goals = UserGoals.get();
    if (!goals?.onboarding_complete) {
      setPhase('onboarding');
    } else if (MealPlans.list().length === 0) {
      setPhase('generating');
      runGeneration(goals);
    } else {
      setPhase('plan');
    }
  }, [tick]);

  const runGeneration = async (goals) => {
    setPhase('generating');
    setAiError(false);
    try {
      const plan = await generateAIPlan(goals);
      MealPlans.replaceAll(plan);
      setPhase('ready');
    } catch (err) {
      // Fallback to static plan
      setAiError(true);
      const fallback = getFallbackPlan(goals?.primary_goal, goals);
      MealPlans.replaceAll(fallback);
      setPhase('ready');
    }
  };

  const handleOnboardingComplete = (data) => {
    // Merge with any existing data from the main onboarding (NewOnboardingFlow)
    // so we keep calorie targets, weight goals, etc.
    const existing = UserGoals.get() || {};
    const merged = {
      ...existing,
      ...data,
      onboarding_complete: true,
      // Preserve calorie target from main onboarding if Plan quiz didn't set one
      daily_calorie_target: data.daily_calorie_target || existing.daily_calorie_target || 2000,
    };
    UserGoals.save(merged);
    runGeneration(merged);
  };

  const handleRegenerate = () => {
    const goals = UserGoals.get();
    MealPlans.deleteAll();
    runGeneration(goals);
  };

  const currentGoals = UserGoals.get();

  if (phase === 'check') return null;
  if (phase === 'onboarding') return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  if (phase === 'generating') return <GeneratingScreen userName={currentGoals?.user_name} />;
  if (phase === 'ready') return (
    <ReadyBanner
      userName={currentGoals?.user_name}
      goals={currentGoals}
      onView={() => { setPhase('plan'); refresh(); }} />
  );

  return (
    <div>
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-4 pt-2">
          <div>
            <p className="text-[10px] text-purple-300/50 font-medium">Your weekly</p>
            <SheditWordmark size={30} />
          </div>
        </div>
        {/* Plan tabs: Nutrition / Workout */}
        <div className="flex p-1 rounded-2xl mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[['meals', Utensils, 'Meal Plan'], ['workout', Dumbbell, 'Workouts']].map(([k, Icon, label]) => (
            <button key={k} onClick={() => setPlanTab(k)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={planTab === k
                ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white' }
                : { color: '#4b5563' }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {planTab === 'meals' ? (
          <motion.div key="meals" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
            <MealPlanView
              goals={currentGoals}
              mealPlans={MealPlans.list()}
              onRefresh={refresh}
              onRedo={() => { UserGoals.clear(); MealPlans.deleteAll(); setPhase('onboarding'); }}
              onRegenerate={handleRegenerate}
            />
          </motion.div>
        ) : (
          <motion.div key="workout" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}
            className="px-4 pb-28">
            <WorkoutPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Fallback static plan ─────────────────────────────────────────────────────

function getFallbackPlan(goal, goals) {
  const isNigerian = (() => {
    const prefs = goals?.cuisine_prefs || {};
    const loved = Object.entries(prefs).filter(([,v]) => v === 'love').map(([k]) => k);
    return loved.some(c => ['nigerian','west_african','ghanaian'].includes(c))
      || (goals?.diet_styles || []).includes('african_style');
  })();

  if (isNigerian) {
    return [
      { day_of_week: 'monday',    breakfast: 'Oats porridge with banana and groundnuts', breakfast_calories: 380, breakfast_protein: 14, breakfast_carbs: 58, breakfast_fat: 10, lunch: 'Jollof rice with grilled chicken and fried plantain', lunch_calories: 580, lunch_protein: 32, lunch_carbs: 70, lunch_fat: 14, dinner: 'Egusi soup with eba and fish', dinner_calories: 520, dinner_protein: 28, dinner_carbs: 60, dinner_fat: 20, snacks: 'Fresh fruit mix (banana, pineapple)', snacks_calories: 140, snacks_protein: 2, snacks_carbs: 34, snacks_fat: 1 },
      { day_of_week: 'tuesday',   breakfast: 'Akara (bean cakes) with pap (ogi)', breakfast_calories: 360, breakfast_protein: 16, breakfast_carbs: 52, breakfast_fat: 10, lunch: 'White rice with chicken stew and steamed vegetables', lunch_calories: 560, lunch_protein: 30, lunch_carbs: 68, lunch_fat: 14, dinner: 'Okra soup with grilled fish and semovita', dinner_calories: 500, dinner_protein: 30, dinner_carbs: 58, dinner_fat: 16, snacks: 'Roasted groundnuts (peanuts)', snacks_calories: 160, snacks_protein: 7, snacks_carbs: 6, snacks_fat: 14 },
      { day_of_week: 'wednesday', breakfast: 'Boiled yam with egg sauce', breakfast_calories: 400, breakfast_protein: 18, breakfast_carbs: 60, breakfast_fat: 10, lunch: 'Beans porridge with fried plantain', lunch_calories: 520, lunch_protein: 22, lunch_carbs: 80, lunch_fat: 12, dinner: 'Efo Riro (spinach stew) with beef and pounded yam', dinner_calories: 560, dinner_protein: 32, dinner_carbs: 65, dinner_fat: 20, snacks: 'Boiled corn on the cob', snacks_calories: 120, snacks_protein: 4, snacks_carbs: 26, snacks_fat: 2 },
      { day_of_week: 'thursday',  breakfast: 'Moi Moi with custard', breakfast_calories: 350, breakfast_protein: 18, breakfast_carbs: 46, breakfast_fat: 8, lunch: 'Ofada rice with ayamase stew and boiled egg', lunch_calories: 580, lunch_protein: 28, lunch_carbs: 72, lunch_fat: 18, dinner: 'Chicken pepper soup with boiled yam', dinner_calories: 460, dinner_protein: 36, dinner_carbs: 44, dinner_fat: 12, snacks: 'Tiger nuts', snacks_calories: 130, snacks_protein: 2, snacks_carbs: 18, snacks_fat: 6 },
      { day_of_week: 'friday',    breakfast: 'Sweet potato porridge with groundnut oil', breakfast_calories: 370, breakfast_protein: 8, breakfast_carbs: 64, breakfast_fat: 8, lunch: 'Nigerian fried rice with turkey and coleslaw', lunch_calories: 560, lunch_protein: 30, lunch_carbs: 68, lunch_fat: 16, dinner: 'Afang soup with fufu and beef', dinner_calories: 540, dinner_protein: 30, dinner_carbs: 62, dinner_fat: 20, snacks: 'Banana smoothie with milk', snacks_calories: 180, snacks_protein: 6, snacks_carbs: 32, snacks_fat: 4 },
      { day_of_week: 'saturday',  breakfast: 'Custard with evaporated milk and banana', breakfast_calories: 340, breakfast_protein: 10, breakfast_carbs: 56, breakfast_fat: 8, lunch: 'Grilled fish with boiled plantain and pepper sauce', lunch_calories: 520, lunch_protein: 36, lunch_carbs: 58, lunch_fat: 14, dinner: 'Oha soup with eba and goat meat', dinner_calories: 560, dinner_protein: 34, dinner_carbs: 64, dinner_fat: 18, snacks: 'Puff puff (2 small pieces)', snacks_calories: 190, snacks_protein: 3, snacks_carbs: 26, snacks_fat: 8 },
      { day_of_week: 'sunday',    breakfast: 'Yam and egg sauce with vegetables', breakfast_calories: 420, breakfast_protein: 16, breakfast_carbs: 68, breakfast_fat: 10, lunch: 'Jollof spaghetti with chicken and vegetables', lunch_calories: 540, lunch_protein: 28, lunch_carbs: 72, lunch_fat: 14, dinner: 'Groundnut soup with swallow and assorted meat', dinner_calories: 580, dinner_protein: 32, dinner_carbs: 68, dinner_fat: 22, snacks: 'Fresh pineapple chunks', snacks_calories: 100, snacks_protein: 1, snacks_carbs: 26, snacks_fat: 0 },
    ];
  }

  return [
    { day_of_week: 'monday',    breakfast: 'Greek yogurt parfait with mixed berries and granola', breakfast_calories: 310, breakfast_protein: 20, breakfast_carbs: 38, breakfast_fat: 8, lunch: 'Grilled chicken salad with olive oil vinaigrette', lunch_calories: 370, lunch_protein: 35, lunch_carbs: 12, lunch_fat: 14, dinner: 'Baked salmon with roasted broccoli and sweet potato', dinner_calories: 450, dinner_protein: 38, dinner_carbs: 28, dinner_fat: 16, snacks: 'Apple with almond butter', snacks_calories: 190, snacks_protein: 4, snacks_carbs: 24, snacks_fat: 10 },
    { day_of_week: 'tuesday',   breakfast: 'Oatmeal with banana, chia seeds and cinnamon', breakfast_calories: 340, breakfast_protein: 12, breakfast_carbs: 58, breakfast_fat: 7, lunch: 'Turkey wrap with lettuce, tomato and mustard on wholegrain', lunch_calories: 380, lunch_protein: 32, lunch_carbs: 34, lunch_fat: 10, dinner: 'Stir-fried tofu with mixed vegetables and brown rice', dinner_calories: 420, dinner_protein: 22, dinner_carbs: 52, dinner_fat: 12, snacks: 'Carrot sticks with hummus', snacks_calories: 140, snacks_protein: 5, snacks_carbs: 18, snacks_fat: 6 },
    { day_of_week: 'wednesday', breakfast: 'Scrambled eggs with spinach and wholegrain toast', breakfast_calories: 320, breakfast_protein: 22, breakfast_carbs: 28, breakfast_fat: 12, lunch: 'Lentil soup with a side salad', lunch_calories: 360, lunch_protein: 18, lunch_carbs: 48, lunch_fat: 8, dinner: 'Chicken breast with quinoa and steamed green beans', dinner_calories: 460, dinner_protein: 44, dinner_carbs: 38, dinner_fat: 10, snacks: 'Mixed nuts (1 small handful)', snacks_calories: 160, snacks_protein: 5, snacks_carbs: 6, snacks_fat: 14 },
    { day_of_week: 'thursday',  breakfast: 'Green protein smoothie (spinach, banana, protein powder)', breakfast_calories: 295, breakfast_protein: 28, breakfast_carbs: 32, breakfast_fat: 5, lunch: 'Tuna salad on wholegrain with cucumber', lunch_calories: 360, lunch_protein: 34, lunch_carbs: 28, lunch_fat: 10, dinner: 'Lean beef stir-fry with cauliflower rice', dinner_calories: 420, dinner_protein: 38, dinner_carbs: 20, dinner_fat: 18, snacks: 'Boiled egg with cucumber slices', snacks_calories: 120, snacks_protein: 7, snacks_carbs: 3, snacks_fat: 7 },
    { day_of_week: 'friday',    breakfast: 'Avocado toast with poached egg on wholegrain', breakfast_calories: 380, breakfast_protein: 16, breakfast_carbs: 34, breakfast_fat: 20, lunch: 'Grilled shrimp over mixed greens with avocado', lunch_calories: 360, lunch_protein: 30, lunch_carbs: 14, lunch_fat: 20, dinner: 'Baked cod with roasted asparagus and brown rice', dinner_calories: 430, dinner_protein: 40, dinner_carbs: 38, dinner_fat: 8, snacks: 'Cottage cheese with pineapple chunks', snacks_calories: 155, snacks_protein: 18, snacks_carbs: 16, snacks_fat: 4 },
    { day_of_week: 'saturday',  breakfast: 'Veggie omelette with mushrooms, peppers and feta', breakfast_calories: 330, breakfast_protein: 24, breakfast_carbs: 8, breakfast_fat: 22, lunch: 'Chicken and vegetable minestrone soup', lunch_calories: 340, lunch_protein: 28, lunch_carbs: 30, lunch_fat: 8, dinner: 'Grilled steak with roasted root vegetables', dinner_calories: 490, dinner_protein: 44, dinner_carbs: 28, dinner_fat: 20, snacks: 'Rice cake with peanut butter', snacks_calories: 185, snacks_protein: 6, snacks_carbs: 22, snacks_fat: 9 },
    { day_of_week: 'sunday',    breakfast: 'Chia pudding with mango and coconut', breakfast_calories: 300, breakfast_protein: 10, breakfast_carbs: 44, breakfast_fat: 11, lunch: 'Roasted vegetable and feta salad with quinoa', lunch_calories: 380, lunch_protein: 16, lunch_carbs: 44, lunch_fat: 16, dinner: 'Herb-baked chicken thighs with roasted broccoli', dinner_calories: 440, dinner_protein: 42, dinner_carbs: 12, dinner_fat: 22, snacks: 'Fresh fruit salad', snacks_calories: 110, snacks_protein: 2, snacks_carbs: 28, snacks_fat: 1 },
  ];
}