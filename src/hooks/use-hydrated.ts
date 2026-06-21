"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during SSR and the initial client render, then true once
 * the client has hydrated. Implemented with useSyncExternalStore to avoid
 * setState-in-effect and hydration mismatches.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
