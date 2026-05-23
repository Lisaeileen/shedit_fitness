import React, { useState } from 'react';
import { isOnboardingComplete, markOnboardingComplete } from './onboardingUtils';
import NewOnboardingFlow from './NewOnboardingFlow';

export default function OnboardingGate({ children }) {
  const [done, setDone] = useState(() => isOnboardingComplete());

  if (done) return <>{children}</>;

  return (
    <NewOnboardingFlow
      onComplete={(data) => {
        markOnboardingComplete(data);
        setDone(true);
      }}
    />
  );
}