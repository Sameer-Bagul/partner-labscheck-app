'use client';

import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import { ReactNode, useEffect } from "react";

const libraries: Libraries = ["places", "geometry", "drawing", "visualization"];

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  useEffect(() => {
    // Suppress the Google Places Autocomplete deprecation warning
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('google.maps.places.Autocomplete is not available to new customers')) {
        return; // Suppress this specific warning
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn; // Restore original console.warn on cleanup
    };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
    region: "IN",
    language: "en",
  });

  if (loadError) {
    return <div>Failed to load Google Maps API</div>;
  }

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
