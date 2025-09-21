import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ImagePickerComponent from "../components/ProfileComponents/ImagePickerComponent";
import { useAuth } from "../context/AuthContext";
import useProfilePageLogic from "../hooks/logic/useProfilePageLogic";
import Column from "../components/Column";
import { colors } from "../constants/colors";
import Row from "../components/Row";
import SlidingBottomModal from "../components/SlidingBottomModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Profile = () => {
  const { data } = useProfilePageLogic();
  const { username = null, email = null, fullname = null } = data || {};

  const actionSheetRef = useRef(null);
  const openActionSheet = () => {
    actionSheetRef?.current?.open(0);
  };
  const closeActionSheet = () => {
    actionSheetRef?.current?.close();
  };
  const [triggerImgPicker, setTriggerImgPicker] = useState(false);
  const [triggerRemoveImg, setTriggerRemoveImg] = useState(false);

  return (
    <Column style={styles.container}>
      <Column style={styles.topSectionContainer}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Column style={{ gap: 7 }}>
            <Text style={styles.header}>Profile</Text>
            <Row style={{ width: "100%" }}>
              <Text style={styles.semiHeader}>
                Manage your account information
              </Text>
              <TouchableOpacity style={styles.editProfileBtnContainer}>
                <Row style={{ gap: 5 }}>
                  <MaterialCommunityIcons
                    name={"pencil"}
                    color={"black"}
                    size={RFValue(10)}
                  />
                  <Text style={styles.editProfileBtnText}>Edit profile</Text>
                </Row>
              </TouchableOpacity>
            </Row>
          </Column>
        </Row>
      </Column>

      <Column style={styles.infoContainer}>
        <Row style={{ gap: 15, alignItems: "flex-start", width: "100%" }}>
          <ImagePickerComponent
            style={{ height: height * 0.1, aspectRatio: 1 }}
            openActionSheet={openActionSheet}
            closeActionSheet={closeActionSheet}
            triggerImgPicker={triggerImgPicker}
            triggerRemoveImg={triggerRemoveImg}
            setTriggerImgPicker={setTriggerImgPicker}
            setTriggerRemoveImg={setTriggerRemoveImg}
          />
          <Column style={{ marginTop: 15, gap: 5 }}>
            <Text style={styles.name}>{data?.fullname}</Text>
            <Text style={styles.username}>@{data?.username}</Text>
          </Column>
        </Row>
        <Column style={{ marginTop: 50, width: "100%", gap: 10 }}>
          <Row style={{ gap: 5 }}>
            <MaterialCommunityIcons
              name={"account"}
              color={"black"}
              size={RFValue(13)}
            />
            <Text style={styles.contactHeader}>Contact Information</Text>
          </Row>
          <Row style={[styles.contactCard, { marginTop: 10 }]}>
            <MaterialCommunityIcons
              name={"email-outline"}
              color={"black"}
              size={RFValue(15)}
            />
            <Column>
              <Text style={styles.contactCardHeader}>Email</Text>
              <Text style={styles.contactCardData}>{data?.email}</Text>
            </Column>
          </Row>
          <Row style={styles.contactCard}>
            <MaterialCommunityIcons
              name={"calendar-outline"}
              color={"black"}
              size={RFValue(15)}
            />
            <Column>
              <Text style={styles.contactCardHeader}>Online Since</Text>
              <Text style={styles.contactCardData}>{data?.daysOnline}</Text>
            </Column>
          </Row>
        </Column>
      </Column>

      <Row
        style={[
          styles.contactCard,
          { marginTop: "auto", marginHorizontal: 20 },
        ]}
      >
        <MaterialCommunityIcons
          name={"delete"}
          color={colors.error}
          size={RFValue(15)}
        />
        <Column>
          <Text style={styles.dangerZoneHeader}>Danger Zone</Text>
          <Text style={styles.dangerZoneSemiHeader}>Delete you account</Text>
        </Column>
        <TouchableOpacity style={styles.delBtnContainer}>
          <Text style={styles.delBtnText}>Delete</Text>
        </TouchableOpacity>
      </Row>

      {/* Action sheet for profile pic */}
      <SlidingBottomModal
        ref={actionSheetRef}
        snapPoints={["25%", "25%", "25%"]}
        flatListUsage={false}
        title={null}
      >
        <Column style={{ gap: 20, paddingHorizontal: 20, marginTop: 10 }}>
          <TouchableOpacity
            style={styles.sheetBtn}
            onPress={() => setTriggerImgPicker(true)}
          >
            <MaterialCommunityIcons
              name={"camera"}
              size={RFValue(20)}
              color={"black"}
            />
            <Text style={styles.sheetBtnText}>Choose image from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sheetBtn}
            onPress={() => setTriggerRemoveImg(true)}
          >
            <MaterialCommunityIcons
              name={"delete"}
              size={RFValue(20)}
              color={"black"}
            />
            <Text style={styles.sheetBtnText}>Remove image</Text>
          </TouchableOpacity>
        </Column>
      </SlidingBottomModal>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  topSectionContainer: {
    backgroundColor: colors.lightCardBg,
    height: height * 0.2,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(20),
  },
  semiHeader: {
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    fontSize: RFValue(12),
  },
  sheetBtn: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
    borderRadius: 16,
    borderColor: "#e4e4e4ff",
    borderWidth: 1,
  },
  sheetBtnText: {
    fontSize: RFValue(15),
    fontFamily: "Inter_400Regular",
  },
  infoContainer: {
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(17),
    color: "black",
  },
  username: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  editProfileBtnContainer: {
    marginLeft: "auto",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  editProfileBtnText: {
    fontFamily: "Inter_500Medium",
    color: "black",
    fontSize: RFValue(10),
  },
  contactHeader: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(13),
  },
  contactCard: {
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 16,
    gap: 15,
  },
  contactCardHeader: {
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    fontSize: RFValue(12),
  },
  contactCardData: {
    fontFamily: "Inter_500Medium",
    color: "black",
    fontSize: RFValue(14),
  },
  contactCardHeader: {
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    fontSize: RFValue(12),
  },
  dangerZoneHeader: {
    fontFamily: "Inter_600SemiBold",
    color: colors.error,
    fontSize: RFValue(14),
  },
  dangerZoneSemiHeader: {
    fontFamily: "Inter_400Regular",
    color: colors.error,
    fontSize: RFValue(12),
  },
  delBtnContainer: {
    backgroundColor: colors.error,
    padding: 15,
    borderRadius: 16,
    marginLeft: "auto",
  },
  delBtnText: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(12),
  },
});
/*<View
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: height * 0.07,
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
    </View>*/

export default Profile;
