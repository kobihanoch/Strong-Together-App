// Purpose: Global Jest setup for React Native + Expo projects.
// - Extends jest-native matchers.
// - Silences noisy console logs in tests.
// - Mocks problematic native helpers.
//
// IMPORTANT: add this file path to "jest.setupFiles" in package.json.

import "@testing-library/jest-native/extend-expect";

// Silence console.log during tests (keeps output readable)
jest.spyOn(console, "log").mockImplementation(() => {});

jest.mock("react-native-responsive-fontsize", () => ({
  RFValue: (v) => v,
}));
