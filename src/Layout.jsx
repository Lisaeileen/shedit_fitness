import React from 'react';
import BottomNav from './components/fitness/BottomNav';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-lg mx-auto pb-24">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}