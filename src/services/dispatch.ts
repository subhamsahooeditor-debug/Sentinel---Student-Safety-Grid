import { EmergencyAlertPayload, AlertDispatchResult } from '../types.ts';
import { soundManager } from '../utils/audio.ts';

const FIREBASE_ENDPOINT = 'https://sentinel-gcek-default-rtdb.firebaseio.com/alerts.json';
const LOCAL_STORAGE_HISTORY_KEY = 'sentinel_gcek_dispatched_alerts_v1';

export async function transmitEmergencyAlert(
  payload: EmergencyAlertPayload
): Promise<AlertDispatchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(FIREBASE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Firebase RTDB responded with HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const firebaseKey = data && data.name ? data.name : `REF-${Date.now().toString().slice(-6)}`;

    // Play authoritative success chime
    soundManager.playSuccessChime();

    const result: AlertDispatchResult = {
      success: true,
      firebaseKey,
      timestamp: payload.timestamp,
      payload,
    };

    saveAlertToLocalHistory(result);
    return result;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : 'Network failure transmitting alert';
    console.warn('Alert transmission notice:', errorMessage);

    // If network fails (e.g. offline student network or Firebase CORS), still save to local history with offline tag
    const fallbackResult: AlertDispatchResult = {
      success: false,
      error: errorMessage,
      timestamp: payload.timestamp,
      payload,
    };

    saveAlertToLocalHistory(fallbackResult);
    return fallbackResult;
  }
}

export function getLocalAlertHistory(): AlertDispatchResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAlertToLocalHistory(entry: AlertDispatchResult): void {
  try {
    const history = getLocalAlertHistory();
    const updated = [entry, ...history.slice(0, 19)];
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quote errors
  }
}
