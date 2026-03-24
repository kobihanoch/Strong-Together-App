/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

const mockClose = jest.fn();
const mockShowNotification = jest.fn();

jest.mock('@expo/vector-icons', () => {
  const ReactLocal = require('react');
  const { Text } = require('react-native');
  return {
    FontAwesome5: ({ name }: { name: string }) => ReactLocal.createElement(Text, null, name),
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const ReactLocal = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => ReactLocal.createElement(Text, null, name);
});

jest.mock('react-native-notifier', () => ({
  Notifier: {
    showNotification: (...args: any[]) => mockShowNotification(...args),
  },
  NotifierComponents: {
    Alert: 'Alert',
  },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const ReactLocal = require('react');
  const { FlatList, View } = require('react-native');
  return {
    BottomSheetFlatList: ({ data, renderItem, keyExtractor, ...rest }: any) =>
      ReactLocal.createElement(FlatList, {
        data,
        renderItem,
        keyExtractor,
        ...rest,
      }),
    __esModule: true,
    default: ReactLocal.forwardRef(({ children }: any, ref: any) => {
      ReactLocal.useImperativeHandle(ref, () => ({
        snapToIndex: jest.fn(),
        close: jest.fn(),
      }));
      return ReactLocal.createElement(View, null, children);
    }),
  };
});

jest.mock('../../SlidingBottomModal', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ReactLocal.forwardRef(({ children }: any, ref: any) => {
    ReactLocal.useImperativeHandle(ref, () => ({
      open: jest.fn(),
      close: mockClose,
      snapToIndex: jest.fn(),
    }));
    return ReactLocal.createElement(View, null, children);
  });
});

jest.mock('../../Column', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => ReactLocal.createElement(View, props, children);
});

jest.mock('../../Row', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => ReactLocal.createElement(View, props, children);
});

import ExercisePickerModal from '../ExercisePickerModal';

const createControls = () => ({
  addExercise: jest.fn(),
  addSplit: jest.fn(),
  updateSets: jest.fn(),
  removeExercise: jest.fn(),
  removeSplit: jest.fn(),
  onDragEnd: jest.fn(),
});

const createAllExercises = () => [
  { id: 1, name: 'Bench Press', specificTargetMuscle: 'Upper Chest', targetmuscle: 'Chest' },
  { id: 2, name: 'Incline Press', specificTargetMuscle: 'Upper Chest', targetmuscle: 'Chest' },
  { id: 3, name: 'Barbell Row', specificTargetMuscle: 'Lats', targetmuscle: 'Back' },
];

const createProps = (overrides: Partial<React.ComponentProps<typeof ExercisePickerModal>> = {}) => ({
  selectedSplit: 'A' as const,
  controls: createControls(),
  availableExercises: {
    Chest: [
      { id: 1, name: 'Bench Press', specificTargetMuscle: 'Upper Chest' },
      { id: 2, name: 'Incline Press', specificTargetMuscle: 'Upper Chest' },
    ],
    Back: [{ id: 3, name: 'Barbell Row', specificTargetMuscle: 'Lats' }],
  },
  allExercises: createAllExercises(),
  muscles: ['All', 'Chest', 'Back'],
  exForSplit: [],
  ...overrides,
});

describe('ExercisePickerModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the default library state with all exercises visible', () => {
    const props = createProps();

    const { getByText } = render(<ExercisePickerModal ref={React.createRef()} {...props} />);

    expect(getByText('Add Exercise')).toBeTruthy();
    expect(getByText('Choose from our exercise library')).toBeTruthy();
    expect(getByText('Bench Press')).toBeTruthy();
    expect(getByText('Incline Press')).toBeTruthy();
    expect(getByText('Barbell Row')).toBeTruthy();
  });

  it('shows an empty-library message when there are no exercises at all', () => {
    const props = createProps({
      availableExercises: {},
      allExercises: [],
      muscles: ['All'],
    });

    const { getByText, queryByText } = render(<ExercisePickerModal ref={React.createRef()} {...props} />);

    expect(getByText('No exercises available.')).toBeTruthy();
    expect(queryByText('Bench Press')).toBeNull();
  });

  it('filters the exercise list by search query', async () => {
    const props = createProps();

    const { getByPlaceholderText, getByText, queryByText } = render(
      <ExercisePickerModal ref={React.createRef()} {...props} />,
    );

    fireEvent.changeText(getByPlaceholderText('Search Exercises...'), 'incline');

    await waitFor(() => {
      expect(getByText('Incline Press')).toBeTruthy();
      expect(queryByText('Bench Press')).toBeNull();
      expect(queryByText('Barbell Row')).toBeNull();
    });
  });

  it('shows a no-results message when the search query matches nothing', async () => {
    const props = createProps();

    const { getByPlaceholderText, getByText, queryByText } = render(
      <ExercisePickerModal ref={React.createRef()} {...props} />,
    );

    fireEvent.changeText(getByPlaceholderText('Search Exercises...'), 'asdfg');

    await waitFor(() => {
      expect(getByText('No exercises found.')).toBeTruthy();
      expect(queryByText('Bench Press')).toBeNull();
      expect(queryByText('Barbell Row')).toBeNull();
    });
  });

  it('switches to a muscle-specific tab and shows only that muscle group', async () => {
    const props = createProps();

    const { getByText, queryByText } = render(<ExercisePickerModal ref={React.createRef()} {...props} />);

    fireEvent.press(getByText('Back'));

    await waitFor(() => {
      expect(getByText('Barbell Row')).toBeTruthy();
      expect(queryByText('Bench Press')).toBeNull();
      expect(queryByText('Incline Press')).toBeNull();
    });
  });

  it('shows a duplicate notification and does not add the exercise again', async () => {
    const props = createProps({
      exForSplit: [{ id: 1, name: 'Bench Press', order_index: 0, sets: [10, 10, 10] }],
    });

    const { getByText } = render(<ExercisePickerModal ref={React.createRef()} {...props} />);

    fireEvent.press(getByText('Bench Press'));

    await waitFor(() => {
      expect(props.controls.addExercise).not.toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Exercise already added',
          description: '"Bench Press" is already added',
        }),
      );
    });
  });

  it('shows a max-exercises notification when the split already contains 10 exercises', async () => {
    const props = createProps({
      exForSplit: Array.from({ length: 10 }, (_, index) => ({
        id: 100 + index,
        name: `Exercise ${index + 1}`,
        order_index: index,
        sets: [10, 10, 10],
      })),
    });

    const { getByText } = render(<ExercisePickerModal ref={React.createRef()} {...props} />);

    fireEvent.press(getByText('Bench Press'));

    await waitFor(() => {
      expect(props.controls.addExercise).not.toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Can't add exericse",
          description: 'Max exercises per split is 10',
        }),
      );
    });
  });

  it('adds a new exercise, closes the modal, and shows a success notification', async () => {
    const ref = React.createRef<any>();
    const props = createProps();

    const { getByText } = render(<ExercisePickerModal ref={ref} {...props} />);

    fireEvent.press(getByText('Bench Press'));

    await waitFor(() => {
      expect(props.controls.addExercise).toHaveBeenCalledWith({
        id: 1,
        name: 'Bench Press',
        specificTargetMuscle: 'Upper Chest',
        targetmuscle: 'Chest',
      });
      expect(mockClose).toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Exercise Added',
          description: '"Bench Press" added to Split A',
        }),
      );
    });
  });
});
