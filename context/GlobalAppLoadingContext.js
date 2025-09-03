import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

const GlobalAppLoadingContext = createContext();

export const GlobalAppLoadingProvider = ({ children }) => {
  const [sources, setSources] = useState({});

  // Stable setter (identity does not change between renders)
  const setLoading = useCallback((key, value) => {
    const bool = !!value;
    setSources((prev) => {
      // No-op if the value did not change to avoid extra renders
      if (prev[key] === bool) return prev;
      return { ...prev, [key]: bool };
    });
  }, []);

  const isLoading = useMemo(
    () => Object.values(sources).some(Boolean),
    [sources]
  );

  // Stable value object except when isLoading changes
  const value = useMemo(
    () => ({ isLoading, setLoading }),
    [isLoading, setLoading]
  );

  return (
    <GlobalAppLoadingContext.Provider value={value}>
      {children}
    </GlobalAppLoadingContext.Provider>
  );
};

export const useGlobalAppLoadingContext = () => {
  const ctx = useContext(GlobalAppLoadingContext);
  if (!ctx)
    throw new Error(
      "useGlobalAppLoadingContext must be used within a GlobalAppLoadingProvider"
    );
  return ctx;
};
