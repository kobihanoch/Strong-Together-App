import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { keyCardio } from "../cache/cacheUtils";
import { getUserCardio } from "../services/CardioService";
import useCacheAndFetch from "../hooks/useCacheAndFetch";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading";
import moment from "moment";

const CardioContext = createContext();

export const CardioProvider = ({ children }) => {
  const { user, isValidatedWithServer } = useAuth();

  const [dailyCardioMap, setDailyCardioMap] = useState(null);
  const [weeklyCardioMap, setWeeklyCardioMap] = useState(null);
  const cardioForToday = useMemo(
    () => dailyCardioMap?.[moment().format("YYYY-MM-DD")]?.[0] || null
  );
  const hasDoneCardioToday = useMemo(() => !!cardioForToday, [dailyCardioMap]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserCardio(), []);

  // On data function
  const onDataFn = useCallback((data) => {
    setDailyCardioMap(data.daily);
    setWeeklyCardioMap(data.weekly);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({
      daily: dailyCardioMap,
      weekly: weeklyCardioMap,
    }),
    [dailyCardioMap, weeklyCardioMap]
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch(
    user, // user prop
    keyCardio, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    "Cardio Context" // log
  );

  // Report analysis loading to global loading
  useUpdateGlobalLoading("Cardio", cacheKnown ? loading : true);

  return (
    <CardioContext.Provider
      value={{
        dailyCardioMap,
        weeklyCardioMap,
        setDailyCardioMap,
        setWeeklyCardioMap,
        hasDoneCardioToday,
        cardioForToday,
      }}
    >
      {children}
    </CardioContext.Provider>
  );
};

export const useCardioContext = () => {
  const context = useContext(CardioContext);
  if (!context) {
    throw new Error("useCardioContext must be used within a CardioProvider");
  }
  return context;
};
