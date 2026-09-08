import { PrHistoryMap } from '../types/pr-history.types';

export const checkHasAnyPr = (prHistoryMap: PrHistoryMap | undefined) => {
  if (!prHistoryMap) return false;
  return Boolean(Object.keys(prHistoryMap.prs).length);
};
