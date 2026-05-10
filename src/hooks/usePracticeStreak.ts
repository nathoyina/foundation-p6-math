"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

function readStreak(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/** Same-tab updates (storage event only fires across tabs). */
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

function subscribe(key: string, onChange: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(onChange);
  return () => {
    listeners.get(key)?.delete(onChange);
  };
}

export function usePracticeStreak(storageKey: string) {
  const getSnapshot = useMemo(
    () => () => readStreak(storageKey),
    [storageKey],
  );

  const streak = useSyncExternalStore(
    useMemo(
      () => (onChange) => subscribe(storageKey, onChange),
      [storageKey],
    ),
    getSnapshot,
    () => 0,
  );

  const bump = useCallback(
    (ok: boolean) => {
      const next = ok ? readStreak(storageKey) + 1 : 0;
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {
        /* ignore */
      }
      emit(storageKey);
    },
    [storageKey],
  );

  return { streak, bump };
}
