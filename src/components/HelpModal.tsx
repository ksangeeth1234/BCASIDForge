import React from 'react';
import { X, Printer, Scissors, CheckCircle, FileText, AlertTriangle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#c8102e]" />
            <h3 className="font-bold text-base text-slate-900 font-sans">
              Printing & Cutting Guidelines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-600">
          
          {/* Critical Printing Instruction */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 text-xs uppercase tracking-wide">
                Important: Print at Actual Size (100%)
              </p>
              <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                In your printer dialog, ensure <strong>Page Scaling</strong> is set to <strong>"Actual Size"</strong> or <strong>100%</strong>. Never select "Fit to Printable Area" or "Shrink Oversized Pages", which alters physical card dimensions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">A4 Paper Dimensions & Card Layout</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard A4 portrait (210 &times; 297 mm) holds exactly 9 cards in a 3 &times; 3 symmetrical grid with 15mm left/right margins and 14mm top/bottom margins.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Scissors className="w-4 h-4 text-[#002d62] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Cutting Guides & Trimming</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  Each card is bordered with fine corner crosshairs. Use a guillotine or paper trimmer along these lines to produce clean 55 &times; 85 mm cards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Recommended Cardstock Material</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  For optimal durability, print on 200–250 gsm white matte or silk cardstock, or insert into standard transparent PVC temporary pass badge holders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
