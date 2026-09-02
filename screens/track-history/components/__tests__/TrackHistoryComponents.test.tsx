import { describe, expect, it } from '@jest/globals';
import ExerciseHistoryList from '../ExerciseHistoryList';
import ExerciseProgressChart from '../ExerciseProgressChart';
import HistoryWeekStrip from '../HistoryWeekStrip';
import TrackHistorySummary from '../TrackHistorySummary';

describe('Track history components', () => {
  it('exports the current screen components', () => {
    expect(ExerciseHistoryList).toBeDefined();
    expect(ExerciseProgressChart).toBeDefined();
    expect(HistoryWeekStrip).toBeDefined();
    expect(TrackHistorySummary).toBeDefined();
  });
});
