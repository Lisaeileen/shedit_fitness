import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, CheckCircle } from 'lucide-react';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

// Built-in nutrition lookup using a local database of common foods
// (no external API or SDK required)
const FOOD_DB = {
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, serving_size: '100g' },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, serving_size: '100g' },
  'egg': { calories: 78, protein: 6, carbs: 0.6, fat: 5, serving_size: '1 large egg' },
  'banana': { calories: 89, protein: 1, carbs: 23, fat: 0.3, serving_size: '1 medium' },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving_size: '1 medium' },
  'rice': { calories: 206, protein: 4, carbs: 45, fat: 0.4, serving_size: '1 cup cooked' },
  'pasta': { calories: 220, protein: 8, carbs: 43, fat: 1.3, serving_size: '1 cup cooked' },
  'bread': { calories: 79, protein: 3, carbs: 15, fat: 1, serving_size: '1 slice' },
  'milk': { calories: 149, protein: 8, carbs: 12, fat: 8, serving_size: '1 cup' },
  'yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0.7, serving_size: '1 cup' },
  'salmon': { calories: 208, protein: 28, carbs: 0, fat: 10, serving_size: '100g' },
  'tuna': { calories: 132, protein: 29, carbs: 0, fat: 1, serving_size: '100g' },
  'broccoli': { calories: 55, protein: 4, carbs: 11, fat: 0.6, serving_size: '1 cup' },
  'avocado': { calories: 320, protein: 4, carbs: 17, fat: 29, serving_size: '1 whole' },
  'almonds': { calories: 164, protein: 6, carbs: 6, fat: 14, serving_size: '1 oz (28g)' },
  'olive oil': { calories: 119, protein: 0, carbs: 0, fat: 14, serving_size: '1 tbsp' },
  'cheese': { calories: 113, protein: 7, carbs: 0.4, fat: 9, serving_size: '1 oz' },
  'steak': { calories: 271, protein: 26, carbs: 0, fat: 18, serving_size: '100g' },
  'pizza': { calories: 285, protein: 12, carbs: 36, fat: 10, serving_size: '1 slice' },
  'burger': { calories: 540, protein: 34, carbs: 40, fat: 25, serving_size: '1 burger' },
};

function lookupFood(name) {
  const key = name.toLowerCase().trim();
  // exact match
  if (FOOD_DB[key]) return FOOD_DB[key];
  // partial match
  for (const [k, v] of Object.entries(FOOD_DB)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

export default function AddFoodDialog({ isOpen, onClose, onSave, mealType = 'snack', date }) {
  const [foodName, setFoodName] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(mealType);
  const [serving, setServing] = useState('1 serving');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleLookup = () => {
    if (!foodName.trim()) return;
    setLoading(true);
    setAiSuggested(false);
    // Simulate brief "lookup" delay for UX
    setTimeout(() => {
      const found = lookupFood(foodName);
      if (found) {
        setCalories(String(Math.round(found.calories)));
        setCarbs(String(Math.round(found.carbs)));
        setProtein(String(Math.round(found.protein)));
        setFat(String(Math.round(found.fat)));
        setServing(found.serving_size);
        setAiSuggested(true);
      }
      setLoading(false);
    }, 400);
  };

  const handleSave = () => {
    if (!foodName.trim()) return;
    onSave({
      date,
      meal_type: selectedMeal,
      food_name: foodName,
      serving_size: serving,
      calories: Number(calories) || 0,
      carbs:    Number(carbs)    || 0,
      protein:  Number(protein)  || 0,
      fat:      Number(fat)      || 0,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFoodName(''); setCalories(''); setCarbs('');
    setProtein(''); setFat(''); setAiSuggested(false);
    setServing('1 serving');
  };

  const handleClose = () => { resetForm(); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[70]" />
          <motion.div
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto">
            <div className="bg-[#111C16] rounded-t-3xl pt-5 pb-10 border-t border-white/[0.07] max-h-[90vh] overflow-y-auto">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
              <div className="px-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Add Food</h3>
                  <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Meal type tabs */}
                <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
                  {MEAL_TYPES.map(type => (
                    <button key={type} onClick={() => setSelectedMeal(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all
                        ${selectedMeal === type ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/[0.04] text-gray-500'}`}>
                      {type}
                    </button>
                  ))}
                </div>

                {/* Food name with lookup */}
                <div className="relative mb-3">
                  <input
                    className="input-dark pr-12"
                    placeholder="Food name (e.g. Chicken breast, 200g)"
                    value={foodName}
                    onChange={(e) => { setFoodName(e.target.value); setAiSuggested(false); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  />
                  <button onClick={handleLookup} disabled={loading || !foodName.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: aiSuggested ? 'rgba(74,222,128,0.2)' : 'rgba(168,85,247,0.2)' }}>
                    {loading
                      ? <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                      : aiSuggested
                        ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        : <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    }
                  </button>
                </div>

                {aiSuggested && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px] text-green-400 mb-3 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Nutrition filled — edit if needed
                  </motion.p>
                )}

                <input className="input-dark mb-3" placeholder="Serving size (e.g. 1 cup, 100g)"
                  value={serving} onChange={(e) => setServing(e.target.value)} />

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Calories', key: 'calories', val: calories, set: setCalories, color: '#a855f7', unit: 'kcal' },
                    { label: 'Protein',  key: 'protein',  val: protein,  set: setProtein,  color: '#ec4899', unit: 'g' },
                    { label: 'Carbs',    key: 'carbs',    val: carbs,    set: setCarbs,    color: '#3b82f6', unit: 'g' },
                    { label: 'Fat',      key: 'fat',      val: fat,      set: setFat,      color: '#f59e0b', unit: 'g' },
                  ].map(f => (
                    <div key={f.key} className="glass-card rounded-xl p-3">
                      <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: f.color }}>{f.label}</label>
                      <div className="flex items-baseline gap-1 mt-1">
                        <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)}
                          placeholder="0" className="bg-transparent text-white text-xl font-bold outline-none w-full" />
                        <span className="text-xs text-gray-500">{f.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleSave} disabled={!foodName.trim()} className="btn-primary">
                  Add to {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}