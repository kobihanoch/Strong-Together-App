export type GlobalAppLoadingProviderSources = Record<string, boolean>;
export interface GlobalAppLoadingProviderValue {
  isLoading: boolean;
  setLoading: (key: string, value: boolean) => void;
}
