import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "../components/LoadingPage";
import ImagePickerComponent from "../components/ProfileComponents/ImagePickerComponent";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

function Profile({ navigation }) {
  const { user, updateProfilePic } = useAuth();
  const [mediaLoading, setMediaLoading] = useState(false);

  return mediaLoading ? (
    <LoadingPage message="Loading user data..." />
  ) : (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: height * 0.02,
      }}
    >
      <View
        style={{
          flex: 3,
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: height * 0.01,
        }}
      >
        <ImagePickerComponent
          user={user}
          updateProfilePic={updateProfilePic}
          setMediaLoading={setMediaLoading}
        ></ImagePickerComponent>
        <Text style={{ fontFamily: "PoppinsBold", fontSize: RFValue(17) }}>
          {user?.username}
        </Text>
      </View>
      <View style={{ flex: 7 }}></View>
    </View>
  );
}

export default Profile;
