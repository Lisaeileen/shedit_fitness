import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AddFoodDialog({ isOpen, onClose, onSave, mealType, date }) {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  const handleAILookup = async () => {
    if (!foodName.trim()) return;
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Estimate the nutritional info for this food: "${foodName}". Return a single serving's data.`,
      response_json_schema: {
        type: "object",
        properties: {
          calories: { type: "number" },
          carbs: { type: "number" },
          protein: { type: "number" },
          fat: { type: "number" },
          serving_size: { type: "string" }
        }
      }
    });
    setCalories(String(result.calories || 0));
    setCarbs(String(result.carbs || 0));
    setProtein(String(result.protein || 0));
    setFat(String(result.fat || 0));
    setLoading(false);
    setAiMode(false);
  };

  const handleSave = () => {
    onSave({
      date,
      meal_type: mealType,
      food_name: foodName,
      calories: Number(calories) || 0,
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
    });
    setFoodName(''); setCalories(''); setCarbs(''); setProtein(''); setFat('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
          >
            <div className="bg-[#1a1a1a] rounded-3xl p-6 max-w-lg mx-auto border border-white/[0.06]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white capitalize">Add to {mealType}</h3>
                <button onClick={onClose} className="p-2 rounded-full bg-white/[0.06]">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    placeholder="Food name (e.g. Grilled Chicken)"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-gray-500 pr-10"
                  />
                  <button 
                    onClick={handleAILookup}
                    disabled={loading || !foodName.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-40"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Calories</label>
                    <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="0" className="bg-white/[0.04] border-white/[0.08] text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Protein (g)</label>
                    <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="0" className="bg-white/[0.04] border-white/[0.08] text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Carbs (g)</label>
                    <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="0" className="bg-white/[0.04] border-white/[0.08] text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Fat (g)</label>
                    <Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="0" className="bg-white/[0.04] border-white/[0.08] text-white mt-1" />
                  </div>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={!foodName.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl h-12 mt-2"
                >
                  Add Food
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}