export interface EmergencyAlertPayload {
  studentName: string;
  location: string;
  issue: string;
  lat: number | null;
  lng: number | null;
  timestamp: number;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  studentPhone?: string;
  accuracyMeters?: number | null;
  dispatchType?: 'SOS_HOLD' | 'MANUAL_DISPATCH';
}

export interface ContactItem {
  id: string;
  title: string;
  name?: string;
  phone: string;
  displayPhone: string;
  category: 'admin' | 'hostel' | 'security' | 'hod';
  timing?: string;
  badge?: string;
}

export type ContactCategory = 'admin' | 'hostel' | 'security' | 'hod';

export interface GPSLocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  status: 'idle' | 'locating' | 'locked' | 'denied' | 'error';
  errorMessage?: string;
  timestamp?: number;
}

export interface AlertDispatchResult {
  success: boolean;
  firebaseKey?: string;
  timestamp: number;
  payload: EmergencyAlertPayload;
  error?: string;
}
