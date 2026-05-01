import { useEffect, useState } from 'react';
import { getContact } from '../services/api';

const initialState = (id) => ({
  id,
  contact: null,
  loading: Boolean(id),
  error: null,
});

export function useContact(id) {
  const [state, setState] = useState(() => initialState(id));

  // Reset when id changes — allowed setState-during-render pattern.
  if (!state || state.id !== id) {
    setState(initialState(id));
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getContact(id)
      .then((result) => {
        if (cancelled) return;
        setState((prev) => (prev.id === id ? { ...prev, contact: result, loading: false } : prev));
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err?.name === 'ApiConfigError'
            ? 'שגיאת תצורה פנימית. פנה למנהל המערכת.'
            : err.message || 'שגיאה בטעינת הנתונים';
        setState((prev) => (prev.id === id ? { ...prev, error: message, loading: false } : prev));
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { contact: state.contact, loading: state.loading, error: state.error };
}
