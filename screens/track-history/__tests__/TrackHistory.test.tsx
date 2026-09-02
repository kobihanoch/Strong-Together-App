import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/use-track-history.hook', () => ({ __esModule: true, default: jest.fn() }));

import TrackHistory from '../TrackHistory';

describe('TrackHistory screen', () => {
  it('exports the track history screen', () => {
    expect(TrackHistory).toBeDefined();
  });
});
