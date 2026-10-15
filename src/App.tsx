import React, { useState, useEffect } from 'react';
import type { IDCardConfig, GenerationProgress } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { IDCardForm } from './components/IDCardForm';
import { IDCardPreview } from './components/IDCardPreview';
import { A4SheetPreview } from './components/A4SheetPreview';
import { ForgeModal } from './components/ForgeModal';
import { HelpModal } from './components/HelpModal';
import { generateBulkIDPDF } from './utils/pdfGenerator';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  Grid3X3, 
  Sparkles, 
  Printer
} from 'lucide-react';

const DEFAULT_CONFIG: IDCardConfig = {
  programmeName: 'BSc (Hons) Computer Science',
  intake: 'October Intake',
  customIntake: '',
  academicYear: '2026/2027',
  partnerLogoUrl: '',
  partnerLogoData: null,
  partnerLogoName: '',
  numberOfCards: 9, // Exactly 1 full A4 sheet
  idPrefix: 'BCAS-TMP-',
  startNumber: 1001,
  showBarcode: true,
  issueDate: new Date().toISOString().split('T')[0],
  validUntil: 'Semester End'
};

export const App: React.FC = () => {
  // Screens & Navigation
  const [showWelcome, setShowWelcome] = useState(true);
  const [activePreviewTab, setActivePreviewTab] = useState<'single' | 'sheet'>('single');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // ID Card Configuration
  const [config, setConfig] = useState<IDCardConfig>(DEFAULT_CONFIG);

  // Generation Progress & State
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    isGenerating: false,
    step: 0,
    message: '',
    percentage: 0,
    error: null,
    isComplete: false
  });

  // Cached generated PDF object for instant re-download or print
  const [lastGeneratedPdfBlob, setLastGeneratedPdfBlob] = useState<Blob | null>(null);

  // PWA Install Event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleConfigChange = (updated: Partial<IDCardConfig>) => {
    setConfig(prev => ({ ...prev, ...updated }));
    // Invalidate cached PDF on config change
    setLastGeneratedPdfBlob(null);
  };

  const handleResetForm = () => {
    if (window.confirm('Reset ID card configuration to default values?')) {
      setConfig(DEFAULT_CONFIG);
      setLastGeneratedPdfBlob(null);
    }
  };

  // Generation Logic with Real Stages
  const handleGenerate = async () => {
    if (!config.programmeName.trim()) {
      alert('Please specify an Academic Programme Name before generating.');
      return;
    }

    if (config.numberOfCards < 1) {
      alert('Please specify at least 1 ID card to generate.');
      return;
    }

    setGenerationProgress({
      isGenerating: true,
      step: 1,
      message: 'Preparing ID card design...',
      percentage: 15,
      error: null,
      isComplete: false
    });

    try {
      // Step delays for smooth visual feedback of real tasks
      await new Promise(r => setTimeout(r, 300));

      const doc = await generateBulkIDPDF(config, (p) => {
        setGenerationProgress(prev => ({
          ...prev,
          step: p.step,
          percentage: p.percentage,
          message: p.message
        }));
      });

      // Finalising stage
      setGenerationProgress(prev => ({
        ...prev,
        step: 5,
        percentage: 100,
        message: 'Finalising your document...'
      }));

      const blob = doc.output('blob');
      setLastGeneratedPdfBlob(blob);

      await new Promise(r => setTimeout(r, 400));

      setGenerationProgress({
        isGenerating: false,
        step: 5,
        message: 'Your ID cards are ready to print.',
        percentage: 100,
        error: null,
        isComplete: true
      });

      // Switch to A4 sheet view to show generated layout!
      setActivePreviewTab('sheet');

      // Subtle celebratory confetti
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#c8102e', '#002d62', '#ffffff']
      });

    } catch (err: any) {
      console.error('PDF Generation failed:', err);
      setGenerationProgress({
        isGenerating: false,
        step: 0,
        message: '',
        percentage: 0,
        error: err?.message || 'Failed to generate PDF document. Please check image URLs or file sizes.',
        isComplete: false
      });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      let docBlob = lastGeneratedPdfBlob;
      if (!docBlob) {
        const doc = await generateBulkIDPDF(config);
        docBlob = doc.output('blob');
        setLastGeneratedPdfBlob(docBlob);
      }

      const fileName = `BCAS_Temporary_IDs_${config.intake.replace(/\s+/g, '_')}_${config.academicYear.replace('/', '-')}.pdf`;
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Error downloading PDF: ' + err.message);
    }
  };

  const handlePrintPdf = async () => {
    try {
      let docBlob = lastGeneratedPdfBlob;
      if (!docBlob) {
        const doc = await generateBulkIDPDF(config);
        docBlob = doc.output('blob');
        setLastGeneratedPdfBlob(docBlob);
      }

      const blobUrl = URL.createObjectURL(docBlob);
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = blobUrl;

      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 60000);
      };
    } catch (err: any) {
      alert('Error triggering print: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* 1. Welcome & Security Checking Screen */}
      {showWelcome && (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      )}

      {/* 2. Main Institutional Header */}
      <Header
        onOpenHelp={() => setShowHelpModal(true)}
        canInstallPwa={!!deferredPrompt}
        onInstallPwa={handleInstallPwa}
      />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Welcome Banner & Quick Guide */}
        <div className="bg-gradient-to-r from-[#002d62] via-[#083870] to-[#c8102e] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-semibold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Administrative System</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
              Temporary Student ID Generator & Bulk Printing
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-normal">
              Configure student passes for new cohorts, preview in individual 55&times;85mm card ratio, and forge into print-ready A4 3&times;3 sheets with precision corner cutting guides.
            </p>
          </div>
        </div>

        {/* Two-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: ID Configuration Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c8102e]" />
                ID Card Configuration
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                A4 Bulk Engine
              </span>
            </div>

            <IDCardForm
              config={config}
              onChange={handleConfigChange}
              onReset={handleResetForm}
              onGenerate={handleGenerate}
              onDownload={handleDownloadPdf}
              onPrint={handlePrintPdf}
              isGenerating={generationProgress.isGenerating}
            />
          </div>

          {/* RIGHT COLUMN: Interactive Previews */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Preview Navigation Tabs */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('single')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === 'single'
                      ? 'bg-[#002d62] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Single ID Preview (55 &times; 85 mm)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('sheet')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === 'sheet'
                      ? 'bg-[#002d62] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>A4 Bulk Sheet (3 &times; 3 Grid)</span>
                </button>
              </div>

              {/* Direct print button on tab row */}
              <button
                onClick={handlePrintPdf}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Print current cards"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print</span>
              </button>
            </div>

            {/* Preview Display Panels */}
            {activePreviewTab === 'single' ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col items-center justify-center min-h-[580px]">
                <div className="text-center mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Live Design Reference
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 font-sans">
                    Temporary Student Pass &bull; Standard Ratio
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calculated for standard 55 mm &times; 85 mm physical dimensions.
                  </p>
                </div>

                {/* Individual ID Card Preview */}
                <div className="py-2">
                  <IDCardPreview config={config} scale={1.05} />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4 w-full max-w-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Dynamic Auto-wrap
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    CR80 Equivalent Ratio
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    BCAS Official Header
                  </span>
                </div>
              </div>
            ) : (
              <div className="min-h-[580px]">
                <A4SheetPreview
                  config={config}
                  onPrint={handlePrintPdf}
                  onDownload={handleDownloadPdf}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/bcas-logo.png" alt="BCAS" className="h-6 w-auto" />
            <span className="font-semibold text-slate-700">BCAS IDForge</span>
            <span>&bull; British College of Applied Studies</span>
          </div>
          <div>
            Built for administrative cohort passes &bull; Print at 100% Actual Size
          </div>
        </div>
      </footer>

      {/* 5. Generation Progress Modal */}
      <ForgeModal
        progress={generationProgress}
        onRetry={handleGenerate}
        onClose={() => setGenerationProgress(prev => ({ ...prev, isComplete: false, error: null }))}
        onDownload={handleDownloadPdf}
        onPrint={handlePrintPdf}
      />

      {/* 6. Help / Print Guide Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default App;
