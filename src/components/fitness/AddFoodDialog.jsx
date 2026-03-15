import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Search, Mic, MicOff, Camera, Plus, Minus, Sparkles, ScanLine, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const FOOD_DB = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Chicken Salad', calories: 290, protein: 28, carbs: 8, fat: 16, serving: '1 bowl' },
  { name: 'Chicken Wrap', calories: 380, protein: 30, carbs: 34, fat: 12, serving: '1 wrap' },
  { name: 'Grilled Chicken', calories: 187, protein: 35, carbs: 0, fat: 4, serving: '100g' },
  { name: 'Chicken Alfredo', calories: 596, protein: 34, carbs: 48, fat: 22, serving: '1 serving' },
  { name: 'Oats / Porridge', calories: 389, protein: 17, carbs: 66, fat: 7, serving: '100g dry' },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 medium' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 medium' },
  { name: 'Egg (boiled)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large' },
  { name: 'Scrambled Eggs', calories: 182, protein: 13, carbs: 2, fat: 13, serving: '2 eggs' },
  { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked' },
  { name: 'White Rice', calories: 206, protein: 4.3, carbs: 44.5, fat: 0.4, serving: '1 cup cooked' },
  { name: 'Pasta', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup cooked' },
  { name: 'Whole Grain Bread', calories: 79, protein: 3.5, carbs: 15, fat: 1, serving: '1 slice' },
  { name: 'Salmon Fillet', calories: 208, protein: 28, carbs: 0, fat: 10, serving: '100g' },
  { name: 'Tuna (canned)', calories: 132, protein: 29, carbs: 0, fat: 1, serving: '100g' },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '1 cup' },
  { name: 'Milk (whole)', calories: 149, protein: 8, carbs: 12, fat: 8, serving: '1 cup' },
  { name: 'Avocado', calories: 320, protein: 4, carbs: 17, fat: 29, serving: '1 whole' },
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz (28g)' },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '1 cup' },
  { name: 'Lettuce', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, serving: '1 cup' },
  { name: 'Bell Pepper', calories: 31, protein: 1, carbs: 7, fat: 0.3, serving: '1 medium' },
  { name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium' },
  { name: 'Steak (beef)', calories: 271, protein: 26, carbs: 0, fat: 18, serving: '100g' },
  { name: 'Beef Burger', calories: 540, protein: 34, carbs: 40, fat: 25, serving: '1 burger' },
  { name: 'Peanut Butter', calories: 190, protein: 7, carbs: 6, fat: 16, serving: '2 tbsp' },
  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9, serving: '1 oz' },
  { name: 'Pizza (cheese)', calories: 285, protein: 12, carbs: 36, fat: 10, serving: '1 slice' },
  { name: 'Caesar Salad', calories: 290, protein: 9, carbs: 18, fat: 21, serving: '1 serving' },
  { name: 'Protein Shake', calories: 160, protein: 30, carbs: 8, fat: 3, serving: '1 scoop' },
  { name: 'Orange Juice', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, serving: '1 cup' },
  { name: 'Coffee (black)', calories: 5, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup' },
  { name: 'Blueberries', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, serving: '1 cup' },
  { name: 'Strawberries', calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: '1 cup' },
  { name: 'Cottage Cheese', calories: 206, protein: 25, carbs: 8.2, fat: 9, serving: '1 cup' },
  { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.5, serving: '1 cup cooked' },
  { name: 'Lentils', calories: 230, protein: 18, carbs: 40, fat: 0.8, serving: '1 cup cooked' },
  { name: 'Black Beans', calories: 227, protein: 15, carbs: 41, fat: 0.9, serving: '1 cup cooked' },
  { name: 'Hummus', calories: 166, protein: 8, carbs: 18, fat: 8, serving: '1/4 cup' },
  { name: 'Tofu (firm)', calories: 144, protein: 17, carbs: 3, fat: 8, serving: '1/2 cup' },
  { name: 'Turkey Breast', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g' },
  { name: 'Shrimp', calories: 99, protein: 24, carbs: 0, fat: 0.3, serving: '100g' },
  { name: 'Mango', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, serving: '1 cup' },
  { name: 'Watermelon', calories: 46, protein: 0.9, carbs: 11, fat: 0.2, serving: '1 cup' },
  { name: 'Orange', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, serving: '1 medium' },
  { name: 'Pineapple', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, serving: '1 cup' },
];

function searchFoods(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8);
}

// ── Inline input style to guarantee visibility ────────────────────────────────
const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(168,85,247,0.3)',
  borderRadius: 12,
  padding: '11px 14px',
  width: '100%',
  outline: 'none',
  fontSize: 15,
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
  caretColor: '#a855f7',
  WebkitAppearance: 'none',
  appearance: 'none',
};

const inputStyleSm = {
  ...inputStyle,
  padding: '9px 12px',
  fontSize: 14,
};

// ── AI Scan Review/Edit Screen ─────────────────────────────────────────────────
function AIScanReviewScreen({ foods: initialFoods, capturedImage, lowConfidence, onSaveAll, onClose }) {
  const [foods, setFoods] = useState(initialFoods);
  const [editIdx, setEditIdx] = useState(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [addSuggestions, setAddSuggestions] = useState([]);
  const [addCustom, setAddCustom] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', portion: '1 serving' });

  const totals = foods.reduce((acc, f) => ({
    calories: acc.calories + (Number(f.calories) || 0),
    protein_g: acc.protein_g + (Number(f.protein_g) || 0),
    carbs_g: acc.carbs_g + (Number(f.carbs_g) || 0),
    fat_g: acc.fat_g + (Number(f.fat_g) || 0),
  }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });

  const removeFood = (idx) => setFoods(f => f.filter((_, i) => i !== idx));

  const updateFood = (idx, field, value) => {
    setFoods(f => f.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddSearch = (val) => {
    setAddSearch(val);
    setAddSuggestions(val.length >= 2 ? searchFoods(val) : []);
  };

  const addFromDB = (food) => {
    setFoods(f => [...f, { name: food.name, portion: food.serving, calories: food.calories, protein_g: food.protein, carbs_g: food.carbs, fat_g: food.fat }]);
    setAddSearch(''); setAddSuggestions([]); setShowAddFood(false);
  };

  const addCustomFood = () => {
    if (!addCustom.name.trim()) return;
    setFoods(f => [...f, {
      name: addCustom.name,
      portion: addCustom.portion,
      calories: Number(addCustom.calories) || 0,
      protein_g: Number(addCustom.protein) || 0,
      carbs_g: Number(addCustom.carbs) || 0,
      fat_g: Number(addCustom.fat) || 0,
    }]);
    setAddCustom({ name: '', calories: '', protein: '', carbs: '', fat: '', portion: '1 serving' });
    setShowAddFood(false);
  };

  return (
    <div className="fixed inset-0 z-[85] flex flex-col no-scrollbar" style={{ background: '#120630' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(168,85,247,0.15)' }}>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <p className="text-sm font-bold text-white">Review AI Scan</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
        {/* Captured image thumbnail */}
        {capturedImage && (
          <img src={capturedImage} alt="meal" className="w-full rounded-2xl object-cover mb-4" style={{ maxHeight: 180 }} />
        )}

        {lowConfidence && (
          <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <p className="text-xs text-amber-400">Food may not be fully detected. Please review and edit.</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">{foods.length} item{foods.length !== 1 ? 's' : ''} detected</p>
          <button onClick={() => setShowAddFood(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(168,85,247,0.18)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
            <Plus className="w-3.5 h-3.5" /> Add Food
          </button>
        </div>

        {/* Food items */}
        <div className="space-y-2.5 mb-4">
          {foods.map((food, idx) => (
            <motion.div key={idx} layout className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: editIdx === idx ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.08)' }}>
              {editIdx === idx ? (
                // Edit mode
                <div className="space-y-2.5">
                  <input
                    style={inputStyleSm}
                    placeholder="Food name"
                    value={food.name}
                    onChange={e => updateFood(idx, 'name', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Calories', field: 'calories', color: '#a855f7', unit: 'kcal' },
                      { label: 'Protein',  field: 'protein_g', color: '#ec4899', unit: 'g' },
                      { label: 'Carbs',    field: 'carbs_g',  color: '#3b82f6', unit: 'g' },
                      { label: 'Fat',      field: 'fat_g',    color: '#f59e0b', unit: 'g' },
                    ].map(m => (
                      <div key={m.field} className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: m.color }}>{m.label}</p>
                        <div className="flex items-baseline gap-1">
                          <input
                            type="number"
                            inputMode="decimal"
                            style={{ ...inputStyleSm, padding: '4px 0', background: 'transparent', border: 'none', fontSize: 18, fontWeight: 700, width: '100%' }}
                            value={food[m.field]}
                            onChange={e => updateFood(idx, m.field, e.target.value)}
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">{m.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <input
                    style={inputStyleSm}
                    placeholder="Portion (e.g. 150g, 1 cup)"
                    value={food.portion}
                    onChange={e => updateFood(idx, 'portion', e.target.value)}
                  />
                  <button onClick={() => setEditIdx(null)}
                    className="w-full py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'rgba(168,85,247,0.25)', border: '1px solid rgba(168,85,247,0.4)' }}>
                    Done Editing
                  </button>
                </div>
              ) : (
                // View mode
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.portion}</p>
                    </div>
                    <div className="flex gap-1.5 ml-2 flex-shrink-0">
                      <button onClick={() => setEditIdx(idx)}
                        className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                      </button>
                      <button onClick={() => removeFood(idx)}
                        className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { l: 'Cal', v: food.calories, c: '#a855f7', u: 'kcal' },
                      { l: 'P', v: food.protein_g, c: '#ec4899', u: 'g' },
                      { l: 'C', v: food.carbs_g, c: '#3b82f6', u: 'g' },
                      { l: 'F', v: food.fat_g, c: '#f59e0b', u: 'g' },
                    ].map(m => (
                      <div key={m.l}>
                        <p className="text-xs font-black" style={{ color: m.c }}>{Math.round(Number(m.v) || 0)}<span className="text-[9px] font-normal">{m.u}</span></p>
                        <p className="text-[9px] text-gray-600">{m.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add Food Panel */}
        <AnimatePresence>
          {showAddFood && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-white">Add Missing Food</p>
                <button onClick={() => { setShowAddFood(false); setAddSearch(''); setAddSuggestions([]); }}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50 pointer-events-none" />
                <input
                  style={{ ...inputStyleSm, paddingLeft: 36 }}
                  placeholder="Search food database..."
                  value={addSearch}
                  onChange={e => handleAddSearch(e.target.value)}
                  autoComplete="off"
                />
                {addSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10 shadow-2xl"
                    style={{ background: '#1E0840', border: '1px solid rgba(168,85,247,0.2)' }}>
                    {addSuggestions.map((s, i) => (
                      <button key={i} onMouseDown={e => { e.preventDefault(); addFromDB(s); }}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                        style={{ borderBottom: i < addSuggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div>
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-[11px] text-purple-300/50">{s.serving} · P:{s.protein}g C:{s.carbs}g F:{s.fat}g</p>
                        </div>
                        <span className="text-xs font-bold text-purple-400 ml-2">{s.calories} kcal</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Manual custom entry */}
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Or enter manually</p>
              <input style={inputStyleSm} placeholder="Food name" value={addCustom.name}
                onChange={e => setAddCustom(a => ({ ...a, name: e.target.value }))} className="mb-2" />
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[
                  { label: 'Calories', field: 'calories', color: '#a855f7' },
                  { label: 'Protein',  field: 'protein',  color: '#ec4899' },
                  { label: 'Carbs',    field: 'carbs',    color: '#3b82f6' },
                  { label: 'Fat',      field: 'fat',      color: '#f59e0b' },
                ].map(m => (
                  <div key={m.field}>
                    <p className="text-[10px] mb-1 font-bold" style={{ color: m.color }}>{m.label}</p>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      style={inputStyleSm}
                      placeholder="0"
                      value={addCustom[m.field]}
                      onChange={e => {
                        const v = e.target.value;
                        if (v === '' || /^\d*\.?\d*$/.test(v)) setAddCustom(a => ({ ...a, [m.field]: v }));
                      }}
                    />
                  </div>
                ))}
              </div>
              <button onClick={addCustomFood} disabled={!addCustom.name.trim()}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white mt-1"
                style={{ background: addCustom.name.trim() ? 'rgba(168,85,247,0.35)' : 'rgba(255,255,255,0.05)', color: addCustom.name.trim() ? '#e9d5ff' : '#4b5563' }}>
                Add to List
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Totals */}
        {foods.length > 0 && (
          <div className="rounded-2xl p-4 mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(168,85,247,0.3)' }}>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Meal Total</p>
            <div className="flex gap-4">
              {[
                { l: 'Calories', v: totals.calories, c: '#a855f7', u: 'kcal' },
                { l: 'Protein',  v: totals.protein_g, c: '#ec4899', u: 'g' },
                { l: 'Carbs',    v: totals.carbs_g,  c: '#3b82f6', u: 'g' },
                { l: 'Fat',      v: totals.fat_g,    c: '#f59e0b', u: 'g' },
              ].map(m => (
                <div key={m.l}>
                  <p className="text-base font-black" style={{ color: m.c }}>{Math.round(m.v)}<span className="text-xs font-normal">{m.u}</span></p>
                  <p className="text-[10px] text-gray-500">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="px-5 pb-10 pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}>
        <button onClick={() => onSaveAll(foods)} disabled={foods.length === 0} className="btn-primary">
          Log {foods.length} Item{foods.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

// ── AI Scan Camera ─────────────────────────────────────────────────────────────
function AIScanModal({ onConfirm, onClose }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [phase, setPhase] = useState('camera');
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedFoods, setDetectedFoods] = useState([]);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        streamRef.current = s;
        if (videoRef.current) { videoRef.current.srcObject = s; }
      })
      .catch(() => setError('Camera access denied. Please enable camera permissions.'));
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setPhase('analyzing');

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'meal.jpg', { type: 'image/jpeg' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a precise nutrition analysis assistant. Carefully analyze this food image and identify EVERY distinct food item visible.

Be very specific about each item:
- "Grilled Chicken Breast" not "meat"
- "Brown Rice" or "White Rice" not "grain"
- "Romaine Lettuce" not "vegetables"
- "Bell Pepper (red)" not "pepper"
- Count individual items like eggs (e.g. "3 Boiled Eggs")

For EACH food item provide:
- name: specific food name
- portion: estimated portion size (e.g. "150g", "1 cup", "3 eggs")
- calories: estimated kcal for this portion
- protein_g: protein in grams
- carbs_g: carbohydrates in grams
- fat_g: fat in grams

Be as accurate as possible. If the image is unclear, still do your best to identify foods.`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            foods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  portion: { type: 'string' },
                  calories: { type: 'number' },
                  protein_g: { type: 'number' },
                  carbs_g: { type: 'number' },
                  fat_g: { type: 'number' },
                }
              }
            },
            confidence: { type: 'string' },
          }
        }
      });

      const foods = (result.foods || []).filter(f => f.name);
      setDetectedFoods(foods.length > 0 ? foods : [{ name: 'Unknown Food', portion: '1 serving', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }]);
      setLowConfidence(result.confidence === 'low' || foods.length === 0);
      setPhase('review');
    } catch {
      setDetectedFoods([{ name: 'Meal (unidentified)', portion: '1 serving', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }]);
      setLowConfidence(true);
      setPhase('review');
    }
  };

  if (phase === 'review') {
    return (
      <AIScanReviewScreen
        foods={detectedFoods}
        capturedImage={capturedImage}
        lowConfidence={lowConfidence}
        onSaveAll={onConfirm}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: '#000' }}>
      <div className="flex items-center justify-between p-4 pt-10 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <p className="text-sm font-bold text-white">AI Meal Scan</p>
        </div>
        <div className="w-9" />
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <Camera className="w-12 h-12 text-gray-500 mb-4" />
          <p className="text-white font-bold mb-2">Camera unavailable</p>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button onClick={onClose} className="btn-primary max-w-xs">Go Back</button>
        </div>
      ) : phase === 'camera' ? (
        <>
          <div className="flex-1 relative overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-purple-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-purple-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-purple-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-purple-400 rounded-br-xl" />
              </div>
            </div>
            <p className="absolute bottom-8 left-0 right-0 text-center text-sm text-white/70">Center your meal in the frame</p>
          </div>
          <div className="pb-12 pt-6 flex justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <motion.button whileTap={{ scale: 0.92 }} onClick={capture}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 32px rgba(168,85,247,0.6)' }}>
              <Camera className="w-8 h-8 text-white" />
            </motion.button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          {capturedImage && (
            <img src={capturedImage} alt="captured" className="w-full max-w-xs rounded-2xl object-cover" style={{ maxHeight: 260 }} />
          )}
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          <div className="text-center">
            <p className="text-white font-bold mb-1">Analyzing your meal...</p>
            <p className="text-sm text-purple-300/60">AI is detecting foods and estimating nutrition</p>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ── Voice modal ────────────────────────────────────────────────────────────────
function VoiceModal({ onResult, onClose }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError('Speech recognition not supported on this browser.'); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = true;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t); transcriptRef.current = t;
    };
    rec.onend = () => { setListening(false); if (transcriptRef.current) lookupTranscript(transcriptRef.current); };
    rec.onerror = () => { setListening(false); setError('Could not capture audio.'); };
    recognitionRef.current = rec;
    rec.start(); setListening(true); setError('');
  };

  const stop = () => recognitionRef.current?.stop();

  const lookupTranscript = (text) => {
    setSearching(true);
    const results = searchFoods(text.split(' ').find(w => w.length > 3) || text);
    const found = results[0] || { name: text, calories: 200, protein: 10, carbs: 20, fat: 8, serving: '1 serving' };
    setTimeout(() => {
      setSearching(false);
      onResult({ food_name: found.name, calories: found.calories, protein: found.protein, carbs: found.carbs, fat: found.fat, serving_size: found.serving });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #12062A, #2A0A4A)' }}>
      <button onClick={onClose} className="absolute top-10 left-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
        <X className="w-5 h-5 text-white" />
      </button>
      <div className="text-center mb-10">
        <h3 className="text-xl font-black text-white mb-1">Voice Log</h3>
        <p className="text-sm text-purple-300/60">Say what you ate, e.g. "Chicken salad with avocado"</p>
      </div>
      <motion.button whileTap={{ scale: 0.93 }} onClick={listening ? stop : start}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
        animate={listening ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ background: listening ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: listening ? '0 0 48px rgba(244,63,94,0.4)' : '0 0 32px rgba(168,85,247,0.4)' }}>
        {listening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
      </motion.button>
      {transcript ? (
        <div className="glass-card rounded-2xl p-4 w-full max-w-sm mb-4 text-center">
          <p className="text-sm text-purple-300/60 mb-1">Heard:</p>
          <p className="text-white font-semibold">"{transcript}"</p>
        </div>
      ) : (
        <p className="text-sm text-purple-300/40 mb-4">{listening ? 'Listening...' : 'Tap mic to start'}</p>
      )}
      {searching && <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />}
      {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
    </div>
  );
}

// ── Barcode Scanner ────────────────────────────────────────────────────────────
function BarcodeScanModal({ onConfirm, onClose }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [phase, setPhase] = useState('camera');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [scanAttempts, setScanAttempts] = useState(0);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        streamRef.current = s;
        if (videoRef.current) { videoRef.current.srcObject = s; }
      })
      .catch(() => setError('Camera access denied. Please enter barcode manually.'));
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const lookupBarcode = async (barcode) => {
    if (!barcode || barcode.length < 8) return;
    setPhase('looking');
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      const n = p.nutriments || {};
      setProduct({
        food_name: p.product_name || 'Unknown Product',
        calories: Math.round(n['energy-kcal_serving'] || n['energy-kcal'] || 0),
        protein: Math.round(n.proteins_serving || n.proteins || 0),
        carbs: Math.round(n.carbohydrates_serving || n.carbohydrates || 0),
        fat: Math.round(n.fat_serving || n.fat || 0),
        serving_size: p.serving_size || '100g',
      });
      setPhase('found');
    } else {
      setPhase('notfound');
    }
  };

  const captureAndDecode = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setScanAttempts(n => n + 1);
    const { file_url } = await base44.integrations.Core.UploadFile({
      file: await (async () => { const r = await fetch(dataUrl); const b = await r.blob(); return new File([b], 'barcode.jpg', { type: 'image/jpeg' }); })()
    });
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: 'Extract barcode/QR code number from image. Return ONLY digits, nothing else. If none visible, return "none".',
      file_urls: [file_url],
      response_json_schema: { type: 'object', properties: { barcode: { type: 'string' } } }
    });
    const code = result?.barcode?.replace(/\D/g, '');
    if (code && code.length >= 8) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      await lookupBarcode(code);
    }
  };

  useEffect(() => {
    if (!error) {
      const t = setTimeout(() => { intervalRef.current = setInterval(captureAndDecode, 3000); }, 1500);
      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: '#000' }}>
      <div className="flex items-center justify-between p-4 pt-10 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-purple-400" />
          <p className="text-sm font-bold text-white">Barcode Scanner</p>
        </div>
        <div className="w-9" />
      </div>

      {phase === 'camera' && (
        <>
          <div className="flex-1 relative overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-36">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-purple-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-purple-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-purple-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-purple-400 rounded-br-xl" />
                <motion.div className="absolute left-0 right-0 h-0.5 bg-purple-400"
                  animate={{ top: ['10%', '90%', '10%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </div>
            </div>
            {scanAttempts > 0 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <p className="text-xs text-white">Scanning for barcode...</p>
                </div>
              </div>
            )}
          </div>
          <div className="px-5 pb-10 pt-4 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <p className="text-xs text-gray-500 text-center mb-3">Or enter barcode manually</p>
            <div className="flex gap-2">
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="e.g. 0123456789012"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                inputMode="numeric"
                onKeyDown={e => e.key === 'Enter' && lookupBarcode(manualCode.trim())}
              />
              <button onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); streamRef.current?.getTracks().forEach(t => t.stop()); lookupBarcode(manualCode.trim()); }}
                className="px-4 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                Search
              </button>
            </div>
          </div>
        </>
      )}

      {phase === 'looking' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          <p className="text-white font-bold">Looking up product...</p>
        </div>
      )}

      {phase === 'found' && product && (
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6" style={{ background: '#120630' }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-base font-bold text-white">Product Found!</p>
          </div>
          <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <p className="text-lg font-black text-white mb-1">{product.food_name}</p>
            <p className="text-xs text-gray-400 mb-4">Serving: {product.serving_size}</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { l: 'Calories', v: product.calories, c: '#a855f7', u: 'kcal' },
                { l: 'Protein',  v: product.protein,  c: '#ec4899', u: 'g' },
                { l: 'Carbs',    v: product.carbs,    c: '#3b82f6', u: 'g' },
                { l: 'Fat',      v: product.fat,      c: '#f59e0b', u: 'g' },
              ].map(m => (
                <div key={m.l} className="text-center">
                  <p className="text-base font-black" style={{ color: m.c }}>{m.v}<span className="text-[10px] font-normal">{m.u}</span></p>
                  <p className="text-[10px] text-gray-500">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onConfirm(product)} className="btn-primary mb-3">Add to Log</button>
          <button onClick={onClose} className="w-full text-center text-sm text-gray-500 py-2">Cancel</button>
        </div>
      )}

      {phase === 'notfound' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <AlertCircle className="w-12 h-12 text-amber-400" />
          <p className="text-white font-bold text-lg">Product not found</p>
          <p className="text-sm text-gray-400">This product isn't in our database.</p>
          <button onClick={onClose} className="btn-primary max-w-xs mt-2">Add Manually</button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ── Main AddFoodDialog ─────────────────────────────────────────────────────────
export default function AddFoodDialog({ isOpen, onClose, onSave, mealType = 'snack', date, initialMode = 'manual' }) {
  const [showCamera,  setShowCamera]  = useState(false);
  const [showVoice,   setShowVoice]   = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [foodName, setFoodName]       = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(mealType);
  const [serving, setServing]         = useState('1 serving');
  const [calories, setCalories]       = useState('');
  const [carbs, setCarbs]             = useState('');
  const [protein, setProtein]         = useState('');
  const [fat, setFat]                 = useState('');
  const [aiSuggested, setAiSuggested] = useState(false);

  useEffect(() => { setSelectedMeal(mealType); }, [mealType]);
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'scan')    { setShowCamera(true);  }
      else if (initialMode === 'voice')   { setShowVoice(true);   }
      else if (initialMode === 'barcode') { setShowBarcode(true); }
    }
  }, [initialMode, isOpen]);

  const handleSearch = (val) => {
    setFoodName(val);
    setAiSuggested(false);
    setSuggestions(val.length >= 2 ? searchFoods(val) : []);
  };

  const applyFood = (food) => {
    setFoodName(food.name || food.food_name || '');
    setCalories(String(Math.round(food.calories || 0)));
    setProtein(String(Math.round(food.protein || food.protein_g || 0)));
    setCarbs(String(Math.round(food.carbs || food.carbs_g || 0)));
    setFat(String(Math.round(food.fat || food.fat_g || 0)));
    setServing(food.serving || food.serving_size || '1 serving');
    setSuggestions([]);
    setAiSuggested(true);
  };

  // AI scan returns multiple foods — save each one
  const handleAIScanSave = (foods) => {
    foods.forEach(food => {
      onSave({
        date,
        meal_type: selectedMeal,
        food_name: food.name,
        serving_size: food.portion || '1 serving',
        calories: Math.round(Number(food.calories) || 0),
        protein: Math.round(Number(food.protein_g) || 0),
        carbs: Math.round(Number(food.carbs_g) || 0),
        fat: Math.round(Number(food.fat_g) || 0),
      });
    });
    setShowCamera(false);
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!foodName.trim()) return;
    onSave({ date, meal_type: selectedMeal, food_name: foodName, serving_size: serving, calories: Number(calories) || 0, carbs: Number(carbs) || 0, protein: Number(protein) || 0, fat: Number(fat) || 0 });
    resetForm(); onClose();
  };

  const resetForm = () => {
    setFoodName(''); setCalories(''); setCarbs(''); setProtein(''); setFat('');
    setAiSuggested(false); setServing('1 serving'); setSuggestions([]);
    setShowCamera(false); setShowVoice(false); setShowBarcode(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

  if (showCamera)  return <AIScanModal    onConfirm={handleAIScanSave}                              onClose={() => { setShowCamera(false); if (initialMode === 'scan') handleClose(); }} />;
  if (showVoice)   return <VoiceModal     onResult={(r) => { applyFood(r); setShowVoice(false); }}  onClose={() => { setShowVoice(false);  if (initialMode === 'voice') handleClose(); }} />;
  if (showBarcode) return <BarcodeScanModal onConfirm={(r) => { applyFood(r); setShowBarcode(false); }} onClose={() => { setShowBarcode(false); if (initialMode === 'barcode') handleClose(); }} />;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="fixed inset-0 bg-black/75 backdrop-blur-md z-[70]" />
          <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto">
            <div className="rounded-t-3xl pt-5 pb-10 border-t max-h-[92vh] overflow-y-auto no-scrollbar"
              style={{ background: '#1A0835', borderColor: 'rgba(168,85,247,0.2)' }}>
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
              <div className="px-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-white">Add Food</h3>
                  <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Mode selector */}
                <div className="flex gap-2 mb-5">
                  {[
                    { label: 'Manual',   action: null },
                    { label: 'AI Scan',  action: () => setShowCamera(true) },
                    { label: 'Barcode',  action: () => setShowBarcode(true) },
                    { label: 'Voice',    action: () => setShowVoice(true) },
                  ].map((m, i) => (
                    <button key={i} onClick={() => m.action && m.action()}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={!m.action
                        ? { background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid transparent' }
                      }>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Meal type */}
                <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
                  {MEAL_TYPES.map(type => (
                    <button key={type} onClick={() => setSelectedMeal(type)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all"
                      style={selectedMeal === type
                        ? { background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }}>
                      {type}
                    </button>
                  ))}
                </div>

                {/* Food search */}
                <div className="relative mb-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50 pointer-events-none" />
                    <input
                      style={{ ...inputStyle, paddingLeft: 44 }}
                      placeholder="Search food (e.g. Chicken breast)"
                      value={foodName}
                      onChange={e => handleSearch(e.target.value)}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </div>
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-10 shadow-2xl"
                        style={{ background: '#1E0840', border: '1px solid rgba(168,85,247,0.2)' }}>
                        {suggestions.map((s, i) => (
                          <button key={i} onMouseDown={e => { e.preventDefault(); applyFood(s); }}
                            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                            style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <div>
                              <p className="text-sm font-medium text-white">{s.name}</p>
                              <p className="text-[11px] text-purple-300/50">{s.serving}</p>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <p className="text-xs font-bold text-purple-400">{s.calories} kcal</p>
                              <p className="text-[10px] text-gray-500">P:{s.protein}g C:{s.carbs}g F:{s.fat}g</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {aiSuggested && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px] text-green-400 mb-4 flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3" /> Nutrition filled — edit if needed
                  </motion.p>
                )}

                {/* Serving */}
                <input
                  style={{ ...inputStyle, marginTop: aiSuggested ? 0 : 12, marginBottom: 12 }}
                  placeholder="Serving size (e.g. 1 cup, 200g)"
                  value={serving}
                  onChange={e => setServing(e.target.value)}
                />

                {/* Macro inputs */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Calories', val: calories, set: setCalories, color: '#a855f7', unit: 'kcal' },
                    { label: 'Protein',  val: protein,  set: setProtein,  color: '#ec4899', unit: 'g' },
                    { label: 'Carbs',    val: carbs,    set: setCarbs,    color: '#3b82f6', unit: 'g' },
                    { label: 'Fat',      val: fat,      set: setFat,      color: '#f59e0b', unit: 'g' },
                  ].map(f => (
                    <div key={f.label} className="rounded-2xl p-3.5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: f.color }}>{f.label}</label>
                      <div className="flex items-baseline gap-1 mt-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          value={f.val}
                          onChange={e => {
                            const v = e.target.value;
                            if (v === '' || /^\d*\.?\d*$/.test(v)) f.set(v);
                          }}
                          placeholder="0"
                          style={{ background: 'transparent', color: '#ffffff', WebkitTextFillColor: '#ffffff', caretColor: '#a855f7', outline: 'none', border: 'none', fontSize: 22, fontWeight: 900, width: '100%', minWidth: 0 }}
                        />
                        <span className="text-xs text-gray-500 flex-shrink-0">{f.unit}</span>
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