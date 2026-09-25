import { useState, useEffect, useCallback } from 'react';
import { HeaderChassis } from './components/HeaderChassis.tsx';
import { PWAInstallButton } from './components/PWAInstallButton.tsx';
import { CentralSosControl } from './components/CentralSosControl.tsx';
import { ManualIncidentCard } from './components/ManualIncidentCard.tsx';
import { HelplineDirectory } from './components/HelplineDirectory.tsx';
import { DispatchConfirmationToast } from './components/DispatchConfirmationToast.tsx';
import { DispatchHistoryDrawer } from './components/DispatchHistoryDrawer.tsx';
import { useGPSLocation } from './hooks/useGPSLocation.ts';
import { transmitEmergencyAlert, getLocalAlertHistory } from './services/dispatch.ts';
import { EmergencyAlertPayload, AlertDispatchResult } from './types.ts';
import { History, Shield, Zap } from 'lucide-react';
import { soundManager } from './utils/audio.ts';

const STUDENT_NAME_STORAGE_KEY = 'sentinel_gcek_student_name';
const STUDENT_PHONE_STORAGE_KEY = 'sentinel_gcek_student_phone';

export default function App() {
  const { gpsState, fetchCoordinates } = useGPSLocation();
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem(STUDENT_NAME_STORAGE_KEY) || 'GCEK Student';
    } catch {
      return 'GCEK Student';
    }
  });

  const [studentPhone, setStudentPhone] = useState<string>(() => {
    try {
      return localStorage.getItem(STUDENT_PHONE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [latestDispatchResult, setLatestDispatchResult] = useState<AlertDispatchResult | null>(null);
  const [alertHistory, setAlertHistory] = useState<AlertDispatchResult[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);

  // Load alert history on mount
  useEffect(() => {
    setAlertHistory(getLocalAlertHistory());
  }, []);

  const handleUpdateStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem(STUDENT_NAME_STORAGE_KEY, name);
    } catch {
      // ignore
    }
  };

  const handleUpdateStudentPhone = (phone: string) => {
    setStudentPhone(phone);
    try {
      localStorage.setItem(STUDENT_PHONE_STORAGE_KEY, phone);
    } catch {
      // ignore
    }
  };

  const handleDispatchAlert = useCallback(async (payload: EmergencyAlertPayload) => {
    setIsDispatching(true);
    try {
      const result = await transmitEmergencyAlert(payload);
      setLatestDispatchResult(result);
      setAlertHistory((prev) => [result, ...prev.slice(0, 19)]);
    } finally {
      setIsDispatching(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#e0e5ec] chassis-texture text-[#2d3436] p-3 sm:p-5 md:p-8 flex flex-col justify-between">
      <div className="w-full max-w-md md:max-w-xl mx-auto">
        {/* Hardware Header Chassis */}
        <HeaderChassis
          gpsState={gpsState}
          studentName={studentName}
          studentPhone={studentPhone}
          onUpdateStudentName={handleUpdateStudentName}
          onUpdateStudentPhone={handleUpdateStudentPhone}
          onTriggerGPSManualRefresh={fetchCoordinates}
        />

        {/* Mobile PWA Install Card */}
        <PWAInstallButton variant="banner" />

        {/* Primary Central Hold SOS Control Station */}
        <CentralSosControl
          gpsState={gpsState}
          studentName={studentName}
          studentPhone={studentPhone}
          fetchCoordinates={fetchCoordinates}
          onDispatchAlert={handleDispatchAlert}
          isDispatching={isDispatching}
        />

        {/* Secondary Non-Siren Manual Incident Dispatch Card */}
        <ManualIncidentCard
          gpsState={gpsState}
          studentName={studentName}
          studentPhone={studentPhone}
          onUpdateStudentPhone={handleUpdateStudentPhone}
          fetchCoordinates={fetchCoordinates}
          onDispatchAlert={handleDispatchAlert}
          isDispatching={isDispatching}
        />

        {/* Itemized Comprehensive Emergency Helpline Directory */}
        <HelplineDirectory />

        {/* Hardware Chassis Bottom Plate */}
        <footer
          id="chassis-bottom-plate"
          className="neu-card rounded-2xl p-4 border border-white/50 text-center font-mono text-xs text-[#4a5568] space-y-2"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <span className="flex items-center gap-1 font-bold text-[#2d3436]">
              <Shield className="w-3.5 h-3.5 text-[#ff4757]" />
              GCEK SENTINEL v2.4
            </span>

            <span className="flex items-center gap-1 text-[#10b981]">
              <Zap className="w-3 h-3" />
              ZERO-MAP FAST-LOAD ARCHITECTURE
            </span>

            <button
              type="button"
              onClick={() => {
                soundManager.playClickTick();
                setIsHistoryDrawerOpen(true);
              }}
              className="px-2.5 py-1 rounded-md neu-button text-[#2d3436] hover:text-[#ff4757] font-semibold cursor-pointer flex items-center gap-1"
            >
              <History className="w-3 h-3" />
              LOGS ({alertHistory.length})
            </button>
          </div>

          <p className="text-[10px] text-[#8c96a8] border-t border-[#d1d9e6] pt-2">
            Government College of Engineering Kalahandi, Bandopala, Bhawanipatna, Odisha 766002
          </p>
        </footer>
      </div>

      {/* Prominent Confirmation Toast upon Alert Broadcast */}
      <DispatchConfirmationToast
        latestResult={latestDispatchResult}
        onDismiss={() => setLatestDispatchResult(null)}
      />

      {/* History Telemetry Drawer */}
      <DispatchHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={alertHistory}
      />
    </main>
  );
}
