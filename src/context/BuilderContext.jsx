import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'landing-page-data';

const defaultState = {
  bannerName: '',
  freeText: '',
  ownerName: '',
  ownerEmail: '',
  expandedText: null,
  imageUrl: null,
  useAI: false,
  useImage: false,
};

const BuilderContext = createContext(null);

export function BuilderProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (partial) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  return (
    <BuilderContext.Provider value={{ data, updateData }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider');
  return ctx;
}
