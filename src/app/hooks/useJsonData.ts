"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Generic client-side JSON fetch hook.
 *
 * - Supports development fallback to a local URL.
 * - Provides a stable return shape for reuse across pages.
 */
export function useJsonData<T>(opts: {
  /** Used when NODE_ENV === 'development' */
  devUrl: string;
  /** Used when NODE_ENV !== 'development' */
  prodUrl?: string;
  /** Optional override that always wins */
  overrideUrl?: string;
}) {
  const { devUrl, prodUrl, overrideUrl } = opts;

  const url = useMemo(() => {
    if (overrideUrl) return overrideUrl;
    const isDevelopment = process.env.NODE_ENV === "development";
    return isDevelopment ? devUrl : prodUrl;
  }, [devUrl, prodUrl, overrideUrl]);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        if (!url) {
          throw new Error(
            "No URL configured. Set a production URL or provide an overrideUrl.",
          );
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch JSON");

        const json = (await response.json()) as T;
        if (isMounted) setData(json);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
