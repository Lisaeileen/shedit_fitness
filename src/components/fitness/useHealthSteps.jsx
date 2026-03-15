/**
 * useHealthSteps  —  Advanced step + stair detection hook
 *
 * Step counting:   DeviceMotion accelerometer peak-detection (web-compatible)
 * Stair detection: Barometer / AltitudeSensor API (where available) tracks
 *                  pressure drops.  Falls back to vertical-acceleration heuristic.
 *
 * Rules:
 *  - Each stair counted also increments total steps by 1.
 *  - A "stair climb" session starts when ≥2 stairs are detected within 10 s.
 *  - Elevators / escalators are filtered: elevation must rise with simultaneous
 *    rhythmic vertical acceleration (stepping motion).
 *  - Counts persist per-day in localStorage.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { DailyLogs } from '../storage';
import { format } from 'date-fns';

const TODAY = format(new Date(), 'yyyy-MM-dd');

// ── Constants ─────────────────────────────────────────────────────────────────
const STEP_THRESHOLD       = 1.2;   // accel magnitude delta to count a step
const MIN_STEP_INTERVAL_MS = 280;   // ~3.6 steps/sec max
const STAIR_PRESSURE_DROP  = 0.06;  // hPa drop = ~0.5 m elevation gain
const MIN_STAIR_INTERVAL_MS= 400;   // stairs can't be climbed faster than this
const STAIR_STEP_WINDOW_MS = 600;   // step must occur within this window of pressure event
const CLIMBING_IDLE_MS     = 6000;  // stop "climbing" indicator after 6 s of no stairs

function getMagnitude(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}

function storageGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function useHealthSteps(dateStr = TODAY) {
  const stepsKey  = `shedit_steps_${dateStr}`;
  const stairsKey = `shedit_stairs_${dateStr}`;

  const [permission,    setPermission]    = useState('unknown');
  const [steps,         setSteps]         = useState(() => {
    const log = DailyLogs.getByDate(dateStr);
    return log?.steps || storageGet(stepsKey, 0);
  });
  const [stairs,        setStairs]        = useState(() => {
    const log = DailyLogs.getByDate(dateStr);
    return log?.stairs_climbed || storageGet(stairsKey, 0);
  });
  const [source,        setSource]        = useState('manual');
  const [isClimbing,    setIsClimbing]    = useState(false);
  const [barometerAvail, setBarometerAvail] = useState(false);

  // Internal refs
  const lastMagRef       = useRef(9.8);
  const lastStepTimeRef  = useRef(0);
  const recentStepRef    = useRef(0);   // timestamp of most recent step (for stair correlation)
  const lastPressureRef  = useRef(null);
  const lastStairTimeRef = useRef(0);
  const climbingTimerRef = useRef(null);
  const motionListenerRef = useRef(null);
  const barometerRef     = useRef(null);

  // ── Persist helpers ──────────────────────────────────────────────────────────
  const persistSteps = useCallback((val) => {
    storageSet(stepsKey, val);
    DailyLogs.upsert(dateStr, { steps: val });
  }, [dateStr, stepsKey]);

  const persistStairs = useCallback((val, stepsVal) => {
    storageSet(stairsKey, val);
    DailyLogs.upsert(dateStr, { stairs_climbed: val, steps: stepsVal });
  }, [dateStr, stairsKey]);

  // ── Stair counting ───────────────────────────────────────────────────────────
  const countStair = useCallback(() => {
    const now = Date.now();
    if (now - lastStairTimeRef.current < MIN_STAIR_INTERVAL_MS) return;
    lastStairTimeRef.current = now;

    // Require a recent step to filter out elevators / escalators
    const stepRecency = now - recentStepRef.current;
    if (stepRecency > STAIR_STEP_WINDOW_MS) return;

    setStairs(prev => {
      const next = prev + 1;
      setSteps(s => {
        const ns = s + 1; // stair also counts as step
        persistStairs(next, ns);
        return ns;
      });
      return next;
    });

    // Activate climbing indicator
    setIsClimbing(true);
    if (climbingTimerRef.current) clearTimeout(climbingTimerRef.current);
    climbingTimerRef.current = setTimeout(() => setIsClimbing(false), CLIMBING_IDLE_MS);
  }, [persistStairs]);

  // ── Motion (step) handler ────────────────────────────────────────────────────
  const startMotionTracking = useCallback(() => {
    if (motionListenerRef.current) return;

    const handler = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const mag = getMagnitude(acc.x || 0, acc.y || 0, acc.z || 0);
      const delta = Math.abs(mag - lastMagRef.current);
      lastMagRef.current = mag;

      const now = Date.now();
      if (delta > STEP_THRESHOLD && now - lastStepTimeRef.current > MIN_STEP_INTERVAL_MS) {
        lastStepTimeRef.current = now;
        recentStepRef.current   = now;

        setSteps(prev => {
          const next = prev + 1;
          persistSteps(next);
          return next;
        });
      }
    };

    window.addEventListener('devicemotion', handler);
    motionListenerRef.current = handler;
    setSource('motion');
    setPermission('granted');
  }, [persistSteps]);

  // ── Barometer / pressure tracking ───────────────────────────────────────────
  const startBarometer = useCallback(() => {
    // Sensor API (Android Chrome)
    if (typeof window.AbsoluteOrientationSensor === 'undefined' && typeof window.Barometer !== 'undefined') {
      try {
        const sensor = new window.Barometer({ frequency: 2 });
        sensor.addEventListener('reading', () => {
          const hPa = sensor.pressure;
          if (lastPressureRef.current === null) { lastPressureRef.current = hPa; return; }
          const drop = lastPressureRef.current - hPa; // positive = rising altitude
          if (drop >= STAIR_PRESSURE_DROP) {
            countStair();
          }
          lastPressureRef.current = hPa;
        });
        sensor.start();
        barometerRef.current = sensor;
        setBarometerAvail(true);
        return;
      } catch {}
    }

    // Fallback: use DeviceMotion vertical acceleration as stair proxy.
    // When a user climbs stairs, the vertical (z-axis) component shows a distinct
    // upward impulse on each step that differs from level walking.
    // We detect a sustained upward net-force signature.
    if (!window.__stairFallbackActive) {
      window.__stairFallbackActive = true;
      let vertBuf = [];
      const stairHandler = (e) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;
        // z-axis: on phone held upright, negative z = acceleration upward
        vertBuf.push(acc.z || 0);
        if (vertBuf.length > 6) vertBuf.shift();
        if (vertBuf.length === 6) {
          // Mean of last 6 samples — climbing produces sustained negative z bias
          const mean = vertBuf.reduce((a, b) => a + b, 0) / vertBuf.length;
          if (mean < -11.5) { // > ~1.7 m/s² net upward accel
            countStair();
            vertBuf = [];
          }
        }
      };
      window.addEventListener('devicemotion', stairHandler);
      barometerRef.current = { stop: () => window.removeEventListener('devicemotion', stairHandler) };
    }
  }, [countStair]);

  // ── Permission logic ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setPermission('unavailable');
      return;
    }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setPermission('prompt');
    } else {
      setPermission('auto');
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
        } else {
          setPermission('denied');
          return false;
        }
      } catch {
        setPermission('denied');
        return false;
      }
    } else {
      startMotionTracking();
      startBarometer();
      return true;
    }
  }, [startMotionTracking, startBarometer]);

  const denyPermission = useCallback(() => {
    setPermission('denied');
    setSource('manual');
  }, []);

  // ── Manual overrides ─────────────────────────────────────────────────────────
  const updateStepsManually = useCallback((value) => {
    setSteps(value);
    persistSteps(value);
  }, [persistSteps]);

  const updateStairsManually = useCallback((value) => {
    setStairs(value);
    DailyLogs.upsert(dateStr, { stairs_climbed: value });
  }, [dateStr]);

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (motionListenerRef.current) {
        window.removeEventListener('devicemotion', motionListenerRef.current);
        motionListenerRef.current = null;
      }
      if (barometerRef.current?.stop) barometerRef.current.stop();
      if (climbingTimerRef.current) clearTimeout(climbingTimerRef.current);
      window.__stairFallbackActive = false;
    };
  }, []);

  return {
    steps,
    stairs,
    source,
    isClimbing,
    barometerAvail,
    permission,
    requestPermission,
    denyPermission,
    updateStepsManually,
    updateStairsManually,
  };
}