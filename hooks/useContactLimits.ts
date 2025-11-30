"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { DEFAULT_CONTACT_LIMIT } from "@/lib/constants";
interface ContactLimitResponse {
  count: number;
  limit: number;
  remaining: number;
  hasExceeded: boolean;
}

interface IncrementResponse {
  success: boolean;
  count: number;
  remaining: number;
  hasExceeded: boolean;
}

export function useContactLimits() {
  const { user, isLoaded } = useUser();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_CONTACT_LIMIT);
  const [remaining, setRemaining] = useState(DEFAULT_CONTACT_LIMIT);
  const [hasExceeded, setHasExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLimits = useCallback(async () => {
    if (!isLoaded || !user) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact-limits", {
        credentials: "include",
      });
      const data: ContactLimitResponse = await res.json();
      setCount(data.count);
      setLimit(data.limit);
      setRemaining(data.remaining);
      setHasExceeded(data.hasExceeded);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const incrementCount = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch("/api/contact-limits", {
        method: "POST",
        credentials: "include",
      });
      const data: IncrementResponse = await res.json();
      setCount(data.count);
      setRemaining(data.remaining);
      setHasExceeded(data.hasExceeded);
      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [user]);

  const resetDailyCount = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch("/api/contact-limits", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await fetchLimits();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [user, fetchLimits]);

  useEffect(() => {
    if (isLoaded && user) fetchLimits();
  }, [isLoaded, user, fetchLimits]);

  return {
    count,
    limit,
    remaining,
    hasExceeded,
    isLoading,
    incrementCount,
    resetDailyCount,
  };
}
