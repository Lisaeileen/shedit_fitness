import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Search, Mic, MicOff, Camera, Plus, Minus, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const FOOD_DB = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Chicken Salad', calories: 290, protein: 28, carbs: 8, fat: 16, serving: '1 bowl' },
  { name: 'Chicken Wrap', calories: 380, protein: 30, carbs: 34, fat: 12, serving: '1 wrap' },
  { name: 'Chicken Rice Bowl', calories: 520, protein: 38, carbs: 42, fat: 18, serving: '1 bowl' },
  { name: 'Chicken Alfredo', calories: 596, protein: 34, carbs: 48, fat: 22, serving: '1 serving' },
  { name: 'Grilled Chicken', calories: 187, protein: 35, carbs: 0, fat: 4, serving: '100g' },
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
  { name: 'Almond Milk', calories: 39, protein: 1, carbs: 3.5, fat: 2.5, serving: '1 cup' },
  { name: 'Avocado', calories: 320, protein: 4, carbs: 17, fat: 29, serving: '1 whole' },
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz (28g)' },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '1 cup' },
  { name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium' },
  { name: 'Steak (beef)', calories: 271, protein: 26, carbs: 0, fat: 18, serving: '100g' },
  { name: 'Beef Burger', calories: 540, protein: 34, carbs: 40, fat: 25, serving: '1 burger' },
  { name: 'Peanut Butter', calories: 190, protein: 7, carbs: 6, fat: 16, serving: '2 tbsp' },
  { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp' },
  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9, serving: '1 oz' },
  { name: 'Pizza (cheese)', calories: 285, protein: 12, carbs: 36, fat: 10, serving: '1 slice' },
  { name: 'Caesar Salad', calories: 290, protein: 9, carbs: 18, fat: 21, serving: '1 serving' },
  { name: 'Protein Shake', calories: 160, protein: 30, carbs: 8, fat: 3, serving: '1 scoop' },
  { name: 'Orange Juice', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, serving: '1 cup' },
  { name: 'Coffee (black)', calories: 5, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup' },
  { name: 'Latte', calories: 190, protein: 10, carbs: 19, fat: 7, serving: 'large' },
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
  return FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 7);
}

// ── AI Food Scanner with real AI analysis ─────────────────────────────────────

function AIScanModal({ onConfirm, onClose }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [phase, setPhase] = useState('camera'); // camera | analyzing | results
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedFoods, setDetectedFoods] = useState([]);
  const [lowConfidence, setLowConfidence] = useState('');
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
      // Convert base64 dataUrl to a Blob/File for upload
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'meal.jpg', { type: 'image/jpeg' });

      // Upload image to get a real URL the AI can access
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Now send the real URL to the vision AI
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a precise nutrition analysis assistant. Carefully analyze this food image.

Identify EVERY distinct food item you can see. Be specific — for example:
- "Grilled Chicken Breast" not "meat"
- "Jasmine Rice" or "Brown Rice" not "grain"
- "Broccoli" not "vegetables"
- "Caesar Salad" not "salad"

For EACH food item provide:
- name: the specific food name (be as specific as possible)
- portion: estimated portion size (e.g. "150g", "1 cup", "1 medium")
- calories: estimated kcal
- protein_g: protein in grams
- carbs_g: carbohydrates in grams  
- fat_g: fat in grams

Only use a generic name like "Mixed Meal" as an absolute last resort if you truly cannot identify anything.
If you can see the food, name it specifically.`,
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
            confidence: { type: 'string', description: 'high, medium, or low' },
            low_confidence_message: { type: 'string', description: 'message to show user if confidence is low' }
          }
        }
      });

      const foods = result.foods || [];
      if (foods.length === 0) {
        setDetectedFoods([{ name: 'Food not confidently identified', portion: '1 serving', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, unidentified: true }]);
      } else {
        setDetectedFoods(foods);
      }
      setLowConfidence(result.confidence === 'low' ? (result.low_confidence_message || 'Food not confidently identified. Please confirm or edit.') : '');
      setPhase('results');
    } catch (err) {
      setDetectedFoods([{ name: 'Food not confidently identified', portion: '1 serving', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, unidentified: true }]);
      setLowConfidence('Could not analyze image. Please confirm or edit the food name.');
      setPhase('results');
    }
  };

  const removeFood = (idx) => setDetectedFoods(f => f.filter((_, i) => i !== idx));

  const totals = detectedFoods.reduce((acc, f) => ({
    calories: acc.calories + (f.calories || 0),
    protein_g: acc.protein_g + (f.protein_g || 0),
    carbs_g: acc.carbs_g + (f.carbs_g || 0),
    fat_g: acc.fat_g + (f.fat_g || 0),
  }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });

  const handleConfirm = () => {
    if (detectedFoods.length === 0) return;
    const primary = detectedFoods[0];
    onConfirm({
      food_name: detectedFoods.length === 1 ? primary.name : detectedFoods.map(f => f.name).join(', '),
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein_g),
      carbs: Math.round(totals.carbs_g),
      fat: Math.round(totals.fat_g),
      serving_size: detectedFoods.length === 1 ? primary.portion : `${detectedFoods.length} items`,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: '#000' }}>
      {/* Header */}
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
          <p className="text-5xl mb-4">📷</p>
          <p className="text-white font-bold mb-2">Camera unavailable</p>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button onClick={onClose} className="btn-primary max-w-xs">Go Back</button>
        </div>

      ) : phase === 'camera' ? (
        <>
          <div className="flex-1 relative overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {/* Scan frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-purple-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-purple-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-purple-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-purple-400 rounded-br-xl" />
              </div>
            </div>
            <p className="absolute bottom-8 left-0 right-0 text-center text-sm text-white/70">
              Center your meal in the frame
            </p>
          </div>
          <div className="pb-12 pt-6 flex justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <motion.button whileTap={{ scale: 0.92 }} onClick={capture}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 32px rgba(168,85,247,0.6)' }}>
              <Camera className="w-8 h-8 text-white" />
            </motion.button>
          </div>
        </>

      ) : phase === 'analyzing' ? (
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

      ) : (
        // Results screen
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ background: '#120630' }}>
          {capturedImage && (
            <img src={capturedImage} alt="captured" className="w-full object-cover" style={{ maxHeight: 200 }} />
          )}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-base font-bold text-white">
                {detectedFoods.length} food{detectedFoods.length !== 1 ? 's' : ''} detected
              </p>
            </div>
            {lowConfidence && (
              <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <p className="text-xs text-amber-400">⚠️ {lowConfidence}</p>
              </div>
            )}

            {/* Detected foods list */}
            <div className="space-y-2.5 mb-4">
              {detectedFoods.map((food, idx) => (
                <motion.div key={idx} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.portion}</p>
                    </div>
                    <button onClick={() => removeFood(idx)}
                      className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center ml-2 flex-shrink-0">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { l: 'Cal', v: food.calories, c: '#a855f7', u: 'kcal' },
                      { l: 'P', v: food.protein_g, c: '#ec4899', u: 'g' },
                      { l: 'C', v: food.carbs_g, c: '#3b82f6', u: 'g' },
                      { l: 'F', v: food.fat_g, c: '#f59e0b', u: 'g' },
                    ].map(m => (
                      <div key={m.l}>
                        <p className="text-xs font-black" style={{ color: m.c }}>{Math.round(m.v || 0)}<span className="text-[9px] font-normal">{m.u}</span></p>
                        <p className="text-[9px] text-gray-600">{m.l}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            {detectedFoods.length > 1 && (
              <div className="rounded-2xl p-4 mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(168,85,247,0.3)' }}>
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Meal Total</p>
                <div className="flex gap-4">
                  {[
                    { l: 'Calories', v: totals.calories, c: '#a855f7', u: 'kcal' },
                    { l: 'Protein', v: totals.protein_g, c: '#ec4899', u: 'g' },
                    { l: 'Carbs', v: totals.carbs_g, c: '#3b82f6', u: 'g' },
                    { l: 'Fat', v: totals.fat_g, c: '#f59e0b', u: 'g' },
                  ].map(m => (
                    <div key={m.l}>
                      <p className="text-base font-black" style={{ color: m.c }}>{Math.round(m.v)}<span className="text-xs font-normal">{m.u}</span></p>
                      <p className="text-[10px] text-gray-500">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleConfirm} disabled={detectedFoods.length === 0} className="btn-primary">
              Log This Meal
            </button>
            <button onClick={() => { setPhase('camera'); setCapturedImage(null); setDetectedFoods([]); setLowConfidence(''); }}
              className="w-full text-center text-sm text-gray-500 mt-3 py-2">
              Retake photo
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ── Voice modal ───────────────────────────────────────────────────────────────

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

// ── Main AddFoodDialog ─────────────────────────────────────────────────────────

export default function AddFoodDialog({ isOpen, onClose, onSave, mealType = 'snack', date, initialMode = 'manual' }) {
  const [showCamera, setShowCamera] = useState(false);
  const [showVoice, setShowVoice]   = useState(false);
  const [foodName, setFoodName]     = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(mealType);
  const [serving, setServing]       = useState('1 serving');
  const [calories, setCalories]     = useState('');
  const [carbs, setCarbs]           = useState('');
  const [protein, setProtein]       = useState('');
  const [fat, setFat]               = useState('');
  const [aiSuggested, setAiSuggested] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setSelectedMeal(mealType); }, [mealType]);
  useEffect(() => {
    if (isOpen && initialMode === 'scan') setShowCamera(true);
    else if (isOpen && initialMode === 'voice') setShowVoice(true);
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

  const handleSave = () => {
    if (!foodName.trim()) return;
    onSave({ date, meal_type: selectedMeal, food_name: foodName, serving_size: serving, calories: Number(calories) || 0, carbs: Number(carbs) || 0, protein: Number(protein) || 0, fat: Number(fat) || 0 });
    resetForm(); onClose();
  };

  const resetForm = () => {
    setFoodName(''); setCalories(''); setCarbs(''); setProtein(''); setFat('');
    setAiSuggested(false); setServing('1 serving'); setSuggestions([]);
    setShowCamera(false); setShowVoice(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

  if (showCamera) return <AIScanModal onConfirm={(r) => { applyFood(r); setShowCamera(false); }} onClose={() => setShowCamera(false)} />;
  if (showVoice)  return <VoiceModal  onResult={(r) => { applyFood(r); setShowVoice(false); }}  onClose={() => setShowVoice(false)} />;

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
                    { label: 'Manual', action: null },
                    { label: 'AI Scan', action: () => setShowCamera(true) },
                    { label: 'Voice',   action: () => setShowVoice(true) },
                  ].map((m, i) => (
                    <button key={i} onClick={() => m.action ? m.action() : null}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
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

                {/* Food search with live autocomplete */}
                <div className="relative mb-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50 pointer-events-none" />
                    <input
                      ref={inputRef}
                      className="input-dark pl-10"
                      placeholder="Search food (e.g. Chicken breast)"
                      value={foodName}
                      onChange={(e) => handleSearch(e.target.value)}
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
                          <button key={i} onMouseDown={(e) => { e.preventDefault(); applyFood(s); }}
                            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                            style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <div>
                              <p className="text-sm font-medium text-white">{s.name}</p>
                              <p className="text-[11px] text-purple-300/50">{s.serving} · P:{s.protein}g C:{s.carbs}g F:{s.fat}g</p>
                            </div>
                            <span className="text-xs font-bold text-purple-400 ml-2 flex-shrink-0">{s.calories} kcal</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {aiSuggested && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px] text-green-400 mb-4 flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3" /> Nutrition filled — edit values below if needed
                  </motion.p>
                )}

                {/* Meal name preview */}
                {aiSuggested && foodName && (
                  <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                    <p className="text-sm font-bold text-white">{foodName}</p>
                    <p className="text-xs text-gray-500">{serving} · {calories} kcal · P:{protein}g C:{carbs}g F:{fat}g</p>
                  </div>
                )}

                <input className="input-dark mb-4 mt-2" placeholder="Serving size (e.g. 1 cup, 200g)"
                  value={serving} onChange={(e) => setServing(e.target.value)} />

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
                        <input type="number" inputMode="decimal" value={f.val} onChange={(e) => f.set(e.target.value)}
                          placeholder="0" className="bg-transparent text-xl font-black outline-none w-full min-w-0"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', color: '#ffffff !important', WebkitTextFillColor: '#ffffff', backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box', caretColor: '#a855f7' }} />
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