// src/hooks/usePersistentState.ts
"use client";
import { useEffect, useState } from "react";

export function usePersistentState<T>(key: string, initial: T) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, ready, state]);

  return [state, setState, ready] as const;
}
