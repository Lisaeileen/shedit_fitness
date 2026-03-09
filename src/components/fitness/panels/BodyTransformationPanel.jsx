import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, TrendingDown, Ruler, Scale, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'shedit_body_logs';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function uid() { return Math.random().toString(36).slice(2); }

export default function BodyTransformationPanel() {
  const [logs, setLogs] = useState(load);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ weight: '', waist: '', body_fat: '', notes: '', photo_url: '' });
  const fileRef = useRef(null);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(f => ({ ...f, photo_url: file_url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const entry = {
      id: uid(),
      date: new Date().toISOString().split('T')[0],
      ts: Date.now(),
      weight: parseFloat(form.weight) || null,
      waist: parseFloat(form.waist) || null,
      body_fat: parseFloat(form.body_fat) || null,
      notes: form.notes,
      photo_url: form.photo_url,
    };
    const updated = [...logs, entry];
    save(updated);
    setLogs(updated);
    setForm({ weight: '', waist: '', body_fat: '', notes: '', photo_url: '' });
    setShowForm(false);
  };

  const latest = logs.at(-1);
  const first = logs[0];
  const weightDiff = latest?.weight && first?.weight ? (first.weight - latest.weight).toFixed(1) : null;
  const waistDiff = latest?.waist && first?.waist ? (first.waist - latest.waist).toFixed(1) : null;

  return (
    <div>
      {/* Summary */}
      {logs.length >= 2 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {weightDiff !== null && (
            <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Scale className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-black text-green-400">{weightDiff > 0 ? `-${weightDiff}` : `+${Math.abs(weightDiff)}`} kg</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Weight change</p>
            </div>
          )}
          {waistDiff !== null && (
            <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <Ruler className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-black text-purple-400">{waistDiff > 0 ? `-${waistDiff}` : `+${Math.abs(waistDiff)}`} cm</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Waist change</p>
            </div>
          )}
        </div>
      )}

      {/* Log button */}
      <button onClick={() => setShowForm(true)}
        className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-white mb-5"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
        <Plus className="w-4 h-4" /> Log Measurements
      </button>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-sm font-bold text-white mb-4">Today's Measurements</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '72.5' },
                { key: 'waist',  label: 'Waist',  unit: 'cm', placeholder: '82' },
                { key: 'body_fat', label: 'Body Fat', unit: '%', placeholder: '18' },
              ].map(f => (
                <div key={f.key} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">{f.label}</label>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input type="number" inputMode="decimal" placeholder={f.placeholder}
                      value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="text-base font-bold outline-none w-full"
                      style={{ background: 'transparent', color: '#fff', WebkitTextFillColor: '#fff', caretColor: '#a855f7' }} />
                    <span className="text-[10px] text-gray-600 flex-shrink-0">{f.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo */}
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold mb-3 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(168,85,247,0.3)', color: form.photo_url ? '#10b981' : '#a855f7' }}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {uploading ? 'Uploading...' : form.photo_url ? '✓ Photo added' : 'Add Progress Photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

            {form.photo_url && (
              <img src={form.photo_url} alt="progress" className="w-full rounded-xl object-cover mb-3" style={{ maxHeight: 180 }} />
            )}

            <input placeholder="Notes (optional)"
              value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              className="input-dark text-sm mb-4" />

            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500"
                style={{ background: 'rgba(255,255,255,0.04)' }}>Cancel</button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>Save</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {logs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">📸</p>
          <p className="text-sm font-bold text-white">No measurements yet</p>
          <p className="text-xs text-gray-500 mt-1">Log your first entry to start tracking your transformation</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...logs].reverse().map(entry => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start gap-3">
                {entry.photo_url && (
                  <img src={entry.photo_url} alt="progress" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2">{new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <div className="flex flex-wrap gap-3">
                    {entry.weight && <span className="text-sm font-bold text-green-400">{entry.weight} kg</span>}
                    {entry.waist && <span className="text-sm font-bold text-purple-400">{entry.waist} cm waist</span>}
                    {entry.body_fat && <span className="text-sm font-bold text-blue-400">{entry.body_fat}% body fat</span>}
                  </div>
                  {entry.notes && <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}