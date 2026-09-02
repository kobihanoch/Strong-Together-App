import { GetPersonalRecordsResponse } from '@strong-together/shared';

export type PrHistoryMap = GetPersonalRecordsResponse;
export type PrHistoryItem = PrHistoryMap['prs'][string];
