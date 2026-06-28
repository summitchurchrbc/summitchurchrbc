"use client";

import { useEffect, useState } from "react";
import type { Sermon } from "@/lib/types";

export function useSermons(fallback: Sermon[]) {
  const [sermons, setSermons] = useState(fallback);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/services.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { sermons?: Sermon[] };
        if (!cancelled && data.sermons?.length) {
          setSermons(data.sermons);
        }
      } catch {
        // Keep build-time fallback when the dynamic file is unavailable.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fallback]);

  return sermons;
}