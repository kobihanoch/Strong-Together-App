import React from "react";
import { render } from "@testing-library/react-native";
import LastWorkoutData from "../LastWorkoutData";

describe("check LastWorkoutData", () => {
  test("renders empty state when no data provided", () => {
    const { getByText } = render(<LastWorkoutData />);

    expect(getByText("No previous data found")).toBeTruthy();
    expect(
      getByText(
        "Once you complete a set for this exercise, it will appear here."
      )
    ).toBeTruthy();
  });

  test("renders exercise name and date when data is provided", () => {
    const mockData = {
      lastWorkoutData: {
        exercise: "Bench Press",
        workoutdate: "2025-10-29T10:00:00.000Z",
        weight: [80],
        reps: [10],
        notes: "Felt good",
      },
      setIndex: 0,
    };

    const { getByText } = render(
      <LastWorkoutData lastWorkoutDataForModal={mockData} />
    );

    // exercise name
    expect(getByText("Bench Press")).toBeTruthy();

    // notes label
    expect(getByText("Notes")).toBeTruthy();

    // note text
    expect(getByText("Felt good")).toBeTruthy();
  });

  test("renders correct weight and reps based on setIndex", () => {
    const mockData = {
      lastWorkoutData: {
        exercise: "Squat",
        workoutdate: "2025-10-29T10:00:00.000Z",
        weight: [100, 105, 110],
        reps: [8, 6, 4],
        notes: "Heavy day",
      },
      setIndex: 1,
    };

    const { getByText } = render(
      <LastWorkoutData lastWorkoutDataForModal={mockData} />
    );

    // English-only comments: Weight card
    expect(getByText("105 kg")).toBeTruthy();

    // English-only comments: Reps card
    expect(getByText("6")).toBeTruthy();
  });

  test("renders 'Not recorded' when value is null", () => {
    const mockData = {
      lastWorkoutData: {
        exercise: "Deadlift",
        workoutdate: "2025-10-29T10:00:00.000Z",
        weight: [null],
        reps: [null],
        notes: null,
      },
      setIndex: 0,
    };

    const { getByText } = render(
      <LastWorkoutData lastWorkoutDataForModal={mockData} />
    );

    expect(getByText("Not recorded")).toBeTruthy(); // for weight
    // notes: your component displays "Not recorded" because displayValue(...) wraps it
    expect(getByText("Not recorded")).toBeTruthy();
  });

  test("renders empty state when lastWorkoutDataForModal is an empty object", () => {
    const { getByText } = render(
      <LastWorkoutData lastWorkoutDataForModal={{}} />
    );

    expect(getByText("No previous data found")).toBeTruthy();
  });

  test("falls back to 'Not recorded' when setIndex is out of range", () => {
    const mockData = {
      lastWorkoutData: {
        exercise: "Shoulder Press",
        workoutdate: "2025-10-29T10:00:00.000Z",
        weight: [30], // only one set
        reps: [12], // only one set
        notes: "ok",
      },
      setIndex: 2, // out of range
    };

    const { getByText } = render(
      <LastWorkoutData lastWorkoutDataForModal={mockData} />
    );

    expect(getByText("Not recorded")).toBeTruthy();
  });

  test("renders empty notes string as empty (current behavior)", () => {
    const mockData = {
      lastWorkoutData: {
        exercise: "Lat Pulldown",
        workoutdate: "2025-10-29T10:00:00.000Z",
        weight: [50],
        reps: [10],
        notes: "", // empty string
      },
      setIndex: 0,
    };

    const { getByText } = render(
      <LastWorkoutData lastWorkoutDataForModal={mockData} />
    );

    // notes label must exist
    expect(getByText("Notes")).toBeTruthy();
    // and the box should render (we can't easily check empty text, but we can check it does NOT crash)
  });
});
