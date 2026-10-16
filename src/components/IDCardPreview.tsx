import React from 'react';
import type { IDCardConfig } from '../types';

interface IDCardPreviewProps {
  config: IDCardConfig;
  cardIndex?: number;
  scale?: number;
  showShadow?: boolean;
}

export const IDCardPreview: React.FC<IDCardPreviewProps> = ({
  config,
  cardIndex = 0,
  scale = 1,
  showShadow = true
}) => {
  const currentIntake = config.intake === 'Custom Intake...' 
    ? (config.customIntake || 'Custom Intake') 
    : config.intake;

  const currentPassNumber = `${config.idPrefix}${String(config.startNumber + cardIndex).padStart(4, '0')}`;

  // Smart font size calculation for Programme Name to avoid clipping or overflow
  const progLength = config.programmeName?.length || 0;
  let programmeFontSize = 'text-[25px] leading-tight';
  if (progLength > 48) {
    programmeFontSize = 'text-[18px] leading-snug';
  } else if (progLength > 36) {
    programmeFontSize = 'text-[20px] leading-tight';
  } else if (progLength > 24) {
    programmeFontSize = 'text-[23px] leading-tight';
  }

  // Base dimensions matching 55mm x 85mm standard ratio: 330px x 510px
  const baseWidth = 330;
  const baseHeight = 510;

  return (
    <div
      style={{
        width: `${baseWidth * scale}px`,
        height: `${baseHeight * scale}px`,
        transformOrigin: 'top left'
      }}
      className={`relative select-none ${showShadow ? 'drop-shadow-xl' : ''}`}
    >
      <div
        className="w-full h-full bg-white rounded-[14px] overflow-hidden flex flex-col justify-between border border-slate-300/80 relative text-slate-800"
        style={{
          boxShadow: showShadow ? '0 12px 30px -4px rgba(0, 45, 98, 0.15), 0 4px 12px rgba(200, 16, 46, 0.1)' : 'none'
        }}
      >
        {/* Subtle Watermark Guilloche Pattern in Background */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#002d62 1px, transparent 1px), radial-gradient(#c8102e 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px'
          }}
        />

        {/* 1. TOP HEADER SECTION: BCAS Red Header with Blue Curved Border */}
        <div className="relative w-full">
          {/* Main Red Header */}
          <div className="bg-[#c8102e] pt-4 pb-3 px-3 text-center">
            <div className="text-[10px] tracking-[0.25em] font-extrabold text-red-100 uppercase opacity-90 mb-0.5">
              BCAS CAMPUS
            </div>
            <h2 className="text-[20px] font-black tracking-wider text-white uppercase leading-none font-sans drop-shadow-sm">
              TEMPORARY STUDENT PASS
            </h2>
          </div>

          {/* Elegant Blue Curved Arc Ribbon Below Red Header */}
          <div className="w-full overflow-hidden leading-none -mt-0.5">
            <svg
              viewBox="0 0 330 24"
              className="w-full h-[22px] block"
              preserveAspectRatio="none"
            >
              {/* Blue Curved Band */}
              <path
                d="M0,0 L330,0 Q165,24 0,0 Z"
                fill="#002d62"
              />
              {/* Subtle Gold / Sky highlight line */}
              <path
                d="M0,0 Q165,20 330,0"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.2"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* 2. MIDDLE CONTENT SECTION */}
        <div className="flex-1 px-4 py-2 flex flex-col justify-around text-center relative z-10">
          
          {/* Card Reference / Pass Serial */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5 px-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              PASS NO:
            </span>
            <span className="font-mono text-[12px] font-extrabold text-[#002d62] tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {currentPassNumber}
            </span>
          </div>

          {/* Programme Name with Auto-adjusting Typography */}
          <div className="my-auto py-1">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
              Academic Programme
            </div>
            <div className={`font-black text-[#0f172a] tracking-tight px-1 font-sans ${programmeFontSize}`}>
              {config.programmeName || 'BSc (Hons) Computer Science'}
            </div>
          </div>

          {/* Intake & Academic Year Information Grid */}
          <div className="bg-slate-50/95 rounded-xl p-3.5 border border-slate-200/90 space-y-2.5 my-1 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-500 uppercase text-[12px] tracking-wider">Intake:</span>
              <span className="font-black text-[#c8102e] tracking-tight text-[19px]">
                {currentIntake}
              </span>
            </div>
            <div className="h-[1px] bg-slate-200/80 w-full" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-500 uppercase text-[12px] tracking-wider">Academic Year:</span>
              <span className="font-black text-[#002d62] tracking-tight text-[19px]">
                {config.academicYear || '2026/2027'}
              </span>
            </div>
          </div>

          {/* Barcode & Validity Notice */}
          <div className="pt-1 flex flex-col items-center w-full">
            {config.showBarcode && (
              <div className="flex flex-col items-center justify-center w-full mb-1">
                {/* Visual Barcode Graphic — centered with mx-auto */}
                <div className="flex items-end justify-center h-6 gap-[2.5px] w-full max-w-[200px] mx-auto mb-1">
                  {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 3, 2, 4, 1].map((weight, i) => (
                    <div
                      key={i}
                      className="bg-slate-800"
                      style={{
                        width: `${weight * 1.3}px`,
                        height: '100%'
                      }}
                    />
                  ))}
                </div>
                <div className="font-mono text-[8px] text-slate-500 tracking-widest text-center">
                  *{currentPassNumber}*
                </div>
              </div>
            )}
            <p className="text-[8px] text-slate-500 italic leading-tight text-center w-full px-1">
              Official temporary pass. Present to campus security &amp; faculty on request.
            </p>
          </div>
        </div>

        {/* 3. BOTTOM LOGO & DECORATION SECTION */}
        <div className="relative w-full">
          {/* Logo Area */}
          <div className="px-4 py-2 bg-white/95">
            {config.partnerLogoData ? (
              /* Two Logos: BCAS on Left, Partner on Right */
              <div className="flex items-center justify-between gap-3 h-11 px-1">
                {/* BCAS Campus Logo */}
                <div className="flex-1 flex items-center justify-center h-full">
                  <img
                    src="/bcas-logo.png"
                    alt="BCAS Campus"
                    className="max-h-9 max-w-full object-contain"
                  />
                </div>

                {/* Subtle Vertical Divider */}
                <div className="w-[1px] h-7 bg-slate-200" />

                {/* Partner University Logo */}
                <div className="flex-1 flex items-center justify-center h-full">
                  <img
                    src={config.partnerLogoData}
                    alt={config.partnerLogoName || 'Partner University'}
                    className="max-h-9 max-w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              /* Single BCAS Logo: Perfectly Centered */
              <div className="flex items-center justify-center h-11">
                <img
                  src="/bcas-logo.png"
                  alt="BCAS Campus Official Logo"
                  className="max-h-10 max-w-[180px] object-contain"
                />
              </div>
            )}
          </div>

          {/* Red Curved Bottom Decoration */}
          <div className="w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 330 18"
              className="w-full h-[16px] block"
              preserveAspectRatio="none"
            >
              {/* Blue accent underlay curve */}
              <path
                d="M0,18 Q165,0 330,18 Z"
                fill="#002d62"
                opacity="0.3"
              />
              {/* Red Bottom Wave Ribbon */}
              <path
                d="M0,18 Q165,4 330,18 Z"
                fill="#c8102e"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
