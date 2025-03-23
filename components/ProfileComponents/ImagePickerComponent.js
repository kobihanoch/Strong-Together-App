import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useMediaUploads from "../../hooks/useMediaUploads";
import useUserData from "../../hooks/useUserData";
import supabase from "../../src/supabaseClient";

const { width, height } = Dimensions.get("window");

function ImagePickerComponent({ user, updateProfilePic, setMediaLoading }) {
  const {
    uploadToStorage,
    fetchPublicUrl,
    publicPicUrl,
    loading: mediaLoading,
  } = useMediaUploads();

  const { updateProfilePictureURLForUser, loading, error } = useUserData();

  const [profileImageUrl, setProfileImageUrl] = useState(
    user?.profile_image_url
  );

  useEffect(() => {
    if (setMediaLoading) {
      setMediaLoading(mediaLoading || loading);
    }
  }, [mediaLoading, loading]);

  const pickAndUploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];

        const file = {
          uri: asset.uri,
          name: `${user.id}.jpg`,
          type: "image/jpeg",
        };

        await uploadToStorage(file.name, file);

        const publicUrl = await fetchPublicUrl(file.name);
        const fullUrl = `${publicUrl}?t=${Date.now()}`;

        await updateProfilePictureURLForUser(user.id, publicUrl);

        setProfileImageUrl(fullUrl);
        updateProfilePic(fullUrl);
      }
    } catch (err) {
      console.log("Error handling profile image upload:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const fileName = `${user.id}.jpg`;

      await supabase.storage.from("profile_pics").remove([fileName]);

      await updateProfilePictureURLForUser(user.id, "");
      updateProfilePic("");
      setProfileImageUrl("");

      console.log("Profile picture deleted successfully.");
    } catch (err) {
      console.log("Error deleting profile picture:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={pickAndUploadImage}>
        {mediaLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require("../../assets/profile.png")
            }
            style={styles.image}
          />
        )}
      </TouchableOpacity>

      {profileImageUrl ? (
        <TouchableOpacity
          onPress={deleteProfilePicture}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Remove Picture</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: height * 0.7,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ImagePickerComponent;
