export type AddUserAerobicsBody = {
  tz: string;
  record: {
    durationMins: number;
    durationSec: number;
    type: string;
  };
};
export type GetUserAerobicsQuery = {
  tz?: string | undefined;
};
