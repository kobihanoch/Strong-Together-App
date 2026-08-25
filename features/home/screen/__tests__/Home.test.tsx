/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';

const mockNavigate = jestObject.fn();

const createUser = (overrides = {}) => ({
  id: 'user-1',
  username: 'johnny',
  name: 'John Doe',
  profilePicPath: 'profiles/john.png',
  gender: 'Male',
  ...overrides,
});

const createPR = (overrides = {}) => ({
  maxExercise: 'Bench Press',
  maxWeight: 100,
  maxReps: 8,
  maxDate: '2026-03-20',
  ...overrides,
});

const createMostFrequentSplit = (overrides = {}) => ({
  splitName: 'Push',
  times: 4,
  ...overrides,
});

const createHomeData = (overrides = {}) => ({
  username: 'johnny',
  userId: 'user-1',
  hasAssignedWorkout: true,
  hasTracking: true,
  profilePicPath: 'profiles/john.png',
  firstName: 'John',
  lastWorkoutDate: '2026-03-20',
  totalWorkoutNumber: 8,
  workoutSplitsNumber: 2,
  mostFrequentSplit: createMostFrequentSplit(),
  PR: createPR(),
  isLoading: false,
  ...overrides,
});

let mockAuthState: any;
let mockLoadingState: any;
let mockNotificationsState: any;
let mockWorkoutState: any;
let mockAnalysisState: any;
let mockHomeLogicData: any;
const mockHomeActions = {
  openInbox: jestObject.fn(),
  createWorkout: jestObject.fn(),
  startWorkout: jestObject.fn(),
  openProgress: jestObject.fn(),
  openHistory: jestObject.fn(),
};

jestObject.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => mockReact.createElement(Text, null, name);
});

jestObject.mock('expo-image', () => {
  const { Image } = require('react-native');
  return { Image };
});

jestObject.mock('expo-linear-gradient', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => mockReact.createElement(View, null, children),
  };
});

jestObject.mock('moti/skeleton', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  const Skeleton = ({ children }: any) => children;
  Skeleton.Group = ({ children }: any) => mockReact.createElement(View, null, children);
  return { Skeleton };
});

jestObject.mock('react-native-gesture-handler', () => {
  const mockReact = require('react');
  const { ScrollView, View } = require('react-native');
  return {
    ScrollView,
    GestureDetector: ({ children }: any) => mockReact.createElement(View, null, children),
    Gesture: {
      Pan: () => {
        const chain = {
          onStart: () => chain,
          onUpdate: () => chain,
          onEnd: () => chain,
        };
        return chain;
      },
    },
  };
});

jestObject.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
    },
    useSharedValue: (value: number) => ({ value }),
    useAnimatedStyle: (cb: () => object) => cb(),
    withSpring: (value: number) => value,
    runOnJS: (fn: (...args: any[]) => any) => fn,
  };
});

jestObject.mock('../../../auth/shared/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));

jestObject.mock('../../../../shared/providers/GlobalAppLoadingProvider', () => ({
  useGlobalAppLoadingContext: () => mockLoadingState,
}));

jestObject.mock('../../../messages/providers/MessagesProvider', () => ({
  useMessages: () => mockNotificationsState,
}));

jestObject.mock('../../../workouts/shared/providers/WorkoutPlanProvider', () => ({
  useWorkoutPlanContext: () => mockWorkoutState,
}));

jestObject.mock('../../../workouts/shared/providers/WorkoutHistoryProvider', () => ({
  useWorkoutHistoryContext: () => mockAnalysisState,
}));

jestObject.mock('../../hooks/use-home-page-logic.hook', () => ({
  __esModule: true,
  default: () => ({
    data: mockHomeLogicData,
    actions: mockHomeActions,
  }),
}));

jestObject.mock('../../../../shared/components/Badge', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ label }: { label: string }) => mockReact.createElement(Text, null, label);
});

jestObject.mock('../../../../shared/components/NumberCounter', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ numEnd }: { numEnd: number }) => mockReact.createElement(Text, null, numEnd);
});

jestObject.mock('../../../../shared/components/PercentageCircle', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return ({ children }: any) => mockReact.createElement(View, null, children);
});

jestObject.mock('../../../../shared/components/Row', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return ({ children }: any) => mockReact.createElement(View, null, children);
});

import Home from '../Home';
import PRCard from '../../components/PRCard';
import QuickActions from '../../components/QuickActions';
import SlideToStart from '../../components/SlideToStart';
import StartWorkoutCard from '../../../workouts/plan/components/StartWorkoutCard';
import TopComponent from '../../components/TopComponent';

const resetMockState = () => {
  mockAuthState = {
    user: createUser(),
    isWorkoutMode: false,
  };

  mockLoadingState = {
    isLoading: false,
  };

  mockNotificationsState = {
    unreadMessages: [],
  };

  mockWorkoutState = {
    workout: { id: 'workout-1' },
    workoutSplits: [
      { id: 1, name: 'Push', muscleGroup: 'Chest, Shoulders, Triceps' },
      { id: 2, name: 'Legs', muscleGroup: 'Legs' },
    ],
    workoutForEdit: {
      Push: [{ id: 'ex-1' }, { id: 'ex-2' }, { id: 'ex-3' }],
    },
  };

  mockAnalysisState = {
    analyzedExerciseTrackingData: {
      pr: createPR(),
      workoutCount: 8,
      mostFrequentSplit: createMostFrequentSplit(),
      lastWorkoutDate: '2026-03-20',
    },
    hasTrainedToday: false,
  };

  mockHomeLogicData = {
    theme: {
      canvas: '#FAF8F5', surface: '#FFFFFF', surfaceMuted: '#F2EEE8', border: '#E7E0D8',
      textPrimary: '#17130F', textSecondary: '#756B61', primary: '#2979FF', primarySoft: '#EAF2FF',
      achievement: '#FF7A00', achievementSoft: '#FFF1E6', heroSurface: '#17130F', heroOverlay: 'rgba(9,9,9,0.7)', white: '#FFFFFF',
    },
    state: { hasWorkout: true, hasTracking: true },
    user: { displayName: 'John', profilePicPath: null, gender: 'Male', unreadCount: 0 },
    nextWorkout: { name: 'Push Day', exerciseCount: 6, setCount: 18 },
    gymActivity: { completedThisWeek: 3, weeklyTarget: 4, weekStreak: 6 },
    lastWorkout: { name: 'Pull Day', dateLabel: 'May 18', exerciseCount: 6, setCount: 17 },
    aerobics: {
      totalMinutes: 82,
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => ({ label, minutes: index + 5 })),
    },
    achievement: { exercise: 'Bench Press', value: '+5 kg PR', estimatedOneRepMaxKg: 117.5 },
  };
};

jestDescribe('Home page components', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    resetMockState();
  });

  jestDescribe('Home screen', () => {
    jestIt('renders the mocked dashboard sections', () => {
      const { getByText } = render(React.createElement(Home));

      jestExpect(getByText('Welcome, John')).toBeTruthy();
      jestExpect(getByText("TODAY'S WORKOUT")).toBeTruthy();
      jestExpect(getByText('THIS WEEK')).toBeTruthy();
      jestExpect(getByText('AEROBICS THIS WEEK')).toBeTruthy();
      jestExpect(getByText('LATEST PROGRESS')).toBeTruthy();
      jestExpect(getByText(/Est\. 1RM/)).toBeTruthy();
      jestExpect(getByText('LAST WORKOUT')).toBeTruthy();
    });

    jestIt('scales aerobics bars from the supplied daily minutes', () => {
      const { getByTestId } = render(React.createElement(Home));
      const firstBarHeight = getByTestId('aerobics-bar-0').props.style[1].height;
      const lastBarHeight = getByTestId('aerobics-bar-6').props.style[1].height;

      jestExpect(lastBarHeight).toBeGreaterThan(firstBarHeight);
    });

    jestIt('renders safely while user-related data is still loading and contexts are null', () => {
      mockAuthState = {
        ...mockAuthState,
        user: null,
      };
      mockLoadingState = {
        isLoading: true,
      };
      mockWorkoutState = {
        workout: null,
        workoutSplits: [],
        workoutForEdit: null,
      };
      mockAnalysisState = {
        analyzedExerciseTrackingData: null,
        hasTrainedToday: false,
      };
      mockHomeLogicData = { ...mockHomeLogicData, user: { displayName: 'Athlete', profilePicPath: null, gender: null, unreadCount: 0 } };

      const { getByText } = render(React.createElement(Home));

      jestExpect(getByText('Welcome, Athlete')).toBeTruthy();
      jestExpect(getByText('Upper Body')).toBeTruthy();
      jestExpect(getByText(' hrs')).toBeTruthy();
      jestExpect(getByText(' mins')).toBeTruthy();
    });

    jestIt('routes the mocked workout CTA to Plan when no real split is available', () => {
      const { getByText } = render(React.createElement(Home));
      fireEvent.press(getByText('Start workout'));

      jestExpect(mockHomeActions.startWorkout).toHaveBeenCalledTimes(1);
    });

    jestIt('shows a create-workout CTA when no workout is assigned', () => {
      mockHomeLogicData = { ...mockHomeLogicData, state: { hasWorkout: false, hasTracking: false } };
      const { getByText, queryByText } = render(React.createElement(Home));

      jestExpect(getByText('Create your first workout')).toBeTruthy();
      fireEvent.press(getByText('Create workout'));
      jestExpect(mockHomeActions.createWorkout).toHaveBeenCalledTimes(1);
      jestExpect(queryByText('LATEST ACHIEVEMENT')).toBeNull();
    });

    jestIt('shows first-workout guidance when a plan has no tracking yet', () => {
      mockHomeLogicData = { ...mockHomeLogicData, state: { hasWorkout: true, hasTracking: false } };
      const { getByText, queryByText } = render(React.createElement(Home));

      jestExpect(getByText('YOUR FIRST WORKOUT')).toBeTruthy();
      jestExpect(getByText('Start first workout')).toBeTruthy();
      jestExpect(getByText('Your progress starts here')).toBeTruthy();
      jestExpect(queryByText('LAST WORKOUT')).toBeNull();
    });
  });

  jestDescribe('TopComponent', () => {
    jestIt('shows the full English name when it is available', () => {
      const { getByText } = render(React.createElement(TopComponent));

      jestExpect(getByText('John Doe')).toBeTruthy();
    });

    jestIt('falls back to username when the full name is not English', () => {
      mockAuthState = {
        ...mockAuthState,
        user: createUser({ name: '×™×•×¡×™ ×›×”×Ÿ', username: 'yossi' }),
      };

      const { getByText } = render(React.createElement(TopComponent));

      jestExpect(getByText('yossi')).toBeTruthy();
    });

    jestIt('renders safely when there is no user', () => {
      mockAuthState = {
        ...mockAuthState,
        user: null,
      };

      const { getByText } = render(React.createElement(TopComponent));

      jestExpect(getByText('Hello,')).toBeTruthy();
    });

    jestIt('shows an exclamation mark when unread messages exceed 99', () => {
      mockNotificationsState = {
        unreadMessages: new Array(120).fill({ id: 'msg' }),
      };

      const { getByText } = render(React.createElement(TopComponent));

      jestExpect(getByText('!')).toBeTruthy();
    });

    jestIt('disables the inbox button when workout mode is active', () => {
      mockAuthState = {
        ...mockAuthState,
        isWorkoutMode: true,
      };

      const { UNSAFE_getAllByType } = render(React.createElement(TopComponent));
      const touchables = UNSAFE_getAllByType(TouchableOpacity);

      jestExpect(touchables[0].props.disabled).toBe(true);
    });
  });

  jestDescribe('StartWorkoutCard', () => {
    jestIt('shows the recommended split data when tracking exists and the user has not trained today', () => {
      const { getByText } = render(React.createElement(StartWorkoutCard, { data: createHomeData() }));

      jestExpect(getByText('Split Push')).toBeTruthy();
      jestExpect(getByText('Upper Body')).toBeTruthy();
      jestExpect(getByText('3 exercises')).toBeTruthy();
      jestExpect(getByText('Slide to start')).toBeTruthy();
    });

    jestIt('shows empty-state guidance when a workout exists but the user has not completed any workout yet', () => {
      mockWorkoutState = {
        ...mockWorkoutState,
        workout: { id: 'workout-1' },
      };

      const { getByText, queryByText } = render(
        React.createElement(StartWorkoutCard, {
          data: createHomeData({
            hasAssignedWorkout: true,
            hasTracking: false,
            totalWorkoutNumber: 0,
            mostFrequentSplit: null,
          }),
        }),
      );

      jestExpect(getByText('No history yet')).toBeTruthy();
      jestExpect(getByText('Create a plan and finish your first workout')).toBeTruthy();
      jestExpect(queryByText('Slide to start')).toBeNull();
    });

    jestIt('shows the already trained state instead of the slider when the user trained today', () => {
      mockAnalysisState = {
        ...mockAnalysisState,
        hasTrainedToday: true,
      };

      const { getByText, queryByText } = render(React.createElement(StartWorkoutCard, { data: createHomeData() }));

      jestExpect(getByText('Already trained today')).toBeTruthy();
      jestExpect(queryByText('Slide to start')).toBeNull();
    });

    jestIt('shows the empty state when there is no tracking data', () => {
      const { getByText } = render(
        React.createElement(StartWorkoutCard, {
          data: createHomeData({
            hasTracking: false,
            totalWorkoutNumber: 0,
            mostFrequentSplit: null,
          }),
        }),
      );

      jestExpect(getByText('No history yet')).toBeTruthy();
      jestExpect(getByText('Create a plan and finish your first workout')).toBeTruthy();
    });

    jestIt('shows the empty state when the most frequent split is missing from workout splits', () => {
      mockWorkoutState = {
        ...mockWorkoutState,
        workoutSplits: [{ id: 2, name: 'Legs', muscleGroup: 'Legs' }],
      };

      const { getByText } = render(React.createElement(StartWorkoutCard, { data: createHomeData() }));

      jestExpect(getByText('No history yet')).toBeTruthy();
    });
  });

  jestDescribe('PRCard', () => {
    jestIt('renders personal record details when tracking exists', () => {
      const { getByText } = render(
        React.createElement(PRCard, { hasAssignedWorkout: true, PR: createPR(), hasTracking: true }),
      );

      jestExpect(getByText('Bench Press')).toBeTruthy();
      jestExpect(getByText('Mar 20, 2026')).toBeTruthy();
      jestExpect(getByText('100 kg')).toBeTruthy();
      jestExpect(getByText('8 reps')).toBeTruthy();
    });

    jestIt('renders fallback content when tracking does not exist', () => {
      const { getAllByText } = render(
        React.createElement(PRCard, { hasAssignedWorkout: false, PR: null, hasTracking: false }),
      );

      jestExpect(getAllByText('No data yet').length).toBeGreaterThanOrEqual(4);
    });
  });

  jestDescribe('QuickActions', () => {
    jestIt('shows create workout copy when no workout is assigned', () => {
      const { getByText } = render(React.createElement(QuickActions, { hasAssignedWorkout: false }));

      jestExpect(getByText('Create your workout')).toBeTruthy();
      jestExpect(getByText('Build a new plan')).toBeTruthy();
    });

    jestIt('shows edit workout copy when a workout is assigned', () => {
      const { getByText } = render(React.createElement(QuickActions, { hasAssignedWorkout: true }));

      jestExpect(getByText('Edit your workout')).toBeTruthy();
      jestExpect(getByText('Adjust exercises & sets')).toBeTruthy();
    });

    jestIt('navigates to the quick action destinations', () => {
      const { getByText } = render(React.createElement(QuickActions, { hasAssignedWorkout: true }));

      fireEvent.press(getByText('Check out your analytics'));
      fireEvent.press(getByText('Edit your workout'));
      fireEvent.press(getByText('History'));

      jestExpect(mockNavigate).toHaveBeenNthCalledWith(1, 'Analytics');
      jestExpect(mockNavigate).toHaveBeenNthCalledWith(2, 'CreateWorkout');
      jestExpect(mockNavigate).toHaveBeenNthCalledWith(3, 'Statistics');
    });
  });

  jestDescribe('SlideToStart', () => {
    jestIt('renders the slide hint text', () => {
      const { getByText } = render(React.createElement(SlideToStart, { onUnlock: jestObject.fn() }));

      jestExpect(getByText('Slide to start')).toBeTruthy();
    });
  });
});
