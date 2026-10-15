import React, { useState } from 'react';
import type { IDCardConfig } from '../types';
import { IDCardPreview } from './IDCardPreview';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Scissors, Printer, Download, Layers } from 'lucide-react';

interface A4SheetPreviewProps {
  config: IDCardConfig;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const A4SheetPreview: React.FC<A4SheetPreviewProps> = ({
  config,
  onPrint,
  onDownload
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(0.85);

  const totalCards = Math.max(1, config.numberOfCards);
  const totalPages = Math.ceil(totalCards / 9);

  // Keep currentPage valid if totalCards changes
  const activePage = Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * 9;
  const pageCardIndices = Array.from({ length: 9 }, (_, i) => startIndex + i);

  const handlePrevPage = () => {
    if (activePage > 1) setCurrentPage(activePage - 1);
  };

  const handleNextPage = () => {
    if (activePage < totalPages) setCurrentPage(activePage + 1);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.45));
  const handleResetZoom = () => setZoomLevel(0.85);

  // A4 aspect ratio: 210mm x 297mm = 1 : 1.4142857
  // Base display width in px: 720px width, 1018px height
  const a4Width = 660;
  const a4Height = 933; // 660 * 297 / 210 = 933.4

  // Card size scaled to sheet:
  // Width 55mm / 210mm * 660 = 172.85px
  // Height 85mm / 297mm * 933.4 = 267px
  // Scale relative to IDCardPreview base (330px): 172.85 / 330 = 0.5238
  const cardScale = 0.5238;

  return (
    <div className="flex flex-col h-full bg-slate-100/80 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200">
        {/* Page Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={activePage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-md min-w-[90px] text-center">
            Page {activePage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={activePage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-slate-500 ml-2 hidden sm:inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Showing cards {startIndex + 1}–{Math.min(startIndex + 9, totalCards)} of {totalCards}
          </span>
        </div>

        {/* Zoom Controls & Crop Notice */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 px-2 min-w-[42px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {onDownload && (
            <button
              onClick={onDownload}
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#c8102e] text-white rounded-lg hover:bg-[#9e0c24] transition-colors ml-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          )}

          {onPrint && (
            <button
              onClick={onPrint}
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#002d62] text-white rounded-lg hover:bg-[#001e40] transition-colors ml-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4</span>
            </button>
          )}
        </div>
      </div>

      {/* A4 Sheet Container Area with Interactive Zoom */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-slate-200/60">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="relative bg-white shadow-2xl rounded-sm border border-slate-300"
        >
          {/* A4 Paper Canvas */}
          <div
            style={{
              width: `${a4Width}px`,
              height: `${a4Height}px`,
              padding: '44px 47px' // 14mm / 297mm * 933.4 = 44px top/bottom; 15mm / 210mm * 660 = 47px left/right
            }}
            className="relative flex flex-col justify-between"
          >
            {/* Top Sheet Margin Header */}
            <div className="absolute top-2 left-12 right-12 flex justify-between items-center text-[9px] text-slate-400 font-mono border-b border-dashed border-slate-200 pb-1">
              <span className="flex items-center gap-1">
                <Scissors className="w-3 h-3 text-slate-400" /> BCAS IDForge &bull; A4 Bulk Sheet Layout (3 &times; 3)
              </span>
              <span>Actual Size: 100% (55 &times; 85 mm per card)</span>
              <span>Page {activePage} / {totalPages}</span>
            </div>

            {/* 3x3 Card Grid */}
            <div 
              className="grid grid-cols-3 gap-x-[23.5px] gap-y-[22px] w-full h-full pt-3 pb-2"
              style={{
                // 7.5mm / 210mm * 660 = 23.57px gap-x
                // 7mm / 297mm * 933.4 = 22px gap-y
              }}
            >
              {pageCardIndices.map((idx, pos) => {
                const isCardActive = idx < totalCards;

                return (
                  <div key={pos} className="relative flex items-center justify-center">
                    {/* Cutting Guide Marks (Corner Crosshairs) */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-slate-300 pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-slate-300 pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-slate-300 pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-slate-300 pointer-events-none" />

                    {isCardActive ? (
                      <div className="relative">
                        <IDCardPreview
                          config={config}
                          cardIndex={idx}
                          scale={cardScale}
                          showShadow={false}
                        />
                        {/* Subtle Card Number Marker in Corner */}
                        <div className="absolute top-1 right-1 bg-black/60 text-white text-[7px] font-mono px-1 rounded-sm opacity-60">
                          #{idx + 1}
                        </div>
                      </div>
                    ) : (
                      /* Blank placeholder slot for unfilled positions on the final page */
                      <div
                        style={{
                          width: `${330 * cardScale}px`,
                          height: `${510 * cardScale}px`
                        }}
                        className="rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 select-none bg-slate-50/50"
                      >
                        <span className="text-[10px] font-mono uppercase tracking-wider">Unused Slot</span>
                        <span className="text-[8px] text-slate-300">Pos {pos + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Sheet Margin Footer */}
            <div className="absolute bottom-2 left-12 right-12 flex justify-between items-center text-[9px] text-slate-400 font-mono border-t border-dashed border-slate-200 pt-1">
              <span>BCAS Campus Official Printing System</span>
              <span className="text-[#c8102e] font-semibold">Cut along guides for 55 &times; 85 mm cards</span>
              <span>Intake: {config.intake}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet Summary Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">A4 Sheet Specs:</span>
          <span>210 &times; 297 mm</span>
          <span className="text-slate-300">&bull;</span>
          <span>9 cards per page</span>
          <span className="text-slate-300">&bull;</span>
          <span>Symmetrical 15mm / 14mm margins</span>
        </div>
        <div className="font-medium text-[#002d62]">
          Total {totalCards} {totalCards === 1 ? 'card' : 'cards'} across {totalPages} {totalPages === 1 ? 'page' : 'pages'}
        </div>
      </div>
    </div>
  );
};
