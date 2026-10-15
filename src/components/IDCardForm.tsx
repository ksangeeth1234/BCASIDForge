import React, { useRef } from 'react';
import type { IDCardConfig } from '../types';
import { 
  PROGRAMME_PRESETS, 
  INTAKE_MONTHS, 
  PARTNER_PRESETS 
} from '../constants/presets';
import { 
  GraduationCap, 
  Calendar, 
  Layers, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  RotateCcw, 
  X, 
  FileCheck2,
  Printer,
  Download,
  Barcode
} from 'lucide-react';

interface IDCardFormProps {
  config: IDCardConfig;
  onChange: (updated: Partial<IDCardConfig>) => void;
  onReset: () => void;
  onGenerate: () => void;
  onDownload: () => void;
  onPrint: () => void;
  isGenerating: boolean;
}

export const IDCardForm: React.FC<IDCardFormProps> = ({
  config,
  onChange,
  onReset,
  onGenerate,
  onDownload,
  onPrint,
  isGenerating
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(Math.max(1, config.numberOfCards) / 9);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (PNG, JPG, SVG, or WEBP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          partnerLogoData: result,
          partnerLogoUrl: '',
          partnerLogoName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange({
      partnerLogoUrl: url,
      partnerLogoData: url ? url : null,
      partnerLogoName: url ? 'Custom Web Logo' : ''
    });
  };

  const handlePartnerPreset = (presetName: string) => {
    if (presetName === 'none') {
      onChange({
        partnerLogoData: null,
        partnerLogoUrl: '',
        partnerLogoName: ''
      });
      return;
    }
    const preset = PARTNER_PRESETS.find(p => p.name === presetName);
    if (preset && preset.svgDataUri) {
      onChange({
        partnerLogoData: preset.svgDataUri,
        partnerLogoUrl: '',
        partnerLogoName: preset.label
      });
    }
  };



  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      
      {/* 1. Academic Programme Field */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#c8102e]" />
            Academic Programme Name *
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            Auto-scales on card
          </span>
        </label>
        <input
          type="text"
          value={config.programmeName}
          onChange={(e) => onChange({ programmeName: e.target.value })}
          placeholder="e.g. BSc (Hons) Computer Science"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#c8102e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
          required
        />
        
        {/* Quick Programme Presets */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PROGRAMME_PRESETS.slice(0, 5).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ programmeName: p })}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                config.programmeName === p
                  ? 'bg-red-50 text-[#c8102e] border-red-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Intake & Academic Year Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Intake */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#002d62]" />
            Intake *
          </label>
          <select
            value={config.intake}
            onChange={(e) => onChange({ intake: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#002d62] focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 bg-white"
          >
            {INTAKE_MONTHS.map((intake) => (
              <option key={intake} value={intake}>
                {intake}
              </option>
            ))}
          </select>

          {config.intake === 'Custom Intake...' && (
            <input
              type="text"
              value={config.customIntake}
              onChange={(e) => onChange({ customIntake: e.target.value })}
              placeholder="Enter custom intake (e.g. Special Batch 2026)"
              className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-[#002d62]"
            />
          )}
        </div>

        {/* Academic Year — free text input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#002d62]" />
            Academic Year *
          </label>
          <input
            type="text"
            value={config.academicYear}
            onChange={(e) => onChange({ academicYear: e.target.value })}
            placeholder="e.g. 2026/2027 or 2027"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#002d62] focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800"
            required
          />
          {/* Quick-pick year shortcuts */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {['2024/2025', '2025/2026', '2026/2027', '2027/2028', '2026', '2027'].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => onChange({ academicYear: yr })}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  config.academicYear === yr
                    ? 'bg-[#002d62] text-white border-[#002d62] font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Optional Partner University Logo */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Partner University / Awarding Body (Optional)
          </label>
          {config.partnerLogoData && (
            <button
              type="button"
              onClick={() => handlePartnerPreset('none')}
              className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove Logo
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 leading-snug">
          When absent, the official BCAS logo is centered. When supplied, the partner logo is displayed on the right.
        </p>

        {/* Preset partner universities */}
        <div className="flex flex-wrap gap-1.5">
          {PARTNER_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePartnerPreset(preset.name)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                (!config.partnerLogoData && preset.name === 'none') ||
                (config.partnerLogoName === preset.label)
                  ? 'bg-[#002d62] text-white border-[#002d62] font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Upload or URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* File Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload Local Image</span>
            </button>
          </div>

          {/* Web URL Input */}
          <div className="relative">
            <input
              type="url"
              value={config.partnerLogoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:border-[#002d62]"
            />
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Live Partner Logo Thumbnail */}
        {config.partnerLogoData && (
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
            <div className="h-8 w-20 flex items-center justify-center bg-slate-50 rounded border border-slate-100 p-1">
              <img
                src={config.partnerLogoData}
                alt="Partner Logo Thumbnail"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="text-xs text-slate-700 font-medium truncate flex-1">
              {config.partnerLogoName || 'Custom Partner Logo'}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Active
            </span>
          </div>
        )}
      </div>

      {/* 4. Number of ID Cards to Print */}
      <div className="bg-gradient-to-br from-[#002d62]/5 to-[#c8102e]/5 border border-[#002d62]/20 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-[#002d62] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#002d62]" />
            Number of ID Cards to Print
          </label>
        </div>

        {/* Large prominent input + live A4 counter */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="number"
              min="1"
              max="999"
              value={config.numberOfCards}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                onChange({ numberOfCards: Math.max(1, Math.min(999, val)) });
              }}
              className="w-28 text-3xl font-black text-center text-[#002d62] bg-white border-2 border-[#002d62]/30 focus:border-[#002d62] rounded-xl py-3 px-2 outline-none shadow-sm"
              required
            />
            <span className="absolute -bottom-4 left-0 right-0 text-[10px] text-center font-semibold text-slate-500">
              cards total
            </span>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">A4 Pages Required</div>
            <div className="text-2xl font-black text-[#c8102e]">
              {totalPages} <span className="text-sm font-semibold text-slate-500">x A4 sheets</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
              9 cards per page — {config.numberOfCards} cards across {totalPages} {totalPages === 1 ? 'page' : 'pages'}
            </div>
          </div>
        </div>

        {/* Quick-pick grid */}
        <div className="pt-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Select</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { n: 1,  sub: 'preview' },
              { n: 9,  sub: '1 sheet'  },
              { n: 18, sub: '2 sheets' },
              { n: 27, sub: '3 sheets' },
              { n: 36, sub: '4 sheets' },
              { n: 45, sub: '5 sheets' },
              { n: 54, sub: '6 sheets' },
              { n: 90, sub: '10 sheets'},
            ].map(({ n, sub }) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ numberOfCards: n })}
                className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all ${
                  config.numberOfCards === n
                    ? 'bg-[#002d62] text-white border-[#002d62] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#002d62]/40 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black leading-none">{n}</span>
                <span className={`text-[9px] mt-0.5 font-medium leading-none ${config.numberOfCards === n ? 'text-blue-100' : 'text-slate-400'}`}>
                  {sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Pass Numbering & Barcode Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Card Prefix
          </label>
          <input
            type="text"
            value={config.idPrefix}
            onChange={(e) => onChange({ idPrefix: e.target.value })}
            placeholder="BCAS-TMP-"
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Starting Pass Sequence #
          </label>
          <input
            type="number"
            min="1"
            value={config.startNumber}
            onChange={(e) => onChange({ startNumber: Math.max(1, parseInt(e.target.value) || 1) })}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800"
          />
        </div>
      </div>

      {/* Barcode toggle */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showBarcode}
            onChange={(e) => onChange({ showBarcode: e.target.checked })}
            className="rounded text-[#c8102e] focus:ring-red-400 w-4 h-4 cursor-pointer"
          />
          <span className="font-medium flex items-center gap-1">
            <Barcode className="w-3.5 h-3.5 text-slate-500" />
            Include verification barcode graphic
          </span>
        </label>
      </div>

      {/* 6. Primary Action Buttons */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200">
        {/* Main Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 px-4 bg-[#c8102e] hover:bg-[#9e0c24] text-white font-black text-sm tracking-wide rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
        >
          <FileCheck2 className="w-5 h-5" />
          <span>{isGenerating ? 'Forging ID Cards...' : 'Generate ID Cards'}</span>
        </button>

        {/* Secondary Action Row: Download, Print, Reset */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={isGenerating}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#002d62] hover:bg-[#001e40] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
            title="Download PDF directly"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            disabled={isGenerating}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
            title="Print A4 sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isGenerating}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors"
            title="Reset form to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
