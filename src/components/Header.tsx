import { ShieldCheck, HelpCircle, DownloadCloud } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHelp,
  canInstallPwa,
  onInstallPwa
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Official BCAS Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-auto flex items-center bg-white rounded-xl p-1">
            <img
              src="/bcas-logo.png"
              alt="BCAS Campus Official Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans leading-none">
                BCAS <span className="text-[#c8102e]">IDForge</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active v2.4
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 tracking-tight">
              Temporary Student ID Generator &bull; Campus Admin
            </p>
          </div>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {canInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-[#c8102e] border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors shadow-xs"
              title="Install BCAS IDForge as desktop/mobile application"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="A4 Printing Specifications & Paper Guide"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print Guide</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#002d62]" />
            <span>Client-Side Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
};
