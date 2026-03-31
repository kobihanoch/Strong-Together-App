export type GlobalAppLoadingContextSources = Record<string, boolean>;
export interface GlobalAppLoadingContextValue {
  isLoading: boolean;
  setLoading: (key: string, value: boolean) => void;
}
