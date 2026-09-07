/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';

const mockRequestMediaLibraryPermissionsAsync: any = jestObject.fn();
const mockLaunchImageLibraryAsync: any = jestObject.fn();
const mockApiDelete: any = jestObject.fn();
const mockExpoImage = jestObject.fn((_: any) => null);

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('expo-image', () => ({
  Image: (props: any) => mockExpoImage(props),
}));

jestObject.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: () => mockRequestMediaLibraryPermissionsAsync(),
  launchImageLibraryAsync: () => mockLaunchImageLibraryAsync(),
  MediaTypeOptions: { Images: 'Images' },
}));

jestObject.mock('../../../../infrastructure/api/api-config/api', () => ({
  __esModule: true,
  default: { delete: (...args: any[]) => mockApiDelete(...args) },
}));

jestObject.mock('../../../../shared/providers/AppThemeProvider', () => ({
  useAppTheme: () => ({
    colors: { primary: '#2563EB', canvas: '#FFFFFF', white: '#FFFFFF' },
  }),
}));

import ImagePickerComponent from '../ImagePickerComponent';

const createProps = (overrides: Partial<React.ComponentProps<typeof ImagePickerComponent>> = {}) => ({
  openActionSheet: jestObject.fn(),
  closeActionSheet: jestObject.fn(),
  triggerImgPicker: false,
  triggerRemoveImg: false,
  userId: 'user-1',
  gender: 'Male',
  profilePicPath: null,
  isUploadingProfilePicture: false,
  uploadProfilePicture: jestObject.fn(async () => undefined),
  refreshUser: jestObject.fn(async () => undefined),
  setTriggerImgPicker: jestObject.fn(),
  setTriggerRemoveImg: jestObject.fn(),
  style: { width: 40, height: 40 },
  ...overrides,
});

jestDescribe('ImagePickerComponent', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: [] });
    mockApiDelete.mockResolvedValue(undefined);
  });

  jestIt('resets the image picker trigger and does not upload when the picker is canceled', async () => {
    const props = createProps({ triggerImgPicker: true });
    render(React.createElement(ImagePickerComponent, props));

    await waitFor(() => jestExpect(mockRequestMediaLibraryPermissionsAsync).toHaveBeenCalledTimes(1));
    jestExpect(mockLaunchImageLibraryAsync).toHaveBeenCalledTimes(1);
    jestExpect(props.uploadProfilePicture).not.toHaveBeenCalled();
    jestExpect(props.closeActionSheet).toHaveBeenCalled();
    jestExpect(props.setTriggerImgPicker).toHaveBeenCalledWith(false);
  });

  jestIt('uploads through the supplied user action without explicitly refetching', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///picked.jpg' }],
    });
    const props = createProps({ triggerImgPicker: true });

    render(React.createElement(ImagePickerComponent, props));

    await waitFor(() => {
      jestExpect(props.uploadProfilePicture).toHaveBeenCalledWith({
        uri: 'file:///picked.jpg',
        name: 'user-1.jpg',
        type: 'image/jpeg',
      });
    });
    jestExpect(props.refreshUser).not.toHaveBeenCalled();
  });

  jestIt('deletes the current profile image and refreshes the user', async () => {
    const props = createProps({
      triggerRemoveImg: true,
      profilePicPath: 'avatars/user-1.jpg',
    });

    render(React.createElement(ImagePickerComponent, props));

    await waitFor(() => {
      jestExpect(mockApiDelete).toHaveBeenCalledWith('/api/users/me/profile-picture', {
        data: { path: 'avatars/user-1.jpg' },
      });
    });
    jestExpect(props.refreshUser).toHaveBeenCalled();
    jestExpect(props.setTriggerRemoveImg).toHaveBeenCalledWith(false);
  });
});
