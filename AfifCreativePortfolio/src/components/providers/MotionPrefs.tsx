"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

type Prefs = { motion: "full" | "reduced"; cursor: boolean };

type Ctx = {
  prefs: Prefs;
  /** True when the OS asks for reduced motion OR the visitor chose it in Settings. */
  reduced: boolean;
  setPrefs: (p: Partial<Prefs>) => void;
};

const defaults: Prefs = { motion: "full", cursor: true };
const KEY = "afif-prefs";
const EVENT = "afif-prefs-change";

// Tiny localStorage-backed store (per-viewer convenience only).
function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function parse(raw: string | null): Prefs {
  if (!raw) return defaults;
  try {
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

const MotionPrefsContext = createContext<Ctx>({ prefs: defaults, reduced: false, setPrefs: () => {} });

export function MotionPrefsProvider({ children }: { children: React.ReactNode }) {
  const system = useReducedMotion();
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const prefs = useMemo(() => parse(raw), [raw]);

  const setPrefs = useCallback((p: Partial<Prefs>) => {
    const next = { ...parse(read()), ...p };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const reduced = Boolean(system) || prefs.motion === "reduced";

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  const value = useMemo(() => ({ prefs, reduced, setPrefs }), [prefs, reduced, setPrefs]);

  return (
    <MotionPrefsContext.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </MotionPrefsContext.Provider>
  );
}

export const useMotionPrefs = () => useContext(MotionPrefsContext);
