import React from 'react';
import type { GenerationProgress } from '../types';
import { Layers, CheckCircle2, AlertCircle, RotateCcw, Download, Printer, X } from 'lucide-react';

interface ForgeModalProps {
  progress: GenerationProgress;
  onRetry: () => void;
  onClose: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export const ForgeModal: React.FC<ForgeModalProps> = ({
  progress,
  onRetry,
  onClose,
  onDownload,
  onPrint
}) => {
  if (!progress.isGenerating && !progress.isComplete && !progress.error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-center p-6 sm:p-8">
        
        {/* Close Button when finished */}
        {(progress.isComplete || progress.error) && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Forge Animation Graphic */}
        <div className="mb-6 flex justify-center">
          {progress.error ? (
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 animate-bounce">
              <AlertCircle className="w-8 h-8" />
            </div>
          ) : progress.isComplete ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 scale-110 transition-transform">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          ) : (
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Stacked Floating Card Animation */}
              <div className="absolute w-12 h-16 rounded-lg bg-[#c8102e]/20 border border-[#c8102e]/30 transform -rotate-12 translate-x-2 -translate-y-1 transition-transform" />
              <div className="absolute w-12 h-16 rounded-lg bg-[#002d62]/20 border border-[#002d62]/30 transform rotate-12 -translate-x-2 translate-y-1 transition-transform" />
              <div className="relative w-14 h-18 rounded-lg bg-white shadow-lg border border-slate-200 flex flex-col justify-between p-1.5 animate-float-card">
                <div className="w-full h-2 rounded-sm bg-[#c8102e]" />
                <div className="space-y-1 px-1">
                  <div className="w-3/4 h-1 bg-slate-200 rounded" />
                  <div className="w-1/2 h-1 bg-slate-200 rounded" />
                </div>
                <div className="w-full h-1.5 rounded-sm bg-[#002d62]" />
              </div>
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        {progress.error ? (
          <>
            <h3 className="text-xl font-bold text-slate-900 mb-1 font-sans">
              Generation Error
            </h3>
            <p className="text-xs text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-100">
              {progress.error}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c8102e] text-white text-xs font-bold rounded-xl hover:bg-[#9e0c24] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Generation</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : progress.isComplete ? (
          <>
            <h3 className="text-2xl font-black text-slate-900 mb-1 font-sans">
              ID Cards Ready!
            </h3>
            <p className="text-xs text-slate-600 mb-6 font-medium">
              Your temporary student ID cards have been forged into a print-ready A4 document.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-2">
              <button
                onClick={onDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#c8102e] text-white text-xs font-bold rounded-xl hover:bg-[#9e0c24] shadow-md shadow-red-500/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onPrint}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#002d62] text-white text-xs font-bold rounded-xl hover:bg-[#001e40] shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 font-sans">
              Forging Your ID Cards
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Please wait while we prepare your print-ready ID cards...
            </p>

            {/* Current Step Status */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2 px-1">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Layers className="w-3.5 h-3.5 text-[#c8102e] animate-spin" />
                {progress.message}
              </span>
              <span className="font-mono text-[#002d62]">{progress.percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200 mb-4">
              <div
                className="h-full rounded-full shimmer-bar transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Compiling vector graphics, high-DPI logos, and 3&times;3 A4 crop marks
            </p>
          </>
        )}
      </div>
    </div>
  );
};
