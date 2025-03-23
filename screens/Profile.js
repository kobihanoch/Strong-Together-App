import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { useUserWorkout } from "../hooks/useUserWorkout";
import useMediaUploads from "../hooks/useMediaUploads";
import LoadingPage from "../components/LoadingPage";
import useUserData from "../hooks/useUserData";

const { width, height } = Dimensions.get("window");

function Profile({ navigation }) {
  const { user, updateProfilePic, profilePicTrigger } = useAuth();
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
    console.log("Profile pic: " + profileImageUrl);
  }, [user]);

  const pickAndUploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const file = {
          uri: asset.uri,
          name: `${user.id}.jpg`,
          type: "image/jpeg",
        };

        console.log("Prepared file:", JSON.stringify(file, null, 2));

        const blob = await (await fetch(file.uri)).blob();
        console.log("Blob size:", blob.size);

        await uploadToStorage(file.name, file);

        const publicUrl = await fetchPublicUrl(file.name);

        setProfileImageUrl(publicUrl);

        await updateProfilePictureURLForUser(user.id, publicUrl);
        updateProfilePic;
      }
    } catch (err) {
      console.log("Error handling profile image upload:", err);
    }
  };

  return mediaLoading ? (
    <LoadingPage message="Loading user data..." />
  ) : (
    <View
      style={{ flex: 1, alignItems: "center", paddingVertical: height * 0.02 }}
    >
      <TouchableOpacity onPress={pickAndUploadImage}>
        {mediaLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require("../assets/profile.png")
            }
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 10,
            }}
          />
        )}
        <Text style={{ color: "blue" }}>Tap to change profile picture</Text>
      </TouchableOpacity>

      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{user?.username}</Text>
    </View>
  );
}

export default Profile;
