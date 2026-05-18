import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { markOnboardingComplete, calculatePlan } from './onboardingUtils';
import { PrimaryButton } from './StepButton';
import {
  StepGetStarted, StepSex, StepWorkoutFreq, StepDOB, StepDiscovery,
  StepExperience, StepValueGraph, StepHeightWeight, StepProfessional,
  StepGoalType, StepDesiredWeight, StepGoalSpeed, StepValueProp,
  StepBarriers, StepDietType, StepMotivation, StepPersonalization,
  StepHealthIntegration, StepSyncExplanation, StepCalorieSettings,
  StepCalorieRollover, StepSocialProof, StepNotifications,
} from './OnboardingSteps';
import {
  StepGenerating, StepResults, StepUserSummary, StepProgressGraph,
  StepHowToSucceed, StepWhyShedit, StepTrust, StepPaywall,
} from './OnboardingResults';

// Steps where the user picks an option that auto-advances (no separate Next button)
const AUTO_STEPS = new Set([1, 2, 4, 5, 8, 9, 14, 22]);
// All other steps show a Next button (info screens, sliders, inputs, multi-select)

const TOTAL = 31;

export default function NewOnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    sex: null, dob: null, workout_freq: null, discovery: null,
    prior_app: null, height_cm: 170, weight_kg: 75, unit: 'metric',
    professional_support: null, goal_type: null, desired_weight_kg: 70,
    goal_speed: 'recommended', barriers: [], diet_type: null,
    health_connect: null, add_burned: null, rollover: null,
    notifications: null,
  });
  const scrollRef = useRef(null);

  const set = (field, value) => setData(d => ({ ...d, [field]: value }));
  const setMany = (fields) => setData(d => ({ ...d, ...fields }));

  const scrollTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const next = () => {
    if (step < TOTAL - 1) {
      setStep(s => s + 1);
      scrollTop();
    } else {
      // Last step — trigger generating + complete
      triggerComplete();
    }
  };

  const back = () => {
    if (step > 0) { setStep(s => s - 1); scrollTop(); }
  };

  const triggerComplete = () => {
    const plan = calculatePlan(data);
    const finalData = { ...data, ...plan };
    markOnboardingComplete(finalData);
    onComplete(finalData);
  };

  const canContinue = () => {
    if (step === 3) return !!data.dob;
    if (step === 7) return !!(data.height_cm && data.weight_kg);
    if (step === 10) return !!data.desired_weight_kg;
    if (step === 11) return !!data.goal_speed;
    return true;
  };

  const showNextButton = !AUTO_STEPS.has(step);

  const progressPct = ((step) / (TOTAL - 1)) * 100;
  const isFirstStep = step === 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0618' }}>
      {/* Header */}
      {!isFirstStep && (
        <div className="px-5 pt-safe flex-shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top, 20px), 20px)' }}>
          <div className="flex items-center gap-3 mb-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={back}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </motion.button>
            {/* Progress bar */}
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #7c3aed, #4f9ef7)' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }} />
            </div>
            <span className="text-[11px] text-gray-500 flex-shrink-0">{step}/{TOTAL - 1}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-36 no-scrollbar"
        style={{ paddingTop: isFirstStep ? 'max(env(safe-area-inset-top, 44px), 44px)' : 0 }}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}>

            {step === 0  && <StepGetStarted onNext={next} />}
            {step === 1  && <StepSex value={data.sex} onChange={v => set('sex', v)} onNext={next} />}
            {step === 2  && <StepWorkoutFreq value={data.workout_freq} onChange={v => set('workout_freq', v)} onNext={next} />}
            {step === 3  && <StepDOB value={data.dob} onChange={v => set('dob', v)} />}
            {step === 4  && <StepDiscovery value={data.discovery} onChange={v => set('discovery', v)} onNext={next} />}
            {step === 5  && <StepExperience value={data.prior_app} onChange={v => set('prior_app', v)} onNext={next} />}
            {step === 6  && <StepValueGraph />}
            {step === 7  && <StepHeightWeight data={data} onChange={setMany} />}
            {step === 8  && <StepProfessional value={data.professional_support} onChange={v => set('professional_support', v)} onNext={next} />}
            {step === 9  && <StepGoalType value={data.goal_type} onChange={v => set('goal_type', v)} onNext={next} />}
            {step === 10 && <StepDesiredWeight data={data} onChange={setMany} />}
            {step === 11 && <StepGoalSpeed value={data.goal_speed} onChange={v => set('goal_speed', v)} data={data} />}
            {step === 12 && <StepValueProp />}
            {step === 13 && <StepBarriers value={data.barriers} onChange={v => set('barriers', v)} />}
            {step === 14 && <StepDietType value={data.diet_type} onChange={v => set('diet_type', v)} onNext={next} />}
            {step === 15 && <StepMotivation data={data} />}
            {step === 16 && <StepPersonalization />}
            {step === 17 && <StepHealthIntegration value={data.health_connect} onChange={v => set('health_connect', v)} />}
            {step === 18 && <StepSyncExplanation />}
            {step === 19 && <StepCalorieSettings value={data.add_burned} onChange={v => set('add_burned', v)} onNext={next} />}
            {step === 20 && <StepCalorieRollover value={data.rollover} onChange={v => set('rollover', v)} onNext={next} />}
            {step === 21 && <StepSocialProof />}
            {step === 22 && <StepNotifications value={data.notifications} onChange={v => set('notifications', v)} onNext={next} />}
            {step === 23 && <StepGenerating onDone={next} />}
            {step === 24 && <StepResults data={data} />}
            {step === 25 && <StepUserSummary data={data} />}
            {step === 26 && <StepProgressGraph data={data} />}
            {step === 27 && <StepHowToSucceed />}
            {step === 28 && <StepWhyShedit />}
            {step === 29 && <StepTrust />}
            {step === 30 && <StepPaywall onComplete={triggerComplete} />}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — Next button */}
      {step !== 0 && step !== 23 && step !== 30 && showNextButton && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pt-4 max-w-md mx-auto"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 24px)', background: 'linear-gradient(to top, #0d0618 55%, transparent)' }}>
          <PrimaryButton onClick={next} disabled={!canContinue()}>
            {step === 29 ? 'Get Started' : 'Next'}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}