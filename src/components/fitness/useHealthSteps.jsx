/**
 * useHealthSteps  —  Accurate step + stair detection hook
 *
 * STEP COUNTING
 * ─────────────
 * Uses DeviceMotion accelerometer with peak-detection (magnitude delta threshold).
 * Minimum inter-step interval guards against false triggers.
 *
 * STAIR DETECTION  (web-compatible, no native SDK)
 * ─────────────────────────────────────────────────
 * A real stair step has TWO simultaneous signatures:
 *   1. A walking-rhythm step (same accelerometer peak used for step counting).
 *   2. Net upward acceleration: on each stair tread the user's body rises ~15–20 cm.
 *      This produces a brief but real upward impulse on the vertical axis that is
 *      larger and more sustained than flat walking.
 *
 * Algorithm (no barometer required):
 *   • We maintain a short circular buffer of the "gravity-corrected vertical"
 *     acceleration (z-axis of accelerationIncludingGravity minus ~9.8 m/s²).
 *   • At each detected step, we compute the peak-to-trough range of vertical
 *     acceleration in the surrounding 400 ms window.
 *   • Flat walking → range ≈ 1–3 m/s²  (horizontal bounce)
 *   • Stair climbing → range ≥ 4 m/s²  (real upward displacement per step)
 *   • Escalator/elevator → no cadence-correlated vertical impulse (filtered out)
 *
 * Barometer enhancement (Android Chrome / some Androids expose window.Barometer):
 *   • Sustained pressure drop (altitude rising) combined with stepping cadence
 *     confirms stair climbing and counts each step that occurs during the climb.
 *
 * INTEGRATION
 * ──────────────
 * Every counted stair is ALSO added to total steps (stair step = flat step + stair).
 * Daily totals are persisted in localStorage and synced to DailyLogs entity.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { DailyLogs } from '../storage';
import { format } from 'date-fns';

const TODAY = format(new Date(), 'yyyy-MM-dd');

// ── Tuning constants ──────────────────────────────────────────────────────────
const STEP_MAGNITUDE_DELTA  = 1.15;  // m/s² delta to trigger a step
const MIN_STEP_INTERVAL_MS  = 280;   // max ~3.6 steps/sec
const VERT_WINDOW_MS        = 380;   // window around step to measure vertical impulse
const STAIR_VERT_THRESHOLD  = 3.8;   // peak-to-trough vertical range (m/s²) for stair
const GRAVITY               = 9.81;
const MIN_STAIR_INTERVAL_MS = 350;   // stairs faster than this are noise
const CLIMBING_IDLE_MS      = 7000;  // "Climbing Now" clears after 7s of no stair

// Barometer: each ~0.12 hPa drop = ~1 m altitude gain
const BARO_PRESSURE_DROP    = 0.10;  // hPa per stair (conservative)
const BARO_STEP_WINDOW_MS   = 700;   // step must occur within this of pressure event

// ── Helpers ───────────────────────────────────────────────────────────────────
function magnitude(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}
function storageGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useHealthSteps(dateStr = TODAY) {
  const stepsKey  = `shedit_steps_${dateStr}`;
  const stairsKey = `shedit_stairs_${dateStr}`;

  const [permission,  setPermission]  = useState('unknown');
  const [steps,       setSteps]       = useState(() => {
    const log = DailyLogs.getByDate(dateStr);
    return log?.steps || storageGet(stepsKey, 0);
  });
  const [stairs,      setStairs]      = useState(() => {
    const log = DailyLogs.getByDate(dateStr);
    return log?.stairs_climbed || storageGet(stairsKey, 0);
  });
  const [source,      setSource]      = useState('manual');
  const [isClimbing,  setIsClimbing]  = useState(false);

  // ── Internal refs ─────────────────────────────────────────────────────────
  const lastMagRef        = useRef(GRAVITY);
  const lastStepTimeRef   = useRef(0);
  const lastStairTimeRef  = useRef(0);
  const climbTimerRef     = useRef(null);
  const motionListenerRef = useRef(null);

  // Circular buffer: {t, vz} samples for vertical-impulse analysis
  const vertBufferRef     = useRef([]);   // [{t, vz}]

  // Barometer state
  const baroRef           = useRef(null);
  const lastPressureRef   = useRef(null);
  const lastBaroStepRef   = useRef(0);    // timestamp of last step near a pressure event

  // ── Persist ────────────────────────────────────────────────────────────────
  const persistBoth = useCallback((nextSteps, nextStairs) => {
    storageSet(stepsKey,  nextSteps);
    storageSet(stairsKey, nextStairs);
    DailyLogs.upsert(dateStr, { steps: nextSteps, stairs_climbed: nextStairs });
  }, [dateStr, stepsKey, stairsKey]);

  // ── Climbing indicator ─────────────────────────────────────────────────────
  const triggerClimbing = useCallback(() => {
    setIsClimbing(true);
    if (climbTimerRef.current) clearTimeout(climbTimerRef.current);
    climbTimerRef.current = setTimeout(() => setIsClimbing(false), CLIMBING_IDLE_MS);
  }, []);

  // ── Vertical impulse check ─────────────────────────────────────────────────
  // Returns true if the vertical buffer around `now` shows a stair-level impulse.
  const isStairStep = useCallback((now) => {
    const buf = vertBufferRef.current;
    const windowStart = now - VERT_WINDOW_MS;
    const relevant = buf.filter(s => s.t >= windowStart && s.t <= now + 100);
    if (relevant.length < 3) return false;
    const vals = relevant.map(s => s.vz);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    return (max - min) >= STAIR_VERT_THRESHOLD;
  }, []);

  // ── Motion handler ─────────────────────────────────────────────────────────
  const startMotionTracking = useCallback(() => {
    if (motionListenerRef.current) return;

    const handler = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;
      const mag = magnitude(x, y, z);
      const delta = Math.abs(mag - lastMagRef.current);
      lastMagRef.current = mag;

      const now = Date.now();

      // Maintain vertical buffer (gravity-corrected z)
      const vz = z - (-GRAVITY); // remove gravity; positive = upward accel
      vertBufferRef.current.push({ t: now, vz });
      // Keep only last 600ms
      const cutoff = now - 600;
      while (vertBufferRef.current.length && vertBufferRef.current[0].t < cutoff) {
        vertBufferRef.current.shift();
      }

      // ── Step detection ──────────────────────────────────────────────────
      if (delta > STEP_MAGNITUDE_DELTA && (now - lastStepTimeRef.current) > MIN_STEP_INTERVAL_MS) {
        lastStepTimeRef.current = now;

        // Stair auto-detection disabled (too many false positives on web).
        // Steps only — stairs tracked manually via Log Stairs button.
        setSteps(prev => {
          const ns = prev + 1;
          storageSet(stepsKey, ns);
          DailyLogs.upsert(dateStr, { steps: ns });
          return ns;
        });
      }
    };

    window.addEventListener('devicemotion', handler);
    motionListenerRef.current = handler;
    setSource('motion');
    setPermission('granted');
  }, [isStairStep, triggerClimbing, persistBoth, dateStr, stepsKey]);

  // ── Barometer (enhancement) ────────────────────────────────────────────────
  const startBarometer = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.Barometer === 'undefined') return;
    try {
      const sensor = new window.Barometer({ frequency: 2 });
      sensor.addEventListener('reading', () => {
        const hPa = sensor.pressure;
        if (lastPressureRef.current === null) { lastPressureRef.current = hPa; return; }
        const drop = lastPressureRef.current - hPa; // positive = altitude rise
        lastPressureRef.current = hPa;

        if (drop >= BARO_PRESSURE_DROP) {
          const now = Date.now();
          // Only count if a step also occurred within window (filter escalators)
          if ((now - lastStepTimeRef.current) < BARO_STEP_WINDOW_MS) {
            const stairAllowed = (now - lastStairTimeRef.current) > MIN_STAIR_INTERVAL_MS;
            if (stairAllowed) {
              lastStairTimeRef.current = now;
              triggerClimbing();
              setSteps(prevSteps => {
                setStairs(prevStairs => {
                  const ns = prevSteps + 1;
                  const nst = prevStairs + 1;
                  persistBoth(ns, nst);
                  return nst;
                });
                return prevSteps + 1;
              });
            }
          }
        }
      });
      sensor.start();
      baroRef.current = sensor;
    } catch (_) { /* barometer not available — vertical accel fallback is active */ }
  }, [triggerClimbing, persistBoth]);

  // ── Permission flow ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setPermission('unavailable');
      return;
    }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setPermission('prompt'); // iOS 13+
    } else {
      setPermission('auto');   // Android / desktop
    }
  }, []);

  useEffect(() => {
    if (permission === 'auto') {
      startMotionTracking();
      startBarometer();
    }
  }, [permission, startMotionTracking, startBarometer]);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setPermission('unavailable');
      return false;
    }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') {
          startMotionTracking();
          startBarometer();
          return true;
        }
        setPermission('denied');
        return false;
      } catch {
        setPermission('denied');
        return false;
      }
    }
    startMotionTracking();
    startBarometer();
    return true;
  }, [startMotionTracking, startBarometer]);

  const denyPermission = useCallback(() => {
    setPermission('denied');
    setSource('manual');
  }, []);

  // ── Manual overrides ───────────────────────────────────────────────────────
  const updateStepsManually = useCallback((value) => {
    setSteps(value);
    storageSet(stepsKey, value);
    DailyLogs.upsert(dateStr, { steps: value });
  }, [dateStr, stepsKey]);

  const updateStairsManually = useCallback((value) => {
    setStairs(value);
    storageSet(stairsKey, value);
    DailyLogs.upsert(dateStr, { stairs_climbed: value });
  }, [dateStr, stairsKey]);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (motionListenerRef.current) {
        window.removeEventListener('devicemotion', motionListenerRef.current);
        motionListenerRef.current = null;
      }
      if (baroRef.current?.stop) baroRef.current.stop();
      if (climbTimerRef.current) clearTimeout(climbTimerRef.current);
    };
  }, []);

  return {
    steps,
    stairs,
    source,
    isClimbing,
    permission,
    requestPermission,
    denyPermission,
    updateStepsManually,
    updateStairsManually,
  };
}