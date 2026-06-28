"use client";

import { useEffect, useState } from "react";
import { normalizeLiveStatus } from "@/lib/live-status";
import type { LiveStatus } from "@/lib/types";

const POLL_INTERVAL_MS = 30_000;

export function useYouTubeLiveStatus() {
  const [status, setStatus] = useState<LiveStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch(`/live-status.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = normalizeLiveStatus((await response.json()) as LiveStatus);
        if (!cancelled) setStatus(data);
      } catch {
        // Ignore network errors; badge stays hidden until a successful poll.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}