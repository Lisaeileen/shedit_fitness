import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Footprints, Flame, Zap, Users, Target, Check, Star } from 'lucide-react';
import { DailyLogs, Streak, Badges, Challenges } from '../components/storage';
import { format } from 'date-fns';

// ── Static community feed ────────────────────────────────────────────────────
const FEED = [
  { id: 1, name: 'Sarah K.',  avatar: '💪', action: 'walked 12,450 steps today!',  time: '2m ago',  reactions: { '🔥': 5, '👏': 3, '❤️': 8 } },
  { id: 2, name: 'Marcus T.', avatar: '🏃', action: 'lost 5 kg — first milestone!', time: '18m ago', reactions: { '🔥': 12, '👏': 9, '❤️': 14 } },
  { id: 3, name: 'Priya M.',  avatar: '🌟', action: 'hit a 14-day streak!',         time: '1h ago',  reactions: { '🔥': 7, '👏': 6, '❤️': 5 } },
  { id: 4, name: 'James L.',  avatar: '🎯', action: 'stayed within calories for 7 days straight!', time: '2h ago', reactions: { '🔥': 4, '👏': 11, '❤️': 7 } },
  { id: 5, name: 'Amira S.',  avatar: '💧', action: 'drank 8 glasses of water every day this week!', time: '3h ago', reactions: { '🔥': 3, '👏': 4, '❤️': 9 } },
];

const LEADERBOARD = [
  { rank: 1, name: 'Marcus T.', steps: 94200, streak: 21, calories: 41200, avatar: '🏃' },
  { rank: 2, name: 'Sarah K.',  steps: 88750, streak: 14, calories: 38900, avatar: '💪' },
  { rank: 3, name: 'You',       steps: 0,     streak: 0,  calories: 0,     avatar: '⭐', isYou: true },
  { rank: 4, name: 'Priya M.',  steps: 71300, streak: 12, calories: 31500, avatar: '🌟' },
  { rank: 5, name: 'James L.',  steps: 63800, streak: 7,  calories: 28900, avatar: '🎯' },
];

const CHALLENGES_LIST = [
  { id: 'walk7',   emoji: '🚶', title: '7-Day Walking Challenge',  desc: 'Walk 8,000+ steps daily for 7 days', duration: '7 days', reward: 'Bronze Badge', goal: 7 },
  { id: 'steps10k',emoji: '👟', title: '10K Steps Daily',          desc: 'Hit 10,000 steps for 5 consecutive days', duration: '5 days', reward: 'Silver Badge', goal: 5 },
  { id: 'weight30',emoji: '⚖️', title: '30-Day Weight Loss',        desc: 'Log weight daily and stay in calorie deficit', duration: '30 days', reward: 'Gold Badge', goal: 30 },
  { id: 'hydrate', emoji: '💧', title: 'Hydration Hero',            desc: 'Drink 8 glasses of water for 7 days', duration: '7 days', reward: 'Blue Badge', goal: 7 },
];

function FeedCard({ item }) {
  const [reactions, setReactions] = useState(item.reactions);
  const [reacted, setReacted] = useState(null);

  const react = (emoji) => {
    if (reacted === emoji) return;
    setReactions(r => ({ ...r, [emoji]: (r[emoji] || 0) + 1 }));
    setReacted(emoji);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'rgba(168,85,247,0.12)' }}>{item.avatar}</div>
        <div className="flex-1">
          <p className="text-sm text-white"><strong>{item.name}</strong> {item.action}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">{item.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {Object.entries(reactions).map(([emoji, count]) => (
          <motion.button key={emoji} whileTap={{ scale: 0.85 }} onClick={() => react(emoji)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={reacted === emoji
              ? { background: 'rgba(168,85,247,0.25)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}>
            {emoji} {count}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ChallengeCard({ challenge, logs }) {
  const joined = useMemo(() => Challenges.list().find(c => c.id === challenge.id), []);
  const [isJoined, setIsJoined] = useState(!!joined);

  // Auto-compute progress from real logs
  const progress = useMemo(() => {
    if (!isJoined) return 0;
    const recent = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, challenge.goal);
    if (challenge.id === 'walk7' || challenge.id === 'steps10k') {
      const minSteps = challenge.id === 'steps10k' ? 10000 : 8000;
      return recent.filter(l => (l.steps || 0) >= minSteps).length;
    }
    if (challenge.id === 'hydrate') return recent.filter(l => (l.water_glasses || 0) >= 8).length;
    if (challenge.id === 'weight30') return recent.filter(l => l.weight).length;
    return joined?.progress || 0;
  }, [isJoined, logs, challenge]);

  const handleJoin = () => {
    Challenges.join(challenge);
    setIsJoined(true);
  };

  return (
    <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl flex-shrink-0">{challenge.emoji}</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{challenge.title}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{challenge.desc}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-purple-400">⏱ {challenge.duration}</span>
            <span className="text-[10px] text-yellow-400">🏅 {challenge.reward}</span>
          </div>
        </div>
        {isJoined ? (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Check className="w-3 h-3 text-green-400" />
            <span className="text-[11px] font-semibold text-green-400">Joined</span>
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.92 }} onClick={handleJoin}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold"
            style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
            Join
          </motion.button>
        )}
      </div>
      {isJoined && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-gray-600">Progress</span>
            <span className="text-[10px] text-purple-400">{progress}/{challenge.goal} days</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(progress / challenge.goal) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = ['Feed', 'Challenges', 'Leaderboard'];
const LB_KEYS = ['steps', 'streak', 'calories'];
const LB_LABELS = ['Weekly Steps', 'Streaks', 'Calories Burned'];
const LB_COLORS = ['#a855f7', '#f59e0b', '#ec4899'];

export default function Social() {
  const [tab, setTab]     = useState('Feed');
  const [lbKey, setLbKey] = useState(0);

  const logs = useMemo(() => DailyLogs.list(), []);
  const streak = useMemo(() => Streak.get(), []);
  const mySteps = useMemo(() => logs.slice(-7).reduce((s, l) => s + (l.steps || 0), 0), [logs]);
  const myCals  = useMemo(() => logs.slice(-7).reduce((s, l) => s + (l.calories_consumed || 0), 0), [logs]);

  const leaderboard = LEADERBOARD.map(r => r.isYou
    ? { ...r, steps: mySteps, streak: streak.count, calories: myCals }
    : r
  ).sort((a, b) => b[LB_KEYS[lbKey]] - a[LB_KEYS[lbKey]]).map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="px-4 pt-2">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="pt-2 mb-5">
        <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold">Community</p>
        <h1 className="text-2xl font-black text-white">Social</h1>
      </motion.div>

      {/* Tab bar */}
      <div className="flex p-1 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={tab === t
              ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }
              : { color: '#4b5563' }}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>

          {tab === 'Feed' && (
            <div>
              <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold mb-3">Community Highlights</p>
              {FEED.map(item => <FeedCard key={item.id} item={item} />)}
            </div>
          )}

          {tab === 'Challenges' && (
            <div>
              <p className="text-[10px] text-purple-300/40 uppercase tracking-widest font-bold mb-3">Active Challenges</p>
              {CHALLENGES_LIST.map(c => <ChallengeCard key={c.id} challenge={c} logs={logs} />)}
            </div>
          )}

          {tab === 'Leaderboard' && (
            <div>
              {/* Category selector */}
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                {LB_LABELS.map((label, i) => (
                  <button key={i} onClick={() => setLbKey(i)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                    style={lbKey === i
                      ? { background: `${LB_COLORS[i]}20`, color: LB_COLORS[i], border: `1px solid ${LB_COLORS[i]}35` }
                      : { background: 'rgba(255,255,255,0.04)', color: '#4b5563' }}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {leaderboard.map((person, i) => (
                  <motion.div key={person.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-2xl p-3.5"
                    style={{
                      background: person.isYou ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.03)',
                      border: person.isYou ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <div className="w-7 text-center">
                      {person.rank === 1 ? <span className="text-lg">🥇</span>
                        : person.rank === 2 ? <span className="text-lg">🥈</span>
                        : person.rank === 3 ? <span className="text-lg">🥉</span>
                        : <span className="text-sm font-bold text-gray-600">#{person.rank}</span>}
                    </div>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(168,85,247,0.12)' }}>{person.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {person.name} {person.isYou && <span className="text-[10px] text-purple-400 font-normal ml-1">(you)</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black" style={{ color: LB_COLORS[lbKey] }}>
                        {lbKey === 0 ? person.steps.toLocaleString()
                          : lbKey === 1 ? `${person.streak}🔥`
                          : `${person.calories.toLocaleString()}`}
                      </p>
                      <p className="text-[9px] text-gray-600">{lbKey === 0 ? 'steps' : lbKey === 1 ? 'day streak' : 'kcal'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <div className="h-4" />
    </div>
  );
}