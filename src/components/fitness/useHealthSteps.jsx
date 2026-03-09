/**
 * useHealthSteps hook
 *
 * Web platforms cannot directly access HealthKit (iOS) or Google Fit (Android)
 * from a browser — those require native app wrappers (Capacitor / React Native).
 *
 * What this hook does:
 *  1. Checks if the Web Accelerometer API is available (for step detection via motion).
 *  2. Uses a simple peak-detection algorithm on accelerometer magnitude to count steps.
 *  3. Persists the day's step count in localStorage so it survives page refreshes.
 *  4. Exposes permission state so the UI can show a permission prompt or manual fallback.
 *
 * On iOS Safari (15.4+) and Android Chrome, DeviceMotion requires explicit user
 * permission (requestPermission). This hook handles that flow.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { DailyLogs } from '../storage';
import { format } from 'date-fns';

const TODAY = format(new Date(), 'yyyy-MM-dd');
const STORAGE_KEY = `shedit_steps_${TODAY}`;
const MOTION_STORAGE_KEY = `shedit_motion_steps_${TODAY}`;

// Accelerometer-based step detection constants
const STEP_THRESHOLD = 1.2;      // Magnitude delta to count as a step
const MIN_STEP_INTERVAL_MS = 300; // Minimum ms between steps (~3 steps/sec max)

function getMagnitude(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}

export function useHealthSteps(dateStr = TODAY) {
  const [permission, setPermission] = useState('unknown'); // 'unknown' | 'granted' | 'denied' | 'unavailable'
  const [steps, setSteps] = useState(() => {
    try {
      const log = DailyLogs.getByDate(dateStr);
      return log?.steps || 0;
    } catch { return 0; }
  });
  const [source, setSource] = useState('manual'); // 'motion' | 'manual'

  const lastMagRef    = useRef(9.8); // gravity baseline
  const lastStepTime  = useRef(0);
  const motionSteps   = useRef(() => {
    try { return parseInt(localStorage.getItem(MOTION_STORAGE_KEY) || '0', 10); } catch { return 0; }
  });
  const listenerRef   = useRef(null);

  // Detect capability
  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setPermission('unavailable');
      return;
    }
    // iOS 13+ requires permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setPermission('prompt'); // needs explicit request
    } else {
      // Android / desktop — permission is auto-granted when listener is added
      setPermission('auto');
    }
  }, []);

  const startMotionTracking = useCallback(() => {
    if (listenerRef.current) return; // already running

    const handler = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const mag = getMagnitude(acc.x || 0, acc.y || 0, acc.z || 0);
      const delta = Math.abs(mag - lastMagRef.current);
      lastMagRef.current = mag;

      const now = Date.now();
      if (delta > STEP_THRESHOLD && now - lastStepTime.current > MIN_STEP_INTERVAL_MS) {
        lastStepTime.current = now;
        motionSteps.current = (motionSteps.current || 0) + 1;
        try { localStorage.setItem(MOTION_STORAGE_KEY, String(motionSteps.current)); } catch {}

        // Merge with any manually-set base (in case user set steps manually earlier)
        setSteps(prev => {
          const newVal = prev + 1;
          DailyLogs.upsert(dateStr, { steps: newVal });
          return newVal;
        });
      }
    };

    window.addEventListener('devicemotion', handler);
    listenerRef.current = handler;
    setSource('motion');
    setPermission('granted');
  }, [dateStr]);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setPermission('unavailable');
      return false;
    }

    // iOS requires explicit requestPermission call
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') {
          startMotionTracking();
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
      // Android / desktop — just start
      startMotionTracking();
      return true;
    }
  }, [startMotionTracking]);

  const denyPermission = useCallback(() => {
    setPermission('denied');
    setSource('manual');
  }, []);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener('devicemotion', listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  // Auto-start on Android (no permission needed)
  useEffect(() => {
    if (permission === 'auto') {
      startMotionTracking();
    }
  }, [permission, startMotionTracking]);

  const updateStepsManually = useCallback((value) => {
    setSteps(value);
    DailyLogs.upsert(dateStr, { steps: value });
  }, [dateStr]);

  return {
    steps,
    source,
    permission, // 'unknown' | 'prompt' | 'auto' | 'granted' | 'denied' | 'unavailable'
    requestPermission,
    denyPermission,
    updateStepsManually,
  };
}