import { useCallback, useEffect, useState } from 'react';
import { ApiService } from '../services/api';

/** Fired by the admin dashboard after an event is created, edited or deleted. */
export const EVENTS_CHANGED = 'samajbandh:events-changed';

const POLL_MS = 60000;

/**
 * Number of events that currently accept registrations (the admin's "Open for registration" switch).
 * Refreshes every minute, when the tab regains focus, and instantly after an admin change.
 */
export function useLiveRegistrations(): { openCount: number; loading: boolean } {
  const [openCount, setOpenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setOpenCount(await ApiService.getLiveRegistrationCount());
    } catch {
      // Keep the last known value on a temporary network error.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    window.addEventListener('focus', refresh);
    window.addEventListener(EVENTS_CHANGED, refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener(EVENTS_CHANGED, refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  return { openCount, loading };
}
