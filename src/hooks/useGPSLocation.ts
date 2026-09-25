import { useState, useEffect, useCallback } from 'react';
import { GPSLocationState } from '../types.ts';

export function useGPSLocation() {
  const [gpsState, setGpsState] = useState<GPSLocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    status: 'idle',
  });

  const fetchCoordinates = useCallback((): Promise<{ lat: number | null; lng: number | null; accuracy: number | null }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setGpsState((prev) => ({
          ...prev,
          status: 'error',
          errorMessage: 'Geolocation is not supported by your browser',
        }));
        resolve({ lat: null, lng: null, accuracy: null });
        return;
      }

      setGpsState((prev) => ({ ...prev, status: 'locating' }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setGpsState({
            lat: latitude,
            lng: longitude,
            accuracy: Math.round(accuracy),
            status: 'locked',
            timestamp: Date.now(),
          });
          resolve({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });
        },
        (error) => {
          console.warn('Geolocation capture warning:', error.message);
          let errorStatus: GPSLocationState['status'] = 'error';
          if (error.code === error.PERMISSION_DENIED) {
            errorStatus = 'denied';
          }
          setGpsState((prev) => ({
            ...prev,
            status: errorStatus,
            errorMessage: error.message,
          }));
          resolve({ lat: null, lng: null, accuracy: null });
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 15000,
        }
      );
    });
  }, []);

  // Pre-warm GPS on mount if permission was already granted
  useEffect(() => {
    if (navigator.geolocation && 'permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            fetchCoordinates();
          }
        })
        .catch(() => {
          // Ignore permissions API fallback
        });
    }
  }, [fetchCoordinates]);

  return {
    gpsState,
    fetchCoordinates,
  };
}
