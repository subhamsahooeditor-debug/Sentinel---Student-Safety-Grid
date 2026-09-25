import React from 'react';
import { AlertDispatchResult } from '../types.ts';
import { ScrewHead } from './ScrewHead.tsx';
import { History, X, CheckCircle2, AlertCircle, Clock, MapPin, Radio, Phone, User } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface DispatchHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AlertDispatchResult[];
}

export const DispatchHistoryDrawer: React.FC<DispatchHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Incident Transmission Logs"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg neu-card rounded-2xl p-5 border border-white/50 max-h-[85vh] flex flex-col overflow-hidden">
        {/* 4 Corner Screws */}
        <div className="absolute top-3 left-3">
          <ScrewHead rotation="default" />
        </div>
        <div className="absolute top-3 right-3">
          <ScrewHead rotation="alt" />
        </div>
        <div className="absolute bottom-3 left-3">
          <ScrewHead rotation="alt2" />
        </div>
        <div className="absolute bottom-3 right-3">
          <ScrewHead rotation="default" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d1d9e6] pb-3 mb-4 px-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#ff4757]" />
            <h3 className="font-mono text-xs font-bold tracking-wider text-[#2d3436] uppercase">
              DISPATCH TELEMETRY LOGS
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClickTick();
              onClose();
            }}
            className="p-1.5 rounded-lg neu-button text-[#4a5568] hover:text-[#2d3436] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Previous Dispatches */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1 scrollbar-none">
          {history.length === 0 ? (
            <div className="text-center py-10 neu-recessed rounded-xl text-xs font-mono text-[#4a5568]">
              No past emergency dispatches recorded on this client terminal.
            </div>
          ) : (
            history.map((item, idx) => {
              const dateStr = new Date(item.timestamp).toLocaleString('en-IN', {
                dateStyle: 'short',
                timeStyle: 'medium',
              });

              return (
                <div
                  key={`${item.timestamp}-${idx}`}
                  className="neu-card-flat rounded-xl p-3 border border-white/40 text-xs font-mono"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {item.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-[#ff4757]" />
                      )}
                      <span className="font-bold text-[#2d3436]">
                        {item.success ? 'TRANSMITTED (200 OK)' : 'OFFLINE LOG'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#4a5568] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#4a5568]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ff4757] shrink-0" />
                      <span className="text-[#2d3436] font-medium truncate">
                        {item.payload.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-[#10b981] shrink-0" />
                      <span className="truncate">
                        Issue: {item.payload.issue}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#2d3436]">
                      <User className="w-3 h-3 text-[#4a5568] shrink-0" />
                      <span className="truncate font-semibold">
                        {item.payload.studentName}
                        {item.payload.studentPhone ? (
                          <span className="text-[#10b981] ml-1 font-mono font-normal">
                            (📞 {item.payload.studentPhone})
                          </span>
                        ) : null}
                      </span>
                    </div>

                    {item.firebaseKey && (
                      <div className="text-[10px] text-[#8c96a8]">
                        Ref ID: {item.firebaseKey}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#d1d9e6] flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundManager.playClickTick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl neu-button text-xs font-mono font-bold text-[#2d3436] cursor-pointer"
          >
            CLOSE LOG
          </button>
        </div>
      </div>
    </div>
  );
};
