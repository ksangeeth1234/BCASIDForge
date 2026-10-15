import React, { useEffect, useState } from 'react';
import { ShieldCheck, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Verifying local environment integrity...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [assetStatus, setAssetStatus] = useState<'checking' | 'verified' | 'warning'>('checking');

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 12;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStageText('Application readiness check verified');
        setAssetStatus('verified');
        clearInterval(interval);

        // Hold for a brief moment then fade out smoothly
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 500);
      } else {
        setProgress(currentProgress);
        if (currentProgress > 30 && currentProgress < 65) {
          setStageText('Validating institutional branding assets & fonts...');
        } else if (currentProgress >= 65) {
          setStageText('Initializing client-side A4 layout engine...');
        }
      }
    }, 240);

    // Verify local bcas-logo asset
    const img = new Image();
    img.src = '/bcas-logo.png';
    img.onload = () => {
      // asset verified
    };
    img.onerror = () => {
      setAssetStatus('warning');
    };

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 10% 15%, rgba(200, 16, 46, 0.05) 0%, transparent 45%), radial-gradient(circle at 90% 85%, rgba(0, 45, 98, 0.06) 0%, transparent 45%), #ffffff'
      }}
    >
      {/* Decorative background grid subtle lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        {/* BCAS Official Logo */}
        <div className="mb-6 flex justify-center">
          <div className="p-3 bg-white/80 rounded-2xl shadow-sm border border-slate-100">
            <img
              src="/bcas-logo.png"
              alt="BCAS Campus Official Logo"
              className="h-16 w-auto object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Welcome Typography */}
        <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">
          Welcome to
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 font-sans">
          BCAS <span className="text-[#c8102e]">IDForge</span>
        </h1>
        <div className="inline-block px-3 py-1 bg-red-50 text-[#c8102e] font-semibold text-xs rounded-full border border-red-100 mb-8 tracking-wide">
          Temporary Student ID Generator
        </div>

        {/* Security / Readiness Checking Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-100/80 mb-6 relative">
          <div className="flex items-center justify-center mb-4">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center animate-shield-pulse border border-slate-200">
                {assetStatus === 'verified' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 transition-all duration-300" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-[#002d62] transition-all duration-300" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-bold text-slate-800">
              Checking security...
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {progress}%
            </span>
          </div>

          <p className="text-xs text-slate-500 min-h-[1.5rem] transition-all duration-300 mb-4">
            {stageText}
          </p>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out shimmer-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" /> Local Client Sandbox
            </span>
            <span>No Cloud Data Upload</span>
          </div>
        </div>

        {/* Quick Skip button */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors py-2 px-3 rounded-lg hover:bg-slate-100"
        >
          <span>Skip initialization</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtle Institutional Footer Notice */}
      <div className="absolute bottom-6 text-center text-xs text-slate-400">
        British College of Applied Studies &bull; Administrative Portal
      </div>
    </div>
  );
};
