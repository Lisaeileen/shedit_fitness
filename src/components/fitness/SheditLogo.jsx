import React from 'react';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69ab1bdf5518ce71465536ba/3d03fca99_generated_image.png';

// Full wordmark: icon + "Shedit" text
export function SheditWordmark({ size = 32, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ width: size, height: size, background: '#000', padding: size * 0.08 }}
      >
        <img src={LOGO_URL} alt="Shedit" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <span
        className="font-black tracking-tight"
        style={{
          fontSize: size * 0.65,
          background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Shedit
      </span>
    </div>
  );
}

// Icon only — square, black bg, logo centered
export function SheditIcon({ size = 40, rounded = 'xl', className = '' }) {
  const radii = { sm: '8px', md: '10px', lg: '14px', xl: '16px', '2xl': '20px', '3xl': '24px', full: '50%' };
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        background: '#000',
        borderRadius: radii[rounded] || rounded,
        padding: size * 0.1,
      }}
    >
      <img src={LOGO_URL} alt="Shedit" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

export default SheditWordmark;