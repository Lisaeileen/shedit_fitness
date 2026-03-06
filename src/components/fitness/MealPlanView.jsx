import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPlanView({ goals, mealPlans = [], onRefresh }) {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [generating, setGenerating] = useState(false);

  const dayPlan = mealPlans.find(p => p.day_of_week === selectedDay);

  const generatePlan = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a healthy meal plan for one full week. The user's goal is: ${goals?.primary_goal || 'eat healthy'}. 
      Daily calorie target: ${goals?.daily_calorie_target || 2000} kcal.
      For each day provide breakfast, lunch, dinner, and snacks with estimated calories.
      Make it realistic, delicious, and varied.`,
      response_json_schema: {
        type: "object",
        properties: {
          days: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day_of_week: { type: "string" },
                breakfast: { type: "string" },
                breakfast_calories: { type: "number" },
                lunch: { type: "string" },
                lunch_calories: { type: "number" },
                dinner: { type: "string" },
                dinner_calories: { type: "number" },
                snacks: { type: "string" },
                snacks_calories: { type: "number" }
              }
            }
          }
        }
      }
    });

    if (result.days) {
      for (const day of result.days) {
        await base44.entities.MealPlan.create(day);
      }
    }
    setGenerating(false);
    onRefresh?.();
  };

  const mealItems = [
    { key: 'breakfast', label: 'Breakfast', emoji: '🌅', calKey: 'breakfast_calories' },
    { key: 'lunch', label: 'Lunch', emoji: '☀️', calKey: 'lunch_calories' },
    { key: 'dinner', label: 'Dinner', emoji: '🌙', calKey: 'dinner_calories' },
    { key: 'snacks', label: 'Snacks', emoji: '🍎', calKey: 'snacks_calories' },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Plan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Your personalized meal plan</p>
        </div>
        <Button 
          onClick={generatePlan} 
          disabled={generating}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-xs h-9"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
          {mealPlans.length > 0 ? 'Regenerate' : 'Generate Plan'}
        </Button>
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${selectedDay === day 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]'
              }`}
          >
            {DAY_LABELS[i]}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      {dayPlan ? (
        <div className="space-y-3">
          {mealItems.map((meal, i) => (
            <motion.div
              key={meal.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{meal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{meal.label}</h4>
                    <span className="text-xs text-purple-400">{dayPlan[meal.calKey] || 0} kcal</span>
                  </div>
                  <p className="text-sm text-white mt-1 leading-relaxed">{dayPlan[meal.key] || 'Not planned yet'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl p-10 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No plan for {selectedDay}</h3>
          <p className="text-xs text-gray-500 mb-4">Generate a plan to get started</p>
        </motion.div>
      )}
    </div>
  );
}