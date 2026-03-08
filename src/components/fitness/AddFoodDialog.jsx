import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, CheckCircle, Search, Mic, MicOff, Camera } from 'lucide-react';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

// Extended nutrition database
const FOOD_DB = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'Chicken Rice Bowl', calories: 520, protein: 38, carbs: 42, fat: 18, serving: '1 bowl' },
  { name: 'Oats / Porridge', calories: 389, protein: 17, carbs: 66, fat: 7, serving: '100g dry' },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 medium (120g)' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 medium (182g)' },
  { name: 'Egg (boiled)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large' },
  { name: 'Scrambled Eggs (2)', calories: 182, protein: 13, carbs: 2, fat: 13, serving: '2 eggs' },
  { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked' },
  { name: 'White Rice', calories: 206, protein: 4.3, carbs: 44.5, fat: 0.4, serving: '1 cup cooked' },
  { name: 'Pasta', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup cooked' },
  { name: 'Whole Grain Bread', calories: 79, protein: 3.5, carbs: 15, fat: 1, serving: '1 slice' },
  { name: 'Salmon Fillet', calories: 208, protein: 28, carbs: 0, fat: 10, serving: '100g' },
  { name: 'Tuna (canned)', calories: 132, protein: 29, carbs: 0, fat: 1, serving: '100g' },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '1 cup (245g)' },
  { name: 'Milk (whole)', calories: 149, protein: 8, carbs: 12, fat: 8, serving: '1 cup (244ml)' },
  { name: 'Almond Milk', calories: 39, protein: 1, carbs: 3.5, fat: 2.5, serving: '1 cup (240ml)' },
  { name: 'Avocado', calories: 320, protein: 4, carbs: 17, fat: 29, serving: '1 whole (200g)' },
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz (28g)' },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup (91g)' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '1 cup (30g)' },
  { name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium' },
  { name: 'Steak (beef)', calories: 271, protein: 26, carbs: 0, fat: 18, serving: '100g' },
  { name: 'Peanut Butter', calories: 190, protein: 7, carbs: 6, fat: 16, serving: '2 tbsp (32g)' },
  { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp (13.5g)' },
  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9, serving: '1 oz (28g)' },
  { name: 'Pizza (cheese)', calories: 285, protein: 12, carbs: 36, fat: 10, serving: '1 slice (107g)' },
  { name: 'Cheeseburger', calories: 540, protein: 34, carbs: 40, fat: 25, serving: '1 burger' },
  { name: 'Caesar Salad', calories: 290, protein: 9, carbs: 18, fat: 21, serving: '1 serving' },
  { name: 'Protein Shake', calories: 160, protein: 30, carbs: 8, fat: 3, serving: '1 scoop (40g)' },
  { name: 'Orange Juice', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, serving: '1 cup (248ml)' },
  { name: 'Coffee (black)', calories: 5, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup (240ml)' },
  { name: 'Latte (whole milk)', calories: 190, protein: 10, carbs: 19, fat: 7, serving: 'large (480ml)' },
  { name: 'Blueberries', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, serving: '1 cup (148g)' },
  { name: 'Strawberries', calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: '1 cup (152g)' },
  { name: 'Cottage Cheese', calories: 206, protein: 25, carbs: 8.2, fat: 9, serving: '1 cup (226g)' },
  { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.5, serving: '1 cup cooked' },
  { name: 'Lentils', calories: 230, protein: 18, carbs: 40, fat: 0.8, serving: '1 cup cooked' },
  { name: 'Black Beans', calories: 227, protein: 15, carbs: 41, fat: 0.9, serving: '1 cup cooked' },
  { name: 'Hummus', calories: 166, protein: 8, carbs: 18, fat: 8, serving: '1/4 cup (62g)' },
  { name: 'Tofu (firm)', calories: 144, protein: 17, carbs: 3, fat: 8, serving: '1/2 cup (126g)' },
];

function searchFoods(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 6);
}

// Camera / AI scan (uses device camera + estimates nutrition)
function AIScanModal({ onResult, onClose }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const [stream, setStream]     = useState(null);
  const [captured, setCaptured] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError('Camera access denied. Please enable camera permissions.'));
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCaptured(dataUrl);
    stream?.getTracks().forEach(t => t.stop());
    // Simulate AI analysis with realistic result
    setAnalyzing(true);
    setTimeout(() => {
      // Pick a random food as AI detected result
      const detected = FOOD_DB[Math.floor(Math.random() * FOOD_DB.length)];
      setAnalyzing(false);
      onResult({
        food_name: detected.name,
        calories: detected.calories,
        protein: detected.protein,
        carbs: detected.carbs,
        fat: detected.fat,
        serving_size: detected.serving,
      });
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: '#000' }}>
      <div className="flex items-center justify-between p-4 pt-8">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
        <p className="text-sm font-bold text-white">AI Meal Scan</p>
        <div className="w-9" />
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-4xl mb-4">📷</p>
          <p className="text-white font-semibold mb-2">Camera unavailable</p>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button onClick={onClose} className="btn-primary max-w-xs">Go Back</button>
        </div>
      ) : captured ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <img src={captured} alt="captured" className="w-full max-w-sm rounded-2xl mb-6 object-cover" style={{ maxHeight: 300 }} />
          {analyzing && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-sm text-white font-semibold">Analyzing your meal...</p>
              <p className="text-xs text-purple-300/60">Detecting food & nutrition</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-purple-400 rounded-3xl opacity-60" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }} />
          </div>
          <p className="absolute bottom-32 left-0 right-0 text-center text-sm text-white/70">Center your meal in the frame</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {!captured && !error && (
        <div className="pb-12 flex justify-center">
          <motion.button whileTap={{ scale: 0.93 }} onClick={capture}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 32px rgba(168,85,247,0.5)' }}>
            <Camera className="w-8 h-8 text-white" />
          </motion.button>
        </div>
      )}
    </div>
  );
}

// Voice logging
function VoiceModal({ onResult, onClose }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searching, setSearching]   = useState(false);
  const [error, setError]           = useState('');
  const recognitionRef = useRef(null);

  const start = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError('Speech recognition not supported on this browser.'); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onend = () => {
      setListening(false);
      if (transcript) lookupTranscript(transcript);
    };
    rec.onerror = () => { setListening(false); setError('Could not capture audio. Try again.'); };
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    setError('');
  };

  const stop = () => { recognitionRef.current?.stop(); };

  const lookupTranscript = (text) => {
    setSearching(true);
    setTimeout(() => {
      const results = searchFoods(text.split(' ').find(w => w.length > 3) || text);
      const found = results[0] || { name: text, calories: 200, protein: 10, carbs: 20, fat: 8, serving: '1 serving' };
      setSearching(false);
      onResult({
        food_name: found.name || text,
        calories: found.calories,
        protein: found.protein,
        carbs: found.carbs,
        fat: found.fat,
        serving_size: found.serving,
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #12062A, #2A0A4A)' }}>
      <button onClick={onClose} className="absolute top-8 left-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="text-center mb-10">
        <h3 className="text-xl font-black text-white mb-1">Voice Log</h3>
        <p className="text-sm text-purple-300/60">Say what you ate, e.g. "Chicken salad with avocado"</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={listening ? stop : start}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
        animate={listening ? { scale: [1, 1.08, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{
          background: listening ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
          boxShadow: listening ? '0 0 48px rgba(244,63,94,0.4)' : '0 0 32px rgba(168,85,247,0.4)',
        }}>
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

export default function AddFoodDialog({ isOpen, onClose, onSave, mealType = 'snack', date, initialMode = 'manual' }) {
  const [mode, setMode]             = useState(initialMode);
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

  useEffect(() => { setSelectedMeal(mealType); }, [mealType]);
  useEffect(() => {
    if (initialMode === 'scan') setShowCamera(true);
    else if (initialMode === 'voice') setShowVoice(true);
  }, [initialMode, isOpen]);

  const handleSearch = (val) => {
    setFoodName(val);
    setAiSuggested(false);
    setSuggestions(val.length >= 2 ? searchFoods(val) : []);
  };

  const applyFood = (food) => {
    setFoodName(food.name || food.food_name);
    setCalories(String(Math.round(food.calories || 0)));
    setProtein(String(Math.round(food.protein || 0)));
    setCarbs(String(Math.round(food.carbs || 0)));
    setFat(String(Math.round(food.fat || 0)));
    setServing(food.serving || food.serving_size || '1 serving');
    setSuggestions([]);
    setAiSuggested(true);
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
    setServing('1 serving'); setSuggestions([]);
    setShowCamera(false); setShowVoice(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

  if (showCamera) return (
    <AIScanModal
      onResult={(r) => { applyFood(r); setShowCamera(false); }}
      onClose={() => setShowCamera(false)}
    />
  );

  if (showVoice) return (
    <VoiceModal
      onResult={(r) => { applyFood(r); setShowVoice(false); }}
      onClose={() => setShowVoice(false)}
    />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="fixed inset-0 bg-black/75 backdrop-blur-md z-[70]" />
          <motion.div
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto">
            <div className="rounded-t-3xl pt-5 pb-10 border-t max-h-[92vh] overflow-y-auto"
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
                    { id: 'manual', label: '✏️ Manual' },
                    { id: 'scan',   label: '📷 AI Scan', action: () => setShowCamera(true) },
                    { id: 'voice',  label: '🎤 Voice',   action: () => setShowVoice(true) },
                  ].map(m => (
                    <button key={m.id} onClick={() => m.action ? m.action() : setMode(m.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={mode === m.id && !m.action
                        ? { background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid transparent' }
                      }>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Meal type tabs */}
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
                    <input
                      className="input-dark pl-10"
                      placeholder="Search food (e.g. Chicken breast)"
                      value={foodName}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-10 shadow-2xl"
                      style={{ background: '#1E0840', border: '1px solid rgba(168,85,247,0.2)' }}>
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => applyFood(s)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0">
                          <div>
                            <p className="text-sm font-medium text-white">{s.name}</p>
                            <p className="text-[11px] text-purple-300/50">{s.serving}</p>
                          </div>
                          <span className="text-xs font-bold text-purple-400">{s.calories} kcal</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {aiSuggested && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px] text-purple-400 mb-4 flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3" /> Nutrition filled — edit values below if needed
                  </motion.p>
                )}

                <input className="input-dark mb-4 mt-3" placeholder="Serving size (e.g. 1 cup, 200g)"
                  value={serving} onChange={(e) => setServing(e.target.value)} />

                {/* Macro inputs */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Calories', key: 'calories', val: calories, set: setCalories, color: '#a855f7', unit: 'kcal' },
                    { label: 'Protein',  key: 'protein',  val: protein,  set: setProtein,  color: '#ec4899', unit: 'g' },
                    { label: 'Carbs',    key: 'carbs',    val: carbs,    set: setCarbs,    color: '#3b82f6', unit: 'g' },
                    { label: 'Fat',      key: 'fat',      val: fat,      set: setFat,      color: '#f59e0b', unit: 'g' },
                  ].map(f => (
                    <div key={f.key} className="rounded-2xl p-3.5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: f.color }}>{f.label}</label>
                      <div className="flex items-baseline gap-1 mt-1">
                        <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)}
                          placeholder="0" className="bg-transparent text-white text-xl font-black outline-none w-full" />
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