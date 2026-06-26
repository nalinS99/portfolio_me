"use client";
import { useEffect, useState, useCallback } from "react";

/**
 * Like useState but persists the value in localStorage.
 * On first load it reads from localStorage; falls back to `defaultValue`.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or private mode — silently ignore
    }
  }, [key, value]);

  return [value, setValue];
}

export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/**
 * useApiStore — replaces useLocalStorage for admin pages.
 * Loads data from /api/data/<section> and saves back via POST.
 * Falls back to defaultValue while loading.
 */
export function useApiStore<T>(
  section: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    fetch(`/api/data/${section}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setData(defaultValue); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const save = useCallback(async (value: T) => {
    setData(value);
    await fetch(`/api/data/${section}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
  }, [section]);

  return [data, save, loading];
}
