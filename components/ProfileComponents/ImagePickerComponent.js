import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useMediaUploads from "../../hooks/useMediaUploads";
import supabase from "../../src/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

function ImagePickerComponent({ user, setMediaLoading }) {
  const { setUser } = useAuth();
  const { uploadToStorageAndReturnPath, loading: mediaLoading } =
    useMediaUploads();

  const [profileImageUrl, setProfileImageUrl] = useState(
    user?.profile_image_url
  );

  useEffect(() => {
    if (setMediaLoading) {
      setMediaLoading(mediaLoading);
    }
  }, [mediaLoading]);

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

        const { path } = await uploadToStorageAndReturnPath(file);

        // Update in auth context
        setUser((prev) => ({
          ...prev,
          profile_image_url: path,
        }));

        setProfileImageUrl(path);
      }
    } catch (err) {
      console.log("Error handling profile image upload:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  const deleteProfilePicture = async () => {
    /*try {
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
    }*/
  };

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "column",
        gap: height * 0.02,
      }}
    >
      {profileImageUrl ? (
        <TouchableOpacity
          onPress={deleteProfilePicture}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Remove Picture</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity onPress={pickAndUploadImage}>
        {mediaLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={
              profileImageUrl
                ? {
                    uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profileImageUrl}`,
                  }
                : user?.gender == "Male"
                ? require("../../assets/man.png")
                : require("../../assets/woman.png")
            }
            style={styles.image}
          />
        )}
      </TouchableOpacity>
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
