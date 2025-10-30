'use client';
import { useState, useEffect } from "react";
/**
 * This hook fix hydration when use persist to save hook data to localStorage
 */
export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  // Call the store hook at the top level - this is the proper way
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    // Only set data on the client side to prevent hydration mismatches
    setData(result);
  }, []);

  return data;
};
