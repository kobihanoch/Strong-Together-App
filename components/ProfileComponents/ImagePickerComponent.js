import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import useMediaUploads from "../../hooks/useMediaUploads";

const { width, height } = Dimensions.get("window");

function ImagePickerComponent({ user, setMediaLoading }) {
  const { setUser } = useAuth();
  const { uploadToStorageAndReturnPath, loading: mediaLoading } =
    useMediaUploads();

  const [profileimagePath, setProfileimagePath] = useState(
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

        console.log("Older path:", profileimagePath);
        const { path } = await uploadToStorageAndReturnPath(file);

        // Update in auth context
        setUser((prev) => ({
          ...prev,
          profile_image_url: path,
        }));

        setProfileimagePath(path);
        console.log("Newer path:", profileimagePath);
      }
    } catch (err) {
      console.log("Error handling profile image upload:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  const deleteProfilePicture = async () => {
    await api.delete(`/api/users/deleteprofilepic`, {
      data: { path: profileimagePath },
    });
    // Update in auth context
    setUser((prev) => ({
      ...prev,
      profile_image_url: null,
    }));

    setProfileimagePath(null);
  };

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "column",
        gap: height * 0.02,
      }}
    >
      {profileimagePath ? (
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
              profileimagePath
                ? {
                    uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profileimagePath}`,
                  }
                : user?.gender == "Male"
                ? require("../../assets/man.png")
                : require("../../assets/woman.png")
            }
            cachePolicy={"disk"}
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
