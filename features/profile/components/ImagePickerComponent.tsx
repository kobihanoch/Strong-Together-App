/* eslint-disable @typescript-eslint/no-require-imports */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import api from '../../../infrastructure/api/api-config/api';
import { colors } from '../../../shared/constants/colors';
import useMediaUploads from '../../../screens/profile/hooks/use-media-uploads.hook';
import { useUser } from '../../user/hooks/use-user.hook';

const { width, height } = Dimensions.get('window');

type ImagePickerComponentProps = {
  openActionSheet: () => void;
  closeActionSheet: () => void;
  triggerImgPicker: boolean;
  triggerRemoveImg: boolean;
  setTriggerImgPicker: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerRemoveImg: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: any;
};

function ImagePickerComponent({
  openActionSheet,
  closeActionSheet,
  triggerImgPicker,
  setTriggerImgPicker,
  triggerRemoveImg,
  setTriggerRemoveImg,
  style,
}: ImagePickerComponentProps) {
  const {
    data: user,
    actions: { refetch },
  } = useUser();
  const { uploadToStorageAndReturnPath, loading: mediaLoading } = useMediaUploads();

  const profileimagePath = user?.profilePicPath;

  const pickAndUploadImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      const file = {
        uri: asset.uri,
        name: `${user!.id}.jpg`,
        type: 'image/jpeg',
      };

      await uploadToStorageAndReturnPath(file);
      await refetch();
    }
  };

  const deleteProfilePicture = async () => {
    await api.delete(`/api/users/me/profile-picture`, {
      data: { path: profileimagePath },
    });

    await refetch();
  };

  useEffect(() => {
    closeActionSheet();
    if (triggerImgPicker) pickAndUploadImage();
    setTriggerImgPicker(false);
  }, [triggerImgPicker]);

  useEffect(() => {
    closeActionSheet();
    if (triggerRemoveImg) deleteProfilePicture();
    setTriggerRemoveImg(false);
  }, [triggerRemoveImg]);

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'column',
        gap: height * 0.02,
      }}
    >
      <TouchableOpacity onPress={openActionSheet}>
        {mediaLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={
              profileimagePath
                ? {
                    uri:
                      process.env.EXPO_PUBLIC_ENVIRONMENT === 'production'
                        ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profileimagePath}`
                        : `${process.env.EXPO_PUBLIC_DEV_IMAGE_BUCKET}/${profileimagePath}`,
                  }
                : user?.gender == 'Male'
                  ? require('../../../assets/man.png')
                  : require('../../../assets/woman.png')
            }
            cachePolicy={'disk'}
            style={[styles.image, style]}
          />
        )}
      </TouchableOpacity>

      <View style={styles.cameraIconContainer}>
        <MaterialCommunityIcons name={'camera-outline'} color={colors.textSecondary} size={RFValue(12)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: height * 0.7,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#e6e6e6ff',
    padding: 8,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
});

export default ImagePickerComponent;
