"use client";
import { useEffect, useRef, useState, useMemo } from "react";

export interface GeoLocationSensorState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error?: Error | GeolocationPositionError; // Use GeolocationPositionError directly
}

export const useGeolocation = (options?: PositionOptions): GeoLocationSensorState => {
  const [state, setState] = useState<GeoLocationSensorState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: Date.now(),
  });

  // Persist variables across renders
  const mountedRef = useRef(true);
  const watchIdRef = useRef<number | null>(null);
  
  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [
    options?.enableHighAccuracy,
    options?.timeout,
    options?.maximumAge
  ]);

  const onEvent = (event: GeolocationPosition) => {
    if (mountedRef.current) {
      setState({
        loading: false,
        accuracy: event.coords.accuracy,
        altitude: event.coords.altitude,
        altitudeAccuracy: event.coords.altitudeAccuracy,
        heading: event.coords.heading,
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
        speed: event.coords.speed,
        timestamp: event.timestamp,
      });
    }
  };

  const onEventError = (error: GeolocationPositionError) => {
    if (mountedRef.current) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error,
      }));
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onEvent, onEventError, memoizedOptions);
    watchIdRef.current = navigator.geolocation.watchPosition(onEvent, onEventError, memoizedOptions);

    return () => {
      mountedRef.current = false;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [memoizedOptions]);

  return state;
};