import React from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ImagePickerComponent from "../components/ProfileComponents/ImagePickerComponent";
import { useAuth } from "../context/AuthContext";
import useProfilePageLogic from "../hooks/logic/useProfilePageLogic";

const { width, height } = Dimensions.get("window");

function Profile({ navigation }) {
  const { user } = useAuth();
  const { data, mediaLoading, setMediaLoading } = useProfilePageLogic();

  return (
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
          setMediaLoading={setMediaLoading}
        ></ImagePickerComponent>
      </View>
      <View
        style={{
          flex: 3,
          width: "90%",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: height * 0.02,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            marginTop: height * 0.02,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: RFValue(25),
              color: "black",
            }}
          >
            {data.fullname}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: RFValue(15),
              color: "rgb(128, 128, 128)",
            }}
          >
            {data.email}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2979FF",
            borderRadius: height * 0.02,
            width: "60%",
            height: height * 0.05,
            gap: width * 0.03,
          }}
          onPress={() => {
            Alert.alert("Coming soon!");
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: RFValue(12),
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Edit profile
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 4,
          alignSelf: "center",
          width: "80%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            width: "100%",
            height: "40%",
            borderRadius: height * 0.04,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: 5,
              gap: height * 0.01,
            }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
            >
              Workouts
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(20),
                color: "rgb(128, 128, 128)",
              }}
            >
              {data.workoutCount}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: 5,
              borderLeftWidth: 1,
              borderLeftColor: "rgba(233, 233, 233, 0.54)",
              gap: height * 0.01,
            }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
            >
              Online since
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(18),
                color: "rgb(128, 128, 128)",
              }}
            >
              {data.daysOnline.toString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Profile;
