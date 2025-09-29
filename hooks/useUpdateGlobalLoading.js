import { useEffect } from "react";
import { useGlobalAppLoadingContext } from "../context/GlobalAppLoadingContext";

const useUpdateGlobalLoading = (key, loadingState) => {
  const { setLoading: setGlobalLoading } = useGlobalAppLoadingContext();
  useEffect(() => {
    setGlobalLoading(key, loadingState);
    return () => setGlobalLoading(key, false);
  }, [loadingState]);
};

export default useUpdateGlobalLoading;
